export enum UserRole {
  ADMIN = 'admin',
  PROPERTY_OWNER = 'property_owner',
  BUYER = 'buyer',
  TENANT = 'tenant',
  LEGAL_ADVISOR = 'legal_advisor',
  BUILDER = 'builder',
  PACKERS_MOVERS = 'packers_movers',
  PROPERTY_MANAGER = 'property_manager',
  MARKETING_PARTNER = 'marketing_partner',
}

export interface User {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  role: UserRole;
  avatar?: string;
  isActive: boolean;
  isVerified: boolean;
  kyc: { status: string; documents: string[]; verifiedAt?: string };
  address?: { street: string; city: string; state: string; pincode: string; country: string };
  preferences?: { language: string; notifications: { email: boolean; inApp: boolean } };
  lastLogin?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Property {
  _id: string;
  title: string;
  description: string;
  type: string;
  purpose: string;
  status: string;
  owner: User | string;
  price: number;
  priceUnit: string;
  area: { value: number; unit: string };
  bedrooms?: number;
  bathrooms?: number;
  floors?: number;
  yearBuilt?: number;
  furnishing?: string;
  amenities: string[];
  images: string[];
  location: {
    coordinates: [number, number];
    address: string;
    city: string;
    state: string;
    pincode: string;
    locality: string;
    landmark?: string;
  };
  features: Record<string, boolean>;
  verification: { isVerified: boolean };
  views: number;
  inquiryCount: number;
  isFeatured: boolean;
  availableFrom?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Inquiry {
  _id: string;
  property: Property | string;
  from: User | string;
  to: User | string;
  message: string;
  type: string;
  status: string;
  response?: string;
  createdAt: string;
}

export interface Offer {
  _id: string;
  property: Property | string;
  buyer: User | string;
  seller: User | string;
  offerPrice: number;
  counterPrice?: number;
  status: string;
  negotiationThread: { from: User | string; message: string; price?: number; createdAt: string }[];
  createdAt: string;
}

export interface Schedule {
  _id: string;
  type: string;
  title: string;
  description?: string;
  organizer: User | string;
  attendee: User | string;
  date: string;
  startTime: string;
  endTime: string;
  status: string;
  location?: string;
  createdAt: string;
}

export interface LegalCase {
  _id: string;
  type: string;
  client: User | string;
  advisor?: User | string;
  property?: Property | string;
  title: string;
  description: string;
  status: string;
  timeline: { event: string; description: string; date: string }[];
  createdAt: string;
}

export interface Feedback {
  _id: string;
  from: User | string;
  entityType: string;
  entityId: string;
  rating: number;
  review: string;
  createdAt: string;
}

export interface Notification {
  _id: string;
  type: string;
  title: string;
  message: string;
  isRead: boolean;
  data?: { entityType?: string; entityId?: string; link?: string };
  createdAt: string;
}

export interface Payment {
  _id: string;
  payer: User | string;
  payee: User | string;
  amount: number;
  description: string;
  status: string;
  type: string;
  transactionId?: string;
  createdAt: string;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data?: T;
  meta?: { page: number; limit: number; total: number; totalPages: number };
}

export interface PaginatedData<T> {
  data: T[];
  meta: { page: number; limit: number; total: number; totalPages: number };
}
