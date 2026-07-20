export interface RoomConfiguration {
  roomType: "Single Sharing" | "Double Sharing" | "Triple Sharing" | "Four Sharing";
  rent: number;
  securityDeposit?: number;
  availableRooms: number;
  availability: "Available Now" | "Available Next Month" | "Fully Occupied";
  mealsIncluded: boolean;
  electricity: "Included" | "Extra Charges";
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
  name: string;
  isCover: boolean;
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

export interface Property {
  id: string;
  propertyName: string;
  propertyType: "PG" | "Hostel" | "Co-living" | "Apartment";
  gender: "Boys" | "Girls" | "Unisex";
  description?: string;
  city: string;
  area: string;
  address: string;
  landmark?: string;
  mapsLink?: string;
  rooms: RoomConfiguration[];
  amenities: string[];
  rules: HouseRules;
  nearby: string[];
  images: MediaImage[];
  video?: MediaVideo | null;
  coverPhoto: string;
  startingRent: number;
  status: "Published" | "Draft" | "Archived";
  views: number;
  enquiries: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface PropertyWizardDraft {
  currentStep: number;
  formValues: Record<string, unknown>;
}
