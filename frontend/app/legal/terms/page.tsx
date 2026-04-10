"use client";
import { Section, SubSection } from "@/components/section";

export default function TermsOfService() {
  // Reusable margins
  const sectionMargin = { marginTop: "20px", marginBottom: "20px" }; // spacing between sections
  const bodyMargin = { marginTop: "5px", marginBottom: "5px" }; // spacing for normal paragraphs
  const listMargin = { marginTop: "2px", marginBottom: "2px" }; // spacing for lists

  return (
    <div className="flex justify-center">
      <div className="max-w-3xl px-6 py-16">
        {/* Page Title */}
        <h1 className="text-3xl md:text-4xl font-bold mb-4 text-center">
          Terms of Service
        </h1>

        {/* Intro Paragraphs */}
        <p style={bodyMargin}>
          Welcome to The Local Kitchen. By accessing or using our
          website, you agree to the following Terms of Service ("Terms").
        </p>
        <p style={bodyMargin}>
          If you do not agree, please do not use our website.
        </p>

        <section>
          {/* Section 1 */}
          <div style={sectionMargin}>
            <Section title="1. Description of Service">
              <p style={bodyMargin}>
                The Local Kitchen is a platform that allows users to:
              </p>
              <ul
                style={listMargin}
                className="list-disc list-inside ml-6 space-y-1 text-left"
              >
                <li>Post blog reviews about restaurants</li>
                <li>View restaurant information</li>
                <li>Place pick up orders with participating restaurants</li>
              </ul>
              <p style={bodyMargin}>
                We do not prepare or cook food. Restaurants are responsible for
                fulfilling orders.
              </p>
            </Section>
          </div>

          {/* Section 2 */}
          <div style={sectionMargin}>
            <Section title="2. Eligibility">
              <p style={bodyMargin}>
                You must be at least 18 years old (or the age of majority in
                your jurisdiction).
              </p>
              <p style={bodyMargin}>
                By using this website, you represent that:
              </p>
              <ul
                style={listMargin}
                className="list-disc list-inside ml-6 space-y-1 text-left"
              >
                <li>The information you provide is accurate</li>
                <li>You will use the platform legally and respectfully</li>
              </ul>
            </Section>
          </div>

          {/* Section 3 */}
          <div style={sectionMargin}>
            <Section title="3. User Accounts">
              <p style={bodyMargin}>
                To post reviews or place orders, users may need an account.
              </p>
              <p style={bodyMargin}>You agree to:</p>
              <ul
                style={listMargin}
                className="list-disc list-inside ml-6 space-y-1 text-left"
              >
                <li>Keep login credentials secure</li>
                <li>Be responsible for all activity under your account</li>
                <li>Notify us of unauthorized use</li>
              </ul>
              <p style={bodyMargin}>
                We reserve the right to suspend or terminate accounts that
                violate these Terms.
              </p>
            </Section>
          </div>

          {/* Section 4 */}
          <div style={sectionMargin}>
            <Section title="4. User Content">
              <p style={bodyMargin}>
                Users may submit reviews and other content.
              </p>
              <p style={bodyMargin}>By posting content you:</p>
              <ul
                style={listMargin}
                className="list-disc list-inside ml-6 space-y-1 text-left"
              >
                <li>
                  Grant us a non-exclusive, royalty-free license to display it
                </li>
                <li>Confirm the content is truthful and lawful</li>
                <li>Agree not to post offensive or misleading content</li>
              </ul>
              <p style={bodyMargin}>We may remove content at our discretion.</p>
            </Section>
          </div>

          {/* Section 5 */}
          <div style={sectionMargin}>
            <Section title="5. Orders and Payments">
              <ul
                style={listMargin}
                className="list-disc list-inside ml-6 space-y-1 text-left"
              >
                <li>Orders are pickup-only.</li>
                <li>
                  Restaurants are responsible for food preparation and safety.
                </li>
                <li>Prices and availability are determined by restaurants.</li>
                <li>
                  We are not responsible for food quality or order errors.
                </li>
              </ul>
              <SubSection subtitle="Payment Processing">
                <ul
                  style={listMargin}
                  className="list-disc list-inside ml-6 space-y-1 text-left"
                >
                  <li>Payments may be processed by third-party providers</li>
                  <li>We do not store full credit card information</li>
                </ul>
              </SubSection>
            </Section>
          </div>

          {/* Section 6 */}
          <div style={sectionMargin}>
            <Section title="6. Restaurant Responsibilities">
              <p style={bodyMargin}>Restaurants are independent businesses.</p>
              <p style={bodyMargin}>We are not responsible for:</p>
              <ul
                style={listMargin}
                className="list-disc list-inside ml-6 space-y-1 text-left"
              >
                <li>Food safety</li>
                <li>Order fulfillment</li>
                <li>Restaurant policies</li>
              </ul>
            </Section>
          </div>

          {/* Section 7 */}
          <div style={sectionMargin}>
            <Section title="7. Prohibited Conduct">
              <p style={bodyMargin}>You agree not to:</p>
              <ul
                style={listMargin}
                className="list-disc list-inside ml-6 space-y-1 text-left"
              >
                <li>Post false or harmful reviews</li>
                <li>Hack or disrupt the website</li>
                <li>Use bots or scraping tools</li>
                <li>Impersonate others</li>
              </ul>
            </Section>
          </div>

          {/* Section 8 */}
          <div style={sectionMargin}>
            <Section title="8. Intellectual Property">
              <p style={bodyMargin}>
                All website content is owned by or licensed to us. You may not
                copy or distribute materials without permission.
              </p>
            </Section>
          </div>

          {/* Section 9 */}
          <div style={sectionMargin}>
            <Section title="9. Disclaimer of Warranties">
              <p style={bodyMargin}>The website is provided "as is".</p>
              <ul
                style={listMargin}
                className="list-disc list-inside ml-6 space-y-1 text-left"
              >
                <li>No guarantee of continuous availability</li>
                <li>No guarantee of accuracy</li>
                <li>No guarantee of error-free service</li>
              </ul>
            </Section>
          </div>

          {/* Section 10 */}
          <div style={sectionMargin}>
            <Section title="10. Limitation of Liability">
              <p style={bodyMargin}>We are not liable for:</p>
              <ul
                style={listMargin}
                className="list-disc list-inside ml-6 space-y-1 text-left"
              >
                <li>Indirect damages</li>
                <li>Restaurant-related issues</li>
                <li>User-submitted content</li>
              </ul>
            </Section>
          </div>

          {/* Section 11 */}
          <div style={sectionMargin}>
            <Section title="11. Termination">
              <p style={bodyMargin}>
                We may suspend or terminate access for violations of these
                Terms.
              </p>
            </Section>
          </div>

          {/* Section 12 */}
          <div style={sectionMargin}>
            <Section title="12. Changes to Terms">
              <p style={bodyMargin}>We may update these Terms at any time.</p>
            </Section>
          </div>

          {/* Section 13 */}
          <div style={sectionMargin}>
            <Section title="13. Contact Information">
              <p style={bodyMargin}>
                Contact us at:{" "}
                <span className="font-medium">[Insert Email]</span>
              </p>
            </Section>
          </div>
        </section>
      </div>
    </div>
  );
}
