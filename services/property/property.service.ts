import { Property, PropertyWizardDraft, RoomConfiguration } from "./property.types";
import { STORAGE_KEYS, safeGetItem, safeSetItem, safeRemoveItem } from "./property.storage";
import { MOCK_PROPERTIES } from "@/constants/mock-properties";

function convertMockProperty(mp: any, customId?: string): Property {
  const rooms: RoomConfiguration[] = (mp.sharing || ["Single Sharing"]).map((s: string, idx: number) => ({
    id: `room-${idx}`,
    sharingType: s,
    monthlyRent: mp.price + (idx * 1000),
    securityDeposit: 15000,
    totalRooms: 5,
    availableRooms: 2,
    gender: (mp.gender === "girls" ? "Girls" : mp.gender === "boys" ? "Boys" : "Boys") as any,
    attachedBathroom: true,
    furnished: "Fully Furnished",
    roomType: s as any,
    rent: mp.price + (idx * 1000),
  }));

  return {
    id: customId || mp.id,
    propertyName: mp.name || mp.title || "Elite Residency",
    propertyType: (mp.type?.includes("PG") ? "PG" : mp.type?.includes("Hostel") ? "Hostel" : "Co-living") as any,
    gender: (mp.gender === "girls" ? "Girls" : mp.gender === "boys" ? "Boys" : "Boys") as any,
    description: `Welcome to ${mp.name || mp.title || "Elite Residency"} located in ${mp.location}, Indore. Enjoy high-speed Wi-Fi, air-conditioned rooms, 24/7 security, and daily mess facilities.`,
    city: "Indore",
    area: mp.location || "Vijay Nagar",
    address: `${mp.location || "Vijay Nagar"}, Indore, MP 452010`,
    landmark: "Near Main Square",
    rooms,
    roomConfigurations: rooms,
    amenities: mp.amenities || ["Wi-Fi", "AC", "Laundry", "Mess Included"],
    rules: {
      smokingAllowed: false,
      drinkingAllowed: false,
      visitorsAllowed: true,
      petsAllowed: false,
      loudMusicAllowed: false,
      gateClosingEnabled: true,
      gateClosingTime: "10:00 PM",
    },
    nearby: [],
    images: [{ id: "img-1", name: "Cover", url: mp.image, isCover: true }],
    coverPhoto: mp.image,
    startingRent: mp.price,
    startingPrice: mp.price,
    status: "Published",
    views: 145,
    enquiries: 12,
    createdAt: mp.createdAt || new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}

/**
 * Normalizes room configurations for backwards compatibility and consistency.
 */
function normalizeRoomConfigurations(rooms: RoomConfiguration[] = []): RoomConfiguration[] {
  if (!Array.isArray(rooms) || rooms.length === 0) return [];
  return rooms.map((r) => {
    const monthlyRent = Number(r.monthlyRent ?? r.rent ?? 0);
    const securityDeposit = Number(r.securityDeposit ?? 0);
    const totalRooms = Number(r.totalRooms ?? r.availableRooms ?? 1);
    const availableRooms = Number(r.availableRooms ?? 1);
    const sharingType = r.sharingType || r.roomType || "Single";
    const gender = r.gender || "Boys";
    const attachedBathroom = typeof r.attachedBathroom === "boolean" ? r.attachedBathroom : true;
    const furnished = r.furnished || "Fully Furnished";

    return {
      ...r,
      sharingType,
      monthlyRent,
      securityDeposit,
      totalRooms,
      availableRooms,
      gender,
      attachedBathroom,
      furnished,
      // Legacy mirrors
      roomType: (sharingType as RoomConfiguration["roomType"]),
      rent: monthlyRent,
    };
  });
}

function calculateStartingPrice(rooms: RoomConfiguration[] = []): number {
  const normalized = normalizeRoomConfigurations(rooms);
  const rents = normalized.map((r) => r.monthlyRent).filter((r) => r > 0);
  return rents.length > 0 ? Math.min(...rents) : 0;
}

class PropertyServiceImpl {
  /**
   * Fetch all published properties.
   */
  public getAllProperties(): Property[] {
    let list = safeGetItem<Property[]>(STORAGE_KEYS.PROPERTIES, []);
    if (list.length === 0) {
      const legacyList = safeGetItem<Property[]>(STORAGE_KEYS.LEGACY_PROPERTIES, []);
      if (legacyList.length > 0) {
        list = legacyList;
        safeSetItem(STORAGE_KEYS.PROPERTIES, list);
      } else {
        list = MOCK_PROPERTIES.map((mp) => convertMockProperty(mp));
        safeSetItem(STORAGE_KEYS.PROPERTIES, list);
      }
    }

    // Ensure roomConfigurations and startingRent are normalized on read
    return list.map((p) => {
      const rooms = normalizeRoomConfigurations(p.rooms || p.roomConfigurations || []);
      const startingRent = calculateStartingPrice(rooms) || p.startingRent || 0;
      return {
        ...p,
        rooms,
        roomConfigurations: rooms,
        startingRent,
        startingPrice: startingRent,
      };
    });
  }

  /**
   * Retrieve a property by its ID.
   */
  public getPropertyById(id: string): Property | null {
    if (!id) return null;
    const properties = this.getAllProperties();
    const found = properties.find((p) => p.id === id || p.id?.toLowerCase() === id.toLowerCase());
    if (found) return found;

    // Fallback lookup from MOCK_PROPERTIES
    const mockItem = MOCK_PROPERTIES.find(
      (p) =>
        p.id === id ||
        p.id.toLowerCase() === id.toLowerCase() ||
        p.name.toLowerCase().replace(/\s+/g, "-") === id.toLowerCase() ||
        id.toLowerCase().includes(p.id.toLowerCase())
    );

    if (mockItem) {
      return convertMockProperty(mockItem, id);
    }

    // Fallback to default mock property for any unknown string ID
    if (MOCK_PROPERTIES.length > 0) {
      return convertMockProperty(MOCK_PROPERTIES[0], id);
    }

    return null;
  }

  /**
   * Create a new property listing.
   */
  public createProperty(data: Partial<Property>): Property {
    const properties = this.getAllProperties();
    const id = data.id || Math.random().toString(36).substring(7);

    const rawRooms = data.rooms || data.roomConfigurations || [];
    const rooms = normalizeRoomConfigurations(rawRooms);
    const startingRent = calculateStartingPrice(rooms);

    const newProperty: Property = {
      id,
      propertyName: data.propertyName || "Untitled Property",
      propertyType: data.propertyType || "PG",
      gender: data.gender || "Boys",
      description: data.description || "",
      city: data.city || "Indore",
      area: data.area || "Vijay Nagar",
      address: data.address || "",
      landmark: data.landmark || "",
      mapsLink: data.mapsLink || "",
      rooms,
      roomConfigurations: rooms,
      amenities: data.amenities || [],
      rules: data.rules || {},
      nearby: data.nearby || [],
      images: data.images || [],
      video: data.video || null,
      coverPhoto:
        data.images?.find((img) => img.isCover)?.url ||
        data.images?.[0]?.url ||
        "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=600&q=80",
      startingRent,
      startingPrice: startingRent,
      status: "Published",
      views: data.views || Math.floor(Math.random() * 45) + 12,
      enquiries: data.enquiries || Math.floor(Math.random() * 8) + 1,
      createdAt: data.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    properties.push(newProperty);
    safeSetItem(STORAGE_KEYS.PROPERTIES, properties);
    safeSetItem(STORAGE_KEYS.LEGACY_PROPERTIES, properties);
    return newProperty;
  }

  /**
   * Update an existing property by ID.
   */
  public updateProperty(id: string, data: Partial<Property>): Property | null {
    const properties = this.getAllProperties();
    const index = properties.findIndex((p) => p.id === id);
    if (index === -1) {
      return this.createProperty({ ...data, id });
    }

    const existing = properties[index];
    const rawRooms = data.rooms || data.roomConfigurations || existing.rooms || [];
    const rooms = normalizeRoomConfigurations(rawRooms);
    const startingRent = calculateStartingPrice(rooms) || existing.startingRent;

    const updatedProperty: Property = {
      ...existing,
      ...data,
      id,
      rooms,
      roomConfigurations: rooms,
      coverPhoto:
        data.images?.find((img) => img.isCover)?.url ||
        data.images?.[0]?.url ||
        existing.coverPhoto,
      startingRent,
      startingPrice: startingRent,
      updatedAt: new Date().toISOString(),
    };

    properties[index] = updatedProperty;
    safeSetItem(STORAGE_KEYS.PROPERTIES, properties);
    safeSetItem(STORAGE_KEYS.LEGACY_PROPERTIES, properties);
    return updatedProperty;
  }

  /**
   * Delete a property listing by ID.
   */
  public deleteProperty(id: string): boolean {
    const properties = this.getAllProperties();
    const filtered = properties.filter((p) => p.id !== id);
    if (filtered.length === properties.length) return false;

    safeSetItem(STORAGE_KEYS.PROPERTIES, filtered);
    safeSetItem(STORAGE_KEYS.LEGACY_PROPERTIES, filtered);
    return true;
  }

  /**
   * Save property wizard draft.
   */
  public saveDraft(draftData: PropertyWizardDraft): void {
    safeSetItem(STORAGE_KEYS.PROPERTY_DRAFT, draftData);
    safeSetItem(STORAGE_KEYS.LEGACY_DRAFT, draftData);
  }

  /**
   * Get property wizard draft.
   */
  public getDraft(): PropertyWizardDraft | null {
    let draft = safeGetItem<PropertyWizardDraft | null>(STORAGE_KEYS.PROPERTY_DRAFT, null);
    if (!draft) {
      draft = safeGetItem<PropertyWizardDraft | null>(STORAGE_KEYS.LEGACY_DRAFT, null);
    }
    return draft;
  }

  /**
   * Clear active property wizard draft.
   */
  public clearDraft(): void {
    safeRemoveItem(STORAGE_KEYS.PROPERTY_DRAFT);
    safeRemoveItem(STORAGE_KEYS.LEGACY_DRAFT);
  }
}

export const PropertyService = new PropertyServiceImpl();
