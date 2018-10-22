import { Component, ChangeDetectionStrategy, Input, SimpleChanges } from '@angular/core';
import { Observable, EMPTY, Subject, combineLatest, of } from 'rxjs';
import {
  tap,
  map,
  startWith,
  debounceTime,
  filter,
  distinctUntilChanged,
  takeUntil,
  catchError,
} from 'rxjs/operators';
import { FormControl } from '@angular/forms';
interface VirtualTableItem {
  [key: string]: any;
}

interface VirtualTableColumn {
  name: string;
  sort: 'asc' | 'desc' | null;
}

@Component({
  selector: 'ng-virtual-table',
  templateUrl: './virtual-table.component.html',
  styleUrls: ['./virtual-table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VirtualTableComponent {
  public itemCount = 1;

  @Input() dataSource: Observable<Array<VirtualTableItem>>;

  @Input() headerColumn: Array<string>;

  filterControl: FormControl = new FormControl('');

  private _headerColumn: Set<string> = new Set();

  public column: Array<VirtualTableColumn> = [];

  public _dataStream: Observable<Array<VirtualTableItem>> = EMPTY;

  private sort$: Subject<string> = new Subject<string>();

  private _destroyed$ = new Subject<void>();

  private _headerWasSet = false;

  private filter$ = this.filterControl.valueChanges.pipe(
    debounceTime(300),
    startWith(null),
    distinctUntilChanged(),
    takeUntil(this._destroyed$),
  );

  applySort(column: string) {
    this.column = this.column.map((item) => {
      if (item.name !== column) {
        return {
          ...item,
          sort: null,
        };
      }

      if (item.sort === null) {
        return {
          ...item,
          sort: 'asc',
        };
      }

      if (item.sort === 'asc') {
        return {
          ...item,
          sort: 'desc',
        };
      }

      if (item.sort === 'desc') {
        return {
          ...item,
          sort: null,
        };
      }
    }) as Array<VirtualTableColumn>;
    this.sort$.next(column);
  }

  ngOnChanges(changes: SimpleChanges) {
    if ('headerColumn' in changes && Array.isArray(changes.headerColumn.currentValue)) {
      this.column = this.createColumnFromArray(changes.headerColumn.currentValue);
      this._headerWasSet = true;
    }

    if ('dataSource' in changes) {
      const newDataSource = changes.dataSource.currentValue as Observable<Array<VirtualTableItem>>;
      this._dataStream = combineLatest(
        this.sort$.asObservable().pipe(startWith(null)),
        combineLatest(
          newDataSource.pipe(
            tap((stream: Array<VirtualTableItem>) => {
              if (!this._headerWasSet) {
                this._headerColumn.clear();
                stream.forEach((e) => Object.keys(e).forEach((key) => this._headerColumn.add(key)));
                this.column = this.createColumnFromArray(Array.from(this._headerColumn));
                this._headerWasSet = true;
              }
            }),
            map((stream) => stream.slice()),
          ),
          this.filter$,
        ).pipe(
          map(([stream, filterString]) => {
            const sliceStream = stream.slice();
            if (!filterString) {
              return sliceStream;
            }
            const filter = filterString.toLocaleLowerCase();

            const filterSliceStream = sliceStream.filter((item: VirtualTableItem) =>
              Object.keys(item).some(
                (key) => item[key] && item[key].toString().toLocaleLowerCase().indexOf(filter) > -1,
              ),
            );
            return filterSliceStream;
          }),
        ),
      ).pipe(
        map(([sort, stream]) => {
          const sliceStream = stream.slice();

          const sortColumn = this.column.find((e) => e.name === sort);

          if (!sort || !sortColumn) {
            return sliceStream;
          }

          if (!sortColumn.sort) {
            return sliceStream;
          }

          if (sortColumn.sort === 'asc') {
            sliceStream.sort(
              (a: VirtualTableItem, b: VirtualTableItem) =>
                a[sortColumn.name] > b[sortColumn.name]
                  ? 1
                  : a[sortColumn.name] === b[sortColumn.name] ? 0 : -1,
            );
          } else {
            sliceStream.sort(
              (a: VirtualTableItem, b: VirtualTableItem) =>
                a[sortColumn.name] < b[sortColumn.name]
                  ? 1
                  : a[sortColumn.name] === b[sortColumn.name] ? 0 : -1,
            );
          }

          return sliceStream;
        }),
        tap((value) => console.log(value)),
      );
    }
  }

  createColumnFromArray(arr: Array<string>): Array<VirtualTableColumn> {
    return arr.map((e) => ({ name: e, sort: null }));
  }

  ngOnDestroy() {
    this._destroyed$.next();
  }
}
