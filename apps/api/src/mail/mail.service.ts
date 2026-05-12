import { Injectable } from "@nestjs/common";

import { Resend } from "resend";

@Injectable()
export class MailService {
  private resend = new Resend(
    process.env.RESEND_API_KEY,
  );

  async sendMagicLink(
    email: string,
    url: string,
  ) {
    return this.resend.emails.send({
      from: process.env.EMAIL_FROM!,

      to: email,

      subject: "Login to Peakself",

      html: `
        <h2>Login to Peakself</h2>

        <a href="${url}">
          Continue
        </a>
      `,
    });
  }
}