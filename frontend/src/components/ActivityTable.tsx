import { AgGridReact } from 'ag-grid-react';
import { AllCommunityModule, ModuleRegistry, ColDef } from 'ag-grid-community';

ModuleRegistry.registerModules([AllCommunityModule]);


export interface ActivityItem {
  id: string;
  user: string;
  action: string;
  target: string;
  date: string;
}

interface ActivityTableProps {
  items: ActivityItem[];
}

const columnDefs: ColDef<ActivityItem>[] = [
  { field: 'user',   headerName: 'User',   flex: 1 },
  { field: 'action', headerName: 'Action', flex: 1 },
  { field: 'target', headerName: 'Target', flex: 2 },
  { field: 'date',   headerName: 'Date',   flex: 1 },
];

export function ActivityTable({ items }: ActivityTableProps) {
  console.log(
    "ActivityTable items : ", items
  );
  return (
    <div style={{ height: 400 }}>
      <AgGridReact
        rowData={items}
        columnDefs={columnDefs}
        rowSelection={{ mode: "multiRow" }}
      />
    </div>

  );
}
