export const authLoginErrorCodes = [
  "credentials",
  "missing",
  "captcha",
  "google",
  "unknown",
] as const;

export type AuthLoginErrorCode = (typeof authLoginErrorCodes)[number];

export const authRegisterErrorCodes = ["missing", "email_in_use", "captcha", "unknown"] as const;

export type AuthRegisterErrorCode = (typeof authRegisterErrorCodes)[number];

export function parseAuthLoginErrorCode(input?: string): AuthLoginErrorCode | undefined {
  if (!input) {
    return undefined;
  }

  return authLoginErrorCodes.find((value) => value === input);
}

export function parseAuthRegisterErrorCode(input?: string): AuthRegisterErrorCode | undefined {
  if (!input) {
    return undefined;
  }

  return authRegisterErrorCodes.find((value) => value === input);
}
