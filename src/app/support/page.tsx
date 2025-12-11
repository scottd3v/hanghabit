import Link from "next/link";
import { GlassCard } from "@/components";

export const metadata = {
  title: "Support - scottd3v",
  description: "Get help and support for scottd3v projects.",
};

export default function Support() {
  return (
    <div className="min-h-screen bg-gradient-subtle">
      {/* Back Navigation */}
      <header className="px-6 pt-8 pb-4">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-blue-400 hover:text-blue-300 transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          <span className="text-sm font-medium">Back</span>
        </Link>
      </header>

      <main className="px-6 pb-12">
        <div className="max-w-2xl">
          <h1 className="text-3xl font-bold text-white mb-2">Support</h1>
          <p className="text-zinc-400 mb-8">How can we help?</p>

          {/* Contact Options */}
          <div className="grid gap-4 mb-10">
            <a href="mailto:scottd3v@gmail.com">
              <GlassCard
                icon={<span className="text-2xl">&#x2709;&#xFE0F;</span>}
                title="Email Support"
                subtitle="scottd3v@gmail.com"
                size="wide"
              />
            </a>
          </div>

          {/* App-specific support links */}
          <h2 className="text-xl font-semibold text-white mb-4">
            App Support
          </h2>
          <div className="glass p-6 space-y-4">
            <a
              href="https://hanghabit.com/support"
              className="block p-4 rounded-lg border border-zinc-700 hover:border-zinc-600 transition-colors"
            >
              <h3 className="text-lg font-medium text-white mb-1">
                Hang Habit
              </h3>
              <p className="text-zinc-400 text-sm">
                Support for the dead hang tracker iOS & Apple Watch app
              </p>
            </a>
          </div>
        </div>
      </main>
    </div>
  );
}
