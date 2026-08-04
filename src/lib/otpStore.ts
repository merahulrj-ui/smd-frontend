type OTPData = { otp: string, expires: number, name: string, phone: string };

const globalForOTP = globalThis as unknown as {
    otpStore: Map<string, OTPData> | undefined
}

export const otpStore = globalForOTP.otpStore ?? new Map<string, OTPData>();

if (process.env.NODE_ENV !== 'production') globalForOTP.otpStore = otpStore;
