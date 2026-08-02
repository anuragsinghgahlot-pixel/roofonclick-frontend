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
  roomConfigurations?: RoomConfiguration[];
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
