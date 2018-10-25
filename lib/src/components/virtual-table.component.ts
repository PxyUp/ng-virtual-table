import {
  Component,
  ChangeDetectionStrategy,
  Input,
  SimpleChanges,
  ViewChild,
  ElementRef,
} from '@angular/core';
import { Observable, EMPTY, Subject, combineLatest } from 'rxjs';
import {
  tap,
  map,
  startWith,
  debounceTime,
  distinctUntilChanged,
  takeUntil,
  publishBehavior,
  refCount,
  take,
  skip,
} from 'rxjs/operators';
import { FormControl } from '@angular/forms';
import {
  VirtualTableConfig,
  VirtualTableItem,
  VirtualTableColumn,
  VirtualTableColumnInternal,
} from '../interfaces';
import { CdkDragMove, CdkDragStart, CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';

@Component({
  selector: 'ng-virtual-table',
  templateUrl: './virtual-table.component.html',
  styleUrls: ['./virtual-table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VirtualTableComponent {
  private _config: VirtualTableConfig;

  private _oldWidth: number;

  public filterIsOpen = false;

  @Input() itemSize = 25;

  @ViewChild('inputFilterFocus') inputFilterFocus: ElementRef;

  @ViewChild('headerDiv') headerDiv: ElementRef;

  @Input() dataSource: Observable<Array<VirtualTableItem | number | string | boolean>>;

  @Input() filterPlaceholder = 'Filter';

  @Input() dataSetEmptyPlaceholder = 'Data is empty';

  @Input() config: VirtualTableConfig;

  @Input() onRowClick: (item: VirtualTableItem) => void;

  filterControl: FormControl = new FormControl('');

  private _headerDict: { [key: string]: VirtualTableColumnInternal } = Object.create(null);

  public column: Array<VirtualTableColumnInternal> = [];

  public _dataStream: Observable<Array<VirtualTableItem>> = EMPTY;

  private sort$: Subject<string> = new Subject<string>();

  private _destroyed$ = new Subject<void>();

  private _headerWasSet = false;

  public isEmptySubject$: Observable<boolean>;

  private filter$ = ((this.filterControl && this.filterControl.valueChanges) || EMPTY)
    .pipe(debounceTime(350), startWith(null), distinctUntilChanged(), takeUntil(this._destroyed$));

  private _sort$: Observable<string> = this.sort$.asObservable();

  applySort(column: string) {
    this.column = this.column.map((item) => {
      if (item.key !== column) {
        return {
          ...item,
          sort: item.sort === false ? false : null,
        };
      }

      if (item.sort === false) {
        return {
          ...item,
          sort: false,
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
      if (Array.isArray(this._config.column)) {
        this._headerDict = Object.create(null);
        this.column = this.createColumnFromArray(this._config.column);
      }
    }

    if ('dataSource' in changes) {
      const newDataSource = changes.dataSource.currentValue as Observable<Array<VirtualTableItem>>;
      this._dataStream = combineLatest(
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
        this._sort$.pipe(startWith(this._sortAfterConfigWasSet())),
        this.filter$,
      ).pipe(
        debounceTime(100),
        map(([stream, sort, filterString]) => {
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
        takeUntil(this._destroyed$),
      );

      this._dataStream.pipe(skip(1), take(1)).subscribe(() => {
        this.columnResizeAction();
      });

      this.isEmptySubject$ = this._dataStream.pipe(map((data) => !data.length));
    }
  }

  private _sortAfterConfigWasSet() {
    const columnPreSort = this.column.find((e) => e.sort && e.sort !== null);
    if (columnPreSort) {
      return columnPreSort.key;
    }
    return null;
  }

  createColumnFromArray(
    arr: Array<VirtualTableColumn | string>,
  ): Array<VirtualTableColumnInternal> {
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

  private createColumnFromConfigColumn(
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

  resizeStart(column: VirtualTableColumnInternal, index: number) {
    column.activeResize = true;
    if (!column.width) {
      column.width = this.headerDiv.nativeElement.children[index].getBoundingClientRect().width;
    }
  }

  resizeEnd(column: VirtualTableColumnInternal, grabberReset = false, grabber?: HTMLElement) {
    column.activeResize = false;
    this._oldWidth = null;
    this.columnResizeAction();
    if (grabberReset) {
      grabber.style.transform = 'none';
    }
  }

  resizingEvent(event: CdkDragMove<any>, column: VirtualTableColumnInternal) {
    const targetLeft = event.pointerPosition.x;
    const grabber = event.source.element.nativeElement as HTMLElement;
    const grabberSize = grabber.getBoundingClientRect().width;
    if (!this._oldWidth) {
      this._oldWidth = targetLeft;
    }
    const newWidth = column.width + (targetLeft - this._oldWidth);
    if (
      column.width + (targetLeft - this._oldWidth) <=
        this.headerDiv.nativeElement.getBoundingClientRect().width ||
      grabberSize * 3 > newWidth
    ) {
      column.width = newWidth;
      this._oldWidth = targetLeft;
    } else {
      this.resizeEnd(column, true, grabber);
    }
  }

  private columnResizeAction() {
    const parent = this.headerDiv.nativeElement;
    let i = 0;
    while (i < this.column.length) {
      this.column[i].width = parent.children[i].getBoundingClientRect().width;
      i += 1;
    }
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

  dropColumn(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.column, event.previousIndex, event.currentIndex);
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

  getHeaderItem(index: number) {
    return `.header-item[data-index="${index}"]`;
  }

  mouseDownBlock(event: MouseEvent) {
    event.stopImmediatePropagation();
  }
}
