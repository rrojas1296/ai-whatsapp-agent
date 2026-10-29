export interface AuthResult {
  tokens: {
    refreshToken: string;
    accessToken: string;
  };
}
