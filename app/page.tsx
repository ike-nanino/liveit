// app/page.tsx
"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { motion, AnimatePresence, useInView } from "framer-motion";
import {
  Shield, Zap, Globe, Star, ArrowRight, Check,
  TrendingUp, Lock, Smartphone, CreditCard,
  PiggyBank, BarChart3, HeadphonesIcon, ChevronDown,
  BadgeCheck, Award, Users, DollarSign,
   Play,
} from "lucide-react";
import Navbar from "@/components/marketing/Navbar";
import Footer from "@/components/marketing/Footer";

// ─── Animated counter ─────────────────────────────────────────────────────────

function CountUp({ end, prefix = "", suffix = "", duration = 2000 }: {
  end: number; prefix?: string; suffix?: string; duration?: number;
}) {
  const [count, setCount] = useState(0);
  const ref    = useRef(null);
  const inView = useInView(ref, { once: true });

  useEffect(() => {
    if (!inView) return;
    let start   = 0;
    const step  = end / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= end) { setCount(end); clearInterval(timer); return; }
      setCount(Math.floor(start));
    }, 16);
    return () => clearInterval(timer);
  }, [inView, end, duration]);

  return <span ref={ref}>{prefix}{count.toLocaleString()}{suffix}</span>;
}

// ─── Fade-in on scroll ────────────────────────────────────────────────────────

function FadeIn({ children, delay = 0, className = "" }: {
  children: React.ReactNode; delay?: number; className?: string;
}) {
  const ref    = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 28 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.55, delay, ease: "easeOut" }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// ─── Section label ────────────────────────────────────────────────────────────

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-block text-xs font-bold text-blue-600 uppercase tracking-widest mb-3">
      {children}
    </span>
  );
}

// ─── Hero ─────────────────────────────────────────────────────────────────────

function Hero() {
  const words  = ["Smarter.", "Faster.", "Safer.", "Simpler."];
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setIdx(i => (i + 1) % words.length), 2200);
    return () => clearInterval(t);
  }, []);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900">

      {/* Grid overlay */}
      <div className="absolute inset-0 opacity-[0.07]" style={{
        backgroundImage: "linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)",
        backgroundSize: "64px 64px",
      }} />

      {/* Glow orbs */}
      <div className="absolute top-1/3 left-1/4 w-[480px] h-[480px] bg-blue-600/20 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[360px] h-[360px] bg-indigo-500/15 rounded-full blur-[80px] pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32 text-center">

        {/* Trust pill */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="inline-flex items-center gap-2 bg-white/5 border border-white/10 backdrop-blur-sm text-blue-300 text-xs font-medium px-4 py-2 rounded-full mb-10"
        >
          <BadgeCheck className="w-3.5 h-3.5" />
          Trusted by 2M+ customers · FDIC Insured · 256-bit Encryption
        </motion.div>

        {/* Headline */}
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h1 className="text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-extrabold text-white leading-[1.05] tracking-tight mb-4">
            Banking made{" "}
            <br className="hidden sm:block" />
            <AnimatePresence mode="wait">
              <motion.span
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400 inline-block"
              >
                {words[idx]}
              </motion.span>
            </AnimatePresence>
          </h1>
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="text-slate-400 text-lg sm:text-xl max-w-2xl mx-auto mb-10 leading-relaxed"
        >
          SecureBank gives you the power to manage, grow, and protect your
          money — all from one beautifully simple dashboard.
          Open an account in minutes. No paperwork. No branch visit.
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="flex flex-col sm:flex-row gap-3 justify-center mb-20"
        >
          <Link
            href="/sign-in"
            className="inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-bold px-8 py-4 rounded-2xl text-sm transition-all hover:shadow-2xl hover:shadow-blue-500/30 group"
          >
            Open a free account
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
          <button className="inline-flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 text-white font-medium px-8 py-4 rounded-2xl text-sm transition-all backdrop-blur-sm group">
            <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center group-hover:bg-white/30 transition-colors">
              <Play className="w-3 h-3 fill-white ml-0.5" />
            </div>
            Watch demo
          </button>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.65 }}
          className="grid grid-cols-2 sm:grid-cols-4 gap-px bg-white/10 rounded-2xl overflow-hidden max-w-3xl mx-auto border border-white/10"
        >
          {[
            { value: 2,    suffix: "M+",  label: "Customers",        prefix: "" },
            { value: 99.9, suffix: "%",   label: "Uptime SLA",       prefix: "" },
            { value: 4.9,  suffix: "★",   label: "App Store rating", prefix: "" },
            { value: 150,  suffix: "+",   label: "Countries",        prefix: "" },
          ].map((s, i) => (
            <div key={i} className="bg-white/5 backdrop-blur-sm px-6 py-5 text-center">
              <p className="text-2xl sm:text-3xl font-extrabold text-white">
                <CountUp end={s.value} suffix={s.suffix} prefix={s.prefix} />
              </p>
              <p className="text-xs text-slate-400 mt-1">{s.label}</p>
            </div>
          ))}
        </motion.div>

        {/* Scroll cue */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <motion.div animate={{ y: [0, 8, 0] }} transition={{ duration: 1.6, repeat: Infinity }}>
            <ChevronDown className="w-5 h-5 text-white/30" />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

// ─── Features ─────────────────────────────────────────────────────────────────

function Features() {
  const features = [
    { icon: <Zap className="w-5 h-5" />,        color: "bg-amber-100  text-amber-600",  title: "Instant transfers",    desc: "Send money in seconds — domestic, international, or peer-to-peer. No delays, no excuses."        },
    { icon: <Shield className="w-5 h-5" />,      color: "bg-blue-100   text-blue-600",   title: "Bank-grade security",  desc: "256-bit encryption, biometric login, 2FA, and real-time fraud detection on every account."      },
    { icon: <TrendingUp className="w-5 h-5" />,  color: "bg-green-100  text-green-600",  title: "Smart investing",      desc: "Access stocks, ETFs, and crypto from $1. Our robo-advisor builds and rebalances automatically." },
    { icon: <Smartphone className="w-5 h-5" />,  color: "bg-purple-100 text-purple-600", title: "Mobile-first banking", desc: "Full banking power in your pocket. Deposit checks, pay bills, freeze cards — anywhere."            },
    { icon: <Globe className="w-5 h-5" />,       color: "bg-teal-100   text-teal-600",   title: "Global reach",         desc: "Multi-currency accounts, real exchange rates, and ATM access in 150+ countries worldwide."      },
    { icon: <BarChart3 className="w-5 h-5" />,   color: "bg-rose-100   text-rose-600",   title: "Spending insights",    desc: "AI-powered analytics that track spending, flag waste, and help you hit your savings goals."      },
  ];

  return (
    <section id="features" className="py-28 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <FadeIn className="text-center mb-16">
          <SectionLabel>Features</SectionLabel>
          <h2 className="text-4xl sm:text-5xl font-extrabold text-slate-900 mb-4 tracking-tight">
            Everything you need.<br />Nothing you don&apos;t.
          </h2>
          <p className="text-slate-500 text-lg max-w-xl mx-auto">
            We built SecureBank to be the only banking app you&apos;ll ever need.
          </p>
        </FadeIn>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map((f, i) => (
            <FadeIn key={f.title} delay={i * 0.07}>
              <div className="bg-white rounded-2xl p-6 border border-slate-200 hover:border-blue-200 hover:shadow-lg hover:shadow-blue-50/80 transition-all group h-full cursor-default">
                <div className={`w-11 h-11 rounded-2xl ${f.color} flex items-center justify-center mb-5 group-hover:scale-110 transition-transform`}>
                  {f.icon}
                </div>
                <h3 className="font-bold text-slate-900 mb-2 text-base">{f.title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{f.desc}</p>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Products showcase ────────────────────────────────────────────────────────

function Products() {
  const [active, setActive] = useState(0);

  const products = [
    {
      icon:  <PiggyBank  className="w-5 h-5" />,
      tab:   "Savings",
      title: "High-yield savings that actually earns",
      desc:  "Earn up to 4.65% APY — 10× the national average. No minimum balance, no monthly fees, and your money is always accessible.",
      perks: ["4.65% APY guaranteed", "No minimum balance", "FDIC insured to $250K", "Instant access anytime"],
      stat:  { value: "4.65%", label: "APY — 10× national average" },
      gradient: "from-emerald-500 to-teal-600",
      accentBg: "bg-emerald-600",
    },
    {
      icon:  <CreditCard className="w-5 h-5" />,
      tab:   "Cards",
      title: "Rewards on every single purchase",
      desc:  "Our Platinum Visa gives you 3% cash back on dining, 2% groceries, 1% everything else — with zero annual fee and zero foreign transaction fees.",
      perks: ["Up to 3% cash back", "No annual fee", "Zero foreign transaction fees", "Virtual card for online safety"],
      stat:  { value: "3%",    label: "Cash back on dining" },
      gradient: "from-blue-500 to-indigo-600",
      accentBg: "bg-blue-600",
    },
    {
      icon:  <TrendingUp className="w-5 h-5" />,
      tab:   "Investing",
      title: "Invest from $1 with zero commission",
      desc:  "Access stocks, ETFs, index funds, and crypto. Our robo-advisor builds and rebalances your portfolio automatically based on your risk profile.",
      perks: ["$0 commission trades", "Fractional shares from $1", "Auto-rebalancing portfolio", "Real-time market data"],
      stat:  { value: "$0",    label: "Commission on every trade" },
      gradient: "from-purple-500 to-pink-600",
      accentBg: "bg-purple-600",
    },
    {
      icon:  <DollarSign className="w-5 h-5" />,
      tab:   "Loans",
      title: "Flexible loans at rates you deserve",
      desc:  "Personal loans, mortgages, and auto loans with same-day decisions. Rates start at 8.9% APR with no prepayment penalties.",
      perks: ["APR from 8.9%", "Same-day decisions", "No prepayment penalty", "Dedicated loan advisor"],
      stat:  { value: "8.9%",  label: "Starting APR" },
      gradient: "from-amber-500 to-orange-600",
      accentBg: "bg-amber-600",
    },
  ];

  const p = products[active];

  return (
    <section id="products" className="py-28 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <FadeIn className="text-center mb-14">
          <SectionLabel>Products</SectionLabel>
          <h2 className="text-4xl sm:text-5xl font-extrabold text-slate-900 tracking-tight mb-4">
            One bank, every financial need
          </h2>
          <p className="text-slate-500 text-lg max-w-xl mx-auto">
            From your first paycheck to your retirement — we have a product built for every stage.
          </p>
        </FadeIn>

        {/* Tabs */}
        <div className="flex justify-center gap-2 mb-12 flex-wrap">
          {products.map((prod, i) => (
            <button
              key={prod.tab}
              onClick={() => setActive(i)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                active === i
                  ? "bg-slate-900 text-white shadow-lg scale-105"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {prod.icon}
              {prod.tab}
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={active}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.28 }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center"
          >
            {/* Text side */}
            <div>
              <h3 className="text-3xl font-extrabold text-slate-900 mb-4 leading-tight">{p.title}</h3>
              <p className="text-slate-500 text-lg mb-8 leading-relaxed">{p.desc}</p>
              <ul className="space-y-3 mb-8">
                {p.perks.map(perk => (
                  <li key={perk} className="flex items-center gap-3">
                    <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center shrink-0">
                      <Check className="w-3 h-3 text-green-600" />
                    </div>
                    <span className="text-slate-700 font-medium text-sm">{perk}</span>
                  </li>
                ))}
              </ul>
              <Link
                href="/sign-in"
                className="inline-flex items-center gap-2 bg-slate-900 hover:bg-slate-700 text-white px-6 py-3 rounded-xl text-sm font-bold transition-all group"
              >
                Get started free
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

            {/* Visual card */}
            <div className={`bg-gradient-to-br ${p.gradient} rounded-3xl p-8 text-white min-h-[300px] flex flex-col justify-between relative overflow-hidden`}>
              {/* Background decoration */}
              <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
              <div className="absolute bottom-0 left-0 w-32 h-32 bg-black/10 rounded-full translate-y-1/2 -translate-x-1/2" />

              <div className="relative z-10">
                <div className="flex justify-between items-start mb-8">
                  <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
                    {p.icon}
                  </div>
                  <span className="text-white/60 text-sm font-medium">{p.tab}</span>
                </div>
                <div className="mb-6">
                  <p className="text-white/70 text-sm mb-1">{p.stat.label}</p>
                  <p className="text-6xl font-extrabold tracking-tight">{p.stat.value}</p>
                </div>
              </div>

              <div className="relative z-10 flex flex-wrap gap-2">
                {p.perks.map(perk => (
                  <span key={perk} className="text-xs bg-white/10 border border-white/20 backdrop-blur-sm px-3 py-1.5 rounded-full font-medium">
                    {perk}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}

// ─── Pricing ──────────────────────────────────────────────────────────────────

function Pricing() {
  const [annual, setAnnual] = useState(true);

  const plans = [
    {
      name:  "Basic",
      price: { monthly: 0,  annual: 0  },
      desc:  "Perfect for everyday banking",
      perks: ["Checking & savings account", "Debit card included", "Mobile banking app", "2 free wire transfers/mo", "Email support"],
      cta:   "Get started free",
      highlight: false,
    },
    {
      name:  "Premium",
      price: { monthly: 9,  annual: 7  },
      desc:  "For those who want more",
      perks: ["Everything in Basic", "4.65% APY savings", "Unlimited wire transfers", "Virtual cards", "Priority phone support", "Investment account"],
      cta:   "Start 30-day trial",
      highlight: true,
    },
    {
      name:  "Business",
      price: { monthly: 29, annual: 22 },
      desc:  "Built for growing businesses",
      perks: ["Everything in Premium", "Business checking", "Multi-user access (5 seats)", "Expense management", "Payroll integration", "Dedicated manager"],
      cta:   "Contact sales",
      highlight: false,
    },
  ];

  return (
    <section id="pricing" className="py-28 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <FadeIn className="text-center mb-14">
          <SectionLabel>Pricing</SectionLabel>
          <h2 className="text-4xl sm:text-5xl font-extrabold text-slate-900 tracking-tight mb-4">
            Simple, transparent pricing
          </h2>
          <p className="text-slate-500 text-lg mb-8">No hidden fees. No surprises. Cancel any time.</p>

          {/* Toggle */}
          <div className="inline-flex items-center bg-white border border-slate-200 rounded-xl p-1 shadow-sm">
            <button
              onClick={() => setAnnual(false)}
              className={`px-5 py-2.5 rounded-lg text-sm font-semibold transition-all ${!annual ? "bg-slate-900 text-white shadow" : "text-slate-500 hover:text-slate-700"}`}
            >
              Monthly
            </button>
            <button
              onClick={() => setAnnual(true)}
              className={`px-5 py-2.5 rounded-lg text-sm font-semibold transition-all flex items-center gap-2 ${annual ? "bg-slate-900 text-white shadow" : "text-slate-500 hover:text-slate-700"}`}
            >
              Annual
              <span className="text-[10px] bg-green-500 text-white px-1.5 py-0.5 rounded-full font-bold">-20%</span>
            </button>
          </div>
        </FadeIn>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {plans.map((plan, i) => (
            <FadeIn key={plan.name} delay={i * 0.1}>
              <div className={`relative rounded-2xl p-7 h-full flex flex-col ${
                plan.highlight
                  ? "bg-slate-900 text-white ring-2 ring-blue-500 shadow-2xl shadow-blue-500/10 scale-[1.02]"
                  : "bg-white border border-slate-200"
              }`}>
                {plan.highlight && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                    <span className="bg-blue-600 text-white text-xs font-bold px-4 py-1.5 rounded-full shadow-lg">
                      Most popular
                    </span>
                  </div>
                )}

                <div className="mb-6">
                  <p className={`text-xs font-bold uppercase tracking-widest mb-2 ${plan.highlight ? "text-blue-400" : "text-blue-600"}`}>
                    {plan.name}
                  </p>
                  <div className="flex items-baseline gap-1 mb-1">
                    <AnimatePresence mode="wait">
                      <motion.span
                        key={annual ? "annual" : "monthly"}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8 }}
                        className={`text-5xl font-extrabold ${plan.highlight ? "text-white" : "text-slate-900"}`}
                      >
                        ${annual ? plan.price.annual : plan.price.monthly}
                      </motion.span>
                    </AnimatePresence>
                    <span className={`text-sm ${plan.highlight ? "text-white/40" : "text-slate-400"}`}>/mo</span>
                  </div>
                  <p className={`text-sm ${plan.highlight ? "text-white/50" : "text-slate-500"}`}>{plan.desc}</p>
                </div>

                <ul className="space-y-3 flex-1 mb-8">
                  {plan.perks.map(perk => (
                    <li key={perk} className="flex items-start gap-2.5 text-sm">
                      <div className={`w-4 h-4 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${plan.highlight ? "bg-blue-500/20" : "bg-green-100"}`}>
                        <Check className={`w-2.5 h-2.5 ${plan.highlight ? "text-blue-300" : "text-green-600"}`} />
                      </div>
                      <span className={plan.highlight ? "text-white/70" : "text-slate-600"}>{perk}</span>
                    </li>
                  ))}
                </ul>

                <Link
                  href="/sign-in"
                  className={`w-full py-3.5 text-center rounded-xl text-sm font-bold transition-all ${
                    plan.highlight
                      ? "bg-blue-600 hover:bg-blue-500 text-white"
                      : "bg-slate-100 hover:bg-slate-200 text-slate-800"
                  }`}
                >
                  {plan.cta}
                </Link>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Testimonials ─────────────────────────────────────────────────────────────

function Testimonials() {
  const reviews = [
    { name: "Sarah K.",  role: "Small business owner", rating: 5, text: "Switched from my old bank after 12 years. The transfer speeds and savings rate alone are worth it — wish I'd done it sooner." },
    { name: "Marcus T.", role: "Freelance designer",    rating: 5, text: "Managing multiple currencies used to be a nightmare. SecureBank makes it effortless with real rates and absolutely zero fees." },
    { name: "Priya M.",  role: "Software engineer",     rating: 5, text: "Started investing with $50 in fractional shares. The robo-advisor built me a properly diversified portfolio automatically." },
    { name: "James O.",  role: "Retired teacher",       rating: 5, text: "4.65% APY is genuinely unbeatable. My money actually grows now instead of sitting in an account earning next to nothing." },
    { name: "Elena R.",  role: "Marketing director",    rating: 5, text: "The spending insights showed me I was burning $400/mo on forgotten subscriptions. Saved me money in the first week." },
    { name: "David L.",  role: "E-commerce seller",     rating: 5, text: "The business account and multi-user access are incredible. My whole team uses it and the expense management is seamless." },
  ];

  return (
    <section className="py-28 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <FadeIn className="text-center mb-16">
          <SectionLabel>Testimonials</SectionLabel>
          <h2 className="text-4xl sm:text-5xl font-extrabold text-slate-900 tracking-tight mb-4">
            Loved by over 2 million customers
          </h2>
          <div className="flex items-center justify-center gap-1 mb-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star key={i} className="w-5 h-5 text-amber-400 fill-amber-400" />
            ))}
            <span className="text-slate-500 text-sm ml-2 font-medium">
              4.9 · 142,000+ verified reviews
            </span>
          </div>
        </FadeIn>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {reviews.map((r, i) => (
            <FadeIn key={r.name} delay={i * 0.07}>
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 hover:border-blue-200 hover:shadow-lg hover:shadow-blue-50 transition-all h-full">
                <div className="flex gap-0.5 mb-4">
                  {Array.from({ length: r.rating }).map((_, j) => (
                    <Star key={j} className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                  ))}
                </div>
                <p className="text-slate-700 text-sm leading-relaxed mb-5">&rdquo;{r.text}&rdquo;</p>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-xs font-bold shrink-0">
                    {r.name.charAt(0)}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-800">{r.name}</p>
                    <p className="text-xs text-slate-400">{r.role}</p>
                  </div>
                </div>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Trust bar ────────────────────────────────────────────────────────────────

function TrustBar() {
  const items = [
    { icon: <Shield className="w-5 h-5 text-blue-400"  />, label: "FDIC Insured",           sub: "Up to $250,000 per depositor"  },
    { icon: <Lock   className="w-5 h-5 text-green-400" />, label: "256-bit Encryption",     sub: "Bank-grade security always on" },
    { icon: <Award  className="w-5 h-5 text-amber-400" />, label: "Best Digital Bank 2024", sub: "Forbes, NerdWallet & Bankrate" },
    { icon: <Users  className="w-5 h-5 text-purple-400"/>, label: "2M+ Customers",          sub: "And growing every single day"  },
    { icon: <HeadphonesIcon className="w-5 h-5 text-rose-400" />, label: "24/7 Live Support", sub: "Real humans, not just chatbots" },
  ];

  return (
    <section className="py-16 bg-slate-900 border-y border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-8">
          {items.map((item, i) => (
            <FadeIn key={item.label} delay={i * 0.08}>
              <div className="flex flex-col items-center text-center gap-2.5">
                <div className="w-12 h-12 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center">
                  {item.icon}
                </div>
                <div>
                  <p className="text-white text-sm font-bold">{item.label}</p>
                  <p className="text-slate-400 text-xs mt-0.5">{item.sub}</p>
                </div>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── FAQ ──────────────────────────────────────────────────────────────────────

function FAQ() {
  const [open, setOpen] = useState<number | null>(null);

  const faqs = [
    { q: "Is SecureBank a real FDIC-insured bank?",          a: "Yes. SecureBank is a federally chartered bank, FDIC-insured up to $250,000 per depositor. Your deposits are protected by the full faith of the US government — the same protection as any major bank." },
    { q: "How long does it take to open an account?",        a: "Most accounts are fully open in under 5 minutes. You'll need a government-issued ID and your Social Security number. There's no paperwork and no branch visit required." },
    { q: "Are there any monthly or hidden fees?",            a: "Our Basic plan is completely free — no monthly fees, no minimum balance, no surprises. Premium and Business plans have a flat monthly fee with a free 30-day trial." },
    { q: "How does the 4.65% APY savings rate work?",        a: "Your entire savings balance earns 4.65% APY, compounded daily and credited to your account monthly. There are no rate tiers and no minimum balance — everyone earns the same rate from dollar one." },
    { q: "What happens to my money if SecureBank closes?",   a: "All deposits are FDIC-insured up to $250,000 per depositor. Beyond that, SecureBank maintains capital reserves significantly above the regulatory minimum as an additional layer of protection." },
    { q: "Can I use SecureBank outside the United States?",  a: "Yes. Our debit and credit cards work in 150+ countries with no foreign transaction fees. International wire transfers are available to 80+ countries with real mid-market exchange rates." },
  ];

  return (
    <section id="about" className="py-28 bg-white">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <FadeIn className="text-center mb-14">
          <SectionLabel>FAQ</SectionLabel>
          <h2 className="text-4xl sm:text-5xl font-extrabold text-slate-900 tracking-tight mb-4">
            Honest answers
          </h2>
          <p className="text-slate-500 text-lg">Everything you need to know before you open an account.</p>
        </FadeIn>

        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <FadeIn key={i} delay={i * 0.05}>
              <div className="bg-slate-50 border border-slate-200 rounded-2xl overflow-hidden hover:border-slate-300 transition-colors">
                <button
                  onClick={() => setOpen(open === i ? null : i)}
                  className="w-full flex items-center justify-between px-5 py-4 text-left gap-4"
                >
                  <span className="text-sm font-bold text-slate-800">{faq.q}</span>
                  <motion.div animate={{ rotate: open === i ? 180 : 0 }} transition={{ duration: 0.2 }} className="shrink-0">
                    <ChevronDown className="w-4 h-4 text-slate-400" />
                  </motion.div>
                </button>
                <AnimatePresence>
                  {open === i && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.22 }}
                      className="overflow-hidden"
                    >
                      <p className="px-5 pb-5 text-sm text-slate-500 leading-relaxed border-t border-slate-200 pt-4">
                        {faq.a}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}


// ─── Page assembly ────────────────────────────────────────────────────────────

export default function HomePage() {
  return (
    <main className="overflow-x-hidden">
      <Navbar />
      <Hero />
      <Features />
      <Products />
      <Pricing />
      <Testimonials />
      <TrustBar />
      <FAQ />
      <Footer />
    </main>
  );
}