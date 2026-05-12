import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { PassportModule } from "@nestjs/passport";
import { ConfigModule, ConfigService } from "@nestjs/config";

import { AuthService } from "./auth.service";
import { AuthController } from "./auth.controller";
import { JwtStrategy } from "./strategies/jwt.strategy";
import { MailModule } from "src/mail/mail.module";

@Module({
  imports: [
    ConfigModule,

    PassportModule,

    JwtModule.registerAsync({
      imports: [ConfigModule,MailModule],

      inject: [ConfigService],

      useFactory: async (
        configService: ConfigService,
      ) => ({
        secret: configService.get<string>(
          "JWT_ACCESS_SECRET",
        ),

        signOptions: {
          expiresIn: "15m",
        },
      }),
    }),
  ],

  controllers: [AuthController],

  providers: [AuthService, JwtStrategy],

  exports: [AuthService],
})
export class AuthModule {}