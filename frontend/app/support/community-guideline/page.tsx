"use client";

import { Section, SubSection } from "@/components/section";

export default function CommunityGuidelines() {
  // Reusable margins
  const sectionMargin = { marginTop: "20px", marginBottom: "20px" }; // space between sections
  const paragraphMargin = { marginTop: "5px", marginBottom: "5px" }; // spacing for paragraphs
  const listMargin = { marginTop: "2px", marginBottom: "2px" }; // spacing for lists

  return (
    <div className="flex justify-center">
      <div className="max-w-3xl px-6 py-16">
        {/* Page Title */}
        <h1 className="text-3xl md:text-4xl font-bold mb-12 text-center">
          Community Guidelines
        </h1>

        <p style={paragraphMargin}>
          Welcome toThe Local Kitchen community! Our platform connects food
          lovers with local restaurants through shared experiences and
          recommendations. To keep this a welcoming space for everyone, we ask
          all members to follow these guidelines when posting content, leaving
          comments, or interacting with others.
        </p>

        <section>
          {/* 1. Age-Appropriate Content */}
          <div style={sectionMargin}>
            <Section title="1. Age-Appropriate Content">
              <p style={paragraphMargin}>
                Our platform is designed for a general audience of all ages. All
                content must be appropriate for public viewing.
              </p>
              <ul style={listMargin} className="list-disc list-inside ml-6">
                <li>
                  No NSFW or sexual content — explicit images, suggestive
                  language, or adult-oriented material are prohibited.
                </li>
                <li>
                  Appropriate profile pictures — must be suitable for all
                  audiences; no nudity, graphic imagery, or offensive symbols.
                </li>
                <li>
                  Family-friendly language — keep posts and comments appropriate
                  for all ages.
                </li>
              </ul>
            </Section>
          </div>

          {/* 2. Content Relevance */}
          <div style={sectionMargin}>
            <Section title="2. Content Relevance">
              <p style={paragraphMargin}>
                All posts should be relevant to food and dining to maintain the
                quality and purpose of our community.
              </p>
              <ul style={listMargin} className="list-disc list-inside ml-6">
                <li>
                  Stay on topic — posts must relate to food, restaurants, dining
                  experiences, local cuisine, recipes, or culinary culture.
                </li>
                <li>
                  No spam — avoid repetitive content, excessive self-promotion,
                  or irrelevant links.
                </li>
                <li>
                  No unrelated promotions — advertisements unrelated to food or
                  local restaurants are not permitted.
                </li>
              </ul>
            </Section>
          </div>

          {/* 3. Harassment & Hate */}
          <div style={sectionMargin}>
            <Section title="3. Harassment & Hate">
              <p style={paragraphMargin}>
                We are committed to maintaining a respectful and inclusive
                community. Treat others the way you would want to be treated.
              </p>
              <ul style={listMargin} className="list-disc list-inside ml-6">
                <li>
                  No bullying or threats — personal attacks, intimidation, or
                  threatening language will not be tolerated.
                </li>
                <li>
                  No hateful language — content that promotes hatred or
                  discrimination based on race, ethnicity, religion, gender,
                  sexual orientation, disability, or any other characteristic is
                  strictly prohibited.
                </li>
                <li>
                  Respectful disagreement — you may disagree with others, but
                  critique ideas, not people.
                </li>
              </ul>
            </Section>
          </div>

          {/* 4. Media Rules */}
          <div style={sectionMargin}>
            <Section title="4. Media Rules">
              <p style={paragraphMargin}>
                When uploading images, videos, or other media, ensure your
                content meets these standards:
              </p>
              <ul style={listMargin} className="list-disc list-inside ml-6">
                <li>
                  No copyrighted material — only upload content you own or have
                  permission to use. Credit others appropriately.
                </li>
                <li>
                  No offensive imagery — images must not contain graphic
                  violence, disturbing content, or violate age-appropriate
                  content policy.
                </li>
                <li>
                  No misleading content — avoid fake reviews, manipulated
                  images, or deceptive information about restaurants.
                </li>
                <li>
                  No impersonation — do not pretend to be another person,
                  restaurant owner, or official entity.
                </li>
              </ul>
            </Section>
          </div>

          {/* Enforcement */}
          <div style={sectionMargin}>
            <Section title="Enforcement">
              <p style={paragraphMargin}>
                Violations of these guidelines may result in content removal,
                warnings, or account suspension depending on the severity and
                frequency of the offense. Our moderation team reviews reported
                content and reserves the right to take action at their
                discretion.
              </p>
            </Section>
          </div>

          {/* Reporting Violations */}
          <div style={sectionMargin}>
            <Section title="Reporting Violations">
              <p style={paragraphMargin}>
                If you encounter content that violates these guidelines, please
                use the report feature on the post or contact our moderation
                team. We appreciate your help in keeping The Local Kitchen a
                positive community.
              </p>
            </Section>
          </div>
        </section>
      </div>
    </div>
  );
}
