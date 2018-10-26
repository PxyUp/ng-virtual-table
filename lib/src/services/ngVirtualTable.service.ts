import { Injectable } from '@angular/core';
import {
  VirtualTableColumn,
  VirtualTableColumnInternal,
  VirtualTableItem,
  sortColumn,
} from '../interfaces';

@Injectable()
export class NgVirtualTableService {
  public defaultComparator(a: any, b: any): number {
    if (a > b) {
      return 1;
    }
    if (a < b) {
      return -1;
    }
    return 0;
  }

  public createColumnFromConfigColumn(
    item: string | VirtualTableColumn,
  ): VirtualTableColumnInternal {
    if (typeof item === 'string') {
      return {
        name: item,
        key: item,
        func: (e) => e[item],
        comp: this.defaultComparator,
        sort: null,
        resizable: true,
        component: false,
        draggable: true,
      };
    }
    if (!item.key) {
      throw Error(`Column key for ${item} must be exist`);
    }
    return {
      name: item.name || item.key,
      key: item.key,
      func: typeof item.func === 'function' ? item.func : (e) => e[item.key],
      comp: typeof item.comp === 'function' ? item.comp : this.defaultComparator,
      sort: item.sort === false || item.sort ? item.sort : null,
      resizable: item.resizable === false || item.resizable ? item.resizable : true,
      component: item.component ? item.component : false,
      draggable: item.draggable === false || item.draggable ? item.draggable : true,
    };
  }

  public getElement(item: VirtualTableItem, func: (item: VirtualTableItem) => any) {
    return func.call(null, item);
  }

  public setSortOnColumnArray(
    sortColumn: string,
    arr: Array<VirtualTableColumnInternal>,
  ): Array<VirtualTableColumnInternal> {
    return arr.map((item) => {
      if (item.key !== sortColumn) {
        return {
          ...item,
          sort: (item.sort === false ? false : null) as sortColumn,
        };
      }

      if (item.sort === false) {
        return {
          ...item,
          sort: false as sortColumn,
        };
      }

      if (item.sort === null) {
        return {
          ...item,
          sort: 'asc' as sortColumn,
        };
      }

      if (item.sort === 'asc') {
        return {
          ...item,
          sort: 'desc' as sortColumn,
        };
      }

      if (item.sort === 'desc') {
        return {
          ...item,
          sort: null as sortColumn,
        };
      }
    });
  }

  transformDynamicInput(input: Object, item: VirtualTableItem): Object {
    const answer = Object.create(null);

    if (!input) {
      return answer;
    }

    Object.keys(input).forEach((key) => {
      if (typeof input[key] === 'function') {
        answer[key] = this.getElement(item, input[key]);
        return;
      }
      answer[key] = input[key];
    });

    return answer;
  }

  createColumnFromArray(
    arr: Array<VirtualTableColumn | string>,
  ): Array<VirtualTableColumnInternal> {
    return arr.map((item: VirtualTableColumn) => this.createColumnFromConfigColumn(item));
  }
}
