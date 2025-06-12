'use client';

import { useState, useEffect, useCallback } from 'react';
import { getDrivers } from '../lib/api';
import { DriverListItem } from '@/types/driver';

export function useDriverTable(
  initialData: DriverListItem[],
  initialPageIndex: number,
  initialPageSize: number,
  initialTotalItems: number // ✅ importante
) {
  const [data, setData] = useState(initialData);
  const [pageIndex, setPageIndex] = useState(initialPageIndex);
  const [pageSize, setPageSize] = useState(initialPageSize);
  const [isLoading, setIsLoading] = useState(false);
  const [totalItems, setTotalItems] = useState(initialTotalItems); // ✅ usar total inicial

  const fetchData = useCallback(
    async (page?: number, size?: number) => {
      setIsLoading(true);
      try {
        const res = await getDrivers({
          page: page ?? pageIndex,
          size: size ?? pageSize,
        });
        setData(res.drivers);
        setTotalItems(res.totalItems); // ✅ actualizar correctamente
      } finally {
        setIsLoading(false);
      }
    },
    [pageIndex, pageSize]
  );

  useEffect(() => {
    fetchData();
  }, [pageIndex, pageSize, fetchData]);

  return {
    data,
    pageIndex,
    pageSize,
    totalItems,
    isLoading,
    setPageIndex,
    setPageSize,
    fetchData,
  };
}
