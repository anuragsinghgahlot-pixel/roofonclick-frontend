export interface MockProperty {
  id: string;
  name: string;
  location: string;
  price: number;
  rating: number;
  verified: boolean;
  image: string;
  type: string;
  gender: string;
  propertyTypeGroup: string;
  sharing: string[];
  amenities: string[];
  createdAt: string;
}

// ─── Real Database Mode: Mock properties removed ─────────────────────────────
export const MOCK_PROPERTIES: MockProperty[] = [];
