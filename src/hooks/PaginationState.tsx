import { useState } from 'react';

export interface PaginationStatesReturn {
  allRows: number;
  setAllRows: (newState: number) => void;
  limit: number;
  setLimit: (newState: number) => void;
}

export const usePaginationStates = (
  initialLimit?: number
): PaginationStatesReturn => {
  const [allRows, setAllRows] = useState<number>(0);
  const [limit, setLimit] = useState<number>(initialLimit || 10);

  return {
    allRows,
    setAllRows,
    limit,
    setLimit
  };
};
