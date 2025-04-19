export interface RegisterRequest {
  id?: {
    value: string;
  };
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  city: string;
  mobileCode: string;
  mobileNumber: string;
  address: string;
  region: string;
  postalCode: string;
  country: string;
  role?: string;
  createdDate?: string;
  lastLoginDate?: string;
} 