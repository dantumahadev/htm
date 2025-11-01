import type { Part } from "@google/genai";

export type Page = 'dashboard' | 'marketplace' | 'volunteers' | 'finance' | 'nft' | 'training' | 'chat' | 'photo-studio' | 'cart' | 'customer-marketplace' | 'customer-cart' | 'customer-favorites' | 'customer-profile' | 'customer-checkout' | 'customer-chat';

export type Role = 'artisan' | 'volunteer' | 'customer';

export interface User {
  id: string;
  role: Role;
  name: string;
  avatar: string;
  profileComplete?: boolean;
}

export interface Artisan extends User {
  location: string;
  bio: string;
  story: string;
  storyVideoUrl: string;
}


export interface Product {
  id: string;
  name: string;
  description: string;
  longDescription: string;
  price: number;
  image: string;
  category: string;
  artisanId: string;
  dateAdded: string; // ISO 8601 format
  certificateId: string;
  craftTradition: string;
  storyVideoUrl?: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
  offerPrice: number;
}

export interface CompletedProject {
    id: string;
    projectName: string;
    artisanName: string;
    artisanAvatar: string;
    certificateText: string;
    skills: string[];
}

export interface Testimonial {
    quote: string;
    artisanName: string;
    artisanAvatar: string;
}

export interface Volunteer extends User {
  skills: string[];
  bio: string;
  motivation: string;
  projectsCompleted: number;
  completedProjects: CompletedProject[];
  testimonials: Testimonial[];
}

export interface Project {
  id: string;
  title: string;
  description: string;
  skillsNeeded: string[];
  postedBy: string; // Artisan's name
  status: 'Open' | 'In Progress' | 'Completed';
}

export interface CrowdfundCampaign {
  id: number;
  title: string;
  goal: number;
  raised: number;
  image: string;
  description: string;
}

export interface TrainingModule {
    id: number;
    title: string;
    category: string;
    thumbnail: string;
    duration: string;
}

export interface DesignIdea {
    conceptName: string;
    description: string;
    colorPalette: { name: string; hex: string; }[];
    suggestedPatterns: string[];
}

export interface ChatMessage {
  id: number;
  senderId: string;
  text: string;
  timestamp: string; // ISO 8601 format
}

export interface Conversation {
  id: string; // e.g., 'uid1-uid2' (user ids sorted and joined)
  participantIds: string[];
  participants: { [key: string]: { name: string, avatar: string } };
  messages: ChatMessage[];
}

export interface ProjectApplication {
  id: string;
  projectId: string;
  volunteerId: string;
  artisanId: string;
  status: 'pending' | 'accepted' | 'declined';
  applicationDate: string; // ISO string
}

export interface Collaboration {
  id: string;
  projectId: string;
  volunteerId: string;
  artisanId: string;
  startDate: string; // ISO string
  endDate?: string; // ISO string
  status: 'in-progress' | 'completed';
  rating?: number;
  feedback?: string;
}