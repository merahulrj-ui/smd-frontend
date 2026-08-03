"use server";

import pool from '@/lib/db';
import { revalidatePath } from 'next/cache';
import nodemailer from 'nodemailer';
import { isAdmin } from '@/lib/adminAuth';

export async function deleteEnquiryAction(id: number) {
    if (!(await isAdmin())) return { error: 'Unauthorized access' };
    try {
        await pool.query('DELETE FROM enquiries WHERE id = ?', [id]);
        revalidatePath('/admin/enquiries');
        return { success: true };
    } catch (e: any) {
        console.error("Error deleting enquiry:", e);
        return { error: 'Database delete failed' };
    }
}

export async function replyEnquiryAction(formData: FormData) {
    if (!(await isAdmin())) return { error: 'Unauthorized access' };
    const id = formData.get('id') as string;
    const email = formData.get('email') as string;
    const subject = formData.get('subject') as string;
    const message = formData.get('message') as string;

    if (!email || !subject || !message) {
        return { error: 'Please fill in all fields' };
    }

    try {
        // You should move these credentials to .env.local for production
        const smtpUser = process.env.SMTP_USER;
        const smtpPass = process.env.SMTP_PASS;

        if (process.env.NODE_ENV === 'production' && (!smtpUser || !smtpPass)) {
            throw new Error('SMTP credentials are not configured in production.');
        }

        const transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST || 'smtp.gmail.com',
            port: Number(process.env.SMTP_PORT) || 587,
            secure: false,
            auth: {
                user: smtpUser || 'development-user',
                pass: smtpPass || 'development-pass',
            },
        });

        await transporter.sendMail({
            from: `"SMD Team" <${process.env.SMTP_USER || 'your-email@gmail.com'}>`,
            to: email,
            subject: subject,
            text: message,
            html: `<div style="font-family: sans-serif; color: #333;"><p>${message.replace(/\n/g, '<br/>')}</p><br/><hr/><p><strong>SMD Management Team</strong></p></div>`,
        });

        // Optionally mark the enquiry as replied in DB
        // await pool.query('UPDATE enquiries SET status = ? WHERE id = ?', ['replied', id]);

        revalidatePath('/admin/enquiries');
        return { success: true };
    } catch (e: any) {
        console.error("Error sending reply:", e);
        return { error: e.message || 'Failed to send email' };
    }
}
