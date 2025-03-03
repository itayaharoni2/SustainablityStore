import { Product } from "@/types";
import { Link } from "react-router-dom";
import { Card, CardContent } from "./ui/card";
import { absoluteServerUrl } from "@/lib/utils";

const ProductCard = ({ product }: { product: Product }) => {
  return (
    <Card>
      <div className="relative overflow-hidden rounded-lg group">
        <Link to={`/product/${product.id}`} className="absolute inset-0 z-10">
          <span className="sr-only">View</span>
        </Link>
        <img
          src={absoluteServerUrl("/uploads/" + product.imageUrl)}
          alt="Product Image"
          width="400"
          height="300"
          loading="lazy"
          className="object-cover w-full h-60 group-hover:scale-105 transition-transform"
          style={{ aspectRatio: "400/300", objectFit: "cover" }}
        />
        <CardContent className="p-3">
          <div className="bg-background">
            <span className="text-sm text-muted-foreground">
              {product.category}
            </span>
            <h3 className="text-lg font-semibold md:text-xl transition-colors">
              {product.name}
            </h3>
            <p className="text-sm text-muted-foreground line-clamp-2">
              {product.description}
            </p>
            <h4 className="text-base font-semibold md:text-lg">
              ${product.price}
            </h4>
          </div>
        </CardContent>
      </div>
    </Card>
  );
};

export default ProductCard;
