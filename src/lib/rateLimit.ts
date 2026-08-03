// Basic In-Memory Rate Limiter for Next.js App
// Useful for preventing basic DDoS, OTP Bombing, and Brute Force attacks.

type RateLimitData = {
    count: number;
    resetAt: number;
};

// Store for IP-based global rate limiting
export const ipRateLimitStore = new Map<string, RateLimitData>();

// Store for Account Lockouts (e.g. 5 failed OTP attempts)
export const emailLockoutStore = new Map<string, { attempts: number, lockedUntil: number }>();

/**
 * Checks if a specific key (like an IP address) has exceeded the max allowed hits in the given time window.
 * @param key Unique identifier (e.g., 'send_otp_127.0.0.1')
 * @param limit Max number of requests allowed
 * @param windowMs Time window in milliseconds (e.g., 60000 for 1 minute)
 */
export function checkRateLimit(key: string, limit: number, windowMs: number): { allowed: boolean, remaining: number } {
    const now = Date.now();
    const data = ipRateLimitStore.get(key);

    if (!data) {
        ipRateLimitStore.set(key, { count: 1, resetAt: now + windowMs });
        return { allowed: true, remaining: limit - 1 };
    }

    if (now > data.resetAt) {
        // Time window passed, reset count
        ipRateLimitStore.set(key, { count: 1, resetAt: now + windowMs });
        return { allowed: true, remaining: limit - 1 };
    }

    if (data.count >= limit) {
        return { allowed: false, remaining: 0 };
    }

    data.count += 1;
    ipRateLimitStore.set(key, data);
    return { allowed: true, remaining: limit - data.count };
}
