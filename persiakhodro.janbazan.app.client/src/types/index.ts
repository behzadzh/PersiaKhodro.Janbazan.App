// User Types
export interface User {
  id: string;
  firstName: string;
  lastName: string;
  nationalCode: string;
  mobileNumber: string;
  email?: string;
  address?: string;
  postalCode?: string;
  dateOfBirth: string;
  profilePictureUrl?: string;
}

export interface RegisterUserDto {
  firstName: string;
  lastName: string;
  nationalCode: string;
  mobileNumber: string;
  password: string;
  dateOfBirth: string;
}

export interface LoginUserDto {
  nationalCode: string;
  password: string;
}

export interface AuthResponse {
  isSuccess: boolean;
  message: string;
  token?: string;
  refreshToken?: string;
  tokenExpiration?: string;
}

// Vehicle Types
export interface Vehicle {
  id: string;
  vin: string;
  modelName: string;
  productionYear: number;
  plateNumber?: string;
  status: VehicleStatus;
}

export interface CreateVehicleDto {
  vin: string;
  modelName: string;
  productionYear: number;
  plateNumber?: string;
  color?: string;
}

export enum VehicleStatus {
  Submitted = 'Submitted',
  AwaitingDocuments = 'AwaitingDocuments',
  UnderReview = 'UnderReview',
  AwaitingPayment = 'AwaitingPayment',
  Completed = 'Completed',
  Rejected = 'Rejected'
}

// Comment Types
export interface Comment {
  id: string;
  content: string;
  isFromCompany: boolean;
  createdAt: string;
  authorName: string;
}

export interface CreateCommentDto {
  content: string;
}

// Payment Types
export interface PaymentRequestResponse {
  invoiceId: string;
  paymentUrl: string;
}

// Document Types
export enum DocumentType {
  DisabilityCard = 'DisabilityCard',
  VehicleCard = 'VehicleCard',
  Contract = 'Contract',
  Other = 'Other'
}

// API Response Types
export interface ApiResponse<T = any> {
  data?: T;
  message?: string;
  isSuccess?: boolean;
}