import {
  Component,
  ChangeDetectionStrategy,
  Input,
  SimpleChanges,
  ViewChild,
  ElementRef,
} from '@angular/core';
import { Observable, EMPTY, Subject, combineLatest, of, BehaviorSubject } from 'rxjs';
import {
  tap,
  map,
  startWith,
  debounceTime,
  filter,
  distinctUntilChanged,
  takeUntil,
  catchError,
  share,
  shareReplay,
  switchMap,
  publishBehavior,
  refCount,
} from 'rxjs/operators';
import { FormControl } from '@angular/forms';
import { VirtualTableConfig, VirtualTableItem, VirtualTableColumn } from '../interfaces';

@Component({
  selector: 'ng-virtual-table',
  templateUrl: './virtual-table.component.html',
  styleUrls: ['./virtual-table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VirtualTableComponent {
  public itemCount = 25;

  private _config: VirtualTableConfig;

  public filterIsOpen = false;

  @ViewChild('inputFilterFocus') inputFilterFocus: ElementRef;

  @Input() dataSource: Observable<Array<VirtualTableItem>>;

  @Input() filterPlaceholder = 'Filter';

  @Input() config: VirtualTableConfig;

  @Input() onRowClick: (item: VirtualTableItem) => void;

  filterControl: FormControl = new FormControl('');

  private _headerDict: { [key: string]: VirtualTableColumn } = Object.create(null);

  public column: Array<VirtualTableColumn> = [];

  public _dataStream: Observable<Array<VirtualTableItem>> = EMPTY;

  private sort$: Subject<string> = new Subject<string>();

  private _destroyed$ = new Subject<void>();

  private _headerWasSet = false;

  public isEmptySubject$: Observable<boolean>;

  private filter$ = this.filterControl.valueChanges.pipe(
    debounceTime(300),
    startWith(null),
    distinctUntilChanged(),
    takeUntil(this._destroyed$),
  );

  applySort(column: string) {
    this.column = this.column.map((item) => {
      if (item.key !== column) {
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
    if ('config' in changes) {
      this._config = changes.config.currentValue as VirtualTableConfig;
      this.column = this.createColumnFromArray(this._config.column);
    }

    if ('dataSource' in changes) {
      const newDataSource = changes.dataSource.currentValue as Observable<Array<VirtualTableItem>>;
      this._dataStream = combineLatest(
        this.sort$.asObservable().pipe(startWith(null)),
        this.filter$,
        newDataSource.pipe(
          tap((stream: Array<VirtualTableItem>) => {
            if (!this._headerWasSet) {
              const setOfColumn = new Set();
              stream.forEach((e) => Object.keys(e).forEach((key) => setOfColumn.add(key)));
              const autoColumnArray = Array.from(setOfColumn);
              this.column = this.createColumnFromArray(autoColumnArray);
            }
          }),
        ),
      ).pipe(
        map(([sort, filterString, stream]) => {
          const sliceStream = stream.slice();

          const sortColumn = this.column.find((e) => e.key === sort);

          if (!sort || !sortColumn) {
            return [filterString, sliceStream];
          }

          if (!sortColumn.sort) {
            return [filterString, sliceStream];
          }

          const _sortColumn = this._headerDict[sort];

          if (sortColumn.sort === 'asc') {
            sliceStream.sort(
              (a: VirtualTableItem, b: VirtualTableItem) =>
                this.getElement(a, _sortColumn.func) > this.getElement(b, _sortColumn.func)
                  ? 1
                  : this.getElement(a, _sortColumn.func) === this.getElement(b, _sortColumn.func)
                    ? 0
                    : -1,
            );
          } else {
            sliceStream.sort(
              (a: VirtualTableItem, b: VirtualTableItem) =>
                this.getElement(a, _sortColumn.func) < this.getElement(b, _sortColumn.func)
                  ? 1
                  : this.getElement(a, _sortColumn.func) === this.getElement(b, _sortColumn.func)
                    ? 0
                    : -1,
            );
          }

          return [filterString, sliceStream];
        }),
        map(([filterString, stream]) => {
          console.log(filterString, 'filter');
          console.log(stream);
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
        publishBehavior([]),
        refCount(),
      );

      this.isEmptySubject$ = this._dataStream.pipe(map((data) => !data.length));
    }
  }

  createColumnFromArray(arr: Array<VirtualTableColumn | string>): Array<VirtualTableColumn> {
    if (!arr || arr.length === 0) {
      return;
    }
    this._headerWasSet = true;
    const columnArr = arr.map((item: VirtualTableColumn) => {
      let columnItem;
      if (typeof item === 'string') {
        columnItem = this.createColumnFromString(item);
      } else {
        columnItem = item;
      }
      if (this._headerDict[columnItem.key]) {
        throw Error(`Column key=${columnItem.key} already declare`);
      }
      this._headerDict[columnItem.key] = columnItem;

      return columnItem;
    });
    return columnArr;
  }

  private getElement(item: VirtualTableItem, func: (item: VirtualTableItem) => any) {
    return func.call(this, item);
  }

  private createColumnFromString(str: string): VirtualTableColumn {
    return {
      name: str,
      key: str,
      func: (item) => item[str],
      sort: null,
    };
  }

  ngOnDestroy() {
    this._destroyed$.next();
  }

  clickItem(item: VirtualTableItem) {
    if (typeof this.onRowClick === 'function') this.onRowClick(item);
  }

  toggleFilter() {
    this.filterIsOpen = !this.filterIsOpen;
    if (this.filterIsOpen) {
      setTimeout(() => {
        this.inputFilterFocus.nativeElement.focus();
      });
    }
    this.filterControl.setValue('', { emitEvent: !this.filterIsOpen });
  }
}
