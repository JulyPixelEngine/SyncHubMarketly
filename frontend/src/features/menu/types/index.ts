export interface MenuItem {
  id: number;
  menuCode: string;
  name: string;
  icon: string | null;
  parentId: number | null;
  sortOrder: number;
  children: MenuItem[];
}
