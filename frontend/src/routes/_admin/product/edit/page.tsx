import { useGetProductById } from "@/lib/react-query/queries";
import ProductForm from "../../_components/product-form";
import { useParams } from "react-router-dom";

export default function AddProduct() {
  const { id } = useParams();

  const { data: product, isPending } = useGetProductById(id ?? "");

  if (isPending) return <p>Loading...</p>;

  if (!product) return <p>Product not found</p>;

  return <ProductForm type="edit" product={product} />;
}
