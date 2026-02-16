import { useState, useEffect } from 'react';
import { fetchMenus } from '../api/menuApi';
import { MenuItem } from '../types';

export function useMenus() {
  const [menus, setMenus] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchMenus()
      .then((data) => {
        setMenus(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  return { menus, loading, error };
}
