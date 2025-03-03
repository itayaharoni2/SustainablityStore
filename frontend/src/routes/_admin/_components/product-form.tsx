import { FileUploader, isFileWithPreview } from "@/components/file-uploader";
import { Button } from "@/components/ui/button";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { addOrEditProduct } from "@/schemas/products";
import { CategoryEnum, Product } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import UploadedFiles from "./uploaded-files";
import { useAddProduct, useEditProduct } from "@/lib/react-query/mutations";
import { toast } from "sonner";
import { absoluteServerUrl } from "@/lib/utils";

export default function ProductForm({
  product,
  type,
}: {
  product?: Product;
  type: "add" | "edit";
}) {
  const form = useForm<z.infer<typeof addOrEditProduct>>({
    resolver: zodResolver(addOrEditProduct),
    defaultValues: {
      name: product?.name,
      description: product?.description,
      price: product?.price ?? 0,
      category: product?.category,
    },
  });

  const { mutateAsync: addProduct } = useAddProduct();
  const { mutateAsync: editProduct } = useEditProduct();

  async function onSubmit(values: z.infer<typeof addOrEditProduct>) {
    let response;

    if (type === "add") {
      response = await addProduct(values);
    }

    if (type === "edit") {
      if (!product?.id) {
        return toast.error("Product ID not found");
      }

      response = await editProduct({ id: product.id, ...values });
    }

    if (response?.success) {
      return toast.success(
        `Product ${type === "add" ? "added" : "updated"} successfully`
      );
    }

    if (response?.error) {
      return toast.error(response.error);
    }

    form.reset();
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Product Name</FormLabel>
              <FormControl>
                <Input placeholder="Enter product name" {...field} />
              </FormControl>
              <FormDescription>
                The name of your product as it will appear to customers.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Enter product description"
                  className="resize-none"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                Provide a detailed description of your product.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="price"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Price</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  placeholder="Enter price"
                  {...field}
                  onChange={(e) => field.onChange(parseFloat(e.target.value))}
                />
              </FormControl>
              <FormDescription>
                Set the price for your product (in dollars).
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="category"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Category</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue
                      className="capitalize"
                      placeholder="Select a category"
                    />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {(
                    Object.keys(CategoryEnum) as Array<
                      keyof typeof CategoryEnum
                    >
                  ).map((key) => (
                    <SelectItem key={key} value={CategoryEnum[key]}>
                      {CategoryEnum[key]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormDescription>
                Choose the category that best fits your product.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="image"
          render={({ field }) => (
            <div className="space-y-6">
              <FormItem className="w-full">
                <FormLabel>Images</FormLabel>
                <FormControl>
                  <FileUploader
                    value={field.value}
                    onValueChange={field.onChange}
                    maxFileCount={1}
                    maxSize={4 * 1024 * 1024}
                  />
                </FormControl>
                <UploadedFiles
                  image={
                    field.value &&
                    field.value.length > 0 &&
                    isFileWithPreview(field.value[0])
                      ? {
                          url: field.value[0].preview,
                          type: "file_preview",
                        }
                      : product?.imageUrl
                      ? {
                          url: absoluteServerUrl(
                            "/uploads/" + product.imageUrl
                          ),
                          type: "uploaded",
                        }
                      : undefined
                  }
                  onChange={field.onChange}
                />
                <FormMessage />
              </FormItem>
            </div>
          )}
        />
        <Button type="submit">
          {product ? "Update Product" : "Add Product"}
        </Button>
      </form>
    </Form>
  );
}
