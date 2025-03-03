import EmptyState from "@/components/empty-state";
import { MaxWidthWrapper } from "@/components/max-width-wrapper";
import ProductCard from "@/components/product-card";
import ProductSkeleton from "@/components/product-skeleton";
import { Input } from "@/components/ui/input";
import { useSearchProducts } from "@/lib/react-query/queries";
import { useState, useEffect, useRef } from "react";

export default function SearchResults() {
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState(searchQuery);
  const debounceTimeout = useRef<NodeJS.Timeout>();

  useEffect(() => {
    // Set a new timeout to update the debounced query
    debounceTimeout.current = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 500); // Adjust the debounce delay as needed (300ms in this example)

    // Cleanup function to clear timeout on component unmount or when searchQuery changes
    return () => {
      clearTimeout(debounceTimeout.current);
    };
  }, [searchQuery]);

  const { data, isFetching } = useSearchProducts({
    q: debouncedQuery, // Use the debounced query here
    page: 1,
    pageSize: 12,
  });

  const products = data?.products;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">
        {debouncedQuery
          ? `Search Results for "${debouncedQuery}"`
          : "Search Products"}
      </h1>

      <div className="flex gap-4 mb-8">
        <Input
          type="text"
          placeholder="Search products..."
          value={searchQuery}
          disabled={isFetching}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="flex-grow"
        />
      </div>

      <MaxWidthWrapper className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-8">
        {!debouncedQuery ? (
          <EmptyState
            heading="No Product to Display"
            description="Enter a search term to find products"
          />
        ) : null}

        {products && products.length === 0 ? (
          <EmptyState
            heading="No Products Found"
            description="No Products to display"
          />
        ) : products ? (
          products?.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))
        ) : null}
        {isFetching
          ? new Array(8)
              .fill(null)
              .map((_, index) => <ProductSkeleton key={"ps" + index} />)
          : null}
      </MaxWidthWrapper>
    </div>
  );
}
