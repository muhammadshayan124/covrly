"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Check, X } from "lucide-react";
import { useEffect, useState } from "react";

type Step = {
  key: string;
  kind: "outbound" | "declined" | "accepted" | "covered";
  name: string;
  text: string;
};

const STEPS: Step[] = [
  {
    key: "offer-alex",
    kind: "outbound",
    name: "Alex",
    text: "Coverage needed: Server shift, Sat 6–10pm. Reply if you can cover it.",
  },
  { key: "decline-alex", kind: "declined", name: "Alex", text: "Can't make it" },
  {
    key: "offer-sam",
    kind: "outbound",
    name: "Sam",
    text: "Coverage needed: Server shift, Sat 6–10pm. Reply if you can cover it.",
  },
  { key: "accept-sam", kind: "accepted", name: "Sam", text: "I can cover it!" },
  { key: "covered", kind: "covered", name: "", text: "Shift covered — Sam is confirmed" },
];

const STEP_DURATION_MS = 1700;

export default function EscalationDemo() {
  const [visibleCount, setVisibleCount] = useState(1);

  useEffect(() => {
    const interval = setInterval(() => {
      setVisibleCount((count) => (count >= STEPS.length ? 1 : count + 1));
    }, STEP_DURATION_MS);
    return () => clearInterval(interval);
  }, []);

  const visibleSteps = STEPS.slice(0, visibleCount);

  return (
    <div className="relative w-full max-w-sm rounded-3xl border border-white/10 bg-white/[0.03] p-5 shadow-2xl shadow-violet-950/40 backdrop-blur-xl">
      <div className="flex items-center gap-2 border-b border-white/10 pb-3">
        <span className="h-2.5 w-2.5 rounded-full bg-red-400/70" />
        <span className="h-2.5 w-2.5 rounded-full bg-amber-400/70" />
        <span className="h-2.5 w-2.5 rounded-full bg-emerald-400/70" />
        <span className="ml-2 text-xs font-medium text-white/40">Coverage — Server shift</span>
      </div>

      <div className="mt-4 flex min-h-[280px] flex-col justify-end gap-2.5">
        <AnimatePresence initial={false} mode="popLayout">
          {visibleSteps.map((step) => (
            <motion.div
              key={`${step.key}-${visibleCount}`}
              layout
              initial={{ opacity: 0, y: 10, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.35, ease: "easeOut" }}
            >
              {step.kind === "outbound" && (
                <div className="flex flex-col gap-1">
                  <span className="text-[11px] font-medium text-white/40">To {step.name}</span>
                  <div className="max-w-[85%] rounded-2xl rounded-tl-sm bg-white/10 px-3.5 py-2.5 text-sm text-white/90">
                    {step.text}
                  </div>
                </div>
              )}
              {(step.kind === "declined" || step.kind === "accepted") && (
                <div className="flex flex-col items-end gap-1">
                  <span className="text-[11px] font-medium text-white/40">{step.name}</span>
                  <div
                    className={`flex max-w-[85%] items-center gap-1.5 rounded-2xl rounded-tr-sm px-3.5 py-2.5 text-sm font-medium ${
                      step.kind === "accepted"
                        ? "bg-emerald-500/20 text-emerald-300"
                        : "bg-white/5 text-white/50"
                    }`}
                  >
                    {step.kind === "accepted" ? (
                      <Check className="h-3.5 w-3.5 shrink-0" />
                    ) : (
                      <X className="h-3.5 w-3.5 shrink-0" />
                    )}
                    {step.text}
                  </div>
                </div>
              )}
              {step.kind === "covered" && (
                <div className="mt-1 flex items-center justify-center gap-1.5 rounded-full bg-emerald-500/15 px-3 py-1.5 text-center text-xs font-semibold text-emerald-300 ring-1 ring-emerald-400/30">
                  <Check className="h-3.5 w-3.5" />
                  {step.text}
                </div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
