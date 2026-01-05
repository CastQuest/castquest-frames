import { neo } from "@castquest/neo-ux-core";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen py-24 px-6">
      <div className="max-w-4xl mx-auto">
        <h1 className={`text-5xl font-bold ${neo.colors.text.primary} mb-8`}>
          Privacy Policy
        </h1>
        
        <div className={`prose prose-invert max-w-none ${neo.colors.text.secondary}`}>
          <section className="mb-8">
            <h2 className={`text-2xl font-bold ${neo.colors.text.primary} mb-4`}>1. Information We Collect</h2>
            <p>
              CastQuest collects information you provide directly to us when you create an account, use our services,
              or communicate with us. This includes wallet addresses, frame content, and interaction data.
            </p>
          </section>

          <section className="mb-8">
            <h2 className={`text-2xl font-bold ${neo.colors.text.primary} mb-4`}>2. How We Use Your Information</h2>
            <p>
              We use the information we collect to provide, maintain, and improve our services, to develop new features,
              and to protect CastQuest and our users. We also use this information to communicate with you about
              products, services, offers, and events.
            </p>
          </section>

          <section className="mb-8">
            <h2 className={`text-2xl font-bold ${neo.colors.text.primary} mb-4`}>3. Information Sharing</h2>
            <p>
              We do not share your personal information with companies, organizations, or individuals outside of CastQuest
              except in the following cases: with your consent, for legal reasons, or to protect rights and safety.
            </p>
          </section>

          <section className="mb-8">
            <h2 className={`text-2xl font-bold ${neo.colors.text.primary} mb-4`}>4. Data Security</h2>
            <p>
              We work hard to protect CastQuest and our users from unauthorized access to or unauthorized alteration,
              disclosure, or destruction of information we hold. We use industry-standard encryption and security practices.
            </p>
          </section>

          <section className="mb-8">
            <h2 className={`text-2xl font-bold ${neo.colors.text.primary} mb-4`}>5. Your Rights</h2>
            <p>
              You have the right to access, update, or delete your personal information at any time. You can also opt out
              of certain data collection practices. Contact us to exercise these rights.
            </p>
          </section>

          <section className="mb-8">
            <h2 className={`text-2xl font-bold ${neo.colors.text.primary} mb-4`}>6. Changes to This Policy</h2>
            <p>
              We may change this privacy policy from time to time. If we make changes, we will notify you by revising
              the date at the top of the policy and, in some cases, provide additional notice.
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
