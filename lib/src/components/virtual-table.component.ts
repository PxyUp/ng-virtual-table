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
    debounceTime(350),
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
        debounceTime(100),
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
            sliceStream.sort((a, b) =>
              sortColumn.comp(
                this.getElement(a, _sortColumn.func),
                this.getElement(b, _sortColumn.func),
              ),
            );
          } else {
            sliceStream.sort(
              (a, b) =>
                -sortColumn.comp(
                  this.getElement(a, _sortColumn.func),
                  this.getElement(b, _sortColumn.func),
                ),
            );
          }

          return [filterString, sliceStream];
        }),
        map(([filterString, stream]) => {
          const sliceStream = stream.slice();
          if (!filterString) {
            return sliceStream;
          }
          const filter = filterString.toLocaleLowerCase();

          const filterSliceStream = sliceStream.filter((item: VirtualTableItem) =>
            this.column.some(
              (e) =>
                this.getElement(item, e.func).toString().toLocaleLowerCase().indexOf(filter) > -1,
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
      const columnItem = this.createColumnFromConfigColumn(item);

      if (this._headerDict[columnItem.key]) {
        throw Error(`Column key=${columnItem.key} already declare`);
      }
      this._headerDict[columnItem.key] = columnItem;

      return columnItem;
    });
    return columnArr;
  }

  public getElement(item: VirtualTableItem, func: (item: VirtualTableItem) => any) {
    return func.call(this, item);
  }

  private createColumnFromConfigColumn(item: string | VirtualTableColumn): VirtualTableColumn {
    if (typeof item === 'string') {
      return {
        name: item,
        key: item,
        func: (e) => e[item],
        comp: this.defaultComparator,
        sort: null,
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
      sort: item.sort || null,
    };
  }

  ngOnDestroy() {
    this._destroyed$.next();
  }

  clickItem(item: VirtualTableItem) {
    if (typeof this.onRowClick === 'function') this.onRowClick(item);
  }

  private defaultComparator(a: any, b: any): number {
    if (a > b) {
      return 1;
    }
    if (a < b) {
      return -1;
    }
    return 0;
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
