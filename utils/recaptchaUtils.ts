import Constants from 'expo-constants';
import { Platform } from 'react-native';

// reCAPTCHA constants
const RECAPTCHA_SITE_KEY = '6LdSrFkrAAAAJZ6JdoO9fznEUzF0PwnfvYxYBOF';
const RECAPTCHA_SECRET_KEY = '6LdSrFkrAAAAAMcSDWja_6JFqabUEhFioBxYo8m6';

/**
 * Verifies a reCAPTCHA token with Google's API
 * 
 * @param token The reCAPTCHA token to verify
 * @returns A promise that resolves to the verification result
 */
export const verifyReCaptchaToken = async (token: string): Promise<{ success: boolean; score?: number; }> => {
    try {
        const response = await fetch('https://www.google.com/recaptcha/api/siteverify', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: `secret=${RECAPTCHA_SECRET_KEY}&response=${token}`,
        });

        const data = await response.json();
        return {
            success: data.success === true,
            score: data.score, // Only available with reCAPTCHA v3
        };
    } catch (error) {
        console.error('reCAPTCHA verification error:', error);
        return { success: false };
    }
};

/**
 * Returns the reCAPTCHA site key
 */
export const getReCaptchaSiteKey = (): string => {
    return RECAPTCHA_SITE_KEY;
};

/**
 * Determines if the app is running in an environment where reCAPTCHA is needed
 */
export const shouldUseReCaptcha = (): boolean => {
    // Only use reCAPTCHA on web
    return Platform.OS === 'web';
}; 