'use client';

import { useDriverTable } from '../hooks/useDriverTable';
import { DriverTable } from '../components/DriverTable';
import { DriverListItem } from '@/types/driver';
import { DriverRefreshProvider } from './DriverRefreshContext';
import { toast } from 'sonner';
import { deleteMultipleDrivers } from '../lib/api';
import { useState } from 'react';

interface Props {
  initialData: DriverListItem[];
  totalItems: number;
  initialPageIndex: number;
  initialPageSize: number;
}

export function DriverTableClient({
  initialData,
  initialPageIndex,
  initialPageSize,
  totalItems,
}: Props) {
  const {
    data,
    pageIndex,
    pageSize,
    setPageIndex,
    setPageSize,
    fetchData,
  } = useDriverTable(initialData, initialPageIndex, initialPageSize, totalItems);

  const [deletingIds, setDeletingIds] = useState<number[]>([]);

  const handlePaginationChange = (newPage: number, newSize: number) => {
    setPageIndex(newPage);
    setPageSize(newSize);
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
      setDeletingIds([]); // ✅ Siempre limpiamos, sin importar el resultado
    }
  };

  return (
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
  );
}
