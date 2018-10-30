import { Type } from '@angular/core';
import { Observable } from 'rxjs';

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
  showFirstLastButtons?: boolean;
}

export interface VirtualTableConfig {
  column?: Array<VirtualTableColumn>;
  header?: boolean;
  filter?: boolean;
  pagination?: VirtualTablePaginator | boolean;
  serverSide?: boolean;
  serverSideResolver?: (effects: VirtualTableEffect) => Observable<ResponseStreamWithSize>;
}

export interface ResponseStreamWithSize {
  stream: Array<any>;
  totalSize: number;
}
export interface StreamWithEffect {
  stream: Array<VirtualTableItem | number | string | boolean>;
  effects?: VirtualTableEffect;
}

export interface VirtualTableEffect {
  filter?: string;
  sort?: VirtualSortEffect;
  pagination?: VirtualPageChange;
}

export interface VirtualPageChange {
  pageSize?: number;
  pageIndex?: number;
}

export interface VirtualSortEffect {
  sortColumn: string;
  sortType?: sortColumn;
}
