import { Property, PropertyWizardDraft } from "./property.types";
import { STORAGE_KEYS, safeGetItem, safeSetItem, safeRemoveItem } from "./property.storage";

class PropertyServiceImpl {
  /**
   * Fetch all published properties.
   * Also checks legacy storage key for backward compatibility.
   */
  public getAllProperties(): Property[] {
    let list = safeGetItem<Property[]>(STORAGE_KEYS.PROPERTIES, []);
    if (list.length === 0) {
      const legacyList = safeGetItem<Property[]>(STORAGE_KEYS.LEGACY_PROPERTIES, []);
      if (legacyList.length > 0) {
        list = legacyList;
        safeSetItem(STORAGE_KEYS.PROPERTIES, list);
      }
    }
    return list;
  }

  /**
   * Retrieve a property by its ID.
   */
  public getPropertyById(id: string): Property | null {
    if (!id) return null;
    const properties = this.getAllProperties();
    return properties.find((p) => p.id === id) || null;
  }

  /**
   * Create a new property listing.
   */
  public createProperty(data: Partial<Property>): Property {
    const properties = this.getAllProperties();
    const id = data.id || Math.random().toString(36).substring(7);
    
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
      rooms: data.rooms || [],
      amenities: data.amenities || [],
      rules: data.rules || {},
      nearby: data.nearby || [],
      images: data.images || [],
      video: data.video || null,
      coverPhoto:
        data.images?.find((img) => img.isCover)?.url ||
        data.images?.[0]?.url ||
        "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=600&q=80",
      startingRent:
        data.rooms && data.rooms.length > 0
          ? Math.min(...data.rooms.map((r) => Number(r.rent || 0)))
          : 0,
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

    const updatedProperty: Property = {
      ...properties[index],
      ...data,
      id,
      coverPhoto:
        data.images?.find((img) => img.isCover)?.url ||
        data.images?.[0]?.url ||
        properties[index].coverPhoto,
      startingRent:
        data.rooms && data.rooms.length > 0
          ? Math.min(...data.rooms.map((r) => Number(r.rent || 0)))
          : properties[index].startingRent,
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
