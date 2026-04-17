export type WebAuthBackendUser = {
  id: string;
  email: string;
  loginType: string | null;
  name: string | null;
  phoneNumber: string | null;
  address: string | null;
  avatarUrl: string | null;
  googleId: string | null;
  authProvider: string | null;
  emailVerified: boolean;
  active: number | null;
  deletedStatus: number | null;
  authToken: string;
  lastLoginAt: string | null;
  createdAt: string | null;
  updatedAt: string | null;
};

export type WebAuthLoginPayload = {
  email: string;
  password: string;
};

export type WebAuthRegisterPayload = {
  email: string;
  password: string;
  name: string;
  phoneNumber: string;
  address: string;
};

export type WebAuthErrorCode =
  | "email_in_use"
  | "invalid_credentials"
  | "missing_fields"
  | "unauthorized"
  | "unknown";

export type WebAuthResult =
  | {
      ok: true;
      message: string;
      user: WebAuthBackendUser;
    }
  | {
      ok: false;
      code: WebAuthErrorCode;
      message: string;
      statusCode?: number;
    };
