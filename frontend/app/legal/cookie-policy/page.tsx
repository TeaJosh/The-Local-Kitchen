"use client";

import { Section, SubSection } from "@/components/section";

export default function CookiePolicy() {
  // Reusable margins
  const sectionMargin = { marginTop: "20px", marginBottom: "20px" }; // space between sections
  const paragraphMargin = { marginTop: "5px", marginBottom: "5px" }; // spacing for paragraphs
  const listMargin = { marginTop: "2px", marginBottom: "2px" }; // spacing for lists

  return (
    <div className="flex justify-center">
      <div className="max-w-4xl px-6 py-16">
        {/* Page Title */}
        <h1 className="text-4xl md:text-5xl font-bold mb-12 text-center">
          Cookie & Tracking Policy
        </h1>

        <section>
          {/* 1. What Are Cookies */}
          <div style={sectionMargin}>
            <Section title="1. What Are Cookies?">
              <p style={paragraphMargin}>
                Cookies are small text files stored on your device when you
                visit our website. They help us provide a better experience by
                remembering your preferences, login status, and site
                interactions.
              </p>
            </Section>
          </div>

          {/* 2. Cookies We Use */}
          <div style={sectionMargin}>
            <Section title="2. Cookies We Use">
              <SubSection subtitle="Essential Cookies">
                <p style={paragraphMargin}>
                  Required for the site to function. These handle login
                  sessions, shopping cart data, and security features. Essential
                  cookies cannot be disabled.
                </p>
                <ul style={listMargin} className="list-disc list-inside ml-6">
                  <li>Login sessions</li>
                  <li>Order processing</li>
                  <li>Site functionality</li>
                </ul>
              </SubSection>

              <SubSection subtitle="Functional Cookies">
                <p style={paragraphMargin}>
                  Help remember your preferences and enhance user experience,
                  such as language settings and recently viewed restaurants.
                </p>
              </SubSection>

              <SubSection subtitle="Analytics Cookies">
                <p style={paragraphMargin}>
                  Help us understand how visitors use our site, including pages
                  visited, time spent, and errors encountered. Data is
                  aggregated and anonymous, used to improve the platform.
                </p>
              </SubSection>
            </Section>
          </div>

          {/* 3. Third-Party Cookies */}
          <div style={sectionMargin}>
            <Section title="3. Third-Party Services">
              <p style={paragraphMargin}>
                We may use third-party services for analytics (e.g., Google
                Analytics) and payment processing. These third parties may set
                cookies according to their own privacy policies.
              </p>
            </Section>
          </div>

          {/* 4. Managing Cookies */}
          <div style={sectionMargin}>
            <Section title="4. Managing Cookies">
              <p style={paragraphMargin}>
                You can control cookies through your browser settings. Please
                note that blocking essential cookies may affect site
                functionality. Most browsers allow you to:
              </p>
              <ul style={listMargin} className="list-disc list-inside ml-6">
                <li>View what cookies are stored on your device</li>
                <li>Delete cookies individually or all at once</li>
                <li>Block cookies from specific websites or all sites</li>
              </ul>
            </Section>
          </div>

          {/* 5. Do Not Track */}
          <div style={sectionMargin}>
            <Section title="5. Do Not Track">
              <p style={paragraphMargin}>
                Our site respects Do Not Track (DNT) browser settings. When DNT
                is enabled, we limit analytics tracking accordingly.
              </p>
            </Section>
          </div>

          {/* 6. Data Retention */}
          <div style={sectionMargin}>
            <Section title="6. Data Retention">
              <p style={paragraphMargin}>
                Session cookies are deleted when you close your browser.
                Persistent cookies remain on your device for a set period or
                until you delete them. Analytics data is retained in aggregated
                form for up to 26 months.
              </p>
            </Section>
          </div>

          {/* 7. Updates to This Policy */}
          <div style={sectionMargin}>
            <Section title="7. Updates to This Policy">
              <p style={paragraphMargin}>
                We may update this Cookie Policy as our services evolve.
                Significant changes will be communicated through our website.
                Continued use of the site means you accept the updated policy.
                We encourage you to review this policy periodically.
              </p>
            </Section>
          </div>

          {/* 8. Contact Information */}
          <div style={sectionMargin}>
            <Section title="8. Contact Us">
              <p style={paragraphMargin}>
                If you have questions about our use of cookies or this policy,
                please contact us at:{" "}
                <span className="font-medium">[Insert Email]</span>
              </p>
            </Section>
          </div>
        </section>

        {/* Footer */}
        <p className="text-sm text-gray-500 mb-12">Last Updated: [Date]</p>
      </div>
    </div>
  );
}
