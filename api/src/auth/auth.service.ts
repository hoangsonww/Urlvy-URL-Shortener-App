import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { compare, hash } from "./hash.util";
import { UserService } from "../user/user.service";
import { User } from "../user/entities/user.entity";

@Injectable()
export class AuthService {
  constructor(
    private users: UserService,
    private jwt: JwtService,
  ) {}

  async validateUser(email: string, password: string): Promise<User> {
    const user = await this.users.findByEmail(email);
    if (!user || !(await compare(password, user.passwordHash)))
      throw new UnauthorizedException("Invalid credentials");
    return user;
  }

  async login(user: User) {
    const payload = { sub: user.id, email: user.email };
    return {
      accessToken: await this.jwt.signAsync(payload),
    };
  }

  async forgotPassword(email: string): Promise<{ ok: true }> {
    const user = await this.users.findByEmail(email);
    if (!user) throw new NotFoundException("Email not found");
    return { ok: true };
  }

  async resetPassword(
    email: string,
    newPassword: string,
  ): Promise<{ ok: true }> {
    const user = await this.users.findByEmail(email);
    if (!user) throw new NotFoundException("Email not found");
    const newHash = await hash(newPassword);
    await this.users.updatePassword(user.id, newHash);
    return { ok: true };
  }
}
