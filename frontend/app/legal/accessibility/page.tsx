"use client";

import { Section } from "@/components/section";

export default function AccessibilityPolicy() {
  // Reusable margins
  const sectionMargin = { marginTop: "20px", marginBottom: "20px" }; // space between sections
  const paragraphMargin = { marginTop: "5px", marginBottom: "5px" }; // spacing for paragraphs
  const listMargin = { marginTop: "2px", marginBottom: "2px" }; // spacing for lists

  return (
    <div className="flex justify-center">
      <div className="max-w-3xl px-6 py-16">
        {/* Page Title */}
        <h1 className="text-3xl md:text-4xl font-bold mb-12 text-center">
          Accessibility Policy
        </h1>

        <section>
          <div style={sectionMargin}>
            <Section title="1. Purpose">
              <p style={paragraphMargin} className="text-left">
                We are committed to ensuring that our services, website, and
                digital content are accessible to everyone, including people
                with disabilities. Our goal is to provide equal access and an
                inclusive experience for all users.
              </p>
            </Section>
          </div>

          <div style={sectionMargin}>
            <Section title="2. Scope">
              <p style={paragraphMargin} className="text-left">
                This policy applies to:
              </p>
              <ul
                style={listMargin}
                className="list-disc list-inside ml-6 space-y-1 text-left"
              >
                <li>Our website and online services</li>
                <li>Digital documents and media</li>
                <li>Software and applications we provide</li>
                <li>Customer support services</li>
              </ul>
            </Section>
          </div>

          <div style={sectionMargin}>
            <Section title="3. Our Commitment">
              <p style={paragraphMargin} className="text-left">
                We strive to:
              </p>
              <ul
                style={listMargin}
                className="list-disc list-inside ml-6 space-y-1 text-left"
              >
                <li>Make content easy to read and understand</li>
                <li>Provide alternative text for images</li>
                <li>Ensure websites are usable with screen readers</li>
                <li>Support keyboard navigation</li>
                <li>Use clear fonts and sufficient color contrast</li>
                <li>Provide captions or transcripts for videos</li>
              </ul>
            </Section>
          </div>

          <div style={sectionMargin}>
            <Section title="4. Standards">
              <p style={paragraphMargin} className="text-left">
                We aim to follow recognized accessibility standards such as:
              </p>
              <ul
                style={listMargin}
                className="list-disc list-inside ml-6 space-y-1 text-left"
              >
                <li>
                  Web Content Accessibility Guidelines (WCAG) 2.1 Level AA
                </li>
                <li>Applicable accessibility laws and regulations</li>
              </ul>
            </Section>
          </div>

          <div style={sectionMargin}>
            <Section title="5. Ongoing Improvements">
              <p style={paragraphMargin} className="text-left">
                We continuously work to improve accessibility by:
              </p>
              <ul
                style={listMargin}
                className="list-disc list-inside ml-6 space-y-1 text-left"
              >
                <li>Testing our website and tools regularly</li>
                <li>Fixing accessibility issues promptly</li>
                <li>Training staff on accessibility best practices</li>
              </ul>
            </Section>
          </div>

          <div style={sectionMargin}>
            <Section title="6. Feedback and Assistance">
              <p style={paragraphMargin} className="text-left">
                We welcome feedback to improve accessibility. If you experience
                barriers or need assistance, please contact us:
              </p>
              <div style={listMargin} className="space-y-1 text-left ml-6">
                <p>
                  Email:{" "}
                  <span className="font-medium">support@example.com</span>
                </p>
                <p>
                  Phone: <span className="font-medium">(000) 000-0000</span>
                </p>
              </div>
              <p style={paragraphMargin} className="text-left">
                We will respond as quickly as possible to address your concerns.
              </p>
            </Section>
          </div>

          <div style={sectionMargin}>
            <Section title="7. Policy Review">
              <p style={paragraphMargin} className="text-left">
                This policy will be reviewed regularly to ensure continued
                compliance and improvement.
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
