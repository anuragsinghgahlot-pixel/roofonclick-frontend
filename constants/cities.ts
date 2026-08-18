export interface CityArea {
  id: string;
  name: string;
  tagline: string;
  image: string;
}

export interface CityLandmark {
  id: string;
  name: string;
  category: "College" | "Hospital" | "Landmark" | "IT Hub";
  description: string;
}

export interface CityConfig {
  id: string;
  name: string;
  state: string;
  isLive: boolean;
  tagline: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  popularAreas: CityArea[];
  landmarks: CityLandmark[];
}

export const CITIES_REGISTRY: CityConfig[] = [
  {
    id: "indore",
    name: "Indore",
    state: "Madhya Pradesh",
    isLive: true,
    tagline: "India's Cleanest City & Major Education/IT Hub",
    coordinates: { lat: 22.7196, lng: 75.8577 },
    popularAreas: [
      {
        id: "vijay-nagar",
        name: "Vijay Nagar",
        tagline: "Indore IT & Commercial Hub",
        image: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=600&auto=format&fit=crop&q=80",
      },
      {
        id: "bhawarkuan",
        name: "Bhawarkuan",
        tagline: "Student & Coaching Center",
        image: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=600&auto=format&fit=crop&q=80",
      },
      {
        id: "palasia",
        name: "Palasia",
        tagline: "Central & Premium Stays",
        image: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=600&auto=format&fit=crop&q=80",
      },
      {
        id: "lig-colony",
        name: "LIG Colony",
        tagline: "Connected Residential Area",
        image: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=600&auto=format&fit=crop&q=80",
      },
      {
        id: "geeta-bhawan",
        name: "Geeta Bhawan",
        tagline: "Medical & Academic Hub",
        image: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=600&auto=format&fit=crop&q=80",
      },
      {
        id: "rau",
        name: "Rau",
        tagline: "Near IIM Indore & Universities",
        image: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=600&auto=format&fit=crop&q=80",
      },
    ],
    landmarks: [
      { id: "iet-davv", name: "IET DAVV", category: "College", description: "Hostels and PGs near university campus" },
      { id: "sgsits", name: "SGSITS College", category: "College", description: "Student accommodation near YN Road" },
      { id: "medanta-hospital", name: "Medanta Hospital", category: "Hospital", description: "Verified PGs and suites nearby" },
      { id: "c21-mall", name: "C21 Mall", category: "Landmark", description: "Co-living and stays near AB Road" },
      { id: "crystal-it-park", name: "Crystal IT Park", category: "IT Hub", description: "Stays near Ring Road IT companies" },
    ],
  },
  {
    id: "bhopal",
    name: "Bhopal",
    state: "Madhya Pradesh",
    isLive: false,
    tagline: "City of Lakes & Academic Centers",
    coordinates: { lat: 23.2599, lng: 77.4126 },
    popularAreas: [
      { id: "mp-nagar", name: "MP Nagar", tagline: "Commercial & Coaching Hub", image: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=600&auto=format&fit=crop&q=80" },
      { id: "indrapuri", name: "Indrapuri", tagline: "Near BHEL & Colleges", image: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=600&auto=format&fit=crop&q=80" },
      { id: "kolar-road", name: "Kolar Road", tagline: "Residential Stays", image: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=600&auto=format&fit=crop&q=80" },
    ],
    landmarks: [
      { id: "manit-bhopal", name: "MANIT Bhopal", category: "College", description: "Hostels near National Institute of Technology" },
      { id: "aiims-bhopal", name: "AIIMS Bhopal", category: "Hospital", description: "Medical student accommodations" },
    ],
  },
  {
    id: "kota",
    name: "Kota",
    state: "Rajasthan",
    isLive: false,
    tagline: "India's Coaching Capital",
    coordinates: { lat: 25.2138, lng: 75.8648 },
    popularAreas: [
      { id: "vigyan-nagar", name: "Vigyan Nagar", tagline: "Allen & Resonance Hub", image: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=600&auto=format&fit=crop&q=80" },
      { id: "mahaveer-nagar", name: "Mahaveer Nagar", tagline: "Student Hostels Zone", image: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=600&auto=format&fit=crop&q=80" },
      { id: "landmark-city", name: "Landmark City", tagline: "Modern Coaching Campus Stays", image: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=600&auto=format&fit=crop&q=80" },
    ],
    landmarks: [
      { id: "allen-sankalp", name: "ALLEN Sankalp", category: "College", description: "Hostels near Allen Career Institute" },
    ],
  },
  {
    id: "pune",
    name: "Pune",
    state: "Maharashtra",
    isLive: false,
    tagline: "Oxford of the East & IT Metropolis",
    coordinates: { lat: 18.5204, lng: 73.8567 },
    popularAreas: [
      { id: "hinjawadi", name: "Hinjawadi", tagline: "Rajiv Gandhi Infotech Park", image: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=600&auto=format&fit=crop&q=80" },
      { id: "viman-nagar", name: "Viman Nagar", tagline: "Near Symbiosis Campus", image: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=600&auto=format&fit=crop&q=80" },
      { id: "kothrud", name: "Kothrud", tagline: "Student Hub near MIT-WPU", image: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=600&auto=format&fit=crop&q=80" },
    ],
    landmarks: [
      { id: "symbiosis", name: "Symbiosis University", category: "College", description: "Premium PGs in Viman Nagar" },
      { id: "mit-wpu", name: "MIT-WPU Campus", category: "College", description: "Student accommodation in Kothrud" },
    ],
  },
  {
    id: "jaipur",
    name: "Jaipur",
    state: "Rajasthan",
    isLive: false,
    tagline: "Pink City & Education Center",
    coordinates: { lat: 26.9124, lng: 75.7873 },
    popularAreas: [
      { id: "malviya-nagar", name: "Malviya Nagar", tagline: "Near MNIT & GT Mall", image: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=600&auto=format&fit=crop&q=80" },
      { id: "mansarovar", name: "Mansarovar", tagline: "Major Academic Colony", image: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=600&auto=format&fit=crop&q=80" },
    ],
    landmarks: [
      { id: "mnit-jaipur", name: "MNIT Jaipur", category: "College", description: "Hostels and PGs near JLN Marg" },
    ],
  },
  {
    id: "bangalore",
    name: "Bangalore",
    state: "Karnataka",
    isLive: false,
    tagline: "Silicon Valley of India",
    coordinates: { lat: 12.9716, lng: 77.5946 },
    popularAreas: [
      { id: "koramangala", name: "Koramangala", tagline: "Startup & Lifestyle Hub", image: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=600&auto=format&fit=crop&q=80" },
      { id: "hsr-layout", name: "HSR Layout", tagline: "Tech Professional Stays", image: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=600&auto=format&fit=crop&q=80" },
      { id: "whitefield", name: "Whitefield", tagline: "ITPL & Tech Parks", image: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=600&auto=format&fit=crop&q=80" },
    ],
    landmarks: [
      { id: "iisc-bangalore", name: "IISc Bangalore", category: "College", description: "Stays near Indian Institute of Science" },
      { id: "ecospace", name: "RMZ Ecospace", category: "IT Hub", description: "Co-living near Bellandur" },
    ],
  },
];

export const DEFAULT_CITY = CITIES_REGISTRY[0]; // Indore
