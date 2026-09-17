import React, { useState } from 'react';
import { Brain, Building2, Code2, MessageSquareCode, ChevronRight, ArrowRight, Users, Sparkles, Bot, BarChart3, Search, ShieldCheck, Workflow, Store, Factory, Briefcase, HeartHandshake, Lightbulb, Trophy, GraduationCap, Target, Globe2, X } from 'lucide-react';

function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    phone: '',
    projectDescription: '',
    budget: '',
    timeline: 'immediate',
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
        setStatusMessage("Thanks - your request is in. We'll be in touch shortly.");
        setFormData({
          name: '',
          email: '',
          company: '',
          phone: '',
          projectDescription: '',
          budget: '',
          timeline: 'immediate',
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
                <h2 className="text-2xl font-bold text-gray-900">Schedule a Demo</h2>
                <button 
                  onClick={() => setIsModalOpen(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
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
                    Full Name *
                  </label>
                  <input
                    required
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="John Doe"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    Business Email *
                  </label>
                  <input
                    required
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="john@company.com"
                  />
                </div>
                <div>
                  <label htmlFor="company" className="block text-sm font-medium text-gray-700 mb-2">
                    Company Name *
                  </label>
                  <input
                    required
                    type="text"
                    id="company"
                    name="company"
                    value={formData.company}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Company Inc."
                  />
                </div>
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="+1 (555) 000-0000"
                  />
                </div>
              </div>
              
              <div>
                <label htmlFor="projectDescription" className="block text-sm font-medium text-gray-700 mb-2">
                  Project Description *
                </label>
                <textarea
                  required
                  id="projectDescription"
                  name="projectDescription"
                  value={formData.projectDescription}
                  onChange={handleInputChange}
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Please describe your project and what you're looking to achieve..."
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="budget" className="block text-sm font-medium text-gray-700 mb-2">
                    Budget Range
                  </label>
                  <select
                    id="budget"
                    name="budget"
                    value={formData.budget}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Select a range</option>
                    <option value="10k-25k">$10,000 - $25,000</option>
                    <option value="25k-50k">$25,000 - $50,000</option>
                    <option value="50k-100k">$50,000 - $100,000</option>
                    <option value="100k+">$100,000+</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="timeline" className="block text-sm font-medium text-gray-700 mb-2">
                    Project Timeline
                  </label>
                  <select
                    id="timeline"
                    name="timeline"
                    value={formData.timeline}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="immediate">Immediate</option>
                    <option value="1-3months">1-3 months</option>
                    <option value="3-6months">3-6 months</option>
                    <option value="6months+">6+ months</option>
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
                  {status === 'sending' ? 'Sending...' : 'Submit Request'}
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
              <a href="#services" className="text-gray-600 hover:text-blue-600">Services</a>
              <a href="#solutions" className="text-gray-600 hover:text-blue-600">Solutions</a>
              <a href="#about" className="text-gray-600 hover:text-blue-600">About</a>
              <a href="#contact" className="text-gray-600 hover:text-blue-600">Contact</a>
            </div>
            <button className="bg-blue-600 text-white px-6 py-2 rounded-full hover:bg-blue-700 transition-colors">
              Get Started
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 bg-gradient-to-br from-blue-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-5xl font-bold text-gray-900 mb-6">
              Transform Your Business with <span className="text-blue-600">AI Innovation</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Empowering enterprises with cutting-edge AI solutions. We help businesses leverage artificial intelligence to drive growth, efficiency, and innovation.
            </p>
            <div className="flex justify-center gap-4">
              <button 
                onClick={() => setIsModalOpen(true)}
                className="bg-blue-600 text-white px-8 py-3 rounded-full hover:bg-blue-700 transition-colors flex items-center"
              >
                Schedule a Demo <ChevronRight className="ml-2 h-5 w-5" />
              </button>
              <button className="border border-gray-300 text-gray-700 px-8 py-3 rounded-full hover:bg-gray-50 transition-colors">
                Learn More
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">Our Services</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-2xl shadow-sm border hover:shadow-md transition-shadow">
              <MessageSquareCode className="h-12 w-12 text-blue-600 mb-4" />
              <h3 className="text-xl font-semibold mb-3">AI Consulting</h3>
              <p className="text-gray-600">Strategic guidance on AI implementation and digital transformation for your business.</p>
            </div>
            <div className="bg-white p-8 rounded-2xl shadow-sm border hover:shadow-md transition-shadow">
              <Code2 className="h-12 w-12 text-blue-600 mb-4" />
              <h3 className="text-xl font-semibold mb-3">Custom AI Solutions</h3>
              <p className="text-gray-600">Tailored AI applications and software development for your specific industry needs.</p>
            </div>
            <div className="bg-white p-8 rounded-2xl shadow-sm border hover:shadow-md transition-shadow">
              <Building2 className="h-12 w-12 text-blue-600 mb-4" />
              <h3 className="text-xl font-semibold mb-3">Enterprise Integration</h3>
              <p className="text-gray-600">Seamless integration of AI technologies into your existing business infrastructure.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Solutions Section */}
      <section id="solutions" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">AI Solutions Packages</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Choose from our range of specialized AI solutions designed to meet specific business needs and industry requirements.
            </p>
          </div>
          
          {/* Enterprise Solutions */}
          <div className="mb-16">
            <h3 className="text-2xl font-bold mb-8 text-blue-600">Enterprise Solutions</h3>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
                <Bot className="h-10 w-10 text-blue-600 mb-4" />
                <h4 className="text-xl font-semibold mb-3">AI Assistant Suite</h4>
                <p className="text-gray-600 mb-4">Custom AI assistants for customer service, sales, and internal operations.</p>
                <ul className="text-sm text-gray-500 space-y-2">
                  <li>• 24/7 Customer Support Automation</li>
                  <li>• Sales Pipeline Automation</li>
                  <li>• Internal Knowledge Base AI</li>
                </ul>
              </div>
              <div className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
                <BarChart3 className="h-10 w-10 text-blue-600 mb-4" />
                <h4 className="text-xl font-semibold mb-3">Predictive Analytics</h4>
                <p className="text-gray-600 mb-4">Data-driven insights for better business decisions.</p>
                <ul className="text-sm text-gray-500 space-y-2">
                  <li>• Market Trend Analysis</li>
                  <li>• Revenue Forecasting</li>
                  <li>• Risk Assessment Models</li>
                </ul>
              </div>
              <div className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
                <Search className="h-10 w-10 text-blue-600 mb-4" />
                <h4 className="text-xl font-semibold mb-3">Document Intelligence</h4>
                <p className="text-gray-600 mb-4">Smart document processing and analysis.</p>
                <ul className="text-sm text-gray-500 space-y-2">
                  <li>• Automated Document Processing</li>
                  <li>• Contract Analysis</li>
                  <li>• Compliance Monitoring</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Industry-Specific Solutions */}
          <div className="mb-16">
            <h3 className="text-2xl font-bold mb-8 text-blue-600">Industry Solutions</h3>
            <div className="grid md:grid-cols-4 gap-6">
              <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                <Store className="h-8 w-8 text-blue-600 mb-3" />
                <h4 className="text-lg font-semibold mb-2">Retail AI</h4>
                <p className="text-sm text-gray-600">Inventory optimization and customer behavior analysis.</p>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                <Factory className="h-8 w-8 text-blue-600 mb-3" />
                <h4 className="text-lg font-semibold mb-2">Manufacturing AI</h4>
                <p className="text-sm text-gray-600">Predictive maintenance and quality control.</p>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                <Briefcase className="h-8 w-8 text-blue-600 mb-3" />
                <h4 className="text-lg font-semibold mb-2">Financial Services</h4>
                <p className="text-sm text-gray-600">Risk analysis and fraud detection systems.</p>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                <HeartHandshake className="h-8 w-8 text-blue-600 mb-3" />
                <h4 className="text-lg font-semibold mb-2">Healthcare AI</h4>
                <p className="text-sm text-gray-600">Patient care optimization and medical analysis.</p>
              </div>
            </div>
          </div>

          {/* Innovation Lab */}
          <div>
            <h3 className="text-2xl font-bold mb-8 text-blue-600">Innovation Lab</h3>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
                <Workflow className="h-10 w-10 text-blue-600 mb-4" />
                <h4 className="text-xl font-semibold mb-3">Process Automation</h4>
                <p className="text-gray-600">End-to-end automation solutions for business processes using advanced AI.</p>
                <ul className="text-sm text-gray-500 mt-4 space-y-2">
                  <li>• Workflow Optimization</li>
                  <li>• Task Automation</li>
                  <li>• Integration Services</li>
                </ul>
              </div>
              <div className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
                <Lightbulb className="h-10 w-10 text-blue-600 mb-4" />
                <h4 className="text-xl font-semibold mb-3">Custom R&D Projects</h4>
                <p className="text-gray-600">Specialized AI research and development for unique business challenges.</p>
                <ul className="text-sm text-gray-500 mt-4 space-y-2">
                  <li>• Proof of Concept Development</li>
                  <li>• AI Model Training</li>
                  <li>• Performance Optimization</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Leadership</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Led by industry veterans with a proven track record in technology innovation and business transformation.
            </p>
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
                <p className="text-blue-600 font-semibold mb-4">Founder & CEO</p>
              </div>
            </div>

            <div className="space-y-8">
              <div>
                <h4 className="text-xl font-semibold mb-4 flex items-center">
                  <Trophy className="h-6 w-6 text-blue-600 mr-2" />
                  Professional Background
                </h4>
                <p className="text-gray-600 mb-4">
                  A seasoned technology leader with over 20 years of experience in software development, enterprise architecture, and digital transformation. Expertise in building and scaling technology teams and delivering innovative solutions for Fortune 500 companies.
                </p>
              </div>

              <div>
                <h4 className="text-xl font-semibold mb-4 flex items-center">
                  <GraduationCap className="h-6 w-6 text-blue-600 mr-2" />
                  Education & Expertise
                </h4>
                <ul className="text-gray-600 space-y-2">
                  <li>• BS in Computer Science from University of Maryland</li>
                  <li>• AWS Certified Solutions Architect</li>
                  <li>• Expert in Cloud Architecture and AI Integration</li>
                  <li>• Specialized in Enterprise Digital Transformation</li>
                </ul>
              </div>

              <div>
                <h4 className="text-xl font-semibold mb-4 flex items-center">
                  <Target className="h-6 w-6 text-blue-600 mr-2" />
                  Key Achievements
                </h4>
                <ul className="text-gray-600 space-y-2">
                  <li>• Led digital transformation initiatives for major enterprises</li>
                  <li>• Developed innovative AI solutions for business automation</li>
                  <li>• Built and managed high-performing technology teams</li>
                  <li>• Successfully delivered complex enterprise projects</li>
                </ul>
              </div>

              <div>
                <h4 className="text-xl font-semibold mb-4 flex items-center">
                  <Globe2 className="h-6 w-6 text-blue-600 mr-2" />
                  Industry Impact
                </h4>
                <p className="text-gray-600">
                  Recognized thought leader in AI and digital transformation, with a proven track record of helping businesses leverage technology for competitive advantage. Regular speaker at technology conferences and industry events.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6">Why Choose Smart Biz AI Hub?</h2>
              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <Sparkles className="h-6 w-6 text-blue-600" />
                  </div>
                  <div className="ml-4">
                    <h3 className="text-xl font-semibold">Cutting-edge Technology</h3>
                    <p className="text-gray-600">Access to the latest AI and machine learning innovations</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <Users className="h-6 w-6 text-blue-600" />
                  </div>
                  <div className="ml-4">
                    <h3 className="text-xl font-semibold">Expert Team</h3>
                    <p className="text-gray-600">Experienced AI specialists and developers</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <ShieldCheck className="h-6 w-6 text-blue-600" />
                  </div>
                  <div className="ml-4">
                    <h3 className="text-xl font-semibold">Enterprise Security</h3>
                    <p className="text-gray-600">Bank-grade security and data protection standards</p>
                  </div>
                </div>
              </div>
            </div>
            <div>
              <img 
                src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80" 
                alt="Team collaboration" 
                className="rounded-2xl shadow-lg"
              />
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-blue-600 rounded-3xl p-12 text-center">
            <h2 className="text-3xl font-bold text-white mb-6">Ready to Transform Your Business?</h2>
            <p className="text-blue-100 mb-8 max-w-2xl mx-auto">
              Let's discuss how AI can drive growth and innovation for your organization.
            </p>
            <button 
              onClick={() => setIsModalOpen(true)}
              className="bg-white text-blue-600 px-8 py-3 rounded-full hover:bg-blue-50 transition-colors flex items-center mx-auto"
            >
              Contact Us Today <ArrowRight className="ml-2 h-5 w-5" />
            </button>
          </div>
        </div>
      </section>

      {/* Contact Section. Every "#contact" link on the page lands here, and the
          button opens the same demo form the other CTAs use. */}
      <section id="contact" className="py-20 scroll-mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Get in Touch</h2>
            <p className="text-gray-600 mb-8">
              Tell us what you're trying to build and we'll follow up to set up a demo.
            </p>
            <button
              onClick={() => setIsModalOpen(true)}
              className="bg-blue-600 text-white px-8 py-3 rounded-full hover:bg-blue-700 transition-colors inline-flex items-center"
            >
              Schedule a Demo <ArrowRight className="ml-2 h-5 w-5" />
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center">
                <Brain className="h-8 w-8 text-blue-400" />
                <span className="ml-2 text-xl font-bold">Smart Biz AI Hub</span>
              </div>
              <p className="mt-4 text-gray-400">
                Empowering businesses through AI innovation
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Services</h3>
              <ul className="space-y-2 text-gray-400">
                <li>AI Consulting</li>
                <li>Custom Solutions</li>
                <li>Enterprise Integration</li>
                <li>Digital Transformation</li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Company</h3>
              <ul className="space-y-2 text-gray-400">
                <li>About Us</li>
                <li>Careers</li>
                <li>Blog</li>
                <li>Contact</li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Connect</h3>
              <ul className="space-y-2 text-gray-400">
                <li>LinkedIn</li>
                <li>Twitter</li>
                <li>Facebook</li>
                <li>Instagram</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
            <p>&copy; 2025 Smart Biz AI Hub. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
