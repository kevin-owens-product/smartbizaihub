// Single source for the FAQ: the visible section in App.tsx and the FAQPage
// JSON-LD written into the prerendered HTML both read this, so the schema
// always matches the page.
export const FAQS = [
  {
    q: 'What is an AI pilot for a small business?',
    a: 'A 90-day trial on one job that eats your week, automated inside the tools you already use. A single number is agreed before work starts (hours saved, jobs quoted, calls answered) and checked at 30, 60 and 90 days.',
  },
  {
    q: 'Who is it for?',
    a: 'Businesses with 5 to 50 people, most often trades and field work, and small professional firms. Typical starting points are missed calls and inquiries, quotes and follow-ups, scheduling, invoices and receipts, and the same emails answered every week.',
  },
  {
    q: 'Do I need to buy new software?',
    a: 'No. Pilots are built into the email, calendar and accounting software you already run. Nothing here asks you to migrate your business.',
  },
  {
    q: 'Do I need to be technical?',
    a: 'No. Kevin does the building, inside the email, calendar and accounting software you already run. Your part is a 30-minute call to describe the job, agreeing the one number that will show whether it worked, approving anything before it goes to a customer, and the check-ins at day 30, 60 and 90.',
  },
  {
    q: 'What does the first call cost?',
    a: 'Nothing. It is a free 30-minute phone call. You describe the work that eats your week and leave knowing whether AI helps there and what it would take. If you go ahead, the pilot is a fixed price agreed up front.',
  },
  {
    q: 'What happens if the pilot does not work?',
    a: 'If it has not earned its keep by day 90, we stop and say so. You get a straight answer and you are not signed up to anything further.',
  },
  {
    q: 'Who does the work?',
    a: 'Kevin Owens, a four-time Chief Product Officer who builds AI products for larger companies. The person who scopes the pilot is the person who builds it and tells you whether it worked.',
  },
] as const;

export const SITE_URL = 'https://smartbizaihub.com/';
