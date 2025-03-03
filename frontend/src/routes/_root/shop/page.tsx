import EmptyState from "@/components/empty-state";
import ProductCard from "@/components/product-card";
import ProductSkeleton from "@/components/product-skeleton";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Slider } from "@/components/ui/slider";
import { useGetProductsByFilters } from "@/lib/react-query/queries";
import { cn } from "@/lib/utils";
import { ProductState } from "@/schemas/products";
import { CategoryEnum } from "@/types";
import debounce from "lodash.debounce";
import { ChevronDown, Filter, Loader2 } from "lucide-react";
import { useCallback, useEffect, useState } from "react";

const SORT_OPTIONS = [
  { name: "None", value: "none" },
  { name: "Price: Low to High", value: "price-asc" },
  { name: "Price: High to Low", value: "price-desc" },
] as const;

const CATEGORIES = Object.keys(CategoryEnum).map((key) => ({
  name: CategoryEnum[key as keyof typeof CategoryEnum] as CategoryEnum | "All",
  selected: false,
}));

CATEGORIES.unshift({ name: "All", selected: true });

const PRICE_FILTERS = {
  id: "price",
  name: "Price",
  options: [
    {
      value: [0, 100],
      label: "Any price",
    },
    {
      value: [0, 20],
      label: "Under $20",
    },
    {
      value: [0, 40],
      label: "Under $40",
    },
  ],
} as const;

const DEFAULT_CUSTOM_PRICE = [0, 10000] as [number, number];

export default function ShopPage() {
  const [filter, setFilter] = useState<ProductState>({
    category: CATEGORIES[0],
    price: { isCustom: false, range: DEFAULT_CUSTOM_PRICE },
    sort: "none",
    page: 1,
    pageSize: 9,
  });

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, refetch } =
    useGetProductsByFilters(filter);

  const onSubmit = () => refetch();
  const debouncedSubmit = debounce(onSubmit, 400);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const _debouncedSubmit = useCallback(debouncedSubmit, []);

  useEffect(() => {
    onSubmit();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter]);

  const minPrice = Math.min(
    filter.price.range[0],
    filter.price.range[1]
  ).toFixed(0);
  const maxPrice = Math.max(
    filter.price.range[0],
    filter.price.range[1]
  ).toFixed(0);

  const products = data?.pages.flatMap((page) => page.products);

  return (
    <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div className="flex items-baseline justify-between border-b border-gray-200 pb-6 pt-24">
        <h1 className="text-xl sm:text-4xl font-bold tracking-tight text-gray-900">
          The Sustainable Lifestyle
        </h1>

        <div className="flex items-center">
          <DropdownMenu>
            <DropdownMenuTrigger className="group inline-flex jus\ text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors">
              Sort
              <ChevronDown className="-mr-1 ml-1 h-5 w-5 flex-shrink-0 text-gray-400 group-hover:text-gray-500 transition-colors" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {SORT_OPTIONS.map((option) => (
                <button
                  key={option.value}
                  className={cn(
                    "text-left w-full block px-4 py-2 text-sm",
                    option.value === filter.sort
                      ? "text-gray-900 bg-gray-100"
                      : "text-gray-500 hover:bg-gray-50"
                  )}
                  onClick={() =>
                    setFilter((prev) => ({ ...prev, sort: option.value }))
                  }
                >
                  {option.name}
                </button>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <Sheet>
            <SheetTrigger className="lg:hidden">
              <button className="p-2 text-gray-400 hover:text-gray-500 sm:ml-6">
                <Filter className="h-5 w-5" />
              </button>
            </SheetTrigger>
            <SheetContent side="right">
              <div>
                <ul className="space-y-4 border-b border-gray-200 pb-6 text-sm font-medium text-gray-900">
                  {CATEGORIES.map((category) => (
                    <li key={category.name}>
                      <button
                        onClick={() => {
                          setFilter((prev) => ({
                            ...prev,
                            category: {
                              name: category.name,
                              selected: true,
                            },
                          }));
                          _debouncedSubmit();
                        }}
                        className={cn(
                          "opacity-60 hover:opacity-100",
                          filter.category.name === category.name &&
                            filter.category.selected &&
                            "opacity-100"
                        )}
                      >
                        {category.name}
                      </button>
                    </li>
                  ))}
                </ul>

                <Accordion type="multiple" className="animate-none">
                  {/* price */}
                  <AccordionItem value="price">
                    <AccordionTrigger className="py-3 text-sm text-gray-400 hover:text-gray-500">
                      <span className="font-medium text-gray-900">Price</span>
                    </AccordionTrigger>
                    <AccordionContent className="py-6 animate-none">
                      <ul className="space-y-4">
                        {PRICE_FILTERS.options.map((option, optionIdx) => (
                          <li key={option.label} className="flex items-center">
                            <input
                              type="radio"
                              id={`price-${optionIdx}`}
                              onChange={() => {
                                setFilter((prev) => ({
                                  ...prev,
                                  price: {
                                    isCustom: false,
                                    range: [...option.value],
                                  },
                                }));
                                _debouncedSubmit();
                              }}
                              checked={
                                !filter.price.isCustom &&
                                filter.price.range[0] === option.value[0] &&
                                filter.price.range[1] === option.value[1]
                              }
                              className="h-4 w-4 rounded border-gray-400 text-green-600 focus:ring-green-500 accent-current"
                            />
                            <label
                              htmlFor={`price-${optionIdx}`}
                              className="ml-3 text-sm text-gray-600"
                            >
                              {option.label}
                            </label>
                          </li>
                        ))}
                        <li className="flex justify-center flex-col gap-2">
                          <div className="flex items-center">
                            <input
                              type="radio"
                              id={`price-${PRICE_FILTERS.options.length}`}
                              onChange={() => {
                                setFilter((prev) => ({
                                  ...prev,
                                  price: {
                                    isCustom: true,
                                    range: [0, 100],
                                  },
                                }));
                                _debouncedSubmit();
                              }}
                              checked={filter.price.isCustom}
                              className="h-4 w-4 rounded border-gray-400 text-green-600 focus:ring-green-500 accent-current	"
                            />
                            <label
                              htmlFor={`price-${PRICE_FILTERS.options.length}`}
                              className="ml-3 text-sm text-gray-600"
                            >
                              Custom
                            </label>
                          </div>

                          <div className="flex justify-between">
                            <p className="font-medium">Price</p>
                            <div className="">
                              {filter.price.isCustom
                                ? minPrice
                                : filter.price.range[0].toFixed(0)}{" "}
                              $ -{" "}
                              {filter.price.isCustom
                                ? maxPrice
                                : filter.price.range[1].toFixed(0)}{" "}
                              $
                            </div>
                          </div>

                          <Slider
                            className={cn(
                              !filter.price.isCustom && "opacity-50"
                            )}
                            disabled={!filter.price.isCustom}
                            onValueChange={(range) => {
                              const [newMin, newMax] = range;
                              setFilter((prev) => ({
                                ...prev,
                                price: {
                                  isCustom: true,
                                  range: [newMin, newMax],
                                },
                              }));
                            }}
                            value={
                              filter.price.isCustom
                                ? filter.price.range
                                : DEFAULT_CUSTOM_PRICE
                            }
                            min={DEFAULT_CUSTOM_PRICE[0]}
                            defaultValue={DEFAULT_CUSTOM_PRICE}
                            max={DEFAULT_CUSTOM_PRICE[1]}
                            step={5}
                          />
                        </li>
                      </ul>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      <section className="pb-24 pt-6">
        <div className="grid grid-cols-1 gap-x-8 gap-y-10 lg:grid-cols-4">
          {/* Filters */}
          <div className="hidden lg:block">
            <ul className="space-y-4 border-b border-gray-200 pb-6 text-sm font-medium text-gray-900">
              {CATEGORIES.map((category) => (
                <li key={category.name}>
                  <button
                    onClick={() => {
                      setFilter((prev) => ({
                        ...prev,
                        category: {
                          name: category.name,
                          selected: true,
                        },
                      }));
                      _debouncedSubmit();
                    }}
                    className={cn(
                      "opacity-60 hover:opacity-100",
                      filter.category.name === category.name &&
                        filter.category.selected &&
                        "opacity-100"
                    )}
                  >
                    {category.name}
                  </button>
                </li>
              ))}
            </ul>

            <Accordion type="multiple" className="animate-none">
              {/* price */}
              <AccordionItem value="price">
                <AccordionTrigger className="py-3 text-sm text-gray-400 hover:text-gray-500">
                  <span className="font-medium text-gray-900">Price</span>
                </AccordionTrigger>
                <AccordionContent className="py-6 animate-none">
                  <ul className="space-y-4">
                    {PRICE_FILTERS.options.map((option, optionIdx) => (
                      <li key={option.label} className="flex items-center">
                        <input
                          type="radio"
                          id={`price-${optionIdx}`}
                          onChange={() => {
                            setFilter((prev) => ({
                              ...prev,
                              price: {
                                isCustom: false,
                                range: [...option.value],
                              },
                            }));
                            _debouncedSubmit();
                          }}
                          checked={
                            !filter.price.isCustom &&
                            filter.price.range[0] === option.value[0] &&
                            filter.price.range[1] === option.value[1]
                          }
                          className="h-4 w-4 rounded border-gray-400 text-green-600 focus:ring-green-500 accent-current"
                        />
                        <label
                          htmlFor={`price-${optionIdx}`}
                          className="ml-3 text-sm text-gray-600"
                        >
                          {option.label}
                        </label>
                      </li>
                    ))}
                    <li className="flex justify-center flex-col gap-2">
                      <div className="flex items-center">
                        <input
                          type="radio"
                          id={`price-${PRICE_FILTERS.options.length}`}
                          onChange={() => {
                            setFilter((prev) => ({
                              ...prev,
                              price: {
                                isCustom: true,
                                range: [0, 100],
                              },
                            }));
                            _debouncedSubmit();
                          }}
                          checked={filter.price.isCustom}
                          className="h-4 w-4 rounded border-gray-400 text-green-600 focus:ring-green-500 accent-current	"
                        />
                        <label
                          htmlFor={`price-${PRICE_FILTERS.options.length}`}
                          className="ml-3 text-sm text-gray-600"
                        >
                          Custom
                        </label>
                      </div>

                      <div className="flex justify-between">
                        <p className="font-medium">Price</p>
                        <div className="">
                          {filter.price.isCustom
                            ? minPrice
                            : filter.price.range[0].toFixed(0)}{" "}
                          $ -{" "}
                          {filter.price.isCustom
                            ? maxPrice
                            : filter.price.range[1].toFixed(0)}{" "}
                          $
                        </div>
                      </div>

                      <Slider
                        className={cn(!filter.price.isCustom && "opacity-50")}
                        disabled={!filter.price.isCustom}
                        onValueChange={(range) => {
                          const [newMin, newMax] = range;
                          setFilter((prev) => ({
                            ...prev,
                            price: {
                              isCustom: true,
                              range: [newMin, newMax],
                            },
                          }));
                        }}
                        value={
                          filter.price.isCustom
                            ? filter.price.range
                            : DEFAULT_CUSTOM_PRICE
                        }
                        min={DEFAULT_CUSTOM_PRICE[0]}
                        defaultValue={DEFAULT_CUSTOM_PRICE}
                        max={DEFAULT_CUSTOM_PRICE[1]}
                        step={5}
                      />
                    </li>
                  </ul>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>

          {/* Products */}
          <ul className="lg:col-span-3 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
            {products && products.length === 0 ? (
              <EmptyState
                heading="No Products Found"
                description="No results match these filter"
              />
            ) : products ? (
              products?.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))
            ) : (
              new Array(12)
                .fill(null)
                .map((_, index) => <ProductSkeleton key={"ps" + index} />)
            )}
            {hasNextPage && (
              <div className="flex items-center justify-center lg:col-span-3">
                <Button
                  onClick={() => fetchNextPage()}
                  disabled={isFetchingNextPage}
                >
                  {isFetchingNextPage && (
                    <Loader2 size={16} className="animate-spins" />
                  )}
                  {isFetchingNextPage ? "Loading more..." : "Load More"}
                </Button>
              </div>
            )}
          </ul>
        </div>
      </section>
    </main>
  );
}
