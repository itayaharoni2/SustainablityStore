import { useUsersActivities } from "@/lib/react-query/queries";
import { DataTable } from "@/components/table";

export default function UserActivities() {
  const { data } = useUsersActivities();

  if (!data) return null;

  return <DataTable data={data} />;
}
