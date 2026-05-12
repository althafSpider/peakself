import {
    Body,
  Controller,
  Get,
  Post,
  Req,
  UseGuards,
} from "@nestjs/common";

import { AuthService } from "./auth.service";

import { JwtAuthGuard } from "./guards/jwt-auth.guard";
import { RequestMagicLinkDto } from "./dto/request-magic-link.dto";

@Controller("auth")
export class AuthController {
  constructor(
    private readonly authService: AuthService,
  ) {}

  @Post('request-magic-link')
  async requestMagicLink(@Body() dto: RequestMagicLinkDto) {
    return this.authService.requestMagicLink(dto.email);
  }

  @UseGuards(JwtAuthGuard)
  @Get("me")
  me(@Req() req: any) {
    return req.user;
  }
}