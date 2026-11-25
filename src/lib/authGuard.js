// src/lib/authGuard.js
import crypto from 'crypto';
import { NextResponse } from 'next/server';

/**
 * Validates whether the incoming request carries valid administrator credentials.
 * Supports:
 * - Authorization: Bearer <secret>
 * - x-admin-key: <secret>
 * 
 * Compares against process.env.ADMIN_API_KEY ONLY, using constant-time comparison.
 * There is deliberately no fallback to JWT_SECRET: a token-signing secret must never double as a bearer credential,
 * and a missing key must deny (not silently pick another secret).
 * 
 * @param {Request} request 
 * @returns {{ authorized: boolean, error?: string }}
 */
export function verifyAdminAuth(request) {
  const adminSecret = process.env.ADMIN_API_KEY;

  if (!adminSecret || adminSecret.length < 24) {
    // If no secret is configured, deny all administrative mutations by default
    return {
      authorized: false,
      error: 'Administrative access is not configured on this server.'
    };
  }

  const authHeader = request.headers.get('authorization') || '';
  const customHeader = request.headers.get('x-admin-key') || '';

  let providedToken = '';
  if (authHeader.startsWith('Bearer ')) {
    providedToken = authHeader.substring(7).trim();
  } else if (customHeader) {
    providedToken = customHeader.trim();
  }

  if (!providedToken) {
    return {
      authorized: false,
      error: 'Authorization token is required.'
    };
  }

  try {
    // Hash both sides so the comparison is constant-time regardless of the provided length.
    const expectedBuffer = crypto.createHash('sha256').update(adminSecret).digest();
    const providedBuffer = crypto.createHash('sha256').update(providedToken).digest();

    const matches = crypto.timingSafeEqual(expectedBuffer, providedBuffer);
    if (!matches) {
      return {
        authorized: false,
        error: 'Invalid authorization token.'
      };
    }

    return { authorized: true };
  } catch (err) {
    return {
      authorized: false,
      error: 'Authentication failed.'
    };
  }
}

/**
 * Standard 401 Unauthorized response for blocked administrative requests.
 */
export function adminUnauthorizedResponse(message = 'Administrative authentication required') {
  return NextResponse.json(
    { 
      status: 'error',
      code: 'UNAUTHORIZED',
      message 
    },
    { 
      status: 401,
      headers: {
        'WWW-Authenticate': 'Bearer realm="Admin Area"'
      }
    }
  );
}

