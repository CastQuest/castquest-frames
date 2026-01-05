import { neo } from "@castquest/neo-ux-core";

export default function TermsPage() {
  return (
    <div className="min-h-screen py-24 px-6">
      <div className="max-w-4xl mx-auto">
        <h1 className={`text-5xl font-bold ${neo.colors.text.primary} mb-8`}>
          Terms of Service
        </h1>
        
        <div className={`prose prose-invert max-w-none ${neo.colors.text.secondary}`}>
          <section className="mb-8">
            <h2 className={`text-2xl font-bold ${neo.colors.text.primary} mb-4`}>1. Acceptance of Terms</h2>
            <p>
              By accessing and using CastQuest, you accept and agree to be bound by the terms and provision of this agreement.
            </p>
          </section>

          <section className="mb-8">
            <h2 className={`text-2xl font-bold ${neo.colors.text.primary} mb-4`}>2. Use License</h2>
            <p>
              Permission is granted to temporarily use CastQuest for personal, non-commercial transitory viewing only.
            </p>
          </section>

          <section className="mb-8">
            <h2 className={`text-2xl font-bold ${neo.colors.text.primary} mb-4`}>3. Disclaimer</h2>
            <p>
              The materials on CastQuest are provided on an 'as is' basis. CastQuest makes no warranties, expressed or implied,
              and hereby disclaims and negates all other warranties including, without limitation, implied warranties or conditions
              of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.
            </p>
          </section>

          <section className="mb-8">
            <h2 className={`text-2xl font-bold ${neo.colors.text.primary} mb-4`}>4. Limitations</h2>
            <p>
              In no event shall CastQuest or its suppliers be liable for any damages (including, without limitation, damages for
              loss of data or profit, or due to business interruption) arising out of the use or inability to use CastQuest.
            </p>
          </section>

          <section className="mb-8">
            <h2 className={`text-2xl font-bold ${neo.colors.text.primary} mb-4`}>5. Revisions</h2>
            <p>
              CastQuest may revise these terms of service at any time without notice. By using this platform you are agreeing
              to be bound by the then current version of these terms of service.
            </p>
          </section>

          <div className={`mt-12 p-6 rounded-lg border ${neo.colors.border.default} ${neo.colors.bg.secondary}`}>
            <p className={`text-sm ${neo.colors.text.tertiary}`}>
              Last updated: January 2026
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
