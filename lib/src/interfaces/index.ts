export interface VirtualTableItem {
  [key: string]: any;
}

export interface VirtualTableColumn {
  name?: string;
  key: string;
  func?: (item: VirtualTableItem) => any;
  comp?: (a: any, b: any) => number;
  sort?: 'asc' | 'desc' | null;
}

export interface VirtualTableConfig {
  column?: Array<VirtualTableColumn>;
}
