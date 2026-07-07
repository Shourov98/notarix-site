import { Facebook, Linkedin, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-[#f8f9fa] pt-16 pb-8 px-6 text-[#475569] border-t border-zinc-200">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          {/* Logo & Description */}
          <div className="md:col-span-1">
            <Link href="/" className="mb-4 inline-flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#eef4ff] ring-1 ring-[#dbe6ff] shadow-sm shrink-0">
                <Image
                  src="/logo.svg"
                  alt="Notarix"
                  width={30}
                  height={30}
                  className="h-8 w-8 object-contain"
                  priority
                />
              </div>
              <Image
                src="/text_2.svg"
                alt="Notarix"
                width={140}
                height={41}
                className="h-8 w-auto object-contain"
                priority
              />
            </Link>
            <p className="text-sm leading-relaxed mb-6">
              Building the future of legal digital identity and document verification with precision and authority.
            </p>
            <div className="flex gap-4">
              <a
                href="https://www.linkedin.com/company/notarix"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Notarix on LinkedIn"
                className="text-zinc-700 hover:text-black transition-colors border border-zinc-300 rounded-md p-1.5 flex items-center justify-center"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect width="4" height="12" x="2" y="9"/><circle cx="4" cy="4" r="2"/></svg>
              </a>
              <a
                href="mailto:hello@notarix.live"
                aria-label="Email Notarix"
                className="text-zinc-700 hover:text-black transition-colors border border-zinc-300 rounded-md p-1.5 flex items-center justify-center"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
              </a>
            </div>
          </div>

          {/* Resources */}
          <div>
            <h3 className="font-bold text-xs uppercase tracking-wider text-zinc-900 mb-4">Resources</h3>
            <ul className="space-y-3 text-sm">
              <li><Link href="/legal-validity" className="hover:text-zinc-900 transition-colors">Legal Validity</Link></li>
              <li><Link href="/security" className="hover:text-zinc-900 transition-colors">Security</Link></li>
              <li><Link href="/contact" className="hover:text-zinc-900 transition-colors">Contact Support</Link></li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="font-bold text-xs uppercase tracking-wider text-zinc-900 mb-4">Company</h3>
            <ul className="space-y-3 text-sm">
              <li><Link href="/trust" className="hover:text-zinc-900 transition-colors">About</Link></li>
              <li><Link href="/trust" className="hover:text-zinc-900 transition-colors">Trust Center</Link></li>
              <li><Link href="/contact" className="hover:text-zinc-900 transition-colors">Contact</Link></li>
              <li><Link href="/security" className="hover:text-zinc-900 transition-colors">Privacy Policy</Link></li>
              <li><Link href="/terms-of-use" className="hover:text-zinc-900 transition-colors">Terms of Service</Link></li>
            </ul>
          </div>

          {/* Newsletter */}
          <div className="md:col-span-1">
            <h3 className="font-bold text-xs uppercase tracking-wider text-zinc-900 mb-4">Newsletter</h3>
            <p className="text-sm mb-4">Stay updated with legal tech trends.</p>
            <form
              className="flex h-10"
              onSubmit={(event) => {
                event.preventDefault();
                const input = event.currentTarget.querySelector("input[type='email']");
                const email = input?.value?.trim();
                if (!email) return;
                input.value = "";
                window.alert(
                  `Thanks! We've noted ${email} for future product updates. (Newsletter delivery is not yet active.)`
                );
              }}
            >
              <input
                type="email"
                placeholder="Email"
                required
                className="flex-1 px-3 py-2 border border-zinc-300 rounded-l-md focus:outline-none focus:ring-1 focus:ring-[#1a4fdb] focus:border-[#1a4fdb] bg-white text-sm"
              />
              <button
                type="submit"
                className="bg-[#1a4fdb] text-white px-5 rounded-r-md font-medium text-sm hover:bg-[#1541b8] transition-colors"
              >
                Join
              </button>
            </form>
          </div>
        </div>

        {/* Copyright */}
        <div className="pt-8 border-t border-zinc-200 text-center text-sm text-gray-700">
          © 2026 Notarix™ Technologies Inc. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
