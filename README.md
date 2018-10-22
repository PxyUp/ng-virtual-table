##

# Example

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
      },
      {
        key: 'age',
        name: 'Full Age',
      },
      {
        key: 'label',
        name: 'Full Label',
        func: (e) => e.label.type,
        comp: (a, b) => a.indexOf('5') - b.indexOf('5'),
      },
    ],
  };

```

```html
<ng-virtual-table [dataSource]="dataSource"></ng-virtual-table>

<ng-virtual-table [dataSource]="dataSource1" [config]="config"></ng-virtual-table>
```

📺 [Demo](https://pxyup.github.io/ng-virtual-table)