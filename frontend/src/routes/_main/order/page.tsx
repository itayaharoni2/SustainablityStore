import { useGetUserOrders } from "@/lib/react-query/queries";
import ListOrders from "./list-order";
import { Loader2 } from "lucide-react";
import EmptyState from "@/components/empty-state";

export default function OrdersPage() {
  const { data, isFetching } = useGetUserOrders();

  if (isFetching)
    return (
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
        <Loader2 className="w-10 h-10 animate-spin" />
      </div>
    );

  if (!data || data?.length <= 0) {
    return (
      <EmptyState
        heading="No orders found"
        description="Place an order to continue"
      />
    );
  }

  return <ListOrders data={data} />;
}
