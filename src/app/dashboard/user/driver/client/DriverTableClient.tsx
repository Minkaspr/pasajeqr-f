'use client';

import { DriverTable } from '../components/DriverTable';
import { DriverListItem } from '@/types/driver';
import { DriverRefreshProvider } from './DriverRefreshContext';
import { toast } from 'sonner';
import { deleteMultipleDrivers, getDrivers } from '../lib/api';
import { useCallback, useEffect, useState } from 'react';

export function DriverTableClient() {
  const initialPageIndex = 0;
  const initialPageSize = 10;

  const [data, setData] = useState<DriverListItem[]>([]);
  const [pageIndex, setPageIndex] = useState(initialPageIndex);
  const [pageSize, setPageSize] = useState(initialPageSize);
  const [totalItems, setTotalItems] = useState(0);
  const [deletingIds, setDeletingIds] = useState<number[]>([]);

  const fetchData = useCallback(
    async (page: number = pageIndex, size: number = pageSize): Promise<void> => {
      try {
        const res = await getDrivers({ page, size });
        setData(res.drivers);
        setTotalItems(res.totalItems);
      } catch (error) {
        console.error("Error al cargar los conductores", error);
      }
    },
    [pageIndex, pageSize]
  );

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handlePaginationChange = (newPage: number, newSize: number) => {
    setPageIndex(newPage);
    setPageSize(newSize);
    fetchData(newPage, newSize);
  };

  const handleDeleteSelected = async (ids: number[]) => {
    setDeletingIds(ids);
    try {
      await deleteMultipleDrivers({ driverIds: ids });
      toast.success("Conductores eliminados correctamente");
      await fetchData(pageIndex, pageSize);
    } catch (error) {
      toast.error("Error al eliminar los conductores");
      console.error(error);
    } finally {
      setDeletingIds([]);
    }
  };

  return (
    <div className="@container px-2 sm:px-4 md:px-6">
      <DriverRefreshProvider value={fetchData}>
        <DriverTable
          data={data}
          totalItems={totalItems}
          pageIndex={pageIndex}
          pageSize={pageSize}
          onPaginationChange={handlePaginationChange}
          onDeleteSelected={handleDeleteSelected}
          deletingIds={deletingIds}
        />
      </DriverRefreshProvider>
    </div>
  );
}
