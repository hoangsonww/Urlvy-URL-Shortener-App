import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  UseGuards,
  HttpCode,
  HttpStatus,
} from "@nestjs/common";
import {
  ApiTags,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiBearerAuth,
  ApiNotFoundResponse,
} from "@nestjs/swagger";
import { AuthService } from "./auth.service";
import {
  RegisterDto,
  LoginDto,
  ForgotPasswordDto,
  ResetPasswordDto,
} from "./dto/auth.dto";
import { UserService } from "../user/user.service";
import { JwtAuthGuard } from "./jwt-auth.guard";

@ApiTags("auth")
@Controller("auth")
export class AuthController {
  constructor(
    private auth: AuthService,
    private users: UserService,
  ) {}

  @Post("register")
  @ApiCreatedResponse({ description: "Register and get JWT" })
  async register(@Body() dto: RegisterDto) {
    const user = await this.users.create(dto.email, dto.password);
    return this.auth.login(user);
  }

  @Post("login")
  @ApiOkResponse({ description: "Login and get JWT" })
  async login(@Body() dto: LoginDto) {
    const user = await this.auth.validateUser(dto.email, dto.password);
    return this.auth.login(user);
  }

  @Get("profile")
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  profile(@Req() req: any) {
    return req.user;
  }

  @Post("forgot")
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ description: "Email exists, you may reset password" })
  @ApiNotFoundResponse({ description: "Email not found" })
  forgot(@Body() dto: ForgotPasswordDto) {
    return this.auth.forgotPassword(dto.email);
  }

  @Post("reset")
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ description: "Password successfully reset" })
  @ApiNotFoundResponse({ description: "Email not found" })
  reset(@Body() dto: ResetPasswordDto) {
    return this.auth.resetPassword(dto.email, dto.newPassword);
  }
}
