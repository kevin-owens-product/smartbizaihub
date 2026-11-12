import React, { useCallback, useEffect, useRef, useState } from 'react';
import { FAQS } from './content.ts';
import { ClipboardCheck, MessagesSquare, ArrowRight, ArrowUpRight, Users, Sparkles, Bot, Receipt, CalendarClock, Workflow, Store, Wrench, Briefcase, PhoneCall, Lightbulb, X, Check, Menu, CheckCircle2 } from 'lucide-react';

const FAMILY_SITES = [
  { name: 'Kevin Owens', href: 'https://kevinowens.com', descriptor: 'Personal hub & writing', here: false },
  { name: 'ProductExec', href: 'https://productexec.co', descriptor: 'AI value creation for private equity', here: false },
  { name: 'Enterprise AI Studio', href: 'https://enterpriseaistudio.com', descriptor: 'AI implementation', here: false },
  { name: 'Smart Biz AI Hub', href: 'https://smartbizaihub.com', descriptor: 'AI pilots for small businesses', here: true },
] as const;

const PILOT_TIMELINE = [
  { when: 'Day 0', label: 'Free 30-minute phone call' },
  { when: 'Week 1', label: 'One job picked, one number agreed' },
  { when: 'Day 30', label: 'Live in the tools you already use' },
  { when: 'Day 90', label: 'Keep it, or walk away. No strings.' },
];

const STEPS = [
  { icon: PhoneCall, title: 'A free 30-minute call', body: 'Thirty minutes on the phone. You describe the work that eats your week. You leave knowing whether AI helps here, and what it would take.' },
  { icon: Workflow, title: 'One pilot, fixed scope', body: 'We pick a single job, agree what good looks like before starting, and build it into the tools you already use. Fixed price, agreed up front.' },
  { icon: ClipboardCheck, title: 'Checked at 30, 60, 90 days', body: "We measure the same number we agreed at the start: hours saved, jobs quoted, calls answered. If it isn't working by day 90, we stop and say so." },
];

const COMES_IN = [
  { icon: PhoneCall, title: 'Missed calls and inquiries', body: 'Answer the common questions, take the details, and hand you a tidy message with what the customer actually wants.', bullets: ['After-hours inquiries captured', 'Details in one place, not five notebooks', 'You call back knowing the job'] },
  { icon: Receipt, title: 'Quotes and follow-ups', body: 'Turn your job notes or a phone call into a first-draft quote, and chase the ones that have gone quiet.', bullets: ['Draft quote from your own pricing', 'Follow-ups that go out on time', 'You approve before anything sends'] },
  { icon: CalendarClock, title: 'Scheduling and reminders', body: 'Fill your calendar, confirm the day before, and cut the no-shows that cost you a slot.', bullets: ['Booking without the back-and-forth', 'Reminders customers actually read', 'Gaps filled from the waiting list'] },
];

const PILES_UP = [
  { icon: Receipt, title: 'Invoices and receipts', body: 'Sorted, matched and ready for your bookkeeper instead of a shoebox in March.' },
  { icon: MessagesSquare, title: 'The same ten emails', body: 'Drafted in your words, for the questions you answer every week. You still hit send.' },
  { icon: Store, title: 'Listings and stock', body: 'Product descriptions and updates written once, kept current across the places you sell.' },
];

const STARTS = [
  { icon: Wrench, title: 'Trades and field work', body: 'Quoting, scheduling and the calls you miss while you are up a ladder. The pilot usually starts with whichever of those costs you the most jobs.' },
  { icon: Briefcase, title: 'Small professional firms', body: 'Intake, document drafting and the weekly report nobody wants to write. Anything regulated stays under a human sign-off.' },
];

const DIFFERENT = [
  { icon: Users, title: 'You get one person, not an agency', body: 'The person who scopes the pilot is the person who builds it and tells you whether it worked.' },
  { icon: Bot, title: 'Your tools, not a new platform', body: 'Pilots are built into the email, calendar and accounting software you already run. Nothing here asks you to migrate your business.' },
  { icon: Sparkles, title: 'A number agreed before we start', body: 'Hours back, jobs quoted, calls answered: one measure, chosen up front, checked at 30, 60 and 90 days.' },
  { icon: Lightbulb, title: 'Permission to stop', body: 'If the pilot has not earned its keep by day 90, we stop and say so, and you are not signed up to anything further.' },
];

function Logo({ dark = false }: { dark?: boolean }) {
  return (
    <span className="flex items-center gap-2.5">
      <span className="grid h-8 w-8 place-items-center rounded-lg bg-gradient-to-br from-accent to-mint-deep font-display text-sm font-bold text-white" aria-hidden="true">S</span>
      <span className={`font-display text-[17px] font-semibold tracking-tight ${dark ? 'text-white' : 'text-ink'}`}>Smart Biz AI Hub</span>
    </span>
  );
}

function Eyebrow({ children, dark = false }: { children: React.ReactNode; dark?: boolean }) {
  return <p className={`font-mono text-xs sm:text-[11px] font-semibold uppercase tracking-[0.14em] ${dark ? 'text-accent-soft' : 'text-accent'}`}>{children}</p>;
}

const EMPTY_FORM = {
  name: '',
  email: '',
  company: '',
  phone: '',
  projectDescription: '',
  budget: '',
  timeline: '',
  website: ''
};

type FieldName = 'name' | 'email' | 'projectDescription';
type FieldErrors = Partial<Record<FieldName, string>>;

const FIELD_MESSAGES: Record<FieldName, string> = {
  name: 'Please add your name.',
  email: 'Please check your email address. It should look like name@yourbusiness.com.',
  projectDescription: 'Please tell Kevin a little about the job that takes too long.',
};

// Mirrors isValidEmail in owens-sites/server/api.mjs so a visitor sees the
// problem before submitting instead of a 400 from the server.
function isValidEmail(value: string) {
  const email = value.trim();
  if (email.length < 6 || email.length > 254 || /\s/.test(email)) return false;
  const at = email.indexOf('@');
  if (at < 1 || at !== email.lastIndexOf('@')) return false;
  const local = email.slice(0, at);
  const domain = email.slice(at + 1);
  if (local.length > 64 || domain.length > 253) return false;
  if (!/^[A-Za-z0-9]([A-Za-z0-9-]*[A-Za-z0-9])?(\.[A-Za-z0-9]([A-Za-z0-9-]*[A-Za-z0-9])?)+$/.test(domain)) return false;
  return /\.[A-Za-z]{2,}$/.test(domain);
}

function validate(data: typeof EMPTY_FORM): FieldErrors {
  const errors: FieldErrors = {};
  if (!data.name.trim()) errors.name = FIELD_MESSAGES.name;
  if (!isValidEmail(data.email)) errors.email = FIELD_MESSAGES.email;
  if (!data.projectDescription.trim()) errors.projectDescription = FIELD_MESSAGES.projectDescription;
  return errors;
}

// Error codes returned by /api/inquiry (owens-sites/server/api.mjs).
function serverErrorMessage(code: unknown): { message: string; field?: FieldName } {
  switch (code) {
    case 'missing_name':
      return { message: FIELD_MESSAGES.name, field: 'name' };
    case 'invalid_email':
      return { message: FIELD_MESSAGES.email, field: 'email' };
    case 'rate_limited':
      return { message: 'Several requests have come from your connection in a short time. Please wait about 10 minutes and try again.' };
    case 'body_too_large':
      return { message: 'That is a little too long to send. Please shorten your description and try again.', field: 'projectDescription' };
    case 'store_error':
      return { message: 'Your request could not be saved just now. Please try again in a minute.' };
    default:
      return { message: 'This form could not be sent. Please refresh the page and try again.' };
  }
}

const FOCUSABLE = 'a[href], button:not([disabled]), input:not([type="hidden"]):not([tabindex="-1"]), select, textarea, [tabindex]:not([tabindex="-1"])';

const inputClass = (invalid: boolean) =>
  `w-full px-4 py-2.5 border rounded-xl focus:ring-2 focus:ring-accent focus:border-transparent ${invalid ? 'border-red-500' : 'border-gray-300'}`;

function ScopingDialog({ onClose }: { onClose: () => void }) {
  const [formData, setFormData] = useState(EMPTY_FORM);
  const [status, setStatus] = useState<'idle' | 'sending' | 'ok' | 'error'>('idle');
  const [statusMessage, setStatusMessage] = useState('');
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [sentTo, setSentTo] = useState('');
  const dialogRef = useRef<HTMLDivElement>(null);
  const successHeadingRef = useRef<HTMLHeadingElement>(null);
  const pressStartedOnBackdrop = useRef(false);

  // Lock page scroll, move focus in, trap Tab, close on Escape.
  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    document.getElementById('name')?.focus();

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
        return;
      }
      if (e.key !== 'Tab' || !dialogRef.current) return;
      const items = Array.from(dialogRef.current.querySelectorAll<HTMLElement>(FOCUSABLE));
      if (items.length === 0) return;
      const first = items[0];
      const last = items[items.length - 1];
      const active = document.activeElement;
      if (!dialogRef.current.contains(active)) {
        e.preventDefault();
        first.focus();
      } else if (e.shiftKey && (active === first || active === dialogRef.current)) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && active === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [onClose]);

  useEffect(() => {
    if (status === 'ok') successHeadingRef.current?.focus();
  }, [status]);

  const focusField = (field: FieldName) => {
    requestAnimationFrame(() => document.getElementById(field)?.focus());
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errors = validate(formData);
    setFieldErrors(errors);
    const firstInvalid = (['name', 'email', 'projectDescription'] as FieldName[]).find((f) => errors[f]);
    if (firstInvalid) {
      setStatus('error');
      setStatusMessage('Please fix the highlighted fields.');
      focusField(firstInvalid);
      return;
    }
    setStatus('sending');
    setStatusMessage('');
    const payload = { ...formData, name: formData.name.trim(), email: formData.email.trim() };
    try {
      const res = await fetch('/api/inquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          form_name: 'schedule-a-demo',
          inquiry_type: 'demo',
          ...payload
        })
      });
      const data = await res.json().catch(() => ({ ok: false }));
      if (res.ok && data.ok) {
        setSentTo(payload.email);
        setFormData(EMPTY_FORM);
        setStatus('ok');
      } else {
        const { message, field } = serverErrorMessage(data.error);
        setStatus('error');
        setStatusMessage(field ? 'Please fix the highlighted field.' : message);
        if (field) {
          setFieldErrors({ [field]: message });
          focusField(field);
        }
      }
    } catch {
      setStatus('error');
      setStatusMessage('Your request did not send. Please check your connection and try again.');
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (name in fieldErrors) {
      setFieldErrors(prev => {
        const next = { ...prev };
        delete next[name as FieldName];
        return next;
      });
    }
  };

  const errorProps = (field: FieldName) => ({
    'aria-invalid': fieldErrors[field] ? true : undefined,
    'aria-describedby': fieldErrors[field] ? `${field}-error` : undefined,
  });

  const FieldError = ({ field }: { field: FieldName }) =>
    fieldErrors[field] ? <p id={`${field}-error`} className="mt-1.5 text-sm text-red-600">{fieldErrors[field]}</p> : null;

  return (
    <div
      className="fixed inset-0 bg-ink/60 backdrop-blur-sm z-[60] flex items-center justify-center p-4"
      onMouseDown={(e) => { pressStartedOnBackdrop.current = e.target === e.currentTarget; }}
      onClick={(e) => {
        if (pressStartedOnBackdrop.current && e.target === e.currentTarget) onClose();
        pressStartedOnBackdrop.current = false;
      }}
    >
      <div ref={dialogRef} role="dialog" aria-modal="true" aria-labelledby={status === 'ok' ? 'scoping-done-title' : 'scoping-title'} className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto overscroll-contain shadow-2xl">
        {status === 'ok' ? (
          <div className="p-6 sm:p-8 text-center">
            <CheckCircle2 className="mx-auto h-12 w-12 text-mint-deep" aria-hidden="true" />
            <h2 id="scoping-done-title" ref={successHeadingRef} tabIndex={-1} className="mt-4 font-display text-2xl font-semibold tracking-tight text-ink focus:outline-none">
              Got it. Your request reached Kevin.
            </h2>
            <p role="status" className="mt-3 text-[15px] leading-relaxed text-gray-600">
              Kevin will reply within one business day at <span className="font-semibold text-ink break-all">{sentTo}</span> to
              set up your free 30-minute call. There is nothing else you need to do for now.
            </p>
            <button type="button" onClick={onClose} className="btn-primary mt-8 min-h-[44px] px-8 py-2.5">
              Close
            </button>
          </div>
        ) : (
        <>
        <div className="p-6 border-b">
          <div className="flex justify-between items-center gap-4">
            <h2 id="scoping-title" className="font-display text-2xl font-semibold tracking-tight text-ink">Book a free 30-minute call</h2>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close"
              className="-mr-2 grid h-11 w-11 shrink-0 place-items-center rounded-full text-gray-500 hover:bg-gray-100 hover:text-gray-700"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
          <p className="mt-2 text-sm text-gray-600">
            Thirty minutes, no charge. You describe the job that eats your week; Kevin tells you
            whether AI is worth pointing at it, and what a first pilot would look like.
          </p>
        </div>
        <form onSubmit={handleSubmit} noValidate className="p-6">
          <input type="hidden" name="form_name" value="schedule-a-demo" />
          <input type="hidden" name="inquiry_type" value="demo" />
          <div className="absolute w-px h-px -m-px p-0 overflow-hidden whitespace-nowrap border-0" style={{ clip: 'rect(0 0 0 0)' }} aria-hidden="true">
            <label htmlFor="website">Leave this field empty</label>
            <input
              type="text"
              id="website"
              name="website"
              tabIndex={-1}
              autoComplete="off"
              value={formData.website}
              onChange={handleInputChange}
            />
          </div>
          <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                Your name *
              </label>
              <input
                required
                type="text"
                id="name"
                name="name"
                autoComplete="name"
                value={formData.name}
                onChange={handleInputChange}
                {...errorProps('name')}
                className={inputClass(!!fieldErrors.name)}
                placeholder="Your name"
              />
              <FieldError field="name" />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email *
              </label>
              <input
                required
                type="email"
                inputMode="email"
                id="email"
                name="email"
                autoComplete="email"
                value={formData.email}
                onChange={handleInputChange}
                {...errorProps('email')}
                className={inputClass(!!fieldErrors.email)}
                placeholder="you@yourbusiness.com"
              />
              <FieldError field="email" />
            </div>
            <div>
              <label htmlFor="company" className="block text-sm font-medium text-gray-700 mb-2">
                Business name
              </label>
              <input
                type="text"
                id="company"
                name="company"
                autoComplete="organization"
                value={formData.company}
                onChange={handleInputChange}
                className={inputClass(false)}
                placeholder="What it's called"
              />
            </div>
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                Phone (optional)
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                autoComplete="tel"
                value={formData.phone}
                onChange={handleInputChange}
                className={inputClass(false)}
                placeholder="Best number to reach you"
              />
            </div>
          </div>

          <div>
            <label htmlFor="projectDescription" className="block text-sm font-medium text-gray-700 mb-2">
              What takes too long right now? *
            </label>
            <textarea
              required
              id="projectDescription"
              name="projectDescription"
              value={formData.projectDescription}
              onChange={handleInputChange}
              {...errorProps('projectDescription')}
              rows={4}
              className={inputClass(!!fieldErrors.projectDescription)}
              placeholder="For example: quoting takes two evenings a week, or nobody answers the phone when we're on a job."
            />
            <FieldError field="projectDescription" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="budget" className="block text-sm font-medium text-gray-700 mb-2">
                What could you spend on a first pilot?
              </label>
              <select
                id="budget"
                name="budget"
                value={formData.budget}
                onChange={handleInputChange}
                className={inputClass(false)}
              >
                <option value="">Not sure yet</option>
                <option value="under-2500">Under $2,500</option>
                <option value="2500-7500">$2,500 - $7,500</option>
                <option value="7500-15000">$7,500 - $15,000</option>
                <option value="15000+">$15,000+</option>
              </select>
            </div>
            <div>
              <label htmlFor="timeline" className="block text-sm font-medium text-gray-700 mb-2">
                When would you want to start?
              </label>
              <select
                id="timeline"
                name="timeline"
                value={formData.timeline}
                onChange={handleInputChange}
                className={inputClass(false)}
              >
                <option value="">Choose one</option>
                <option value="now">As soon as possible</option>
                <option value="1-3months">In the next few months</option>
                <option value="later">Later this year</option>
                <option value="just-looking">Just reading for now</option>
              </select>
            </div>
          </div>

          <p role="alert" className="text-sm text-red-600 empty:hidden">
            {status === 'error' ? statusMessage : ''}
          </p>

          <p className="text-xs text-gray-500">
            Your details go to Kevin only, to reply to this inquiry. No list, no sharing.
          </p>

          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="min-h-[44px] px-6 py-2.5 border border-gray-300 rounded-full text-sm font-semibold text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={status === 'sending'}
              className="min-h-[44px] px-6 py-2.5 bg-ink text-white rounded-full text-sm font-semibold hover:bg-ink-soft disabled:opacity-60"
            >
              {status === 'sending' ? 'Sending...' : 'Request the call'}
            </button>
          </div>
          </div>
        </form>
        </>
        )}
      </div>
    </div>
  );
}

function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const openerRef = useRef<HTMLElement | null>(null);

  // Each open mounts a fresh dialog, so no old success or error message carries over.
  const openModal = (e: React.MouseEvent<HTMLElement>) => {
    // currentTarget, not activeElement: iOS Safari does not focus buttons on tap.
    openerRef.current = e.currentTarget;
    setIsMenuOpen(false);
    setIsModalOpen(true);
  };
  const closeModal = useCallback(() => {
    setIsModalOpen(false);
    const opener = openerRef.current;
    if (opener) requestAnimationFrame(() => opener.focus());
  }, []);

  useEffect(() => {
    if (!isMenuOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsMenuOpen(false);
        document.getElementById('menu-toggle')?.focus();
      }
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [isMenuOpen]);

  const NAV_LINKS = [
    ['#services', 'How it works'],
    ['#solutions', 'Pilot ideas'],
    ['#about', 'Who runs it'],
    ['#faq', 'Questions'],
    ['#contact', 'Contact'],
  ];

  return (
    <div className="min-h-screen bg-white text-ink antialiased">
      {isModalOpen && <ScopingDialog onClose={closeModal} />}

      {/* Navigation */}
      <nav className="fixed w-full bg-white/80 backdrop-blur-md z-50 border-b border-line" aria-label="Main">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center gap-3">
            <a href="#top" aria-label="Smart Biz AI Hub, back to top"><Logo /></a>
            <div className="hidden md:flex items-center gap-8 text-sm font-medium">
              {NAV_LINKS.map(([href, label]) => (
                <a key={href} href={href} className="text-muted hover:text-ink">{label}</a>
              ))}
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={openModal}
                className="btn-primary min-h-[44px] px-5 py-2.5"
              >
                Book a call
              </button>
              <button
                id="menu-toggle"
                type="button"
                className="grid h-11 w-11 place-items-center rounded-full text-ink hover:bg-paper md:hidden"
                aria-expanded={isMenuOpen}
                aria-controls="mobile-menu"
                aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
                onClick={() => setIsMenuOpen((v) => !v)}
              >
                {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>
        {isMenuOpen && (
          <div id="mobile-menu" className="border-t border-line bg-white md:hidden">
            <ul className="mx-auto max-w-6xl px-4 py-2">
              {NAV_LINKS.map(([href, label]) => (
                <li key={href}>
                  <a
                    href={href}
                    onClick={() => setIsMenuOpen(false)}
                    className="block py-3 text-base font-medium text-ink hover:text-accent"
                  >
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}
      </nav>

      <main id="top">
      {/* Hero */}
      <section className="hero-light pt-32 pb-20 sm:pt-36 lg:pb-28">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid items-center gap-12 lg:grid-cols-[1.15fr_0.85fr]">
            <div>
              <span className="pill">
                <span className="h-1.5 w-1.5 rounded-full bg-mint" aria-hidden="true" />
                For businesses with 5 to 50 people
              </span>
              <h1 className="mt-6 font-display text-[2.6rem] font-semibold leading-[1.04] tracking-[-0.03em] text-ink sm:text-6xl lg:text-[4.25rem]">
                Your first AI pilot, <span className="text-gradient">scoped for a small business.</span>
              </h1>
              <p className="mt-6 max-w-xl text-lg leading-[1.7] text-muted">
                A pilot is a 90-day trial on one job that eats your week: set up in the tools you
                already use, and checked at 30, 60 and 90 days. No software to buy, no year-long
                project, and a clear answer about whether it was worth it.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <button onClick={openModal} className="btn-primary px-6 py-3">
                  Book a free 30-minute call <ArrowUpRight className="ml-1.5 h-4 w-4" />
                </button>
                <a href="#solutions" className="btn-secondary px-6 py-3">
                  See what a pilot looks like
                </a>
              </div>
            </div>

            <aside className="pilot-card" aria-label="What a pilot looks like">
              <div className="flex items-center justify-between">
                <p className="font-mono text-xs sm:text-[11px] uppercase tracking-[0.14em] text-white/60">One pilot · one job</p>
                <span className="rounded-full bg-mint/15 px-2.5 py-1 font-mono text-xs sm:text-[10.5px] uppercase tracking-[0.12em] text-mint-soft">Fixed price</span>
              </div>
              <ol className="mt-6 space-y-5">
                {PILOT_TIMELINE.map((item, i) => (
                  <li key={item.when} className="flex items-start gap-4">
                    <span className="mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-full border border-accent-soft/60 bg-accent/20 font-mono text-xs text-accent-soft">
                      {i + 1}
                    </span>
                    <span>
                      <span className="block font-mono text-xs sm:text-[11px] uppercase tracking-[0.12em] text-accent-soft">{item.when}</span>
                      <span className="mt-0.5 block font-medium text-white/90">{item.label}</span>
                    </span>
                  </li>
                ))}
              </ol>
              <dl className="mt-7 grid grid-cols-3 gap-3 border-t border-white/10 pt-5">
                {[['Measured by', 'One number'], ['Check-ins', 'Day 30, 60, 90'], ['Stop after', 'Any step']].map(([k, v]) => (
                  <div key={k}>
                    <dt className="font-mono text-xs sm:text-[10.5px] uppercase tracking-[0.1em] text-white/60">{k}</dt>
                    <dd className="mt-1 font-display text-[15px] font-semibold tracking-tight text-white">{v}</dd>
                  </div>
                ))}
              </dl>
            </aside>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="services" className="py-20 sm:py-24 scroll-mt-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <Eyebrow>How it works</Eyebrow>
            <h2 className="section-title mt-3">Three steps, in plain English.</h2>
            <p className="mt-4 text-lg text-muted">You can stop after any of them.</p>
          </div>
          <div className="mt-12 grid gap-5 md:grid-cols-3">
            {STEPS.map(({ icon: Icon, title, body }, i) => (
              <div key={title} className="card p-7">
                <div className="flex items-center justify-between">
                  <span className="icon-chip"><Icon className="h-5 w-5" /></span>
                  <span className="font-mono text-xs text-muted">0{i + 1}</span>
                </div>
                <h3 className="mt-6 font-display text-xl font-semibold tracking-tight">{title}</h3>
                <p className="mt-3 text-[15px] leading-relaxed text-muted">{body}</p>
              </div>
            ))}
          </div>

          <div className="mt-5 card grid gap-6 p-7 md:grid-cols-[0.8fr_1.2fr]">
            <div>
              <h3 className="font-display text-xl font-semibold tracking-tight">You don't need to be technical.</h3>
              <p className="mt-3 text-[15px] leading-relaxed text-muted">
                Kevin does the building, inside the email, calendar and accounting software you
                already run. There is no new system for you or your team to learn.
              </p>
            </div>
            <div>
              <p className="group-label">What you'll need to do</p>
              <ul className="mt-4 space-y-2.5 text-[15px] text-ink-soft">
                {[
                  'Spend 30 minutes on the phone describing the job that eats your week.',
                  'Agree the one number that will show whether it worked.',
                  'Approve anything before it goes out to a customer.',
                  'Look at the results with Kevin at day 30, 60 and 90.',
                ].map((t) => (
                  <li key={t} className="flex gap-2"><Check className="mt-0.5 h-4 w-4 shrink-0 text-mint-deep" />{t}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Pilot ideas */}
      <section id="solutions" className="py-20 sm:py-24 bg-paper border-y border-line scroll-mt-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <Eyebrow>Pilot ideas</Eyebrow>
            <h2 className="section-title mt-3">Start with the job that keeps you at the desk.</h2>
            <p className="mt-4 text-lg text-muted">
              Starting points, not a menu you have to pick from. Most owners arrive with the job
              already in mind: the one that keeps them at the desk after everyone else has gone home.
            </p>
          </div>

          <h3 className="group-label mt-14">Work that comes in</h3>
          <div className="mt-5 grid gap-5 md:grid-cols-3">
            {COMES_IN.map(({ icon: Icon, title, body, bullets }) => (
              <div key={title} className="card p-7">
                <span className="icon-chip"><Icon className="h-5 w-5" /></span>
                <h4 className="mt-5 font-display text-lg font-semibold tracking-tight">{title}</h4>
                <p className="mt-2 text-[15px] leading-relaxed text-muted">{body}</p>
                <ul className="mt-5 space-y-2 border-t border-line pt-4 text-sm text-ink-soft">
                  {bullets.map((b) => (
                    <li key={b} className="flex gap-2"><Check className="mt-0.5 h-4 w-4 shrink-0 text-mint-deep" />{b}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <h3 className="group-label mt-14">Work that piles up</h3>
          <div className="mt-5 grid gap-5 md:grid-cols-3">
            {PILES_UP.map(({ icon: Icon, title, body }) => (
              <div key={title} className="card flex gap-4 p-6">
                <span className="icon-chip shrink-0"><Icon className="h-5 w-5" /></span>
                <div>
                  <h4 className="font-display text-base font-semibold tracking-tight">{title}</h4>
                  <p className="mt-1.5 text-sm leading-relaxed text-muted">{body}</p>
                </div>
              </div>
            ))}
          </div>

          <h3 className="group-label mt-14">Where it usually starts</h3>
          <div className="mt-5 grid gap-5 md:grid-cols-2">
            {STARTS.map(({ icon: Icon, title, body }) => (
              <div key={title} className="card p-7">
                <span className="icon-chip"><Icon className="h-5 w-5" /></span>
                <h4 className="mt-5 font-display text-lg font-semibold tracking-tight">{title}</h4>
                <p className="mt-2 text-[15px] leading-relaxed text-muted">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Who runs it */}
      <section id="about" className="py-20 sm:py-24 scroll-mt-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
            <div className="card flex items-center gap-6 p-7">
              <img
                src="/kevin-owens.jpg"
                alt="Kevin Owens"
                width={112}
                height={112}
                loading="lazy"
                className="h-28 w-28 rounded-2xl object-cover"
              />
              <div>
                <p className="font-display text-2xl font-semibold tracking-tight">Kevin Owens</p>
                <p className="mt-1 font-mono text-xs sm:text-[11px] uppercase tracking-[0.14em] text-accent">Founder</p>
                <p className="mt-3 text-sm text-muted">Four-time Chief Product Officer. Los Angeles.</p>
              </div>
            </div>
            <div>
              <Eyebrow>Who runs it</Eyebrow>
              <h2 className="section-title mt-3">One person who calls you back.</h2>
              <div className="mt-5 space-y-4 text-[17px] leading-relaxed text-muted">
                <p>
                  Smart Biz AI Hub is Kevin Owens. He spends his working life building AI products for
                  larger companies, and this is where the same thinking gets scoped down to a size a
                  small business can actually use.
                </p>
                <p>
                  That means you deal with him, not an account manager. It also means there is a limit
                  on how many pilots run at once, and he will say when yours is better handled by the
                  software you already pay for.
                </p>
                <p>
                  Kevin's full background, most of it with larger companies:{' '}
                  <a href="https://kevinowens.com/about" className="font-semibold text-accent hover:underline">
                    kevinowens.com/about
                  </a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* What makes this different */}
      <section className="pb-20 sm:pb-24">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <Eyebrow>Why it works</Eyebrow>
            <h2 className="section-title mt-3">What makes this different.</h2>
          </div>
          <div className="mt-10 grid gap-5 sm:grid-cols-2">
            {DIFFERENT.map(({ icon: Icon, title, body }) => (
              <div key={title} className="card flex gap-5 p-7">
                <span className="icon-chip shrink-0"><Icon className="h-5 w-5" /></span>
                <div>
                  <h3 className="font-display text-lg font-semibold tracking-tight">{title}</h3>
                  <p className="mt-2 text-[15px] leading-relaxed text-muted">{body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ: the same FAQS array feeds the FAQPage JSON-LD in the built HTML. */}
      <section id="faq" className="py-20 sm:py-24 bg-paper border-t border-line scroll-mt-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <Eyebrow>Questions</Eyebrow>
          <h2 className="section-title mt-3">What owners ask first.</h2>
          <div className="mt-10 space-y-3">
            {FAQS.map((f, i) => (
              <details key={f.q} className="card group p-6" open={i === 0}>
                <summary className="flex min-h-[44px] cursor-pointer list-none items-center justify-between gap-4 font-display text-lg font-semibold tracking-tight">
                  <h3>{f.q}</h3>
                  <span aria-hidden="true" className="text-muted transition-transform group-open:rotate-45">+</span>
                </summary>
                <p className="mt-3 text-[15px] leading-relaxed text-muted">{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* CTA + contact. Every "#contact" link on the page lands here, and the
          button opens the same scoping-call form the other CTAs use. */}
      <section id="contact" className="hero-dark py-20 sm:py-28 scroll-mt-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Eyebrow dark>Get in touch</Eyebrow>
          <h2 className="mt-4 font-display text-4xl font-semibold leading-[1.05] tracking-[-0.03em] text-white sm:text-5xl">
            What would you hand over first? <span className="text-gradient-dark">Start there.</span>
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-lg text-white/70">
            Bring the job you would happily never do again. Thirty minutes, no charge, and an
            honest answer about whether AI is the right tool for it. Kevin replies within one
            business day.
          </p>
          <button
            onClick={openModal}
            className="btn-on-dark mt-8 px-7 py-3"
          >
            Book a free 30-minute call <ArrowRight className="ml-2 h-4 w-4" />
          </button>
        </div>
      </section>
      </main>

      {/* Footer */}
      <footer className="bg-ink text-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
          <div className="grid gap-10 md:grid-cols-[1.4fr_1fr_1fr]">
            <div>
              <Logo dark />
              <p className="mt-4 max-w-sm text-sm leading-relaxed text-white/60">
                AI pilots scoped for small businesses, measured at 30, 60 and 90 days.
              </p>
            </div>
            <div>
              <p className="font-mono text-xs sm:text-[11px] uppercase tracking-[0.14em] text-white/55">On this page</p>
              <ul className="mt-3 text-sm text-white/70">
                <li><a href="#services" className="inline-block py-2.5 hover:text-white">How it works</a></li>
                <li><a href="#solutions" className="inline-block py-2.5 hover:text-white">Pilot ideas</a></li>
                <li><a href="#about" className="inline-block py-2.5 hover:text-white">Who runs it</a></li>
                <li><a href="#faq" className="inline-block py-2.5 hover:text-white">Questions</a></li>
                <li><a href="#contact" className="inline-block py-2.5 hover:text-white">Contact</a></li>
              </ul>
            </div>
            <div>
              <p className="font-mono text-xs sm:text-[11px] uppercase tracking-[0.14em] text-white/55">Elsewhere</p>
              <ul className="mt-3 text-sm text-white/70">
                <li><a href="https://kevinowens.com/about" className="inline-block py-2.5 hover:text-white">About Kevin</a></li>
                <li><a href="https://www.linkedin.com/in/kevinaowens" className="inline-block py-2.5 hover:text-white">LinkedIn</a></li>
              </ul>
            </div>
          </div>

          {/* Shared family footer strip: same order and wording on all four sites. */}
          <div className="family-strip mt-12 border-t border-white/10 pt-8">
            <p className="font-mono text-xs sm:text-[11px] font-semibold uppercase tracking-[0.14em] text-accent-soft">A KEVIN OWENS PRACTICE</p>
            <ul className="mt-2 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {FAMILY_SITES.map((site) => (
                <li key={site.name} className="text-sm">
                  {site.here ? (
                    <span className="inline-block py-2.5 font-semibold text-white">{site.name}</span>
                  ) : (
                    <a href={site.href} className="inline-block py-2.5 font-semibold text-white hover:text-accent-soft">{site.name}</a>
                  )}
                  <span className="block text-xs text-white/60">{site.descriptor}{site.here ? ' — you are here' : ''}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-10 border-t border-white/10 pt-6 text-xs text-white/45">
            <p>&copy; {new Date().getFullYear()} Smart Biz AI Hub. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
