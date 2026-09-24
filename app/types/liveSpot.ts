export type LiveSpot = {
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
  updated: string;
  updatedAt?: number;
  isStale?: boolean;
};