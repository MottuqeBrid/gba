import Image from "next/image";

export default function MessagesSection() {
  return (
    <section className="w-full py-16 md:py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-12 md:mb-16 max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-linear-to-r from-(--color-primary) to-(--color-secondary)">
            Insights &amp; Messages
          </h2>
          <p className="text-(--text-secondary) mb-6 leading-relaxed">
            Explore our latest gatherings, seminars, and activities designed to
            strengthen our community and foster new connections.
          </p>
        </div>

        <div className="flex flex-col gap-8">
          {/* Featured Message - Advisor */}
          <div className="card flex flex-col lg:flex-row overflow-hidden group">
            <div className="relative w-full lg:w-2/5 h-64 lg:h-auto overflow-hidden">
              <Image
                src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ1oC-FsAnIQJ_unIMLzkOsn0MHSI4agxEPbA&s"
                alt="Advisor"
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
                sizes="(max-width: 1024px) 100vw, 40vw"
              />
            </div>
            <div className="p-8 lg:p-12 flex flex-col justify-center flex-1">
              <h3 className="text-2xl md:text-3xl font-bold mb-4 text-(--color-secondary)">
                Message from Advisor
              </h3>
              <p className="text-(--text-secondary) mb-6 leading-relaxed">
                &quot;Our community thrives on the dedication and passion of its
                members. Together, we are building a legacy of excellence and
                mutual support that will inspire generations to come.&quot;
              </p>
              <div>
                {/* <button className="btn btn-primary px-6">
                  Read Full Message
                </button> */}
              </div>
            </div>
          </div>

          {/* Secondary Messages - Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* President Message 1 */}
            <div className="card flex flex-col overflow-hidden group h-full">
              <div className="relative w-full h-64 overflow-hidden">
                <Image
                  src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ1oC-FsAnIQJ_unIMLzkOsn0MHSI4agxEPbA&s"
                  alt="President"
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>
              <div className="p-8 flex flex-col grow">
                <h3 className="text-xl md:text-2xl font-bold mb-3 text-(--text-primary)">
                  Message from President
                </h3>
                <p className="text-(--text-secondary) mb-6 grow">
                  Explore our latest gatherings, seminars, and activities
                  designed to strengthen our community and foster new
                  connections.
                </p>
                {/* <button className="btn btn-outline w-full sm:w-auto self-start">
                  Read Message
                </button> */}
              </div>
            </div>

            {/* President Message 2 */}
            <div className="card flex flex-col overflow-hidden group h-full">
              <div className="relative w-full h-64 overflow-hidden">
                <Image
                  src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ1oC-FsAnIQJ_unIMLzkOsn0MHSI4agxEPbA&s"
                  alt="Vice President"
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>
              <div className="p-8 flex flex-col grow">
                <h3 className="text-xl md:text-2xl font-bold mb-3 text-(--text-primary)">
                  Message from Vice President
                </h3>
                <p className="text-(--text-secondary) mb-6 grow">
                  Join us in our mission to create impact and drive positive
                  change across our network through collaboration and
                  innovation.
                </p>
                {/* <button className="btn btn-outline w-full sm:w-auto self-start">
                  Read Message
                </button> */}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
