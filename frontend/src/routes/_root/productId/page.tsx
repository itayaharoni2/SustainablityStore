import AddToCartButton from "@/components/add-to-cart-button";
import { useGetProductById } from "@/lib/react-query/queries";
import { absoluteServerUrl } from "@/lib/utils";
import { useParams } from "react-router-dom";

export default function ProductIdPage() {
  const { id } = useParams();

  const { data: product } = useGetProductById(id ?? "");

  if (!product) {
    return <p>Product Not Found!</p>;
  }

  return (
    <div className="grid md:grid-cols-2 gap-6 lg:gap-12 items-start max-w-6xl px-4 mx-auto py-6">
      <div className="grid gap-4">
        <img
          src={absoluteServerUrl("/uploads/" + product.imageUrl)}
          alt="Product Image"
          className="aspect-square object-cover border w-full rounded-lg overflow-hidden"
        />
      </div>
      <div className="grid gap-4 md:gap-10 items-start">
        <div className="grid gap-2">
          <h1 className="font-bold text-3xl lg:text-4xl">{product.name}</h1>
          <div className="flex items-center gap-4">
            <div className="bg-primary px-3 py-1 rounded-lg text-primary-foreground text-sm font-medium">
              {product.category}
            </div>
            <div className="text-4xl font-bold">${product.price}</div>
          </div>
          <div>
            <p className="text-muted-foreground">{product.description}</p>
          </div>
          <div className="bg-muted rounded-lg p-4">
            <h3 className="font-bold text-lg">Shipping & Returns</h3>
            <p className="mt-2 text-muted-foreground">
              Free shipping on all orders over $50. 30-day returns for any
              reason.
            </p>
          </div>
          <AddToCartButton product={product} />
        </div>
      </div>
    </div>
  );
}
