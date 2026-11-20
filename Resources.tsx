import { useState } from 'react';

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
  },
  {
    path: '/pilots/follow-up-automation',
    title: 'Customer follow-up automation pilot',
    description: 'Use your existing inbox or CRM to queue follow-ups after a quote or customer conversation.',
    example: 'Start with quotes that have had no reply for seven days. Review a week of sent quotes and count how many reached the promised follow-up date without anyone getting in touch.',
    steps: ['Agree what starts the clock, what counts as a reply, and which customers must be excluded.', 'Draft a follow-up from the quote, assign it to the account owner, and put it in their review queue.', 'Have the owner check and send the message. Stop reminders when a customer replies, opts out, or the quote closes.'],
    measure: 'Track the share of eligible quotes followed up on time. Check a small sample for duplicate or unwanted reminders.',
  },
  {
    path: '/pilots/document-intelligence',
    title: 'Document intelligence pilot',
    description: 'Pilot intake and extraction on one recurring document type, with a person reviewing exceptions before records are updated.',
    example: 'Pick one invoice format and gather examples the team is authorized to use. Include a credit note, a missing purchase order and a duplicate so the trial covers the awkward cases.',
    steps: ['Name the fields your accounting team needs and label the expected answers on a sample.', 'Extract those fields into a draft record and check totals and purchase-order references.', 'Queue mismatches for review. Let the owner approve a record before posting it to the accounting system.'],
    measure: 'Compare review minutes per invoice and errors per field against manual processing. Count exceptions separately so an easy batch cannot hide the troublesome cases.',
  },
];

const hub = {
  path: '/resources',
  title: 'Small business AI pilot resources',
  description: 'Use the readiness checklist to pick a first workflow, then scope a reporting, customer follow-up or document pilot.',
};
export const resourcePages = [hub, guide, ...pilots];

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
        <h2 className="mb-3 mt-8 text-2xl font-semibold">Where to start</h2><p>{pilot.example}</p>
        <h2 className="mb-3 mt-8 text-2xl font-semibold">How the pilot works</h2>
        <ol className="list-decimal space-y-2 pl-6">{pilot.steps.map(step => <li key={step}>{step}</li>)}</ol>
        <h2 className="mb-3 mt-8 text-2xl font-semibold">What to measure</h2><p>{pilot.measure}</p>
        <p className="mt-6"><a className="underline" href={guide.path}>Check your pilot readiness</a></p>
      </>}
      <p className="mt-10 border-t border-line pt-6"><a href="/#contact" className="font-semibold underline">Book a free scoping call</a></p>
    </main>
  </div>;
}
