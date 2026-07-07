import { writeFileSync, mkdirSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const OUT = join(__dirname, 'cities')
mkdirSync(OUT, { recursive: true })

const cities = [
  { slug: 'austin-tx',        name: 'Austin',          state: 'Texas',          abbr: 'TX', stateSlug: 'dot-physical-texas',          highways: 'I-35, US-183, TX-130', industry: 'technology, logistics, and state government' },
  { slug: 'el-paso-tx',       name: 'El Paso',         state: 'Texas',          abbr: 'TX', stateSlug: 'dot-physical-texas',          highways: 'I-10, I-25, US-54',    industry: 'cross-border freight, military, and manufacturing' },
  { slug: 'lubbock-tx',       name: 'Lubbock',         state: 'Texas',          abbr: 'TX', stateSlug: 'dot-physical-texas',          highways: 'US-87, US-82, I-27',   industry: 'agriculture, cotton, and regional freight' },
  { slug: 'amarillo-tx',      name: 'Amarillo',        state: 'Texas',          abbr: 'TX', stateSlug: 'dot-physical-texas',          highways: 'I-40, I-27, US-60',    industry: 'cattle, grain, and long-haul trucking' },
  { slug: 'corpus-christi-tx',name: 'Corpus Christi',  state: 'Texas',          abbr: 'TX', stateSlug: 'dot-physical-texas',          highways: 'I-37, US-77, US-181',  industry: 'port logistics, petrochemical, and energy' },
  { slug: 'san-francisco-ca', name: 'San Francisco',   state: 'California',     abbr: 'CA', stateSlug: 'dot-physical-california',     highways: 'I-80, US-101, I-280',  industry: 'port shipping, tech logistics, and distribution' },
  { slug: 'sacramento-ca',    name: 'Sacramento',      state: 'California',     abbr: 'CA', stateSlug: 'dot-physical-california',     highways: 'I-5, I-80, CA-99',     industry: 'agriculture, state government, and distribution' },
  { slug: 'fresno-ca',        name: 'Fresno',          state: 'California',     abbr: 'CA', stateSlug: 'dot-physical-california',     highways: 'CA-99, CA-41, CA-168', industry: 'agriculture, food processing, and freight' },
  { slug: 'riverside-ca',     name: 'Riverside',       state: 'California',     abbr: 'CA', stateSlug: 'dot-physical-california',     highways: 'I-215, CA-60, I-10',   industry: 'warehousing, e-commerce logistics, and distribution' },
  { slug: 'bakersfield-ca',   name: 'Bakersfield',     state: 'California',     abbr: 'CA', stateSlug: 'dot-physical-california',     highways: 'CA-99, I-5, CA-58',    industry: 'oil production, agriculture, and freight' },
  { slug: 'oakland-ca',       name: 'Oakland',         state: 'California',     abbr: 'CA', stateSlug: 'dot-physical-california',     highways: 'I-880, I-980, I-580',  industry: 'port operations, rail freight, and distribution' },
  { slug: 'long-beach-ca',    name: 'Long Beach',      state: 'California',     abbr: 'CA', stateSlug: 'dot-physical-california',     highways: 'I-710, I-405, I-605',  industry: 'port logistics, container shipping, and freight' },
  { slug: 'portland-or',      name: 'Portland',        state: 'Oregon',         abbr: 'OR', stateSlug: 'dot-physical-oregon',         highways: 'I-5, I-84, I-205',     industry: 'port shipping, tech, and Pacific Northwest freight' },
  { slug: 'salt-lake-city-ut',name: 'Salt Lake City',  state: 'Utah',           abbr: 'UT', stateSlug: 'dot-physical-utah',           highways: 'I-15, I-80, I-215',    industry: 'distribution, mining, and mountain West freight' },
  { slug: 'provo-ut',         name: 'Provo',           state: 'Utah',           abbr: 'UT', stateSlug: 'dot-physical-utah',           highways: 'I-15, US-189, US-6',   industry: 'tech logistics, manufacturing, and regional freight' },
  { slug: 'albuquerque-nm',   name: 'Albuquerque',     state: 'New Mexico',     abbr: 'NM', stateSlug: 'dot-physical-new-mexico',     highways: 'I-40, I-25, US-550',   industry: 'military, energy, and Southwest freight corridors' },
  { slug: 'tucson-az',        name: 'Tucson',          state: 'Arizona',        abbr: 'AZ', stateSlug: 'dot-physical-arizona',        highways: 'I-10, I-19, AZ-77',    industry: 'border freight, military, and manufacturing' },
  { slug: 'mesa-az',          name: 'Mesa',            state: 'Arizona',        abbr: 'AZ', stateSlug: 'dot-physical-arizona',        highways: 'US-60, AZ-202, I-10',  industry: 'distribution, construction, and Phoenix metro logistics' },
  { slug: 'oklahoma-city-ok', name: 'Oklahoma City',   state: 'Oklahoma',       abbr: 'OK', stateSlug: 'dot-physical-oklahoma',       highways: 'I-35, I-40, I-44',     industry: 'oil and gas, agriculture, and central US freight' },
  { slug: 'tulsa-ok',         name: 'Tulsa',           state: 'Oklahoma',       abbr: 'OK', stateSlug: 'dot-physical-oklahoma',       highways: 'I-44, I-244, US-412',  industry: 'energy, manufacturing, and Arkansas River logistics' },
  { slug: 'louisville-ky',    name: 'Louisville',      state: 'Kentucky',       abbr: 'KY', stateSlug: 'dot-physical-kentucky',       highways: 'I-64, I-65, I-71',     industry: 'UPS air hub, bourbon, and Midwest distribution' },
  { slug: 'lexington-ky',     name: 'Lexington',       state: 'Kentucky',       abbr: 'KY', stateSlug: 'dot-physical-kentucky',       highways: 'I-64, I-75, US-27',    industry: 'equine industry, manufacturing, and regional freight' },
  { slug: 'cincinnati-oh',    name: 'Cincinnati',      state: 'Ohio',           abbr: 'OH', stateSlug: 'dot-physical-ohio',           highways: 'I-71, I-75, I-275',    industry: 'P&G logistics, manufacturing, and Ohio River freight' },
  { slug: 'toledo-oh',        name: 'Toledo',          state: 'Ohio',           abbr: 'OH', stateSlug: 'dot-physical-ohio',           highways: 'I-75, I-80, I-90',     industry: 'auto manufacturing, glass industry, and Great Lakes freight' },
  { slug: 'akron-oh',         name: 'Akron',           state: 'Ohio',           abbr: 'OH', stateSlug: 'dot-physical-ohio',           highways: 'I-76, I-77, OH-8',     industry: 'rubber, polymer, and Northeast Ohio manufacturing' },
  { slug: 'pittsburgh-pa',    name: 'Pittsburgh',      state: 'Pennsylvania',   abbr: 'PA', stateSlug: 'dot-physical-pennsylvania',   highways: 'I-376, I-79, I-70',    industry: 'steel, tech, and Appalachian freight corridors' },
  { slug: 'harrisburg-pa',    name: 'Harrisburg',      state: 'Pennsylvania',   abbr: 'PA', stateSlug: 'dot-physical-pennsylvania',   highways: 'I-81, I-83, I-76',     industry: 'state government, distribution, and PA Turnpike freight' },
  { slug: 'baltimore-md',     name: 'Baltimore',       state: 'Maryland',       abbr: 'MD', stateSlug: 'dot-physical-maryland',       highways: 'I-95, I-83, I-695',    industry: 'port shipping, federal logistics, and Mid-Atlantic freight' },
  { slug: 'richmond-va',      name: 'Richmond',        state: 'Virginia',       abbr: 'VA', stateSlug: 'dot-physical-virginia',       highways: 'I-95, I-64, I-295',    industry: 'tobacco, finance, and Mid-Atlantic distribution' },
  { slug: 'virginia-beach-va',name: 'Virginia Beach',  state: 'Virginia',       abbr: 'VA', stateSlug: 'dot-physical-virginia',       highways: 'I-264, US-58, VA-44',  industry: 'military, port logistics, and Hampton Roads freight' },
  { slug: 'norfolk-va',       name: 'Norfolk',         state: 'Virginia',       abbr: 'VA', stateSlug: 'dot-physical-virginia',       highways: 'I-64, US-460, VA-44',  industry: 'naval base, port operations, and regional freight' },
  { slug: 'raleigh-nc',       name: 'Raleigh',         state: 'North Carolina', abbr: 'NC', stateSlug: 'dot-physical-north-carolina', highways: 'I-40, I-440, US-1',    industry: 'Research Triangle, pharma, and Southeast freight' },
  { slug: 'charlotte-nc',     name: 'Charlotte',       state: 'North Carolina', abbr: 'NC', stateSlug: 'dot-physical-north-carolina', highways: 'I-85, I-77, I-485',    industry: 'banking, distribution, and Southeast freight hub' },
  { slug: 'greensboro-nc',    name: 'Greensboro',      state: 'North Carolina', abbr: 'NC', stateSlug: 'dot-physical-north-carolina', highways: 'I-85, I-40, I-73',     industry: 'textile, logistics, and Piedmont Triad freight' },
  { slug: 'columbia-sc',      name: 'Columbia',        state: 'South Carolina', abbr: 'SC', stateSlug: 'dot-physical-south-carolina', highways: 'I-20, I-26, I-77',     industry: 'military, state government, and regional distribution' },
  { slug: 'charleston-sc',    name: 'Charleston',      state: 'South Carolina', abbr: 'SC', stateSlug: 'dot-physical-south-carolina', highways: 'I-26, US-17, I-526',   industry: 'port operations, automotive, and Southeast freight' },
  { slug: 'savannah-ga',      name: 'Savannah',        state: 'Georgia',        abbr: 'GA', stateSlug: 'dot-physical-georgia',        highways: 'I-16, I-95, US-17',    industry: 'port logistics, auto manufacturing, and freight corridor' },
  { slug: 'augusta-ga',       name: 'Augusta',         state: 'Georgia',        abbr: 'GA', stateSlug: 'dot-physical-georgia',        highways: 'I-20, US-1, US-25',    industry: 'cyber command, medical, and regional freight' },
  { slug: 'birmingham-al',    name: 'Birmingham',      state: 'Alabama',        abbr: 'AL', stateSlug: 'dot-physical-alabama',        highways: 'I-20, I-65, I-22',     industry: 'steel, healthcare, and Southeast freight crossroads' },
  { slug: 'montgomery-al',    name: 'Montgomery',      state: 'Alabama',        abbr: 'AL', stateSlug: 'dot-physical-alabama',        highways: 'I-65, I-85, US-31',    industry: 'state government, military, and regional distribution' },
  { slug: 'mobile-al',        name: 'Mobile',          state: 'Alabama',        abbr: 'AL', stateSlug: 'dot-physical-alabama',        highways: 'I-65, I-10, US-98',    industry: 'port operations, aerospace, and Gulf Coast freight' },
  { slug: 'jackson-ms',       name: 'Jackson',         state: 'Mississippi',    abbr: 'MS', stateSlug: 'dot-physical-mississippi',    highways: 'I-20, I-55, US-49',    industry: 'agriculture, energy, and Deep South freight' },
  { slug: 'little-rock-ar',   name: 'Little Rock',     state: 'Arkansas',       abbr: 'AR', stateSlug: 'dot-physical-arkansas',       highways: 'I-30, I-40, I-630',    industry: 'agriculture, retail logistics, and state commerce' },
  { slug: 'fayetteville-ar',  name: 'Fayetteville',    state: 'Arkansas',       abbr: 'AR', stateSlug: 'dot-physical-arkansas',       highways: 'I-49, US-71, AR-16',   industry: 'Walmart supply chain, poultry, and NW Arkansas freight' },
  { slug: 'baton-rouge-la',   name: 'Baton Rouge',     state: 'Louisiana',      abbr: 'LA', stateSlug: 'dot-physical-louisiana',      highways: 'I-10, I-12, US-61',    industry: 'petrochemical, port logistics, and state government' },
  { slug: 'shreveport-la',    name: 'Shreveport',      state: 'Louisiana',      abbr: 'LA', stateSlug: 'dot-physical-louisiana',      highways: 'I-20, I-49, US-79',    industry: 'oil and gas, gaming, and Red River freight' },
  { slug: 'knoxville-tn',     name: 'Knoxville',       state: 'Tennessee',      abbr: 'TN', stateSlug: 'dot-physical-tennessee',      highways: 'I-40, I-75, I-275',    industry: 'manufacturing, distribution, and Appalachian freight' },
  { slug: 'chattanooga-tn',   name: 'Chattanooga',     state: 'Tennessee',      abbr: 'TN', stateSlug: 'dot-physical-tennessee',      highways: 'I-24, I-75, US-27',    industry: 'automotive, logistics, and Tennessee River freight' },
  { slug: 'des-moines-ia',    name: 'Des Moines',      state: 'Iowa',           abbr: 'IA', stateSlug: 'dot-physical-iowa',           highways: 'I-35, I-80, I-235',    industry: 'insurance, agriculture, and Midwest freight hub' },
  { slug: 'omaha-ne',         name: 'Omaha',           state: 'Nebraska',       abbr: 'NE', stateSlug: 'dot-physical-nebraska',       highways: 'I-80, I-29, US-75',    industry: 'rail freight, agriculture, and Midwest distribution' },
  { slug: 'wichita-ks',       name: 'Wichita',         state: 'Kansas',         abbr: 'KS', stateSlug: 'dot-physical-kansas',         highways: 'I-135, I-235, US-54',  industry: 'aviation, agriculture, and Plains freight' },
  { slug: 'kansas-city-ks',   name: 'Kansas City',     state: 'Kansas',         abbr: 'KS', stateSlug: 'dot-physical-kansas',         highways: 'I-70, I-35, US-169',   industry: 'rail hub, agriculture, and cross-country freight' },
  { slug: 'st-louis-mo',      name: 'St. Louis',       state: 'Missouri',       abbr: 'MO', stateSlug: 'dot-physical-missouri',       highways: 'I-70, I-55, I-64',     industry: 'rail freight, brewery, and Midwest distribution hub' },
  { slug: 'springfield-mo',   name: 'Springfield',     state: 'Missouri',       abbr: 'MO', stateSlug: 'dot-physical-missouri',       highways: 'I-44, US-65, US-60',   industry: 'trucking, poultry, and Ozark freight' },
  { slug: 'milwaukee-wi',     name: 'Milwaukee',       state: 'Wisconsin',      abbr: 'WI', stateSlug: 'dot-physical-wisconsin',      highways: 'I-94, I-43, I-894',    industry: 'manufacturing, Great Lakes shipping, and Midwest freight' },
  { slug: 'madison-wi',       name: 'Madison',         state: 'Wisconsin',      abbr: 'WI', stateSlug: 'dot-physical-wisconsin',      highways: 'I-90, I-94, US-51',    industry: 'state government, biotech, and regional distribution' },
  { slug: 'green-bay-wi',     name: 'Green Bay',       state: 'Wisconsin',      abbr: 'WI', stateSlug: 'dot-physical-wisconsin',      highways: 'I-43, US-41, WI-172',  industry: 'paper, food processing, and Great Lakes freight' },
  { slug: 'grand-rapids-mi',  name: 'Grand Rapids',    state: 'Michigan',       abbr: 'MI', stateSlug: 'dot-physical-michigan',       highways: 'I-96, I-196, US-131',  industry: 'furniture, healthcare, and West Michigan freight' },
  { slug: 'lansing-mi',       name: 'Lansing',         state: 'Michigan',       abbr: 'MI', stateSlug: 'dot-physical-michigan',       highways: 'I-96, I-69, I-496',    industry: 'automotive, state government, and regional freight' },
  { slug: 'buffalo-ny',       name: 'Buffalo',         state: 'New York',       abbr: 'NY', stateSlug: 'dot-physical-new-york',       highways: 'I-90, I-290, I-190',   industry: 'Great Lakes shipping, cross-border freight, and manufacturing' },
  { slug: 'rochester-ny',     name: 'Rochester',       state: 'New York',       abbr: 'NY', stateSlug: 'dot-physical-new-york',       highways: 'I-390, I-490, I-590',  industry: 'optics, healthcare, and Upstate NY freight' },
  { slug: 'albany-ny',        name: 'Albany',          state: 'New York',       abbr: 'NY', stateSlug: 'dot-physical-new-york',       highways: 'I-87, I-90, I-787',    industry: 'state government, distribution, and Northeast freight' },
  { slug: 'syracuse-ny',      name: 'Syracuse',        state: 'New York',       abbr: 'NY', stateSlug: 'dot-physical-new-york',       highways: 'I-81, I-90, I-690',    industry: 'manufacturing, retail, and Upstate NY logistics' },
  { slug: 'hartford-ct',      name: 'Hartford',        state: 'Connecticut',    abbr: 'CT', stateSlug: 'dot-physical-connecticut',    highways: 'I-91, I-84, CT-2',     industry: 'insurance, finance, and New England freight' },
  { slug: 'bridgeport-ct',    name: 'Bridgeport',      state: 'Connecticut',    abbr: 'CT', stateSlug: 'dot-physical-connecticut',    highways: 'I-95, CT-8, US-1',     industry: 'manufacturing, port operations, and Metro NY freight' },
  { slug: 'providence-ri',    name: 'Providence',      state: 'Rhode Island',   abbr: 'RI', stateSlug: 'dot-physical-rhode-island',   highways: 'I-95, I-195, RI-10',   industry: 'healthcare, education, and New England distribution' },
  { slug: 'manchester-nh',    name: 'Manchester',      state: 'New Hampshire',  abbr: 'NH', stateSlug: 'dot-physical-new-hampshire',  highways: 'I-293, I-93, NH-101',  industry: 'technology, healthcare, and Northern New England freight' },
  { slug: 'portland-me',      name: 'Portland',        state: 'Maine',          abbr: 'ME', stateSlug: 'dot-physical-maine',          highways: 'I-295, I-95, US-1',    industry: 'fishing, port shipping, and Northern New England logistics' },
  { slug: 'charleston-wv',    name: 'Charleston',      state: 'West Virginia',  abbr: 'WV', stateSlug: 'dot-physical-west-virginia',  highways: 'I-64, I-77, US-35',    industry: 'coal, chemical, and Appalachian freight' },
  { slug: 'sioux-falls-sd',   name: 'Sioux Falls',     state: 'South Dakota',   abbr: 'SD', stateSlug: 'dot-physical-south-dakota',   highways: 'I-29, I-90, US-16',    industry: 'agriculture, finance, and Northern Plains freight' },
  { slug: 'fargo-nd',         name: 'Fargo',           state: 'North Dakota',   abbr: 'ND', stateSlug: 'dot-physical-north-dakota',   highways: 'I-29, I-94, US-10',    industry: 'agriculture, energy, and Red River Valley freight' },
  { slug: 'billings-mt',      name: 'Billings',        state: 'Montana',        abbr: 'MT', stateSlug: 'dot-physical-montana',        highways: 'I-90, I-94, US-87',    industry: 'oil refining, agriculture, and Big Sky freight' },
  { slug: 'boise-id',         name: 'Boise',           state: 'Idaho',          abbr: 'ID', stateSlug: 'dot-physical-idaho',          highways: 'I-84, I-184, US-20',   industry: 'tech, agriculture, and Pacific Northwest distribution' },
  { slug: 'spokane-wa',       name: 'Spokane',         state: 'Washington',     abbr: 'WA', stateSlug: 'dot-physical-washington',     highways: 'I-90, US-395, I-290',  industry: 'agriculture, mining, and Inland Northwest freight' },
  { slug: 'tacoma-wa',        name: 'Tacoma',          state: 'Washington',     abbr: 'WA', stateSlug: 'dot-physical-washington',     highways: 'I-5, I-705, WA-16',    industry: 'port logistics, military, and Pacific Northwest freight' },
  { slug: 'anchorage-ak',     name: 'Anchorage',       state: 'Alaska',         abbr: 'AK', stateSlug: 'dot-physical-alaska',         highways: 'AK-1, AK-3, AK-4',    industry: 'oil pipeline, military, and Northern freight operations' },
  { slug: 'honolulu-hi',      name: 'Honolulu',        state: 'Hawaii',         abbr: 'HI', stateSlug: 'dot-physical-hawaii',         highways: 'H-1, H-2, H-3',       industry: 'port shipping, military, and island logistics' },
  { slug: 'fort-lauderdale-fl', name: 'Fort Lauderdale', state: 'Florida',      abbr: 'FL', stateSlug: 'dot-physical-florida',        highways: 'I-95, I-75, US-1',     industry: 'port operations, marine logistics, and South Florida freight' },
  { slug: 'st-pete-fl',       name: 'St. Petersburg',  state: 'Florida',        abbr: 'FL', stateSlug: 'dot-physical-florida',        highways: 'I-275, US-19, FL-93',  industry: 'healthcare, shipping, and Tampa Bay area freight' },
  { slug: 'tallahassee-fl',   name: 'Tallahassee',     state: 'Florida',        abbr: 'FL', stateSlug: 'dot-physical-florida',        highways: 'I-10, US-27, US-90',   industry: 'state government, agriculture, and North Florida freight' },
  { slug: 'columbia-md',      name: 'Columbia',        state: 'Maryland',       abbr: 'MD', stateSlug: 'dot-physical-maryland',       highways: 'I-95, MD-29, US-40',   industry: 'federal logistics, cybersecurity, and mid-Atlantic freight' },
  { slug: 'worcester-ma',     name: 'Worcester',       state: 'Massachusetts',  abbr: 'MA', stateSlug: 'dot-physical-massachusetts',  highways: 'I-290, I-190, MA-146', industry: 'biotech, healthcare, and Central Massachusetts freight' },
  { slug: 'springfield-ma',   name: 'Springfield',     state: 'Massachusetts',  abbr: 'MA', stateSlug: 'dot-physical-massachusetts',  highways: 'I-91, I-291, MA-57',   industry: 'defense, distribution, and Pioneer Valley freight' },
  { slug: 'bridgeport-nj',    name: 'Bridgewater',     state: 'New Jersey',     abbr: 'NJ', stateSlug: 'dot-physical-new-jersey',     highways: 'I-287, US-22, NJ-28',  industry: 'pharma, distribution, and Central NJ freight' },
  { slug: 'trenton-nj',       name: 'Trenton',         state: 'New Jersey',     abbr: 'NJ', stateSlug: 'dot-physical-new-jersey',     highways: 'I-95, I-295, NJ-29',   industry: 'state government, pharma, and Delaware Valley freight' },
]

function generatePage(city) {
  const { slug, name, state, abbr, stateSlug, highways, industry } = city
  const title = `DOT Physical in ${name}, ${abbr} | CDL Exam &amp; Drug Test`
  const desc = `DOT physicals &amp; drug testing in ${name}, ${abbr}. FMCSA-certified examiner, same-day results. Order online 24/7. From $110.`
  const canonicalSlug = slug

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${title}</title>
  <meta name="description" content="${desc}" />
  <meta name="keywords" content="DOT physical ${name}, DOT physical ${abbr}, CDL medical exam ${name}, drug testing ${name}, FMCSA medical examiner ${name} ${abbr}, occupational health ${name}" />
  <link rel="canonical" href="https://www.dot-physical.net/cities/${canonicalSlug}.html" />
  <meta property="og:type" content="website" />
  <meta property="og:title" content="DOT Physical &amp; Drug Testing in ${name}, ${abbr} | Doctors Place" />
  <meta property="og:description" content="${desc}" />
  <meta property="og:url" content="https://www.dot-physical.net/cities/${canonicalSlug}.html" />
  <meta property="og:image" content="https://www.dot-physical.net/og-image.png" />
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "MedicalClinic",
    "name": "Doctors Place — ${name} DOT Physical Center",
    "description": "FMCSA-certified DOT physical exams and drug testing serving ${name}, ${state} and surrounding areas.",
    "url": "https://www.dot-physical.net/cities/${canonicalSlug}.html",
    "telephone": "+18882334567",
    "areaServed": {
      "@type": "City",
      "name": "${name}",
      "containedInPlace": { "@type": "State", "name": "${state}" }
    },
    "medicalSpecialty": "Occupational Medicine",
    "availableService": [
      { "@type": "MedicalProcedure", "name": "DOT Physical Exam" },
      { "@type": "MedicalProcedure", "name": "DOT Drug Testing" },
      { "@type": "MedicalProcedure", "name": "Pre-Employment Physical" }
    ]
  }
  </script>
  <script async src="https://www.googletagmanager.com/gtag/js?id=AW-18074042476"></script>
  <script>window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag("js",new Date());gtag("config","AW-18074042476");</script>
  <link rel="stylesheet" href="../style.css" />
  <style>
    .city-hero{background:linear-gradient(135deg,#1a3a5c 0%,#2563eb 100%);color:#fff;padding:72px 24px 56px;text-align:center}
    .city-hero h1{font-size:clamp(1.8rem,4vw,2.8rem);font-weight:800;margin-bottom:16px;line-height:1.2}
    .city-hero p{font-size:1.15rem;max-width:640px;margin:0 auto 32px;opacity:.92}
    .city-hero .cta-btn{display:inline-block;background:#f59e0b;color:#1a1a1a;font-weight:700;font-size:1.1rem;padding:16px 40px;border-radius:8px;text-decoration:none;transition:background .2s}
    .city-hero .cta-btn:hover{background:#d97706}
    .trust-bar{background:#f0f9ff;border-bottom:1px solid #bae6fd;padding:20px 24px;display:flex;flex-wrap:wrap;gap:24px;justify-content:center;text-align:center}
    .trust-item{font-size:.95rem;color:#1e40af;font-weight:600}
    .trust-item span{display:block;font-size:1.4rem;font-weight:800;color:#1a3a5c}
    .section{padding:56px 24px;max-width:1100px;margin:0 auto}
    .section h2{font-size:1.9rem;font-weight:800;color:#1a3a5c;margin-bottom:8px}
    .section .sub{color:#64748b;margin-bottom:36px;font-size:1.05rem}
    .services-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:20px}
    .service-card{background:#fff;border:1px solid #e2e8f0;border-radius:12px;padding:28px 24px;box-shadow:0 1px 4px rgba(0,0,0,.06)}
    .service-card h3{font-size:1.15rem;font-weight:700;color:#1a3a5c;margin-bottom:8px}
    .service-card .price{font-size:1.5rem;font-weight:800;color:#2563eb;margin-bottom:8px}
    .service-card p{color:#64748b;font-size:.92rem;line-height:1.5}
    .why-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:20px}
    .why-card{background:#f8fafc;border-radius:12px;padding:28px 24px}
    .why-card .icon{font-size:2rem;margin-bottom:12px}
    .why-card h3{font-size:1.05rem;font-weight:700;color:#1a3a5c;margin-bottom:6px}
    .why-card p{color:#64748b;font-size:.9rem;line-height:1.5}
    .faq{max-width:780px;margin:0 auto}
    .faq-item{border-bottom:1px solid #e2e8f0;padding:20px 0}
    .faq-item h3{font-size:1.05rem;font-weight:700;color:#1a3a5c;margin-bottom:8px}
    .faq-item p{color:#4b5563;font-size:.95rem;line-height:1.6}
    .cta-banner{background:linear-gradient(135deg,#1a3a5c,#2563eb);color:#fff;padding:56px 24px;text-align:center;border-radius:16px;margin:40px 24px}
    .cta-banner h2{font-size:1.9rem;font-weight:800;margin-bottom:12px}
    .cta-banner p{opacity:.9;margin-bottom:28px;font-size:1.05rem}
    .cta-banner a{display:inline-block;background:#f59e0b;color:#1a1a1a;font-weight:700;padding:16px 44px;border-radius:8px;text-decoration:none;font-size:1.05rem}
    .breadcrumb{background:#f8fafc;padding:12px 24px;font-size:.9rem;color:#64748b}
    .breadcrumb a{color:#2563eb;text-decoration:none}
    .breadcrumb a:hover{text-decoration:underline}
    @media(max-width:600px){.trust-bar{gap:16px}}
  </style>
</head>
<body>
  <nav class="site-nav">
    <div class="nav-inner">
      <a href="../index.html" class="nav-logo">
        <img src="../dp-logo.png" alt="Doctors Place" height="38" />
      </a>
      <ul class="nav-links">
        <li><a href="../services.html">Services</a></li>
        <li><a href="../states.html">Locations</a></li>
        <li><a href="../titers.html">Titer Tests</a></li>
        <li><a href="https://portal.dot-physical.net/order" class="nav-cta">Order Now</a></li>
      </ul>
    </div>
  </nav>

  <div class="breadcrumb">
    <a href="../index.html">Home</a> &rsaquo;
    <a href="../states.html">Locations</a> &rsaquo;
    <a href="../${stateSlug}.html">${state}</a> &rsaquo;
    ${name}
  </div>

  <div class="city-hero">
    <h1>DOT Physical &amp; Drug Testing<br>in ${name}, ${abbr}</h1>
    <p>FMCSA-certified medical examiners serving ${name}'s ${industry} sectors. Order online — same-day results at 15,000+ certified collection sites nationwide.</p>
    <a href="https://portal.dot-physical.net/order" class="cta-btn">Order Now &rarr;</a>
  </div>

  <div class="trust-bar">
    <div class="trust-item"><span>15,000+</span>Collection Sites Nationwide</div>
    <div class="trust-item"><span>Same Day</span>Results Available</div>
    <div class="trust-item"><span>FMCSA</span>Certified Examiners</div>
    <div class="trust-item"><span>$110</span>DOT Physical</div>
    <div class="trust-item"><span>$55</span>Drug Test</div>
  </div>

  <div class="section">
    <h2>Services Available in ${name}, ${abbr}</h2>
    <p class="sub">Everything CDL drivers and employers need &mdash; all in one place.</p>
    <div class="services-grid">
      <div class="service-card">
        <h3>DOT Physical Exam</h3>
        <div class="price">$110</div>
        <p>FMCSA-certified exam with Medical Examiner Certificate issued same day. Valid 24 months.</p>
      </div>
      <div class="service-card">
        <h3>DOT Drug Test (5-Panel)</h3>
        <div class="price">$55</div>
        <p>FMCSA-mandated urine drug screen with MRO-reviewed results. Same-day collection at 15,000+ sites.</p>
      </div>
      <div class="service-card">
        <h3>Pre-Employment Physical</h3>
        <div class="price">$85</div>
        <p>Comprehensive occupational health exam for new hires in transportation, construction, and more.</p>
      </div>
      <div class="service-card">
        <h3>Breath Alcohol Test (BAT)</h3>
        <div class="price">$45</div>
        <p>DOT-compliant breath alcohol testing with certified BAT technician. Results in minutes.</p>
      </div>
      <div class="service-card">
        <h3>Non-DOT Drug Panel</h3>
        <div class="price">$45</div>
        <p>5 or 10-panel non-DOT urine drug screen for employers not subject to DOT regulations.</p>
      </div>
      <div class="service-card">
        <h3>Titer Tests</h3>
        <div class="price">from $65</div>
        <p>Immunity bloodwork for Hep B, MMR, Varicella, and more. Results in 3&ndash;5 business days.</p>
      </div>
    </div>
  </div>

  <div style="background:#f8fafc;padding:56px 24px">
    <div class="section" style="padding:0">
      <h2>Why ${name} Drivers Choose Doctors Place</h2>
      <p class="sub">Trusted by CDL drivers and fleet managers across ${state}.</p>
      <div class="why-grid">
        <div class="why-card">
          <div class="icon">&#128338;</div>
          <h3>Order in 2 Minutes</h3>
          <p>Order online anytime. Receive your lab authorization within 1 hour during business hours &mdash; then visit any nearby collection site.</p>
        </div>
        <div class="why-card">
          <div class="icon">&#9989;</div>
          <h3>FMCSA-Registered</h3>
          <p>All medical examiners are listed on the FMCSA National Registry &mdash; fully compliant.</p>
        </div>
        <div class="why-card">
          <div class="icon">&#128205;</div>
          <h3>15,000+ Locations</h3>
          <p>Nationwide collection network &mdash; find a site near any ${name} zip code in seconds.</p>
        </div>
        <div class="why-card">
          <div class="icon">&#128196;</div>
          <h3>Same-Day Certificate</h3>
          <p>Pass your DOT physical and receive your Medical Examiner Certificate same day.</p>
        </div>
        <div class="why-card">
          <div class="icon">&#128722;</div>
          <h3>Employer Accounts</h3>
          <p>Fleet managers get a free portal to order, track, and manage driver compliance online.</p>
        </div>
        <div class="why-card">
          <div class="icon">&#128222;</div>
          <h3>Live Support</h3>
          <p>Call <a href="tel:8882334567" style="color:#2563eb">(888) 233-4567</a> &mdash; real people, no phone trees.</p>
        </div>
      </div>
    </div>
  </div>

  <div class="section">
    <h2>DOT Physical FAQ &mdash; ${name}, ${abbr}</h2>
    <p class="sub">Common questions from ${name} CDL drivers and fleet managers.</p>
    <div class="faq">
      <div class="faq-item">
        <h3>Where can I get a DOT physical near ${name}, ${abbr}?</h3>
        <p>Doctors Place has multiple collection and exam sites serving the ${name} area, including locations accessible from ${highways}. Order online at portal.dot-physical.net to find the nearest open slot.</p>
      </div>
      <div class="faq-item">
        <h3>How much does a DOT physical cost in ${name}?</h3>
        <p>DOT physicals through Doctors Place start at <strong>$110</strong> in the ${name} area. Your Medical Examiner Certificate is included at no extra charge.</p>
      </div>
      <div class="faq-item">
        <h3>How do I order a DOT physical in ${name}?</h3>
        <p>Order online at portal.dot-physical.net in under 2 minutes. You'll receive a lab authorization by email within 1 hour, then visit any of our 15,000+ certified collection sites near ${name}.</p>
      </div>
      <div class="faq-item">
        <h3>How long does a DOT physical take?</h3>
        <p>Most DOT physicals take 30&ndash;45 minutes. Bring a valid photo ID, glasses or contacts if you use them, and a list of any current medications.</p>
      </div>
      <div class="faq-item">
        <h3>Do you offer DOT drug testing in ${name} as well?</h3>
        <p>Yes &mdash; DOT-compliant 5-panel urine drug tests are available at the same sites, starting at <strong>$55</strong>. MRO-reviewed results are typically available within 24&ndash;48 hours.</p>
      </div>
    </div>
  </div>

  <div class="cta-banner">
    <h2>Ready to Order in ${name}, ${abbr}?</h2>
    <p>Join thousands of CDL drivers who trust Doctors Place for fast, compliant DOT physicals.</p>
    <a href="https://portal.dot-physical.net/order">Order Now &mdash; It Only Takes 2 Minutes</a>
  </div>

  <footer class="site-footer">
    <div class="footer-inner">
      <p>&copy; 2026 Doctors Place. All rights reserved.</p>
      <p style="margin-top:8px;font-size:.85rem;color:#94a3b8">
        <a href="../index.html">Home</a> &middot;
        <a href="../services.html">Services</a> &middot;
        <a href="../states.html">Locations</a> &middot;
        <a href="../contact.html">Contact</a>
      </p>
    </div>
  </footer>
</body>
</html>`
}

let created = 0
for (const city of cities) {
  const filePath = join(OUT, `${city.slug}.html`)
  writeFileSync(filePath, generatePage(city), 'utf8')
  created++
}
console.log(`Generated ${created} city pages in cities/`)
