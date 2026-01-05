import { neo } from "@castquest/neo-ux-core";
import Link from "next/link";

export default function DashboardNotFound() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className={`max-w-md p-8 rounded-lg border ${neo.colors.border.default} ${neo.colors.bg.secondary} text-center`}>
        <div className="text-6xl mb-4">🔍</div>
        <h2 className={`text-2xl font-bold ${neo.colors.text.primary} mb-2`}>
          Page Not Found
        </h2>
        <p className={`${neo.colors.text.secondary} mb-6`}>
          The dashboard page you're looking for doesn't exist or has been moved.
        </p>
        <Link
          href="/dashboard"
          className={`inline-block px-6 py-3 rounded-lg bg-gradient-to-r from-purple-500 to-cyan-500 text-white font-semibold hover:opacity-90 transition-all`}
        >
          Return to Dashboard
        </Link>
      </div>
    </div>
  );
}
