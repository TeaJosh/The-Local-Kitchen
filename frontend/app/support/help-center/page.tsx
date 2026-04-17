"use client";

import { Section } from "@/components/section";
import { useState } from "react";
import Link from "next/link";

interface FAQ {
  category: string;
  question: string;
  answer: string;
}

// FAQ data
const faqs: FAQ[] = [
  {
    category: "Account",
    question: "How do I create an account?",
    answer:
      "Click the Login button in the top-right and select Sign Up. Fill in your details and verify your email.",
  },
  {
    category: "Account",
    question: "How do I reset my password?",
    answer:
      "Go to Login → Forgot Password and follow the instructions to reset your password.",
  },
  {
    category: "Orders",
    question: "How can I place an order?",
    answer:
      "Browse restaurants, add items to your cart, and complete checkout with your payment method.",
  },
  {
    category: "Orders",
    question: "Can I cancel an order?",
    answer:
      "Orders cannot be canceled once confirmed. Contact the restaurant or support immediately.",
  },
  {
    category: "Payments",
    question: "Which payment methods are accepted?",
    answer: "We accept credit/debit cards, Apple Pay, Google Pay, and PayPal.",
  },
  {
    category: "Payments",
    question: "Is my payment information secure?",
    answer:
      "All payments are processed securely through trusted providers. We never store full credit card info.",
  },
  {
    category: "Restaurants",
    question: "How do I add my restaurant?",
    answer:
      "Restaurant owners can apply via the 'Partner with us' form. Our team reviews and approves accounts.",
  },
  {
    category: "Restaurants",
    question: "How can I update my menu?",
    answer:
      "Log in as the restaurant owner, go to 'Menu Management', and edit your menu items directly.",
  },
];

export default function HelpCenter() {
  const sectionMargin = { marginTop: "20px", marginBottom: "20px" };
  const paragraphMargin = { marginTop: "10px", marginBottom: "10px" };
  const [search, setSearch] = useState("");

  // Filter FAQs based on search input (reactive)
  const filteredFaqs = faqs.filter(
    (faq) =>
      faq.question.toLowerCase().includes(search.toLowerCase()) ||
      faq.answer.toLowerCase().includes(search.toLowerCase()) ||
      faq.category.toLowerCase().includes(search.toLowerCase()),
  );

  // Group filtered FAQs by category
  const groupedFaqs = filteredFaqs.reduce((acc: Record<string, FAQ[]>, faq) => {
    if (!acc[faq.category]) acc[faq.category] = [];
    acc[faq.category].push(faq);
    return acc;
  }, {});

  return (
    <div className="flex justify-center">
      <div className="max-w-3xl px-6 py-16">
        {/* Page Title */}
        <h1 className="text-3xl md:text-4xl font-bold mb-16 text-center">
          Help Center
        </h1>

        {/* Search */}
        <div className="flex justify-center mb-16">
          <input
            type="text"
            placeholder="Search help articles..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full max-w-2xl p-4 text-lg rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500"
            style={sectionMargin}
          />
        </div>

        {/* FAQ Sections */}
        <section>
          {Object.keys(groupedFaqs).length > 0 ? (
            Object.keys(groupedFaqs).map((category) => (
              <div key={category} style={sectionMargin}>
                <Section title={category}>
                  {groupedFaqs[category].map((faq, idx) => (
                    <details
                      key={idx}
                      className="bg-white p-4 rounded-lg shadow mb-3 hover:shadow-md transition"
                    >
                      <summary className="cursor-pointer font-medium text-gray-800">
                        {faq.question}
                      </summary>
                      <p className="mt-2 text-gray-600">{faq.answer}</p>
                    </details>
                  ))}
                </Section>
              </div>
            ))
          ) : (
            <p className="text-gray-500 text-center">
              No articles found for "{search}".
            </p>
          )}
        </section>

        {/* Contact Support */}
        <div style={sectionMargin}>
          <Section title="Contact Support">
            <p style={paragraphMargin}>
              If you still have questions or encounter issues, reach out to our
              support team via the Contact page. We’ll respond as soon as
              possible.
            </p>
            <Link
              href="/contact"
              className="inline-block border bg-orange-500 text-sm text-white font-semibold hover:bg-white hover:text-sky-500 rounded-lg transition"
              style={{ marginTop: "12px", padding: "16px 24px" }}
            >
              Contact Support
            </Link>
          </Section>
        </div>
      </div>
    </div>
  );
}
