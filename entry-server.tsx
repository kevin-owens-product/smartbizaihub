import { StrictMode } from 'react';
import { renderToString } from 'react-dom/server';
import App from './App.tsx';
import { FAQS, SITE_URL } from './content.ts';

// Build-time render: scripts/prerender.mjs writes this markup into
// dist/index.html so search crawlers, answer engines and agents that do not
// run JavaScript see the whole page. main.tsx hydrates it in the browser.
export function render() {
  return renderToString(
    <StrictMode>
      <App />
    </StrictMode>,
  );
}

const ORG_ID = `${SITE_URL}#organization`;
const PERSON_ID = 'https://kevinowens.com/#person';

export const jsonLd = [
  {
    '@context': 'https://schema.org',
    '@type': 'ProfessionalService',
    '@id': ORG_ID,
    name: 'Smart Biz AI Hub',
    url: SITE_URL,
    logo: `${SITE_URL}favicon.svg`,
    image: `${SITE_URL}og-image.png`,
    description:
      'AI pilots scoped for businesses with 5 to 50 people: one job automated inside the tools you already use, measured at 30, 60 and 90 days.',
    founder: { '@id': PERSON_ID },
    areaServed: 'US',
    audience: { '@type': 'BusinessAudience', audienceType: 'Small businesses with 5 to 50 people' },
    knowsAbout: ['AI pilots for small business', 'Workflow automation', 'Missed-call handling', 'Quoting and follow-up automation', 'Scheduling automation'],
    makesOffer: [
      { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Free 30-minute scoping call' } },
      { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Fixed-scope AI pilot measured at 30, 60 and 90 days' } },
    ],
    contactPoint: [
      { '@type': 'ContactPoint', contactType: 'Scoping call request', url: `${SITE_URL}#contact` },
      { '@type': 'ContactPoint', contactType: 'Book a scoping call', url: 'https://calendar.app.google/U4e4ETunoZaib7im8' },
    ],
    sameAs: ['https://kevinowens.com', 'https://www.linkedin.com/in/kevinaowens'],
  },
  {
    '@context': 'https://schema.org',
    '@type': 'Person',
    '@id': PERSON_ID,
    name: 'Kevin Owens',
    url: 'https://kevinowens.com/',
    jobTitle: 'Founder, Smart Biz AI Hub',
    description: 'Four-time Chief Product Officer based in Los Angeles.',
    image: `${SITE_URL}kevin-owens.jpg`,
    sameAs: ['https://kevinowens.com', 'https://productexec.co', 'https://enterpriseaistudio.com', 'https://www.linkedin.com/in/kevinaowens'],
  },
  {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Smart Biz AI Hub',
    url: SITE_URL,
    publisher: { '@id': ORG_ID },
  },
  {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: FAQS.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
  },
];
