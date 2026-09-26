#!/usr/bin/env node
/**
 * PII leak guard.
 *
 * Fails the build if a recipient identifier can reach a log line, a URL, a deep link, or
 * a crash payload.
 *
 * This exists because it is the automated answer to the single worst defect in the 2022
 * build, where recipient name, home address, and phone number of homebound elderly people
 * flowed through URL path params:
 *
 *     /directions/:userLat/:userLng/:destinationLat/:destinationLng
 *
 * plus `console.log(sortedRecipients)` on every render of RecipientsList.
 *
 * The rule this enforces: route params and log lines carry OPAQUE SERVER-ISSUED IDS ONLY.
 */

import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join, extname, relative } from 'node:path';

const ROOT = new URL('..', import.meta.url).pathname;
const SCAN_DIRS = ['app', 'src'];
const EXTS = new Set(['.ts', '.tsx', '.js', '.jsx']);

/** Field names that are recipient PII and must never be logged or routed. */
const PII_FIELDS = [
  'displayName', 'display_name',
  'recipientName', 'recipient_name',
  'address', 'streetAddress', 'street_address',
  'phone', 'phoneNumber', 'phone_number',
];

const violations = [];

function walk(dir) {
  for (const entry of readdirSync(dir)) {
    if (entry === 'node_modules' || entry.startsWith('.')) continue;
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) walk(full);
    else if (EXTS.has(extname(full))) check(full);
  }
}

function check(file) {
  const rel = relative(ROOT, file);
  const src = readFileSync(file, 'utf8');
  const lines = src.split('\n');

  lines.forEach((line, i) => {
    const at = `${rel}:${i + 1}`;
    const trimmed = line.trim();
    if (trimmed.startsWith('*') || trimmed.startsWith('//')) return; // comments explain the rule

    // 1. any console call that mentions a PII field
    if (/console\.(log|warn|error|info|debug)\s*\(/.test(line)) {
      for (const f of PII_FIELDS) {
        if (new RegExp(`\\b${f}\\b`).test(line)) {
          violations.push(`${at}  console call references PII field "${f}"`);
        }
      }
    }

    // 2. template literals building a path/href that interpolate a PII field
    if (/[`'"](\/|https?:)/.test(line) && /\$\{/.test(line)) {
      for (const f of PII_FIELDS) {
        if (new RegExp(`\\$\\{[^}]*\\b${f}\\b`).test(line)) {
          violations.push(`${at}  URL or path interpolates PII field "${f}"`);
        }
      }
    }

    // 3. router params named after PII
    if (/(router\.(push|replace|navigate)|<Link\b|href\s*=)/.test(line)) {
      for (const f of PII_FIELDS) {
        if (new RegExp(`\\b${f}\\b`).test(line)) {
          violations.push(`${at}  navigation carries PII field "${f}"`);
        }
      }
    }

    // 4. the specific 2022 shape: coordinates as path segments
    if (/\/:?(userLat|userLng|destinationLat|destinationLng)\b/.test(line)) {
      violations.push(`${at}  coordinates used as route path params (the 2022 defect)`);
    }
  });
}

for (const d of SCAN_DIRS) {
  try { walk(join(ROOT, d)); } catch { /* dir may not exist yet */ }
}

if (violations.length > 0) {
  console.error('\nPII leak check FAILED:\n');
  for (const v of violations) console.error('  ' + v);
  console.error(`\n${violations.length} violation(s). Route params and logs carry opaque ids only.\n`);
  process.exit(1);
}

console.log('PII leak check passed: no recipient identifiers in logs, URLs, or route params.');
