export default function Terms() {
  return (
    <div className="max-w-3xl mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">Terms of Service</h1>

      <div className="space-y-6">
        <section>
          <h2 className="text-xl font-semibold mb-4">1. Agreement to Terms</h2>
          <p className="text-muted-foreground">
            By accessing and using Prismy, you agree to be bound by these Terms of Service and our Privacy Policy. If you disagree with any part of these terms, you may not access our service.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-4">2. Intellectual Property</h2>
          <p className="text-muted-foreground">
            Prismy and its original content, features, and functionality are owned by Prismy and are protected by international copyright, trademark, patent, trade secret, and other intellectual property laws.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-4">3. User Accounts</h2>
          <div className="space-y-2 text-muted-foreground">
            <p>When you create an account with us, you must provide accurate information. You are responsible for:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Maintaining the security of your account</li>
              <li>All activities that occur under your account</li>
              <li>Ensuring your Spotify account credentials are protected</li>
            </ul>
          </div>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-4">4. Service Usage</h2>
          <div className="space-y-2 text-muted-foreground">
            <p>You agree not to use Prismy to:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Violate any applicable laws or regulations</li>
              <li>Infringe upon intellectual property rights</li>
              <li>Attempt to probe, scan, or test the vulnerability of our systems</li>
              <li>Interfere with or disrupt our services</li>
            </ul>
          </div>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-4">5. Third-Party Services</h2>
          <p className="text-muted-foreground">
            Our service integrates with Spotify's platform. Your use of Spotify's services through Prismy is subject to Spotify's own Terms of Service and Privacy Policy.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-4">6. Limitation of Liability</h2>
          <p className="text-muted-foreground">
            Prismy shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use or inability to use our service.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-4">7. Changes to Terms</h2>
          <p className="text-muted-foreground">
            We reserve the right to modify or replace these terms at any time. We will provide notice of any significant changes and update the "last modified" date.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-4">8. Contact</h2>
          <p className="text-muted-foreground">
            If you have any questions about these Terms, please contact us at:<br />
            Email: legal@prismy.app
          </p>
        </section>

        <p className="text-sm text-muted-foreground mt-8">
          Last modified: {new Date().toLocaleDateString()}
        </p>
      </div>
    </div>
  );
} 