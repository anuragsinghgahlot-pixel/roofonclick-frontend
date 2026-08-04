"use client";

import * as React from "react";
import { useForm, UseFormReturn, useWatch, Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { toast } from "sonner";

import { PropertyService, MediaImage, Property } from "@/services/property";

// Zod Schema representing all fields in the multi-step wizard
export const roomConfigurationSchema = z
  .object({
    id: z.string().optional(),
    sharingType: z.string().min(1, "Sharing Type is required"),
    monthlyRent: z.preprocess(
      (val) => (val === "" || val === undefined ? undefined : Number(val)),
      z.number({ message: "Monthly Rent is required" }).min(1, "Monthly Rent must be greater than 0")
    ),
    securityDeposit: z.preprocess(
      (val) => (val === "" || val === undefined ? 0 : Number(val)),
      z.number({ message: "Security Deposit is required" }).min(0, "Security Deposit cannot be negative")
    ),
    totalRooms: z.preprocess(
      (val) => (val === "" || val === undefined ? 1 : Number(val)),
      z.number({ message: "Total Rooms is required" }).min(1, "Total Rooms must be at least 1")
    ),
    availableRooms: z.preprocess(
      (val) => (val === "" || val === undefined ? 1 : Number(val)),
      z.number({ message: "Available Rooms is required" }).min(0, "Available Rooms cannot be negative")
    ),
    gender: z.enum(["Boys", "Girls", "Co-living", "Any"]),
    attachedBathroom: z.boolean(),
    furnished: z.enum(["Fully Furnished", "Semi Furnished", "Unfurnished"]),

    // Legacy fields mapped for backward compatibility
    roomType: z.string().optional(),
    rent: z.number().optional(),
    availability: z.string().optional(),
    mealsIncluded: z.boolean().optional(),
    electricity: z.string().optional(),
  })
  .refine((data) => data.availableRooms <= data.totalRooms, {
    message: "Available Rooms cannot exceed Total Rooms",
    path: ["availableRooms"],
  });

export const propertyWizardSchema = z.object({
  id: z.string().optional(),
  // Step 1: Basic Details
  propertyName: z.string().min(1, "Property Name is required"),
  propertyType: z.enum(["PG", "Hostel", "Co-living", "Apartment"]),
  gender: z.enum(["Boys", "Girls", "Unisex"]),
  description: z.string().max(200, "Description must be 200 characters or less").optional(),

  // Step 2: Location
  city: z.string().min(1, "City is required"),
  area: z.string().min(1, "Area is required"),
  address: z.string().min(1, "Complete Address is required"),
  landmark: z.string().optional(),
  mapsLink: z.string().optional(),

  // Step 3: Rooms & Pricing (Repeatable configurations)
  rooms: z
    .array(roomConfigurationSchema)
    .min(1, "At least one room configuration is required")
    .refine(
      (rooms) => {
        const types = rooms.map((r) => (r.sharingType || r.roomType || "").trim().toLowerCase());
        const uniqueTypes = new Set(types);
        return types.length === uniqueTypes.size;
      },
      {
        message: "Sharing Type cannot be duplicated within the same property",
      }
    ),

  // Step 4: Amenities
  propertyManagementType: z.string().optional(),
  foodType: z.string().optional(),
  amenities: z.array(z.string()).optional(),
  rules: z.object({
    smokingAllowed: z.boolean().optional(),
    drinkingAllowed: z.boolean().optional(),
    visitorsAllowed: z.boolean().optional(),
    petsAllowed: z.boolean().optional(),
    loudMusicAllowed: z.boolean().optional(),
    gateClosingEnabled: z.boolean().optional(),
    gateClosingTime: z.string().optional(),
  }).optional(),
  nearby: z.array(z.string()).optional(),

  // Step 5: Photos & Videos
  images: z.array(z.object({
    id: z.string(),
    url: z.string(),
    name: z.string(),
    isCover: z.boolean(),
  })).min(5, "At least 5 images are required"),
  video: z.object({
    url: z.string(),
    name: z.string(),
    size: z.number().optional(),
  }).nullable().optional(),
});

export type PropertyWizardFormValues = z.infer<typeof propertyWizardSchema>;

interface WizardContextType {
  currentStep: number;
  setStep: (step: number) => void;
  form: UseFormReturn<PropertyWizardFormValues>;
  handleNext: () => Promise<void>;
  handlePrev: () => void;
  handleReset: () => void;
  isStepValid: boolean;
  isStepUnlocked: (step: number) => boolean;
  handlePublish: () => void;
  isEditMode: boolean;
}

const WizardContext = React.createContext<WizardContextType | undefined>(undefined);

export function WizardProvider({ children, editPropertyId }: { children: React.ReactNode; editPropertyId?: string }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Sync currentStep with query param (?step=1)
  const currentStep = React.useMemo(() => {
    const stepVal = searchParams.get("step");
    return stepVal ? Math.min(6, Math.max(1, parseInt(stepVal, 10))) : 1;
  }, [searchParams]);

  const setStep = React.useCallback(
    (step: number) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set("step", step.toString());
      router.push(`${pathname}?${params.toString()}`);
    },
    [pathname, searchParams, router]
  );

  // Initialize React Hook Form
  const form = useForm<PropertyWizardFormValues>({
    resolver: zodResolver(propertyWizardSchema) as Resolver<PropertyWizardFormValues>,
    defaultValues: {
      id: "",
      propertyName: "",
      propertyType: "PG",
      gender: "Boys",
      description: "",
      city: "Indore",
      area: "Vijay Nagar",
      address: "",
      landmark: "",
      mapsLink: "",
      rooms: [
        {
          sharingType: "Single",
          monthlyRent: 8500,
          securityDeposit: 10000,
          totalRooms: 5,
          availableRooms: 3,
          gender: "Boys",
          attachedBathroom: true,
          furnished: "Fully Furnished",
          roomType: "Single Sharing",
          rent: 8500,
          availability: "Available Now",
          mealsIncluded: true,
          electricity: "Included",
        },
      ],
      amenities: [],
      rules: {
        smokingAllowed: false,
        drinkingAllowed: false,
        visitorsAllowed: false,
        petsAllowed: false,
        loudMusicAllowed: false,
        gateClosingEnabled: false,
        gateClosingTime: "22:00",
      },
      nearby: [],
      images: [],
      video: null,
    },
    mode: "onChange",
  });

  // Watch values for autosaving draft locally
  const formValues = useWatch({ control: form.control });
  const [isInitialized, setIsInitialized] = React.useState(false);
  const hydratedIdRef = React.useRef<string | null>(null);

  // Load property details on mount (Edit Mode vs Create Draft Mode)
  React.useEffect(() => {
    if (editPropertyId) {
      // Prevent re-resetting form when navigating steps if already hydrated
      if (hydratedIdRef.current === editPropertyId) return;

      // Edit Mode: Read saved property from PropertyService
      const found = PropertyService.getPropertyById(editPropertyId);
      if (found) {
        const restoredImgs = (found.images || []).map((img: MediaImage, idx: number) => {
          if (!img.url || img.url.startsWith("blob:")) {
            const mockImages = [
              "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=600&q=80",
              "https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&w=600&q=80",
              "https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=600&q=80",
              "https://images.unsplash.com/photo-1540518614846-7eded433c457?auto=format&fit=crop&w=600&q=80",
            ];
            return { ...img, url: mockImages[idx % mockImages.length] };
          }
          return img;
        });

        // Ensure room configurations are mapped properly on hydration
        const normalizedRooms = (found.rooms || found.roomConfigurations || []).map((rm) => ({
          sharingType: rm.sharingType || rm.roomType || "Single",
          monthlyRent: Number(rm.monthlyRent ?? rm.rent ?? 8500),
          securityDeposit: Number(rm.securityDeposit ?? 0),
          totalRooms: Number(rm.totalRooms ?? rm.availableRooms ?? 1),
          availableRooms: Number(rm.availableRooms ?? 1),
          gender: (rm.gender && ["Boys", "Girls", "Co-living", "Any"].includes(rm.gender) ? rm.gender : "Boys") as "Boys" | "Girls" | "Co-living" | "Any",
          attachedBathroom: typeof rm.attachedBathroom === "boolean" ? rm.attachedBathroom : true,
          furnished: (rm.furnished && ["Fully Furnished", "Semi Furnished", "Unfurnished"].includes(rm.furnished) ? rm.furnished : "Fully Furnished") as "Fully Furnished" | "Semi Furnished" | "Unfurnished",
          roomType: rm.roomType || rm.sharingType || "Single Sharing",
          rent: Number(rm.rent ?? rm.monthlyRent ?? 8500),
        }));

        form.reset({
          ...found,
          rooms: normalizedRooms,
          images: restoredImgs,
        });
        hydratedIdRef.current = editPropertyId;
      }
    } else {
      if (hydratedIdRef.current === "draft") return;

      // Create Mode: Read draft from PropertyService
      const draft = PropertyService.getDraft();
      if (draft && draft.formValues) {
        const draftImgs = (draft.formValues.images as MediaImage[] | undefined) || [];
        const restoredImgs = draftImgs.map((img: MediaImage, idx: number) => {
          if (img.url && img.url.startsWith("blob:")) {
            const mockImages = [
              "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=600&q=80",
              "https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&w=600&q=80",
              "https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=600&q=80",
              "https://images.unsplash.com/photo-1540518614846-7eded433c457?auto=format&fit=crop&w=600&q=80",
            ];
            return { ...img, url: mockImages[idx % mockImages.length] };
          }
          return img;
        });
        form.reset({
          ...draft.formValues,
          images: restoredImgs,
        });
        if (draft.currentStep && !searchParams.get("step")) {
          setStep(draft.currentStep);
        }
      }
      hydratedIdRef.current = "draft";
    }
    setIsInitialized(true);
  }, [editPropertyId, form, searchParams, setStep]);

  // Autosave currentStep and formValues via PropertyService (Only for Create mode)
  React.useEffect(() => {
    if (isInitialized && !editPropertyId) {
      const rawImgs = (formValues.images as Partial<MediaImage>[] | undefined) || [];
      const cleanFormValues = {
        ...formValues,
        images: rawImgs.map((img: Partial<MediaImage>) => ({
          ...img,
          url: img.url && img.url.startsWith("blob:") ? "blob:expired" : img.url,
        })),
        video: formValues.video && formValues.video.url && formValues.video.url.startsWith("blob:") 
          ? { ...formValues.video, url: "blob:expired" }
          : formValues.video,
      };
      PropertyService.saveDraft({
        currentStep,
        formValues: cleanFormValues,
      });
    }
  }, [currentStep, formValues, isInitialized, editPropertyId]);

  // Individual step validations
  const step1Valid = React.useMemo(() => {
    return !!formValues.propertyName && formValues.propertyName.trim().length > 0;
  }, [formValues.propertyName]);

  const step2Valid = React.useMemo(() => {
    return (
      !!formValues.address &&
      formValues.address.trim().length > 0 &&
      !!formValues.area &&
      formValues.area.trim().length > 0
    );
  }, [formValues.address, formValues.area]);

  const step3Valid = React.useMemo(() => {
    const rooms = formValues.rooms || [];
    if (rooms.length === 0) return false;

    // Check sharingType uniqueness
    const types = rooms.map((r) => (r.sharingType || r.roomType || "").trim().toLowerCase());
    if (new Set(types).size !== types.length) return false;

    return rooms.every((r) => {
      if (!r) return false;
      const rent = Number(r.monthlyRent ?? r.rent ?? 0);
      const deposit = Number(r.securityDeposit ?? 0);
      const total = Number(r.totalRooms ?? 1);
      const avail = Number(r.availableRooms ?? 0);
      const sharing = (r.sharingType || r.roomType || "").trim();

      return (
        sharing.length > 0 &&
        rent > 0 &&
        deposit >= 0 &&
        total >= 1 &&
        avail >= 0 &&
        avail <= total
      );
    });
  }, [formValues.rooms]);

  const step4Valid = true;

  const step5Valid = React.useMemo(() => {
    const imgs = formValues.images || [];
    return imgs.length >= 5;
  }, [formValues.images]);

  // Derived validation status for the active step
  const isStepValid = React.useMemo(() => {
    if (currentStep === 1) return step1Valid;
    if (currentStep === 2) return step2Valid;
    if (currentStep === 3) return step3Valid;
    if (currentStep === 4) return step4Valid;
    if (currentStep === 5) return step5Valid;
    return true; // Step 6 Review is always valid
  }, [currentStep, step1Valid, step2Valid, step3Valid, step4Valid, step5Valid]);

  // Check if a step is unlocked
  const isStepUnlocked = React.useCallback(
    (stepIndex: number) => {
      if (editPropertyId) return true; // In Edit Mode, all steps are unlocked!
      if (stepIndex === 1) return true;
      if (stepIndex === 2) return step1Valid;
      if (stepIndex === 3) return step1Valid && step2Valid;
      if (stepIndex === 4) return step1Valid && step2Valid && step3Valid;
      if (stepIndex === 5) return step1Valid && step2Valid && step3Valid && step4Valid;
      if (stepIndex === 6) return step1Valid && step2Valid && step3Valid && step4Valid && step5Valid;
      return false;
    },
    [editPropertyId, step1Valid, step2Valid, step3Valid, step4Valid, step5Valid]
  );

  // Navigation handlers
  const handleNext = React.useCallback(async () => {
    let fieldsToValidate: (keyof PropertyWizardFormValues)[] = [];
    if (currentStep === 1) {
      fieldsToValidate = ["propertyName", "propertyType", "gender", "description"];
    } else if (currentStep === 2) {
      fieldsToValidate = ["city", "area", "address", "landmark", "mapsLink"];
    } else if (currentStep === 3) {
      fieldsToValidate = ["rooms"];
    } else if (currentStep === 4) {
      // Step 4 has no required fields; skip validation to prevent partial rules errors
      fieldsToValidate = [];
    } else if (currentStep === 5) {
      fieldsToValidate = ["images", "video"];
    }

    const isValid = fieldsToValidate.length > 0 
      ? await form.trigger(fieldsToValidate)
      : true;

    if (isValid && currentStep < 6) {
      setStep(currentStep + 1);
    }
  }, [currentStep, form, setStep]);

  const handlePrev = React.useCallback(() => {
    if (currentStep > 1) {
      setStep(currentStep - 1);
    }
  }, [currentStep, setStep]);

  const handleReset = React.useCallback(() => {
    if (confirm("Are you sure you want to clear your listing draft?")) {
      PropertyService.clearDraft();
      form.reset({
        id: "",
        propertyName: "",
        propertyType: "PG",
        gender: "Boys",
        description: "",
        city: "Indore",
        area: "Vijay Nagar",
        address: "",
        landmark: "",
        mapsLink: "",
        amenities: [],
        rules: {
          smokingAllowed: false,
          drinkingAllowed: false,
          visitorsAllowed: false,
          petsAllowed: false,
          loudMusicAllowed: false,
          gateClosingEnabled: false,
          gateClosingTime: "22:00",
        },
        nearby: [],
        images: [],
      });
      setStep(1);
    }
  }, [form, setStep]);

  const handlePublish = React.useCallback(() => {
    const values = form.getValues() as Partial<Property>;
    const propertyId = editPropertyId || values.id || Math.random().toString(36).substring(7);
    
    const payload = {
      ...values,
      id: propertyId,
    };

    if (editPropertyId || (values.id && PropertyService.getPropertyById(values.id))) {
      PropertyService.updateProperty(propertyId, payload);
      toast.success("Your property has been updated successfully.");
    } else {
      PropertyService.createProperty(payload);
      toast.success("Your property has been published successfully.");
    }
    
    PropertyService.clearDraft();
    router.push("/owner/dashboard");
  }, [editPropertyId, form, router]);

  return (
    <WizardContext.Provider
      value={{
        currentStep,
        setStep,
        form,
        handleNext,
        handlePrev,
        handleReset,
        isStepValid,
        isStepUnlocked,
        handlePublish,
        isEditMode: !!editPropertyId,
      }}
    >
      {children}
    </WizardContext.Provider>
  );
}

export function useWizard() {
  const context = React.useContext(WizardContext);
  if (context === undefined) {
    throw new Error("useWizard must be used within a WizardProvider");
  }
  return context;
}
