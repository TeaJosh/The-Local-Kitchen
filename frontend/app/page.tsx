import Link from "next/link"
import Image from "next/image"

export default function Home() {
  return (
    <div className="bg-white dark:bg-black font-sans min-h-screen">

      {/* Hero Banner */}
      <div className="w-full relative h-screen overflow-hidden">
        <video
          src="/videos/tlk-video.mp4"
          autoPlay
          loop
          muted
          style={{ transform: "scale(1.5)", transformOrigin: "60% center" }}
          className="w-full h-full object-cover absolute inset-0 z-0"
        />
        <div className="absolute inset-0 flex flex-col items-center justify-start text-center px-4 pt-24 translate-y-42">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white max-w-2xl">
            The Local Kitchen, Your Gateway to Global Flavors.
          </h1>
        </div>
      </div>

      {/* Our Story Section */}
      <div className="px-4 sm:px-10 py-6 flex flex-col justify-center items-center" style={{ marginTop: "64px" }}>
        <div className="max-w-screen-xl max-lg:max-w-3xl mx-auto">
          <div className="grid lg:grid-cols-2 items-center gap-x-12 gap-y-16">
            <div className="max-lg:text-center">
              <h1 className="md:text-4xl text-3xl !leading-tight font-bold mb-6">Our Story</h1>
              <p className="text-lg text-slate-800 leading-relaxed" style={{ marginTop: "24px" }}>
                The Local Kitchen began as an idea shared by five college students.
                As foodies, we were frustrated by how difficult it was to discover underrated restaurants on major food platforms.
                At the same time, many small businesses across Minnesota were struggling to stay afloat amid a challenging economic and labor landscape.
                <br /><br />
                When our capstone course gave us the opportunity to build a real-world project, we saw a chance to make a meaningful impact.
                We created The Local Kitchen to celebrate local food culture, support small and underrepresented restaurants,
                and increase their visibility through community-driven content and media exposure.
              </p>
            </div>
            <div className="relative w-full h-[800px] rounded-xl overflow-hidden">
              <Image
                src="/images/our-story.jpg"
                fill
                className="object-cover"
                alt="Our story"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Cards section */}
      <div className="py-8 px-6 flex flex-col items-center">
        <div className="max-w-7xl w-full mb-8">
          <h2 className="text-3xl font-bold text-center" style={{ marginTop: "96px", marginBottom: "24px", marginLeft: "24px", marginRight: "24px" }}>
            How it Works
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-screen-xl w-full mt-6">

          {/* Blog card */}
          <Link href="/blog/">
            <div className="bg-white border border-gray-200 shadow-md rounded-lg overflow-hidden flex flex-col h-full">
              <div className="aspect-[3/2]">
                <Image
                  src="/images/blog.jpg"
                  width={400}
                  height={400}
                  className="w-full h-full object-cover"
                  alt="Blog"
                />
              </div>
              <div className="p-4">
                <h2 className="text-base md:text-lg font-semibold mb-2">Blog</h2>
                <p className="text-sm text-slate-700 leading-relaxed">
                  Explore real stories from your community—highlighting local food culture, hidden gems, and underrepresented restaurants.
                  Share your own experiences and help bring attention to places that deserve it most.
                </p>
              </div>
            </div>
          </Link>

          {/* Restaurant card */}
          <Link href="/restaurants/">
            <div className="bg-white border border-gray-200 shadow-md rounded-lg overflow-hidden flex flex-col h-full">
              <div className="aspect-[3/2]">
                <Image
                  src="/images/restaurants.jpg"
                  width={400}
                  height={400}
                  className="w-full h-full object-cover"
                  alt="Restaurant"
                />
              </div>
              <div className="p-4">
                <h2 className="text-base md:text-lg font-semibold mb-2">Restaurants</h2>
                <p className="text-sm text-slate-700 leading-relaxed">
                  Discover restaurants by location and filter by cuisine, price, and features like pickup or online ordering.
                  Find exactly what you're craving while supporting local businesses in your area.
                </p>
              </div>
            </div>
          </Link>

          {/* Volunteer card */}
          <Link href="/volunteer/">
            <div className="bg-white border border-gray-200 shadow-md rounded-lg overflow-hidden flex flex-col h-full">
              <div className="aspect-[3/2]">
                <Image
                  src="/images/volunteer.jpg"
                  width={400}
                  height={400}
                  className="w-full h-full object-cover"
                  alt="Volunteer"
                />
              </div>
              <div className="p-4">
                <h2 className="text-base md:text-lg font-semibold mb-2">Volunteer</h2>
                <p className="text-sm text-slate-700 leading-relaxed">
                  Be part of a platform that celebrates local food communities.
                  Share your time and talents to support small restaurants and make an impact.
                </p>
              </div>
            </div>
          </Link>

        </div>
      </div>

      {/* Why Choose Us Section */}
      <section className="flex h-[500px]" style={{ marginTop: "64px" }}>
        <div className="bg-sky-500 w-1/2 flex flex-col justify-center items-center text-center px-16">
          <h2 className="font-bold text-2xl lg:text-3xl text-white mb-6">
            Why Choose Us?
          </h2>
          <p className="text-white text-base mb-6" style={{ margin: "18px", marginTop: "24px" }}>
            We make it easy to discover and order from local restaurants all in one place.
            By combining powerful search tools with real stories from the community, The Local Kitchen helps you find hidden gems, explore new cuisines, and order with confidence.
            Every interaction supports small and underrepresented restaurants, bringing more visibility to the people and cultures behind the food.
          </p>
          <Link href="/about">
            <div className="border text-base text-white font-semibold hover:bg-white hover:text-sky-500" style={{ marginTop: "12px", padding: "16px" }}>
              Learn More About Our Mission
            </div>
          </Link>
        </div>
        <div className="w-1/2">
          <Image
            width={500}
            height={500}
            src="/images/community.jpg"
            alt="Community"
            className="w-full h-full object-cover"
          />
        </div>
      </section>

      {/* Have a Question Section */}
      <div className="bg-sky-800 px-8 py-16" style={{ minHeight: "350px" }}>
        <div className="flex flex-col md:flex-row items-center justify-center gap-12">
          <div className="text-center md:text-left max-w-md" style={{ marginTop: "48px" }}>
            <h2 className="text-3xl lg:text-4xl font-bold text-white mb-6">
              Have a Question?
            </h2>
            <p className="text-base text-white" style={{ marginTop: "24px", marginBottom: "24px" }}>
              We're here with the answer. Fill out the contact form on the next page and we'll get back to you quickly.
            </p>
            <a href="/contact" className="mt-8 inline-block border text-base text-white font-semibold hover:bg-white hover:text-sky-800" style={{ padding: "12px" }}>
              Contact
            </a>
          </div>
          <Image
            width={180}
            height={180}
            src="/images/question-mark.jpg"
            alt="Question Mark"
            className="w-60 h-48 object-cover rounded-xl m-8"
          />
        </div>
      </div>

    </div>
  );
}