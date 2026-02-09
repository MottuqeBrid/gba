export default function TermsOfService() {
  const lastUpdated = "February 10, 2026";

  return (
    <div className="min-h-screen bg-base-100 py-16 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-linear-to-r from-secondary to-primary">
            Terms of Service
          </h1>
          <p className="text-base-content/60">Last Updated: {lastUpdated}</p>
        </div>

        <div className="prose prose-lg max-w-none text-base-content/80 space-y-8">
          <section>
            <h2 className="text-2xl font-bold text-base-content mb-4 border-l-4 border-secondary pl-4">
              1. Acceptance of Terms
            </h2>
            <p>
              By accessing and using this website, you agree to comply with and
              be bound by these Terms of Service. If you do not agree to these
              terms, please refrain from using our website and services. These
              terms apply to all visitors, members, and others who access or use
              the Service.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-base-content mb-4 border-l-4 border-secondary pl-4">
              2. Use of the Site
            </h2>
            <p>
              The content provided on this website is for general information
              and community networking purposes only. You agree to use the site
              legally and responsibly. Any unauthorized use of the site or its
              content may give rise to a claim for damages or be a criminal
              offense.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-base-content mb-4 border-l-4 border-secondary pl-4">
              3. Membership & Accounts
            </h2>
            <p>
              If you create an account or register as a member of GBA, you are
              responsible for maintaining the confidentiality of your account
              credentials and for all activities that occur under your account.
              You must provide accurate and complete information during
              registration.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-base-content mb-4 border-l-4 border-secondary pl-4">
              4. User Conduct
            </h2>
            <p>As a user of our services, you agree not to:</p>
            <ul className="list-disc pl-6 space-y-2 mt-2">
              <li>
                Post or transmit any content that is unlawful, harmful, or
                offensive.
              </li>
              <li>Impersonate any person or entity.</li>
              <li>
                Attempt to gain unauthorized access to our systems or user
                accounts.
              </li>
              <li>
                Use the site for any commercial solicitation purposes without
                our prior consent.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-base-content mb-4 border-l-4 border-secondary pl-4">
              5. Intellectual Property
            </h2>
            <p>
              This website contains material which is owned by or licensed to
              GBA. This includes, but is not limited to, the design, layout,
              look, appearance, and graphics. Reproduction is prohibited other
              than in accordance with the copyright notice, which forms part of
              these terms.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-base-content mb-4 border-l-4 border-secondary pl-4">
              6. Limitation of Liability
            </h2>
            <p>
              GBA shall not be liable for any direct, indirect, incidental, or
              consequential damages resulting from the use or inability to use
              our services, or for any content obtained through the website.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-base-content mb-4 border-l-4 border-secondary pl-4">
              7. Termination
            </h2>
            <p>
              We reserve the right to terminate or suspend access to our Service
              immediately, without prior notice or liability, for any reason
              whatsoever, including without limitation if you breach the Terms.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-base-content mb-4 border-l-4 border-secondary pl-4">
              8. Governing Law
            </h2>
            <p>
              These Terms shall be governed and construed in accordance with the
              laws of Bangladesh, without regard to its conflict of law
              provisions.
            </p>
          </section>

          <section className="bg-base-200 p-8 rounded-2xl border border-base-300 mt-12">
            <h2 className="text-xl font-bold mb-4">Questions?</h2>
            <p>
              If you have any questions regarding these Terms of Service, please
              reach out to our legal department:
            </p>
            <div className="mt-4 space-y-1">
              <p>
                Email: <span className="text-secondary">terms@gba-org.com</span>
              </p>
              <p>Phone: +880 17XX-XXXXXX</p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
