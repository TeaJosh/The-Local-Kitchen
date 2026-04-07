import React from "react";
import Image from "next/image";
import { FaBullseye, FaUsers, FaGlobeAmericas } from "react-icons/fa";

export default function About() {
  // Team members
  const teamMembers = [
    { name: "Terry Heng", imgSrc: "/images/hawaii 1.png" },
    { name: "Terry Heng", imgSrc: "/images/Hawaii 1.png" },
    { name: "Terry Heng", imgSrc: "/images/hawaii 1.png" },
    { name: "Terry Heng", imgSrc: "/images/hawaii 1.png" },
    { name: "Terry Heng", imgSrc: "/images/hawaii 1.png" },
  ];

  // Common margin style for sections
  const sectionMargin = { marginTop: "30px", marginBottom: "20px" };

  return (
    <div className="bg-white font-sans">
      {/* ================= HERO ================= */}
      <section className="relative w-full h-[70vh] flex items-center justify-center">
        <Image
          src="/images/abouthero.jpg"
          alt="About"
          fill
          priority
          sizes="200vw"
          className="object-cover"
        />

        {/* Light overlay */}
        <div className="absolute inset-0 bg-black/20 flex items-center justify-center px-6">
          <div className="text-center max-w-2xl">
            <h2 className="text-4xl md:text-5xl font-semibold text-white mb-8">
              Discovering Local Delights
            </h2>
            <p className="text-white text-xl md:text-2xl">
              The Local Kitchen connects food lovers with hidden culinary gems
              while supporting local restaurants.
            </p>
          </div>
        </div>
      </section>

      {/* ================= OUR STORY ================= */}
      <section
        className="px-4 sm:px-10 py-40 flex justify-center bg-white"
        style={sectionMargin} // Allows easy adjustment later
      >
        <div className="max-w-screen-xl w-full">
          <div className="grid lg:grid-cols-2 items-start gap-x-24 gap-y-28">
            {/* LEFT TEXT - Centered */}
            <div className="text-center ">
              <h2 className="text-3xl md:text-4xl font-bold mb-12">
                Our Story
              </h2>

              {/* How it Started */}
              <div className="mb-8">
                <h3
                  className="text-2xl font-semibold mb-3"
                  style={sectionMargin}
                >
                  How it Started
                </h3>

                <p className="text-lg text-slate-800 leading-relaxed">
                  The Local Kitchen began as an idea shared by five college
                  students who wanted to make it easier to discover underrated
                  restaurants while supporting small local businesses. The
                  mission was simple: connect food lovers with hidden culinary
                  gems.
                </p>
              </div>

              {/* Exploration Journey */}
              <div className="mb-8">
                <h3
                  className="text-2xl font-semibold mb-3"
                  style={sectionMargin}
                >
                  Exploration Journey
                </h3>
                <p className="text-lg text-slate-800 leading-relaxed">
                  We plan to explore local food markets, cafés, and family-owned
                  restaurants to discover authentic experiences that often go
                  unnoticed. Through these visits, we hope to better understand
                  the passion behind every dish and the challenges small
                  businesses face in gaining recognition.
                </p>
              </div>

              {/* Vision for the Future */}
              <div>
                <h3
                  className="text-2xl font-semibold mb-3"
                  style={sectionMargin}
                >
                  Vision for the Future
                </h3>
                <p className="text-lg text-slate-800 leading-relaxed">
                  Our vision is to grow The Local Kitchen into a platform that
                  not only highlights local talent but also inspires communities
                  to support authentic food experiences. We aim to expand
                  nationally and eventually globally while staying true to our
                  roots of celebrating local flavors and the people behind them.
                </p>
              </div>
            </div>

            {/* RIGHT IMAGE */}
            <div className="relative w-full h-[620px] rounded-xl overflow-hidden bg-white">
              <Image
                src="/images/spencer-davis-yqXH4v6UTJA-unsplash.jpg"
                alt="Our Story"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-contain"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ================= MISSION / VALUES ================= */}
      <section className="bg-white py-40 px-6 flex justify-center">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-16 place-content-center">
          {/* CARD 1 */}
          <div className="bg-blue-500 rounded-xl p-12 w-[280px] flex flex-col items-center text-center shadow-lg shadow-black/10">
            <div
              className="bg-orange-500 text-white w-12 h-12 mb-8 flex items-center justify-center rounded-full"
              style={{ marginTop: "10px" }}
            >
              <FaBullseye size={26} />
            </div>

            <h3 className="font-semibold mb-4 text-white">Our Mission</h3>

            <p className="text-sm text-blue-100 leading-relaxed">
              Empowering local restaurant owners and celebrating authentic food
              experiences.
            </p>
          </div>

          {/* CARD 2 */}
          <div className="bg-blue-500 rounded-xl p-12 w-[280px] flex flex-col items-center text-center shadow-lg shadow-black/10">
            <div
              className="bg-orange-500 text-white w-12 h-12 mb-8 flex items-center justify-center rounded-full"
              style={{ marginTop: "10px" }}
            >
              <FaUsers size={26} />
            </div>
            <h3 className="font-semibold mb-4 text-white">Community First</h3>
            <p className="text-sm text-blue-100 leading-relaxed">
              We prioritize local voices, culture, and community‑driven
              discovery.
            </p>
          </div>

          {/* CARD 3 */}
          <div className="bg-blue-500 rounded-xl p-12 w-[280px] flex flex-col items-center text-center shadow-lg shadow-black/10">
            <div
              className="bg-orange-500 text-white w-12 h-12 mb-8 flex items-center justify-center rounded-full"
              style={{ marginTop: "10px" }}
            >
              <FaGlobeAmericas size={26} />
            </div>
            <h3 className="font-semibold mb-4 text-white">Bigger Vision</h3>
            <p className="text-sm text-blue-100 leading-relaxed">
              Starting local but building a platform that can scale globally.
            </p>
          </div>
        </div>
      </section>

      {/* ================= TEAM ================= */}
      <section className="py-40 px-6 flex justify-center bg-white">
        <div className="max-w-4xl w-full text-center">
          <h2
            className="text-3xl font-bold mb-24"
            style={sectionMargin} // Allows easy adjustment later
          >
            Meet Our Team
          </h2>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-16 justify-items-center">
            {teamMembers.map((member, index) => (
              <div key={index} className="w-36">
                <Image
                  src={member.imgSrc}
                  alt={member.name}
                  width={144}
                  height={144}
                  className="rounded-xl object-cover shadow-md mx-auto"
                />
                <p
                  className="mt-6 font-semibold text-sm"
                  style={{ marginTop: "10px", marginBottom: "20px" }} // Allows easy adjustment later
                >
                  {member.name}{" "}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
