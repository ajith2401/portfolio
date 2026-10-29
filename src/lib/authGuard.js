// src/lib/authGuard.js
import crypto from 'crypto';
import { NextResponse } from 'next/server';

/**
 * Validates whether the incoming request carries valid administrator credentials.
 * Supports:
 * - Authorization: Bearer <secret>
 * - x-admin-key: <secret>
 * 
 * Compares against process.env.ADMIN_API_KEY or process.env.JWT_SECRET
 * using constant-time comparison to prevent timing attacks.
 * 
 * @param {Request} request 
 * @returns {{ authorized: boolean, error?: string }}
 */
export function verifyAdminAuth(request) {
  const adminSecret = process.env.ADMIN_API_KEY || process.env.JWT_SECRET;
  
  if (!adminSecret) {
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
    const expectedBuffer = Buffer.from(adminSecret);
    const providedBuffer = Buffer.from(providedToken);

    if (expectedBuffer.length !== providedBuffer.length) {
      return {
        authorized: false,
        error: 'Invalid authorization token.'
      };
    }

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

