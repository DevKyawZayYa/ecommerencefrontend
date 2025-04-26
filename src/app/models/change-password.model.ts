export interface ChangePasswordRequest {
  userId: {
    value: string;
  };
  currentPassword: string;
  newPassword: string;
}

export interface ChangePasswordResponse {
  message: string;
} 