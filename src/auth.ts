import NextAuth from "next-auth";
import { CredentialsSignin } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";

import { loginWithEmail } from "@/features/auth-server";

export const isGoogleProviderEnabled = Boolean(
  process.env.AUTH_GOOGLE_ID && process.env.AUTH_GOOGLE_SECRET,
);

export const { handlers, signIn, signOut, auth } = NextAuth({
  session: {
    strategy: "jwt",
  },
  providers: [
    ...(isGoogleProviderEnabled
      ? [
          Google({
            clientId: process.env.AUTH_GOOGLE_ID!,
            clientSecret: process.env.AUTH_GOOGLE_SECRET!,
          }),
        ]
      : []),
    Credentials({
      name: "Email and password",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
        recaptchaToken: { label: "reCAPTCHA Token", type: "text" },
      },
      async authorize(credentials) {
        const email = typeof credentials?.email === "string" ? credentials.email.trim() : "";
        const password = typeof credentials?.password === "string" ? credentials.password : "";
        const recaptchaToken =
          typeof credentials?.recaptchaToken === "string" ? credentials.recaptchaToken.trim() : "";

        if (!email || !password) {
          return null;
        }

        if (!recaptchaToken) {
          const error = new CredentialsSignin();
          error.code = "captcha";
          throw error;
        }

        const result = await loginWithEmail({ email, password, recaptchaToken });

        if (!result.ok) {
          if (result.code === "captcha") {
            const error = new CredentialsSignin();
            error.code = "captcha";
            throw error;
          }

          return null;
        }

        const user = result.user;

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          image: user.avatarUrl ?? undefined,
          authToken: user.authToken,
          phoneNumber: user.phoneNumber,
          address: user.address,
          loginType: user.loginType,
          authProvider: user.authProvider,
          isEmailVerified: user.emailVerified,
        };
      },
    }),
  ],
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.authToken = typeof user.authToken === "string" ? user.authToken : undefined;
        token.phoneNumber =
          typeof user.phoneNumber === "string" || user.phoneNumber === null
            ? user.phoneNumber
            : null;
        token.address =
          typeof user.address === "string" || user.address === null ? user.address : null;
        token.loginType =
          typeof user.loginType === "string" || user.loginType === null ? user.loginType : null;
        token.authProvider =
          typeof user.authProvider === "string" || user.authProvider === null
            ? user.authProvider
            : null;
        token.isEmailVerified =
          typeof user.isEmailVerified === "boolean" ? user.isEmailVerified : false;
      }

      return token;
    },
    session({ session, token }) {
      if (session.user && typeof token.sub === "string") {
        session.user.id = token.sub;
      }

      if (session.user) {
        session.user.authToken = typeof token.authToken === "string" ? token.authToken : undefined;
        session.user.phoneNumber =
          typeof token.phoneNumber === "string" || token.phoneNumber === null
            ? token.phoneNumber
            : null;
        session.user.address =
          typeof token.address === "string" || token.address === null ? token.address : null;
        session.user.loginType =
          typeof token.loginType === "string" || token.loginType === null ? token.loginType : null;
        session.user.authProvider =
          typeof token.authProvider === "string" || token.authProvider === null
            ? token.authProvider
            : null;
        session.user.isEmailVerified =
          typeof token.isEmailVerified === "boolean" && token.isEmailVerified;
      }

      return session;
    },
  },
});
