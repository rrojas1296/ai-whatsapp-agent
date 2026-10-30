import { Response } from "express";
import { Tokens } from "../types/models/tokens.model.js";

export interface IAuthCookiesProvider {
  setCookies(response: Response, tokens: Tokens): void;
  clear(response: Response): void;
}
