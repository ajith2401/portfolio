import test from 'node:test';
import assert from 'node:assert/strict';
import { getClientIP, rateLimit, _resetRateLimitStore } from '../src/lib/rateLimit.js';

const req = (headers) => ({ headers: new Headers(headers) });

test('off Vercel without TRUSTED_PROXY: spoofable headers are ignored', () => {
  assert.equal(getClientIP(req({ 'x-forwarded-for': '6.6.6.6', 'x-real-ip': '7.7.7.7' }), {}), 'unknown');
  assert.equal(getClientIP(req({}), {}), 'unknown');
});
test('on Vercel: platform headers win, in documented order', () => {
  const env = { VERCEL: '1' };
  assert.equal(getClientIP(req({ 'x-vercel-forwarded-for': '1.2.3.4', 'x-forwarded-for': '9.9.9.9', 'x-real-ip': '8.8.8.8' }), env), '1.2.3.4');
  assert.equal(getClientIP(req({ 'x-real-ip': '8.8.8.8', 'x-forwarded-for': '9.9.9.9' }), env), '8.8.8.8');
  assert.equal(getClientIP(req({ 'x-forwarded-for': '9.9.9.9' }), env), '9.9.9.9');
});
test('on Vercel: missing or garbage headers -> unknown, IPv6 accepted', () => {
  const env = { VERCEL: '1' };
  assert.equal(getClientIP(req({}), env), 'unknown');
  assert.equal(getClientIP(req({ 'x-vercel-forwarded-for': '<script>' }), env), 'unknown');
  assert.equal(getClientIP(req({ 'x-vercel-forwarded-for': '999.1.1.1' }), env), 'unknown');
  assert.equal(getClientIP(req({ 'x-vercel-forwarded-for': '2001:DB8::1' }), env), '2001:db8::1');
});
test('TRUSTED_PROXY=n uses the nth entry from the right, not the spoofable left', () => {
  const h = { 'x-forwarded-for': '6.6.6.6, 5.5.5.5, 203.0.113.9' };
  assert.equal(getClientIP(req(h), { TRUSTED_PROXY: '1' }), '203.0.113.9');
  assert.equal(getClientIP(req(h), { TRUSTED_PROXY: 'true' }), '203.0.113.9');
  assert.equal(getClientIP(req(h), { TRUSTED_PROXY: '2' }), '5.5.5.5');
  assert.equal(getClientIP(req(h), { TRUSTED_PROXY: '5' }), 'unknown');
  assert.equal(getClientIP(req({}), { TRUSTED_PROXY: '1' }), 'unknown');
  assert.equal(getClientIP(req(h), { TRUSTED_PROXY: 'abc' }), 'unknown');
});
test('rate limiter: allows limit, blocks next, separate keys independent', () => {
  _resetRateLimitStore();
  for (let i = 0; i < 3; i++) assert.equal(rateLimit('k:a', 3, 1000).allowed, true);
  assert.equal(rateLimit('k:a', 3, 1000).allowed, false);
  assert.equal(rateLimit('k:b', 3, 1000).allowed, true);
});
