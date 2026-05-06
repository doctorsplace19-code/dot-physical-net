// Google Indexing API — submit all site URLs at once
// Setup: see README below, then run: node submit-to-google.mjs

import { readFileSync } from 'fs'
import { createSign } from 'crypto'

// ── CONFIGURATION ─────────────────────────────────────────
// Put your downloaded service account JSON file in this folder
// and update the filename below:
const SERVICE_ACCOUNT_FILE = './google-service-account.json'

// All URLs to submit
const URLS = [
  // Core pages
  'https://www.dot-physical.net/',
  'https://www.dot-physical.net/services.html',
  'https://www.dot-physical.net/drug-testing.html',
  'https://www.dot-physical.net/titers.html',
  'https://www.dot-physical.net/ctpa.html',
  'https://www.dot-physical.net/employers.html',
  'https://www.dot-physical.net/dot-physical.html',
  'https://www.dot-physical.net/mro.html',
  'https://www.dot-physical.net/random-pool.html',
  'https://www.dot-physical.net/cost-of-services.html',
  'https://www.dot-physical.net/book.html',
  'https://www.dot-physical.net/about.html',
  'https://www.dot-physical.net/contact.html',
  'https://www.dot-physical.net/blog.html',
  'https://www.dot-physical.net/who-we-serve.html',
  // Blog posts
  'https://www.dot-physical.net/post-dot-physical-exam.html',
  'https://www.dot-physical.net/post-prescription-meds.html',
  'https://www.dot-physical.net/post-compliance-audit.html',
  'https://www.dot-physical.net/post-return-to-duty.html',
  'https://www.dot-physical.net/post-blood-pressure-cdl.html',
  'https://www.dot-physical.net/post-owner-operator-compliance.html',
  'https://www.dot-physical.net/post-clearinghouse-guide.html',
  'https://www.dot-physical.net/post-medical-certificate.html',
  // All 50 state pages
  'https://www.dot-physical.net/dot-physical-alabama.html',
  'https://www.dot-physical.net/dot-physical-alaska.html',
  'https://www.dot-physical.net/dot-physical-arizona.html',
  'https://www.dot-physical.net/dot-physical-arkansas.html',
  'https://www.dot-physical.net/dot-physical-california.html',
  'https://www.dot-physical.net/dot-physical-colorado.html',
  'https://www.dot-physical.net/dot-physical-connecticut.html',
  'https://www.dot-physical.net/dot-physical-delaware.html',
  'https://www.dot-physical.net/dot-physical-florida.html',
  'https://www.dot-physical.net/dot-physical-georgia.html',
  'https://www.dot-physical.net/dot-physical-hawaii.html',
  'https://www.dot-physical.net/dot-physical-idaho.html',
  'https://www.dot-physical.net/dot-physical-illinois.html',
  'https://www.dot-physical.net/dot-physical-indiana.html',
  'https://www.dot-physical.net/dot-physical-iowa.html',
  'https://www.dot-physical.net/dot-physical-kansas.html',
  'https://www.dot-physical.net/dot-physical-kentucky.html',
  'https://www.dot-physical.net/dot-physical-louisiana.html',
  'https://www.dot-physical.net/dot-physical-maine.html',
  'https://www.dot-physical.net/dot-physical-maryland.html',
  'https://www.dot-physical.net/dot-physical-massachusetts.html',
  'https://www.dot-physical.net/dot-physical-michigan.html',
  'https://www.dot-physical.net/dot-physical-minnesota.html',
  'https://www.dot-physical.net/dot-physical-mississippi.html',
  'https://www.dot-physical.net/dot-physical-missouri.html',
  'https://www.dot-physical.net/dot-physical-montana.html',
  'https://www.dot-physical.net/dot-physical-nebraska.html',
  'https://www.dot-physical.net/dot-physical-nevada.html',
  'https://www.dot-physical.net/dot-physical-new-hampshire.html',
  'https://www.dot-physical.net/dot-physical-new-jersey.html',
  'https://www.dot-physical.net/dot-physical-new-mexico.html',
  'https://www.dot-physical.net/dot-physical-new-york.html',
  'https://www.dot-physical.net/dot-physical-north-carolina.html',
  'https://www.dot-physical.net/dot-physical-north-dakota.html',
  'https://www.dot-physical.net/dot-physical-ohio.html',
  'https://www.dot-physical.net/dot-physical-oklahoma.html',
  'https://www.dot-physical.net/dot-physical-oregon.html',
  'https://www.dot-physical.net/dot-physical-pennsylvania.html',
  'https://www.dot-physical.net/dot-physical-rhode-island.html',
  'https://www.dot-physical.net/dot-physical-south-carolina.html',
  'https://www.dot-physical.net/dot-physical-south-dakota.html',
  'https://www.dot-physical.net/dot-physical-tennessee.html',
  'https://www.dot-physical.net/dot-physical-texas.html',
  'https://www.dot-physical.net/dot-physical-utah.html',
  'https://www.dot-physical.net/dot-physical-vermont.html',
  'https://www.dot-physical.net/dot-physical-virginia.html',
  'https://www.dot-physical.net/dot-physical-washington.html',
  'https://www.dot-physical.net/dot-physical-west-virginia.html',
  'https://www.dot-physical.net/dot-physical-wisconsin.html',
  'https://www.dot-physical.net/dot-physical-wyoming.html',
  'https://www.dot-physical.net/dot-physical-puerto-rico.html',
]

// ── JWT AUTH (no extra packages needed) ──────────────────
function base64url(str) {
  return Buffer.from(str).toString('base64')
    .replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '')
}

async function getAccessToken(sa) {
  const now   = Math.floor(Date.now() / 1000)
  const claim = {
    iss:   sa.client_email,
    scope: 'https://www.googleapis.com/auth/indexing',
    aud:   'https://oauth2.googleapis.com/token',
    iat:   now,
    exp:   now + 3600,
  }
  const header  = base64url(JSON.stringify({ alg: 'RS256', typ: 'JWT' }))
  const payload = base64url(JSON.stringify(claim))
  const toSign  = `${header}.${payload}`
  const sign    = createSign('RSA-SHA256')
  sign.update(toSign)
  const sig = sign.sign(sa.private_key, 'base64')
    .replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '')
  const jwt = `${toSign}.${sig}`

  const res  = await fetch('https://oauth2.googleapis.com/token', {
    method:  'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body:    `grant_type=urn%3Aietf%3Aparams%3Aoauth%3Agrant-type%3Ajwt-bearer&assertion=${jwt}`,
  })
  const data = await res.json()
  if (!data.access_token) throw new Error('Auth failed: ' + JSON.stringify(data))
  return data.access_token
}

// ── SUBMIT ────────────────────────────────────────────────
async function submit(token, url) {
  const res  = await fetch('https://indexing.googleapis.com/v3/urlNotifications:publish', {
    method:  'POST',
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    body:    JSON.stringify({ url, type: 'URL_UPDATED' }),
  })
  const data = await res.json()
  if (res.ok) {
    console.log(`✅  ${url}`)
  } else {
    console.log(`❌  ${url} — ${data.error?.message ?? JSON.stringify(data)}`)
  }
}

// ── MAIN ──────────────────────────────────────────────────
async function main() {
  let sa
  try {
    sa = JSON.parse(readFileSync(SERVICE_ACCOUNT_FILE, 'utf8'))
  } catch {
    console.error(`\n❌ Could not read ${SERVICE_ACCOUNT_FILE}`)
    console.error('   Make sure you downloaded the service account JSON and placed it in this folder.\n')
    process.exit(1)
  }

  console.log(`\nAuthenticating as ${sa.client_email}...`)
  const token = await getAccessToken(sa)
  console.log(`✓ Authenticated\n`)
  console.log(`Submitting ${URLS.length} URLs to Google Indexing API...\n`)

  // Submit in batches of 10 with a small delay to avoid rate limits
  for (let i = 0; i < URLS.length; i++) {
    await submit(token, URLS[i])
    if ((i + 1) % 10 === 0 && i + 1 < URLS.length) {
      console.log('  (pausing 2s...)')
      await new Promise(r => setTimeout(r, 2000))
    }
  }

  console.log(`\n✓ Done! Submitted ${URLS.length} URLs.`)
  console.log('  Google typically indexes within a few hours to 1 day.\n')
}

main().catch(err => { console.error(err); process.exit(1) })
