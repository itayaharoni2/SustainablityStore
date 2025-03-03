import EmptyState from "@/components/empty-state";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useDeleteProduct } from "@/lib/react-query/mutations";
import { useGetAdminProducts } from "@/lib/react-query/queries";
import { absoluteServerUrl } from "@/lib/utils";
import { Pencil, PlusCircle, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "sonner";

export default function ManageProductPage() {
  const { data: products, refetch } = useGetAdminProducts();

  const { mutateAsync: deleteProduct, isPending } = useDeleteProduct();

  return (
    <div className="space-y-6 w-full">
      <div className="flex justify-end items-center">
        <Link to="/admin/product/add" className={buttonVariants()}>
          <PlusCircle className="mr-2 h-4 w-4" /> Add Product
        </Link>
      </div>

      <div className="space-y-4">
        {products && products.length > 0 ? (
          products.map((product) => (
            <Card key={product.id}>
              <CardContent className="p-4">
                <div className="flex flex-col sm:flex-row text-center sm:text-left items-center space-x-4">
                  <img
                    src={absoluteServerUrl("/uploads/" + product.imageUrl)}
                    alt={product.name}
                    className="w-24 h-24 rounded-md object-cover"
                  />
                  <div className="flex-grow">
                    <h3 className="text-lg font-semibold">{product.name}</h3>
                    <p className="text-sm text-gray-500">{product.category}</p>
                    <p className="text-lg font-bold">
                      ${product.price.toFixed(2)}
                    </p>
                  </div>
                  <div className="flex space-x-2">
                    <Link
                      to={`/admin/product/edit/${product.id}`}
                      className={buttonVariants({
                        size: "sm",
                        variant: "outline",
                      })}
                    >
                      <Pencil className="h-4 w-4 mr-2" /> Edit
                    </Link>
                    <Button
                      onClick={async () => {
                        const response = await deleteProduct(product.id);

                        if (response.success) {
                          toast.success("Product deleted successfully");
                          refetch();
                        } else {
                          toast.error(response.error);
                        }
                      }}
                      size="sm"
                      variant="outline"
                      className="text-red-500 hover:text-red-700"
                      disabled={isPending}
                    >
                      <Trash2 className="h-4 w-4 mr-2" /> Delete
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <EmptyState
            heading="No Products Found"
            description="Create a product to continue"
          />
        )}
      </div>
    </div>
  );
}
