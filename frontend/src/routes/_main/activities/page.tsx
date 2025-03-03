import { DataTable } from "@/components/table";
import { useCurrentUserActivities } from "@/lib/react-query/queries";

export default function CurrentUserActivitiesPage() {
  const { data } = useCurrentUserActivities();

  if (!data) return null;

  return <DataTable data={data} />;
}
