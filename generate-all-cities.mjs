import { writeFileSync, existsSync, readdirSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const OUT = join(__dirname, 'cities')

// Same city data as workoccmed, adapted for dot-physical.net style
const STATES = [
  { name: 'Alabama',       abbr: 'AL', slug: 'dot-physical-alabama',        highways: 'I-65, I-20, I-22',    cities: ['Birmingham','Montgomery','Huntsville','Mobile','Tuscaloosa','Hoover','Dothan','Auburn','Decatur','Madison'] },
  { name: 'Alaska',        abbr: 'AK', slug: 'dot-physical-alaska',         highways: 'AK-1, AK-3, AK-4',   cities: ['Anchorage','Fairbanks','Juneau','Sitka','Ketchikan','Wasilla','Kenai','Kodiak','Palmer','Bethel'] },
  { name: 'Arizona',       abbr: 'AZ', slug: 'dot-physical-arizona',        highways: 'I-10, I-17, I-40',    cities: ['Phoenix','Tucson','Mesa','Chandler','Scottsdale','Glendale','Gilbert','Tempe','Peoria','Surprise'] },
  { name: 'Arkansas',      abbr: 'AR', slug: 'dot-physical-arkansas',       highways: 'I-40, I-30, I-49',    cities: ['Little Rock','Fort Smith','Fayetteville','Springdale','Jonesboro','North Little Rock','Conway','Rogers','Bentonville','Pine Bluff'] },
  { name: 'California',    abbr: 'CA', slug: 'dot-physical-california',     highways: 'I-5, I-80, US-101',   cities: ['Los Angeles','San Diego','San Jose','San Francisco','Fresno','Sacramento','Long Beach','Oakland','Bakersfield','Anaheim','Riverside','Stockton','Modesto','Chula Vista','Irvine'] },
  { name: 'Colorado',      abbr: 'CO', slug: 'dot-physical-colorado',       highways: 'I-25, I-70, US-36',   cities: ['Denver','Colorado Springs','Aurora','Fort Collins','Lakewood','Thornton','Arvada','Westminster','Pueblo','Boulder'] },
  { name: 'Connecticut',   abbr: 'CT', slug: 'dot-physical-connecticut',    highways: 'I-95, I-91, I-84',    cities: ['Bridgeport','New Haven','Hartford','Stamford','Waterbury','Norwalk','Danbury','New Britain','West Hartford','Greenwich'] },
  { name: 'Delaware',      abbr: 'DE', slug: 'dot-physical-delaware',       highways: 'I-95, US-13, DE-1',   cities: ['Wilmington','Dover','Newark','Middletown','Smyrna','Milford','Seaford','Georgetown','Elsmere','New Castle'] },
  { name: 'Florida',       abbr: 'FL', slug: 'dot-physical-florida',        highways: 'I-95, I-75, I-4',     cities: ['Jacksonville','Miami','Tampa','Orlando','St. Petersburg','Hialeah','Port St. Lucie','Tallahassee','Fort Lauderdale','Cape Coral','Pembroke Pines','Hollywood','Gainesville','Miramar','Coral Springs'] },
  { name: 'Georgia',       abbr: 'GA', slug: 'dot-physical-georgia',        highways: 'I-75, I-85, I-20',    cities: ['Atlanta','Augusta','Columbus','Macon','Savannah','Athens','Sandy Springs','Roswell','Johns Creek','Albany'] },
  { name: 'Hawaii',        abbr: 'HI', slug: 'dot-physical-hawaii',         highways: 'H-1, H-2, H-3',       cities: ['Honolulu','Pearl City','Hilo','Kailua','Waipahu','Kaneohe','Mililani','Kahului','Ewa Beach','Kihei'] },
  { name: 'Idaho',         abbr: 'ID', slug: 'dot-physical-idaho',          highways: 'I-84, I-86, US-20',   cities: ['Boise','Meridian','Nampa','Idaho Falls','Pocatello','Caldwell','Coeur d\'Alene','Twin Falls','Lewiston','Post Falls'] },
  { name: 'Illinois',      abbr: 'IL', slug: 'dot-physical-illinois',       highways: 'I-90, I-94, I-55',    cities: ['Chicago','Aurora','Naperville','Joliet','Rockford','Springfield','Elgin','Peoria','Champaign','Waukegan','Cicero','Bloomington','Decatur','Evanston','Schaumburg'] },
  { name: 'Indiana',       abbr: 'IN', slug: 'dot-physical-indiana',        highways: 'I-65, I-70, I-74',    cities: ['Indianapolis','Fort Wayne','Evansville','South Bend','Carmel','Fishers','Bloomington','Hammond','Gary','Lafayette'] },
  { name: 'Iowa',          abbr: 'IA', slug: 'dot-physical-iowa',           highways: 'I-80, I-35, I-29',    cities: ['Des Moines','Cedar Rapids','Davenport','Sioux City','Iowa City','Waterloo','Council Bluffs','Ames','West Des Moines','Dubuque'] },
  { name: 'Kansas',        abbr: 'KS', slug: 'dot-physical-kansas',         highways: 'I-70, I-35, US-50',   cities: ['Wichita','Overland Park','Kansas City','Olathe','Topeka','Lawrence','Shawnee','Manhattan','Lenexa','Salina'] },
  { name: 'Kentucky',      abbr: 'KY', slug: 'dot-physical-kentucky',       highways: 'I-65, I-64, I-75',    cities: ['Louisville','Lexington','Bowling Green','Owensboro','Covington','Richmond','Georgetown','Florence','Hopkinsville','Nicholasville'] },
  { name: 'Louisiana',     abbr: 'LA', slug: 'dot-physical-louisiana',      highways: 'I-10, I-20, I-49',    cities: ['New Orleans','Baton Rouge','Shreveport','Metairie','Lafayette','Lake Charles','Kenner','Bossier City','Monroe','Alexandria'] },
  { name: 'Maine',         abbr: 'ME', slug: 'dot-physical-maine',          highways: 'I-95, I-295, US-1',   cities: ['Portland','Lewiston','Bangor','South Portland','Auburn','Biddeford','Sanford','Augusta','Saco','Westbrook'] },
  { name: 'Maryland',      abbr: 'MD', slug: 'dot-physical-maryland',       highways: 'I-95, I-70, I-83',    cities: ['Baltimore','Frederick','Rockville','Gaithersburg','Bowie','Hagerstown','Annapolis','College Park','Salisbury','Laurel'] },
  { name: 'Massachusetts', abbr: 'MA', slug: 'dot-physical-massachusetts',  highways: 'I-90, I-93, I-95',    cities: ['Boston','Worcester','Springfield','Cambridge','Lowell','Brockton','New Bedford','Quincy','Lynn','Fall River'] },
  { name: 'Michigan',      abbr: 'MI', slug: 'dot-physical-michigan',       highways: 'I-75, I-94, I-96',    cities: ['Detroit','Grand Rapids','Warren','Sterling Heights','Ann Arbor','Lansing','Flint','Dearborn','Livonia','Troy','Westland','Kalamazoo','Farmington Hills','Clinton Township','Canton'] },
  { name: 'Minnesota',     abbr: 'MN', slug: 'dot-physical-minnesota',      highways: 'I-35, I-94, I-494',   cities: ['Minneapolis','Saint Paul','Rochester','Duluth','Bloomington','Brooklyn Park','Plymouth','Maple Grove','Woodbury','St. Cloud'] },
  { name: 'Mississippi',   abbr: 'MS', slug: 'dot-physical-mississippi',    highways: 'I-55, I-20, US-49',   cities: ['Jackson','Gulfport','Southaven','Hattiesburg','Biloxi','Meridian','Tupelo','Olive Branch','Greenville','Horn Lake'] },
  { name: 'Missouri',      abbr: 'MO', slug: 'dot-physical-missouri',       highways: 'I-70, I-44, I-55',    cities: ['Kansas City','St. Louis','Springfield','Columbia','Independence','Lee\'s Summit','O\'Fallon','St. Joseph','St. Charles','Blue Springs'] },
  { name: 'Montana',       abbr: 'MT', slug: 'dot-physical-montana',        highways: 'I-90, I-94, US-2',    cities: ['Billings','Missoula','Great Falls','Bozeman','Butte','Helena','Kalispell','Havre','Anaconda','Miles City'] },
  { name: 'Nebraska',      abbr: 'NE', slug: 'dot-physical-nebraska',       highways: 'I-80, I-29, US-75',   cities: ['Omaha','Lincoln','Bellevue','Grand Island','Kearney','Fremont','Hastings','North Platte','Norfolk','Columbus'] },
  { name: 'Nevada',        abbr: 'NV', slug: 'dot-physical-nevada',         highways: 'I-15, I-80, US-95',   cities: ['Las Vegas','Henderson','Reno','North Las Vegas','Sparks','Carson City','Fernley','Elko','Mesquite','Boulder City'] },
  { name: 'New Hampshire', abbr: 'NH', slug: 'dot-physical-new-hampshire',  highways: 'I-93, I-89, NH-101',  cities: ['Manchester','Nashua','Concord','Derry','Dover','Rochester','Salem','Merrimack','Hudson','Bedford'] },
  { name: 'New Jersey',    abbr: 'NJ', slug: 'dot-physical-new-jersey',     highways: 'I-95, I-78, NJ-18',   cities: ['Newark','Jersey City','Paterson','Elizabeth','Trenton','Clifton','Camden','Passaic','Hackensack','Bayonne','East Orange','Vineland','Union City','Edison','Woodbridge'] },
  { name: 'New Mexico',    abbr: 'NM', slug: 'dot-physical-new-mexico',     highways: 'I-40, I-25, US-550',  cities: ['Albuquerque','Las Cruces','Rio Rancho','Santa Fe','Roswell','Farmington','Clovis','Hobbs','Alamogordo','Carlsbad'] },
  { name: 'New York',      abbr: 'NY', slug: 'dot-physical-new-york',       highways: 'I-87, I-90, I-278',   cities: ['New York City','Buffalo','Rochester','Yonkers','Syracuse','Albany','New Rochelle','Mount Vernon','Schenectady','Utica','White Plains','Brooklyn','Queens','Bronx','Staten Island'] },
  { name: 'North Carolina',abbr: 'NC', slug: 'dot-physical-north-carolina', highways: 'I-40, I-85, I-77',    cities: ['Charlotte','Raleigh','Greensboro','Durham','Winston-Salem','Fayetteville','Cary','Wilmington','High Point','Concord'] },
  { name: 'North Dakota',  abbr: 'ND', slug: 'dot-physical-north-dakota',   highways: 'I-94, I-29, US-2',    cities: ['Fargo','Bismarck','Grand Forks','Minot','West Fargo','Williston','Dickinson','Mandan','Jamestown','Wahpeton'] },
  { name: 'Ohio',          abbr: 'OH', slug: 'dot-physical-ohio',           highways: 'I-71, I-75, I-80',    cities: ['Columbus','Cleveland','Cincinnati','Toledo','Akron','Dayton','Parma','Canton','Youngstown','Lorain','Hamilton','Springfield','Kettering','Elyria','Lakewood'] },
  { name: 'Oklahoma',      abbr: 'OK', slug: 'dot-physical-oklahoma',       highways: 'I-35, I-40, I-44',    cities: ['Oklahoma City','Tulsa','Norman','Broken Arrow','Edmond','Lawton','Moore','Midwest City','Enid','Stillwater'] },
  { name: 'Oregon',        abbr: 'OR', slug: 'dot-physical-oregon',         highways: 'I-5, I-84, US-97',    cities: ['Portland','Eugene','Salem','Gresham','Hillsboro','Beaverton','Bend','Medford','Springfield','Corvallis'] },
  { name: 'Pennsylvania',  abbr: 'PA', slug: 'dot-physical-pennsylvania',   highways: 'I-76, I-95, I-80',    cities: ['Philadelphia','Pittsburgh','Allentown','Erie','Reading','Scranton','Bethlehem','Lancaster','Harrisburg','Altoona','York','Wilkes-Barre','Chester','State College','Norristown'] },
  { name: 'Rhode Island',  abbr: 'RI', slug: 'dot-physical-rhode-island',   highways: 'I-95, I-195, RI-10',  cities: ['Providence','Cranston','Warwick','Pawtucket','East Providence','Woonsocket','Coventry','North Providence','Cumberland','West Warwick'] },
  { name: 'South Carolina',abbr: 'SC', slug: 'dot-physical-south-carolina', highways: 'I-26, I-77, I-95',    cities: ['Columbia','Charleston','North Charleston','Mount Pleasant','Rock Hill','Greenville','Summerville','Goose Creek','Hilton Head Island','Sumter'] },
  { name: 'South Dakota',  abbr: 'SD', slug: 'dot-physical-south-dakota',   highways: 'I-90, I-29, US-14',   cities: ['Sioux Falls','Rapid City','Aberdeen','Brookings','Watertown','Mitchell','Yankton','Pierre','Huron','Vermillion'] },
  { name: 'Tennessee',     abbr: 'TN', slug: 'dot-physical-tennessee',      highways: 'I-40, I-65, I-24',    cities: ['Nashville','Memphis','Knoxville','Chattanooga','Clarksville','Murfreesboro','Franklin','Jackson','Johnson City','Bartlett'] },
  { name: 'Texas',         abbr: 'TX', slug: 'dot-physical-texas',          highways: 'I-10, I-35, I-20',    cities: ['Houston','San Antonio','Dallas','Austin','Fort Worth','El Paso','Arlington','Corpus Christi','Plano','Lubbock','Laredo','Irving','Garland','Frisco','McKinney','Amarillo','Grand Prairie','Killeen','Beaumont','Midland'] },
  { name: 'Utah',          abbr: 'UT', slug: 'dot-physical-utah',           highways: 'I-15, I-80, I-70',    cities: ['Salt Lake City','West Valley City','Provo','West Jordan','Orem','Sandy','Ogden','St. George','Layton','South Jordan'] },
  { name: 'Vermont',       abbr: 'VT', slug: 'dot-physical-vermont',        highways: 'I-89, I-91, US-2',    cities: ['Burlington','South Burlington','Rutland','Barre','Montpelier','Winooski','St. Albans','Newport','Vergennes','Middlebury'] },
  { name: 'Virginia',      abbr: 'VA', slug: 'dot-physical-virginia',       highways: 'I-95, I-64, I-81',    cities: ['Virginia Beach','Norfolk','Chesapeake','Richmond','Newport News','Alexandria','Hampton','Roanoke','Portsmouth','Suffolk'] },
  { name: 'Washington',    abbr: 'WA', slug: 'dot-physical-washington',     highways: 'I-5, I-90, I-82',     cities: ['Seattle','Spokane','Tacoma','Vancouver','Bellevue','Kent','Everett','Renton','Spokane Valley','Kirkland'] },
  { name: 'West Virginia', abbr: 'WV', slug: 'dot-physical-west-virginia',  highways: 'I-64, I-77, I-79',    cities: ['Charleston','Huntington','Morgantown','Parkersburg','Wheeling','Weirton','Fairmont','Martinsburg','Beckley','Clarksburg'] },
  { name: 'Wisconsin',     abbr: 'WI', slug: 'dot-physical-wisconsin',      highways: 'I-94, I-90, I-43',    cities: ['Milwaukee','Madison','Green Bay','Kenosha','Racine','Appleton','Waukesha','Eau Claire','Oshkosh','Janesville'] },
  { name: 'Wyoming',       abbr: 'WY', slug: 'dot-physical-wyoming',        highways: 'I-80, I-25, US-26',   cities: ['Cheyenne','Casper','Laramie','Gillette','Rock Springs','Sheridan','Green River','Evanston','Riverton','Jackson'] },
]

function toSlug(city) {
  return city.toLowerCase()
    .replace(/\./g, '')
    .replace(/'/g, '')
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '')
}

function generatePage(city, state, abbr, stateSlug, highways) {
  const citySlug = `${toSlug(city)}-${abbr.toLowerCase()}`
  return { slug: citySlug, html: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>DOT Physical in ${city}, ${abbr} | CDL Exam &amp; Drug Test — $110 | Doctors Place</title>
  <meta name="description" content="DOT physicals &amp; drug testing in ${city}, ${abbr}. FMCSA-certified examiner, same-day results. Order online in 2 minutes. From $110." />
  <meta name="keywords" content="DOT physical ${city}, DOT physical ${abbr}, CDL medical exam ${city}, drug testing ${city}, FMCSA medical examiner ${city} ${abbr}, occupational health ${city}" />
  <link rel="canonical" href="https://www.dot-physical.net/cities/${citySlug}.html" />
  <meta property="og:type" content="website" />
  <meta property="og:title" content="DOT Physical &amp; Drug Testing in ${city}, ${abbr} | Doctors Place" />
  <meta property="og:description" content="DOT physicals &amp; drug testing in ${city}, ${abbr}. FMCSA-certified examiner, same-day results. Order online in 2 minutes. From $110." />
  <meta property="og:url" content="https://www.dot-physical.net/cities/${citySlug}.html" />
  <meta property="og:image" content="https://www.dot-physical.net/og-image.png" />
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "MedicalClinic",
    "name": "Doctors Place — ${city} DOT Physical Center",
    "description": "FMCSA-certified DOT physical exams and drug testing serving ${city}, ${state} and surrounding areas.",
    "url": "https://www.dot-physical.net/cities/${citySlug}.html",
    "telephone": "+18882334567",
    "areaServed": {
      "@type": "City",
      "name": "${city}",
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
    ${city}
  </div>

  <div class="city-hero">
    <h1>DOT Physical &amp; Drug Testing<br>in ${city}, ${abbr}</h1>
    <p>FMCSA-certified medical examiners serving ${city}, ${state}. Order online in 2 minutes &mdash; same-day results at 15,000+ certified collection sites nationwide.</p>
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
    <h2>Services Available in ${city}, ${abbr}</h2>
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
      <h2>Why ${city} Drivers Choose Doctors Place</h2>
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
          <p>Nationwide collection network &mdash; find a site near any ${city} zip code in seconds.</p>
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
    <h2>DOT Physical FAQ &mdash; ${city}, ${abbr}</h2>
    <p class="sub">Common questions from ${city} CDL drivers and fleet managers.</p>
    <div class="faq">
      <div class="faq-item">
        <h3>Where can I get a DOT physical near ${city}, ${abbr}?</h3>
        <p>Doctors Place has multiple collection and exam sites serving ${city} and surrounding areas, accessible from ${highways}. Order at portal.dot-physical.net to find the nearest open slot.</p>
      </div>
      <div class="faq-item">
        <h3>How much does a DOT physical cost in ${city}?</h3>
        <p>DOT physicals through Doctors Place start at <strong>$110</strong> in the ${city} area. Your Medical Examiner Certificate is included at no extra charge.</p>
      </div>
      <div class="faq-item">
        <h3>How do I order a DOT physical in ${city}?</h3>
        <p>Order online at portal.dot-physical.net in under 2 minutes. You'll receive a lab authorization by email within 1 hour, then visit any of our 15,000+ certified collection sites near ${city}.</p>
      </div>
      <div class="faq-item">
        <h3>How long does a DOT physical take?</h3>
        <p>Most DOT physicals take 30&ndash;45 minutes. Bring a valid photo ID, glasses or contacts if you use them, and a list of any current medications.</p>
      </div>
      <div class="faq-item">
        <h3>Do you offer DOT drug testing in ${city}?</h3>
        <p>Yes &mdash; DOT-compliant 5-panel urine drug tests available at the same sites, starting at <strong>$55</strong>. MRO-reviewed results typically within 24&ndash;48 hours.</p>
      </div>
    </div>
  </div>

  <div class="cta-banner">
    <h2>Ready to Order in ${city}, ${abbr}?</h2>
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
</html>` }
}

// Get existing city slugs
const existing = new Set(readdirSync(OUT).map(f => f.replace('.html', '')))

let created = 0, skipped = 0
for (const st of STATES) {
  st.cities.forEach((city, i) => {
    const { slug, html } = generatePage(city, st.name, st.abbr, st.slug, st.highways)
    if (existing.has(slug)) { skipped++; return }
    writeFileSync(join(OUT, `${slug}.html`), html, 'utf8')
    created++
  })
}
console.log(`Created: ${created} | Skipped (already existed): ${skipped}`)
console.log(`Total city pages: ${readdirSync(OUT).length}`)
