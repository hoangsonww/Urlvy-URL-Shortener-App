import { Injectable, InternalServerErrorException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy, StrategyOptions } from "passport-jwt";
import { ConfigService } from "@nestjs/config";
import { UserService } from "../user/user.service";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly config: ConfigService,
    private readonly users: UserService,
  ) {
    // pull the secret and ensure it's defined
    const secret = config.get<string>("jwtSecret");
    if (!secret) {
      throw new InternalServerErrorException("JWT_SECRET not configured");
    }

    const options: StrategyOptions = {
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: secret,
      ignoreExpiration: false,
    };

    super(options);
  }

  async validate(payload: { sub: string; email?: string }) {
    const user = await this.users.findById(payload.sub);
    if (!user) {
      // you could also throw UnauthorizedException here
      throw new InternalServerErrorException("User not found in JWT payload");
    }
    return user; // attaches user object to req.user
  }
}
