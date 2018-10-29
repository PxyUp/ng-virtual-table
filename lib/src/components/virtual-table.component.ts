import {
  Component,
  ChangeDetectionStrategy,
  Input,
  SimpleChanges,
  ViewChild,
  ElementRef,
  ChangeDetectorRef,
} from '@angular/core';
import { Observable, EMPTY, Subject, combineLatest, Subscription } from 'rxjs';
import {
  map,
  startWith,
  debounceTime,
  distinctUntilChanged,
  takeUntil,
  publishBehavior,
  refCount,
  take,
  filter,
  skip,
  tap,
} from 'rxjs/operators';
import { FormControl } from '@angular/forms';
import {
  VirtualTableConfig,
  VirtualTableItem,
  VirtualTableColumn,
  VirtualTableColumnInternal,
} from '../interfaces';
import { CdkDragMove, CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { NgVirtualTableService } from '../services/ngVirtualTable.service';
import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';
import { PageEvent } from '@angular/material/paginator';

@Component({
  selector: 'ng-virtual-table',
  templateUrl: './virtual-table.component.html',
  styleUrls: ['./virtual-table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VirtualTableComponent {
  private _config: VirtualTableConfig;

  public _oldWidth: number;

  private _headerWasSet = false;

  public filterIsOpen = false;

  @Input() itemSize = 25;

  @ViewChild('inputFilterFocus') inputFilterFocus: ElementRef;

  @ViewChild('headerDiv') headerDiv: ElementRef;

  @ViewChild(CdkVirtualScrollViewport) viewport: CdkVirtualScrollViewport;

  @Input() dataSource: Observable<Array<VirtualTableItem | number | string | boolean>>;

  @Input() filterPlaceholder = 'Filter';

  @Input() dataSetEmptyPlaceholder = 'Data is empty';

  @Input() config: VirtualTableConfig;

  @Input() onRowClick: (item: VirtualTableItem) => void;

  public filterControl: FormControl = new FormControl('');

  private _headerDict: { [key: string]: VirtualTableColumnInternal } = Object.create(null);

  public column: Array<VirtualTableColumnInternal> = [];

  public _dataStream: Observable<Array<VirtualTableItem>> = EMPTY;

  private sort$: Subject<string> = new Subject<string>();

  private _destroyed$ = new Subject<void>();

  public showHeader = true;

  public showPaginator = false;

  public isEmptySubject$: Observable<boolean>;

  private filter$ = ((this.filterControl && this.filterControl.valueChanges) || EMPTY)
    .pipe(debounceTime(350), startWith(null), distinctUntilChanged(), takeUntil(this._destroyed$));

  private _sort$: Observable<string> = this.sort$.asObservable().pipe(takeUntil(this._destroyed$));

  private _columnsSet$: Subject<void> = new Subject();

  public sliceSize = 0;

  private _columnsSetObs$: Observable<void> = this._columnsSet$
    .asObservable()
    .pipe(takeUntil(this._destroyed$));

  private _columnSubs$: Subscription = this._columnsSetObs$
    .pipe(takeUntil(this._destroyed$))
    .subscribe(() => {
      if (this.showHeader) {
        this.columnResizeAction();
      }
    });

  private pageIndex$: Subject<number> = new Subject<number>();
  private pageIndexObs$: Observable<number> = this.pageIndex$
    .asObservable()
    .pipe(
      startWith(0),
      distinctUntilChanged(),
      tap(() => this.viewport.scrollToIndex(0)),
      takeUntil(this._destroyed$),
    );

  private pageSize$: Subject<number> = new Subject<number>();
  private pageSizeObs$: Observable<number> = this.pageSize$
    .asObservable()
    .pipe(startWith(10), distinctUntilChanged(), takeUntil(this._destroyed$));

  private dataSourceSub$: Subscription;

  public dataArray: Array<VirtualTableItem | number | string | boolean> = [];

  constructor(private service: NgVirtualTableService, private cdr: ChangeDetectorRef) {}

  getElement(item: VirtualTableItem, func: (item: VirtualTableItem) => any) {
    return this.service.getElement(item, func);
  }

  applySort(column: string) {
    this.column = this.service.setSortOnColumnArray(column, this.column);
    this.sort$.next(column);
  }

  headerItemDragStarted() {
    (this.headerDiv.nativeElement as HTMLElement).classList.add('cdk-drop-list-dragging');
  }

  headerItemDragFinished() {
    (this.headerDiv.nativeElement as HTMLElement).classList.remove('cdk-drop-list-dragging');
  }

  applyConfig(config: VirtualTableConfig) {
    const columnArr = config.column;
    this.showHeader = config.header === false ? false : true;
    this.showPaginator = config.pagination ? true : false;
    if (Array.isArray(columnArr)) {
      this._headerDict = Object.create(null);
      this.column = this.createColumnFromArray(columnArr);
    }
    this.cdr.detectChanges();
  }

  applyDatasource(obs: Observable<Array<VirtualTableItem | number | string | boolean>>) {
    if (this.dataSourceSub$) {
      this.dataSourceSub$.unsubscribe();
    }

    this._dataStream = combineLatest(
      obs,
      this._sort$.pipe(startWith(this._sortAfterConfigWasSet())),
      this.filter$,
      this.pageIndexObs$,
      this.pageSizeObs$,
    ).pipe(
      map(([stream, sort, filterString, pageIndex, pageSize]) => {
        const sliceStream = stream.slice();

        const sortColumn = this.column.find((e) => e.key === sort);

        if (!sort || !sortColumn) {
          return [filterString, sliceStream, pageIndex, pageSize];
        }

        if (!sortColumn.sort) {
          return [filterString, sliceStream, pageIndex, pageSize];
        }

        const _sortColumn = this._headerDict[sort];

        if (sortColumn.sort === 'asc') {
          sliceStream.sort((a, b) =>
            sortColumn.comp(
              this.service.getElement(a, _sortColumn.func),
              this.service.getElement(b, _sortColumn.func),
            ),
          );
        } else {
          sliceStream.sort(
            (a, b) =>
              -sortColumn.comp(
                this.service.getElement(a, _sortColumn.func),
                this.service.getElement(b, _sortColumn.func),
              ),
          );
        }

        return [filterString, sliceStream, pageIndex, pageSize];
      }),
      map(([filterString, stream, pageIndex, pageSize]) => {
        return this.filterArrayByString(filterString, stream, this.column, pageIndex, pageSize);
      }),
      map(([stream, pageIndex, pageSize]) => {
        if (!this.showPaginator) {
          return stream;
        }
        this.sliceSize = stream.length;
        const sliceStream = stream.slice(
          pageSize * pageIndex,
          pageSize * (pageIndex + 1) > stream.length ? stream.length : pageSize * (pageIndex + 1),
        );
        return sliceStream;
      }),
      publishBehavior([]),
      refCount(),
      takeUntil(this._destroyed$),
    );

    obs
      .pipe(
        filter(() => !this._headerWasSet && (!this._config || !this._config.column)),
        take(1),
        takeUntil(this._destroyed$),
      )
      .subscribe((stream: Array<VirtualTableItem>) => {
        const setOfColumn = new Set();
        stream.forEach((e) => Object.keys(e).forEach((key) => setOfColumn.add(key)));
        const autoColumnArray = Array.from(setOfColumn);
        this.column = this.createColumnFromArray(autoColumnArray);
        this.cdr.detectChanges();
      });

    this._dataStream.pipe(skip(1), take(1), takeUntil(this._destroyed$)).subscribe(() => {
      this._columnsSet$.next();
    });

    this.isEmptySubject$ = this._dataStream.pipe(
      map((data) => !data.length),
      takeUntil(this._destroyed$),
    );

    this.dataSourceSub$ = this._dataStream.pipe(takeUntil(this._destroyed$)).subscribe((stream) => {
      this.dataArray = stream;
      this.cdr.detectChanges();
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    if ('config' in changes) {
      this._config = changes.config.currentValue as VirtualTableConfig;
      this.applyConfig(this._config);
    }

    if ('dataSource' in changes) {
      const newDataSource = changes.dataSource.currentValue as Observable<Array<VirtualTableItem>>;
      this.applyDatasource(newDataSource.pipe(takeUntil(this._destroyed$)));
    }
  }

  public filterArrayByString(
    str: string,
    arr: Array<VirtualTableItem | number | string | boolean>,
    column: Array<VirtualTableColumn>,
    pageIndex: number,
    pageSize: number,
  ): [Array<VirtualTableItem | number | string | boolean>, number, number] {
    if (!str) {
      return [arr, pageIndex, pageSize];
    }
    const filterString = str.toLocaleLowerCase();

    const filterSliceStream = arr.filter((item: VirtualTableItem) =>
      column.some(
        (e) =>
          this.service
            .getElement(item, e.func)
            .toString()
            .toLocaleLowerCase()
            .indexOf(filterString) > -1,
      ),
    );
    return [filterSliceStream, pageIndex, pageSize];
  }

  public _sortAfterConfigWasSet() {
    const columnPreSort = this.column.find((e) => e.sort && e.sort !== null);
    if (columnPreSort) {
      return columnPreSort.key;
    }
    return null;
  }

  createColumnFromArray(
    arr: Array<VirtualTableColumn | string>,
  ): Array<VirtualTableColumnInternal> {
    const columnArr = this.service.createColumnFromArray(arr);
    columnArr.forEach((column) => {
      if (this._headerDict[column.key]) {
        throw Error(`Column key=${column.key} already declare`);
      }
      this._headerDict[column.key] = column;
    });
    this._headerWasSet = true;
    return columnArr;
  }

  ngOnDestroy() {
    this._destroyed$.next();
    this._columnSubs$.unsubscribe();
    if (this.dataSourceSub$) {
      this.dataSourceSub$.unsubscribe();
    }
  }

  clickItem(item: VirtualTableItem) {
    if (typeof this.onRowClick === 'function') {
      this.onRowClick(item);
    } else {
      return false;
    }
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

  transformDynamicInput(input: Object, item: VirtualTableItem) {
    return this.service.transformDynamicInput(input, item);
  }

  mouseDownBlock(event: MouseEvent) {
    event.stopImmediatePropagation();
  }

  onPageChange(event: PageEvent) {
    this.pageIndex$.next(event.pageIndex);
    this.pageSize$.next(event.pageSize);
  }
}
