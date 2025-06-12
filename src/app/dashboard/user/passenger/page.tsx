import { DataTable } from "@/components/data-table";
import data from "./data.json";

export default function PassengerPage() {
  return (
    <div>
      <DataTable data={data} />
    </div>
  )
}