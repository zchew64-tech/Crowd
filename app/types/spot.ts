import type { Timestamp } from "firebase/firestore";

export type Spot = {
  id: string;
  name: string;
  type: string;
  address: string;
  distance: string;
  seatAvailability: number;
  availabilityText: string;
  noise: string;
  wifi: string;
  outlets: string;
  reportCount: number;
  reportSum: number;
  lastUpdatedAt: Timestamp | null;
};

export type SeedSpot = Omit<Spot, "reportCount" | "reportSum" | "lastUpdatedAt">;