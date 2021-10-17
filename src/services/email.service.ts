import {injectable, /* inject, */ BindingScope} from '@loopback/core';
const mailchimp = require('@mailchimp/mailchimp_transactional')(process.env.MAILCHIMP_API_KEY);
const FROM_EMAIL = 'info@flexin.io';

interface ToObject {
  email: string;
  type: string;
}
export interface EmailMessage {
  subject: string;
  text: string;
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
    // console.log(response);
    return response;
  }
}
