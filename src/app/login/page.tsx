"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useActionState } from "react";
import EscalationDemo from "@/components/marketing/EscalationDemo";
import { loginAction, type LoginState } from "./actions";

const initialState: LoginState = {};

export default function LoginPage() {
  const [state, formAction, pending] = useActionState(loginAction, initialState);

  return (
    <div className="flex flex-1 bg-black">
      <div className="flex w-full flex-col items-center justify-center px-6 py-16 lg:w-1/2">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="w-full max-w-sm"
        >
          <Link href="/" className="flex items-center gap-2 font-semibold text-white">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-violet-500 to-orange-400 text-sm font-bold text-white">
              C
            </span>
            Covrly
          </Link>

          <h1 className="mt-8 text-2xl font-semibold text-white">Log in</h1>

          <form action={formAction} className="mt-6 flex flex-col gap-3">
            <input
              name="email"
              type="email"
              required
              placeholder="Email"
              className="rounded-xl border border-white/10 bg-white/[0.03] px-4 py-2.5 text-white placeholder-white/30 outline-none transition-colors focus:border-violet-400/50"
            />
            <input
              name="password"
              type="password"
              required
              placeholder="Password"
              className="rounded-xl border border-white/10 bg-white/[0.03] px-4 py-2.5 text-white placeholder-white/30 outline-none transition-colors focus:border-violet-400/50"
            />

            {state.error && (
              <p className="rounded-lg bg-red-500/10 px-3 py-2 text-sm text-red-300 ring-1 ring-red-500/20">
                {state.error}
              </p>
            )}

            <button
              type="submit"
              disabled={pending}
              className="mt-2 rounded-full bg-white py-2.5 font-semibold text-black transition-transform hover:scale-[1.02] disabled:opacity-50 disabled:hover:scale-100"
            >
              {pending ? "Logging in…" : "Log in"}
            </button>
          </form>

          <p className="mt-4 text-sm text-white/50">
            Don&apos;t have an account?{" "}
            <Link href="/signup" className="font-medium text-white underline underline-offset-4">
              Sign up
            </Link>
          </p>
        </motion.div>
      </div>

      <div className="relative hidden w-1/2 items-center justify-center overflow-hidden border-l border-white/10 bg-white/[0.02] lg:flex">
        <div className="pointer-events-none absolute inset-0 bg-grid opacity-30" />
        <div className="pointer-events-none absolute -bottom-24 left-0 h-96 w-96 rounded-full bg-orange-500/20 blur-[100px] animate-blob-slow" />
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="relative"
        >
          <EscalationDemo />
        </motion.div>
      </div>
    </div>
  );
}
