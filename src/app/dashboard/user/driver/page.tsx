import { DriverTableClient } from "./client/DriverTableClient";
import { getDrivers } from "./lib/api";

export default async function DriverPage() {
  const pageIndex = 0;
  const pageSize = 10;
  const { drivers, currentPage, totalItems } = await getDrivers({ page: pageIndex, size: pageSize });

  return (
    <DriverTableClient
      initialData={drivers}
      totalItems={totalItems}
      initialPageIndex={currentPage}
      initialPageSize={pageSize}
    />
  );
}