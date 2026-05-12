import { Injectable, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { MailService } from 'src/mail/mail.service';
import { prisma } from '@repo/db';
import crypto from 'crypto';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly mailService: MailService,
  ) {}

  async requestMagicLink(email: string) {
    const normalizedEmail = email.trim().toLowerCase();

    let user = await prisma.user.findUnique({
      where: { email: normalizedEmail },
    });

    if (!user) {
      user = await prisma.user.create({
        data: { email: normalizedEmail },
      });
    }

    const existing = await prisma.magicLink.findFirst({
      where: {
        userId: user.id,
        expiresAt: { gt: new Date() },
      },
    });

    if (existing) {
      throw new BadRequestException('Magic link already sent. Please wait.');
    }

    const token = crypto.randomBytes(32).toString('hex');
    const tokenHash = crypto.createHash('sha256').update(token).digest('hex');

    const expiresAt = new Date(Date.now() + 1000 * 60 * 15);

    await prisma.magicLink.create({
      data: {
        userId: user.id,
        tokenHash,
        expiresAt,
      },
    });

    const url = new URL('/auth/verify', process.env.APP_URL);
    url.searchParams.set('token', token);

    try {
      await this.mailService.sendMagicLink(normalizedEmail, url.toString());
    } catch (error) {
      await prisma.magicLink.deleteMany({
        where: { userId: user.id },
      });

      throw error;
    }

    return { success: true };
  }
}
