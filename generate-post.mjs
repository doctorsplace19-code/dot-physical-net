// generate-post.mjs
// Called by GitHub Actions weekly to create a new DOT compliance blog post.
// Requires: ANTHROPIC_API_KEY, POSTMARK_API_TOKEN environment variables

import fs from 'fs'
import path from 'path'

const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY
if (!ANTHROPIC_API_KEY) {
  console.error('Missing ANTHROPIC_API_KEY')
  process.exit(1)
}

const POSTMARK_API_TOKEN = process.env.POSTMARK_API_TOKEN
const SITE_URL = 'https://www.dot-physical.net'
const FROM_EMAIL = 'info@dot-physical.net'
const FROM_NAME = 'DOT Physical'

// Topics that rotate to keep content fresh — Claude picks the angle within each
const TOPIC_POOL = [
  'FMCSA medical certificate renewal tips for CDL drivers',
  'DOT drug testing regulations for employers',
  'Random drug testing consortium requirements for owner-operators',
  'How to prepare for a DOT physical exam',
  'Disqualifying medical conditions for CDL drivers and exemptions',
  'FMCSA Clearinghouse employer obligations',
  'Return to Duty process after a positive DOT drug test',
  'Oral fluid drug testing under DOT rules',
  'Sleep apnea and CDL certification requirements',
  'Vision and hearing standards for commercial drivers',
  'DOT physical exam for non-FMCSA agencies (FAA, FRA, FTA)',
  'Pre-employment DOT drug test requirements',
  'Post-accident drug and alcohol testing rules',
  'Reasonable suspicion testing: what supervisors must know',
  'MRO review process for positive drug test results',
  'CDL medical card exemptions and waivers',
  'DOT physical frequency: when drivers must be re-examined',
  'Diabetes and insulin use for commercial drivers',
  'Cardiovascular conditions and CDL certification',
  'Mental health medications and DOT physical standards',
]

// Read existing slugs from blog.html to avoid duplicates this week
function getExistingSlugs() {
  const blogHtml = fs.readFileSync('blog.html', 'utf8')
  const matches = blogHtml.match(/href="(post-[^"]+)"/g) || []
  return matches.map(m => m.replace('href="', '').replace('"', ''))
}

// Pick a topic not recently covered
function pickTopic(existingSlugs) {
  // Use day-of-year as seed for topic rotation
  const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0)) / 86400000)
  const idx = dayOfYear % TOPIC_POOL.length
  return TOPIC_POOL[idx]
}

// Call Claude API to generate the post
async function generatePost(topic) {
  const today = new Date()
  const dateStr = today.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
  const dateISO = today.toISOString().split('T')[0]

  const prompt = `You are writing a blog post for DOT Physical (dot-physical.net), a DOT medical examination and drug testing service in New Jersey.

Write a comprehensive, authoritative blog post about: "${topic}"

The post must follow this EXACT JSON structure (return ONLY valid JSON, no markdown fences):

{
  "slug": "post-[kebab-case-title]",
  "title": "Full SEO-optimized title",
  "excerpt": "2-sentence excerpt for the blog listing (under 180 chars)",
  "category": "One of: DOT Physical | Drug Testing | Compliance | Employer Guide | Random Testing | Return to Duty",
  "emoji": "Single relevant emoji for the post icon",
  "iconBg": "One of: var(--teal-light) | var(--accent-light) | #FEE2E2 | #FEF9C3 | #FCE7F3 | #E0F2FE",
  "readTime": "X min read",
  "tags": ["Tag1", "Tag2", "Tag3"],
  "tocItems": [
    {"id": "section-id", "label": "Section heading text"}
  ],
  "bodyHtml": "Full article HTML using only these elements: <h2 id='...'>, <h3>, <p>, <ul><li>, <ol><li>, <strong>, <a href='...'>, <table class='data-table'><thead><tr><th>, <tbody><tr><td>, <div class='callout'><strong>Callout title</strong>text</div>, <div class='callout callout-teal'>. NO other elements or classes. Minimum 800 words."
}

Requirements:
- Write for CDL drivers and fleet managers in New Jersey / the tri-state area
- Cite specific FMCSA regulations (49 CFR sections) where applicable
- Include at least one practical data table or callout box
- End with a paragraph mentioning DOT Physical's services and linking to book.html
- Date: ${dateStr}
- Slug must start with "post-" and use only lowercase letters, numbers, and hyphens`

  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'x-api-key': ANTHROPIC_API_KEY,
      'anthropic-version': '2023-06-01',
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      model: 'claude-opus-4-6',
      max_tokens: 8192,
      messages: [{ role: 'user', content: prompt }],
    }),
  })

  if (!response.ok) {
    const err = await response.text()
    throw new Error(`Claude API error ${response.status}: ${err}`)
  }

  const data = await response.json()
  const raw = data.content[0].text.trim()

  // Strip markdown fences if present
  const jsonStr = raw.startsWith('```') ? raw.replace(/^```[a-z]*\n?/, '').replace(/\n?```$/, '') : raw
  return JSON.parse(jsonStr)
}

// Build the full post HTML from the generated data
function buildPostHtml(post, dateStr) {
  const tagsHtml = post.tags.map(t => `<a href="blog.html" class="post-tag">${t}</a>`).join('\n          ')
  const tocHtml = post.tocItems.map((item, i) =>
    `<li><a href="#${item.id}"><span class="toc-num">${String(i + 1).padStart(2, '0')}</span>${item.label}</a></li>`
  ).join('\n            ')
  const metaTagsHtml = post.tags.slice(0, 2).map(t => `<span class="meta-tag">${t}</span>`).join('\n      ')

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${post.title} | DOT Physical Blog</title>
<meta name="description" content="${post.excerpt}">
<link href="https://fonts.googleapis.com/css2?family=Manrope:wght@400;600;700;800&family=DM+Sans:ital,wght@0,300;0,400;0,500;1,300&display=swap" rel="stylesheet">
<style>
  *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
  :root{--bg:#F4F7FF;--bg-white:#FFFFFF;--accent:#1A56DB;--accent-dim:#1447C0;--accent-light:#EBF0FF;--teal:#0694A2;--teal-light:#E0F7FA;--heading:#0C1B3A;--body:#3D5280;--muted:#7A8FB8;--border:rgba(26,86,219,0.1);--border-strong:rgba(26,86,219,0.22);--shadow:0 2px 16px rgba(26,86,219,0.08);--shadow-md:0 6px 32px rgba(26,86,219,0.13);--radius:16px;--radius-sm:10px}
  html{scroll-behavior:smooth}
  body{font-family:'DM Sans',sans-serif;background:var(--bg);color:var(--heading);overflow-x:hidden}
  nav{position:fixed;top:0;left:0;right:0;z-index:100;display:flex;align-items:center;justify-content:space-between;padding:1.1rem 4rem;background:rgba(255,255,255,0.92);backdrop-filter:blur(20px);border-bottom:1px solid var(--border)}
  .nav-logo{font-family:'Manrope',sans-serif;font-weight:800;font-size:1.35rem;letter-spacing:-0.02em;display:flex;align-items:center;gap:10px;text-decoration:none;color:var(--heading)}
  .logo-dot{width:10px;height:10px;border-radius:50%;background:var(--accent);display:inline-block}
  .nav-links{display:flex;align-items:center;gap:2rem;list-style:none}
  .nav-links a{color:var(--body);text-decoration:none;font-size:0.9rem;transition:color 0.2s}
  .nav-links a:hover{color:var(--heading)}
  .nav-cta{background:var(--accent)!important;color:#fff!important;padding:0.55rem 1.4rem;border-radius:100px;font-weight:600!important;font-size:0.875rem!important;box-shadow:0 2px 12px rgba(26,86,219,0.3);transition:background 0.2s,transform 0.15s!important}
  .nav-cta:hover{background:var(--accent-dim)!important;transform:translateY(-1px)}
  .post-hero{padding:8rem 4rem 4rem;background:linear-gradient(150deg,#fff 0%,#EDF1FF 55%,#E4EDFF 100%);border-bottom:1px solid var(--border);position:relative;overflow:hidden}
  .hero-grid{position:absolute;inset:0;z-index:0;background-image:linear-gradient(rgba(26,86,219,0.04) 1px,transparent 1px),linear-gradient(90deg,rgba(26,86,219,0.04) 1px,transparent 1px);background-size:60px 60px;mask-image:radial-gradient(ellipse 90% 90% at 50% 50%,black 10%,transparent 100%)}
  .post-hero-inner{position:relative;z-index:1;max-width:780px}
  .breadcrumb{display:flex;align-items:center;gap:0.5rem;margin-bottom:1.25rem;font-size:0.82rem;color:var(--muted)}
  .breadcrumb a{color:var(--muted);text-decoration:none;transition:color 0.2s}
  .breadcrumb a:hover{color:var(--accent)}
  .breadcrumb span{color:var(--border-strong)}
  .post-cat{display:inline-block;font-size:0.72rem;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;color:var(--teal);margin-bottom:0.85rem;background:var(--teal-light);padding:0.3rem 0.75rem;border-radius:100px}
  .post-hero h1{font-family:'Manrope',sans-serif;font-size:clamp(1.9rem,4vw,3rem);font-weight:800;letter-spacing:-0.03em;color:var(--heading);margin-bottom:1.1rem;line-height:1.1}
  .post-hero .excerpt{color:var(--body);font-size:1.05rem;line-height:1.7;font-weight:300;max-width:660px;margin-bottom:1.75rem}
  .post-meta-bar{display:flex;align-items:center;gap:1.5rem;flex-wrap:wrap}
  .meta-author{display:flex;align-items:center;gap:0.65rem}
  .author-avatar{width:36px;height:36px;border-radius:50%;background:var(--accent);display:flex;align-items:center;justify-content:center;color:#fff;font-weight:700;font-size:0.85rem;font-family:'Manrope',sans-serif}
  .author-name{font-size:0.875rem;font-weight:500;color:var(--heading)}
  .meta-sep{width:4px;height:4px;border-radius:50%;background:var(--border-strong)}
  .meta-date,.meta-read{color:var(--muted);font-size:0.82rem}
  .meta-tag{background:var(--accent-light);color:var(--accent);font-size:0.72rem;font-weight:600;padding:0.2rem 0.6rem;border-radius:100px}
  .post-layout{display:grid;grid-template-columns:1fr 300px;gap:4rem;max-width:1200px;margin:0 auto;padding:4rem 4rem 6rem}
  .article-body{min-width:0}
  .post-featured-img{width:100%;height:340px;background:linear-gradient(135deg,var(--accent) 0%,var(--teal) 100%);border-radius:var(--radius);display:flex;align-items:center;justify-content:center;font-size:6rem;margin-bottom:2.5rem}
  .article-content{font-size:1rem;line-height:1.85;color:var(--body);font-weight:300}
  .article-content h2{font-family:'Manrope',sans-serif;font-size:1.55rem;font-weight:800;color:var(--heading);letter-spacing:-0.02em;margin:2.5rem 0 1rem;line-height:1.2}
  .article-content h3{font-family:'Manrope',sans-serif;font-size:1.15rem;font-weight:700;color:var(--heading);margin:2rem 0 0.75rem}
  .article-content p{margin-bottom:1.25rem}
  .article-content strong{color:var(--heading);font-weight:600}
  .article-content ul,.article-content ol{margin:0 0 1.25rem 1.5rem;display:flex;flex-direction:column;gap:0.5rem}
  .article-content li{line-height:1.7}
  .article-content a{color:var(--accent);text-decoration:underline;text-decoration-color:rgba(26,86,219,0.3);transition:text-decoration-color 0.2s}
  .article-content a:hover{text-decoration-color:var(--accent)}
  .callout{background:var(--accent-light);border-left:4px solid var(--accent);border-radius:0 var(--radius-sm) var(--radius-sm) 0;padding:1.25rem 1.5rem;margin:2rem 0;color:var(--heading);font-size:0.95rem;line-height:1.7}
  .callout strong{display:block;font-family:'Manrope',sans-serif;font-weight:700;margin-bottom:0.3rem;color:var(--accent)}
  .callout-teal{background:var(--teal-light);border-left-color:var(--teal)}
  .callout-teal strong{color:var(--teal)}
  .data-table{width:100%;border-collapse:collapse;background:var(--bg-white);border-radius:var(--radius-sm);overflow:hidden;border:1px solid var(--border);margin:1.5rem 0}
  .data-table th{background:var(--heading);color:rgba(255,255,255,0.85);font-family:'Manrope',sans-serif;font-size:0.8rem;font-weight:700;letter-spacing:0.05em;text-transform:uppercase;padding:0.9rem 1.25rem;text-align:left}
  .data-table td{padding:0.8rem 1.25rem;font-size:0.875rem;color:var(--body);border-top:1px solid var(--border)}
  .data-table tr:nth-child(even) td{background:var(--bg)}
  .post-tags{display:flex;flex-wrap:wrap;gap:0.5rem;margin:2.5rem 0;padding:2rem 0;border-top:1px solid var(--border);border-bottom:1px solid var(--border)}
  .post-tag{background:var(--bg);border:1px solid var(--border);color:var(--body);font-size:0.78rem;padding:0.3rem 0.75rem;border-radius:100px;text-decoration:none;transition:border-color 0.2s,color 0.2s}
  .post-tag:hover{border-color:var(--accent);color:var(--accent)}
  .author-bio{background:var(--bg-white);border:1px solid var(--border);border-radius:var(--radius);padding:2rem;display:flex;gap:1.5rem;align-items:flex-start;margin-bottom:3rem}
  .bio-avatar{width:64px;height:64px;border-radius:50%;background:linear-gradient(135deg,var(--accent),var(--teal));display:flex;align-items:center;justify-content:center;color:#fff;font-family:'Manrope',sans-serif;font-weight:800;font-size:1.4rem;flex-shrink:0}
  .bio-name{font-family:'Manrope',sans-serif;font-weight:700;font-size:1rem;color:var(--heading);margin-bottom:0.3rem}
  .bio-role{font-size:0.8rem;color:var(--teal);font-weight:500;margin-bottom:0.6rem}
  .bio-text{font-size:0.875rem;color:var(--body);line-height:1.65}
  .sidebar{display:flex;flex-direction:column;gap:1.5rem;position:sticky;top:6rem}
  .sidebar-card{background:var(--bg-white);border:1px solid var(--border);border-radius:var(--radius);padding:1.75rem}
  .sidebar-card h4{font-family:'Manrope',sans-serif;font-weight:700;font-size:0.9rem;color:var(--heading);margin-bottom:1rem;padding-bottom:0.75rem;border-bottom:1px solid var(--border)}
  .sidebar-newsletter{background:var(--heading);border:none;border-radius:var(--radius);padding:1.75rem}
  .sidebar-newsletter h4{font-family:'Manrope',sans-serif;font-weight:700;font-size:0.95rem;color:#fff;margin-bottom:0.4rem;border:none;padding:0}
  .sidebar-newsletter p{color:rgba(255,255,255,0.5);font-size:0.8rem;line-height:1.6;margin-bottom:1.25rem}
  .sidebar-form{display:flex;flex-direction:column;gap:0.6rem}
  .sidebar-input{background:rgba(255,255,255,0.08);border:1.5px solid rgba(255,255,255,0.12);border-radius:var(--radius-sm);padding:0.7rem 1rem;font-family:'DM Sans',sans-serif;font-size:0.875rem;color:#fff;outline:none;transition:border-color 0.2s}
  .sidebar-input::placeholder{color:rgba(255,255,255,0.3)}
  .sidebar-input:focus{border-color:rgba(255,255,255,0.45)}
  .btn-sidebar{background:var(--accent);color:#fff;padding:0.7rem 1rem;border-radius:var(--radius-sm);font-weight:600;font-size:0.875rem;border:none;cursor:pointer;transition:background 0.2s;width:100%;font-family:'DM Sans',sans-serif}
  .btn-sidebar:hover{background:var(--accent-dim)}
  .toc-list{list-style:none;display:flex;flex-direction:column;gap:0.5rem}
  .toc-list li a{color:var(--body);text-decoration:none;font-size:0.85rem;line-height:1.45;display:flex;gap:0.5rem;align-items:flex-start;transition:color 0.2s}
  .toc-list li a:hover{color:var(--accent)}
  .toc-num{color:var(--muted);font-size:0.75rem;font-weight:600;flex-shrink:0;margin-top:2px}
  footer{background:var(--heading);padding:3.5rem 4rem;display:grid;grid-template-columns:2fr 1fr 1fr 1fr;gap:3rem}
  .footer-brand p{color:rgba(255,255,255,0.4);font-size:0.875rem;line-height:1.7;margin-top:0.75rem;max-width:260px}
  .footer-col h5{font-family:'Manrope',sans-serif;font-weight:700;font-size:0.8rem;letter-spacing:0.06em;text-transform:uppercase;color:rgba(255,255,255,0.28);margin-bottom:1rem}
  .footer-col a{display:block;color:rgba(255,255,255,0.52);text-decoration:none;font-size:0.875rem;margin-bottom:0.6rem;transition:color 0.2s}
  .footer-col a:hover{color:#fff}
  .footer-bottom{grid-column:1/-1;padding-top:2rem;border-top:1px solid rgba(255,255,255,0.07);display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:1rem}
  .footer-bottom p{color:rgba(255,255,255,0.28);font-size:0.8rem}
  @media(max-width:1024px){nav{padding:1.1rem 2rem}.post-hero{padding:7rem 2rem 3rem}.post-layout{grid-template-columns:1fr;padding:3rem 2rem}.sidebar{position:static}}
  @media(max-width:640px){.nav-links{display:none}}
</style>
</head>
<body>

<nav>
  <a href="index.html" class="nav-logo"><span class="logo-dot"></span>DOT Physical</a>
  <ul class="nav-links">
    <li><a href="services.html">Services</a></li>
    <li><a href="employers.html">Employers</a></li>
    <li><a href="about.html">About</a></li>
    <li><a href="blog.html">Blog</a></li>
    <li><a href="contact.html">Contact</a></li>
    <li><a href="book.html">Book Now</a></li>
    <li><a href="http://portal.dot-physical.net" class="nav-cta" target="_blank" rel="noopener">Employer Portal</a></li>
  </ul>
</nav>

<div class="post-hero">
  <div class="hero-grid"></div>
  <div class="post-hero-inner">
    <div class="breadcrumb">
      <a href="index.html">Home</a><span>/</span>
      <a href="blog.html">Blog</a><span>/</span>
      <span>${post.category}</span>
    </div>
    <div class="post-cat">${post.category}</div>
    <h1>${post.title}</h1>
    <p class="excerpt">${post.excerpt}</p>
    <div class="post-meta-bar">
      <div class="meta-author">
        <div class="author-avatar">DP</div>
        <span class="author-name">DOT Physical Team</span>
      </div>
      <div class="meta-sep"></div>
      <span class="meta-date">${dateStr}</span>
      <div class="meta-sep"></div>
      <span class="meta-read">${post.readTime}</span>
      ${metaTagsHtml}
    </div>
  </div>
</div>

<div class="post-layout">
  <article class="article-body">
    <div class="post-featured-img">${post.emoji}</div>
    <div class="article-content">
      ${post.bodyHtml}
    </div>

    <div class="post-tags">
      ${tagsHtml}
    </div>

    <div class="author-bio">
      <div class="bio-avatar">DP</div>
      <div>
        <div class="bio-name">DOT Physical Team</div>
        <div class="bio-role">DOT Compliance Specialists</div>
        <div class="bio-text">Our team of certified medical examiners and compliance specialists provides DOT physicals, drug testing, and regulatory guidance to drivers and employers throughout New Jersey and the tri-state area.</div>
      </div>
    </div>
  </article>

  <aside class="sidebar">
    <div class="sidebar-card">
      <h4>Table of Contents</h4>
      <ul class="toc-list">
        ${tocHtml}
      </ul>
    </div>
    <div class="sidebar-newsletter">
      <h4>📬 Stay Compliant</h4>
      <p>Get weekly DOT compliance tips and regulatory updates in your inbox.</p>
      <div class="sidebar-form">
        <input type="email" class="sidebar-input" placeholder="Your email address">
        <button class="btn-sidebar">Subscribe Free</button>
      </div>
    </div>
    <div class="sidebar-card">
      <h4>Ready to Book?</h4>
      <p style="font-size:0.85rem;color:var(--body);margin-bottom:1rem;line-height:1.6">Schedule your DOT physical or drug test online. Same-week appointments available.</p>
      <a href="book.html" style="display:block;background:var(--accent);color:#fff;text-align:center;padding:0.7rem 1rem;border-radius:var(--radius-sm);font-weight:600;font-size:0.875rem;text-decoration:none">Book an Appointment</a>
    </div>
  </aside>
</div>

<footer>
  <div class="footer-brand">
    <a href="index.html" class="nav-logo" style="text-decoration:none;color:#fff;display:flex;align-items:center;gap:10px"><span class="logo-dot"></span>DOT Physical</a>
    <p>Certified DOT medical examinations and drug testing services in New Jersey.</p>
  </div>
  <div class="footer-col">
    <h5>Services</h5>
    <a href="services.html">DOT Physical</a>
    <a href="services.html">Drug Testing</a>
    <a href="services.html">Breath Alcohol</a>
    <a href="employers.html">Employer Plans</a>
  </div>
  <div class="footer-col">
    <h5>Resources</h5>
    <a href="blog.html">Blog</a>
    <a href="about.html">About Us</a>
    <a href="contact.html">Contact</a>
    <a href="http://portal.dot-physical.net">Employer Portal</a>
  </div>
  <div class="footer-col">
    <h5>Legal</h5>
    <a href="#">Privacy Policy</a>
    <a href="#">Terms of Service</a>
  </div>
  <div class="footer-bottom">
    <p>&copy; ${new Date().getFullYear()} DOT Physical. All rights reserved.</p>
    <p>FMCSA-compliant examinations &middot; New Jersey</p>
  </div>
</footer>

</body>
</html>`
}

// Prepend new post card to blog.html Recent Articles section
function updateBlogHtml(post, dateStr, slug) {
  let blogHtml = fs.readFileSync('blog.html', 'utf8')

  const newCard = `
      <a href="${slug}.html" class="blog-item">
        <div class="blog-item-icon" style="background:${post.iconBg}">${post.emoji}</div>
        <div class="blog-item-body">
          <div class="blog-cat">${post.category}</div>
          <div class="blog-item-title">${post.title}</div>
          <div class="blog-item-excerpt">${post.excerpt}</div>
          <div class="blog-item-meta"><span class="item-date">${dateStr}</span><span class="item-read">${post.readTime}</span></div>
        </div>
      </a>
`

  // Insert after "<!-- RECENT POSTS -->" marker and opening <div class="blog-list">
  const insertAfter = '<div class="blog-list">'
  const idx = blogHtml.indexOf(insertAfter)
  if (idx === -1) {
    console.error('Could not find insertion point in blog.html')
    process.exit(1)
  }

  blogHtml = blogHtml.slice(0, idx + insertAfter.length) + newCard + blogHtml.slice(idx + insertAfter.length)
  fs.writeFileSync('blog.html', blogHtml, 'utf8')
  console.log(`Updated blog.html with new card for "${post.title}"`)
}

// Send blog notification email to all subscribers via Postmark
async function sendBlogEmails(post, slug, dateStr) {
  if (!POSTMARK_API_TOKEN) {
    console.log('No POSTMARK_API_TOKEN — skipping email send')
    return
  }

  const subscribers = JSON.parse(fs.readFileSync('subscribers.json', 'utf8'))
  if (!subscribers.length) {
    console.log('No subscribers — skipping email send')
    return
  }

  const postUrl = `${SITE_URL}/${slug}.html`

  console.log(`Sending blog email to ${subscribers.length} subscriber(s)...`)

  const results = await Promise.allSettled(
    subscribers.map(async (sub) => {
      const htmlBody = `<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#F4F7FF;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif">
  <div style="max-width:600px;margin:0 auto;background:#fff;border-radius:16px;overflow:hidden;margin-top:32px;margin-bottom:32px;box-shadow:0 4px 24px rgba(26,86,219,0.08)">

    <!-- HEADER -->
    <div style="background:#0C1B3A;padding:28px 36px;display:flex;align-items:center">
      <span style="width:10px;height:10px;border-radius:50%;background:#1A56DB;display:inline-block;margin-right:10px"></span>
      <span style="font-size:1.15rem;font-weight:800;color:#fff;letter-spacing:-0.02em">DOT Physical</span>
    </div>

    <!-- LABEL -->
    <div style="padding:28px 36px 0">
      <span style="display:inline-block;font-size:0.7rem;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;color:#0694A2;background:#E0F7FA;padding:4px 12px;border-radius:100px">${post.category}</span>
    </div>

    <!-- TITLE -->
    <div style="padding:16px 36px 20px">
      <h1 style="margin:0 0 12px;font-size:1.6rem;font-weight:800;color:#0C1B3A;line-height:1.15;letter-spacing:-0.02em">${post.title}</h1>
      <p style="margin:0;color:#3D5280;font-size:0.95rem;line-height:1.7">${post.excerpt}</p>
    </div>

    <!-- META -->
    <div style="padding:0 36px 24px;display:flex;gap:16px;align-items:center">
      <span style="font-size:0.8rem;color:#7A8FB8">${dateStr}</span>
      <span style="width:4px;height:4px;border-radius:50%;background:rgba(26,86,219,0.22);display:inline-block"></span>
      <span style="font-size:0.8rem;color:#7A8FB8">${post.readTime}</span>
    </div>

    <!-- CTA -->
    <div style="padding:0 36px 36px">
      <a href="${postUrl}" style="display:inline-block;background:#1A56DB;color:#fff;font-weight:600;font-size:0.95rem;padding:14px 28px;border-radius:100px;text-decoration:none">Read the Full Article →</a>
    </div>

    <hr style="border:none;border-top:1px solid rgba(26,86,219,0.08);margin:0 36px">

    <!-- FOOTER -->
    <div style="padding:24px 36px;background:#F4F7FF">
      <p style="margin:0 0 8px;font-size:0.8rem;color:#7A8FB8">Need a DOT physical or drug test? <a href="${SITE_URL}/book.html" style="color:#1A56DB;text-decoration:underline">Book online</a> — same-week appointments available.</p>
      <p style="margin:0;font-size:0.72rem;color:#aab4cc">You're receiving this because you subscribed to the DOT Physical blog. <a href="mailto:${FROM_EMAIL}?subject=Unsubscribe" style="color:#aab4cc">Unsubscribe</a></p>
    </div>
  </div>
</body>
</html>`

      const res = await fetch('https://api.postmarkapp.com/email', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'X-Postmark-Server-Token': POSTMARK_API_TOKEN,
        },
        body: JSON.stringify({
          From: `${FROM_NAME} <${FROM_EMAIL}>`,
          To: `${sub.firstName} ${sub.lastName} <${sub.email}>`,
          Subject: `New Article: ${post.title}`,
          HtmlBody: htmlBody,
          TextBody: `${post.title}\n\n${post.excerpt}\n\nRead the full article: ${postUrl}\n\n---\nDOT Physical | ${SITE_URL}\nUnsubscribe: reply with "unsubscribe"`,
          MessageStream: 'broadcast',
        }),
      })

      if (!res.ok) {
        const err = await res.text()
        throw new Error(`Postmark error for ${sub.email}: ${err}`)
      }

      console.log(`  Sent to ${sub.email}`)
    })
  )

  const failed = results.filter(r => r.status === 'rejected')
  if (failed.length) {
    failed.forEach(r => console.error('  Failed:', r.reason))
  }
  console.log(`Email send complete: ${results.length - failed.length}/${results.length} delivered`)
}

// Main
async function main() {
  console.log('Picking topic...')
  const topic = pickTopic(getExistingSlugs())
  console.log(`Topic: ${topic}`)

  console.log('Calling Claude API...')
  const post = await generatePost(topic)
  console.log(`Generated post: "${post.title}" → ${post.slug}`)

  const dateStr = new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
  const slug = post.slug.startsWith('post-') ? post.slug : `post-${post.slug}`
  const filename = `${slug}.html`

  // Check if file already exists (avoid overwrite)
  if (fs.existsSync(filename)) {
    console.log(`File ${filename} already exists — skipping to avoid duplicate`)
    process.exit(0)
  }

  console.log(`Writing ${filename}...`)
  fs.writeFileSync(filename, buildPostHtml(post, dateStr), 'utf8')

  console.log('Updating blog.html...')
  updateBlogHtml(post, dateStr, slug)

  await sendBlogEmails(post, slug, dateStr)

  console.log('Done!')
}

main().catch(err => {
  console.error(err)
  process.exit(1)
})
