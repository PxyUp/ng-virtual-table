import { Type } from '@angular/core';

export interface VirtualTableItem {
  [key: string]: any;
}

export type sortColumn = 'asc' | 'desc' | null | false;

export interface VirtualTableColumn {
  name?: string;
  key: string;
  func?: (item: VirtualTableItem) => any;
  comp?: (a: any, b: any) => number;
  sort?: sortColumn;
  resizable?: boolean;
  draggable?: boolean;
  component?: VirtualTableColumnComponent | false;
}

export interface VirtualTableColumnInternal extends VirtualTableColumn {
  activeResize?: boolean;
  growDisabled?: boolean;
  width?: number;
}

export interface VirtualTableColumnComponent {
  componentConstructor: Type<any>;
  inputs?: Object;
  outputs?: Object;
}

export interface VirtualTablePaginator {
  pageSize?: number;
  pageSizeOptions?: Array<number>;
}

export interface VirtualTableConfig {
  column?: Array<VirtualTableColumn>;
  header?: boolean;
  filter?: boolean;
  pagination?: VirtualTablePaginator | boolean;
}

export interface StreamWithEffect {
  stream: Array<VirtualTableItem | number | string | boolean>;
  effects?: {
    filter?: string;
    sort?: string;
    pagination?: {
      pageSize?: number;
      pagIndex?: number;
    };
  };
}
