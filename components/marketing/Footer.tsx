// components/marketing/Footer.tsx
"use client";

import Link from "next/link";
import Image from "next/image";
import { Shield, Twitter, Linkedin, Instagram, Facebook, Youtube } from "lucide-react";

const FOOTER_LINKS = {
  Products: [
    { label: "Savings account", href: "/savings"   },
    { label: "Checking account",href: "/checking"  },
    { label: "Credit cards",    href: "/cards"     },
    { label: "Personal loans",  href: "/loans"     },
    { label: "Mortgages",       href: "/loans"     },
    { label: "Investing",       href: "/investing" },
  ],
  Company: [
    { label: "About us",  href: "/#about"   },
    { label: "Careers",   href: "/careers"  },
    { label: "Press",     href: "/press"    },
    { label: "Blog",      href: "/blog"     },
    { label: "Partners",  href: "/partners" },
  ],
  Support: [
    { label: "Help centre",   href: "/help"     },
    { label: "Contact us",    href: "/#contact" },
    { label: "System status", href: "/status"   },
    { label: "Security",      href: "/security" },
    { label: "Report fraud",  href: "/fraud"    },
  ],
  Legal: [
    { label: "Privacy policy",    href: "/privacy"      },
    { label: "Terms of service",  href: "/terms"        },
    { label: "Cookie policy",     href: "/cookies"      },
    { label: "Accessibility",     href: "/accessibility"},
    { label: "Licences",          href: "/licences"     },
  ],
};

const SOCIALS = [
  { icon: <Twitter   className="w-4 h-4" />, href: "#", label: "Twitter"   },
  { icon: <Linkedin  className="w-4 h-4" />, href: "#", label: "LinkedIn"  },
  { icon: <Instagram className="w-4 h-4" />, href: "#", label: "Instagram" },
  { icon: <Facebook  className="w-4 h-4" />, href: "#", label: "Facebook"  },
  { icon: <Youtube   className="w-4 h-4" />, href: "#", label: "YouTube"   },
];

const TRUST_BADGES = [
  "FDIC Member",
  "Equal Housing Lender",
  "256-bit SSL",
  "SOC 2 Type II",
];

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-white">

      {/* Main footer grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-10">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 mb-12">

          {/* Brand column — spans 2 cols on large */}
          <div className="col-span-2 md:col-span-3 lg:col-span-2">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2.5 mb-4">
              <div className="w-9 h-9 rounded-xl overflow-hidden bg-blue-600 flex items-center justify-center">
                <Image
                  src="/images/logo.png"
                  alt="SecureBank"
                  width={36}
                  height={36}
                  className="object-cover"
                  onError={e => { (e.target as HTMLImageElement).style.display = "none"; }}
                />
              </div>
              <span className="font-bold text-xl">SecureBank</span>
            </Link>

            <p className="text-slate-400 text-sm leading-relaxed mb-6 max-w-xs">
              Modern banking built around you. Manage, grow, and protect your money — all from one secure place.
            </p>

            {/* Social links */}
            <div className="flex gap-2 mb-6">
              {SOCIALS.map(s => (
                
                  key={s.label}
                  href={s.href}
                  aria-label={s.label}
                  className="w-8 h-8 bg-white/5 hover:bg-white/15 border border-white/10 rounded-lg flex items-center justify-center text-slate-400 hover:text-white transition-all"
                >
                  {s.icon}
                </a>
              ))}
            </div>

            {/* App store badges */}
            <div className="flex gap-2">
              {["App Store", "Google Play"].map(store => (
                <div
                  key={store}
                  className="px-3 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-xs text-slate-300 cursor-pointer transition-colors"
                >
                  {store}
                </div>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(FOOTER_LINKS).map(([heading, links]) => (
            <div key={heading}>
              <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-4">
                {heading}
              </p>
              <ul className="space-y-3">
                {links.map(link => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-slate-400 hover:text-white transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Trust badges */}
        <div className="flex flex-wrap gap-2 mb-8 py-6 border-t border-white/10">
          {TRUST_BADGES.map(badge => (
            <div
              key={badge}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-white/5 border border-white/10 rounded-full"
            >
              <Shield className="w-3 h-3 text-blue-400" />
              <span className="text-xs text-slate-300 font-medium">{badge}</span>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-6 border-t border-white/10">
          <p className="text-slate-500 text-xs text-center sm:text-left">
            © {new Date().getFullYear()} SecureBank, N.A. All rights reserved.
            Member FDIC. Equal Housing Lender.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            {["Privacy", "Terms", "Cookies", "Sitemap"].map(l => (
              <Link
                key={l}
                href="#"
                className="text-slate-500 hover:text-slate-300 text-xs transition-colors"
              >
                {l}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}