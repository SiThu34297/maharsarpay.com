export const authLoginErrorCodes = ["credentials", "missing", "google", "unknown"] as const;

export type AuthLoginErrorCode = (typeof authLoginErrorCodes)[number];

export function parseAuthLoginErrorCode(input?: string): AuthLoginErrorCode | undefined {
  if (!input) {
    return undefined;
  }

  return authLoginErrorCodes.find((value) => value === input);
}
