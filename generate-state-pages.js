/**
 * State landing page generator for Doctors Place / dot-physical.net
 *
 * Run with: node generate-state-pages.js
 *
 * Generates dot-physical-{state-slug}.html for each state defined below.
 * Texas is already created manually as the canonical template.
 */

const fs = require('fs')
const path = require('path')

const states = [
  {
    slug: 'california',
    name: 'California',
    abbr: 'CA',
    sites: '1,200+',
    cities: [
      { name: 'Los Angeles', sites: '150+' },
      { name: 'San Diego', sites: '80+' },
      { name: 'San Francisco', sites: '70+' },
      { name: 'Sacramento', sites: '60+' },
      { name: 'Fresno', sites: '40+' },
      { name: 'Bakersfield', sites: '35+' },
      { name: 'Stockton', sites: '30+' },
      { name: 'Riverside', sites: '45+' },
      { name: 'Long Beach', sites: '40+' },
      { name: 'Oakland', sites: '45+' },
      { name: 'Santa Ana', sites: '30+' },
      { name: 'All Other CA Cities', sites: 'Statewide coverage' },
    ],
    faqExtra: 'California has some of the highest concentrations of CDL drivers in the country, particularly in the LA basin, Central Valley, and Bay Area freight corridors.',
  },
  {
    slug: 'florida',
    name: 'Florida',
    abbr: 'FL',
    sites: '600+',
    cities: [
      { name: 'Miami / Ft. Lauderdale', sites: '80+' },
      { name: 'Tampa / St. Pete', sites: '70+' },
      { name: 'Orlando', sites: '65+' },
      { name: 'Jacksonville', sites: '50+' },
      { name: 'West Palm Beach', sites: '35+' },
      { name: 'Fort Myers', sites: '25+' },
      { name: 'Tallahassee', sites: '20+' },
      { name: 'Gainesville', sites: '15+' },
      { name: 'Pensacola', sites: '15+' },
      { name: 'Daytona Beach', sites: '18+' },
      { name: 'Lakeland', sites: '20+' },
      { name: 'All Other FL Cities', sites: 'Statewide coverage' },
    ],
    faqExtra: 'Florida\'s port cities — Miami, Jacksonville, and Tampa — are among the busiest truck corridors in the Southeast. We cover every I-95 and I-75 corridor stop.',
  },
  {
    slug: 'illinois',
    name: 'Illinois',
    abbr: 'IL',
    sites: '400+',
    cities: [
      { name: 'Chicago', sites: '120+' },
      { name: 'Rockford', sites: '25+' },
      { name: 'Peoria', sites: '20+' },
      { name: 'Springfield', sites: '18+' },
      { name: 'Aurora', sites: '22+' },
      { name: 'Naperville', sites: '20+' },
      { name: 'Joliet', sites: '25+' },
      { name: 'Bloomington', sites: '12+' },
      { name: 'Decatur', sites: '10+' },
      { name: 'Champaign', sites: '12+' },
      { name: 'Elgin', sites: '15+' },
      { name: 'All Other IL Cities', sites: 'Statewide coverage' },
    ],
    faqExtra: 'Chicago is one of the largest freight hubs in North America. Our 120+ Chicago-area collection sites cover all major industrial corridors and suburban freight zones.',
  },
  {
    slug: 'georgia',
    name: 'Georgia',
    abbr: 'GA',
    sites: '350+',
    cities: [
      { name: 'Atlanta', sites: '80+' },
      { name: 'Savannah', sites: '35+' },
      { name: 'Augusta', sites: '25+' },
      { name: 'Macon', sites: '20+' },
      { name: 'Columbus', sites: '18+' },
      { name: 'Albany', sites: '12+' },
      { name: 'Warner Robins', sites: '12+' },
      { name: 'Gainesville', sites: '10+' },
      { name: 'Valdosta', sites: '10+' },
      { name: 'Brunswick', sites: '8+' },
      { name: 'Dalton', sites: '10+' },
      { name: 'All Other GA Cities', sites: 'Statewide coverage' },
    ],
    faqExtra: 'Savannah is one of the busiest container ports in the US, making Georgia a critical hub for freight compliance. We cover the Port of Savannah corridor and all Atlanta distribution zones.',
  },
  {
    slug: 'ohio',
    name: 'Ohio',
    abbr: 'OH',
    sites: '400+',
    cities: [
      { name: 'Columbus', sites: '60+' },
      { name: 'Cleveland', sites: '55+' },
      { name: 'Cincinnati', sites: '50+' },
      { name: 'Toledo', sites: '30+' },
      { name: 'Akron', sites: '30+' },
      { name: 'Dayton', sites: '35+' },
      { name: 'Youngstown', sites: '20+' },
      { name: 'Canton', sites: '15+' },
      { name: 'Lima', sites: '10+' },
      { name: 'Lorain', sites: '12+' },
      { name: 'Mansfield', sites: '10+' },
      { name: 'All Other OH Cities', sites: 'Statewide coverage' },
    ],
    faqExtra: 'Ohio sits at the crossroads of I-70, I-71, I-75, and I-80 — making it one of the highest-traffic freight states in the Midwest. We cover all major Ohio trucking corridors.',
  },
  {
    slug: 'pennsylvania',
    name: 'Pennsylvania',
    abbr: 'PA',
    sites: '380+',
    cities: [
      { name: 'Philadelphia', sites: '70+' },
      { name: 'Pittsburgh', sites: '55+' },
      { name: 'Allentown', sites: '30+' },
      { name: 'Harrisburg', sites: '25+' },
      { name: 'Erie', sites: '20+' },
      { name: 'Reading', sites: '18+' },
      { name: 'Scranton', sites: '15+' },
      { name: 'Bethlehem', sites: '15+' },
      { name: 'Lancaster', sites: '18+' },
      { name: 'York', sites: '15+' },
      { name: 'Wilkes-Barre', sites: '12+' },
      { name: 'All Other PA Cities', sites: 'Statewide coverage' },
    ],
    faqExtra: 'Pennsylvania is a major I-76 and I-78/I-81 freight corridor connecting the Northeast and Midwest. Our Philly and Pittsburgh networks are among our densest in the mid-Atlantic.',
  },
  {
    slug: 'new-york',
    name: 'New York',
    abbr: 'NY',
    sites: '500+',
    cities: [
      { name: 'New York City', sites: '120+' },
      { name: 'Buffalo', sites: '40+' },
      { name: 'Rochester', sites: '35+' },
      { name: 'Albany', sites: '30+' },
      { name: 'Syracuse', sites: '25+' },
      { name: 'Yonkers', sites: '20+' },
      { name: 'Long Island', sites: '50+' },
      { name: 'Utica', sites: '12+' },
      { name: 'Binghamton', sites: '10+' },
      { name: 'Poughkeepsie', sites: '12+' },
      { name: 'White Plains', sites: '15+' },
      { name: 'All Other NY Cities', sites: 'Statewide coverage' },
    ],
    faqExtra: 'New York City is the largest metro in the US by freight volume. We cover all five boroughs plus Long Island, Westchester, and the full I-87/I-90 corridor upstate.',
  },
  {
    slug: 'arizona',
    name: 'Arizona',
    abbr: 'AZ',
    sites: '250+',
    cities: [
      { name: 'Phoenix', sites: '80+' },
      { name: 'Tucson', sites: '40+' },
      { name: 'Mesa', sites: '30+' },
      { name: 'Chandler', sites: '20+' },
      { name: 'Gilbert', sites: '15+' },
      { name: 'Scottsdale', sites: '18+' },
      { name: 'Tempe', sites: '15+' },
      { name: 'Glendale', sites: '20+' },
      { name: 'Peoria', sites: '12+' },
      { name: 'Yuma', sites: '10+' },
      { name: 'Flagstaff', sites: '8+' },
      { name: 'All Other AZ Cities', sites: 'Statewide coverage' },
    ],
    faqExtra: 'Arizona\'s I-10 and I-40 corridors are critical cross-country freight routes. The Phoenix metro is one of the fastest-growing freight markets in the Southwest.',
  },
  {
    slug: 'tennessee',
    name: 'Tennessee',
    abbr: 'TN',
    sites: '300+',
    cities: [
      { name: 'Nashville', sites: '55+' },
      { name: 'Memphis', sites: '60+' },
      { name: 'Knoxville', sites: '35+' },
      { name: 'Chattanooga', sites: '30+' },
      { name: 'Clarksville', sites: '20+' },
      { name: 'Murfreesboro', sites: '18+' },
      { name: 'Jackson', sites: '15+' },
      { name: 'Franklin', sites: '12+' },
      { name: 'Johnson City', sites: '10+' },
      { name: 'Kingsport', sites: '10+' },
      { name: 'Cookeville', sites: '8+' },
      { name: 'All Other TN Cities', sites: 'Statewide coverage' },
    ],
    faqExtra: 'Memphis is the #1 freight hub by tonnage in the US. Tennessee\'s central location and I-40 corridor make it a critical DOT compliance market for national fleets.',
  },
  {
    slug: 'north-carolina',
    name: 'North Carolina',
    abbr: 'NC',
    sites: '320+',
    cities: [
      { name: 'Charlotte', sites: '55+' },
      { name: 'Raleigh / Durham', sites: '50+' },
      { name: 'Greensboro', sites: '35+' },
      { name: 'Winston-Salem', sites: '28+' },
      { name: 'Fayetteville', sites: '20+' },
      { name: 'Wilmington', sites: '18+' },
      { name: 'High Point', sites: '15+' },
      { name: 'Asheville', sites: '15+' },
      { name: 'Durham', sites: '20+' },
      { name: 'Concord', sites: '12+' },
      { name: 'Gastonia', sites: '12+' },
      { name: 'All Other NC Cities', sites: 'Statewide coverage' },
    ],
    faqExtra: 'North Carolina\'s I-85 and I-40 corridors connect the Southeast and mid-Atlantic freight networks. Charlotte is a major distribution hub for the entire Southeast.',
  },
]

function generatePage(state) {
  const citiesHtml = state.cities.map(c => `    <a href="book.html" class="city-card">
      <div class="city-name">${c.name}</div>
      <div class="city-sites">${c.sites} collection sites</div>
    </a>`).join('\n')

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>DOT Physicals & Drug Testing in ${state.name} | Doctors Place</title>
<meta name="description" content="Order DOT physicals and drug tests online for drivers anywhere in ${state.name}. ${state.sites} collection sites statewide. FMCSA-certified. Results in 24–48 hours.">
<meta name="keywords" content="DOT physical ${state.name}, DOT drug test ${state.name}, CDL physical ${state.abbr}, DOT physical ${state.cities[0].name}, DOT urine drug test ${state.name}, FMCSA physical ${state.name}, DOT consortium ${state.name}">
<meta name="robots" content="index, follow">
<link rel="canonical" href="https://www.dot-physical.net/dot-physical-${state.slug}.html">
<meta property="og:type" content="website">
<meta property="og:url" content="https://www.dot-physical.net/dot-physical-${state.slug}.html">
<meta property="og:title" content="DOT Physicals & Drug Testing in ${state.name} | Doctors Place">
<meta property="og:description" content="Order DOT physicals and drug tests online for drivers anywhere in ${state.name}. ${state.sites} collection sites statewide. FMCSA-certified. Results in 24–48 hours.">
<meta property="og:site_name" content="Doctors Place">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="DOT Physicals & Drug Testing in ${state.name} | Doctors Place">
<meta name="twitter:description" content="DOT physicals and drug testing at ${state.sites} ${state.name} collection sites. Order online, test anywhere in ${state.abbr}.">
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "MedicalBusiness",
  "name": "Doctors Place",
  "url": "https://www.dot-physical.net",
  "description": "DOT physical exams and drug testing services throughout ${state.name}.",
  "telephone": "+12013455803",
  "email": "info@dot-physical.net",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "75 Summit Ave",
    "addressLocality": "Hackensack",
    "addressRegion": "NJ",
    "postalCode": "07601",
    "addressCountry": "US"
  },
  "areaServed": {
    "@type": "State",
    "name": "${state.name}"
  }
}
<\/script>
<link href="https://fonts.googleapis.com/css2?family=Manrope:wght@400;600;700;800&family=DM+Sans:ital,wght@0,300;0,400;0,500;1,300&display=swap" rel="stylesheet">
<style>
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  :root {
    --bg: #F4F7FF; --bg-white: #FFFFFF;
    --accent: #1A56DB; --accent-dim: #1447C0; --accent-light: #EBF0FF;
    --teal: #0694A2; --teal-light: #E0F7FA;
    --heading: #0C1B3A; --body: #3D5280; --muted: #7A8FB8;
    --border: rgba(26,86,219,0.1); --border-strong: rgba(26,86,219,0.22);
    --shadow: 0 2px 16px rgba(26,86,219,0.08); --shadow-md: 0 6px 32px rgba(26,86,219,0.13);
    --radius: 16px; --radius-sm: 10px;
  }
  html { scroll-behavior: smooth; }
  body { font-family: 'DM Sans', sans-serif; background: var(--bg); color: var(--heading); overflow-x: hidden; }
  nav { position: fixed; top: 0; left: 0; right: 0; z-index: 100; display: flex; align-items: center; justify-content: space-between; padding: 1.1rem 4rem; background: rgba(255,255,255,0.92); backdrop-filter: blur(20px); border-bottom: 1px solid var(--border); }
  .nav-logo { font-family: 'Manrope', sans-serif; font-weight: 800; font-size: 1.35rem; letter-spacing: -0.02em; display: flex; align-items: center; gap: 10px; text-decoration: none; color: var(--heading); }
  .logo-dot { width: 10px; height: 10px; border-radius: 50%; background: var(--accent); display: inline-block; }
  .nav-links { display: flex; align-items: center; gap: 2rem; list-style: none; }
  .nav-links a { color: var(--body); text-decoration: none; font-size: 0.9rem; transition: color 0.2s; }
  .nav-links a:hover { color: var(--heading); }
  .nav-cta { background: var(--accent) !important; color: #fff !important; padding: 0.55rem 1.4rem; border-radius: 100px; font-weight: 600 !important; font-size: 0.875rem !important; box-shadow: 0 2px 12px rgba(26,86,219,0.3); transition: background 0.2s, transform 0.15s !important; }
  .nav-cta:hover { background: var(--accent-dim) !important; transform: translateY(-1px); }
  .hero { min-height: 80vh; display: flex; flex-direction: column; justify-content: center; padding: 8rem 4rem 5rem; position: relative; overflow: hidden; background: linear-gradient(150deg, #fff 0%, #EDF1FF 55%, #E4EDFF 100%); }
  .hero-bg { position: absolute; inset: 0; z-index: 0; background: radial-gradient(ellipse 55% 65% at 88% 40%, rgba(6,148,162,0.07) 0%, transparent 70%); }
  .hero-content { position: relative; z-index: 1; max-width: 780px; }
  .hero-badge { display: inline-flex; align-items: center; gap: 8px; background: var(--accent-light); border: 1px solid var(--border-strong); color: var(--accent); padding: 0.4rem 1rem; border-radius: 100px; font-size: 0.8rem; font-weight: 500; letter-spacing: 0.05em; text-transform: uppercase; margin-bottom: 1.5rem; }
  .hero h1 { font-family: 'Manrope', sans-serif; font-size: clamp(2.4rem, 5vw, 3.8rem); font-weight: 800; line-height: 1.05; letter-spacing: -0.03em; color: var(--heading); margin-bottom: 1.25rem; }
  .hero h1 em { font-style: normal; color: var(--accent); }
  .hero-sub { color: var(--body); font-size: 1.1rem; line-height: 1.7; max-width: 600px; margin-bottom: 2rem; font-weight: 300; }
  .hero-actions { display: flex; gap: 1rem; flex-wrap: wrap; align-items: center; margin-bottom: 2rem; }
  .btn-primary { background: var(--accent); color: #fff; padding: 0.85rem 2rem; border-radius: 100px; font-weight: 600; font-size: 0.95rem; text-decoration: none; transition: transform 0.15s, background 0.2s; display: inline-flex; align-items: center; gap: 8px; box-shadow: 0 4px 16px rgba(26,86,219,0.3); }
  .btn-primary:hover { transform: translateY(-2px); background: var(--accent-dim); }
  .btn-secondary { color: var(--accent); border: 1.5px solid var(--border-strong); padding: 0.85rem 2rem; border-radius: 100px; font-weight: 500; font-size: 0.95rem; background: var(--bg-white); text-decoration: none; transition: box-shadow 0.2s; display: inline-flex; align-items: center; gap: 8px; }
  .breadcrumb { padding: 1rem 4rem; background: var(--bg-white); border-bottom: 1px solid var(--border); font-size: 0.8rem; color: var(--muted); margin-top: 72px; }
  .breadcrumb a { color: var(--accent); text-decoration: none; }
  .trust-bar { background: var(--bg-white); border-top: 1px solid var(--border); border-bottom: 1px solid var(--border); padding: 1.4rem 4rem; display: flex; align-items: center; justify-content: center; gap: 3rem; flex-wrap: wrap; }
  .trust-item { display: flex; align-items: center; gap: 10px; color: var(--muted); font-size: 0.85rem; }
  .trust-item svg { color: var(--teal); flex-shrink: 0; }
  .trust-item strong { color: var(--heading); font-weight: 500; }
  section { padding: 5rem 4rem; }
  .section-label { display: inline-block; font-size: 0.75rem; font-weight: 500; letter-spacing: 0.1em; text-transform: uppercase; color: var(--teal); margin-bottom: 1rem; }
  .section-title { font-family: 'Manrope', sans-serif; font-size: clamp(1.8rem, 3vw, 2.6rem); font-weight: 700; letter-spacing: -0.02em; line-height: 1.1; margin-bottom: 1.25rem; color: var(--heading); }
  .section-sub { color: var(--body); font-size: 1.05rem; line-height: 1.7; max-width: 560px; font-weight: 300; }
  .services-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1.25rem; margin-top: 3rem; }
  .service-card { background: var(--bg-white); border: 1px solid var(--border); border-radius: var(--radius); padding: 2rem; transition: border-color 0.3s, transform 0.2s, box-shadow 0.3s; }
  .service-card:hover { border-color: var(--accent); transform: translateY(-4px); box-shadow: var(--shadow-md); }
  .service-icon { width: 48px; height: 48px; border-radius: var(--radius-sm); display: flex; align-items: center; justify-content: center; margin-bottom: 1.25rem; font-size: 1.4rem; }
  .icon-blue { background: var(--accent-light); } .icon-teal { background: var(--teal-light); } .icon-indigo { background: #EEF2FF; }
  .service-card h3 { font-family: 'Manrope', sans-serif; font-weight: 700; font-size: 1.05rem; margin-bottom: 0.75rem; color: var(--heading); }
  .service-card p { color: var(--body); font-size: 0.9rem; line-height: 1.65; }
  .service-price { margin-top: 1.25rem; padding-top: 1.25rem; border-top: 1px solid var(--border); display: flex; align-items: center; justify-content: space-between; }
  .price-tag { font-family: 'Manrope', sans-serif; font-weight: 700; font-size: 1.3rem; color: var(--accent); }
  .price-book { font-size: 0.8rem; color: var(--teal); text-decoration: none; font-weight: 500; }
  .cities-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 1rem; margin-top: 2.5rem; }
  .city-card { background: var(--bg-white); border: 1px solid var(--border); border-radius: var(--radius-sm); padding: 1.25rem 1.5rem; transition: border-color 0.2s, box-shadow 0.2s, transform 0.2s; text-decoration: none; display: block; }
  .city-card:hover { border-color: var(--accent); box-shadow: var(--shadow); transform: translateY(-2px); }
  .city-name { font-family: 'Manrope', sans-serif; font-weight: 700; font-size: 1rem; color: var(--heading); margin-bottom: 0.25rem; }
  .city-sites { font-size: 0.8rem; color: var(--muted); }
  .how-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 1.25rem; margin-top: 3rem; }
  .how-step { background: var(--bg-white); border: 1px solid var(--border); border-radius: var(--radius); padding: 2rem 1.75rem; }
  .step-num { font-family: 'Manrope', sans-serif; font-size: 3rem; font-weight: 800; color: rgba(26,86,219,0.09); line-height: 1; margin-bottom: 1rem; }
  .how-step h4 { font-family: 'Manrope', sans-serif; font-weight: 700; font-size: 1rem; margin-bottom: 0.5rem; color: var(--heading); }
  .how-step p { color: var(--body); font-size: 0.875rem; line-height: 1.6; }
  .faq-list { margin-top: 2.5rem; display: flex; flex-direction: column; gap: 1rem; max-width: 800px; }
  .faq-item { background: var(--bg-white); border: 1px solid var(--border); border-radius: var(--radius-sm); padding: 1.5rem; }
  .faq-q { font-family: 'Manrope', sans-serif; font-weight: 700; font-size: 0.95rem; color: var(--heading); margin-bottom: 0.5rem; }
  .faq-a { color: var(--body); font-size: 0.9rem; line-height: 1.65; }
  .cta-banner { background: linear-gradient(135deg, var(--accent) 0%, #1447C0 100%); border-radius: 24px; padding: 4rem; display: flex; align-items: center; justify-content: space-between; gap: 2rem; flex-wrap: wrap; margin: 0 4rem 6rem; box-shadow: 0 8px 40px rgba(26,86,219,0.3); }
  .cta-banner h2 { font-family: 'Manrope', sans-serif; font-size: clamp(1.6rem, 2.5vw, 2.2rem); font-weight: 800; color: #fff; letter-spacing: -0.03em; max-width: 500px; line-height: 1.15; }
  .cta-banner p { color: rgba(255,255,255,0.7); font-size: 1rem; margin-top: 0.5rem; }
  .cta-actions { display: flex; gap: 1rem; flex-wrap: wrap; }
  .btn-white { background: #fff; color: var(--accent); padding: 0.85rem 2rem; border-radius: 100px; font-weight: 600; font-size: 0.95rem; text-decoration: none; display: inline-flex; align-items: center; gap: 8px; }
  .btn-outline-white { color: #fff; border: 1.5px solid rgba(255,255,255,0.45); padding: 0.85rem 2rem; border-radius: 100px; font-weight: 500; font-size: 0.95rem; text-decoration: none; }
  footer { background: var(--heading); padding: 3.5rem 4rem; display: grid; grid-template-columns: 2fr 1fr 1fr 1fr; gap: 3rem; }
  .footer-brand p { color: rgba(255,255,255,0.4); font-size: 0.875rem; line-height: 1.7; margin-top: 0.75rem; max-width: 260px; }
  .footer-contact { margin-top: 1.25rem; }
  .footer-contact a { display: flex; align-items: center; gap: 8px; color: rgba(255,255,255,0.4); text-decoration: none; font-size: 0.875rem; margin-bottom: 0.5rem; }
  .footer-col h5 { font-family: 'Manrope', sans-serif; font-weight: 700; font-size: 0.8rem; letter-spacing: 0.06em; text-transform: uppercase; color: rgba(255,255,255,0.28); margin-bottom: 1rem; }
  .footer-col a { display: block; color: rgba(255,255,255,0.52); text-decoration: none; font-size: 0.875rem; margin-bottom: 0.6rem; }
  .footer-bottom { grid-column: 1 / -1; padding-top: 2rem; border-top: 1px solid rgba(255,255,255,0.07); display: flex; justify-content: space-between; flex-wrap: wrap; gap: 1rem; }
  .footer-bottom p { color: rgba(255,255,255,0.28); font-size: 0.8rem; }
  @media (max-width: 1024px) {
    nav { padding: 1.1rem 2rem; } .hero { padding: 7rem 2rem 4rem; } .breadcrumb { padding: 1rem 2rem; }
    .services-grid { grid-template-columns: repeat(2, 1fr); } .how-grid { grid-template-columns: repeat(2, 1fr); }
    .cta-banner { margin: 0 2rem 4rem; padding: 2.5rem; } footer { grid-template-columns: 1fr 1fr; padding: 3rem 2rem; }
    section { padding: 4rem 2rem; } .trust-bar { padding: 1.4rem 2rem; gap: 1.5rem; }
  }
  @media (max-width: 640px) {
    .nav-links { display: none; } .services-grid { grid-template-columns: 1fr; } .how-grid { grid-template-columns: 1fr; }
    .cities-grid { grid-template-columns: repeat(2, 1fr); } .cta-banner { flex-direction: column; margin: 0 1.5rem 4rem; }
    footer { grid-template-columns: 1fr; }
  }
</style>
</head>
<body>

<nav>
  <a href="index.html" class="nav-logo"><span class="logo-dot"></span>Doctors Place</a>
  <ul class="nav-links">
    <li><a href="services.html">Services</a></li>
    <li><a href="employers.html">Employers</a></li>
    <li><a href="about.html">About</a></li>
    <li><a href="blog.html">Blog</a></li>
    <li><a href="contact.html">Contact Us</a></li>
    <li><a href="book.html">Book Now</a></li>
    <li><a href="http://portal.dot-physical.net" class="nav-cta" target="_blank" rel="noopener">Employer Portal</a></li>
  </ul>
</nav>

<div class="breadcrumb">
  <a href="index.html">Home</a> &rsaquo; <a href="who-we-serve.html">Locations</a> &rsaquo; ${state.name}
</div>

<div class="hero">
  <div class="hero-bg"></div>
  <div class="hero-content">
    <div class="hero-badge">
      <svg width="8" height="8" viewBox="0 0 8 8"><circle cx="4" cy="4" r="4" fill="currentColor"/></svg>
      ${state.name} &middot; ${state.sites} Collection Sites
    </div>
    <h1>DOT Physicals &amp; Drug Testing<br>in <em>${state.name}</em> &mdash; Order Online</h1>
    <p class="hero-sub">Serving CDL drivers and employers across ${state.name}. ${state.faqExtra} Order online in minutes — we find the certified site near your driver.</p>
    <div class="hero-actions">
      <a href="book.html" class="btn-primary">Order in ${state.name} Now <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg></a>
      <a href="http://portal.dot-physical.net" class="btn-secondary" target="_blank" rel="noopener">Employer Portal</a>
    </div>
    <div style="display:flex;gap:1.5rem;flex-wrap:wrap;">
      <div style="display:flex;align-items:center;gap:8px;font-size:0.85rem;color:var(--muted);">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--teal)" stroke-width="2"><path d="M5 13l4 4L19 7"/></svg>
        ${state.sites} ${state.abbr} collection sites
      </div>
      <div style="display:flex;align-items:center;gap:8px;font-size:0.85rem;color:var(--muted);">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--teal)" stroke-width="2"><path d="M5 13l4 4L19 7"/></svg>
        Results in 24&ndash;48 hours
      </div>
      <div style="display:flex;align-items:center;gap:8px;font-size:0.85rem;color:var(--muted);">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--teal)" stroke-width="2"><path d="M5 13l4 4L19 7"/></svg>
        FMCSA &amp; DOT compliant
      </div>
    </div>
  </div>
</div>

<div class="trust-bar">
  <div class="trust-item"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg><span><strong>${state.sites} Sites</strong> Across ${state.name}</span></div>
  <div class="trust-item"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/></svg><span><strong>FMCSA Certified</strong> Medical Examiners</span></div>
  <div class="trust-item"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg><span>Results in <strong>24&ndash;48 Hours</strong></span></div>
  <div class="trust-item"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 000 4h6a2 2 0 000-4M9 5a2 2 0 012-2h2a2 2 0 012 2"/></svg><span><strong>DOT &amp; Non-DOT</strong> Testing</span></div>
</div>

<section id="services" style="background:var(--bg-white);">
  <div class="section-label">Services in ${state.name}</div>
  <h2 class="section-title">DOT compliance services for<br>${state.name} drivers &amp; employers</h2>
  <p class="section-sub">From a single CDL exam to a full random testing program across your ${state.name} fleet — we handle it all.</p>
  <div class="services-grid">
    <div class="service-card">
      <div class="service-icon icon-blue">🚛</div>
      <h3>DOT Physical Exam &mdash; ${state.name}</h3>
      <p>FMCSA-certified medical exams for CDL holders anywhere in ${state.name}. ${state.cities[0].name}, ${state.cities[1]?.name || state.cities[0].name}, and hundreds more locations.</p>
      <div class="service-price"><span class="price-tag">$110</span><a href="book.html" class="price-book">Order Now &rarr;</a></div>
    </div>
    <div class="service-card">
      <div class="service-icon icon-teal">🔬</div>
      <h3>DOT Urine Drug Screen &mdash; ${state.abbr}</h3>
      <p>5-panel DOT urine drug test per 49 CFR Part 40. MRO-reviewed. Available at ${state.sites} ${state.name} collection sites. Results in 24 hours.</p>
      <div class="service-price"><span class="price-tag">$69.99</span><a href="book.html" class="price-book">Order Now &rarr;</a></div>
    </div>
    <div class="service-card">
      <div class="service-icon icon-indigo">💨</div>
      <h3>Breath Alcohol Test &mdash; ${state.name}</h3>
      <p>DOT-compliant BAT testing for FMCSA, FTA, and other regulated employers. Coordinated at certified ${state.name} sites.</p>
      <div class="service-price"><span class="price-tag">$55</span><a href="book.html" class="price-book">Order Now &rarr;</a></div>
    </div>
    <div class="service-card">
      <div class="service-icon icon-blue">↩️</div>
      <h3>Return to Duty Testing &mdash; ${state.abbr}</h3>
      <p>Complete SAP evaluation, return-to-duty testing, and follow-up program management for ${state.name} DOT violations.</p>
      <div class="service-price"><span class="price-tag">$129</span><a href="return-to-duty.html" class="price-book">Learn More &rarr;</a></div>
    </div>
    <div class="service-card">
      <div class="service-icon icon-teal">📋</div>
      <h3>Random Testing Consortium &mdash; ${state.abbr}</h3>
      <p>Enroll your ${state.name} drivers in our FMCSA-compliant random testing pool. We handle all selections, scheduling, and documentation.</p>
      <div class="service-price"><span class="price-tag">$49/yr</span><a href="random-pool.html" class="price-book">Learn More &rarr;</a></div>
    </div>
    <div class="service-card">
      <div class="service-icon icon-indigo">🏥</div>
      <h3>Pre-Employment Physical &mdash; ${state.abbr}</h3>
      <p>Pre-hire health screenings for safety-sensitive positions in ${state.name}, including CDL pre-employment packages with drug testing.</p>
      <div class="service-price"><span class="price-tag">$110</span><a href="pre-employment.html" class="price-book">Learn More &rarr;</a></div>
    </div>
  </div>
</section>

<section style="background:var(--bg);">
  <div class="section-label">${state.name} Coverage</div>
  <h2 class="section-title">Testing sites in every<br>major ${state.name} city</h2>
  <p class="section-sub">Our ${state.sites} ${state.name} collection sites cover all major metros, interstates, and rural areas. If your driver is in ${state.name}, we have a certified site nearby.</p>
  <div class="cities-grid">
${citiesHtml}
  </div>
</section>

<section style="background:var(--bg-white);">
  <div class="section-label">How It Works</div>
  <h2 class="section-title">Order a ${state.name} DOT test<br>in under 5 minutes</h2>
  <div class="how-grid">
    <div class="how-step"><div class="step-num">01</div><h4>Order Online</h4><p>Select your service, enter the driver's info and ${state.name} zip code. No membership required for walk-in orders.</p></div>
    <div class="how-step"><div class="step-num">02</div><h4>We Find the Site</h4><p>Our system locates the nearest certified collection site to your ${state.name} driver's location.</p></div>
    <div class="how-step"><div class="step-num">03</div><h4>Driver Gets Instructions</h4><p>Your driver receives an email with the ${state.name} collection site address, hours, and everything they need to bring.</p></div>
    <div class="how-step"><div class="step-num">04</div><h4>Results Delivered</h4><p>MRO-reviewed results delivered to your portal in 24&ndash;48 hours. Stored securely for DOT audit readiness.</p></div>
  </div>
</section>

<section style="background:var(--bg);">
  <div class="section-label">FAQ</div>
  <h2 class="section-title">${state.name} DOT testing &mdash;<br>common questions</h2>
  <div class="faq-list">
    <div class="faq-item">
      <div class="faq-q">Do I need to be local to use Doctors Place in ${state.name}?</div>
      <div class="faq-a">No. Doctors Place is a fully nationwide service. Our physical office is in Hackensack, NJ, but we serve employers and drivers in all 50 states &mdash; including all of ${state.name} &mdash; through our 10,000+ partner clinic network. You order online; your driver visits a site near them.</div>
    </div>
    <div class="faq-item">
      <div class="faq-q">How do I order a DOT physical for a driver in ${state.cities[0].name}?</div>
      <div class="faq-a">Click "Order Now," select DOT Physical Exam, and enter your driver's ${state.cities[0].name} zip code. We'll assign a certified FMCSA examiner nearby and email your driver with instructions. The whole process takes under 5 minutes online.</div>
    </div>
    <div class="faq-item">
      <div class="faq-q">Is the DOT drug test chain of custody FMCSA-compliant?</div>
      <div class="faq-a">Yes. All our collections follow 49 CFR Part 40 protocols. Chain of custody is maintained from the ${state.name} collection site to our certified lab, with MRO review of all results before delivery.</div>
    </div>
    <div class="faq-item">
      <div class="faq-q">Can I set up a random testing program for my ${state.name} fleet?</div>
      <div class="faq-a">Absolutely. Our C/TPA consortium enrollment starts at $49/year per driver. We handle federal random selection rates, scheduling at ${state.name} sites, and all documentation for FMCSA audits. Sign up through the employer portal.</div>
    </div>
  </div>
</section>

<div class="cta-banner">
  <div>
    <h2>Ready to order DOT testing anywhere in ${state.name}?</h2>
    <p>${state.sites} ${state.name} sites. Order in minutes. Results in 24&ndash;48 hours.</p>
  </div>
  <div class="cta-actions">
    <a href="book.html" class="btn-white">Order Now &mdash; Any ${state.abbr} City</a>
    <a href="tel:2013455803" class="btn-outline-white">Call 201-345-5803</a>
  </div>
</div>

<footer>
  <div class="footer-brand">
    <a href="index.html" class="nav-logo" style="color:#fff;"><span class="logo-dot"></span>Doctors Place</a>
    <p>A Doctors Place company. Providing fast, reliable, FMCSA-compliant DOT physicals and drug testing services nationwide &mdash; including all of ${state.name}.</p>
    <div class="footer-contact">
      <a href="tel:2013455803">📞 201-345-5803</a>
      <a href="contact.html">📍 75 Summit Ave, Hackensack, NJ 07601</a>
    </div>
  </div>
  <div class="footer-col">
    <h5>Services</h5>
    <a href="dot-physical.html">DOT Physical Exam</a>
    <a href="drug-testing.html">Drug Testing</a>
    <a href="random-pool.html">Random Testing Pool</a>
    <a href="return-to-duty.html">Return to Duty</a>
    <a href="mro.html">MRO Services</a>
    <a href="services.html">All Services</a>
  </div>
  <div class="footer-col">
    <h5>Employers</h5>
    <a href="employers.html">Employer Overview</a>
    <a href="ctpa.html">C/TPA Program</a>
    <a href="http://portal.dot-physical.net" target="_blank" rel="noopener">Employer Portal</a>
    <a href="cost-of-services.html">Pricing</a>
  </div>
  <div class="footer-col">
    <h5>Other States</h5>
    <a href="dot-physical-texas.html">Texas</a>
    <a href="dot-physical-california.html">California</a>
    <a href="dot-physical-florida.html">Florida</a>
    <a href="dot-physical-illinois.html">Illinois</a>
    <a href="dot-physical-georgia.html">Georgia</a>
    <a href="who-we-serve.html">All States &rarr;</a>
  </div>
  <div class="footer-bottom">
    <p>&copy; 2025 Doctors Place. All rights reserved.</p>
    <p>DOT physicals &amp; drug testing nationwide &mdash; including ${state.cities.slice(0,3).map(c => c.name).join(', ')}, and all of ${state.name}.</p>
  </div>
</footer>

</body>
</html>`
}

// Generate all state pages
states.forEach(state => {
  const filename = `dot-physical-${state.slug}.html`
  const html = generatePage(state)
  fs.writeFileSync(path.join(__dirname, filename), html, 'utf8')
  console.log(`✓ Generated ${filename}`)
})

console.log(`\nDone! Generated ${states.length} state landing pages.`)
console.log('\nNext: run "node generate-state-pages.js" then git add + commit + vercel --prod')
