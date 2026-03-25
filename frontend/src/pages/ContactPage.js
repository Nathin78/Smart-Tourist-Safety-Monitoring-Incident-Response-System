import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  FiArrowLeft,
  FiMail,
  FiMapPin,
  FiMessageSquare,
  FiPhone,
  FiSend,
} from 'react-icons/fi';
import ThemeToggleButton from '../components/ThemeToggleButton';

const contactItems = [
  {
    icon: FiMail,
    title: 'Email',
    value: 'support@touristsafety.local',
    href: 'mailto:support@touristsafety.local',
  },
  {
    icon: FiPhone,
    title: 'Phone',
    value: '+91 98765 43210',
    href: 'tel:+919876543210',
  },
  {
    icon: FiMapPin,
    title: 'Office',
    value: 'Tourism Safety Operations',
    href: 'https://www.google.com/maps',
  },
];

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const subject = encodeURIComponent(formData.subject || 'Tourist Safety Inquiry');
    const body = encodeURIComponent(
      `Name: ${formData.name}\nEmail: ${formData.email}\n\n${formData.message}`
    );
    window.location.href = `mailto:support@touristsafety.local?subject=${subject}&body=${body}`;
  };

  return (
    <div className="min-h-screen text-[#343148]">
      <header className="mx-auto flex w-full max-w-7xl items-center justify-between px-4 py-5 sm:px-6 lg:px-8">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.35em] text-[#343148]/70">
            Smart Tourist Safety
          </p>
          <h1 className="text-2xl font-bold text-[#343148]">Contact Us</h1>
        </div>

        <nav className="hidden items-center gap-1 rounded-full border border-[#343148]/15 bg-white/65 px-2 py-2 shadow-sm md:flex">
          <Link
            to="/"
            className="rounded-full px-4 py-2 text-sm font-semibold text-[#343148]/75 transition hover:bg-[#efe4c8] hover:text-[#343148]"
          >
            Home
          </Link>
          <Link
            to="/about"
            className="rounded-full px-4 py-2 text-sm font-semibold text-[#343148]/75 transition hover:bg-[#efe4c8] hover:text-[#343148]"
          >
            About Us
          </Link>
          <Link
            to="/contact"
            className="rounded-full px-4 py-2 text-sm font-semibold text-[#343148] transition hover:bg-[#efe4c8]"
          >
            Contact
          </Link>
        </nav>

        <div className="flex items-center gap-3">
          <ThemeToggleButton />
          <Link
            to="/"
            className="inline-flex items-center gap-2 rounded-full border border-[#343148]/20 bg-[#f7f0df] px-5 py-2.5 text-sm font-semibold text-[#343148] transition hover:bg-[#efe4c8]"
          >
            <FiArrowLeft size={16} />
            Back Home
          </Link>
        </div>
      </header>

      <main className="mx-auto w-full max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
        <section className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="rounded-[2rem] border border-[#343148]/15 bg-[#343148] p-8 text-[#f7f0df] shadow-xl sm:p-10">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-semibold text-[#d7c49e]">
              <FiMessageSquare size={16} />
              Let&apos;s talk
            </div>

            <h2 className="mt-6 text-4xl font-bold leading-tight">
              Need help with the tourist safety platform?
            </h2>
            <p className="mt-5 text-base leading-7 text-[#f7f0df]/85">
              Reach out for product questions, onboarding support, or deployment help. For
              emergencies, use the SOS flow inside the app.
            </p>

            <div className="mt-8 space-y-4">
              {contactItems.map((item) => {
                const Icon = item.icon;
                return (
                  <a
                    key={item.title}
                    href={item.href}
                    className="flex items-center gap-4 rounded-2xl bg-white/10 p-4 transition hover:bg-white/15"
                  >
                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#d7c49e] text-[#343148]">
                      <Icon size={20} />
                    </div>
                    <div>
                      <div className="text-sm uppercase tracking-[0.2em] text-[#d7c49e]">
                        {item.title}
                      </div>
                      <div className="mt-1 font-semibold text-[#f7f0df]">{item.value}</div>
                    </div>
                  </a>
                );
              })}
            </div>
          </div>

          <div className="rounded-[2rem] border border-[#343148]/15 bg-[#f7f0df]/95 p-8 shadow-xl sm:p-10">
            <h2 className="text-3xl font-bold text-[#343148]">Send a message</h2>
            <p className="mt-3 text-sm leading-6 text-[#343148]/75">
              This opens your mail app with the details prefilled.
            </p>

            <form onSubmit={handleSubmit} className="mt-8 grid gap-5">
              <div className="grid gap-5 sm:grid-cols-2">
                <label className="grid gap-2">
                  <span className="text-sm font-semibold text-[#343148]">Name</span>
                  <input
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="rounded-2xl border border-[#343148]/20 bg-white px-4 py-3 text-[#343148] outline-none transition focus:border-[#343148]"
                    placeholder="Your name"
                    required
                  />
                </label>
                <label className="grid gap-2">
                  <span className="text-sm font-semibold text-[#343148]">Email</span>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="rounded-2xl border border-[#343148]/20 bg-white px-4 py-3 text-[#343148] outline-none transition focus:border-[#343148]"
                    placeholder="you@example.com"
                    required
                  />
                </label>
              </div>

              <label className="grid gap-2">
                <span className="text-sm font-semibold text-[#343148]">Subject</span>
                <input
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  className="rounded-2xl border border-[#343148]/20 bg-white px-4 py-3 text-[#343148] outline-none transition focus:border-[#343148]"
                  placeholder="How can we help?"
                />
              </label>

              <label className="grid gap-2">
                <span className="text-sm font-semibold text-[#343148]">Message</span>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows="7"
                  className="rounded-2xl border border-[#343148]/20 bg-white px-4 py-3 text-[#343148] outline-none transition focus:border-[#343148]"
                  placeholder="Tell us what you need."
                  required
                />
              </label>

              <button
                type="submit"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-[#343148] px-6 py-3 text-sm font-semibold text-[#f7f0df] shadow-lg transition hover:bg-[#272436]"
              >
                Send message
                <FiSend size={16} />
              </button>
            </form>
          </div>
        </section>
      </main>
    </div>
  );
};

export default ContactPage;
