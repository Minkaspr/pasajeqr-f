import { DataTable } from "@/components/data-table";
import data from "./data.json";

export default function PassengerPage() {
  return (
    <div>
      <h1 className="text-xl font-semibold">Panel de Pasajero</h1>
      <p>Aquí puedes administrar pasajeros.</p>
      <DataTable data={data} />
    </div>
  )
}