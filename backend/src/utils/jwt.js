import "dotenv/config";
import jsonWebToken from "jsonwebtoken";

// Cache untuk token verification (simple in-memory cache)
const tokenCache = new Map();
const CACHE_TTL = 5 * 60 * 1000; // 5 menit

// Helper function untuk cache management
const getCachedToken = (token) => {
  const cached = tokenCache.get(token);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return cached.data;
  }
  tokenCache.delete(token);
  return null;
};

const setCachedToken = (token, data) => {
  tokenCache.set(token, {
    data,
    timestamp: Date.now()
  });
};

// Cleanup cache setiap 10 menit
setInterval(() => {
  const now = Date.now();
  for (const [token, value] of tokenCache.entries()) {
    if (now - value.timestamp > CACHE_TTL) {
      tokenCache.delete(token);
    }
  }
}, 10 * 60 * 1000);

export const generateAccessToken = (user) => {
  try {
    return jsonWebToken.sign(
      { 
        id: user.id, 
        email: user.email,
        role: user.role || 'user'
      }, 
      process.env.JWT_SECRET, 
      {
        expiresIn: process.env.JWT_EXPIRES_IN || "15m",
        issuer: 'realtime-app',
        audience: 'realtime-users'
      }
    );
  } catch (error) {
    throw new Error('Failed to generate access token');
  }
};

export const generateRefreshToken = (user) => {
  try {
    return jsonWebToken.sign(
      { 
        id: user.id,
        type: 'refresh'
      }, 
      process.env.JWT_REFRESH_SECRET, 
      {
        expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || "7d",
        issuer: 'realtime-app',
        audience: 'realtime-users'
      }
    );
  } catch (error) {
    throw new Error('Failed to generate refresh token');
  }
};

export const verifyRefreshToken = (token) => {
  try {
    // Check cache first
    const cached = getCachedToken(`refresh_${token}`);
    if (cached) return cached;

    const decoded = jsonWebToken.verify(token, process.env.JWT_REFRESH_SECRET);
    setCachedToken(`refresh_${token}`, decoded);
    return decoded;
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      throw new Error('Refresh token expired');
    }
    if (error.name === 'JsonWebTokenError') {
      throw new Error('Invalid refresh token');
    }
    throw new Error('Token verification failed');
  }
};

export const verifyAccessToken = (token) => {
  try {
    // Check cache first
    const cached = getCachedToken(`access_${token}`);
    if (cached) return cached;

    const decoded = jsonWebToken.verify(token, process.env.JWT_SECRET);
    setCachedToken(`access_${token}`, decoded);
    return decoded;
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      throw new Error('Access token expired');
    }
    if (error.name === 'JsonWebTokenError') {
      throw new Error('Invalid access token');
    }
    throw new Error('Token verification failed');
  }
};

export const parseJWT = (token) => {
  try {
    return JSON.parse(Buffer.from(token.split(".")[1], "base64").toString());
  } catch (error) {
    throw new Error('Invalid JWT format');
  }
};

// Utility function untuk decode token tanpa verification
export const decodeToken = (token) => {
  try {
    return jsonWebToken.decode(token);
  } catch (error) {
    return null;
  }
};
