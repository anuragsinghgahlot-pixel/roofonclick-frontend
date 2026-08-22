"use client";

import * as React from "react";
import { useForm, UseFormReturn, useWatch, Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { toast } from "sonner";

import { PropertyService, MediaImage, Property } from "@/services/property";
import { ListingsAPI } from "@/services/listings/listings.api";

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

export const APARTMENT_TYPES = [
  "Studio Apartment",
  "RK",
  "1 BHK",
  "2 BHK",
  "3 BHK",
  "4+ BHK",
  "Apartment",
];

export function isApartmentType(type?: string): boolean {
  if (!type) return false;
  return APARTMENT_TYPES.includes(type);
}

export function getBedroomsFromPropertyType(type?: string): string {
  if (!type) return "N/A";
  if (type === "Studio Apartment" || type === "Studio") return "Studio";
  if (type === "RK") return "RK";
  if (type === "1 BHK") return "1";
  if (type === "2 BHK") return "2";
  if (type === "3 BHK") return "3";
  if (type === "4+ BHK") return "4+";
  return "N/A";
}

export const propertyWizardSchema = z.object({
  id: z.string().optional(),
  // Step 1: Basic Details
  propertyName: z.string().min(1, "Property Name is required"),
  propertyType: z.enum([
    "PG",
    "Hostel",
    "Co-living",
    "Apartment",
    "Studio Apartment",
    "RK",
    "1 BHK",
    "2 BHK",
    "3 BHK",
    "4+ BHK",
  ]),
  gender: z.enum(["Boys", "Girls", "Unisex"]),
  description: z.string().max(200, "Description must be 200 characters or less").optional(),

  // Step 2: Location
  city: z.string().min(1, "City is required"),
  area: z.string().min(1, "Area is required"),
  address: z.string().min(1, "Complete Address is required"),
  landmark: z.string().optional(),

  // Step 3: Rooms & Pricing (Repeatable configurations for Hostel/PG or single configuration for Apartment)
  rooms: z
    .array(roomConfigurationSchema)
    .min(1, "At least one room configuration is required")
    .optional(),

  // Apartment Specific Details & Pricing
  apartmentDetails: z
    .object({
      bedrooms: z.string().optional(),
      furnished: z.enum(["Fully Furnished", "Semi Furnished", "Unfurnished"]).optional(),
      kitchenType: z.string().optional(),
      bathroomType: z.string().optional(),
      balcony: z.boolean().optional(),
      parking: z.string().optional(),
      floorNumber: z.preprocess((val) => (val === "" || val === undefined ? undefined : Number(val)), z.number().optional()),
      totalFloors: z.preprocess((val) => (val === "" || val === undefined ? undefined : Number(val)), z.number().optional()),
      liftAvailable: z.boolean().optional(),
      powerBackup: z.boolean().optional(),
      security: z.boolean().optional(),
    })
    .optional(),

  apartmentPricing: z
    .object({
      monthlyRent: z.preprocess((val) => (val === "" || val === undefined ? undefined : Number(val)), z.number().optional()),
      securityDeposit: z.preprocess((val) => (val === "" || val === undefined ? 0 : Number(val)), z.number().optional()),
      maintenance: z.preprocess((val) => (val === "" || val === undefined ? 0 : Number(val)), z.number().optional()),
      electricityIncluded: z.boolean().optional(),
      waterIncluded: z.boolean().optional(),
      brokerage: z.string().optional(),
      availabilityDate: z.string().optional(),
    })
    .optional(),

  // Step 4: Amenities
  propertyManagementType: z.string().optional(),
  foodType: z.string().optional(),
  amenities: z.array(z.string()).optional(),
  rules: z
    .object({
      smokingAllowed: z.boolean().optional(),
      drinkingAllowed: z.boolean().optional(),
      visitorsAllowed: z.boolean().optional(),
      petsAllowed: z.boolean().optional(),
      loudMusicAllowed: z.boolean().optional(),
      gateClosingEnabled: z.boolean().optional(),
      gateClosingTime: z.string().optional(),
    })
    .optional(),
  nearby: z.array(z.string()).optional(),

  // Step 5: Photos & Videos
  images: z
    .array(
      z.object({
        id: z.string(),
        url: z.string(),
        key: z.string().optional(),
        name: z.string(),
        size: z.number().optional(),
        isCover: z.boolean(),
        status: z.enum(["uploading", "success", "error"]).optional(),
        errorReason: z.string().optional(),
        rawFile: z.any().optional(),
      })
    )
    .min(5, "At least 5 images are required")
    .max(10, "Maximum 10 images allowed"),
});

export type PropertyWizardFormValues = z.infer<typeof propertyWizardSchema>;

interface WizardContextType {
  currentStep: number;
  setStep: (step: number) => void;
  form: UseFormReturn<PropertyWizardFormValues>;
  handleNext: () => Promise<void>;
  handlePrev: () => void;
  handleReset: () => void;
  handleSaveDraftAndExit: () => void;
  isStepValid: boolean;
  isStepUnlocked: (step: number) => boolean;
  handlePublish: () => void;
  isEditMode: boolean;
  isLoadingProperty: boolean;
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
    },
    mode: "onChange",
  });

  // Watch values for autosaving draft locally
  const formValues = useWatch({ control: form.control });
  const [isInitialized, setIsInitialized] = React.useState(false);
  const [isLoadingProperty, setIsLoadingProperty] = React.useState(!!editPropertyId);
  const hydratedIdRef = React.useRef<string | null>(null);

  // Load property details on mount (Edit Mode vs Create Draft Mode)
  React.useEffect(() => {
    let isMounted = true;

    async function loadPropertyForEdit(id: string) {
      setIsLoadingProperty(true);
      try {
        let found: Property | null = null;
        // 1. Fetch from live backend API first
        try {
          found = await ListingsAPI.getListingById(id);
        } catch (apiErr) {
          console.warn("[WizardContext] Backend fetch failed, falling back to local cache", apiErr);
        }

        // 2. Fallback to local PropertyService if not found or offline
        if (!found) {
          found = PropertyService.getPropertyById(id);
        }

        if (found && isMounted) {
          const restoredImgs = (found.images || []).map((img: any, i: number) => {
            if (!img.url || img.url.startsWith("blob:")) {
              return { ...img, url: "" };
            }
            return {
              id: img.id || img.key || `img-${id}-${i}`,
              url: img.url,
              name: img.name || `Photo ${i + 1}`,
              isCover: img.isCover ?? i === 0,
            };
          });

          // Ensure room configurations are mapped properly on hydration
          const normalizedRooms = (found.rooms || found.roomConfigurations || []).map((rm) => ({
            id: rm.id,
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
            availability: (rm as any).availability || "Available Now",
            mealsIncluded: (rm as any).mealsIncluded ?? true,
            electricity: (rm as any).electricity || "Included",
          }));

          const normalizedRules = {
            smokingAllowed: !!found.rules?.smokingAllowed,
            drinkingAllowed: !!found.rules?.drinkingAllowed,
            visitorsAllowed: found.rules?.visitorsAllowed !== undefined ? !!found.rules.visitorsAllowed : true,
            petsAllowed: !!found.rules?.petsAllowed,
            loudMusicAllowed: !!found.rules?.loudMusicAllowed,
            gateClosingEnabled: !!found.rules?.gateClosingEnabled,
            gateClosingTime: found.rules?.gateClosingTime || "22:00",
          };

          form.reset({
            id: found.id || (found as any)._id || id,
            propertyName: found.propertyName || (found as any).title || "",
            propertyType: (found.propertyType as any) || "Hostel",
            gender: (found.gender as any) || "Boys",
            description: found.description || "",
            city: found.city || (found.address as any)?.city || "Indore",
            area: found.area || (found.address as any)?.area || "",
            address: (typeof found.address === "string" ? found.address : (found.address as any)?.full) || "",
            landmark: found.landmark || (found.address as any)?.landmark || "",
            rooms: normalizedRooms.length > 0 ? normalizedRooms : [
              {
                sharingType: "Single",
                monthlyRent: found.startingRent || 8500,
                securityDeposit: 0,
                totalRooms: 1,
                availableRooms: 1,
                gender: (found.gender as any) || "Boys",
                attachedBathroom: true,
                furnished: "Fully Furnished",
                roomType: "Single Sharing",
                rent: found.startingRent || 8500,
                availability: "Available Now",
                mealsIncluded: true,
                electricity: "Included",
              },
            ],
            apartmentDetails: found.apartmentDetails,
            apartmentPricing: found.apartmentPricing,
            amenities: found.amenities || [],
            rules: normalizedRules,
            nearby: found.nearby || [],
            images: restoredImgs,
          } as any);

          hydratedIdRef.current = id;
        }
      } catch (e) {
        console.error("[WizardContext] Error loading property for editing:", e);
      } finally {
        if (isMounted) {
          setIsLoadingProperty(false);
          setIsInitialized(true);
        }
      }
    }

    if (editPropertyId) {
      if (hydratedIdRef.current !== editPropertyId) {
        loadPropertyForEdit(editPropertyId);
      }
    } else {
      if (hydratedIdRef.current !== "draft") {
        const draft = PropertyService.getDraft();
        if (draft && draft.formValues) {
          const draftImgs = (draft.formValues.images as MediaImage[] | undefined) || [];
          const restoredImgs = draftImgs.map((img: MediaImage) => {
            if (img.url && img.url.startsWith("blob:")) {
              return { ...img, url: "" };
            }
            return img;
          });
          form.reset({
            ...draft.formValues,
            images: restoredImgs,
          } as any);
          if (draft.currentStep && !searchParams.get("step")) {
            setStep(draft.currentStep);
          }
        }
        hydratedIdRef.current = "draft";
      }
      setIsInitialized(true);
      setIsLoadingProperty(false);
    }

    return () => {
      isMounted = false;
    };
  }, [editPropertyId, form, searchParams, setStep]);

  // Autosave currentStep and formValues via PropertyService (Only for Create mode)
  React.useEffect(() => {
    if (isInitialized && !editPropertyId) {
      const rawImgs = (formValues.images as Partial<MediaImage>[] | undefined) || [];
      const cleanFormValues = {
        ...formValues,
        images: rawImgs.map((img) => ({
          id: img.id || "",
          url: img.url || "",
          name: img.name || "",
          size: img.size || 0,
          isCover: !!img.isCover,
          status: img.status || "success",
        })),
      };
      PropertyService.saveDraft({
        currentStep,
        formValues: cleanFormValues as any,
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
    switch (currentStep) {
      case 1:
        return step1Valid;
      case 2:
        return step2Valid;
      case 3:
        return step3Valid;
      case 4:
        return step4Valid;
      case 5:
        return step5Valid;
      case 6:
        return step1Valid && step2Valid && step3Valid && step4Valid && step5Valid;
      default:
        return false;
    }
  }, [currentStep, step1Valid, step2Valid, step3Valid, step4Valid, step5Valid]);

  // Check if a step is unlocked
  const isStepUnlocked = React.useCallback(
    (step: number) => {
      if (editPropertyId) return true; // In edit mode, all steps are unlocked for seamless jumping
      if (step === 1) return true;
      if (step === 2) return step1Valid;
      if (step === 3) return step1Valid && step2Valid;
      if (step === 4) return step1Valid && step2Valid && step3Valid;
      if (step === 5) return step1Valid && step2Valid && step3Valid && step4Valid;
      if (step === 6) return step1Valid && step2Valid && step3Valid && step4Valid && step5Valid;
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
      fieldsToValidate = ["city", "area", "address", "landmark"];
    } else if (currentStep === 3) {
      fieldsToValidate = ["rooms"];
    } else if (currentStep === 4) {
      // Step 4 has no required fields; skip validation to prevent partial rules errors
      fieldsToValidate = [];
    } else if (currentStep === 5) {
      const images = (form.getValues("images") || []) as any[];
      const isUploading = images.some((img) => img.status === "uploading");
      const hasErrors = images.some((img) => img.status === "error");
      const validCount = images.filter((img) => img.status === "success" || (!img.status && img.url)).length;

      if (isUploading) {
        toast.error("Please wait for all property photos to finish uploading to RoofOnClick.");
        return;
      }
      if (hasErrors) {
        toast.error("Please remove or retry failed photos before proceeding.");
        return;
      }
      if (validCount < 5) {
        toast.error(`You have ${validCount} uploaded photos. At least 5 successfully uploaded photos are required.`);
        return;
      }
      if (validCount > 10) {
        toast.error(`Maximum 10 photos allowed. You currently have ${validCount}.`);
        return;
      }
      fieldsToValidate = ["images"];
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

  const handleSaveDraftAndExit = React.useCallback(() => {
    const rawImgs = (form.getValues("images") as Partial<MediaImage>[] | undefined) || [];
    const cleanFormValues = {
      ...form.getValues(),
      images: rawImgs.map((img) => ({
        id: img.id || "",
        url: img.url || "",
        name: img.name || "",
        size: img.size || 0,
        isCover: !!img.isCover,
        status: img.status || "success",
      })),
    };
    PropertyService.saveDraft({
      currentStep,
      formValues: cleanFormValues as any,
    });
    toast.success("Draft saved successfully! You can resume anytime from your dashboard.", {
      duration: 3000,
    });
    router.push("/owner/dashboard");
  }, [currentStep, form, router]);

  const handlePublish = React.useCallback(async () => {
    const values = form.getValues() as Partial<Property>;

    try {
      if (editPropertyId) {
        await ListingsAPI.updateListing(editPropertyId, values);
        toast.success("Your property has been updated successfully.");
      } else {
        await ListingsAPI.createListing(values);
        toast.success("Submitted for Admin Approval! 📋", {
          description: "Your listing has been sent to the RoofOnClick admin team for physical site examination before publishing.",
        });
      }

      PropertyService.clearDraft();
      router.push("/owner/dashboard");
    } catch (err: any) {
      toast.error(err?.message || "Failed to save listing. Please try again.");
    }
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
        handleSaveDraftAndExit,
        isStepValid,
        isStepUnlocked,
        handlePublish,
        isEditMode: !!editPropertyId,
        isLoadingProperty,
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
