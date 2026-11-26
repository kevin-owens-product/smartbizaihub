import { useEffect, useState } from 'react';

const CHECKLIST_KEY = 'sbh_checklist';

const guide = {
  path: '/guides/ai-pilot-readiness-checklist',
  title: 'AI pilot readiness checklist',
  description: 'Check whether your team, data and workflow are ready for a first AI pilot. Score the five areas and see what to do next.',
};

const pilots = [
  {
    path: '/pilots/reporting-automation',
    title: 'Reporting automation pilot',
    description: 'Build one recurring report from the tools your team already uses and measure the time it takes to prepare and check it.',
    example: 'If your Friday sales report starts with three spreadsheet exports, pick one number everyone has to reconcile. Save a copy of the last four reports and the source totals that went into them.',
    steps: ['Agree on the source of record for each number and who signs off.', 'Build the report from those sources on a fixed schedule. Flag missing inputs before drafting the commentary.', 'Have the owner compare totals with the source and release the report. Record corrections.'],
    measure: 'Track minutes from the last available input to the approved report. Count corrections alongside time saved so a faster but less reliable report is easy to spot.',
    fit: ["You rebuild the same report every week or month from two or more exports.", "The numbers are argued about because each person pulls them slightly differently.", "One person loses most of a morning to it, and the report is late when they are away."],
    notFit: "If the report changes shape every time, or nobody reads it, fix that first. Automating a report nobody uses only makes it arrive faster.",
    inScope: ["One recurring report, with the sources it already uses", "A check that flags missing or late inputs before anything is drafted", "A short draft commentary the owner edits, never publishes unseen"],
    outScope: ["Replacing your accounting or sales software", "New dashboards or a data warehouse", "Reports that go to customers or regulators without sign-off"],
    days: [["Day 30", "The report builds itself from the agreed sources. The owner checks every number against the old method."], ["Day 60", "The owner checks totals and exceptions only. Corrections are logged so the error rate is visible."], ["Day 90", "Compare preparation time and corrections with the baseline, and decide whether to keep it, extend it to a second report, or stop."]] as [string, string][],
    risks: "The usual problem is a source that changes without warning: a renamed column, a new product line, a late export. The pilot flags a missing or unexpected input rather than guessing, and the report waits for the owner instead of going out wrong.",
    faqs: [["Do we need a new reporting tool?", "No. The report lands where it lands today: a spreadsheet, a shared document or an email."], ["Who checks the numbers?", "The person who signs the report off today. The pilot gives them less to assemble, not less responsibility."]] as [string, string][],
  },
  {
    path: '/pilots/follow-up-automation',
    title: 'Customer follow-up automation pilot',
    description: 'Use your existing inbox or CRM to queue follow-ups after a quote or customer conversation.',
    example: 'Start with quotes that have had no reply for seven days. Review a week of sent quotes and count how many reached the promised follow-up date without anyone getting in touch.',
    steps: ['Agree what starts the clock, what counts as a reply, and which customers must be excluded.', 'Draft a follow-up from the quote, assign it to the account owner, and put it in their review queue.', 'Have the owner check and send the message. Stop reminders when a customer replies, opts out, or the quote closes.'],
    measure: 'Track the share of eligible quotes followed up on time. Check a small sample for duplicate or unwanted reminders.',
    fit: ["You send quotes and lose track of which ones have gone quiet.", "Follow-ups depend on someone remembering, so they happen in busy weeks only.", "Your quotes live in an inbox, a CRM or an invoicing tool you can export from."],
    notFit: "If most quotes are won or lost on the first call, a follow-up pilot will not move much. Start with whatever happens before the quote instead.",
    inScope: ["Spotting quotes with no reply after the number of days you choose", "Drafting a short follow-up in your words, from the quote itself", "Putting each draft in the account owner's queue to check and send"],
    outScope: ["Messages that send without a person approving them", "Marketing campaigns or newsletters", "Chasing payment on invoices (a different pilot with different rules)"],
    days: [["Day 30", "Drafts appear for every quiet quote. The owner sends, edits or skips each one, and every choice is recorded."], ["Day 60", "Drafts that were sent unchanged show which wording works. Exclusions are tightened where a reminder would have been unwelcome."], ["Day 90", "Compare on-time follow-ups and won quotes with the baseline, and decide whether to keep it, widen it, or stop."]] as [string, string][],
    risks: "The risk is a reminder to someone who has already said yes, said no or asked to be left alone. Replies, opt-outs and closed quotes stop the clock, and a person approves every message, so nothing reaches a customer that the owner has not seen.",
    faqs: [["Will customers know it was drafted by AI?", "They receive a message from the account owner, checked and sent by them, in the tone they already use."], ["What if a customer replies to the follow-up?", "The reply goes to the owner's inbox as it does today, and that quote drops out of the queue."]] as [string, string][],
  },
  {
    path: '/pilots/document-intelligence',
    title: 'Document intelligence pilot',
    description: 'Pilot intake and extraction on one recurring document type, with a person reviewing exceptions before records are updated.',
    example: 'Pick one invoice format and gather examples the team is authorized to use. Include a credit note, a missing purchase order and a duplicate so the trial covers the awkward cases.',
    steps: ['Name the fields your accounting team needs and label the expected answers on a sample.', 'Extract those fields into a draft record and check totals and purchase-order references.', 'Queue mismatches for review. Let the owner approve a record before posting it to the accounting system.'],
    measure: 'Compare review minutes per invoice and errors per field against manual processing. Count exceptions separately so an easy batch cannot hide the troublesome cases.',
    fit: ["The same kind of document arrives every week: supplier invoices, receipts, intake forms, delivery notes.", "Someone retypes fields from it into another system.", "Mistakes are found late, when a total does not match or a payment goes to the wrong place."],
    notFit: "If documents arrive in dozens of formats with no common fields, start with the most frequent one, or with tidying how they arrive.",
    inScope: ["One document type and the fields your team actually uses", "Checks on totals, dates and references before anything is saved", "A review queue for anything that does not match, approved by a person"],
    outScope: ["Posting records without review during the pilot", "Every document type at once", "Legal or regulated judgments, which stay with a qualified person"],
    days: [["Day 30", "Fields are extracted into draft records. The reviewer checks every record and corrects the misses, which become the test set."], ["Day 60", "Clean records go through with a light check. Mismatches and unusual documents go to the review queue."], ["Day 90", "Compare review minutes and field errors with manual entry, and decide whether to keep it, add a second document type, or stop."]] as [string, string][],
    risks: "The risk is a confident wrong answer: a misread total or a duplicate that slips through. Every record is checked against totals and references, exceptions are counted on their own, and nothing is posted to your accounting system until a person approves it.",
    faqs: [["What happens to the documents?", "They stay where they are today. The pilot reads only the document type you agree on, and only the people you name can see the results."], ["How many examples do we need?", "A few dozen real examples, including the awkward ones, is enough to start and to measure against."]] as [string, string][],
  },
];

const hub = {
  path: '/resources',
  title: 'Small business AI pilot resources',
  description: 'Use the readiness checklist to pick a first workflow, then scope a reporting, customer follow-up or document pilot.',
};
const privacy = {
  path: '/privacy',
  title: 'Privacy notice',
  description: 'What smartbizaihub.com collects when you ask for a call, why, and how to have it deleted. No analytics, no list, nothing sold or shared.',
};
export const resourcePages = [hub, guide, ...pilots, privacy];

export const BOOK_HREF = '/?book=1#contact';

interface ChecklistSection {
  id: string;
  title: string;
  intro: string;
  items: string[];
}

const SECTIONS: ChecklistSection[] = [
  {
    id: "team",
    title: "Team capability",
    intro: "A pilot needs an owner and a few willing users — not an AI team.",
    items: [
      "One person is willing to own the pilot end-to-end",
      "The people who run the workflow today can spend 1-2 hours/week testing",
      "Leadership has set aside time for the pilot and its 30-, 60- and 90-day reviews",
      "Someone can approve access to the tools the workflow touches",
    ],
  },
  {
    id: "data",
    title: "Data availability",
    intro: "AI pilots run on your real inputs — check you can actually get to them.",
    items: [
      "The workflow's inputs (emails, documents, tickets, records) are digital",
      "You can export or grant access to a representative sample",
      "You know where sensitive data lives and what must stay private",
      "Historical examples exist to validate against (even a few dozen)",
    ],
  },
  {
    id: "process",
    title: "Process documentation",
    intro: "The pilot automates a workflow — the workflow has to be describable.",
    items: [
      "You can describe the workflow's steps from trigger to done",
      "The main exception cases are known (even if undocumented)",
      "You know who touches the workflow and in what order",
      "The current pain is specific: hours spent, delays, or error rates",
    ],
  },
  {
    id: "metrics",
    title: "Success metrics",
    intro: "Measured at 30/60/90 days — decide what 'better' means before building.",
    items: [
      "You can name the one number the pilot should move",
      "A baseline for that number exists or can be captured pre-pilot",
      "You've agreed what result would justify scaling — and what would stop it",
    ],
  },
  {
    id: "change",
    title: "Change management readiness",
    intro: "Pilots fail on adoption more often than on technology.",
    items: [
      "The team affected knows a pilot is coming and why",
      "Someone will handle questions and feedback during the pilot",
      "There's appetite to change the process if the pilot works",
    ],
  },
];

const TOTAL = SECTIONS.reduce((n, s) => n + s.items.length, 0);

function guidance(checked: number): { label: string; copy: string } {
  const ratio = checked / TOTAL;
  if (ratio >= 0.8) {
    return {
      label: "Ready to scope a pilot",
      copy: "You have the ownership, data access, and measurement basics in place. The next step is picking the highest-pain workflow and scoping a contained pilot.",
    };
  }
  if (ratio >= 0.5) {
    return {
      label: "Close — a few gaps to plan around",
      copy: "Most foundations are in place. Bring the unchecked items to the first conversation — they usually shape the pilot's scope rather than block it.",
    };
  }
  return {
    label: "Start with a readiness audit",
    copy: "Several foundations are missing. That's normal — a readiness audit maps the gaps and leaves you with a prioritized pilot backlog instead of a stalled build.",
  };
}

function Checklist() {
  const [checked, setChecked] = useState<string[]>([]);
  const [restored, setRestored] = useState(false);
  // Restore after mount so the prerendered HTML and the first render agree.
  useEffect(() => {
    try {
      const saved = JSON.parse(window.localStorage.getItem(CHECKLIST_KEY) || '[]');
      if (Array.isArray(saved)) setChecked(saved.filter((v): v is string => typeof v === 'string'));
    } catch { /* storage blocked: start empty */ }
    setRestored(true);
  }, []);
  useEffect(() => {
    if (!restored) return;
    try { window.localStorage.setItem(CHECKLIST_KEY, JSON.stringify(checked)); } catch { /* ignore */ }
  }, [checked, restored]);
  const result = guidance(checked.length);
  return <>
    {SECTIONS.map(section => <fieldset className="mt-8" key={section.id}>
      <legend className="font-display text-2xl font-semibold">{section.title}</legend>
      <p className="my-3 text-muted">{section.intro}</p>
      {section.items.map(item => <label key={item} className="flex items-start gap-3 py-2">
        <input type="checkbox" className="mt-1 h-5 w-5 shrink-0" checked={checked.includes(item)}
          onChange={event => {
            const selected = event.currentTarget.checked;
            setChecked(previous => selected ? [...previous, item] : previous.filter(value => value !== item));
          }} />
        {item}
      </label>)}
    </fieldset>)}
    <div className="card mt-8 p-6" aria-live="polite">
      <p>{checked.length} of {TOTAL} items checked</p>
      <h2 className="my-2 text-xl font-semibold">{result.label}</h2>
      <p>{result.copy}</p>
      <a className="btn-primary mt-5 inline-flex px-5 py-2.5" href={BOOK_HREF}>Talk it through on a free 30-minute call</a>
      <p className="mt-3 text-sm text-muted">Your ticks are saved in this browser only, so you can come back to them.</p>
    </div>
    <button className="mt-4 underline" type="button" onClick={() => setChecked([])}>Reset checklist</button>
  </>;
}

export function ResourcePage({ path }: { path: string }) {
  const page = resourcePages.find(item => item.path === path);
  if (!page) return null;
  const pilot = pilots.find(item => item.path === path);
  return <div className="min-h-screen bg-paper text-ink">
    <header className="border-b border-line bg-white"><nav aria-label="Main" className="mx-auto flex max-w-4xl gap-6 px-6 py-5">
      <a className="font-display font-bold" href="/">Smart Biz AI Hub</a>
      <a className="underline" href="/resources">Resources</a>
    </nav></header>
    <main className="mx-auto max-w-3xl px-6 py-12">
      <h1 className="section-title">{page.title}</h1>
      <p className="mt-4 text-lg leading-relaxed text-muted">{page.description}</p>
      {page === hub && <ul className="mt-8 space-y-4">{[guide, ...pilots].map(item =>
        <li key={item.path} className="card p-6">
          <a className="text-xl font-semibold underline" href={item.path}>{item.title}</a>
          <p className="mt-2 text-muted">{item.description}</p>
        </li>)}</ul>}
      {page === guide && <Checklist />}
      {pilot && <>
        <h2 className="mb-3 mt-8 text-2xl font-semibold">Is this the right first pilot?</h2>
        <ul className="list-disc space-y-2 pl-6">{pilot.fit.map(item => <li key={item}>{item}</li>)}</ul>
        <p className="mt-3 text-muted">{pilot.notFit}</p>
        <h2 className="mb-3 mt-8 text-2xl font-semibold">Where to start</h2><p>{pilot.example}</p>
        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          <div className="card p-5"><h3 className="font-semibold">In scope</h3>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-[15px]">{pilot.inScope.map(item => <li key={item}>{item}</li>)}</ul></div>
          <div className="card p-5"><h3 className="font-semibold">Not in this pilot</h3>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-[15px]">{pilot.outScope.map(item => <li key={item}>{item}</li>)}</ul></div>
        </div>
        <h2 className="mb-3 mt-8 text-2xl font-semibold">How the pilot works</h2>
        <ol className="list-decimal space-y-2 pl-6">{pilot.steps.map(step => <li key={step}>{step}</li>)}</ol>
        <h2 className="mb-3 mt-8 text-2xl font-semibold">What to measure</h2><p>{pilot.measure}</p>
        <h2 className="mb-3 mt-8 text-2xl font-semibold">Day 30, 60 and 90</h2>
        <dl className="space-y-3">{pilot.days.map(([when, what]) => <div key={when}><dt className="font-semibold">{when}</dt><dd className="text-muted">{what}</dd></div>)}</dl>
        <h2 className="mb-3 mt-8 text-2xl font-semibold">What could go wrong, and the guard against it</h2><p>{pilot.risks}</p>
        <h2 className="mb-3 mt-8 text-2xl font-semibold">Questions</h2>
        <dl className="space-y-4">{pilot.faqs.map(([q, a]) => <div key={q}><dt className="font-semibold">{q}</dt><dd className="mt-1 text-muted">{a}</dd></div>)}</dl>
        <p className="mt-6"><a className="underline" href={guide.path}>Check your pilot readiness</a></p>
      </>}
      {page === privacy && <PrivacyBody />}
      <p className="mt-10 border-t border-line pt-6"><a href={BOOK_HREF} className="font-semibold underline">Book a free 30-minute call</a></p>
      <p className="mt-4 text-sm text-muted"><a className="underline" href="/privacy">Privacy notice</a></p>
    </main>
  </div>;
}

function PrivacyBody() {
  return <div className="mt-8 space-y-6 leading-relaxed">
    <p className="text-sm text-muted">Last updated 26 November 2026.</p>
    <div><h2 className="mb-2 text-2xl font-semibold">Who is responsible</h2>
      <p>Smart Biz AI Hub is run by Kevin Owens in Los Angeles. For anything on this page, including a request to see or delete what is held about you, reply to any email from Kevin or use the call request form.</p></div>
    <div><h2 className="mb-2 text-2xl font-semibold">When you ask for a call</h2>
      <p>The form stores what you type (name, email, business, the job you describe and your timeline) plus the time, your browser’s user-agent string and the IP address the request came from. The record sits in a Postgres database run by Render in the United States, so the request can be read and answered.</p>
      <p className="mt-3">Kevin gets an email copy through Gmail, and you get one short confirmation email with a link to his calendar. Cloudflare Turnstile checks that the form was sent by a person; it sees your IP address and browser signals for that check only. The legal basis is legitimate interest: you asked to be contacted. Requests are kept while the conversation is live and for as long as any work it leads to needs a record. Ask and they are deleted.</p></div>
    <div><h2 className="mb-2 text-2xl font-semibold">The readiness checklist</h2>
      <p>The checklist runs in your browser. Your ticks are saved in this browser’s local storage under <code>sbh_checklist</code> so you can come back to them, and are never sent anywhere.</p></div>
    <div><h2 className="mb-2 text-2xl font-semibold">What is never done here</h2>
      <ul className="list-disc space-y-1 pl-6"><li>No analytics, advertising or retargeting pixels.</li><li>No mailing list and no marketing sequences.</li><li>No selling or sharing of your information with anyone.</li></ul></div>
    <div><h2 className="mb-2 text-2xl font-semibold">Your rights</h2>
      <p>Wherever you live, you can ask what is held about you, ask for it to be corrected, or ask for it to be deleted, and it will be done. In the UK or the EU you can also complain to your data protection authority.</p></div>
    <div><h2 className="mb-2 text-2xl font-semibold">Other sites in this family</h2>
      <p><a className="underline" href="https://kevinowens.com/privacy">kevinowens.com</a>, <a className="underline" href="https://productexec.co/privacy">ProductExec</a> and <a className="underline" href="https://enterpriseaistudio.com/privacy">Enterprise AI Studio</a> have their own notices and share the same form handling.</p></div>
  </div>;
}

const ORIGIN = 'https://smartbizaihub.com';

/* Per-page structured data for the prerendered resource pages: a breadcrumb on
   every page, plus Article and FAQPage on the pilot guides. */
export function resourceJsonLd(path: string): object[] {
  const page = resourcePages.find(item => item.path === path);
  if (!page) return [];
  const crumbs = [{ name: 'Home', url: ORIGIN + '/' }];
  if (page !== hub && page !== privacy) crumbs.push({ name: hub.title, url: ORIGIN + hub.path });
  crumbs.push({ name: page.title, url: ORIGIN + page.path });
  const blocks: object[] = [{
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: crumbs.map((c, i) => ({ '@type': 'ListItem', position: i + 1, name: c.name, item: c.url })),
  }];
  const pilot = pilots.find(item => item.path === path);
  if (pilot) {
    blocks.push({
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: pilot.title,
      description: pilot.description,
      url: ORIGIN + pilot.path,
      author: { '@id': 'https://kevinowens.com/#person' },
      publisher: { '@id': ORIGIN + '/#organization' },
    }, {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: pilot.faqs.map(([q, a]) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a } })),
    });
  }
  return blocks;
}
