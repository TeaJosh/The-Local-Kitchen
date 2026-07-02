import React from "react";
import Image from "next/image";

export default function About() {
  return (
    <div className="bg-white font-sans">
      
      {/* Hero banner */}
      <section className="relative w-full h-[70vh] flex items-center justify-center">
        <Image
          src="/images/abouthero.jpg"
          alt="About"
          fill
          priority
          sizes="200vw"
          className="object-cover"
        />
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

      {/* Who We Are */}
      <section
        className="px-4 sm:px-10 flex justify-center bg-white"
        style={{ paddingTop: "64px", paddingBottom: "64px", marginTop: "64px" }}
      >
        <div className="max-w-screen-xl w-full">
          <div className="grid lg:grid-cols-2 items-start gap-x-24 gap-y-16">
            {/* LEFT TEXT */}
            <div className="text-center">
              <h2 className="text-3xl md:text-4xl font-bold" style={{ marginBottom: "24px" }}>
                Who We Are
              </h2>

              {/* Making a Difference */}
              <div style={{ marginBottom: "32px" }}>
                <h3 className="text-2xl font-semibold" style={{ marginTop: "30px", marginBottom: "20px" }}>
                  Making a Difference
                </h3>
                <p className="text-base text-slate-800 leading-relaxed">
                  At The Local Kitchen, we believe that every meal tells a story
                  and every restaurant deserves to be heard. We are a team of
                  five college students united by a shared passion for food and
                  community. By amplifying the voices of small and
                  underrepresented restaurants, we help bridge the gap between
                  local businesses and the communities they serve — giving hidden
                  gems the visibility they deserve.
                </p>
              </div>

              {/* Exploration Journey */}
              <div style={{ marginBottom: "32px" }}>
                <h3 className="text-2xl font-semibold" style={{ marginTop: "30px", marginBottom: "20px" }}>
                  Exploration Journey
                </h3>
                <p className="text-base text-slate-800 leading-relaxed">
                  We go beyond the screen — visiting local food markets, cafés,
                  and family-owned restaurants to uncover authentic experiences
                  that often go unnoticed. Through these visits, we learn the
                  stories behind every dish and gain a deeper understanding of
                  the challenges small businesses face in earning the recognition
                  they deserve.
                </p>
              </div>

              {/* Vision for the Future */}
              <div>
                <h3 className="text-2xl font-semibold" style={{ marginTop: "30px", marginBottom: "20px" }}>
                  Vision for the Future
                </h3>
                <p className="text-base text-slate-800 leading-relaxed">
                  We envision The Local Kitchen as a platform that grows
                  alongside the communities it serves — expanding nationally and
                  eventually globally, while staying rooted in the mission of
                  celebrating local flavors and the people behind them. Every
                  step forward is guided by our commitment to authentic food
                  experiences and the restaurants that make them possible.
                </p>
              </div>
            </div>

            {/* Right image */}
            <div className="relative w-full h-[620px] rounded-xl overflow-hidden bg-white">
              <Image
                src="/images/spencer-davis-yqXH4v6UTJA-unsplash.jpg"
                alt="Who We Are"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-contain"
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
