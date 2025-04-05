export interface Customer {
  id: { value: string }; // ✅ This must match the backend return
  firstName: { value: string };
  lastName: { value: string };
  email: string;
  dob: string;
  gender: string;
  mobileCode: string;
  mobileNumber: string;
  address: string;
  city: string;
  region: string;
  postalCode: string;
  country: string;
  role: string;
  createdDate: string;
  lastLoginDate: string;
}
