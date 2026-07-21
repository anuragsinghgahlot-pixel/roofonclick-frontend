import { RoomConfiguration } from "@/services/property";

export type AvailabilityStatus = "Available" | "Few Rooms Left" | "Fully Occupied";

export interface AvailabilityInfo {
  status: AvailabilityStatus;
  label: string;
  dotColor: string;
  textColor: string;
  bgColor: string;
  borderColor: string;
}

/**
 * Calculates room availability status based on available vs total room inventory.
 * 
 * Rules:
 * - Available Rooms == 0 -> Fully Occupied
 * - Available Rooms <= 20% of Total Rooms -> Few Rooms Left
 * - Otherwise -> Available
 */
export function calculateRoomAvailability(
  availableRooms: number,
  totalRooms: number
): AvailabilityInfo {
  const avail = Math.max(0, Number(availableRooms || 0));
  const total = Math.max(1, Number(totalRooms || 1));
  const ratio = avail / total;

  if (avail === 0) {
    return {
      status: "Fully Occupied",
      label: "Fully Occupied",
      dotColor: "bg-rose-500",
      textColor: "text-rose-600 dark:text-rose-400",
      bgColor: "bg-rose-500/10",
      borderColor: "border-rose-500/20",
    };
  }

  if (ratio <= 0.20) {
    return {
      status: "Few Rooms Left",
      label: "Few Rooms Left",
      dotColor: "bg-amber-500",
      textColor: "text-amber-600 dark:text-amber-400",
      bgColor: "bg-amber-500/10",
      borderColor: "border-amber-500/20",
    };
  }

  return {
    status: "Available",
    label: "Available",
    dotColor: "bg-emerald-500",
    textColor: "text-emerald-600 dark:text-emerald-400",
    bgColor: "bg-emerald-500/10",
    borderColor: "border-emerald-500/20",
  };
}

/**
 * Calculates property-wide availability status across all room configurations.
 */
export function calculatePropertyAvailability(
  rooms: RoomConfiguration[] = []
): AvailabilityInfo {
  if (!Array.isArray(rooms) || rooms.length === 0) {
    return {
      status: "Fully Occupied",
      label: "Fully Occupied",
      dotColor: "bg-rose-500",
      textColor: "text-rose-600 dark:text-rose-400",
      bgColor: "bg-rose-500/10",
      borderColor: "border-rose-500/20",
    };
  }

  const totalAvailable = rooms.reduce((acc, r) => acc + Math.max(0, Number(r.availableRooms || 0)), 0);
  const totalRoomsCount = rooms.reduce((acc, r) => acc + Math.max(1, Number(r.totalRooms ?? r.availableRooms ?? 1)), 0);

  return calculateRoomAvailability(totalAvailable, totalRoomsCount);
}
