export default function AboutPage() {
  return (
    <section className="relative">
      <div className="h-96 box-content -z-10 inset-0 absolute">
        <img
          className="opacity-50 object-cover w-full h-full inset-0 aboslute"
          src="https://preview.cruip.com/appy/images/hero-bg-03.jpg"
          alt="About"
        />
        <div
          className="bg-gradient-to-t from-white to-white/0 inset-0 absolute"
          aria-hidden="true"
        />
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:py-6 relative">
        <div className="pt-32 pb-12 md:pt-40 md:pb-20">
          <div className="text-center">
            <div className="relative flex items-center justify-center">
              <div className="relative inline-flex items-start">
                <img
                  width="768"
                  height="432"
                  src="https://preview.cruip.com/appy/images/about-hero.jpg"
                  alt="About hero"
                />
                <div
                  className="bg-gradient-to-t from-white to-white/0 inset-0 absolute"
                  aria-hidden="true"
                />
              </div>
              <div className="absolute">
                <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tighter">
                  Make your own <span className="text-green-500">way</span>
                </h1>
              </div>
              <div
                className="h-12 w-0.5 absolute bottom-0 -mb-8 bg-zinc-300	"
                aria-hidden="true"
              />
            </div>
          </div>
        </div>
      </div>
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <h1 className="text-3xl font-bold mb-6 text-center">About Us</h1>

        <section className="mb-12">
          <p className="text-lg mb-4">
            Welcome to our Sustainable Lifestyle Store! We are passionate about
            promoting sustainability and helping individuals make conscious
            choices to reduce their environmental impact. Our goal is to provide
            you with the tools, products, and knowledge you need to lead a more
            sustainable lifestyle, from reducing plastic use to conserving
            energy and minimizing food waste.
          </p>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">Meet Itay Aharoni</h2>
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
            <img
              src="/itay.jpg"
              alt="Itay Aharoni"
              width={200}
              height={200}
              className="rounded-full object-cover object-top aspect-square"
            />
            <div>
              <p className="mb-4">
                Hi, I'm Itay Aharoni, a third-year computer science student from
                Israel, deeply committed to environmental sustainability and
                technology. My passion for the environment grew significantly
                last year when I joined the "GreenBiz" club at Reichman
                University.
              </p>
              <p className="mb-4">
                Each week, we engaged in discussions about innovative solutions
                to help save the planet, explored the current state of our
                environment, and learned about the urgent changes needed for a
                sustainable future. These experiences opened my eyes to the
                pressing environmental issues we face and the role we can play
                in addressing them.
              </p>
              <p>
                When I'm not coding, you can find me enjoying nature through
                activities like surfing, free diving, and scuba diving. I
                believe that small changes can lead to significant impacts,
                which is why I created this platform. By combining my love for
                technology with a dedication to sustainability, I aim to empower
                others to make informed, eco-friendly choices that contribute to
                a healthier planet.
              </p>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">Meet Michael Ohayon</h2>
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
            <img
              src="/michael.jpeg"
              alt="Michael Ohayon"
              width={200}
              height={200}
              className="rounded-full object-cover object-top aspect-square"
            />
            <div>
              <p className="mb-4">
                I'm Michael Ohayon, a 26-year-old computer science student
                living in Jerusalem. My strong passion for sustainability drives
                me to protect the environment and help people adopt greener,
                more eco-friendly lifestyles.
              </p>
              <p>
                This online store offers sustainable options that make it easier
                for everyone to reduce their carbon footprint and take care of
                the planet. With a focus on quality, ethics, and environmental
                responsibility, our store is designed to be the perfect place
                for anyone looking to make conscious, eco-friendly choices in
                their daily lives.
              </p>
            </div>
          </div>
        </section>
      </div>
    </section>
  );
}
