export type CharacterType = 'executive' | 'strategist' | 'creator';

export interface StatItem {
  label: string;
  value: string;
  icon?: string;
}

export interface Contribution {
  title: string;
  text: string;
  link?: string; // NEW: Allows a tile to act as a clickable link!
}

export interface Experience {
  id: string;
  category?: 'education' | 'experience' | 'publication' | 'achievement' | 'hobby';
  title: string;
  company: string;
  role: string;
  duration?: string; 
  location?: string; 
  cgpa?: string;
  contributions: Contribution[];
  accentColor: string;
}

export interface CharacterData {
  id: string;
  title: string;
  tagline: string;
  motto: string;
  description: string;
  color: string;
  secondaryColor: string;
  image: string;
  profileImage: string;
  floatingGlbs?: string[]; // NEW: For the 3D floating props
  theme: {
    bgGradient: string;
    accentGlow: string;
  };
  experiences: Experience[];
  skills: {
    name: string;
    description: string;
    icon?: string;
  }[];
}
  

