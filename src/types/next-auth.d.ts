import type { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: DefaultSession["user"] & {
      id: string;
      authToken?: string;
      phoneNumber?: string | null;
      address?: string | null;
      loginType?: string | null;
      authProvider?: string | null;
      isEmailVerified?: boolean;
    };
  }

  interface User {
    id: string;
    authToken?: string;
    phoneNumber?: string | null;
    address?: string | null;
    loginType?: string | null;
    authProvider?: string | null;
    isEmailVerified?: boolean;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    authToken?: string;
    phoneNumber?: string | null;
    address?: string | null;
    loginType?: string | null;
    authProvider?: string | null;
    isEmailVerified?: boolean;
  }
}
