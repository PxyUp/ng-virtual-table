## ng-virtual-table

Angular 7 virtual scroll table with support dynamic component, filtering, sorting, resizable and custom config column


## Install and Use

```bash
npm i ng-virtual-table
yarn add ng-virtual-table
```

```typescript
import { NgVirtualTableModule } from 'ng-virtual-table';

imports: [NgVirtualTableModule],
```

📺 [Demo](https://pxyup.github.io/ng-virtual-table)

[![NPM](https://nodei.co/npm/ng-virtual-table.png?downloads=true&downloadRank=true&stars=true)](https://nodei.co/npm/ng-virtual-table/)


## Configuration

```typescript

  @Input() itemSize = 25;

  @Input() dataSource: Observable<Array<VirtualTableItem | number | string | boolean>>;

  @Input() filterPlaceholder = 'Filter';

  @Input() dataSetEmptyPlaceholder = 'Data is empty';

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
  component?: VirtualTableColumnComponent | false; // default false (You class component must be part of entryComponents in yor Module!!!!!)
}

export interface VirtualTableConfig {
  column?: Array<VirtualTableColumn>; // if config not provide will be auto generate column
  filter?: boolean; // default false
}

export interface VirtualTableColumnComponent {
  componentConstructor: Type<any>;
  inputs?: Object; // default {}
  outputs?: Object;
}

```

## Example

```typescript
import { VirtualTableConfig } from 'ng-virtual-table';

  clickToItem(item: any) {
    console.log(item);
  }

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
        component: {
          componentConstructor: InfoComponent,
          inputs: {
            title: (e) => e.age,
          },
        },
      },
      {
        key: 'label',
        name: 'Full Label',
        func: (e) => e.label.type,
        comp: (a, b) => a.indexOf('5') - b.indexOf('5'), // here a and b (e) => e.label.type
      },
    ],
  };

  /*

    export class InfoComponent implements OnInit {
      @Input() title: string;

      constructor() {}

      ngOnInit() {}

      click(event: MouseEvent) {
        event.stopPropagation();
        console.log(this.title);
      }
    }

  */
```

```html
<ng-virtual-table [dataSource]="dataSource"></ng-virtual-table>

<ng-virtual-table [dataSource]="dataSource1" [onRowClick]="clickToItem" [config]="config"></ng-virtual-table>
```