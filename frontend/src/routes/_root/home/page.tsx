import EmptyState from "@/components/empty-state";
import { MaxWidthWrapper } from "@/components/max-width-wrapper";
import ProductCard from "@/components/product-card";
import ProductSkeleton from "@/components/product-skeleton";
import { buttonVariants } from "@/components/ui/button";
import { useUserContext } from "@/context/auth-context";
import { useGetProducts } from "@/lib/react-query/queries";
import { CheckCircle, PersonStanding, Sprout } from "lucide-react";
import { Link } from "react-router-dom";

export default function HomePage() {
  const { user } = useUserContext();

  const { data: products } = useGetProducts(user?.category);

  const PERKS = [
    {
      name: "Eco-Friendly Products",
      description:
        "Our store offers a wide range of eco-friendly products, helping you reduce your carbon footprint and contribute to a healthier planet.",
      Icon: Sprout,
    },
    {
      name: "Ethical Sourcing",
      description:
        "All of our products are ethically sourced, ensuring fair labor practices and support for sustainable communities.",
      Icon: CheckCircle,
    },
    {
      name: "Exceptional Customer Service",
      description:
        "Our friendly and knowledgeable staff is dedicated to providing you with the best possible customer experience, from product recommendations to after-sales support.",
      Icon: PersonStanding,
    },
  ];

  return (
    <section>
      <MaxWidthWrapper className="relative">
        <div className="box-content -z-10 inset-0 absolute">
          <img
            className="object-fit w-full h-full inset-0 absolute"
            src="https://preview.cruip.com/appy/images/hero-bg-03.jpg"
            alt="About"
          />
          <div className="bg-black/75 absolute inset-0" aria-hidden="true" />
        </div>
        <div className="py-20 mx-auto text-center flex flex-col items-center max-w-3xl">
          <h1 className="text-4xl font-bold tracking-tight text-white sm:text-6xl">
            Eco-Friendly Choices for a{" "}
            <span className="text-green-600">Greener</span> Tomorrow.
          </h1>
          <p className="mt-6 text-lg max-w-prose text-gray-200">
            Discover sustainable products that care for the planet. From
            eco-friendly essentials to innovative green solutions, we’re here to
            help you make a positive impact with every purchase.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 mt-6">
            <Link to="/shop" className={buttonVariants()}>
              Browse Products
            </Link>
            <Link
              to="/learn-more"
              className={buttonVariants({
                variant: "ghost",
                className: "text-white",
              })}
            >
              Learn More &rarr;
            </Link>
          </div>
        </div>
      </MaxWidthWrapper>

      <section className="border-t border-gray-200 bg-gray-50">
        <MaxWidthWrapper className="py-20">
          <div className="grid grid-cols-1 gap-y-12 sm:grid-cols-2 sm:gap-x-6 lg:grid-cols-3 lg:gap-x-8 lg:gap-y-0">
            {PERKS.map((perk, index) => (
              <div
                key={perk.name + index}
                className="text-center md:flex md:items-start md:text-left lg:block lg:text-center"
              >
                <div className="md:flex-shrink-0 flex justify-center">
                  <div className="h-16 w-16 flex items-center justify-center rounded-full bg-green-100 text-green-500">
                    <perk.Icon className="w-1/3 h-1/3" />
                  </div>
                </div>
                <div className="mt-6 md:ml-4 md:mt-0 lg:ml-0 lg:mt-6">
                  <h3 className="text-base font-medium text-gray-900">
                    {perk.name}
                  </h3>
                  <p className="mt-3 text-sm text-muted-foreground">
                    {perk.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </MaxWidthWrapper>
      </section>
      <section className="py-8">
        <MaxWidthWrapper className="py-6 flex justify-center items-center">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
            Trending Items
          </h1>
        </MaxWidthWrapper>
        <MaxWidthWrapper className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-8">
          {products && products.length === 0 ? (
            <EmptyState
              heading="No Products Found"
              description="No Products to display"
            />
          ) : products ? (
            products?.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))
          ) : (
            new Array(8)
              .fill(null)
              .map((_, index) => <ProductSkeleton key={"ps" + index} />)
          )}
        </MaxWidthWrapper>
      </section>
    </section>
  );
}
