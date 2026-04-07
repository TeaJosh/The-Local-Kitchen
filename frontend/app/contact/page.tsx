"use client";

import React, { useState } from "react";

const ContactPage: React.FC = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [showError, setShowError] = useState(false);
  const [missingFields, setMissingFields] = useState<string[]>([]);
  const [emailError, setEmailError] = useState<string | null>(null);

  const validateEmail = (value: string) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(value);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const missing: string[] = [];
    let emailFormatError: string | null = null;

    if (!firstName.trim()) missing.push("First Name");
    if (!lastName.trim()) missing.push("Last Name");
    if (!email.trim()) {
      missing.push("Email Address");
    } else if (!validateEmail(email.trim())) {
      emailFormatError = "Please enter a valid email address.";
    }
    if (!subject.trim()) missing.push("Subject");
    if (!message.trim()) missing.push("Message");

    if (missing.length > 0 || emailFormatError) {
      setMissingFields(missing);
      setEmailError(emailFormatError);
      setShowError(true);
      return;
    }

    setMissingFields([]);
    setEmailError(null);
    setShowError(false);
    // Submit logic here...
  };

  const closeError = () => {
    setShowError(false);
    setEmailError(null);
  };

  return (
    <div id="no-tailwind-root">
      <style>{`
        #no-tailwind-root, 
        #no-tailwind-root * {
          all: unset;
          display: revert;
          box-sizing: border-box;
          font: revert;
          color: revert;
          background: revert;
        }

        #no-tailwind-root div, 
        #no-tailwind-root section, 
        #no-tailwind-root header, 
        #no-tailwind-root main, 
        #no-tailwind-root footer, 
        #no-tailwind-root form, 
        #no-tailwind-root p {
          display: block;
        }

        #no-tailwind-root button {
          cursor: pointer;
        }
      `}</style>

      <div
        style={{
          backgroundColor: "#FFFFFF",
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* Error Overlay */}
        {showError && (
          <div
            style={{
              position: "fixed",
              inset: 0,
              backgroundColor: "rgba(0,0,0,0.6)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 50,
            }}
            onClick={closeError}
          >
            <div
              style={{
                backgroundColor: "#000000",
                border: "1px solid #FFA500",
                color: "#FFA500",
                padding: "1rem 1.5rem",
                maxWidth: "90%",
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <p style={{ marginBottom: "0.5rem" }}>
                Please complete all required fields before sending your message.
              </p>

              {missingFields.length > 0 && (
                <ul style={{ marginBottom: "0.75rem", paddingLeft: "1.5rem" }}>
                  {missingFields.map((field) => (
                    <li key={field}>{field} is required.</li>
                  ))}
                </ul>
              )}

              {emailError && (
                <div style={{ marginTop: "0.25rem", color: "#FFA500" }}>
                  {emailError}
                </div>
              )}

              <button
                onClick={closeError}
                style={{
                  marginTop: "0.5rem",
                  backgroundColor: "#FFA500",
                  color: "#000",
                  border: "1px solid #FFA500",
                  padding: "0.25rem 1rem",
                }}
              >
                OK
              </button>
            </div>
          </div>
        )}

        <main
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            flexGrow: 1,
            padding: "3rem 1rem",
          }}
        >
          <h1
            style={{
              fontSize: "2.5rem",
              fontWeight: "bold",
              marginBottom: "2rem",
              color: "#111",
            }}
          >
            Contact Us
          </h1>

          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              backgroundColor: "#A8E6A1",
              borderRadius: "0.5rem",
              boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
              padding: "2rem",
              width: "90%",
              maxWidth: "900px",
            }}
          >
            {/* Left Div */}
            <div style={{ flex: 1, marginRight: "1rem", marginBottom: "1rem" }}>
              <h2
                style={{
                  fontSize: "1.5rem",
                  fontWeight: "600",
                  marginBottom: "1rem",
                  color: "#333",
                }}
              >
                Send us a message
              </h2>

              <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: "1rem" }}>
                  <label style={{ display: "block", fontWeight: "500" }}>
                    First Name
                  </label>
                  <input
                    type="text"
                    placeholder="Enter your first name"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    style={{
                      width: "100%",
                      padding: "0.5rem",
                      border: "1px solid #000",
                      borderRadius: "0.25rem",
                    }}
                  />
                </div>

                <div style={{ marginBottom: "1rem" }}>
                  <label style={{ display: "block", fontWeight: "500" }}>
                    Last Name
                  </label>
                  <input
                    type="text"
                    placeholder="Enter your last name"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    style={{
                      width: "100%",
                      padding: "0.5rem",
                      border: "1px solid #000",
                      borderRadius: "0.25rem",
                    }}
                  />
                </div>

                <div style={{ marginBottom: "1rem" }}>
                  <label style={{ display: "block", fontWeight: "500" }}>
                    Email Address
                  </label>
                  <input
                    type="text"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    style={{
                      width: "100%",
                      padding: "0.5rem",
                      border: "1px solid #000",
                      borderRadius: "0.25rem",
                    }}
                  />
                </div>

                <div style={{ marginBottom: "1rem" }}>
                  <label style={{ display: "block", fontWeight: "500" }}>
                    Subject
                  </label>
                  <input
                    type="text"
                    placeholder="Subject of your message"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    style={{
                      width: "100%",
                      padding: "0.5rem",
                      border: "1px solid #000",
                      borderRadius: "0.25rem",
                    }}
                  />
                </div>

                <div style={{ marginBottom: "1rem" }}>
                  <label style={{ display: "block", fontWeight: "500" }}>
                    Message
                  </label>
                  <textarea
                    placeholder="Type your message here"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    style={{
                      width: "100%",
                      padding: "0.5rem",
                      border: "1px solid #000",
                      borderRadius: "0.25rem",
                      height: "8rem",
                    }}
                  />
                </div>

                <button
                  type="submit"
                  style={{
                    backgroundColor: "#FFA500",
                    color: "#FFF",
                    border: "none",
                    borderRadius: "0.25rem",
                    padding: "0.5rem 1.5rem",
                  }}
                >
                  Send Message
                </button>
              </form>
            </div>

            {/* Right Div */}
            <div style={{ flex: 1 }}>
              <h2
                style={{
                  fontSize: "1.5rem",
                  fontWeight: "600",
                  marginBottom: "1rem",
                  color: "#333",
                }}
              >
                Get in touch
              </h2>

              <div style={{ display: "grid", gap: "1rem" }}>
                <div
                  style={{
                    backgroundColor: "#FFF",
                    border: "1px solid #000",
                    padding: "1rem",
                  }}
                >
                  <h3 style={{ fontWeight: "600" }}>Address</h3>
                  <p>123 Main Street, Eden Prairie, MN 55344</p>
                </div>

                <div
                  style={{
                    backgroundColor: "#FFF",
                    border: "1px solid #000",
                    padding: "1rem",
                  }}
                >
                  <h3 style={{ fontWeight: "600" }}>Phone</h3>
                  <p>000-000-0000</p>
                </div>

                <div
                  style={{
                    backgroundColor: "#FFF",
                    border: "1px solid #000",
                    padding: "1rem",
                  }}
                >
                  <h3 style={{ fontWeight: "600" }}>Email</h3>
                  <a href="mailto:thelocalkitchen@gmail.com">
                    thelocalkitchen@gmail.com
                  </a>
                </div>

                <div
                  style={{
                    backgroundColor: "#FFF",
                    border: "1px solid #000",
                    padding: "1rem",
                  }}
                >
                  <h3 style={{ fontWeight: "600" }}>Website</h3>
                  <a href="https://www.thelocalkitchen.com">
                    www.thelocalkitchen.com
                  </a>
                </div>

                <div
                  style={{
                    backgroundColor: "#FFA500",
                    color: "#FFF",
                    border: "1px solid #000",
                    padding: "1rem",
                  }}
                >
                  <h3 style={{ fontWeight: "600" }}>Support Hours</h3>
                  <p>Monday - Friday: 9am - 5pm</p>
                  <p>Saturday - Sunday: 10am - 4pm</p>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default ContactPage;
