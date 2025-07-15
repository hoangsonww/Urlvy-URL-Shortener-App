import * as bcrypt from "bcryptjs";
const ROUNDS = 10;
export const hash = (plain: string) => bcrypt.hash(plain, ROUNDS);
export const compare = (plain: string, hashed: string) =>
  bcrypt.compare(plain, hashed);
