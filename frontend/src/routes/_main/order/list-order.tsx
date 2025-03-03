import { cn, dateFormatter } from "@/lib/utils";
import { ChevronDown, Star } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useLeaveReview } from "@/lib/react-query/mutations";
import { reviewSchema } from "@/schemas";
import { Order, OrderItem, Product } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

export default function ListOrders({
  data: orders,
}: {
  data: (Order & {
    items: (OrderItem & { product: Product })[];
  })[];
}) {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Your Orders</h1>
      {orders.map((order, index) => (
        <Card key={order.id} className="mb-4">
          <CardHeader>
            <CardTitle>Order #{index + 1}</CardTitle>
            <CardDescription>
              Placed on {dateFormatter.format(new Date(order.createdAt))}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Collapsible>
              <CollapsibleTrigger asChild>
                <Button variant="ghost" className="flex items-center">
                  Order Details
                  <ChevronDown className="h-4 w-4 ml-2" />
                </Button>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <ul>
                  {order.items.map((item) => (
                    <li
                      key={item.id}
                      className="flex justify-between items-center py-2"
                    >
                      <span>
                        {item.product.name} x {item.quantity}
                      </span>
                      <span>
                        ${(item.product.price * item.quantity).toFixed(2)}
                      </span>
                    </li>
                  ))}
                </ul>
              </CollapsibleContent>
            </Collapsible>
          </CardContent>
          <CardFooter className="flex justify-between">
            <span className="font-bold">Total: ${order.total.toFixed(2)}</span>
            <ReviewDialog orderId={order.id} items={order.items} />
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}

function ReviewDialog({
  orderId,
  items,
}: {
  orderId: string;
  items: (OrderItem & { product: Product })[];
}) {
  const form = useForm<z.infer<typeof reviewSchema>>({
    resolver: zodResolver(reviewSchema),
    defaultValues: {
      productId: items[0].productId,
      orderId: orderId,
      rating: 0,
      comment: "",
    },
  });

  const { mutateAsync: leaveReview, isPending } = useLeaveReview();

  const rating = form.watch("rating");

  const onSubmit = async (values: z.infer<typeof reviewSchema>) => {
    const response = await leaveReview(values);

    if (response.success) {
      form.reset();
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Leave a Review</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Leave a Review</DialogTitle>
          <DialogDescription>
            Share your thoughts on the products you purchased.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="productId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Product</FormLabel>
                  <Select
                    disabled={isPending}
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue
                          className="capitalize"
                          placeholder="Select a Product"
                        />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {items.map((item) => (
                        <SelectItem key={item.id} value={item.productId}>
                          {item.product.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    Select the product you want to review
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex flex-col items-start gap-2">
              <Label htmlFor="rating" className="text-right">
                Rating
              </Label>
              <div className="col-span-3 flex">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={cn(
                      "h-6 w-6 cursor-pointer",
                      star <= rating
                        ? "fill-yellow-400 text-yellow-400"
                        : "text-gray-300",
                      isPending && "pointer-events-none opacity-50"
                    )}
                    onClick={() => form.setValue("rating", star)}
                  />
                ))}
              </div>
            </div>

            <FormField
              control={form.control}
              name="comment"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Comment</FormLabel>

                  <FormControl>
                    <Textarea
                      disabled={isPending}
                      className="col-span-3"
                      {...field}
                    />
                  </FormControl>

                  <FormDescription>
                    Leave your thoughts about the product
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button type="submit">Submit Review</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
