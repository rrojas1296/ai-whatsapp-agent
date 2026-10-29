import { Injectable } from "@nestjs/common";
import { type IHashPasswordProvider } from "../contracts/hash-password.contract.js";
import argon from "argon2";

@Injectable()
export class HashPasswordProvider implements IHashPasswordProvider {
  verify(password: string, hash: string): Promise<boolean> {
    return argon.verify(hash, password);
  }

  hash(token: string): Promise<string> {
    return argon.hash(token, {
      type: argon.argon2d,
      hashLength: 50,
    });
  }
}
