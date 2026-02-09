export default function PrivacyPolicy() {
  const lastUpdated = "February 10, 2026";

  return (
    <div className="min-h-screen bg-base-100 py-16 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-linear-to-r from-primary to-secondary">
            Privacy Policy
          </h1>
          <p className="text-base-content/60">Last Updated: {lastUpdated}</p>
        </div>

        <div className="prose prose-lg max-w-none text-base-content/80 space-y-8">
          <section>
            <h2 className="text-2xl font-bold text-base-content mb-4 border-l-4 border-primary pl-4">
              1. Introduction
            </h2>
            <p>
              Greater Bogura Association ("GBA", "we", "us", or "our") respects
              your privacy and is committed to protecting the personal data we
              hold about you. This Privacy Policy explains how we collect, use,
              and safeguard your information when you visit our website or
              participate in our community.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-base-content mb-4 border-l-4 border-primary pl-4">
              2. Information We Collect
            </h2>
            <p>
              We may collect personal information that you voluntarily provide
              to us when you:
            </p>
            <ul className="list-disc pl-6 space-y-2 mt-2">
              <li>Register as a member of GBA.</li>
              <li>Sign up for our newsletter or event updates.</li>
              <li>Contact us through our website or email.</li>
              <li>Participate in community forums or events.</li>
            </ul>
            <p className="mt-4">
              The information we collect may include your name, email address,
              phone number, mailing address, and professional details.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-base-content mb-4 border-l-4 border-primary pl-4">
              3. How We Use Your Information
            </h2>
            <p>We use the collected information for various purposes:</p>
            <ul className="list-disc pl-6 space-y-2 mt-2">
              <li>To provide and maintain our community services.</li>
              <li>
                To notify you about upcoming events, news, and association
                updates.
              </li>
              <li>To respond to your inquiries and provide support.</li>
              <li>To improve our website and user experience.</li>
              <li>To comply with legal obligations.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-base-content mb-4 border-l-4 border-primary pl-4">
              4. Data Protection
            </h2>
            <p>
              We implement industry-standard security measures to maintain the
              safety of your personal information. However, no method of
              transmission over the internet or electronic storage is 100%
              secure, and we cannot guarantee absolute security.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-base-content mb-4 border-l-4 border-primary pl-4">
              5. Cookies and Tracking
            </h2>
            <p>
              Our website uses cookies to enhance your browsing experience.
              Cookies are small files stored on your device that help us analyze
              website traffic and remember your preferences. You can choose to
              disable cookies through your browser settings, but this may affect
              website functionality.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-base-content mb-4 border-l-4 border-primary pl-4">
              6. Third-Party Links
            </h2>
            <p>
              Our website may contain links to third-party sites. We are not
              responsible for the privacy practices or content of these external
              websites. We encourage you to review their privacy policies before
              providing any personal information.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-base-content mb-4 border-l-4 border-primary pl-4">
              7. Your Rights
            </h2>
            <p>
              You have the right to access, correct, or request the deletion of
              your personal information. If you wish to exercise these rights,
              please contact us at info@gba-org.com.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-base-content mb-4 border-l-4 border-primary pl-4">
              8. Changes to This Policy
            </h2>
            <p>
              We may update our Privacy Policy from time to time. We will notify
              you of any changes by posting the new policy on this page and
              updating the "Last Updated" date.
            </p>
          </section>

          <section className="bg-base-200 p-8 rounded-2xl border border-base-300 mt-12">
            <h2 className="text-xl font-bold mb-4">Contact Us</h2>
            <p>
              If you have any questions about this Privacy Policy, please
              contact us:
            </p>
            <div className="mt-4 space-y-1">
              <p>
                Email: <span className="text-primary">privacy@gba-org.com</span>
              </p>
              <p>Address: Greater Bogura Association, Bogura, Bangladesh</p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
