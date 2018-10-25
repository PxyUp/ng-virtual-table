import { Type } from '@angular/core';

export interface VirtualTableItem {
  [key: string]: any;
}

export interface VirtualTableColumn {
  name?: string;
  key: string;
  func?: (item: VirtualTableItem) => any;
  comp?: (a: any, b: any) => number;
  sort?: 'asc' | 'desc' | null | false;
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

export interface VirtualTableConfig {
  column?: Array<VirtualTableColumn>;
  filter?: boolean;
}
