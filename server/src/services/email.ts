import nodemailer from 'nodemailer';
import path from 'path';
import fs from 'fs';
import Handlebars from 'handlebars';
import { config } from '../config/env';

const transporter = nodemailer.createTransport({
  host: config.smtp.host,
  port: config.smtp.port,
  secure: config.smtp.port === 465,
  auth: {
    user: config.smtp.user,
    pass: config.smtp.pass,
  },
});

const loadTemplate = (name: string, variables: Record<string, string>): string => {
  const templatePath = path.join(__dirname, '../templates', `${name}.hbs`);
  if (fs.existsSync(templatePath)) {
    const source = fs.readFileSync(templatePath, 'utf-8');
    const template = Handlebars.compile(source);
    return template(variables);
  }
  // Inline fallback if template file doesn't exist yet
  return inlineFallback(name, variables);
};

const inlineFallback = (name: string, vars: Record<string, string>): string => {
  const styles = `
    font-family: 'Georgia', serif; max-width: 600px; margin: 0 auto;
    background: #FFFFF0; padding: 40px;
  `;
  const gold = '#D4AF37';
  const green = '#1B4D3E';

  const templates: Record<string, string> = {
    'verify-email': `
      <div style="${styles}">
        <h1 style="color:${green}; font-size:28px; margin-bottom:4px;">DARBAR</h1>
        <p style="color:${gold}; font-size:12px; letter-spacing:4px; margin-top:0;">LUXURY FASHION</p>
        <hr style="border-color:${gold}; opacity:0.3; margin:24px 0;" />
        <h2 style="color:#333;">Verify your email address</h2>
        <p style="color:#555; line-height:1.6;">
          Welcome to Darbar, ${vars.name}. Please verify your email address to complete your registration.
        </p>
        <a href="${vars.url}" style="
          display:inline-block; background:${gold}; color:#fff;
          padding:14px 32px; border-radius:4px; text-decoration:none;
          font-family:sans-serif; font-size:14px; margin:24px 0;
        ">Verify Email Address</a>
        <p style="color:#999; font-size:12px;">
          This link expires in 24 hours. If you did not create an account, please ignore this email.
        </p>
      </div>`,
    'reset-password': `
      <div style="${styles}">
        <h1 style="color:${green}; font-size:28px; margin-bottom:4px;">DARBAR</h1>
        <p style="color:${gold}; font-size:12px; letter-spacing:4px; margin-top:0;">LUXURY FASHION</p>
        <hr style="border-color:${gold}; opacity:0.3; margin:24px 0;" />
        <h2 style="color:#333;">Reset your password</h2>
        <p style="color:#555; line-height:1.6;">
          Hello ${vars.name}, we received a request to reset your Darbar account password.
        </p>
        <a href="${vars.url}" style="
          display:inline-block; background:${gold}; color:#fff;
          padding:14px 32px; border-radius:4px; text-decoration:none;
          font-family:sans-serif; font-size:14px; margin:24px 0;
        ">Reset Password</a>
        <p style="color:#999; font-size:12px;">
          This link expires in 1 hour. If you did not request a password reset, please ignore this email.
        </p>
      </div>`,
    'order-confirmation': `
      <div style="${styles}">
        <h1 style="color:${green}; font-size:28px; margin-bottom:4px;">DARBAR</h1>
        <p style="color:${gold}; font-size:12px; letter-spacing:4px; margin-top:0;">LUXURY FASHION</p>
        <hr style="border-color:${gold}; opacity:0.3; margin:24px 0;" />
        <h2 style="color:#333;">Order Confirmed</h2>
        <p style="color:#555; line-height:1.6;">
          Thank you, ${vars.name}. Your order <strong>#${vars.orderNumber}</strong> has been confirmed.
        </p>
        <p style="color:#555;">Total: <strong>₹${vars.total}</strong></p>
        <p style="color:#999; font-size:12px; margin-top:32px;">
          You will receive a shipping update once your order is dispatched.
        </p>
      </div>`,
  };

  return templates[name] || `<p>Email from Darbar</p>`;
};

interface SendEmailOptions {
  to: string;
  subject: string;
  template?: string;
  html?: string;
  variables?: Record<string, string>;
}

export const sendEmail = async (options: SendEmailOptions): Promise<void> => {
  let html = options.html;
  if (!html && options.template) {
    html = loadTemplate(options.template, options.variables || {});
  }

  await transporter.sendMail({
    from: config.smtp.from,
    to: options.to,
    subject: options.subject,
    html,
  });
};

export const sendVerificationEmail = async (
  email: string,
  name: string,
  token: string
): Promise<void> => {
  const url = `${config.clientUrl}/verify-email/${token}`;
  await sendEmail({
    to: email,
    subject: 'Verify your Darbar account',
    template: 'verify-email',
    variables: { name, url },
  });
};

export const sendPasswordResetEmail = async (
  email: string,
  name: string,
  token: string
): Promise<void> => {
  const url = `${config.clientUrl}/reset-password/${token}`;
  await sendEmail({
    to: email,
    subject: 'Reset your Darbar password',
    template: 'reset-password',
    variables: { name, url },
  });
};

export const sendOrderConfirmationEmail = async (
  email: string,
  name: string,
  orderNumber: string,
  total: string
): Promise<void> => {
  await sendEmail({
    to: email,
    subject: `Order Confirmed — #${orderNumber}`,
    template: 'order-confirmation',
    variables: { name, orderNumber, total },
  });
};
