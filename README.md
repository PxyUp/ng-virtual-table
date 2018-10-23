## ng-virtual-table

Angular 7 virtual scroll table with support filtering, sorting, resizable and custom config column

📺 [Demo](https://pxyup.github.io/ng-virtual-table)

[![NPM](https://nodei.co/npm/ng-virtual-table.png?downloads=true&downloadRank=true&stars=true)](https://nodei.co/npm/ng-virtual-table/)

## Configuration

```typescipt
  @Input() dataSource: Observable<Array<VirtualTableItem | number | string | boolean>>;

  @Input() filterPlaceholder = 'Filter';

  @Input() config: VirtualTableConfig;

  @Input() onRowClick: (item: VirtualTableItem) => void;
```

```typescript

config:VirtualTableConfig

export interface VirtualTableColumn {
  name?: string; // Label for field, if absent will be use key
  key: string; // Uniq key for filed, 
  func?: (item: VirtualTableItem) => any; // function for get value from item
  comp?: (a: any, b: any) => number; // function for compare two item, depend from `func` function
  sort?: 'asc' | 'desc' | null | false;  // sort by default(support only one sort), false for disable
  resizable?: boolean; // default true(if not set `true`))
}

export interface VirtualTableConfig {
  column?: Array<VirtualTableColumn>; // if config not provide will be auto generate column
  filter?: boolean; // default false
}
```

## Example

```typescript
import { VirtualTableConfig } from 'ng-virtual-table';


  dataSource = of(
    Array(1000).fill(0).map((e) => ({
      name: Math.random().toString(36).substring(7),
      age: Math.round(Math.random() * 1000),
    })),
  );

  dataSource1 = of(
    Array(1000).fill(0).map((e) => ({
      name: Math.random().toString(36).substring(7),
      age: Math.round(Math.random() * 1000),
      age2: Math.round(Math.random() * 1000),
      label: {
        type: Math.random().toString(36).substring(7),
      },
    })),
  );

  config: VirtualTableConfig = {
    column: [
      {
        key: 'name',
        name: 'Full name',
        sort: false // disable sort
      },
      {
        key: 'age',
        name: 'Full Age',
        sort: 'desc', // pre defined sort
      },
      {
        key: 'label',
        name: 'Full Label',
        func: (e) => e.label.type,
        comp: (a, b) => a.indexOf('5') - b.indexOf('5'), // here a and b (e) => e.label.type
      },
    ],
  };

  clickToItem(item: any) {
    console.log(item);
  }

```

```html
<ng-virtual-table [dataSource]="dataSource"></ng-virtual-table>

<ng-virtual-table [dataSource]="dataSource1" [onRowClick]="clickToItem" [config]="config"></ng-virtual-table>
```