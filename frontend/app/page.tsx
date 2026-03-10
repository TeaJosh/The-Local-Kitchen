// frontend/app/page.tsx
export default function Home() {
  return (
    <div className="bg-white dark:bg-black font-sans min-h-screen">
      
      {/* Hero Banner */}
      <div className="w-full relative h-[500px] md:h-[500px] lg:h-[500px] bg-white dark:bg-black">
      <video
        src="/tlk-video.mp4"
        autoPlay
        loop
        muted
        className="w-full h-full object-cover absolute inset-0 z-0"
      />

      {/* Text overlay */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4 -translate-y-36">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white max-w-3xl">
          The Local Kitchen, Your Gateway to Global Flavors.
        </h1>
      </div>
      </div>

      {/* How It Works */}
      <section className="pt-24 pb-12 px-4 text-center bg-white dark:bg-black">
        <h2 className="text-3xl md:text-4xl font-semibold mb-12">How It Works</h2>
        <div className="flex flex-col md:flex-row justify-center gap-6 md:gap-8">

          {/* Card 1 */}
          <div className="bg-orange-500 text-white rounded-xl p-8 flex-1 max-w-xs mx-auto shadow-lg hover:shadow-2xl transition-transform hover:-translate-y-2">
            <div className="mb-4 text-3xl md:text-4xl">📍</div>
            <h3 className="font-semibold mb-2 text-lg md:text-xl">Find Restaurants</h3>
            <p className="text-sm md:text-base">
              Browse our curated list of local favorites.
            </p>
          </div>

          {/* Card 2 */}
          <div className="bg-orange-500 text-white rounded-xl p-8 flex-1 max-w-xs mx-auto shadow-lg hover:shadow-2xl transition-transform hover:-translate-y-2">
            <div className="mb-4 text-3xl md:text-4xl">📰</div>
            <h3 className="font-semibold mb-2 text-lg md:text-xl">Blog</h3>
            <p className="text-sm md:text-base">
              Stay updated with the latest local food reviews and news.
            </p>
          </div>

          {/* Card 3 */}
          <div className="bg-orange-500 text-white rounded-xl p-8 flex-1 max-w-xs mx-auto shadow-lg hover:shadow-2xl transition-transform hover:-translate-y-2">
            <div className="mb-4 text-3xl md:text-4xl">🛒</div>
            <h3 className="font-semibold mb-2 text-lg md:text-xl">Order</h3>
            <p className="text-sm md:text-base">
              Select dishes, quantity, and order.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
