export interface IHashPasswordProvider {
  verify(password: string, hash: string): Promise<boolean>;
  hash(password: string): Promise<string>;
}

export const HASH_PASSWORD_PROVIDER = Symbol("HASH_PASSWORD_PROVIDER");
