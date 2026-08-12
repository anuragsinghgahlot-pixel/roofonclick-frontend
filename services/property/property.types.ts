export interface RoomConfiguration {
  id?: string;
  sharingType: "Single" | "Double" | "Triple" | "Four Sharing" | "Private Suite" | string;
  monthlyRent: number;
  securityDeposit: number;
  totalRooms: number;
  availableRooms: number;
  gender: "Boys" | "Girls" | "Co-living" | "Any" | string;
  attachedBathroom: boolean;
  furnished: "Fully Furnished" | "Semi Furnished" | "Unfurnished" | string;

  // Legacy/backward compatibility properties
  roomType?: string;
  rent?: number;
  availability?: string;
  mealsIncluded?: boolean;
  electricity?: string;
}

export interface HouseRules {
  smokingAllowed?: boolean;
  drinkingAllowed?: boolean;
  visitorsAllowed?: boolean;
  petsAllowed?: boolean;
  loudMusicAllowed?: boolean;
  gateClosingEnabled?: boolean;
  gateClosingTime?: string;
}

export interface MediaImage {
  id: string;
  url: string;
  key?: string;
  name: string;
  size?: number;
  isCover: boolean;
  status?: "uploading" | "success" | "error";
  errorReason?: string;
  rawFile?: File;
}

export interface MediaVideo {
  url: string;
  name: string;
  size?: number;
}

export interface Owner {
  id?: string;
  name: string;
  email: string;
  phone?: string;
  avatarUrl?: string;
}

export interface ApartmentDetails {
  bedrooms?: "Studio" | "RK" | "1" | "2" | "3" | "4+" | string;
  furnished?: "Fully Furnished" | "Semi Furnished" | "Unfurnished" | string;
  kitchenType?: "Attached Kitchen" | "Modular Kitchen" | "Open Kitchen" | "None" | string;
  bathroomType?: "Attached" | "Common" | string;
  balcony?: boolean;
  parking?: "Bike" | "Car" | "Both" | "None" | string;
  floorNumber?: number;
  totalFloors?: number;
  liftAvailable?: boolean;
  powerBackup?: boolean;
  security?: boolean;
}

export interface ApartmentPricing {
  monthlyRent: number;
  securityDeposit: number;
  maintenance?: number;
  electricityIncluded?: boolean;
  waterIncluded?: boolean;
  brokerage?: string;
  availabilityDate?: string;
}

export interface Property {
  id: string;
  propertyName: string;
  propertyType:
    | "PG"
    | "Hostel"
    | "Co-living"
    | "Apartment"
    | "Studio Apartment"
    | "RK"
    | "1 BHK"
    | "2 BHK"
    | "3 BHK"
    | "4+ BHK"
    | string;
  gender: "Boys" | "Girls" | "Unisex" | string;
  description?: string;
  city: string;
  area: string;
  address: string;
  landmark?: string;
  mapsLink?: string;
  rooms: RoomConfiguration[];
  roomConfigurations?: RoomConfiguration[];
  apartmentDetails?: ApartmentDetails;
  apartmentPricing?: ApartmentPricing;
  bhkConfig?: string;
  amenities: string[];
  rules: HouseRules;
  nearby: string[];
  images: MediaImage[];
  video?: MediaVideo | null;
  coverPhoto: string;
  startingRent: number;
  startingPrice?: number;
  status: "Published" | "Draft" | "Archived";
  views: number;
  enquiries: number;
  ownerId?: string;
  ownerEmail?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface PropertyWizardDraft {
  currentStep: number;
  formValues: Record<string, unknown>;
}
