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
  {
    slug: 'michigan',
    name: 'Michigan',
    abbr: 'MI',
    sites: '350+',
    cities: [
      { name: 'Detroit / Metro', sites: '90+' },
      { name: 'Grand Rapids', sites: '40+' },
      { name: 'Lansing', sites: '25+' },
      { name: 'Flint', sites: '20+' },
      { name: 'Ann Arbor', sites: '22+' },
      { name: 'Kalamazoo', sites: '18+' },
      { name: 'Saginaw', sites: '15+' },
      { name: 'Muskegon', sites: '12+' },
      { name: 'Bay City', sites: '10+' },
      { name: 'Traverse City', sites: '8+' },
      { name: 'Marquette', sites: '6+' },
      { name: 'All Other MI Cities', sites: 'Statewide coverage' },
    ],
    faqExtra: 'Michigan is a major automotive logistics and freight state. The Detroit metro is one of the highest-density CDL employer markets in the Midwest.',
  },
  {
    slug: 'virginia',
    name: 'Virginia',
    abbr: 'VA',
    sites: '320+',
    cities: [
      { name: 'Northern Virginia', sites: '70+' },
      { name: 'Richmond', sites: '50+' },
      { name: 'Virginia Beach / Norfolk', sites: '55+' },
      { name: 'Roanoke', sites: '20+' },
      { name: 'Chesapeake', sites: '20+' },
      { name: 'Hampton', sites: '15+' },
      { name: 'Newport News', sites: '15+' },
      { name: 'Alexandria', sites: '18+' },
      { name: 'Lynchburg', sites: '12+' },
      { name: 'Harrisonburg', sites: '10+' },
      { name: 'Charlottesville', sites: '10+' },
      { name: 'All Other VA Cities', sites: 'Statewide coverage' },
    ],
    faqExtra: 'Virginia\'s I-81 corridor is one of the most heavily trafficked freight routes on the East Coast. The Port of Virginia in Norfolk is among the top container ports in the US.',
  },
  {
    slug: 'washington',
    name: 'Washington',
    abbr: 'WA',
    sites: '280+',
    cities: [
      { name: 'Seattle / King County', sites: '80+' },
      { name: 'Spokane', sites: '35+' },
      { name: 'Tacoma', sites: '40+' },
      { name: 'Vancouver', sites: '20+' },
      { name: 'Bellevue', sites: '20+' },
      { name: 'Everett', sites: '18+' },
      { name: 'Olympia', sites: '12+' },
      { name: 'Yakima', sites: '10+' },
      { name: 'Bellingham', sites: '10+' },
      { name: 'Kennewick', sites: '10+' },
      { name: 'Marysville', sites: '8+' },
      { name: 'All Other WA Cities', sites: 'Statewide coverage' },
    ],
    faqExtra: 'Washington state is a major Pacific freight gateway. The Port of Seattle and Port of Tacoma together form one of the largest container port complexes in North America.',
  },
  {
    slug: 'massachusetts',
    name: 'Massachusetts',
    abbr: 'MA',
    sites: '250+',
    cities: [
      { name: 'Boston / Metro', sites: '80+' },
      { name: 'Worcester', sites: '30+' },
      { name: 'Springfield', sites: '20+' },
      { name: 'Lowell', sites: '15+' },
      { name: 'Cambridge', sites: '12+' },
      { name: 'New Bedford', sites: '10+' },
      { name: 'Brockton', sites: '12+' },
      { name: 'Quincy', sites: '10+' },
      { name: 'Lynn', sites: '8+' },
      { name: 'Fall River', sites: '10+' },
      { name: 'Framingham', sites: '10+' },
      { name: 'All Other MA Cities', sites: 'Statewide coverage' },
    ],
    faqExtra: 'Massachusetts has a dense occupational health and healthcare workforce requiring titer tests, TB tests, and pre-employment physicals. Boston is also a key Northeast freight hub.',
  },
  {
    slug: 'indiana',
    name: 'Indiana',
    abbr: 'IN',
    sites: '280+',
    cities: [
      { name: 'Indianapolis', sites: '70+' },
      { name: 'Fort Wayne', sites: '30+' },
      { name: 'Evansville', sites: '22+' },
      { name: 'South Bend', sites: '20+' },
      { name: 'Gary', sites: '18+' },
      { name: 'Bloomington', sites: '12+' },
      { name: 'Muncie', sites: '10+' },
      { name: 'Terre Haute', sites: '12+' },
      { name: 'Lafayette', sites: '10+' },
      { name: 'Kokomo', sites: '8+' },
      { name: 'Anderson', sites: '8+' },
      { name: 'All Other IN Cities', sites: 'Statewide coverage' },
    ],
    faqExtra: 'Indiana is a major Midwest logistics hub at the crossroads of I-65, I-70, and I-74. Indianapolis has one of the highest densities of CDL-regulated trucking companies in the region.',
  },
  {
    slug: 'missouri',
    name: 'Missouri',
    abbr: 'MO',
    sites: '270+',
    cities: [
      { name: 'St. Louis', sites: '75+' },
      { name: 'Kansas City', sites: '65+' },
      { name: 'Springfield', sites: '25+' },
      { name: 'Columbia', sites: '18+' },
      { name: 'Independence', sites: '15+' },
      { name: 'Lee\'s Summit', sites: '12+' },
      { name: 'O\'Fallon', sites: '10+' },
      { name: 'St. Joseph', sites: '10+' },
      { name: 'Joplin', sites: '10+' },
      { name: 'Jefferson City', sites: '8+' },
      { name: 'Cape Girardeau', sites: '8+' },
      { name: 'All Other MO Cities', sites: 'Statewide coverage' },
    ],
    faqExtra: 'Missouri sits at the geographic center of the continental US, making St. Louis and Kansas City two of the most important freight interchange hubs in the country.',
  },
  {
    slug: 'maryland',
    name: 'Maryland',
    abbr: 'MD',
    sites: '220+',
    cities: [
      { name: 'Baltimore', sites: '65+' },
      { name: 'Silver Spring', sites: '20+' },
      { name: 'Rockville', sites: '15+' },
      { name: 'Frederick', sites: '15+' },
      { name: 'Gaithersburg', sites: '12+' },
      { name: 'Annapolis', sites: '10+' },
      { name: 'Hagerstown', sites: '10+' },
      { name: 'Bowie', sites: '8+' },
      { name: 'Towson', sites: '10+' },
      { name: 'College Park', sites: '8+' },
      { name: 'Salisbury', sites: '8+' },
      { name: 'All Other MD Cities', sites: 'Statewide coverage' },
    ],
    faqExtra: 'Maryland is a major Mid-Atlantic freight state. The Port of Baltimore is one of the top ports for auto imports and bulk cargo on the East Coast, driving high CDL demand.',
  },
  {
    slug: 'wisconsin',
    name: 'Wisconsin',
    abbr: 'WI',
    sites: '240+',
    cities: [
      { name: 'Milwaukee', sites: '65+' },
      { name: 'Madison', sites: '35+' },
      { name: 'Green Bay', sites: '25+' },
      { name: 'Kenosha', sites: '18+' },
      { name: 'Racine', sites: '15+' },
      { name: 'Appleton', sites: '15+' },
      { name: 'Waukesha', sites: '12+' },
      { name: 'Eau Claire', sites: '10+' },
      { name: 'Oshkosh', sites: '10+' },
      { name: 'Janesville', sites: '8+' },
      { name: 'La Crosse', sites: '8+' },
      { name: 'All Other WI Cities', sites: 'Statewide coverage' },
    ],
    faqExtra: 'Wisconsin is a major dairy, food processing, and manufacturing freight state. The Milwaukee and Green Bay corridors carry some of the highest truck volumes in the upper Midwest.',
  },
  {
    slug: 'colorado',
    name: 'Colorado',
    abbr: 'CO',
    sites: '230+',
    cities: [
      { name: 'Denver / Metro', sites: '80+' },
      { name: 'Colorado Springs', sites: '30+' },
      { name: 'Aurora', sites: '20+' },
      { name: 'Fort Collins', sites: '15+' },
      { name: 'Lakewood', sites: '12+' },
      { name: 'Thornton', sites: '10+' },
      { name: 'Arvada', sites: '10+' },
      { name: 'Westminster', sites: '10+' },
      { name: 'Pueblo', sites: '10+' },
      { name: 'Greeley', sites: '8+' },
      { name: 'Grand Junction', sites: '8+' },
      { name: 'All Other CO Cities', sites: 'Statewide coverage' },
    ],
    faqExtra: 'Colorado is a major I-70 mountain corridor freight state connecting the Midwest to the West Coast. Denver is a critical distribution and intermodal hub for the Rocky Mountain region.',
  },
  {
    slug: 'minnesota',
    name: 'Minnesota',
    abbr: 'MN',
    sites: '230+',
    cities: [
      { name: 'Minneapolis / St. Paul', sites: '80+' },
      { name: 'Rochester', sites: '20+' },
      { name: 'Duluth', sites: '15+' },
      { name: 'Bloomington', sites: '12+' },
      { name: 'Brooklyn Park', sites: '10+' },
      { name: 'Plymouth', sites: '10+' },
      { name: 'Woodbury', sites: '10+' },
      { name: 'St. Cloud', sites: '12+' },
      { name: 'Eagan', sites: '8+' },
      { name: 'Mankato', sites: '8+' },
      { name: 'Moorhead', sites: '6+' },
      { name: 'All Other MN Cities', sites: 'Statewide coverage' },
    ],
    faqExtra: 'Minnesota is a major agricultural freight and healthcare employment state. The Twin Cities metro is one of the largest healthcare employer markets in the upper Midwest — a key market for titer tests and occupational physicals.',
  },
  {
    slug: 'louisiana',
    name: 'Louisiana',
    abbr: 'LA',
    sites: '220+',
    cities: [
      { name: 'New Orleans', sites: '55+' },
      { name: 'Baton Rouge', sites: '45+' },
      { name: 'Shreveport', sites: '25+' },
      { name: 'Lafayette', sites: '22+' },
      { name: 'Lake Charles', sites: '15+' },
      { name: 'Kenner', sites: '10+' },
      { name: 'Bossier City', sites: '10+' },
      { name: 'Monroe', sites: '10+' },
      { name: 'Alexandria', sites: '8+' },
      { name: 'Houma', sites: '8+' },
      { name: 'New Iberia', sites: '6+' },
      { name: 'All Other LA Cities', sites: 'Statewide coverage' },
    ],
    faqExtra: 'Louisiana hosts the busiest port complex in the US by tonnage. The Port of South Louisiana and Port of New Orleans together move more cargo than any other port system in the country, creating enormous CDL compliance demand.',
  },
  {
    slug: 'kentucky',
    name: 'Kentucky',
    abbr: 'KY',
    sites: '200+',
    cities: [
      { name: 'Louisville', sites: '60+' },
      { name: 'Lexington', sites: '35+' },
      { name: 'Bowling Green', sites: '18+' },
      { name: 'Owensboro', sites: '12+' },
      { name: 'Covington', sites: '12+' },
      { name: 'Frankfort', sites: '8+' },
      { name: 'Florence', sites: '8+' },
      { name: 'Hopkinsville', sites: '6+' },
      { name: 'Richmond', sites: '6+' },
      { name: 'Paducah', sites: '8+' },
      { name: 'Georgetown', sites: '6+' },
      { name: 'All Other KY Cities', sites: 'Statewide coverage' },
    ],
    faqExtra: 'Louisville is the home of UPS\'s Worldport, one of the largest air freight hubs in the world, and a major intermodal trucking hub. Kentucky\'s I-75 and I-64 corridors are critical freight routes.',
  },
  {
    slug: 'alabama',
    name: 'Alabama',
    abbr: 'AL',
    sites: '190+',
    cities: [
      { name: 'Birmingham', sites: '50+' },
      { name: 'Montgomery', sites: '28+' },
      { name: 'Huntsville', sites: '28+' },
      { name: 'Mobile', sites: '25+' },
      { name: 'Tuscaloosa', sites: '15+' },
      { name: 'Hoover', sites: '10+' },
      { name: 'Dothan', sites: '8+' },
      { name: 'Auburn', sites: '8+' },
      { name: 'Decatur', sites: '6+' },
      { name: 'Gadsden', sites: '6+' },
      { name: 'Florence', sites: '6+' },
      { name: 'All Other AL Cities', sites: 'Statewide coverage' },
    ],
    faqExtra: 'Alabama is a growing automotive manufacturing and logistics state. Huntsville and Birmingham are expanding freight hubs, and the Port of Mobile handles significant Gulf Coast cargo.',
  },
  {
    slug: 'south-carolina',
    name: 'South Carolina',
    abbr: 'SC',
    sites: '200+',
    cities: [
      { name: 'Columbia', sites: '45+' },
      { name: 'Charleston', sites: '45+' },
      { name: 'Greenville', sites: '35+' },
      { name: 'Spartanburg', sites: '20+' },
      { name: 'Myrtle Beach', sites: '15+' },
      { name: 'Rock Hill', sites: '12+' },
      { name: 'Florence', sites: '10+' },
      { name: 'North Charleston', sites: '15+' },
      { name: 'Sumter', sites: '8+' },
      { name: 'Hilton Head', sites: '6+' },
      { name: 'Conway', sites: '6+' },
      { name: 'All Other SC Cities', sites: 'Statewide coverage' },
    ],
    faqExtra: 'The Port of Charleston is one of the fastest-growing container ports on the East Coast. South Carolina\'s BMW plant and growing automotive supply chain create significant CDL and occupational health demand.',
  },
  {
    slug: 'nevada',
    name: 'Nevada',
    abbr: 'NV',
    sites: '160+',
    cities: [
      { name: 'Las Vegas', sites: '80+' },
      { name: 'Henderson', sites: '20+' },
      { name: 'Reno', sites: '30+' },
      { name: 'North Las Vegas', sites: '15+' },
      { name: 'Sparks', sites: '10+' },
      { name: 'Carson City', sites: '8+' },
      { name: 'Elko', sites: '5+' },
      { name: 'Fernley', sites: '4+' },
      { name: 'Mesquite', sites: '3+' },
      { name: 'Boulder City', sites: '3+' },
      { name: 'Laughlin', sites: '3+' },
      { name: 'All Other NV Cities', sites: 'Statewide coverage' },
    ],
    faqExtra: 'Nevada\'s Las Vegas metro is a major distribution hub for the Western US, with a dense concentration of warehousing, hospitality logistics, and construction employers requiring drug testing and occupational health services.',
  },
  {
    slug: 'oklahoma',
    name: 'Oklahoma',
    abbr: 'OK',
    sites: '170+',
    cities: [
      { name: 'Oklahoma City', sites: '60+' },
      { name: 'Tulsa', sites: '55+' },
      { name: 'Norman', sites: '15+' },
      { name: 'Broken Arrow', sites: '12+' },
      { name: 'Edmond', sites: '10+' },
      { name: 'Lawton', sites: '8+' },
      { name: 'Moore', sites: '6+' },
      { name: 'Midwest City', sites: '6+' },
      { name: 'Enid', sites: '6+' },
      { name: 'Stillwater', sites: '5+' },
      { name: 'Muskogee', sites: '4+' },
      { name: 'All Other OK Cities', sites: 'Statewide coverage' },
    ],
    faqExtra: 'Oklahoma is a major oil & gas and agricultural freight state. The I-40 and I-35 corridors through Oklahoma City and Tulsa are among the busiest freight routes in the south-central US.',
  },
  {
    slug: 'oregon',
    name: 'Oregon',
    abbr: 'OR',
    sites: '190+',
    cities: [
      { name: 'Portland', sites: '70+' },
      { name: 'Salem', sites: '20+' },
      { name: 'Eugene', sites: '20+' },
      { name: 'Gresham', sites: '12+' },
      { name: 'Hillsboro', sites: '12+' },
      { name: 'Beaverton', sites: '10+' },
      { name: 'Medford', sites: '10+' },
      { name: 'Bend', sites: '10+' },
      { name: 'Springfield', sites: '8+' },
      { name: 'Corvallis', sites: '6+' },
      { name: 'Albany', sites: '6+' },
      { name: 'All Other OR Cities', sites: 'Statewide coverage' },
    ],
    faqExtra: 'Oregon\'s Port of Portland and I-5 freight corridor connect Pacific Northwest trade with California and beyond. Oregon also has a large healthcare workforce requiring occupational health and titer testing.',
  },
  {
    slug: 'arkansas',
    name: 'Arkansas',
    abbr: 'AR',
    sites: '150+',
    cities: [
      { name: 'Little Rock', sites: '40+' },
      { name: 'Fort Smith', sites: '20+' },
      { name: 'Fayetteville', sites: '18+' },
      { name: 'Springdale', sites: '15+' },
      { name: 'Jonesboro', sites: '12+' },
      { name: 'North Little Rock', sites: '10+' },
      { name: 'Conway', sites: '8+' },
      { name: 'Rogers', sites: '8+' },
      { name: 'Pine Bluff', sites: '6+' },
      { name: 'Bentonville', sites: '8+' },
      { name: 'Hot Springs', sites: '5+' },
      { name: 'All Other AR Cities', sites: 'Statewide coverage' },
    ],
    faqExtra: 'Northwest Arkansas — home to Walmart headquarters and a dense supplier network — is one of the fastest-growing logistics markets in the US. The state is also a major trucking corridor between the Midwest and Gulf Coast.',
  },
  {
    slug: 'mississippi',
    name: 'Mississippi',
    abbr: 'MS',
    sites: '140+',
    cities: [
      { name: 'Jackson', sites: '35+' },
      { name: 'Gulfport', sites: '20+' },
      { name: 'Southaven', sites: '15+' },
      { name: 'Hattiesburg', sites: '12+' },
      { name: 'Biloxi', sites: '12+' },
      { name: 'Meridian', sites: '8+' },
      { name: 'Tupelo', sites: '8+' },
      { name: 'Olive Branch', sites: '8+' },
      { name: 'Horn Lake', sites: '6+' },
      { name: 'Greenville', sites: '5+' },
      { name: 'Columbus', sites: '5+' },
      { name: 'All Other MS Cities', sites: 'Statewide coverage' },
    ],
    faqExtra: 'Mississippi\'s Gulf Coast ports and I-55/I-20 freight corridors make it a key state for DOT compliance. The state\'s poultry and food processing industries also drive significant non-DOT drug testing demand.',
  },
  {
    slug: 'kansas',
    name: 'Kansas',
    abbr: 'KS',
    sites: '140+',
    cities: [
      { name: 'Wichita', sites: '45+' },
      { name: 'Overland Park', sites: '25+' },
      { name: 'Kansas City', sites: '20+' },
      { name: 'Topeka', sites: '18+' },
      { name: 'Olathe', sites: '12+' },
      { name: 'Lawrence', sites: '8+' },
      { name: 'Shawnee', sites: '8+' },
      { name: 'Manhattan', sites: '6+' },
      { name: 'Lenexa', sites: '6+' },
      { name: 'Salina', sites: '5+' },
      { name: 'Hutchinson', sites: '5+' },
      { name: 'All Other KS Cities', sites: 'Statewide coverage' },
    ],
    faqExtra: 'Kansas sits at the center of the US freight network at the I-70/I-35 crossroads. Wichita\'s aviation manufacturing sector and the state\'s agricultural logistics create strong DOT and occupational health demand.',
  },
  {
    slug: 'iowa',
    name: 'Iowa',
    abbr: 'IA',
    sites: '150+',
    cities: [
      { name: 'Des Moines', sites: '45+' },
      { name: 'Cedar Rapids', sites: '25+' },
      { name: 'Davenport', sites: '18+' },
      { name: 'Sioux City', sites: '15+' },
      { name: 'Iowa City', sites: '10+' },
      { name: 'Waterloo', sites: '10+' },
      { name: 'Ames', sites: '8+' },
      { name: 'Council Bluffs', sites: '8+' },
      { name: 'Dubuque', sites: '6+' },
      { name: 'Ankeny', sites: '6+' },
      { name: 'Urbandale', sites: '5+' },
      { name: 'All Other IA Cities', sites: 'Statewide coverage' },
    ],
    faqExtra: 'Iowa is one of the nation\'s top agricultural freight states. The I-80 corridor through Des Moines is one of the busiest truck routes in the country, and meatpacking employers drive significant non-DOT drug testing demand.',
  },
  {
    slug: 'utah',
    name: 'Utah',
    abbr: 'UT',
    sites: '150+',
    cities: [
      { name: 'Salt Lake City', sites: '55+' },
      { name: 'West Valley City', sites: '15+' },
      { name: 'Provo', sites: '15+' },
      { name: 'West Jordan', sites: '10+' },
      { name: 'Orem', sites: '10+' },
      { name: 'Sandy', sites: '8+' },
      { name: 'St. George', sites: '8+' },
      { name: 'Ogden', sites: '10+' },
      { name: 'Layton', sites: '8+' },
      { name: 'South Jordan', sites: '6+' },
      { name: 'Logan', sites: '5+' },
      { name: 'All Other UT Cities', sites: 'Statewide coverage' },
    ],
    faqExtra: 'Utah\'s I-15 and I-80 corridors make Salt Lake City a key Western US distribution hub. Utah also has a growing tech and healthcare workforce with occupational health screening needs.',
  },
  {
    slug: 'nebraska',
    name: 'Nebraska',
    abbr: 'NE',
    sites: '120+',
    cities: [
      { name: 'Omaha', sites: '50+' },
      { name: 'Lincoln', sites: '25+' },
      { name: 'Bellevue', sites: '8+' },
      { name: 'Grand Island', sites: '8+' },
      { name: 'Kearney', sites: '6+' },
      { name: 'Fremont', sites: '5+' },
      { name: 'Hastings', sites: '4+' },
      { name: 'Norfolk', sites: '4+' },
      { name: 'Columbus', sites: '4+' },
      { name: 'North Platte', sites: '4+' },
      { name: 'Papillion', sites: '4+' },
      { name: 'All Other NE Cities', sites: 'Statewide coverage' },
    ],
    faqExtra: 'Omaha is a major Midwest trucking and rail hub. Nebraska\'s I-80 corridor is one of the most heavily trafficked freight routes in the US, and the state\'s meatpacking industry drives strong occupational health demand.',
  },
  {
    slug: 'new-mexico',
    name: 'New Mexico',
    abbr: 'NM',
    sites: '100+',
    cities: [
      { name: 'Albuquerque', sites: '45+' },
      { name: 'Las Cruces', sites: '15+' },
      { name: 'Rio Rancho', sites: '10+' },
      { name: 'Santa Fe', sites: '10+' },
      { name: 'Roswell', sites: '6+' },
      { name: 'Farmington', sites: '5+' },
      { name: 'Clovis', sites: '4+' },
      { name: 'Hobbs', sites: '4+' },
      { name: 'Alamogordo', sites: '3+' },
      { name: 'Carlsbad', sites: '4+' },
      { name: 'Gallup', sites: '3+' },
      { name: 'All Other NM Cities', sites: 'Statewide coverage' },
    ],
    faqExtra: 'New Mexico sits on the I-25 and I-40 freight corridors connecting Texas, Arizona, and Colorado. The state\'s oil and gas sector in the Permian and San Juan basins creates strong PHMSA compliance demand.',
  },
  {
    slug: 'west-virginia',
    name: 'West Virginia',
    abbr: 'WV',
    sites: '100+',
    cities: [
      { name: 'Charleston', sites: '30+' },
      { name: 'Huntington', sites: '18+' },
      { name: 'Morgantown', sites: '12+' },
      { name: 'Parkersburg', sites: '10+' },
      { name: 'Wheeling', sites: '10+' },
      { name: 'Weirton', sites: '6+' },
      { name: 'Martinsburg', sites: '5+' },
      { name: 'Fairmont', sites: '4+' },
      { name: 'Beckley', sites: '4+' },
      { name: 'Clarksburg', sites: '4+' },
      { name: 'Bluefield', sites: '3+' },
      { name: 'All Other WV Cities', sites: 'Statewide coverage' },
    ],
    faqExtra: 'West Virginia\'s coal mining, chemical, and energy industries create significant PHMSA and occupational health testing demand. Healthcare workers in the state also require titer testing and TB screenings.',
  },
  {
    slug: 'idaho',
    name: 'Idaho',
    abbr: 'ID',
    sites: '90+',
    cities: [
      { name: 'Boise', sites: '40+' },
      { name: 'Nampa', sites: '12+' },
      { name: 'Meridian', sites: '10+' },
      { name: 'Idaho Falls', sites: '8+' },
      { name: 'Pocatello', sites: '6+' },
      { name: 'Caldwell', sites: '5+' },
      { name: 'Twin Falls', sites: '5+' },
      { name: 'Lewiston', sites: '4+' },
      { name: 'Coeur d\'Alene', sites: '5+' },
      { name: 'Post Falls', sites: '4+' },
      { name: 'Rexburg', sites: '3+' },
      { name: 'All Other ID Cities', sites: 'Statewide coverage' },
    ],
    faqExtra: 'Idaho is a major agricultural and food processing freight state. The I-84 corridor through Boise connects Pacific Northwest trade with the Intermountain West and is a key route for CDL-regulated carriers.',
  },
  {
    slug: 'connecticut',
    name: 'Connecticut',
    abbr: 'CT',
    sites: '120+',
    cities: [
      { name: 'Bridgeport', sites: '20+' },
      { name: 'New Haven', sites: '20+' },
      { name: 'Hartford', sites: '25+' },
      { name: 'Stamford', sites: '15+' },
      { name: 'Waterbury', sites: '10+' },
      { name: 'Norwalk', sites: '8+' },
      { name: 'Danbury', sites: '6+' },
      { name: 'New Britain', sites: '5+' },
      { name: 'Greenwich', sites: '5+' },
      { name: 'Meriden', sites: '4+' },
      { name: 'Bristol', sites: '4+' },
      { name: 'All Other CT Cities', sites: 'Statewide coverage' },
    ],
    faqExtra: 'Connecticut\'s dense healthcare workforce — anchored by Yale New Haven Health and Hartford HealthCare — creates strong demand for titer tests, TB screenings, and pre-employment physicals alongside DOT compliance.',
  },
  {
    slug: 'new-jersey',
    name: 'New Jersey',
    abbr: 'NJ',
    sites: '220+',
    cities: [
      { name: 'Newark', sites: '35+' },
      { name: 'Jersey City', sites: '20+' },
      { name: 'Paterson', sites: '15+' },
      { name: 'Elizabeth', sites: '15+' },
      { name: 'Trenton', sites: '12+' },
      { name: 'Camden', sites: '8+' },
      { name: 'Clifton', sites: '8+' },
      { name: 'Hackensack', sites: '10+' },
      { name: 'Cherry Hill', sites: '8+' },
      { name: 'Edison', sites: '10+' },
      { name: 'Toms River', sites: '8+' },
      { name: 'All Other NJ Cities', sites: 'Statewide coverage' },
    ],
    faqExtra: 'New Jersey is home to Doctors Place\'s main office in Hackensack. The Port Newark-Elizabeth complex is the largest port on the East Coast, making NJ one of the highest-demand CDL compliance markets in the US.',
  },
  {
    slug: 'hawaii',
    name: 'Hawaii',
    abbr: 'HI',
    sites: '50+',
    cities: [
      { name: 'Honolulu', sites: '30+' },
      { name: 'Pearl City', sites: '5+' },
      { name: 'Hilo', sites: '5+' },
      { name: 'Kailua', sites: '3+' },
      { name: 'Kaneohe', sites: '3+' },
      { name: 'Waipahu', sites: '3+' },
      { name: 'All Other HI Cities', sites: 'Statewide coverage' },
    ],
    faqExtra: 'Hawaii\'s DOT and occupational health needs are served through our Oahu network. The state\'s large healthcare and hospitality workforce creates consistent demand for titer tests, TB tests, and pre-employment physicals.',
  },
  {
    slug: 'new-hampshire',
    name: 'New Hampshire',
    abbr: 'NH',
    sites: '70+',
    cities: [
      { name: 'Manchester', sites: '22+' },
      { name: 'Nashua', sites: '18+' },
      { name: 'Concord', sites: '10+' },
      { name: 'Derry', sites: '5+' },
      { name: 'Dover', sites: '5+' },
      { name: 'Rochester', sites: '4+' },
      { name: 'All Other NH Cities', sites: 'Statewide coverage' },
    ],
    faqExtra: 'New Hampshire\'s proximity to the Boston metro and I-93/I-89 freight corridors connects it to New England\'s logistics network. The state\'s healthcare and construction sectors also require occupational health services.',
  },
  {
    slug: 'maine',
    name: 'Maine',
    abbr: 'ME',
    sites: '65+',
    cities: [
      { name: 'Portland', sites: '22+' },
      { name: 'Lewiston', sites: '10+' },
      { name: 'Bangor', sites: '10+' },
      { name: 'South Portland', sites: '6+' },
      { name: 'Auburn', sites: '5+' },
      { name: 'Augusta', sites: '5+' },
      { name: 'All Other ME Cities', sites: 'Statewide coverage' },
    ],
    faqExtra: 'Maine\'s paper, timber, and maritime industries create steady DOT and occupational health demand. The Port of Portland and I-95 corridor connect the state to broader Northeast freight networks.',
  },
  {
    slug: 'montana',
    name: 'Montana',
    abbr: 'MT',
    sites: '65+',
    cities: [
      { name: 'Billings', sites: '20+' },
      { name: 'Missoula', sites: '12+' },
      { name: 'Great Falls', sites: '8+' },
      { name: 'Bozeman', sites: '8+' },
      { name: 'Butte', sites: '5+' },
      { name: 'Helena', sites: '6+' },
      { name: 'All Other MT Cities', sites: 'Statewide coverage' },
    ],
    faqExtra: 'Montana\'s agriculture, mining, and energy sectors create consistent DOT and PHMSA compliance demand. I-90 and I-15 are key freight corridors connecting Montana to the Pacific Northwest and Midwest.',
  },
  {
    slug: 'rhode-island',
    name: 'Rhode Island',
    abbr: 'RI',
    sites: '50+',
    cities: [
      { name: 'Providence', sites: '25+' },
      { name: 'Cranston', sites: '8+' },
      { name: 'Warwick', sites: '8+' },
      { name: 'Pawtucket', sites: '5+' },
      { name: 'East Providence', sites: '4+' },
      { name: 'All Other RI Cities', sites: 'Statewide coverage' },
    ],
    faqExtra: 'Rhode Island\'s dense healthcare and manufacturing workforce — along with its position on the I-95 Northeast freight corridor — drives demand for occupational health services including titer tests and pre-employment physicals.',
  },
  {
    slug: 'delaware',
    name: 'Delaware',
    abbr: 'DE',
    sites: '55+',
    cities: [
      { name: 'Wilmington', sites: '25+' },
      { name: 'Dover', sites: '12+' },
      { name: 'Newark', sites: '8+' },
      { name: 'Middletown', sites: '5+' },
      { name: 'Smyrna', sites: '3+' },
      { name: 'All Other DE Cities', sites: 'Statewide coverage' },
    ],
    faqExtra: 'Delaware sits on one of the busiest freight corridors in the US — the I-95 Northeast megaregion. Its pharmaceutical and chemical industries also create strong occupational health testing demand.',
  },
  {
    slug: 'south-dakota',
    name: 'South Dakota',
    abbr: 'SD',
    sites: '60+',
    cities: [
      { name: 'Sioux Falls', sites: '25+' },
      { name: 'Rapid City', sites: '12+' },
      { name: 'Aberdeen', sites: '5+' },
      { name: 'Brookings', sites: '4+' },
      { name: 'Watertown', sites: '4+' },
      { name: 'Mitchell', sites: '3+' },
      { name: 'All Other SD Cities', sites: 'Statewide coverage' },
    ],
    faqExtra: 'South Dakota\'s agricultural freight, meatpacking, and I-90 corridor create steady DOT and non-DOT drug testing demand. Sioux Falls is a growing logistics and healthcare hub for the northern Plains.',
  },
  {
    slug: 'north-dakota',
    name: 'North Dakota',
    abbr: 'ND',
    sites: '55+',
    cities: [
      { name: 'Fargo', sites: '20+' },
      { name: 'Bismarck', sites: '12+' },
      { name: 'Grand Forks', sites: '8+' },
      { name: 'Minot', sites: '6+' },
      { name: 'West Fargo', sites: '5+' },
      { name: 'Williston', sites: '4+' },
      { name: 'All Other ND Cities', sites: 'Statewide coverage' },
    ],
    faqExtra: 'North Dakota\'s Bakken oil fields create significant PHMSA and pipeline compliance demand. The state\'s agricultural and energy sectors are among the highest per-capita CDL employer markets in the US.',
  },
  {
    slug: 'alaska',
    name: 'Alaska',
    abbr: 'AK',
    sites: '35+',
    cities: [
      { name: 'Anchorage', sites: '20+' },
      { name: 'Fairbanks', sites: '6+' },
      { name: 'Juneau', sites: '4+' },
      { name: 'Sitka', sites: '2+' },
      { name: 'Ketchikan', sites: '2+' },
      { name: 'All Other AK Cities', sites: 'Statewide coverage' },
    ],
    faqExtra: 'Alaska\'s oil and gas, mining, and construction industries require DOT and PHMSA compliance. Ted Stevens Anchorage International Airport is a major air cargo hub, and the state\'s healthcare workforce also needs occupational health services.',
  },
  {
    slug: 'wyoming',
    name: 'Wyoming',
    abbr: 'WY',
    sites: '50+',
    cities: [
      { name: 'Cheyenne', sites: '15+' },
      { name: 'Casper', sites: '12+' },
      { name: 'Laramie', sites: '5+' },
      { name: 'Gillette', sites: '5+' },
      { name: 'Rock Springs', sites: '4+' },
      { name: 'Sheridan', sites: '4+' },
      { name: 'All Other WY Cities', sites: 'Statewide coverage' },
    ],
    faqExtra: 'Wyoming\'s coal mining, natural gas, and freight corridor industries create strong PHMSA and DOT compliance demand. I-80 through Wyoming is one of the most critical cross-country freight routes in the US.',
  },
  {
    slug: 'vermont',
    name: 'Vermont',
    abbr: 'VT',
    sites: '40+',
    cities: [
      { name: 'Burlington', sites: '15+' },
      { name: 'South Burlington', sites: '5+' },
      { name: 'Rutland', sites: '5+' },
      { name: 'Barre', sites: '4+' },
      { name: 'Montpelier', sites: '4+' },
      { name: 'All Other VT Cities', sites: 'Statewide coverage' },
    ],
    faqExtra: 'Vermont\'s dairy, agriculture, and healthcare industries create steady occupational health demand including titer tests, TB tests, and pre-employment physicals. The state is served through our New England collection network.',
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
<title>DOT Physicals, Drug Testing & Occupational Health in ${state.name} | Doctors Place</title>
<meta name="description" content="Order DOT physicals, drug tests, titer tests, TB tests, and more anywhere in ${state.name}. ${state.sites} collection sites statewide. Serving CDL drivers, healthcare workers, and all employers. Results in 24–48 hours.">
<meta name="keywords" content="DOT physical ${state.name}, DOT drug test ${state.name}, CDL physical ${state.abbr}, occupational health ${state.name}, MMR titer test ${state.name}, TB test ${state.name}, non-DOT drug screen ${state.name}, pre-employment physical ${state.name}, FMCSA physical ${state.name}">
<meta name="robots" content="index, follow">
<link rel="canonical" href="https://www.dot-physical.net/dot-physical-${state.slug}.html">
<meta property="og:type" content="website">
<meta property="og:url" content="https://www.dot-physical.net/dot-physical-${state.slug}.html">
<meta property="og:title" content="DOT Physicals, Drug Testing & Occupational Health in ${state.name} | Doctors Place">
<meta property="og:description" content="Order DOT physicals, drug tests, titer tests, TB tests, and more anywhere in ${state.name}. ${state.sites} collection sites statewide. Results in 24–48 hours.">
<meta property="og:site_name" content="Doctors Place">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="DOT Physicals, Drug Testing & Occupational Health in ${state.name} | Doctors Place">
<meta name="twitter:description" content="DOT physicals, drug testing, titer tests & occupational health at ${state.sites} ${state.name} collection sites. Order online.">
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
      ${state.name} &middot; Occupational Health &middot; ${state.sites} Sites
    </div>
    <h1>Drug Testing &amp; Occupational Health<br>in <em>${state.name}</em> &mdash; Order Online</h1>
    <p class="hero-sub">DOT physicals, drug testing, titer tests, TB tests, respirator fit testing, and more — available at ${state.sites} collection sites across ${state.name}. Order online in minutes.</p>
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
        DOT &amp; non-DOT services
      </div>
      <div style="display:flex;align-items:center;gap:8px;font-size:0.85rem;color:var(--muted);">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--teal)" stroke-width="2"><path d="M5 13l4 4L19 7"/></svg>
        Results in 24&ndash;48 hours
      </div>
    </div>
  </div>
</div>

<div class="trust-bar">
  <div class="trust-item"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg><span><strong>${state.sites} Sites</strong> Across ${state.name}</span></div>
  <div class="trust-item"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/></svg><span><strong>DOT &amp; Non-DOT</strong> Services Available</span></div>
  <div class="trust-item"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg><span>Results in <strong>24&ndash;48 Hours</strong></span></div>
  <div class="trust-item"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 000 4h6a2 2 0 000-4M9 5a2 2 0 012-2h2a2 2 0 012 2"/></svg><span><strong>Titer Tests</strong> &amp; Occupational Health</span></div>
</div>

<section id="services" style="background:var(--bg-white);">
  <div class="section-label">Services in ${state.name}</div>
  <h2 class="section-title">Occupational health services for<br>${state.name} employers &amp; individuals</h2>
  <p class="section-sub">We're not just DOT. From CDL exams and drug screens to titer tests, TB testing, and fit testing — all available at ${state.sites} ${state.name} collection sites.</p>
  <div class="services-grid">
    <div class="service-card">
      <div class="service-icon icon-blue">🚛</div>
      <h3>DOT Physical Exam &mdash; ${state.name}</h3>
      <p>FMCSA-certified medical exams for CDL holders anywhere in ${state.name}. Same-day medical certificate.</p>
      <div class="service-price"><span class="price-tag">$110</span><a href="book.html" class="price-book">Order Now &rarr;</a></div>
    </div>
    <div class="service-card">
      <div class="service-icon icon-teal">🔬</div>
      <h3>DOT &amp; Non-DOT Drug Screens &mdash; ${state.abbr}</h3>
      <p>5-panel DOT urine test (49 CFR Part 40) or company-policy non-DOT panels. MRO-reviewed. Results in 24 hours.</p>
      <div class="service-price"><span class="price-tag">From $55</span><a href="book.html" class="price-book">Order Now &rarr;</a></div>
    </div>
    <div class="service-card">
      <div class="service-icon icon-indigo">🧫</div>
      <h3>Titer Tests &mdash; ${state.name}</h3>
      <p>MMR, Varicella, and Hepatitis B immunity blood tests for healthcare workers, schools, and employers across ${state.name}.</p>
      <div class="service-price"><span class="price-tag">$75</span><a href="titers.html" class="price-book">Learn More &rarr;</a></div>
    </div>
    <div class="service-card">
      <div class="service-icon icon-blue">💉</div>
      <h3>TB / PPD Skin Test &mdash; ${state.abbr}</h3>
      <p>TB skin test placement and 48–72 hour reading for pre-employment and annual occupational health requirements in ${state.name}.</p>
      <div class="service-price"><span class="price-tag">$65</span><a href="book.html" class="price-book">Order Now &rarr;</a></div>
    </div>
    <div class="service-card">
      <div class="service-icon icon-teal">😷</div>
      <h3>Respirator Fit Testing &mdash; ${state.abbr}</h3>
      <p>OSHA-compliant qualitative and quantitative fit testing for healthcare workers, first responders, and industrial employees in ${state.name}.</p>
      <div class="service-price"><span class="price-tag">$60</span><a href="book.html" class="price-book">Order Now &rarr;</a></div>
    </div>
    <div class="service-card">
      <div class="service-icon icon-indigo">🏥</div>
      <h3>Pre-Employment Physical &mdash; ${state.abbr}</h3>
      <p>Comprehensive pre-hire health screening for CDL and non-CDL positions in ${state.name}. Same-day clearance letters available.</p>
      <div class="service-price"><span class="price-tag">$110</span><a href="pre-employment.html" class="price-book">Learn More &rarr;</a></div>
    </div>
  </div>
  <div style="text-align:center;margin-top:2rem;">
    <a href="services.html" style="color:var(--accent);font-weight:600;font-size:0.9rem;text-decoration:none;">View all services — return-to-duty, breath alcohol, workers&apos; comp &amp; more &rarr;</a>
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
    <div class="faq-item">
      <div class="faq-q">Do you offer non-DOT services like titer tests and TB tests in ${state.name}?</div>
      <div class="faq-a">Yes — we are not DOT-only. We offer a full occupational health menu including MMR, Varicella, and Hepatitis B titer tests ($75 each), TB/PPD skin test placement and reading ($65), respirator fit testing ($60), non-DOT drug screens, and pre-employment physicals for non-CDL roles. All orderable online and available at ${state.sites} ${state.name} collection sites.</div>
    </div>
  </div>
</section>

<div class="cta-banner">
  <div>
    <h2>Ready to order in ${state.name}? DOT, non-DOT, titer tests &amp; more.</h2>
    <p>${state.sites} ${state.name} sites. Any service. Any city. Order in minutes.</p>
  </div>
  <div class="cta-actions">
    <a href="book.html" class="btn-white">Order Now &mdash; Any ${state.abbr} City</a>
    <a href="tel:8882334567" class="btn-outline-white">Call 888-233-4567</a>
  </div>
</div>

<footer>
  <div class="footer-brand">
    <a href="index.html" class="nav-logo" style="color:#fff;"><span class="logo-dot"></span>Doctors Place</a>
    <p>A Doctors Place company. Providing fast, reliable, FMCSA-compliant DOT physicals and drug testing services nationwide &mdash; including all of ${state.name}.</p>
    <div class="footer-contact">
      <a href="tel:8882334567">📞 888-233-4567</a>
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
