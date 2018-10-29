import {
  Component,
  ChangeDetectionStrategy,
  Input,
  SimpleChanges,
  ViewChild,
  ElementRef,
  ChangeDetectorRef,
  HostBinding,
} from '@angular/core';
import { Observable, EMPTY, Subject, combineLatest, Subscription, zip } from 'rxjs';
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
  StreamWithEffect,
  VirtualTablePaginator,
  VirtualPageChange,
} from '../interfaces';
import { CdkDragMove, CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { NgVirtualTableService } from '../services/ngVirtualTable.service';
import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';
import { PageEvent, MatPaginator } from '@angular/material/paginator';

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

  public paginationPageSize: number;

  public paginationPageOptions: Array<number>;

  public defaultPaginationSetting: VirtualTablePaginator = {
    pageSize: 100,
    pageSizeOptions: [5, 10, 25, 100],
  };

  @Input() itemSize = 25;

  @ViewChild('inputFilterFocus') inputFilterFocus: ElementRef;

  @ViewChild('headerDiv') headerDiv: ElementRef;

  @ViewChild(MatPaginator) paginatorDiv: MatPaginator;

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

  @HostBinding('class.with-pagination') public showPaginator = false;

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

  private pageChange$: Subject<VirtualPageChange> = new Subject<VirtualPageChange>();

  private pageChangeObs$: Observable<VirtualPageChange> = this.pageChange$
    .asObservable()
    .pipe(startWith(null), tap(() => this.viewport.scrollToIndex(0)), takeUntil(this._destroyed$));

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
    this.paginationPageSize =
      (config && typeof config.pagination === 'object' && config.pagination.pageSize) ||
      this.defaultPaginationSetting.pageSize;
    this.paginationPageOptions =
      (config && typeof config.pagination === 'object' && config.pagination.pageSizeOptions) ||
      this.defaultPaginationSetting.pageSizeOptions;
    if (Array.isArray(columnArr)) {
      this._headerDict = Object.create(null);
      this.column = this.createColumnFromArray(columnArr);
    }
    if (this.showPaginator && this.paginatorDiv) {
      this.paginatorDiv.firstPage();
    }
    this.pageChange$.next({
      pageIndex: 0,
      pageSize: this.paginationPageSize,
    });

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
      this.pageChangeObs$.pipe(
        map((e) => ({
          pageSize: (e && e.pageSize) || this.paginationPageSize,
          pageIndex: (e && e.pageIndex) || 0,
        })),
      ),
    ).pipe(
      map(([stream, sort, filter, pageChange]) => ({
        stream,
        effects: {
          filter,
          sort,
          pagination: pageChange,
        },
      })),
      map((streamWithEffect) => this.sortingStream(streamWithEffect)),
      map((streamWithEffect) => this.filterStream(streamWithEffect)),
      map((streamWithEffect) => this.applyPagination(streamWithEffect)),
      map((streamWithEffect) => streamWithEffect.stream),
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

    this.dataSourceSub$ = this._dataStream
      .pipe(skip(1), takeUntil(this._destroyed$))
      .subscribe((stream) => {
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

  public sortingStream(streamWithEffect: StreamWithEffect): StreamWithEffect {
    const sliceStream = streamWithEffect.stream.slice();
    const sort = streamWithEffect.effects && streamWithEffect.effects.sort;
    const sortColumn = this.column.find((e) => e.key === sort);

    if (!sort || !sortColumn) {
      return {
        stream: sliceStream,
        effects: streamWithEffect.effects,
      };
    }

    if (!sortColumn.sort) {
      return {
        stream: sliceStream,
        effects: streamWithEffect.effects,
      };
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

    return {
      stream: sliceStream,
      effects: streamWithEffect.effects,
    };
  }

  public filterStream(streamWithEffect: StreamWithEffect): StreamWithEffect {
    const stream = streamWithEffect.stream;
    const filterStr = streamWithEffect.effects && streamWithEffect.effects.filter;
    if (!filterStr) {
      return {
        stream,
        effects: streamWithEffect.effects,
      };
    }
    const filterString = filterStr.toLocaleLowerCase();

    const filterSliceStream = stream.filter((item: VirtualTableItem) =>
      this.column.some(
        (e) =>
          this.service
            .getElement(item, e.func)
            .toString()
            .toLocaleLowerCase()
            .indexOf(filterString) > -1,
      ),
    );
    return {
      stream: filterSliceStream,
      effects: streamWithEffect.effects,
    };
  }

  public applyPagination(streamWithEffect: StreamWithEffect): StreamWithEffect {
    const stream = streamWithEffect.stream;
    const pagination = streamWithEffect.effects && streamWithEffect.effects.pagination;
    if (!this.showPaginator) {
      return {
        stream: stream.slice(),
        effects: streamWithEffect.effects,
      };
    }
    this.sliceSize = stream.length;
    const pageSize = pagination.pageSize || this.defaultPaginationSetting.pageSize;
    const pageIndex = pagination.pageIndex;
    const sliceStream = stream.slice(
      pageSize * pageIndex,
      pageSize * (pageIndex + 1) > stream.length ? stream.length : pageSize * (pageIndex + 1),
    );
    return {
      stream: sliceStream,
      effects: streamWithEffect.effects,
    };
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
    this.paginationPageSize = event.pageSize;
    this.pageChange$.next({
      pageIndex: event.pageIndex,
      pageSize: event.pageSize,
    });
  }
}
