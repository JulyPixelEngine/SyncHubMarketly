import { apiClient } from '../../../shared/lib/apiClient';
import { MenuItem } from '../types';

export function fetchMenus(): Promise<MenuItem[]> {
  return apiClient<MenuItem[]>('/menus');
}
