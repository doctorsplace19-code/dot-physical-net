import { readFileSync, writeFileSync, readdirSync } from 'fs'
import { join } from 'path'

const DIR = 'C:/Users/chant/Documents/dot-physical-net'

// Old nav block (exact match across all files)
const OLD_NAV = `  <ul class="nav-links">
    <li><a href="services.html">Services</a></li>
    <li><a href="employers.html">Employers</a></li>
    <li><a href="who-we-serve.html">Locations</a></li>
    <li><a href="about.html">About</a></li>
    <li><a href="blog.html">Blog</a></li>
    <li><a href="contact.html">Contact Us</a></li>
    <li><a href="book.html">Book Now</a></li>
    <li><a href="http://portal.dot-physical.net" class="nav-cta" target="_blank" rel="noopener">Employer Portal</a></li>
  </ul>`

// New condensed nav with Company dropdown
const NEW_NAV = `  <ul class="nav-links">
    <li><a href="services.html">Services</a></li>
    <li><a href="employers.html">Employers</a></li>
    <li><a href="who-we-serve.html">Locations</a></li>
    <li class="nav-has-dropdown">
      <a href="#" class="nav-dropdown-toggle" onclick="return false;">Company <svg width="10" height="6" viewBox="0 0 10 6" fill="none" style="display:inline-block;vertical-align:middle;margin-left:2px;"><path d="M1 1l4 4 4-4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg></a>
      <ul class="nav-dropdown">
        <li><a href="about.html">About Us</a></li>
        <li><a href="blog.html">Blog</a></li>
        <li><a href="contact.html">Contact Us</a></li>
      </ul>
    </li>
    <li><a href="book.html" class="nav-book">Book Now</a></li>
    <li><a href="http://portal.dot-physical.net" class="nav-cta" target="_blank" rel="noopener">Employer Portal</a></li>
  </ul>`

// CSS to inject — replaces or appends after existing .nav-links rules
const DROPDOWN_CSS = `
  .nav-has-dropdown{position:relative}
  .nav-dropdown-toggle{display:flex;align-items:center;gap:4px;cursor:pointer}
  .nav-dropdown{display:none;position:absolute;top:calc(100% + 12px);left:50%;transform:translateX(-50%);background:#fff;border:1px solid rgba(26,86,219,0.12);border-radius:12px;box-shadow:0 8px 32px rgba(26,86,219,0.13);padding:0.5rem;min-width:160px;list-style:none;z-index:200}
  .nav-dropdown li a{display:block;padding:0.6rem 1rem;color:var(--body,#3D5280);font-size:0.875rem;text-decoration:none;border-radius:8px;white-space:nowrap;transition:background 0.15s,color 0.15s}
  .nav-dropdown li a:hover{background:var(--accent-light,#EBF0FF);color:var(--accent,#1A56DB)}
  .nav-has-dropdown:hover .nav-dropdown{display:block}
  .nav-book{background:var(--accent-light,#EBF0FF)!important;color:var(--accent,#1A56DB)!important;padding:0.5rem 1.2rem!important;border-radius:100px!important;font-weight:600!important}`

// Marker to avoid double-injection
const DROPDOWN_MARKER = '/* nav-dropdown-injected */'

const files = readdirSync(DIR).filter(f => f.endsWith('.html'))
let updated = 0, skipped = 0

for (const file of files) {
  const path = join(DIR, file)
  let html = readFileSync(path, 'utf8')

  if (!html.includes(OLD_NAV)) { skipped++; continue }

  // Replace nav
  html = html.replace(OLD_NAV, NEW_NAV)

  // Inject dropdown CSS if not already there
  if (!html.includes(DROPDOWN_MARKER)) {
    // Insert before closing </style> of the first <style> block
    html = html.replace('</style>', DROPDOWN_CSS + '\n  ' + DROPDOWN_MARKER + '\n</style>')
  }

  writeFileSync(path, html, 'utf8')
  updated++
}

console.log(`Updated: ${updated} files, Skipped: ${skipped} files`)
