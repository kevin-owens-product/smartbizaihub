import React, { useState } from 'react';
import { FAQS } from './content.ts';
import { ClipboardCheck, MessagesSquare, ArrowRight, ArrowUpRight, Users, Sparkles, Bot, Receipt, CalendarClock, Workflow, Store, Wrench, Briefcase, PhoneCall, Lightbulb, X, Check } from 'lucide-react';

const FAMILY_SITES = [
  { name: 'Kevin Owens', href: 'https://kevinowens.com', descriptor: 'Personal hub & writing', here: false },
  { name: 'ProductExec', href: 'https://productexec.co', descriptor: 'AI value creation for PE', here: false },
  { name: 'Enterprise AI Studio', href: 'https://enterpriseaistudio.com', descriptor: 'AI implementation', here: false },
  { name: 'Smart Biz AI Hub', href: 'https://smartbizaihub.com', descriptor: 'SMB pilots & guides', here: true },
] as const;

const PILOT_TIMELINE = [
  { when: 'Day 0', label: 'Free 30-minute scoping call', done: true },
  { when: 'Week 1', label: 'One job picked, one number agreed', done: true },
  { when: 'Day 30', label: 'Live in the tools you already use', done: false },
  { when: 'Day 90', label: 'Keep it, or stop with the finding', done: false },
];

const STEPS = [
  { icon: PhoneCall, title: 'A free scoping call', body: 'Thirty minutes on the phone. You describe the work that eats your week. You leave knowing whether AI helps here, and what it would take.' },
  { icon: Workflow, title: 'One pilot, fixed scope', body: 'We pick a single job, agree what good looks like before starting, and build it into the tools you already use. Fixed price, agreed up front.' },
  { icon: ClipboardCheck, title: 'Checked at 30, 60, 90 days', body: "We measure the same number we agreed at the start: hours saved, jobs quoted, calls answered. If it isn't working by day 90, we stop and say so." },
];

const COMES_IN = [
  { icon: PhoneCall, title: 'Missed calls and enquiries', body: 'Answer the common questions, take the details, and hand you a tidy message with what the customer actually wants.', bullets: ['After-hours enquiries captured', 'Details in one place, not five notebooks', 'You call back knowing the job'] },
  { icon: Receipt, title: 'Quotes and follow-ups', body: 'Turn a site note or a phone call into a first-draft quote, and chase the ones that have gone quiet.', bullets: ['Draft quote from your own pricing', 'Follow-ups that go out on time', 'You approve before anything sends'] },
  { icon: CalendarClock, title: 'Scheduling and reminders', body: 'Fill the diary, confirm the day before, and cut the no-shows that cost you a slot.', bullets: ['Booking without the back-and-forth', 'Reminders customers actually read', 'Gaps filled from the waiting list'] },
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
  { icon: Bot, title: 'Your tools, not a new platform', body: 'Pilots are built into the email, diary and accounting software you already run. Nothing here asks you to migrate your business.' },
  { icon: Sparkles, title: 'A number agreed before we start', body: 'Hours back, jobs quoted, calls answered: one measure, chosen up front, checked at 30, 60 and 90 days.' },
  { icon: Lightbulb, title: 'Permission to stop', body: 'If the pilot has not earned its keep by day 90, that is the finding, and you are not signed up to anything further.' },
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
  return <p className={`font-mono text-[11px] font-semibold uppercase tracking-[0.14em] ${dark ? 'text-accent-soft' : 'text-accent'}`}>{children}</p>;
}

function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    phone: '',
    projectDescription: '',
    budget: '',
    timeline: '',
    website: ''
  });
  const [status, setStatus] = useState<'idle' | 'sending' | 'ok' | 'error'>('idle');
  const [statusMessage, setStatusMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('sending');
    setStatusMessage('');
    try {
      const res = await fetch('/api/inquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          form_name: 'schedule-a-demo',
          inquiry_type: 'demo',
          ...formData
        })
      });
      const data = await res.json().catch(() => ({ ok: false }));
      if (res.ok && data.ok) {
        setStatus('ok');
        setStatusMessage("Thanks - that reached Kevin. Expect a reply within one business day.");
        setFormData({
          name: '',
          email: '',
          company: '',
          phone: '',
          projectDescription: '',
          budget: '',
          timeline: '',
          website: ''
        });
      } else {
        setStatus('error');
        setStatusMessage('Something went wrong. Please try again in a moment.');
      }
    } catch {
      setStatus('error');
      setStatusMessage('Network error. Please try again in a moment.');
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="min-h-screen bg-white text-ink antialiased">
      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-ink/60 backdrop-blur-sm z-[60] flex items-center justify-center p-4">
          <div role="dialog" aria-modal="true" aria-labelledby="scoping-title" className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="p-6 border-b">
              <div className="flex justify-between items-center">
                <h2 id="scoping-title" className="font-display text-2xl font-semibold tracking-tight text-ink">Book a free scoping call</h2>
                <button
                  onClick={() => setIsModalOpen(false)}
                  aria-label="Close"
                  className="rounded-full p-1 text-gray-500 hover:bg-gray-100 hover:text-gray-700"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
              <p className="mt-2 text-sm text-gray-600">
                Thirty minutes, no charge. You describe the job that eats your week; Kevin tells you
                whether AI is worth pointing at it, and what a first pilot would look like.
              </p>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
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
                    className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-accent focus:border-transparent"
                    placeholder="Your name"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    Email *
                  </label>
                  <input
                    required
                    type="email"
                    id="email"
                    name="email"
                    autoComplete="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-accent focus:border-transparent"
                    placeholder="you@yourbusiness.com"
                  />
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
                    className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-accent focus:border-transparent"
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
                    className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-accent focus:border-transparent"
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
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-accent focus:border-transparent"
                  placeholder="For example: quoting takes two evenings a week, or nobody answers the phone when we're on site."
                />
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
                    className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-accent focus:border-transparent"
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
                    className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-accent focus:border-transparent"
                  >
                    <option value="">Choose one</option>
                    <option value="now">As soon as possible</option>
                    <option value="1-3months">In the next few months</option>
                    <option value="later">Later this year</option>
                    <option value="just-looking">Just reading for now</option>
                  </select>
                </div>
              </div>

              {status !== 'idle' && status !== 'sending' && (
                <p
                  role="status"
                  className={status === 'ok' ? 'text-sm text-green-700' : 'text-sm text-red-600'}
                >
                  {statusMessage}
                </p>
              )}

              <p className="text-xs text-gray-500">
                Your details go to Kevin only, to reply to this enquiry. No list, no sharing.
              </p>

              <div className="flex justify-end gap-4">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-6 py-2.5 border border-gray-300 rounded-full text-sm font-semibold text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={status === 'sending'}
                  className="px-6 py-2.5 bg-ink text-white rounded-full text-sm font-semibold hover:bg-ink-soft disabled:opacity-60"
                >
                  {status === 'sending' ? 'Sending...' : 'Request the call'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Navigation */}
      <nav className="fixed w-full bg-white/80 backdrop-blur-md z-50 border-b border-line">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <a href="#top" aria-label="Smart Biz AI Hub, back to top"><Logo /></a>
            <div className="hidden md:flex items-center gap-8 text-sm font-medium">
              <a href="#services" className="text-muted hover:text-ink">How it works</a>
              <a href="#solutions" className="text-muted hover:text-ink">Pilot ideas</a>
              <a href="#about" className="text-muted hover:text-ink">Who runs it</a>
              <a href="#contact" className="text-muted hover:text-ink">Contact</a>
            </div>
            <button
              onClick={() => setIsModalOpen(true)}
              className="btn-primary px-5 py-2"
            >
              Book a call
            </button>
          </div>
        </div>
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
                One job that eats your week, automated and measured at 30, 60 and 90 days. No platform
                to buy, no year-long project, and a clear answer about whether it was worth it.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <button onClick={() => setIsModalOpen(true)} className="btn-primary px-6 py-3">
                  Book a free scoping call <ArrowUpRight className="ml-1.5 h-4 w-4" />
                </button>
                <a href="#solutions" className="btn-secondary px-6 py-3">
                  See what a pilot looks like
                </a>
              </div>
            </div>

            <aside className="pilot-card" aria-label="What a pilot looks like">
              <div className="flex items-center justify-between">
                <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-white/50">One pilot · one job</p>
                <span className="rounded-full bg-mint/15 px-2.5 py-1 font-mono text-[10.5px] uppercase tracking-[0.12em] text-mint-soft">Fixed price</span>
              </div>
              <ol className="mt-6 space-y-5">
                {PILOT_TIMELINE.map((item, i) => (
                  <li key={item.when} className="flex items-start gap-4">
                    <span className={`mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-full border font-mono text-[11px] ${item.done ? 'border-accent-soft/60 bg-accent/20 text-accent-soft' : 'border-white/15 text-white/45'}`}>
                      {item.done ? <Check className="h-3.5 w-3.5" /> : i + 1}
                    </span>
                    <span>
                      <span className="block font-mono text-[11px] uppercase tracking-[0.12em] text-accent-soft">{item.when}</span>
                      <span className="mt-0.5 block font-medium text-white/90">{item.label}</span>
                    </span>
                  </li>
                ))}
              </ol>
              <dl className="mt-7 grid grid-cols-3 gap-3 border-t border-white/10 pt-5">
                {[['Measure', 'Hours back'], ['Checks', '30 · 60 · 90'], ['Exit', 'Any step']].map(([k, v]) => (
                  <div key={k}>
                    <dt className="font-mono text-[10.5px] uppercase tracking-[0.12em] text-white/45">{k}</dt>
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
                <p className="mt-1 font-mono text-[11px] uppercase tracking-[0.14em] text-accent">Founder</p>
                <p className="mt-3 text-sm text-muted">Four-time Chief Product Officer. Los Angeles.</p>
              </div>
            </div>
            <div>
              <Eyebrow>Who runs it</Eyebrow>
              <h2 className="section-title mt-3">One person you can call.</h2>
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
                  Canonical bio:{' '}
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
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-display text-lg font-semibold tracking-tight">
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
            onClick={() => setIsModalOpen(true)}
            className="btn-on-dark mt-8 px-7 py-3"
          >
            Book a free scoping call <ArrowRight className="ml-2 h-4 w-4" />
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
              <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-white/45">On this page</p>
              <ul className="mt-4 space-y-2 text-sm text-white/70">
                <li><a href="#services" className="hover:text-white">How it works</a></li>
                <li><a href="#solutions" className="hover:text-white">Pilot ideas</a></li>
                <li><a href="#about" className="hover:text-white">Who runs it</a></li>
                <li><a href="#faq" className="hover:text-white">Questions</a></li>
                <li><a href="#contact" className="hover:text-white">Contact</a></li>
              </ul>
            </div>
            <div>
              <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-white/45">Elsewhere</p>
              <ul className="mt-4 space-y-2 text-sm text-white/70">
                <li><a href="https://kevinowens.com/about" className="hover:text-white">About Kevin</a></li>
                <li><a href="https://www.linkedin.com/in/kevinaowens" className="hover:text-white">LinkedIn</a></li>
              </ul>
            </div>
          </div>

          {/* Shared family footer strip: same order and wording on all four sites. */}
          <div className="family-strip mt-12 border-t border-white/10 pt-8">
            <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.14em] text-accent-soft">A KEVIN OWENS PRACTICE</p>
            <ul className="mt-4 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {FAMILY_SITES.map((site) => (
                <li key={site.name} className="text-sm">
                  {site.here ? (
                    <span className="font-semibold text-white">{site.name}</span>
                  ) : (
                    <a href={site.href} className="font-semibold text-white hover:text-accent-soft">{site.name}</a>
                  )}
                  <span className="mt-0.5 block text-xs text-white/50">{site.descriptor}{site.here ? ' — you are here' : ''}</span>
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
