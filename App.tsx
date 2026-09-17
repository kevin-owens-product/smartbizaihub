import React, { useState } from 'react';
import { Brain, ClipboardCheck, MessagesSquare, ChevronRight, ArrowRight, Users, Sparkles, Bot, Receipt, CalendarClock, Workflow, Store, Wrench, Briefcase, PhoneCall, Lightbulb, X } from 'lucide-react';

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
    <div className="min-h-screen bg-white">
      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-900">Book a free scoping call</h2>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="text-gray-500 hover:text-gray-700"
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
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                  className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={status === 'sending'}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-60"
                >
                  {status === 'sending' ? 'Sending...' : 'Request the call'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Navigation */}
      <nav className="fixed w-full bg-white/80 backdrop-blur-sm z-50 border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center">
              <Brain className="h-8 w-8 text-blue-600" />
              <span className="ml-2 text-xl font-bold text-gray-900">Smart Biz AI Hub</span>
            </div>
            <div className="hidden md:flex space-x-8">
              <a href="#services" className="text-gray-600 hover:text-blue-600">How it works</a>
              <a href="#solutions" className="text-gray-600 hover:text-blue-600">Pilot ideas</a>
              <a href="#about" className="text-gray-600 hover:text-blue-600">Who runs it</a>
              <a href="#contact" className="text-gray-600 hover:text-blue-600">Contact</a>
            </div>
            <button
              onClick={() => setIsModalOpen(true)}
              className="bg-blue-600 text-white px-6 py-2 rounded-full hover:bg-blue-700 transition-colors"
            >
              Book a call
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 bg-gradient-to-br from-blue-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-sm font-semibold uppercase tracking-wider text-blue-600 mb-4">
              For businesses with 5 to 50 people
            </p>
            <h1 className="text-5xl font-bold text-gray-900 mb-6">
              Your first AI pilot, <span className="text-blue-600">scoped for a small business</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              One job that eats your week, automated and measured at 30, 60 and 90 days. No platform
              to buy, no year-long project, and a clear answer about whether it was worth it.
            </p>
            <div className="flex justify-center gap-4 flex-wrap">
              <button
                onClick={() => setIsModalOpen(true)}
                className="bg-blue-600 text-white px-8 py-3 rounded-full hover:bg-blue-700 transition-colors flex items-center"
              >
                Book a free scoping call <ChevronRight className="ml-2 h-5 w-5" />
              </button>
              <a
                href="#solutions"
                className="border border-gray-300 text-gray-700 px-8 py-3 rounded-full hover:bg-gray-50 transition-colors inline-flex items-center"
              >
                See what a pilot looks like
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="services" className="py-20 scroll-mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">How it works</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Three steps, in plain English. You can stop after any of them.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-2xl shadow-sm border hover:shadow-md transition-shadow">
              <PhoneCall className="h-12 w-12 text-blue-600 mb-4" />
              <h3 className="text-xl font-semibold mb-3">1. A free scoping call</h3>
              <p className="text-gray-600">
                Thirty minutes on the phone. You describe the work that eats your week. You leave
                knowing whether AI helps here, and what it would take.
              </p>
            </div>
            <div className="bg-white p-8 rounded-2xl shadow-sm border hover:shadow-md transition-shadow">
              <Workflow className="h-12 w-12 text-blue-600 mb-4" />
              <h3 className="text-xl font-semibold mb-3">2. One pilot, fixed scope</h3>
              <p className="text-gray-600">
                We pick a single job, agree what good looks like before starting, and build it into
                the tools you already use. Fixed price, agreed up front.
              </p>
            </div>
            <div className="bg-white p-8 rounded-2xl shadow-sm border hover:shadow-md transition-shadow">
              <ClipboardCheck className="h-12 w-12 text-blue-600 mb-4" />
              <h3 className="text-xl font-semibold mb-3">3. Checked at 30, 60, 90 days</h3>
              <p className="text-gray-600">
                We measure the same number we agreed at the start: hours saved, jobs quoted, calls
                answered. If it isn't working by day 90, we stop and say so.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Pilot ideas */}
      <section id="solutions" className="py-20 bg-gray-50 scroll-mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Pilot ideas</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Starting points, not a menu you have to pick from. Most owners arrive with the job
              already in mind: the one that keeps them at the desk after everyone else has gone home.
            </p>
          </div>

          <div className="mb-16">
            <h3 className="text-2xl font-bold mb-8 text-blue-600">Work that comes in</h3>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
                <PhoneCall className="h-10 w-10 text-blue-600 mb-4" />
                <h4 className="text-xl font-semibold mb-3">Missed calls and enquiries</h4>
                <p className="text-gray-600 mb-4">
                  Answer the common questions, take the details, and hand you a tidy message with
                  what the customer actually wants.
                </p>
                <ul className="text-sm text-gray-500 space-y-2">
                  <li>• After-hours enquiries captured</li>
                  <li>• Details in one place, not five notebooks</li>
                  <li>• You call back knowing the job</li>
                </ul>
              </div>
              <div className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
                <Receipt className="h-10 w-10 text-blue-600 mb-4" />
                <h4 className="text-xl font-semibold mb-3">Quotes and follow-ups</h4>
                <p className="text-gray-600 mb-4">
                  Turn a site note or a phone call into a first-draft quote, and chase the ones that
                  have gone quiet.
                </p>
                <ul className="text-sm text-gray-500 space-y-2">
                  <li>• Draft quote from your own pricing</li>
                  <li>• Follow-ups that go out on time</li>
                  <li>• You approve before anything sends</li>
                </ul>
              </div>
              <div className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
                <CalendarClock className="h-10 w-10 text-blue-600 mb-4" />
                <h4 className="text-xl font-semibold mb-3">Scheduling and reminders</h4>
                <p className="text-gray-600 mb-4">
                  Fill the diary, confirm the day before, and cut the no-shows that cost you a slot.
                </p>
                <ul className="text-sm text-gray-500 space-y-2">
                  <li>• Booking without the back-and-forth</li>
                  <li>• Reminders customers actually read</li>
                  <li>• Gaps filled from the waiting list</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="mb-16">
            <h3 className="text-2xl font-bold mb-8 text-blue-600">Work that piles up</h3>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                <Receipt className="h-8 w-8 text-blue-600 mb-3" />
                <h4 className="text-lg font-semibold mb-2">Invoices and receipts</h4>
                <p className="text-sm text-gray-600">
                  Sorted, matched and ready for your bookkeeper instead of a shoebox in March.
                </p>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                <MessagesSquare className="h-8 w-8 text-blue-600 mb-3" />
                <h4 className="text-lg font-semibold mb-2">The same ten emails</h4>
                <p className="text-sm text-gray-600">
                  Drafted in your words, for the questions you answer every week. You still hit send.
                </p>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                <Store className="h-8 w-8 text-blue-600 mb-3" />
                <h4 className="text-lg font-semibold mb-2">Listings and stock</h4>
                <p className="text-sm text-gray-600">
                  Product descriptions and updates written once, kept current across the places you
                  sell.
                </p>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-2xl font-bold mb-8 text-blue-600">Where it usually starts</h3>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
                <Wrench className="h-10 w-10 text-blue-600 mb-4" />
                <h4 className="text-xl font-semibold mb-3">Trades and field work</h4>
                <p className="text-gray-600">
                  Quoting, scheduling and the calls you miss while you are up a ladder. The pilot
                  usually starts with whichever of those costs you the most jobs.
                </p>
              </div>
              <div className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
                <Briefcase className="h-10 w-10 text-blue-600 mb-4" />
                <h4 className="text-xl font-semibold mb-3">Small professional firms</h4>
                <p className="text-gray-600">
                  Intake, document drafting and the weekly report nobody wants to write. Anything
                  regulated stays under a human sign-off.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 scroll-mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Who runs it</h2>
          </div>

          <div className="grid md:grid-cols-2 gap-12 items-start">
            <div>
              <img
                src="/kevin-owens.jpg"
                alt="Kevin Owens"
                className="rounded-2xl shadow-lg mb-8 w-full"
              />
              <div className="text-center">
                <h3 className="text-2xl font-bold mb-2">Kevin Owens</h3>
                <p className="text-blue-600 font-semibold mb-4">Founder</p>
              </div>
            </div>

            <div className="space-y-4 text-gray-600">
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
                <a href="https://kevinowens.com/about" className="text-blue-600 hover:underline">
                  kevinowens.com/about
                </a>
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold mb-6">What makes this different</h2>
            <div className="space-y-6">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <Users className="h-6 w-6 text-blue-600" />
                </div>
                <div className="ml-4">
                  <h3 className="text-xl font-semibold">You get one person, not an agency</h3>
                  <p className="text-gray-600">
                    The person who scopes the pilot is the person who builds it and tells you
                    whether it worked.
                  </p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <Bot className="h-6 w-6 text-blue-600" />
                </div>
                <div className="ml-4">
                  <h3 className="text-xl font-semibold">Your tools, not a new platform</h3>
                  <p className="text-gray-600">
                    Pilots are built into the email, diary and accounting software you already run.
                    Nothing here asks you to migrate your business.
                  </p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <Sparkles className="h-6 w-6 text-blue-600" />
                </div>
                <div className="ml-4">
                  <h3 className="text-xl font-semibold">A number agreed before we start</h3>
                  <p className="text-gray-600">
                    Hours back, jobs quoted, calls answered: one measure, chosen up front, checked at
                    30, 60 and 90 days.
                  </p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <Lightbulb className="h-6 w-6 text-blue-600" />
                </div>
                <div className="ml-4">
                  <h3 className="text-xl font-semibold">Permission to stop</h3>
                  <p className="text-gray-600">
                    If the pilot has not earned its keep by day 90, that is the finding, and you are
                    not signed up to anything further.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-blue-600 rounded-3xl p-12 text-center">
            <h2 className="text-3xl font-bold text-white mb-6">What would you hand over first?</h2>
            <p className="text-blue-100 mb-8 max-w-2xl mx-auto">
              Bring the job you would happily never do again. Thirty minutes, no charge, and an
              honest answer about whether AI is the right tool for it.
            </p>
            <button
              onClick={() => setIsModalOpen(true)}
              className="bg-white text-blue-600 px-8 py-3 rounded-full hover:bg-blue-50 transition-colors flex items-center mx-auto"
            >
              Book a free scoping call <ArrowRight className="ml-2 h-5 w-5" />
            </button>
          </div>
        </div>
      </section>

      {/* Contact Section. Every "#contact" link on the page lands here, and the
          button opens the same scoping-call form the other CTAs use. */}
      <section id="contact" className="py-20 scroll-mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Get in touch</h2>
            <p className="text-gray-600 mb-8">
              Tell Kevin what takes too long in your week. He replies within one business day, and
              will tell you if this is not worth your money.
            </p>
            <button
              onClick={() => setIsModalOpen(true)}
              className="bg-blue-600 text-white px-8 py-3 rounded-full hover:bg-blue-700 transition-colors inline-flex items-center"
            >
              Book a free scoping call <ArrowRight className="ml-2 h-5 w-5" />
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <div className="flex items-center">
                <Brain className="h-8 w-8 text-blue-400" />
                <span className="ml-2 text-xl font-bold">Smart Biz AI Hub</span>
              </div>
              <p className="mt-4 text-gray-400">
                AI pilots scoped for small businesses, measured at 30, 60 and 90 days.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">On this page</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#services" className="hover:text-white">How it works</a></li>
                <li><a href="#solutions" className="hover:text-white">Pilot ideas</a></li>
                <li><a href="#about" className="hover:text-white">Who runs it</a></li>
                <li><a href="#contact" className="hover:text-white">Contact</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">A Kevin Owens practice</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <a href="https://kevinowens.com?utm_source=smartbizaihub.com&utm_medium=referral&utm_campaign=family-strip" className="hover:text-white">
                    Kevin Owens &mdash; writing and advisory
                  </a>
                </li>
                <li>
                  <a href="https://enterpriseaistudio.com?utm_source=smartbizaihub.com&utm_medium=referral&utm_campaign=family-strip" className="hover:text-white">
                    Enterprise AI Studio &mdash; bigger builds
                  </a>
                </li>
                <li>
                  <a href="https://www.linkedin.com/in/kevinaowens" className="hover:text-white">
                    LinkedIn
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
            <p>&copy; {new Date().getFullYear()} Smart Biz AI Hub. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
