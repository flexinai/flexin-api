/* eslint-disable @typescript-eslint/naming-convention */
import { /* inject, */ BindingScope, injectable} from '@loopback/core';
require('dotenv').config()
const mailchimp = require('@mailchimp/mailchimp_transactional')(process.env.MAILCHIMP_API_KEY);
const FROM_EMAIL = 'general@flexin.io';

interface ToObject {
  email: string;
  type: string;
}
export interface EmailMessage {
  subject: string;
  text?: string;
  html?: string;
  to: ToObject[];
}

@injectable({scope: BindingScope.TRANSIENT})
export class EmailService {
  constructor(/* Add @inject to inject parameters */) {}

  async send(message: EmailMessage) {
    const body = {
      message: {
        from_email: FROM_EMAIL,
        ...message,
      },
    };
    const response = await mailchimp.messages.send(body);
    return response;
  }

}
