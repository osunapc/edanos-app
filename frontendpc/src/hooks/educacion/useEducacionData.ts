import { useState, useMemo } from 'react';
import { Evaluation } from '../../type/type';
import { aplicarFiltros } from '../../utils/edanFilterUtils';

export const useEducacionData = (initialData: Evaluation[] = []) => {
  const [data, setData] = useState<Evaluation[]>(initialData);
  const [filters, setFilters] = useState({});

  const filteredData = useMemo(() => {
    if (Object.keys(filters).length === 0) {
      return data;
    }
    return aplicarFiltros(data, filters);
  }, [data, filters]);

  const updateData = (newData: Evaluation[]) => {
    setData(newData);
  };

  return {
    data: filteredData,
    filters,
    setFilters,
    updateData,
    // Mantenemos la misma estructura que el hook original para compatibilidad
    loading: false,
    error: null,
  };
};