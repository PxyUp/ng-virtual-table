/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
import { Component, ChangeDetectionStrategy, Input } from '@angular/core';
import { Observable, EMPTY, Subject, combineLatest, BehaviorSubject } from 'rxjs';
import { tap, map, startWith, debounceTime, distinctUntilChanged, takeUntil, } from 'rxjs/operators';
import { FormControl } from '@angular/forms';
/**
 * @record
 */
function VirtualTableItem() { }
/**
 * @record
 */
function VirtualTableColumn() { }
if (false) {
    /** @type {?} */
    VirtualTableColumn.prototype.name;
    /** @type {?} */
    VirtualTableColumn.prototype.sort;
}
export class VirtualTableComponent {
    constructor() {
        this.itemCount = 25;
        this.filterControl = new FormControl('');
        this._headerColumn = new Set();
        this.column = [];
        this._dataStream = EMPTY;
        this.sort$ = new Subject();
        this._destroyed$ = new Subject();
        this._headerWasSet = false;
        this.empty$ = new BehaviorSubject(false);
        this.filter$ = this.filterControl.valueChanges.pipe(debounceTime(300), startWith(null), distinctUntilChanged(), takeUntil(this._destroyed$));
    }
    /**
     * @param {?} column
     * @return {?}
     */
    applySort(column) {
        this.column = (/** @type {?} */ (this.column.map((item) => {
            if (item.name !== column) {
                return Object.assign({}, item, { sort: null });
            }
            if (item.sort === null) {
                return Object.assign({}, item, { sort: 'asc' });
            }
            if (item.sort === 'asc') {
                return Object.assign({}, item, { sort: 'desc' });
            }
            if (item.sort === 'desc') {
                return Object.assign({}, item, { sort: null });
            }
        })));
        this.sort$.next(column);
    }
    /**
     * @param {?} changes
     * @return {?}
     */
    ngOnChanges(changes) {
        if ('headerColumn' in changes && Array.isArray(changes.headerColumn.currentValue)) {
            this.column = this.createColumnFromArray(changes.headerColumn.currentValue);
            this._headerWasSet = true;
        }
        if ('dataSource' in changes) {
            /** @type {?} */
            const newDataSource = (/** @type {?} */ (changes.dataSource.currentValue));
            this._dataStream = combineLatest(this.sort$.asObservable().pipe(startWith(null)), combineLatest(newDataSource.pipe(tap((stream) => {
                if (!this._headerWasSet) {
                    this._headerColumn.clear();
                    stream.forEach((e) => Object.keys(e).forEach((key) => this._headerColumn.add(key)));
                    this.column = this.createColumnFromArray(Array.from(this._headerColumn));
                    this._headerWasSet = true;
                }
            }), map((stream) => stream.slice())), this.filter$).pipe(map(([stream, filterString]) => {
                /** @type {?} */
                const sliceStream = stream.slice();
                if (!filterString) {
                    return sliceStream;
                }
                /** @type {?} */
                const filter = filterString.toLocaleLowerCase();
                /** @type {?} */
                const filterSliceStream = sliceStream.filter((item) => Object.keys(item).some((key) => item[key] && item[key].toString().toLocaleLowerCase().indexOf(filter) > -1));
                return filterSliceStream;
            }))).pipe(tap(([sort, stream]) => {
                console.log(stream);
                if (stream.length > 0) {
                    this.empty$.next(false);
                    return;
                }
                this.empty$.next(true);
            }), map(([sort, stream]) => {
                /** @type {?} */
                const sliceStream = stream.slice();
                /** @type {?} */
                const sortColumn = this.column.find((e) => e.name === sort);
                if (!sort || !sortColumn) {
                    return sliceStream;
                }
                if (!sortColumn.sort) {
                    return sliceStream;
                }
                if (sortColumn.sort === 'asc') {
                    sliceStream.sort((a, b) => a[sortColumn.name] > b[sortColumn.name]
                        ? 1
                        : a[sortColumn.name] === b[sortColumn.name] ? 0 : -1);
                }
                else {
                    sliceStream.sort((a, b) => a[sortColumn.name] < b[sortColumn.name]
                        ? 1
                        : a[sortColumn.name] === b[sortColumn.name] ? 0 : -1);
                }
                return sliceStream;
            }));
        }
    }
    /**
     * @param {?} arr
     * @return {?}
     */
    createColumnFromArray(arr) {
        return arr.map((e) => ({ name: e, sort: null }));
    }
    /**
     * @return {?}
     */
    ngOnDestroy() {
        this._destroyed$.next();
    }
    /**
     * @param {?} item
     * @return {?}
     */
    clickItem(item) {
        if (typeof this.onRowClick === 'function')
            this.onRowClick(item);
    }
    /**
     * @return {?}
     */
    get isEmptySubject$() {
        return this.empty$.asObservable();
    }
}
VirtualTableComponent.decorators = [
    { type: Component, args: [{
                selector: 'ng-virtual-table',
                template: "<div class=\"table\">\n  <div class=\"header\">\n    <div *ngFor=\"let headerItem of column\" class=\"header-item\" (click)=\"applySort(headerItem.name)\" [ngClass]=\"headerItem.sort\">{{\n      headerItem.name\n      }}</div>\n    <input type=\"text\" [formControl]=\"filterControl\">\n  </div>\n  <cdk-virtual-scroll-viewport *ngIf=\"!(isEmptySubject$ | async); else emptyContainer\" [itemSize]=\"itemCount\" class=\"virtual-table-content\">\n    <div *cdkVirtualFor=\"let item of _dataStream;templateCacheSize: 0\" class=\"virtual-table-row\" (click)=\"clickItem(item)\">\n      <div *ngFor=\"let headerItem of column\" class=\"virtual-table-column\">{{\n        item[headerItem.name] }}</div>\n    </div>\n  </cdk-virtual-scroll-viewport>\n  <ng-template #emptyContainer>\n    Data is empty\n  </ng-template>\n</div>",
                changeDetection: ChangeDetectionStrategy.OnPush,
                styles: ["@font-face{font-family:'Material Icons';font-style:normal;font-weight:400;src:url(https://fonts.gstatic.com/s/materialicons/v41/flUhRq6tzZclQEJ-Vdg-IuiaDsNcIhQ8tQ.woff2) format(\"woff2\")}:host{display:block;position:relative}.table{height:100%;position:relative}.table .header{display:flex;margin-top:8px;height:40px;align-items:center;border-bottom:1px solid #000}.table .header-item{cursor:pointer;display:flex;align-items:center;margin:0 8px}.table .header-item.asc:after{margin-right:4px;content:'arrow_downward';font-family:\"Material Icons\"}.table .header-item.desc:after{margin-right:4px;font-family:'Material Icons';content:'arrow_upward'}.table .virtual-table-content,.table .virtual-table-empty{display:flex;flex-direction:column;height:calc(100% - 40px)}.table .virtual-table-row{display:flex;flex-direction:row;min-height:20px;margin:8px 0}.table .virtual-table-column{display:flex;margin:0 8px}"]
            }] }
];
VirtualTableComponent.propDecorators = {
    dataSource: [{ type: Input }],
    headerColumn: [{ type: Input }],
    onRowClick: [{ type: Input }]
};
if (false) {
    /** @type {?} */
    VirtualTableComponent.prototype.itemCount;
    /** @type {?} */
    VirtualTableComponent.prototype.dataSource;
    /** @type {?} */
    VirtualTableComponent.prototype.headerColumn;
    /** @type {?} */
    VirtualTableComponent.prototype.onRowClick;
    /** @type {?} */
    VirtualTableComponent.prototype.filterControl;
    /** @type {?} */
    VirtualTableComponent.prototype._headerColumn;
    /** @type {?} */
    VirtualTableComponent.prototype.column;
    /** @type {?} */
    VirtualTableComponent.prototype._dataStream;
    /** @type {?} */
    VirtualTableComponent.prototype.sort$;
    /** @type {?} */
    VirtualTableComponent.prototype._destroyed$;
    /** @type {?} */
    VirtualTableComponent.prototype._headerWasSet;
    /** @type {?} */
    VirtualTableComponent.prototype.empty$;
    /** @type {?} */
    VirtualTableComponent.prototype.filter$;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidmlydHVhbC10YWJsZS5jb21wb25lbnQuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9uZy12aXJ0dWFsLXRhYmxlLyIsInNvdXJjZXMiOlsic3JjL2NvbXBvbmVudHMvdmlydHVhbC10YWJsZS5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7OztBQUFBLE9BQU8sRUFBRSxTQUFTLEVBQUUsdUJBQXVCLEVBQUUsS0FBSyxFQUFpQixNQUFNLGVBQWUsQ0FBQztBQUN6RixPQUFPLEVBQUUsVUFBVSxFQUFFLEtBQUssRUFBRSxPQUFPLEVBQUUsYUFBYSxFQUFNLGVBQWUsRUFBRSxNQUFNLE1BQU0sQ0FBQztBQUN0RixPQUFPLEVBQ0wsR0FBRyxFQUNILEdBQUcsRUFDSCxTQUFTLEVBQ1QsWUFBWSxFQUVaLG9CQUFvQixFQUNwQixTQUFTLEdBRVYsTUFBTSxnQkFBZ0IsQ0FBQztBQUN4QixPQUFPLEVBQUUsV0FBVyxFQUFFLE1BQU0sZ0JBQWdCLENBQUM7Ozs7QUFDN0MsK0JBRUM7Ozs7QUFFRCxpQ0FHQzs7O0lBRkMsa0NBQWE7O0lBQ2Isa0NBQTRCOztBQVM5QixNQUFNLE9BQU8scUJBQXFCO0lBTmxDO1FBT1MsY0FBUyxHQUFHLEVBQUUsQ0FBQztRQVF0QixrQkFBYSxHQUFnQixJQUFJLFdBQVcsQ0FBQyxFQUFFLENBQUMsQ0FBQztRQUV6QyxrQkFBYSxHQUFnQixJQUFJLEdBQUcsRUFBRSxDQUFDO1FBRXhDLFdBQU0sR0FBOEIsRUFBRSxDQUFDO1FBRXZDLGdCQUFXLEdBQXdDLEtBQUssQ0FBQztRQUV4RCxVQUFLLEdBQW9CLElBQUksT0FBTyxFQUFVLENBQUM7UUFFL0MsZ0JBQVcsR0FBRyxJQUFJLE9BQU8sRUFBUSxDQUFDO1FBRWxDLGtCQUFhLEdBQUcsS0FBSyxDQUFDO1FBRXZCLFdBQU0sR0FBNkIsSUFBSSxlQUFlLENBQVUsS0FBSyxDQUFDLENBQUM7UUFFdEUsWUFBTyxHQUFHLElBQUksQ0FBQyxhQUFhLENBQUMsWUFBWSxDQUFDLElBQUksQ0FDcEQsWUFBWSxDQUFDLEdBQUcsQ0FBQyxFQUNqQixTQUFTLENBQUMsSUFBSSxDQUFDLEVBQ2Ysb0JBQW9CLEVBQUUsRUFDdEIsU0FBUyxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsQ0FDNUIsQ0FBQztJQXFJSixDQUFDOzs7OztJQW5JQyxTQUFTLENBQUMsTUFBYztRQUN0QixJQUFJLENBQUMsTUFBTSxHQUFHLG1CQUFBLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSSxFQUFFLEVBQUU7WUFDckMsSUFBSSxJQUFJLENBQUMsSUFBSSxLQUFLLE1BQU0sRUFBRTtnQkFDeEIseUJBQ0ssSUFBSSxJQUNQLElBQUksRUFBRSxJQUFJLElBQ1Y7YUFDSDtZQUVELElBQUksSUFBSSxDQUFDLElBQUksS0FBSyxJQUFJLEVBQUU7Z0JBQ3RCLHlCQUNLLElBQUksSUFDUCxJQUFJLEVBQUUsS0FBSyxJQUNYO2FBQ0g7WUFFRCxJQUFJLElBQUksQ0FBQyxJQUFJLEtBQUssS0FBSyxFQUFFO2dCQUN2Qix5QkFDSyxJQUFJLElBQ1AsSUFBSSxFQUFFLE1BQU0sSUFDWjthQUNIO1lBRUQsSUFBSSxJQUFJLENBQUMsSUFBSSxLQUFLLE1BQU0sRUFBRTtnQkFDeEIseUJBQ0ssSUFBSSxJQUNQLElBQUksRUFBRSxJQUFJLElBQ1Y7YUFDSDtRQUNILENBQUMsQ0FBQyxFQUE2QixDQUFDO1FBQ2hDLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDO0lBQzFCLENBQUM7Ozs7O0lBRUQsV0FBVyxDQUFDLE9BQXNCO1FBQ2hDLElBQUksY0FBYyxJQUFJLE9BQU8sSUFBSSxLQUFLLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxZQUFZLENBQUMsWUFBWSxDQUFDLEVBQUU7WUFDakYsSUFBSSxDQUFDLE1BQU0sR0FBRyxJQUFJLENBQUMscUJBQXFCLENBQUMsT0FBTyxDQUFDLFlBQVksQ0FBQyxZQUFZLENBQUMsQ0FBQztZQUM1RSxJQUFJLENBQUMsYUFBYSxHQUFHLElBQUksQ0FBQztTQUMzQjtRQUVELElBQUksWUFBWSxJQUFJLE9BQU8sRUFBRTs7a0JBQ3JCLGFBQWEsR0FBRyxtQkFBQSxPQUFPLENBQUMsVUFBVSxDQUFDLFlBQVksRUFBdUM7WUFDNUYsSUFBSSxDQUFDLFdBQVcsR0FBRyxhQUFhLENBQzlCLElBQUksQ0FBQyxLQUFLLENBQUMsWUFBWSxFQUFFLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxFQUMvQyxhQUFhLENBQ1gsYUFBYSxDQUFDLElBQUksQ0FDaEIsR0FBRyxDQUFDLENBQUMsTUFBK0IsRUFBRSxFQUFFO2dCQUN0QyxJQUFJLENBQUMsSUFBSSxDQUFDLGFBQWEsRUFBRTtvQkFDdkIsSUFBSSxDQUFDLGFBQWEsQ0FBQyxLQUFLLEVBQUUsQ0FBQztvQkFDM0IsTUFBTSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxHQUFHLEVBQUUsRUFBRSxDQUFDLElBQUksQ0FBQyxhQUFhLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQztvQkFDcEYsSUFBSSxDQUFDLE1BQU0sR0FBRyxJQUFJLENBQUMscUJBQXFCLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsYUFBYSxDQUFDLENBQUMsQ0FBQztvQkFDekUsSUFBSSxDQUFDLGFBQWEsR0FBRyxJQUFJLENBQUM7aUJBQzNCO1lBQ0gsQ0FBQyxDQUFDLEVBQ0YsR0FBRyxDQUFDLENBQUMsTUFBTSxFQUFFLEVBQUUsQ0FBQyxNQUFNLENBQUMsS0FBSyxFQUFFLENBQUMsQ0FDaEMsRUFDRCxJQUFJLENBQUMsT0FBTyxDQUNiLENBQUMsSUFBSSxDQUNKLEdBQUcsQ0FBQyxDQUFDLENBQUMsTUFBTSxFQUFFLFlBQVksQ0FBQyxFQUFFLEVBQUU7O3NCQUN2QixXQUFXLEdBQUcsTUFBTSxDQUFDLEtBQUssRUFBRTtnQkFDbEMsSUFBSSxDQUFDLFlBQVksRUFBRTtvQkFDakIsT0FBTyxXQUFXLENBQUM7aUJBQ3BCOztzQkFDSyxNQUFNLEdBQUcsWUFBWSxDQUFDLGlCQUFpQixFQUFFOztzQkFFekMsaUJBQWlCLEdBQUcsV0FBVyxDQUFDLE1BQU0sQ0FBQyxDQUFDLElBQXNCLEVBQUUsRUFBRSxDQUN0RSxNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLElBQUksQ0FDcEIsQ0FBQyxHQUFHLEVBQUUsRUFBRSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsUUFBUSxFQUFFLENBQUMsaUJBQWlCLEVBQUUsQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQ3BGLENBQ0Y7Z0JBQ0QsT0FBTyxpQkFBaUIsQ0FBQztZQUMzQixDQUFDLENBQUMsQ0FDSCxDQUNGLENBQUMsSUFBSSxDQUNKLEdBQUcsQ0FBQyxDQUFDLENBQUMsSUFBSSxFQUFFLE1BQU0sQ0FBQyxFQUFFLEVBQUU7Z0JBQ3JCLE9BQU8sQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLENBQUM7Z0JBQ3BCLElBQUksTUFBTSxDQUFDLE1BQU0sR0FBRyxDQUFDLEVBQUU7b0JBQ3JCLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO29CQUN4QixPQUFPO2lCQUNSO2dCQUNELElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO1lBQ3pCLENBQUMsQ0FBQyxFQUNGLEdBQUcsQ0FBQyxDQUFDLENBQUMsSUFBSSxFQUFFLE1BQU0sQ0FBQyxFQUFFLEVBQUU7O3NCQUNmLFdBQVcsR0FBRyxNQUFNLENBQUMsS0FBSyxFQUFFOztzQkFFNUIsVUFBVSxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUMsSUFBSSxLQUFLLElBQUksQ0FBQztnQkFFM0QsSUFBSSxDQUFDLElBQUksSUFBSSxDQUFDLFVBQVUsRUFBRTtvQkFDeEIsT0FBTyxXQUFXLENBQUM7aUJBQ3BCO2dCQUVELElBQUksQ0FBQyxVQUFVLENBQUMsSUFBSSxFQUFFO29CQUNwQixPQUFPLFdBQVcsQ0FBQztpQkFDcEI7Z0JBRUQsSUFBSSxVQUFVLENBQUMsSUFBSSxLQUFLLEtBQUssRUFBRTtvQkFDN0IsV0FBVyxDQUFDLElBQUksQ0FDZCxDQUFDLENBQW1CLEVBQUUsQ0FBbUIsRUFBRSxFQUFFLENBQzNDLENBQUMsQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUM7d0JBQ3JDLENBQUMsQ0FBQyxDQUFDO3dCQUNILENBQUMsQ0FBQyxDQUFDLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQ3pELENBQUM7aUJBQ0g7cUJBQU07b0JBQ0wsV0FBVyxDQUFDLElBQUksQ0FDZCxDQUFDLENBQW1CLEVBQUUsQ0FBbUIsRUFBRSxFQUFFLENBQzNDLENBQUMsQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUM7d0JBQ3JDLENBQUMsQ0FBQyxDQUFDO3dCQUNILENBQUMsQ0FBQyxDQUFDLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQ3pELENBQUM7aUJBQ0g7Z0JBRUQsT0FBTyxXQUFXLENBQUM7WUFDckIsQ0FBQyxDQUFDLENBQ0gsQ0FBQztTQUNIO0lBQ0gsQ0FBQzs7Ozs7SUFFRCxxQkFBcUIsQ0FBQyxHQUFrQjtRQUN0QyxPQUFPLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUMsRUFBRSxJQUFJLEVBQUUsQ0FBQyxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsQ0FBQyxDQUFDLENBQUM7SUFDbkQsQ0FBQzs7OztJQUVELFdBQVc7UUFDVCxJQUFJLENBQUMsV0FBVyxDQUFDLElBQUksRUFBRSxDQUFDO0lBQzFCLENBQUM7Ozs7O0lBRUQsU0FBUyxDQUFDLElBQXNCO1FBQzlCLElBQUksT0FBTyxJQUFJLENBQUMsVUFBVSxLQUFLLFVBQVU7WUFBRSxJQUFJLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxDQUFDO0lBQ25FLENBQUM7Ozs7SUFFRCxJQUFJLGVBQWU7UUFDakIsT0FBTyxJQUFJLENBQUMsTUFBTSxDQUFDLFlBQVksRUFBRSxDQUFDO0lBQ3BDLENBQUM7OztZQXhLRixTQUFTLFNBQUM7Z0JBQ1QsUUFBUSxFQUFFLGtCQUFrQjtnQkFDNUIsZzBCQUE2QztnQkFFN0MsZUFBZSxFQUFFLHVCQUF1QixDQUFDLE1BQU07O2FBQ2hEOzs7eUJBSUUsS0FBSzsyQkFFTCxLQUFLO3lCQUVMLEtBQUs7Ozs7SUFOTiwwQ0FBc0I7O0lBRXRCLDJDQUF5RDs7SUFFekQsNkNBQXFDOztJQUVyQywyQ0FBc0Q7O0lBRXRELDhDQUFpRDs7SUFFakQsOENBQStDOztJQUUvQyx1Q0FBOEM7O0lBRTlDLDRDQUFnRTs7SUFFaEUsc0NBQXVEOztJQUV2RCw0Q0FBMEM7O0lBRTFDLDhDQUE4Qjs7SUFFOUIsdUNBQThFOztJQUU5RSx3Q0FLRSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IENvbXBvbmVudCwgQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3ksIElucHV0LCBTaW1wbGVDaGFuZ2VzIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBPYnNlcnZhYmxlLCBFTVBUWSwgU3ViamVjdCwgY29tYmluZUxhdGVzdCwgb2YsIEJlaGF2aW9yU3ViamVjdCB9IGZyb20gJ3J4anMnO1xuaW1wb3J0IHtcbiAgdGFwLFxuICBtYXAsXG4gIHN0YXJ0V2l0aCxcbiAgZGVib3VuY2VUaW1lLFxuICBmaWx0ZXIsXG4gIGRpc3RpbmN0VW50aWxDaGFuZ2VkLFxuICB0YWtlVW50aWwsXG4gIGNhdGNoRXJyb3IsXG59IGZyb20gJ3J4anMvb3BlcmF0b3JzJztcbmltcG9ydCB7IEZvcm1Db250cm9sIH0gZnJvbSAnQGFuZ3VsYXIvZm9ybXMnO1xuaW50ZXJmYWNlIFZpcnR1YWxUYWJsZUl0ZW0ge1xuICBba2V5OiBzdHJpbmddOiBhbnk7XG59XG5cbmludGVyZmFjZSBWaXJ0dWFsVGFibGVDb2x1bW4ge1xuICBuYW1lOiBzdHJpbmc7XG4gIHNvcnQ6ICdhc2MnIHwgJ2Rlc2MnIHwgbnVsbDtcbn1cblxuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAnbmctdmlydHVhbC10YWJsZScsXG4gIHRlbXBsYXRlVXJsOiAnLi92aXJ0dWFsLXRhYmxlLmNvbXBvbmVudC5odG1sJyxcbiAgc3R5bGVVcmxzOiBbJy4vdmlydHVhbC10YWJsZS5jb21wb25lbnQuc2NzcyddLFxuICBjaGFuZ2VEZXRlY3Rpb246IENoYW5nZURldGVjdGlvblN0cmF0ZWd5Lk9uUHVzaCxcbn0pXG5leHBvcnQgY2xhc3MgVmlydHVhbFRhYmxlQ29tcG9uZW50IHtcbiAgcHVibGljIGl0ZW1Db3VudCA9IDI1O1xuXG4gIEBJbnB1dCgpIGRhdGFTb3VyY2U6IE9ic2VydmFibGU8QXJyYXk8VmlydHVhbFRhYmxlSXRlbT4+O1xuXG4gIEBJbnB1dCgpIGhlYWRlckNvbHVtbjogQXJyYXk8c3RyaW5nPjtcblxuICBASW5wdXQoKSBvblJvd0NsaWNrOiAoaXRlbTogVmlydHVhbFRhYmxlSXRlbSkgPT4gdm9pZDtcblxuICBmaWx0ZXJDb250cm9sOiBGb3JtQ29udHJvbCA9IG5ldyBGb3JtQ29udHJvbCgnJyk7XG5cbiAgcHJpdmF0ZSBfaGVhZGVyQ29sdW1uOiBTZXQ8c3RyaW5nPiA9IG5ldyBTZXQoKTtcblxuICBwdWJsaWMgY29sdW1uOiBBcnJheTxWaXJ0dWFsVGFibGVDb2x1bW4+ID0gW107XG5cbiAgcHVibGljIF9kYXRhU3RyZWFtOiBPYnNlcnZhYmxlPEFycmF5PFZpcnR1YWxUYWJsZUl0ZW0+PiA9IEVNUFRZO1xuXG4gIHByaXZhdGUgc29ydCQ6IFN1YmplY3Q8c3RyaW5nPiA9IG5ldyBTdWJqZWN0PHN0cmluZz4oKTtcblxuICBwcml2YXRlIF9kZXN0cm95ZWQkID0gbmV3IFN1YmplY3Q8dm9pZD4oKTtcblxuICBwcml2YXRlIF9oZWFkZXJXYXNTZXQgPSBmYWxzZTtcblxuICBwdWJsaWMgZW1wdHkkOiBCZWhhdmlvclN1YmplY3Q8Ym9vbGVhbj4gPSBuZXcgQmVoYXZpb3JTdWJqZWN0PGJvb2xlYW4+KGZhbHNlKTtcblxuICBwcml2YXRlIGZpbHRlciQgPSB0aGlzLmZpbHRlckNvbnRyb2wudmFsdWVDaGFuZ2VzLnBpcGUoXG4gICAgZGVib3VuY2VUaW1lKDMwMCksXG4gICAgc3RhcnRXaXRoKG51bGwpLFxuICAgIGRpc3RpbmN0VW50aWxDaGFuZ2VkKCksXG4gICAgdGFrZVVudGlsKHRoaXMuX2Rlc3Ryb3llZCQpLFxuICApO1xuXG4gIGFwcGx5U29ydChjb2x1bW46IHN0cmluZykge1xuICAgIHRoaXMuY29sdW1uID0gdGhpcy5jb2x1bW4ubWFwKChpdGVtKSA9PiB7XG4gICAgICBpZiAoaXRlbS5uYW1lICE9PSBjb2x1bW4pIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAuLi5pdGVtLFxuICAgICAgICAgIHNvcnQ6IG51bGwsXG4gICAgICAgIH07XG4gICAgICB9XG5cbiAgICAgIGlmIChpdGVtLnNvcnQgPT09IG51bGwpIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAuLi5pdGVtLFxuICAgICAgICAgIHNvcnQ6ICdhc2MnLFxuICAgICAgICB9O1xuICAgICAgfVxuXG4gICAgICBpZiAoaXRlbS5zb3J0ID09PSAnYXNjJykge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgIC4uLml0ZW0sXG4gICAgICAgICAgc29ydDogJ2Rlc2MnLFxuICAgICAgICB9O1xuICAgICAgfVxuXG4gICAgICBpZiAoaXRlbS5zb3J0ID09PSAnZGVzYycpIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAuLi5pdGVtLFxuICAgICAgICAgIHNvcnQ6IG51bGwsXG4gICAgICAgIH07XG4gICAgICB9XG4gICAgfSkgYXMgQXJyYXk8VmlydHVhbFRhYmxlQ29sdW1uPjtcbiAgICB0aGlzLnNvcnQkLm5leHQoY29sdW1uKTtcbiAgfVxuXG4gIG5nT25DaGFuZ2VzKGNoYW5nZXM6IFNpbXBsZUNoYW5nZXMpIHtcbiAgICBpZiAoJ2hlYWRlckNvbHVtbicgaW4gY2hhbmdlcyAmJiBBcnJheS5pc0FycmF5KGNoYW5nZXMuaGVhZGVyQ29sdW1uLmN1cnJlbnRWYWx1ZSkpIHtcbiAgICAgIHRoaXMuY29sdW1uID0gdGhpcy5jcmVhdGVDb2x1bW5Gcm9tQXJyYXkoY2hhbmdlcy5oZWFkZXJDb2x1bW4uY3VycmVudFZhbHVlKTtcbiAgICAgIHRoaXMuX2hlYWRlcldhc1NldCA9IHRydWU7XG4gICAgfVxuXG4gICAgaWYgKCdkYXRhU291cmNlJyBpbiBjaGFuZ2VzKSB7XG4gICAgICBjb25zdCBuZXdEYXRhU291cmNlID0gY2hhbmdlcy5kYXRhU291cmNlLmN1cnJlbnRWYWx1ZSBhcyBPYnNlcnZhYmxlPEFycmF5PFZpcnR1YWxUYWJsZUl0ZW0+PjtcbiAgICAgIHRoaXMuX2RhdGFTdHJlYW0gPSBjb21iaW5lTGF0ZXN0KFxuICAgICAgICB0aGlzLnNvcnQkLmFzT2JzZXJ2YWJsZSgpLnBpcGUoc3RhcnRXaXRoKG51bGwpKSxcbiAgICAgICAgY29tYmluZUxhdGVzdChcbiAgICAgICAgICBuZXdEYXRhU291cmNlLnBpcGUoXG4gICAgICAgICAgICB0YXAoKHN0cmVhbTogQXJyYXk8VmlydHVhbFRhYmxlSXRlbT4pID0+IHtcbiAgICAgICAgICAgICAgaWYgKCF0aGlzLl9oZWFkZXJXYXNTZXQpIHtcbiAgICAgICAgICAgICAgICB0aGlzLl9oZWFkZXJDb2x1bW4uY2xlYXIoKTtcbiAgICAgICAgICAgICAgICBzdHJlYW0uZm9yRWFjaCgoZSkgPT4gT2JqZWN0LmtleXMoZSkuZm9yRWFjaCgoa2V5KSA9PiB0aGlzLl9oZWFkZXJDb2x1bW4uYWRkKGtleSkpKTtcbiAgICAgICAgICAgICAgICB0aGlzLmNvbHVtbiA9IHRoaXMuY3JlYXRlQ29sdW1uRnJvbUFycmF5KEFycmF5LmZyb20odGhpcy5faGVhZGVyQ29sdW1uKSk7XG4gICAgICAgICAgICAgICAgdGhpcy5faGVhZGVyV2FzU2V0ID0gdHJ1ZTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSksXG4gICAgICAgICAgICBtYXAoKHN0cmVhbSkgPT4gc3RyZWFtLnNsaWNlKCkpLFxuICAgICAgICAgICksXG4gICAgICAgICAgdGhpcy5maWx0ZXIkLFxuICAgICAgICApLnBpcGUoXG4gICAgICAgICAgbWFwKChbc3RyZWFtLCBmaWx0ZXJTdHJpbmddKSA9PiB7XG4gICAgICAgICAgICBjb25zdCBzbGljZVN0cmVhbSA9IHN0cmVhbS5zbGljZSgpO1xuICAgICAgICAgICAgaWYgKCFmaWx0ZXJTdHJpbmcpIHtcbiAgICAgICAgICAgICAgcmV0dXJuIHNsaWNlU3RyZWFtO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY29uc3QgZmlsdGVyID0gZmlsdGVyU3RyaW5nLnRvTG9jYWxlTG93ZXJDYXNlKCk7XG5cbiAgICAgICAgICAgIGNvbnN0IGZpbHRlclNsaWNlU3RyZWFtID0gc2xpY2VTdHJlYW0uZmlsdGVyKChpdGVtOiBWaXJ0dWFsVGFibGVJdGVtKSA9PlxuICAgICAgICAgICAgICBPYmplY3Qua2V5cyhpdGVtKS5zb21lKFxuICAgICAgICAgICAgICAgIChrZXkpID0+IGl0ZW1ba2V5XSAmJiBpdGVtW2tleV0udG9TdHJpbmcoKS50b0xvY2FsZUxvd2VyQ2FzZSgpLmluZGV4T2YoZmlsdGVyKSA+IC0xLFxuICAgICAgICAgICAgICApLFxuICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIHJldHVybiBmaWx0ZXJTbGljZVN0cmVhbTtcbiAgICAgICAgICB9KSxcbiAgICAgICAgKSxcbiAgICAgICkucGlwZShcbiAgICAgICAgdGFwKChbc29ydCwgc3RyZWFtXSkgPT4ge1xuICAgICAgICAgIGNvbnNvbGUubG9nKHN0cmVhbSk7XG4gICAgICAgICAgaWYgKHN0cmVhbS5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICB0aGlzLmVtcHR5JC5uZXh0KGZhbHNlKTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICB9XG4gICAgICAgICAgdGhpcy5lbXB0eSQubmV4dCh0cnVlKTtcbiAgICAgICAgfSksXG4gICAgICAgIG1hcCgoW3NvcnQsIHN0cmVhbV0pID0+IHtcbiAgICAgICAgICBjb25zdCBzbGljZVN0cmVhbSA9IHN0cmVhbS5zbGljZSgpO1xuXG4gICAgICAgICAgY29uc3Qgc29ydENvbHVtbiA9IHRoaXMuY29sdW1uLmZpbmQoKGUpID0+IGUubmFtZSA9PT0gc29ydCk7XG5cbiAgICAgICAgICBpZiAoIXNvcnQgfHwgIXNvcnRDb2x1bW4pIHtcbiAgICAgICAgICAgIHJldHVybiBzbGljZVN0cmVhbTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBpZiAoIXNvcnRDb2x1bW4uc29ydCkge1xuICAgICAgICAgICAgcmV0dXJuIHNsaWNlU3RyZWFtO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIGlmIChzb3J0Q29sdW1uLnNvcnQgPT09ICdhc2MnKSB7XG4gICAgICAgICAgICBzbGljZVN0cmVhbS5zb3J0KFxuICAgICAgICAgICAgICAoYTogVmlydHVhbFRhYmxlSXRlbSwgYjogVmlydHVhbFRhYmxlSXRlbSkgPT5cbiAgICAgICAgICAgICAgICBhW3NvcnRDb2x1bW4ubmFtZV0gPiBiW3NvcnRDb2x1bW4ubmFtZV1cbiAgICAgICAgICAgICAgICAgID8gMVxuICAgICAgICAgICAgICAgICAgOiBhW3NvcnRDb2x1bW4ubmFtZV0gPT09IGJbc29ydENvbHVtbi5uYW1lXSA/IDAgOiAtMSxcbiAgICAgICAgICAgICk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHNsaWNlU3RyZWFtLnNvcnQoXG4gICAgICAgICAgICAgIChhOiBWaXJ0dWFsVGFibGVJdGVtLCBiOiBWaXJ0dWFsVGFibGVJdGVtKSA9PlxuICAgICAgICAgICAgICAgIGFbc29ydENvbHVtbi5uYW1lXSA8IGJbc29ydENvbHVtbi5uYW1lXVxuICAgICAgICAgICAgICAgICAgPyAxXG4gICAgICAgICAgICAgICAgICA6IGFbc29ydENvbHVtbi5uYW1lXSA9PT0gYltzb3J0Q29sdW1uLm5hbWVdID8gMCA6IC0xLFxuICAgICAgICAgICAgKTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICByZXR1cm4gc2xpY2VTdHJlYW07XG4gICAgICAgIH0pLFxuICAgICAgKTtcbiAgICB9XG4gIH1cblxuICBjcmVhdGVDb2x1bW5Gcm9tQXJyYXkoYXJyOiBBcnJheTxzdHJpbmc+KTogQXJyYXk8VmlydHVhbFRhYmxlQ29sdW1uPiB7XG4gICAgcmV0dXJuIGFyci5tYXAoKGUpID0+ICh7IG5hbWU6IGUsIHNvcnQ6IG51bGwgfSkpO1xuICB9XG5cbiAgbmdPbkRlc3Ryb3koKSB7XG4gICAgdGhpcy5fZGVzdHJveWVkJC5uZXh0KCk7XG4gIH1cblxuICBjbGlja0l0ZW0oaXRlbTogVmlydHVhbFRhYmxlSXRlbSkge1xuICAgIGlmICh0eXBlb2YgdGhpcy5vblJvd0NsaWNrID09PSAnZnVuY3Rpb24nKSB0aGlzLm9uUm93Q2xpY2soaXRlbSk7XG4gIH1cblxuICBnZXQgaXNFbXB0eVN1YmplY3QkKCkge1xuICAgIHJldHVybiB0aGlzLmVtcHR5JC5hc09ic2VydmFibGUoKTtcbiAgfVxufVxuIl19