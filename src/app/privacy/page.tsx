export default function Privacy() {
  return (
    <div className="max-w-3xl mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">Privacy Policy</h1>

      <div className="space-y-6">
        <section>
          <h2 className="text-xl font-semibold mb-4">1. Data Protection Overview</h2>
          <p className="text-muted-foreground">
            Prismy takes the protection of your personal data very seriously. We treat your personal data confidentially and in accordance with the statutory data protection regulations and this privacy policy.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-4">2. Data Collection</h2>
          <p className="text-muted-foreground mb-4">
            When using Prismy, we collect the following data:
          </p>
          <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
            <li>Spotify account information (when you sign in with Spotify)</li>
            <li>Your music preferences and listening history</li>
            <li>Usage data and analytics</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-4">3. GDPR Rights</h2>
          <p className="text-muted-foreground mb-4">
            Under GDPR, you have the following rights:
          </p>
          <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
            <li>Right to information</li>
            <li>Right to correction</li>
            <li>Right to deletion</li>
            <li>Right to data portability</li>
            <li>Right to revoke data protection consent</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-4">4. Data Storage</h2>
          <p className="text-muted-foreground">
            All data is stored on servers located in the European Union in compliance with GDPR regulations. We implement appropriate technical and organizational measures to ensure a level of security appropriate to the risk.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-4">5. Contact</h2>
          <p className="text-muted-foreground">
            If you have any questions about this Privacy Policy, please contact us at:<br />
            Email: privacy@prismy.app
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-4">6. Updates</h2>
          <p className="text-muted-foreground">
            We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "last updated" date.
          </p>
          <p className="text-sm text-muted-foreground mt-4">
            Last updated: {new Date().toLocaleDateString()}
          </p>
        </section>
      </div>
    </div>
  );
} 