"use client";

import { Section, SubSection } from "@/components/section";

export default function PrivacyPolicy() {
  // Reusable margins
  const sectionMargin = { marginTop: "20px", marginBottom: "20px" }; // space between sections
  const paragraphMargin = { marginTop: "5px", marginBottom: "5px" }; // spacing for paragraphs
  const listMargin = { marginTop: "2px", marginBottom: "2px" }; // spacing for lists

  return (
    <div className="flex justify-center">
      <div className="max-w-3xl px-6 py-16">
        {/* Page Title */}
        <h1 className="text-3xl md:text-4xl font-bold mb-4 text-center">
          Privacy Policy
        </h1>

        {/* Intro */}
        <p style={paragraphMargin} className="text-left">
          This Privacy Policy explains how The Neighborhood Kitchen collects,
          uses, and protects your information.
        </p>

        <section>
          <div style={sectionMargin}>
            <Section title="1. Information We Collect">
              <SubSection subtitle="A. Information You Provide">
                <ul
                  style={listMargin}
                  className="list-disc list-inside ml-6 space-y-1 text-left"
                >
                  <li>Name</li>
                  <li>Email Address</li>
                  <li>Account Login Information</li>
                  <li>Reviews and Blog Posts</li>
                  <li>Order Details</li>
                </ul>
              </SubSection>

              <SubSection subtitle="B. Automatically Collected Information">
                <ul
                  style={listMargin}
                  className="list-disc list-inside ml-6 space-y-1 text-left"
                >
                  <li>IP Address</li>
                  <li>Browser Type</li>
                  <li>Device Information</li>
                  <li>Pages Visited</li>
                </ul>
              </SubSection>
            </Section>
          </div>

          <div style={sectionMargin}>
            <Section title="2. How We Use Information">
              <p style={paragraphMargin} className="text-left">
                We use your information to:
              </p>
              <ul
                style={listMargin}
                className="list-disc list-inside ml-6 space-y-1 text-left"
              >
                <li>Create and manage accounts</li>
                <li>Process pickup orders</li>
                <li>Display user reviews</li>
                <li>Improve website functionality</li>
                <li>Communicate with users</li>
              </ul>
            </Section>
          </div>

          <div style={sectionMargin}>
            <Section title="3. Sharing of Information">
              <p style={paragraphMargin} className="text-left">
                We may share information:
              </p>
              <ul
                style={listMargin}
                className="list-disc list-inside ml-6 space-y-1 text-left"
              >
                <li>With restaurants (to fulfill orders)</li>
                <li>With payment processors (if applicable)</li>
                <li>If required by law</li>
              </ul>
              <p style={paragraphMargin} className="text-left">
                We do not sell personal information.
              </p>
            </Section>
          </div>

          <div style={sectionMargin}>
            <Section title="4. Data Security">
              <p style={paragraphMargin} className="text-left">
                We implement reasonable technical and organizational measures to
                protect user data. However, no internet transmission is 100%
                secure.
              </p>
            </Section>
          </div>

          <div style={sectionMargin}>
            <Section title="5. Data Retention">
              <p style={paragraphMargin} className="text-left">
                We retain user information as long as:
              </p>
              <ul
                style={listMargin}
                className="list-disc list-inside ml-6 space-y-1 text-left"
              >
                <li>The account remains active</li>
                <li>Necessary for legal or operational purposes</li>
              </ul>
              <p style={paragraphMargin} className="text-left">
                Users may request deletion of their accounts.
              </p>
            </Section>
          </div>

          <div style={sectionMargin}>
            <Section title="6. User Rights">
              <p style={paragraphMargin} className="text-left">
                Depending on your location, you may have the right to:
              </p>
              <ul
                style={listMargin}
                className="list-disc list-inside ml-6 space-y-1 text-left"
              >
                <li>Access your data</li>
                <li>Request corrections</li>
                <li>Request deletion</li>
                <li>Withdraw consent</li>
              </ul>
              <p style={paragraphMargin} className="text-left">
                Contact us to exercise these rights.
              </p>
            </Section>
          </div>

          <div style={sectionMargin}>
            <Section title="7. Third-Party Services">
              <p style={paragraphMargin} className="text-left">
                We may use third-party tools such as analytics or payment
                processors. These services have their own privacy policies.
              </p>
            </Section>
          </div>

          <div style={sectionMargin}>
            <Section title="8. Children's Privacy">
              <p style={paragraphMargin} className="text-left">
                Our website is not intended for children under the age of 13 (or
                applicable age in your country).
              </p>
            </Section>
          </div>

          <div style={sectionMargin}>
            <Section title="9. Changes to This Policy">
              <p style={paragraphMargin} className="text-left">
                We may update this Privacy Policy at any time. Continued use of
                the site means you accept the updated policy.
              </p>
            </Section>
          </div>

          <div style={sectionMargin}>
            <Section title="10. Contact Information">
              <p style={paragraphMargin} className="text-left">
                For questions, contact us at:{" "}
                <span className="font-medium">[Insert Email]</span>
              </p>
            </Section>
          </div>
          {/* Footer */}
          <p className="text-sm text-gray-500 mb-12">Last Updated: [Date]</p>
        </section>
      </div>
    </div>
  );
}
