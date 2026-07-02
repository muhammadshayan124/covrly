import Link from "next/link";
import {
  Activity,
  ArrowRight,
  Building2,
  CreditCard,
  MessageSquare,
  ShieldCheck,
  Stethoscope,
  Utensils,
  Scissors,
  ShoppingBag,
  Zap,
} from "lucide-react";
import AnimatedHeadline from "@/components/marketing/AnimatedHeadline";
import EscalationDemo from "@/components/marketing/EscalationDemo";
import Nav from "@/components/marketing/Nav";
import Reveal from "@/components/marketing/Reveal";

const FEATURES = [
  {
    icon: Zap,
    title: "Priority escalation",
    description:
      "Offers go out one person at a time, in the order you set — no blasting the whole team at once.",
  },
  {
    icon: ShieldCheck,
    title: "No login for staff",
    description:
      "Each person gets a private link to respond. Nothing to remember, nothing to install.",
  },
  {
    icon: Activity,
    title: "Live activity feed",
    description:
      "See every offer, decline, and accept as it happens — no more guessing who's seen the message.",
  },
  {
    icon: Building2,
    title: "Built multi-tenant",
    description: "Every business gets its own isolated data from day one, not bolted on later.",
  },
  {
    icon: MessageSquare,
    title: "SMS-ready",
    description:
      "Runs on simulated texts out of the box, and switches to real SMS the moment you add a Twilio number.",
  },
  {
    icon: CreditCard,
    title: "Billing built in",
    description: "Stripe subscriptions wired up and ready — flip it on when you're ready to charge.",
  },
];

const STEPS = [
  {
    number: "01",
    title: "Someone calls out",
    description: "Mark the shift as needing coverage in a couple of clicks.",
  },
  {
    number: "02",
    title: "We text your staff",
    description: "One person at a time, in priority order, until someone says yes.",
  },
  {
    number: "03",
    title: "Shift covered",
    description: "You're notified the moment it's filled. No manual follow-up, ever.",
  },
];

const INDUSTRIES = [
  { icon: Utensils, label: "Restaurants" },
  { icon: ShoppingBag, label: "Retail" },
  { icon: Scissors, label: "Salons" },
  { icon: Stethoscope, label: "Clinics" },
];

export default function Home() {
  return (
    <div className="bg-black">
      <Nav />

      {/* Hero */}
      <section className="relative overflow-hidden pt-40 pb-28">
        <div className="pointer-events-none absolute inset-0 bg-grid [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_60%,transparent_100%)]" />
        <div className="pointer-events-none absolute -top-32 left-1/2 h-[32rem] w-[32rem] -translate-x-[60%] rounded-full bg-violet-600/25 blur-[110px] animate-blob" />
        <div className="pointer-events-none absolute top-0 right-1/2 h-[28rem] w-[28rem] translate-x-[70%] rounded-full bg-orange-500/20 blur-[110px] animate-blob-slow" />

        <div className="relative mx-auto flex max-w-4xl flex-col items-center px-6 text-center">
          <span className="rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs font-medium text-white/70">
            Built for teams that run on shifts
          </span>

          <AnimatedHeadline
            text="When someone calls out, Covrly finds a replacement for you"
            gradientWords={["replacement"]}
            className="mt-6 text-4xl font-semibold tracking-tight text-white sm:text-6xl"
          />

          <p className="mt-6 max-w-xl text-lg text-white/60">
            No group chats. No scrambling. Covrly texts your staff one at a time, in
            priority order, until the shift is covered — automatically.
          </p>

          <div className="mt-10 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/signup"
              className="group flex items-center justify-center gap-2 rounded-full bg-white px-7 py-3.5 font-semibold text-black transition-transform hover:scale-105"
            >
              Start free trial
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
            <a
              href="#how-it-works"
              className="flex items-center justify-center rounded-full border border-white/15 px-7 py-3.5 font-semibold text-white/90 transition-colors hover:bg-white/5"
            >
              See how it works
            </a>
          </div>
        </div>

        <div className="relative mx-auto mt-20 flex max-w-4xl justify-center px-6">
          <EscalationDemo />
        </div>
      </section>

      {/* Industries */}
      <section className="border-y border-white/10 bg-white/[0.02] py-8">
        <div className="mx-auto flex max-w-4xl flex-wrap items-center justify-center gap-x-12 gap-y-4 px-6 text-white/40">
          {INDUSTRIES.map(({ icon: Icon, label }) => (
            <div key={label} className="flex items-center gap-2 text-sm font-medium">
              <Icon className="h-4 w-4" />
              {label}
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="mx-auto max-w-5xl px-6 py-28">
        <Reveal className="text-center">
          <h2 className="text-3xl font-semibold text-white sm:text-4xl">How it works</h2>
          <p className="mt-3 text-white/60">Three steps, zero manual follow-up.</p>
        </Reveal>

        <div className="mt-16 grid gap-8 sm:grid-cols-3">
          {STEPS.map((step, i) => (
            <Reveal key={step.number} delay={i * 0.12}>
              <div className="relative rounded-2xl border border-white/10 bg-white/[0.03] p-6">
                <span className="text-gradient text-4xl font-bold">{step.number}</span>
                <h3 className="mt-4 text-lg font-semibold text-white">{step.title}</h3>
                <p className="mt-2 text-sm text-white/60">{step.description}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Features */}
      <section id="features" className="border-t border-white/10 bg-white/[0.02] py-28">
        <div className="mx-auto max-w-5xl px-6">
          <Reveal className="text-center">
            <h2 className="text-3xl font-semibold text-white sm:text-4xl">
              Everything a shift-based team needs
            </h2>
          </Reveal>

          <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {FEATURES.map(({ icon: Icon, title, description }, i) => (
              <Reveal key={title} delay={(i % 3) * 0.1}>
                <div className="group h-full rounded-2xl border border-white/10 bg-white/[0.03] p-6 transition-colors hover:border-white/20 hover:bg-white/[0.05]">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-violet-500/20 to-orange-400/20 text-violet-300">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="mt-4 font-semibold text-white">{title}</h3>
                  <p className="mt-2 text-sm text-white/60">{description}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="mx-auto max-w-4xl px-6 py-28">
        <Reveal className="text-center">
          <h2 className="text-3xl font-semibold text-white sm:text-4xl">Simple pricing</h2>
          <p className="mt-3 text-white/60">Start free. Upgrade when you&apos;re ready.</p>
        </Reveal>

        <div className="mt-16 grid gap-6 sm:grid-cols-2">
          <Reveal>
            <div className="h-full rounded-2xl border border-white/10 bg-white/[0.03] p-8">
              <h3 className="font-semibold text-white">Trial</h3>
              <p className="mt-2 text-3xl font-bold text-white">Free</p>
              <ul className="mt-6 flex flex-col gap-3 text-sm text-white/60">
                <li>Unlimited staff and shifts</li>
                <li>Full coverage-escalation engine</li>
                <li>Staff portal, no login required</li>
              </ul>
              <Link
                href="/signup"
                className="mt-8 block rounded-full border border-white/15 py-3 text-center font-semibold text-white transition-colors hover:bg-white/5"
              >
                Start free
              </Link>
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <div className="h-full rounded-2xl border border-violet-400/30 bg-gradient-to-b from-violet-500/10 to-transparent p-8">
              <h3 className="font-semibold text-white">Pro</h3>
              <p className="mt-2 text-3xl font-bold text-white">Custom pricing</p>
              <ul className="mt-6 flex flex-col gap-3 text-sm text-white/60">
                <li>Everything in Trial</li>
                <li>Real SMS via your own Twilio number</li>
                <li>Priority support</li>
              </ul>
              <Link
                href="/signup"
                className="mt-8 block rounded-full bg-white py-3 text-center font-semibold text-black transition-transform hover:scale-105"
              >
                Get started
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Final CTA */}
      <section className="relative overflow-hidden border-t border-white/10 py-24">
        <div className="pointer-events-none absolute inset-0 bg-grid opacity-40 [mask-image:radial-gradient(ellipse_50%_60%_at_50%_50%,#000_40%,transparent_100%)]" />
        <Reveal className="relative mx-auto max-w-2xl px-6 text-center">
          <h2 className="text-3xl font-semibold text-white sm:text-4xl">
            Stop scrambling when someone calls out
          </h2>
          <Link
            href="/signup"
            className="mt-8 inline-flex items-center gap-2 rounded-full bg-white px-7 py-3.5 font-semibold text-black transition-transform hover:scale-105"
          >
            Start your free trial
            <ArrowRight className="h-4 w-4" />
          </Link>
        </Reveal>
      </section>

      <footer className="border-t border-white/10 py-10">
        <div className="mx-auto flex max-w-5xl flex-col items-center justify-between gap-4 px-6 text-sm text-white/40 sm:flex-row">
          <span>© {new Date().getFullYear()} Covrly</span>
          <span>Built by Muhammad Shayan</span>
        </div>
      </footer>
    </div>
  );
}
