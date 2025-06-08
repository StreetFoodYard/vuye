import Constants from 'expo-constants';
import { Platform } from 'react-native';

const vuetApiUrl = Constants.expoConfig?.extra?.vuetApiUrl;

// Helper function to get the base API URL
const getApiBaseUrl = () => {
  if (Platform.OS === 'web') {
    // Check if running on Firebase hosting
    if (typeof window !== 'undefined' &&
      (window.location.hostname.includes('web.app') ||
        window.location.hostname.includes('firebaseapp.com'))) {
      return 'https://api.vuet.app';
    }
    // Local development
    return `/api`;
  }
  // Native app
  return `http://${vuetApiUrl}`;
};

type LoginResponse = {
  access: string;
  refresh: string;
};

type VerifyResponse = {
  detail?: string;
  code?: string;
};

type RefreshResponse = {
  access: string;
  refresh: string;
};

type BlacklistResponse = { success: boolean };

const getTokenAsync = async (
  username: string,
  password: string,
  isEmail: boolean
) => {
  const usernameField = isEmail ? 'email' : 'phone_number';
  const baseUrl = getApiBaseUrl();
  const endpoint = Platform.OS === 'web' && baseUrl === '/api'
    ? `${baseUrl}/auth/token/`
    : `${baseUrl}/auth/token/`;

  const loginResponse: LoginResponse = await fetch(
    endpoint,
    {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        [usernameField]: username,
        password
      })
    }
  )
    .then((response) => {
      const resJson = response.json();
      return resJson;
    })
    .catch((err) => {
      console.log(err);
    });

  return loginResponse;
};

const verifyTokenAsync = async (token: string): Promise<VerifyResponse> => {
  const baseUrl = getApiBaseUrl();
  const endpoint = Platform.OS === 'web' && baseUrl === '/api'
    ? `${baseUrl}/auth/token/verify/`
    : `${baseUrl}/auth/token/verify/`;

  const verifyResponse: VerifyResponse = await fetch(
    endpoint,
    {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ token })
    }
  )
    .then((response) => {
      if (response.ok) {
        return response.json();
      } else {
        throw Error('Failed to verify token');
      }
    })
    .catch((err) => {
      return {
        detail: 'Failed to verify token',
        code: 'failed_to_verify_token'
      };
    });

  return verifyResponse;
};

const refreshTokenAsync = async (refreshToken: string) => {
  const baseUrl = getApiBaseUrl();
  const endpoint = Platform.OS === 'web' && baseUrl === '/api'
    ? `${baseUrl}/auth/token/refresh/`
    : `${baseUrl}/auth/token/refresh/`;

  const refreshResponse: RefreshResponse = await fetch(
    endpoint,
    {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ refresh: refreshToken })
    }
  )
    .then((response) => {
      if (response.ok) {
        return response.json();
      } else {
        throw Error('Failed to refresh token');
      }
    })
    .catch((err) => {
      return {
        detail: 'Failed to refresh token',
        code: 'failed_to_refresh_token'
      };
    });

  return refreshResponse;
};

const blacklistTokenAsync = async (refreshToken: string) => {
  const baseUrl = getApiBaseUrl();
  const endpoint = Platform.OS === 'web' && baseUrl === '/api'
    ? `${baseUrl}/auth/token/blacklist/`
    : `${baseUrl}/auth/token/blacklist/`;

  const refreshResponse: BlacklistResponse = await fetch(
    endpoint,
    {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ refresh: refreshToken })
    }
  )
    .then((response) => response.json())
    .catch((err) => {
      console.log(err);
    });

  return refreshResponse;
};

export {
  getTokenAsync,
  verifyTokenAsync,
  refreshTokenAsync,
  blacklistTokenAsync
};
