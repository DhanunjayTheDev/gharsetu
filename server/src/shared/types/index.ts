// Shared enums and types for the entire application

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

export enum GlobalStatus {
  PENDING = 'pending',
  IN_PROGRESS = 'in-progress',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
}

export enum PropertyType {
  APARTMENT = 'apartment',
  HOUSE = 'house',
  VILLA = 'villa',
  PLOT = 'plot',
  COMMERCIAL = 'commercial',
  FARMLAND = 'farmland',
}

export enum PropertyPurpose {
  SALE = 'sale',
  RENT = 'rent',
  LEASE = 'lease',
}

export enum PropertyStatus {
  DRAFT = 'draft',
  ACTIVE = 'active',
  UNDER_REVIEW = 'under_review',
  SOLD = 'sold',
  RENTED = 'rented',
  INACTIVE = 'inactive',
}

export enum DocumentStatus {
  UPLOADED = 'uploaded',
  UNDER_REVIEW = 'under_review',
  VERIFIED = 'verified',
  REJECTED = 'rejected',
}

export enum LegalCaseType {
  TITLE_VERIFICATION = 'title_verification',
  PROPERTY_REGISTRATION = 'property_registration',
  DISPUTE_RESOLUTION = 'dispute_resolution',
  AGREEMENT_DRAFTING = 'agreement_drafting',
  CONSULTATION = 'consultation',
}

export enum JVStage {
  PROPOSAL = 'proposal',
  NEGOTIATION = 'negotiation',
  AGREEMENT = 'agreement',
  PLANNING = 'planning',
  CONSTRUCTION = 'construction',
  MARKETING = 'marketing',
  COMPLETED = 'completed',
}

export enum ScheduleType {
  PROPERTY_VISIT = 'property_visit',
  LEGAL_CONSULTATION = 'legal_consultation',
  PACKERS_BOOKING = 'packers_booking',
  SERVICE_APPOINTMENT = 'service_appointment',
  MAINTENANCE = 'maintenance',
}

export enum NotificationType {
  INQUIRY = 'inquiry',
  BOOKING = 'booking',
  LEGAL_UPDATE = 'legal_update',
  PAYMENT = 'payment',
  SYSTEM = 'system',
  MARKETING = 'marketing',
}

export enum PaymentStatus {
  INITIATED = 'initiated',
  PROCESSING = 'processing',
  COMPLETED = 'completed',
  FAILED = 'failed',
  REFUNDED = 'refunded',
}

export interface TokenPayload {
  userId: string;
  role: UserRole;
  email: string;
}

export interface AuthRequest extends Express.Request {
  user?: TokenPayload;
}
