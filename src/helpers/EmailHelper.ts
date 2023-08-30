import { Service } from 'typedi';
import { createTransport } from 'nodemailer';
import * as handlebars from 'handlebars';
import { appEnv } from './EnvHelper';
// import { appEnv } from '../../helpers/EnvHelper';
import { readFile } from 'fs';
import { resolve } from 'path';

@Service()
export class MailService {
  public transporter = createTransport({
    host: appEnv('SMTP_SERVER'),
    port: appEnv('SMTP_PORT'),
    secure: true,
    auth: {
      user: appEnv('SMTP_EMAIL'),
      pass: appEnv('SMTP_PASSWORD'),
    },
  });

  private async readHTMLTemplate(templateName: string) {
    const html = await this.readFile(
      __dirname + '/../../email_templates/' + templateName,
    );
    return html;
  }
  private readFile(path: any) {
    return new Promise((res, rej) => {
      readFile(path, 'utf8', (err: Error, data: any) => {
        if (err) rej(err);
        else res(data);
      });
    });
  }

  public async SendMail(
    templateName: string,
    model: any,
    mailOptions: any,
  ): Promise<void> {
    const html = await this.readHTMLTemplate(templateName);
    const template = handlebars.compile(html);
    const htmlToSend = template(model);

    mailOptions.from = mailOptions.from
      ? mailOptions.from
      : appEnv('SMTP_EMAIL');
    mailOptions.html = htmlToSend;
    try {
      await this.transporter.sendMail(mailOptions);
    } catch (e) {
      console.log(e.stack);
      console.log(e.message);
    }
    return null;
  }
}
