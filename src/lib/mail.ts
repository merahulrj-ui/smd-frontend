import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.MAIL_HOST || 'smtp.hostinger.com',
  port: parseInt(process.env.MAIL_PORT || '465'),
  secure: true, // true for 465, false for other ports
  auth: {
    user: process.env.MAIL_USERNAME || 'info@smdmedicare.in',
    pass: process.env.MAIL_PASSWORD || 'Rahul@6726',
  },
});

export const sendMail = async ({
  to,
  subject,
  html,
}: {
  to?: string;
  subject: string;
  html: string;
}) => {
  try {
    const info = await transporter.sendMail({
      from: `"${process.env.MAIL_FROM_NAME || 'SMD Medicare'}" <${process.env.MAIL_FROM_ADDRESS || 'info@smdmedicare.in'}>`,
      to: to || process.env.MAIL_FROM_ADDRESS || 'info@smdmedicare.in',
      subject,
      html,
    });
    console.log('Message sent: %s', info.messageId);
    return true;
  } catch (error) {
    console.error('Error sending email:', error);
    return false;
  }
};
