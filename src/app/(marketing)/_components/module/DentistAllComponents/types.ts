export type Dentist = {
  id: string;
  backendId?: number;
  name: string;
  slug: string;
  specialty: string;
  imageSeed: string;
  rating: number;
  reviewCount: number;
  image: string;
  location: string;
  city: string;
  country: string;
  price: number;
  rdvScore: number;
  verified: boolean;
  procedures: string[];
  tags: string[];
  languages: string[];
  licenseNo: string;
  experience: number;
  coords: {
    lat: number;
    lng: number;
  };
};

// Import centralized demo data
import { DEMO_DENTISTS } from "@/lib/storage/dentistData";

export const dentists: Dentist[] = DEMO_DENTISTS;

export const procedureOptions = [
  "All Procedures",
  "Veneers",
  "Orthodontics",
  "Aligners",
  "Crowns",
  "Implants",
  "Bone Grafting",
  "Whitening",
  "Smile Design",
  "Cleanings",
  "Fillings",
  "Gum Care",
  "Deep Cleaning",
];

export const countryOptions = ["All Countries", "Mexico"];

export const cityOptions = [
  "All Cities",
  "Mexico City",
  "Polanco",
  "Roma Norte",
  "Coyoacan",
  "Del Valle",
  "Napoles",
];
