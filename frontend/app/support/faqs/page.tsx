"use client"
import { useState } from "react"

const faqsData = [
    {
        question: "What is The Local Kitchen?",
        answer: "The Local Kitchen is a community-driven platform that connects food lovers with independent local restaurants. Customers can discover new dining spots through blog posts, browse menus, and place pre-orders for scheduled pickup."
    },
    {
        question: "How do I place an order?",
        answer: "Browse restaurants, view their menu, add items to your cart, select a pickup time window, and complete your order. You'll receive a confirmation with your scheduled pickup time."
    },
    {
        question: "Can I cancel or modify my order?",
        answer: "You can cancel or modify your order up until the restaurant confirms it. Once confirmed, contact the restaurant directly if you need to make changes."
    },
    {
        question: "How do pickup windows work?",
        answer: "Restaurants set specific time slots for pickups. When you order, you select an available window. Your food will be ready during that time — just show your order confirmation when you arrive."
    },
    {
        question: "Do I need an account to browse?",
        answer: "No, you can browse restaurants and read blog posts without an account. You'll need to create one to place orders or write blog posts."
    },
    {
        question: "How do I become a blog contributor?",
        answer: "Any registered user can write blog posts about local restaurants. Just create an account and start sharing your dining experiences."
    },
    {
        question: "I'm a restaurant owner. How do I join?",
        answer: "Contact us to set up your restaurant profile. Once approved, you'll be able to manage your menu, set pickup windows, and receive orders."
    },
    {
        question: "Is there a fee to use The Local Kitchen?",
        answer: "Creating an account and browsing is free for customers. Restaurant owners should contact us for information about partnership options."
    },
    {
        question: "What if my order is wrong or there's a problem?",
        answer: "Contact the restaurant directly for immediate issues with your order. For platform-related problems, reach out to our support team through the Contact Us page."
    },
    {
        question: "How do I report inappropriate content?",
        answer: "Use the report feature on any blog post or comment, or contact our moderation team. We review all reports and take action according to our Community Guidelines."
    }
]

export default function Faqs() {
    const [openIndex, setOpenIndex] = useState<number | null>(null)

    const toggle = (index: number) => {
        setOpenIndex(openIndex === index ? null : index)
    }

    return (
        <div className="flex flex-col items-center text-center px-4 py-20 mt-24">
            <h1 className="text-4xl md:text-5xl font-bold mt-2" style={{ margin: "24px" }}>Frequently Asked Questions</h1>
            <div className="max-w-2xl w-full mt-8 flex flex-col gap-4 items-start text-left">
                {faqsData.map((faq, index) => (
                    <div key={index} className="flex flex-col items-start w-full">
                        <div
                            onClick={() => toggle(index)}
                            className="flex items-center justify-between w-full cursor-pointer border border-indigo-100 p-6 rounded transition-all"
                        >
                            <h2 className="text-xl font-medium" style={{ padding: "8px" }}>{faq.question}</h2>
                            <svg
                                className={`transition-transform duration-500 ease-in-out flex-shrink-0 ml-4 ${openIndex === index ? "rotate-180" : ""}`}
                                width="18"
                                height="18"
                                viewBox="0 0 18 18"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    d="m4.5 7.2 3.793 3.793a1 1 0 0 0 1.414 0L13.5 7.2"
                                    stroke="#1D293D"
                                    strokeWidth="1.5"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />
                            </svg>
                        </div>
                        <p
                            className={`text-base text-slate-800 px-5 overflow-hidden transition-all duration-500 ease-in-out ${openIndex === index
                                ? "max-h-[300px] opacity-100 translate-y-0 pt-4"
                                : "max-h-0 opacity-0 -translate-y-2"
                                }`}
                        >
                            {faq.answer}
                        </p>
                    </div>
                ))}
            </div>
        </div>
    )
}