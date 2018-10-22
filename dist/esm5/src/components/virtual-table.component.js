/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
import * as tslib_1 from "tslib";
import { Component, ChangeDetectionStrategy, Input, ViewChild, ElementRef, } from '@angular/core';
import { Observable, EMPTY, Subject, combineLatest } from 'rxjs';
import { tap, map, startWith, debounceTime, distinctUntilChanged, takeUntil, publishBehavior, refCount, } from 'rxjs/operators';
import { FormControl } from '@angular/forms';
var VirtualTableComponent = /** @class */ (function () {
    function VirtualTableComponent() {
        this.itemCount = 25;
        this.filterIsOpen = false;
        this.filterPlaceholder = 'Filter';
        this.filterControl = new FormControl('');
        this._headerDict = Object.create(null);
        this.column = [];
        this._dataStream = EMPTY;
        this.sort$ = new Subject();
        this._destroyed$ = new Subject();
        this._headerWasSet = false;
        this.filter$ = this.filterControl.valueChanges.pipe(debounceTime(300), startWith(null), distinctUntilChanged(), takeUntil(this._destroyed$));
    }
    /**
     * @param {?} column
     * @return {?}
     */
    VirtualTableComponent.prototype.applySort = /**
     * @param {?} column
     * @return {?}
     */
    function (column) {
        this.column = (/** @type {?} */ (this.column.map(function (item) {
            if (item.key !== column) {
                return tslib_1.__assign({}, item, { sort: null });
            }
            if (item.sort === null) {
                return tslib_1.__assign({}, item, { sort: 'asc' });
            }
            if (item.sort === 'asc') {
                return tslib_1.__assign({}, item, { sort: 'desc' });
            }
            if (item.sort === 'desc') {
                return tslib_1.__assign({}, item, { sort: null });
            }
        })));
        this.sort$.next(column);
    };
    /**
     * @param {?} changes
     * @return {?}
     */
    VirtualTableComponent.prototype.ngOnChanges = /**
     * @param {?} changes
     * @return {?}
     */
    function (changes) {
        var _this = this;
        if ('config' in changes) {
            this._config = (/** @type {?} */ (changes.config.currentValue));
            this.column = this.createColumnFromArray(this._config.column);
        }
        if ('dataSource' in changes) {
            /** @type {?} */
            var newDataSource = (/** @type {?} */ (changes.dataSource.currentValue));
            this._dataStream = combineLatest(this.sort$.asObservable().pipe(startWith(null)), this.filter$, newDataSource.pipe(tap(function (stream) {
                if (!_this._headerWasSet) {
                    /** @type {?} */
                    var setOfColumn_1 = new Set();
                    stream.forEach(function (e) { return Object.keys(e).forEach(function (key) { return setOfColumn_1.add(key); }); });
                    /** @type {?} */
                    var autoColumnArray = Array.from(setOfColumn_1);
                    _this.column = _this.createColumnFromArray(autoColumnArray);
                }
            }))).pipe(map(function (_a) {
                var _b = tslib_1.__read(_a, 3), sort = _b[0], filterString = _b[1], stream = _b[2];
                /** @type {?} */
                var sliceStream = stream.slice();
                /** @type {?} */
                var sortColumn = _this.column.find(function (e) { return e.key === sort; });
                if (!sort || !sortColumn) {
                    return [filterString, sliceStream];
                }
                if (!sortColumn.sort) {
                    return [filterString, sliceStream];
                }
                /** @type {?} */
                var _sortColumn = _this._headerDict[sort];
                if (sortColumn.sort === 'asc') {
                    sliceStream.sort(function (a, b) {
                        return _this.getElement(a, _sortColumn.func) > _this.getElement(b, _sortColumn.func)
                            ? 1
                            : _this.getElement(a, _sortColumn.func) === _this.getElement(b, _sortColumn.func)
                                ? 0
                                : -1;
                    });
                }
                else {
                    sliceStream.sort(function (a, b) {
                        return _this.getElement(a, _sortColumn.func) < _this.getElement(b, _sortColumn.func)
                            ? 1
                            : _this.getElement(a, _sortColumn.func) === _this.getElement(b, _sortColumn.func)
                                ? 0
                                : -1;
                    });
                }
                return [filterString, sliceStream];
            }), map(function (_a) {
                var _b = tslib_1.__read(_a, 2), filterString = _b[0], stream = _b[1];
                console.log(filterString, 'filter');
                console.log(stream);
                /** @type {?} */
                var sliceStream = stream.slice();
                if (!filterString) {
                    return sliceStream;
                }
                /** @type {?} */
                var filter = filterString.toLocaleLowerCase();
                /** @type {?} */
                var filterSliceStream = sliceStream.filter(function (item) {
                    return Object.keys(item).some(function (key) { return item[key] && item[key].toString().toLocaleLowerCase().indexOf(filter) > -1; });
                });
                return filterSliceStream;
            }), publishBehavior([]), refCount());
            this.isEmptySubject$ = this._dataStream.pipe(map(function (data) { return !data.length; }));
        }
    };
    /**
     * @param {?} arr
     * @return {?}
     */
    VirtualTableComponent.prototype.createColumnFromArray = /**
     * @param {?} arr
     * @return {?}
     */
    function (arr) {
        var _this = this;
        if (!arr || arr.length === 0) {
            return;
        }
        this._headerWasSet = true;
        /** @type {?} */
        var columnArr = arr.map(function (item) {
            /** @type {?} */
            var columnItem;
            if (typeof item === 'string') {
                columnItem = _this.createColumnFromString(item);
            }
            else {
                columnItem = item;
            }
            if (_this._headerDict[columnItem.key]) {
                throw Error("Column key=" + columnItem.key + " already declare");
            }
            _this._headerDict[columnItem.key] = columnItem;
            return columnItem;
        });
        return columnArr;
    };
    /**
     * @param {?} item
     * @param {?} func
     * @return {?}
     */
    VirtualTableComponent.prototype.getElement = /**
     * @param {?} item
     * @param {?} func
     * @return {?}
     */
    function (item, func) {
        return func.call(this, item);
    };
    /**
     * @param {?} str
     * @return {?}
     */
    VirtualTableComponent.prototype.createColumnFromString = /**
     * @param {?} str
     * @return {?}
     */
    function (str) {
        return {
            name: str,
            key: str,
            func: function (item) { return item[str]; },
            sort: null,
        };
    };
    /**
     * @return {?}
     */
    VirtualTableComponent.prototype.ngOnDestroy = /**
     * @return {?}
     */
    function () {
        this._destroyed$.next();
    };
    /**
     * @param {?} item
     * @return {?}
     */
    VirtualTableComponent.prototype.clickItem = /**
     * @param {?} item
     * @return {?}
     */
    function (item) {
        if (typeof this.onRowClick === 'function')
            this.onRowClick(item);
    };
    /**
     * @return {?}
     */
    VirtualTableComponent.prototype.toggleFilter = /**
     * @return {?}
     */
    function () {
        var _this = this;
        this.filterIsOpen = !this.filterIsOpen;
        if (this.filterIsOpen) {
            setTimeout(function () {
                _this.inputFilterFocus.nativeElement.focus();
            });
        }
        this.filterControl.setValue('', { emitEvent: !this.filterIsOpen });
    };
    VirtualTableComponent.decorators = [
        { type: Component, args: [{
                    selector: 'ng-virtual-table',
                    template: "<div class=\"table\">\n  <div class=\"header\">\n    <div *ngFor=\"let headerItem of column\" class=\"header-item\" (click)=\"applySort(headerItem.key)\" [ngClass]=\"headerItem.sort\">{{\n      headerItem.name\n      }}</div>\n    <div class=\"filter-spot\" [ngClass]=\"[filterIsOpen ? 'open' : '']\">\n      <input #inputFilterFocus class=\"filter-spot-input\" matInput [placeholder]=\"filterPlaceholder\" [formControl]=\"filterControl\">\n      <mat-icon (click)=\"toggleFilter()\">{{ filterIsOpen ? 'close' : 'filter_list' }}</mat-icon>\n    </div>\n  </div>\n  <div class=\"virtual-table-content\">\n    <cdk-virtual-scroll-viewport *ngIf=\"!(isEmptySubject$ | async); else emptyContainer\" [itemSize]=\"itemCount\">\n      <div *cdkVirtualFor=\"let item of _dataStream;templateCacheSize: 0\" class=\"virtual-table-row\" (click)=\"clickItem(item)\">\n        <div *ngFor=\"let headerItem of column\" class=\"virtual-table-column\">{{\n          item[headerItem.name] }}</div>\n      </div>\n    </cdk-virtual-scroll-viewport>\n    <ng-template #emptyContainer>\n      Data is empty\n    </ng-template>\n  </div>\n</div>",
                    changeDetection: ChangeDetectionStrategy.OnPush,
                    styles: ["@font-face{font-family:'Material Icons';font-style:normal;font-weight:400;src:url(https://fonts.gstatic.com/s/materialicons/v41/flUhRq6tzZclQEJ-Vdg-IuiaDsNcIhQ8tQ.woff2) format(\"woff2\")}:host{display:block;position:relative}:host mat-icon::ng-deep{font-family:'Material Icons'}.table{height:100%;position:relative}.table .header{display:flex;margin-top:8px;height:40px;align-items:center;justify-content:space-between;border-bottom:1px solid #000}.table .header .filter-spot{display:flex;align-items:center;right:0;width:15px;min-width:15px;height:100%;position:relative}.table .header .filter-spot .filter-spot-input{display:none}.table .header .filter-spot mat-icon{cursor:pointer;margin-top:9px}.table .header .filter-spot.open mat-icon{z-index:1}.table .header .filter-spot.open .filter-spot-input{display:block;position:absolute;right:0}.table .header-item{cursor:pointer;display:flex;align-items:center;width:100%;height:100%;padding-left:16px}.table .header-item.asc:after{margin-right:4px;content:'arrow_downward';font-family:\"Material Icons\"}.table .header-item.desc:after{margin-right:4px;font-family:'Material Icons';content:'arrow_upward'}.table .virtual-table-content cdk-virtual-scroll-viewport::ng-deep{height:100%;width:100%}.table .virtual-table-content,.table .virtual-table-empty{display:flex;flex-direction:column;height:calc(100% - 40px)}.table .virtual-table-row{display:flex;flex-direction:row;min-height:20px;justify-content:space-between;align-items:center}.table .virtual-table-column{display:flex;width:100%;padding-left:16px;height:100%;align-items:center}"]
                }] }
    ];
    VirtualTableComponent.propDecorators = {
        inputFilterFocus: [{ type: ViewChild, args: ['inputFilterFocus',] }],
        dataSource: [{ type: Input }],
        filterPlaceholder: [{ type: Input }],
        config: [{ type: Input }],
        onRowClick: [{ type: Input }]
    };
    return VirtualTableComponent;
}());
export { VirtualTableComponent };
if (false) {
    /** @type {?} */
    VirtualTableComponent.prototype.itemCount;
    /** @type {?} */
    VirtualTableComponent.prototype._config;
    /** @type {?} */
    VirtualTableComponent.prototype.filterIsOpen;
    /** @type {?} */
    VirtualTableComponent.prototype.inputFilterFocus;
    /** @type {?} */
    VirtualTableComponent.prototype.dataSource;
    /** @type {?} */
    VirtualTableComponent.prototype.filterPlaceholder;
    /** @type {?} */
    VirtualTableComponent.prototype.config;
    /** @type {?} */
    VirtualTableComponent.prototype.onRowClick;
    /** @type {?} */
    VirtualTableComponent.prototype.filterControl;
    /** @type {?} */
    VirtualTableComponent.prototype._headerDict;
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
    VirtualTableComponent.prototype.isEmptySubject$;
    /** @type {?} */
    VirtualTableComponent.prototype.filter$;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidmlydHVhbC10YWJsZS5jb21wb25lbnQuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9uZy12aXJ0dWFsLXRhYmxlLyIsInNvdXJjZXMiOlsic3JjL2NvbXBvbmVudHMvdmlydHVhbC10YWJsZS5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFBQSxPQUFPLEVBQ0wsU0FBUyxFQUNULHVCQUF1QixFQUN2QixLQUFLLEVBRUwsU0FBUyxFQUNULFVBQVUsR0FDWCxNQUFNLGVBQWUsQ0FBQztBQUN2QixPQUFPLEVBQUUsVUFBVSxFQUFFLEtBQUssRUFBRSxPQUFPLEVBQUUsYUFBYSxFQUF1QixNQUFNLE1BQU0sQ0FBQztBQUN0RixPQUFPLEVBQ0wsR0FBRyxFQUNILEdBQUcsRUFDSCxTQUFTLEVBQ1QsWUFBWSxFQUVaLG9CQUFvQixFQUNwQixTQUFTLEVBS1QsZUFBZSxFQUNmLFFBQVEsR0FDVCxNQUFNLGdCQUFnQixDQUFDO0FBQ3hCLE9BQU8sRUFBRSxXQUFXLEVBQUUsTUFBTSxnQkFBZ0IsQ0FBQztBQUc3QztJQUFBO1FBT1MsY0FBUyxHQUFHLEVBQUUsQ0FBQztRQUlmLGlCQUFZLEdBQUcsS0FBSyxDQUFDO1FBTW5CLHNCQUFpQixHQUFHLFFBQVEsQ0FBQztRQU10QyxrQkFBYSxHQUFnQixJQUFJLFdBQVcsQ0FBQyxFQUFFLENBQUMsQ0FBQztRQUV6QyxnQkFBVyxHQUEwQyxNQUFNLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDO1FBRTFFLFdBQU0sR0FBOEIsRUFBRSxDQUFDO1FBRXZDLGdCQUFXLEdBQXdDLEtBQUssQ0FBQztRQUV4RCxVQUFLLEdBQW9CLElBQUksT0FBTyxFQUFVLENBQUM7UUFFL0MsZ0JBQVcsR0FBRyxJQUFJLE9BQU8sRUFBUSxDQUFDO1FBRWxDLGtCQUFhLEdBQUcsS0FBSyxDQUFDO1FBSXRCLFlBQU8sR0FBRyxJQUFJLENBQUMsYUFBYSxDQUFDLFlBQVksQ0FBQyxJQUFJLENBQ3BELFlBQVksQ0FBQyxHQUFHLENBQUMsRUFDakIsU0FBUyxDQUFDLElBQUksQ0FBQyxFQUNmLG9CQUFvQixFQUFFLEVBQ3RCLFNBQVMsQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLENBQzVCLENBQUM7SUEwS0osQ0FBQzs7Ozs7SUF4S0MseUNBQVM7Ozs7SUFBVCxVQUFVLE1BQWM7UUFDdEIsSUFBSSxDQUFDLE1BQU0sR0FBRyxtQkFBQSxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxVQUFDLElBQUk7WUFDakMsSUFBSSxJQUFJLENBQUMsR0FBRyxLQUFLLE1BQU0sRUFBRTtnQkFDdkIsNEJBQ0ssSUFBSSxJQUNQLElBQUksRUFBRSxJQUFJLElBQ1Y7YUFDSDtZQUVELElBQUksSUFBSSxDQUFDLElBQUksS0FBSyxJQUFJLEVBQUU7Z0JBQ3RCLDRCQUNLLElBQUksSUFDUCxJQUFJLEVBQUUsS0FBSyxJQUNYO2FBQ0g7WUFFRCxJQUFJLElBQUksQ0FBQyxJQUFJLEtBQUssS0FBSyxFQUFFO2dCQUN2Qiw0QkFDSyxJQUFJLElBQ1AsSUFBSSxFQUFFLE1BQU0sSUFDWjthQUNIO1lBRUQsSUFBSSxJQUFJLENBQUMsSUFBSSxLQUFLLE1BQU0sRUFBRTtnQkFDeEIsNEJBQ0ssSUFBSSxJQUNQLElBQUksRUFBRSxJQUFJLElBQ1Y7YUFDSDtRQUNILENBQUMsQ0FBQyxFQUE2QixDQUFDO1FBQ2hDLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDO0lBQzFCLENBQUM7Ozs7O0lBRUQsMkNBQVc7Ozs7SUFBWCxVQUFZLE9BQXNCO1FBQWxDLGlCQWlGQztRQWhGQyxJQUFJLFFBQVEsSUFBSSxPQUFPLEVBQUU7WUFDdkIsSUFBSSxDQUFDLE9BQU8sR0FBRyxtQkFBQSxPQUFPLENBQUMsTUFBTSxDQUFDLFlBQVksRUFBc0IsQ0FBQztZQUNqRSxJQUFJLENBQUMsTUFBTSxHQUFHLElBQUksQ0FBQyxxQkFBcUIsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxDQUFDO1NBQy9EO1FBRUQsSUFBSSxZQUFZLElBQUksT0FBTyxFQUFFOztnQkFDckIsYUFBYSxHQUFHLG1CQUFBLE9BQU8sQ0FBQyxVQUFVLENBQUMsWUFBWSxFQUF1QztZQUM1RixJQUFJLENBQUMsV0FBVyxHQUFHLGFBQWEsQ0FDOUIsSUFBSSxDQUFDLEtBQUssQ0FBQyxZQUFZLEVBQUUsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxDQUFDLEVBQy9DLElBQUksQ0FBQyxPQUFPLEVBQ1osYUFBYSxDQUFDLElBQUksQ0FDaEIsR0FBRyxDQUFDLFVBQUMsTUFBK0I7Z0JBQ2xDLElBQUksQ0FBQyxLQUFJLENBQUMsYUFBYSxFQUFFOzt3QkFDakIsYUFBVyxHQUFHLElBQUksR0FBRyxFQUFFO29CQUM3QixNQUFNLENBQUMsT0FBTyxDQUFDLFVBQUMsQ0FBQyxJQUFLLE9BQUEsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsVUFBQyxHQUFHLElBQUssT0FBQSxhQUFXLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxFQUFwQixDQUFvQixDQUFDLEVBQXJELENBQXFELENBQUMsQ0FBQzs7d0JBQ3ZFLGVBQWUsR0FBRyxLQUFLLENBQUMsSUFBSSxDQUFDLGFBQVcsQ0FBQztvQkFDL0MsS0FBSSxDQUFDLE1BQU0sR0FBRyxLQUFJLENBQUMscUJBQXFCLENBQUMsZUFBZSxDQUFDLENBQUM7aUJBQzNEO1lBQ0gsQ0FBQyxDQUFDLENBQ0gsQ0FDRixDQUFDLElBQUksQ0FDSixHQUFHLENBQUMsVUFBQyxFQUE0QjtvQkFBNUIsMEJBQTRCLEVBQTNCLFlBQUksRUFBRSxvQkFBWSxFQUFFLGNBQU07O29CQUN4QixXQUFXLEdBQUcsTUFBTSxDQUFDLEtBQUssRUFBRTs7b0JBRTVCLFVBQVUsR0FBRyxLQUFJLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxVQUFDLENBQUMsSUFBSyxPQUFBLENBQUMsQ0FBQyxHQUFHLEtBQUssSUFBSSxFQUFkLENBQWMsQ0FBQztnQkFFMUQsSUFBSSxDQUFDLElBQUksSUFBSSxDQUFDLFVBQVUsRUFBRTtvQkFDeEIsT0FBTyxDQUFDLFlBQVksRUFBRSxXQUFXLENBQUMsQ0FBQztpQkFDcEM7Z0JBRUQsSUFBSSxDQUFDLFVBQVUsQ0FBQyxJQUFJLEVBQUU7b0JBQ3BCLE9BQU8sQ0FBQyxZQUFZLEVBQUUsV0FBVyxDQUFDLENBQUM7aUJBQ3BDOztvQkFFSyxXQUFXLEdBQUcsS0FBSSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUM7Z0JBRTFDLElBQUksVUFBVSxDQUFDLElBQUksS0FBSyxLQUFLLEVBQUU7b0JBQzdCLFdBQVcsQ0FBQyxJQUFJLENBQ2QsVUFBQyxDQUFtQixFQUFFLENBQW1CO3dCQUN2QyxPQUFBLEtBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQyxFQUFFLFdBQVcsQ0FBQyxJQUFJLENBQUMsR0FBRyxLQUFJLENBQUMsVUFBVSxDQUFDLENBQUMsRUFBRSxXQUFXLENBQUMsSUFBSSxDQUFDOzRCQUN6RSxDQUFDLENBQUMsQ0FBQzs0QkFDSCxDQUFDLENBQUMsS0FBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDLEVBQUUsV0FBVyxDQUFDLElBQUksQ0FBQyxLQUFLLEtBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQyxFQUFFLFdBQVcsQ0FBQyxJQUFJLENBQUM7Z0NBQzdFLENBQUMsQ0FBQyxDQUFDO2dDQUNILENBQUMsQ0FBQyxDQUFDLENBQUM7b0JBSlIsQ0FJUSxDQUNYLENBQUM7aUJBQ0g7cUJBQU07b0JBQ0wsV0FBVyxDQUFDLElBQUksQ0FDZCxVQUFDLENBQW1CLEVBQUUsQ0FBbUI7d0JBQ3ZDLE9BQUEsS0FBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDLEVBQUUsV0FBVyxDQUFDLElBQUksQ0FBQyxHQUFHLEtBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQyxFQUFFLFdBQVcsQ0FBQyxJQUFJLENBQUM7NEJBQ3pFLENBQUMsQ0FBQyxDQUFDOzRCQUNILENBQUMsQ0FBQyxLQUFJLENBQUMsVUFBVSxDQUFDLENBQUMsRUFBRSxXQUFXLENBQUMsSUFBSSxDQUFDLEtBQUssS0FBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDLEVBQUUsV0FBVyxDQUFDLElBQUksQ0FBQztnQ0FDN0UsQ0FBQyxDQUFDLENBQUM7Z0NBQ0gsQ0FBQyxDQUFDLENBQUMsQ0FBQztvQkFKUixDQUlRLENBQ1gsQ0FBQztpQkFDSDtnQkFFRCxPQUFPLENBQUMsWUFBWSxFQUFFLFdBQVcsQ0FBQyxDQUFDO1lBQ3JDLENBQUMsQ0FBQyxFQUNGLEdBQUcsQ0FBQyxVQUFDLEVBQXNCO29CQUF0QiwwQkFBc0IsRUFBckIsb0JBQVksRUFBRSxjQUFNO2dCQUN4QixPQUFPLENBQUMsR0FBRyxDQUFDLFlBQVksRUFBRSxRQUFRLENBQUMsQ0FBQztnQkFDcEMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsQ0FBQzs7b0JBQ2QsV0FBVyxHQUFHLE1BQU0sQ0FBQyxLQUFLLEVBQUU7Z0JBQ2xDLElBQUksQ0FBQyxZQUFZLEVBQUU7b0JBQ2pCLE9BQU8sV0FBVyxDQUFDO2lCQUNwQjs7b0JBQ0ssTUFBTSxHQUFHLFlBQVksQ0FBQyxpQkFBaUIsRUFBRTs7b0JBRXpDLGlCQUFpQixHQUFHLFdBQVcsQ0FBQyxNQUFNLENBQUMsVUFBQyxJQUFzQjtvQkFDbEUsT0FBQSxNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLElBQUksQ0FDcEIsVUFBQyxHQUFHLElBQUssT0FBQSxJQUFJLENBQUMsR0FBRyxDQUFDLElBQUksSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLFFBQVEsRUFBRSxDQUFDLGlCQUFpQixFQUFFLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUExRSxDQUEwRSxDQUNwRjtnQkFGRCxDQUVDLENBQ0Y7Z0JBQ0QsT0FBTyxpQkFBaUIsQ0FBQztZQUMzQixDQUFDLENBQUMsRUFDRixlQUFlLENBQUMsRUFBRSxDQUFDLEVBQ25CLFFBQVEsRUFBRSxDQUNYLENBQUM7WUFFRixJQUFJLENBQUMsZUFBZSxHQUFHLElBQUksQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxVQUFDLElBQUksSUFBSyxPQUFBLENBQUMsSUFBSSxDQUFDLE1BQU0sRUFBWixDQUFZLENBQUMsQ0FBQyxDQUFDO1NBQzNFO0lBQ0gsQ0FBQzs7Ozs7SUFFRCxxREFBcUI7Ozs7SUFBckIsVUFBc0IsR0FBdUM7UUFBN0QsaUJBb0JDO1FBbkJDLElBQUksQ0FBQyxHQUFHLElBQUksR0FBRyxDQUFDLE1BQU0sS0FBSyxDQUFDLEVBQUU7WUFDNUIsT0FBTztTQUNSO1FBQ0QsSUFBSSxDQUFDLGFBQWEsR0FBRyxJQUFJLENBQUM7O1lBQ3BCLFNBQVMsR0FBRyxHQUFHLENBQUMsR0FBRyxDQUFDLFVBQUMsSUFBd0I7O2dCQUM3QyxVQUFVO1lBQ2QsSUFBSSxPQUFPLElBQUksS0FBSyxRQUFRLEVBQUU7Z0JBQzVCLFVBQVUsR0FBRyxLQUFJLENBQUMsc0JBQXNCLENBQUMsSUFBSSxDQUFDLENBQUM7YUFDaEQ7aUJBQU07Z0JBQ0wsVUFBVSxHQUFHLElBQUksQ0FBQzthQUNuQjtZQUNELElBQUksS0FBSSxDQUFDLFdBQVcsQ0FBQyxVQUFVLENBQUMsR0FBRyxDQUFDLEVBQUU7Z0JBQ3BDLE1BQU0sS0FBSyxDQUFDLGdCQUFjLFVBQVUsQ0FBQyxHQUFHLHFCQUFrQixDQUFDLENBQUM7YUFDN0Q7WUFDRCxLQUFJLENBQUMsV0FBVyxDQUFDLFVBQVUsQ0FBQyxHQUFHLENBQUMsR0FBRyxVQUFVLENBQUM7WUFFOUMsT0FBTyxVQUFVLENBQUM7UUFDcEIsQ0FBQyxDQUFDO1FBQ0YsT0FBTyxTQUFTLENBQUM7SUFDbkIsQ0FBQzs7Ozs7O0lBRU8sMENBQVU7Ozs7O0lBQWxCLFVBQW1CLElBQXNCLEVBQUUsSUFBcUM7UUFDOUUsT0FBTyxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxJQUFJLENBQUMsQ0FBQztJQUMvQixDQUFDOzs7OztJQUVPLHNEQUFzQjs7OztJQUE5QixVQUErQixHQUFXO1FBQ3hDLE9BQU87WUFDTCxJQUFJLEVBQUUsR0FBRztZQUNULEdBQUcsRUFBRSxHQUFHO1lBQ1IsSUFBSSxFQUFFLFVBQUMsSUFBSSxJQUFLLE9BQUEsSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFULENBQVM7WUFDekIsSUFBSSxFQUFFLElBQUk7U0FDWCxDQUFDO0lBQ0osQ0FBQzs7OztJQUVELDJDQUFXOzs7SUFBWDtRQUNFLElBQUksQ0FBQyxXQUFXLENBQUMsSUFBSSxFQUFFLENBQUM7SUFDMUIsQ0FBQzs7Ozs7SUFFRCx5Q0FBUzs7OztJQUFULFVBQVUsSUFBc0I7UUFDOUIsSUFBSSxPQUFPLElBQUksQ0FBQyxVQUFVLEtBQUssVUFBVTtZQUFFLElBQUksQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLENBQUM7SUFDbkUsQ0FBQzs7OztJQUVELDRDQUFZOzs7SUFBWjtRQUFBLGlCQVFDO1FBUEMsSUFBSSxDQUFDLFlBQVksR0FBRyxDQUFDLElBQUksQ0FBQyxZQUFZLENBQUM7UUFDdkMsSUFBSSxJQUFJLENBQUMsWUFBWSxFQUFFO1lBQ3JCLFVBQVUsQ0FBQztnQkFDVCxLQUFJLENBQUMsZ0JBQWdCLENBQUMsYUFBYSxDQUFDLEtBQUssRUFBRSxDQUFDO1lBQzlDLENBQUMsQ0FBQyxDQUFDO1NBQ0o7UUFDRCxJQUFJLENBQUMsYUFBYSxDQUFDLFFBQVEsQ0FBQyxFQUFFLEVBQUUsRUFBRSxTQUFTLEVBQUUsQ0FBQyxJQUFJLENBQUMsWUFBWSxFQUFFLENBQUMsQ0FBQztJQUNyRSxDQUFDOztnQkFyTkYsU0FBUyxTQUFDO29CQUNULFFBQVEsRUFBRSxrQkFBa0I7b0JBQzVCLCttQ0FBNkM7b0JBRTdDLGVBQWUsRUFBRSx1QkFBdUIsQ0FBQyxNQUFNOztpQkFDaEQ7OzttQ0FRRSxTQUFTLFNBQUMsa0JBQWtCOzZCQUU1QixLQUFLO29DQUVMLEtBQUs7eUJBRUwsS0FBSzs2QkFFTCxLQUFLOztJQWlNUiw0QkFBQztDQUFBLEFBdE5ELElBc05DO1NBaE5ZLHFCQUFxQjs7O0lBQ2hDLDBDQUFzQjs7SUFFdEIsd0NBQW9DOztJQUVwQyw2Q0FBNEI7O0lBRTVCLGlEQUE0RDs7SUFFNUQsMkNBQXlEOztJQUV6RCxrREFBc0M7O0lBRXRDLHVDQUFvQzs7SUFFcEMsMkNBQXNEOztJQUV0RCw4Q0FBaUQ7O0lBRWpELDRDQUFpRjs7SUFFakYsdUNBQThDOztJQUU5Qyw0Q0FBZ0U7O0lBRWhFLHNDQUF1RDs7SUFFdkQsNENBQTBDOztJQUUxQyw4Q0FBOEI7O0lBRTlCLGdEQUE0Qzs7SUFFNUMsd0NBS0UiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge1xuICBDb21wb25lbnQsXG4gIENoYW5nZURldGVjdGlvblN0cmF0ZWd5LFxuICBJbnB1dCxcbiAgU2ltcGxlQ2hhbmdlcyxcbiAgVmlld0NoaWxkLFxuICBFbGVtZW50UmVmLFxufSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IE9ic2VydmFibGUsIEVNUFRZLCBTdWJqZWN0LCBjb21iaW5lTGF0ZXN0LCBvZiwgQmVoYXZpb3JTdWJqZWN0IH0gZnJvbSAncnhqcyc7XG5pbXBvcnQge1xuICB0YXAsXG4gIG1hcCxcbiAgc3RhcnRXaXRoLFxuICBkZWJvdW5jZVRpbWUsXG4gIGZpbHRlcixcbiAgZGlzdGluY3RVbnRpbENoYW5nZWQsXG4gIHRha2VVbnRpbCxcbiAgY2F0Y2hFcnJvcixcbiAgc2hhcmUsXG4gIHNoYXJlUmVwbGF5LFxuICBzd2l0Y2hNYXAsXG4gIHB1Ymxpc2hCZWhhdmlvcixcbiAgcmVmQ291bnQsXG59IGZyb20gJ3J4anMvb3BlcmF0b3JzJztcbmltcG9ydCB7IEZvcm1Db250cm9sIH0gZnJvbSAnQGFuZ3VsYXIvZm9ybXMnO1xuaW1wb3J0IHsgVmlydHVhbFRhYmxlQ29uZmlnLCBWaXJ0dWFsVGFibGVJdGVtLCBWaXJ0dWFsVGFibGVDb2x1bW4gfSBmcm9tICcuLi9pbnRlcmZhY2VzJztcblxuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAnbmctdmlydHVhbC10YWJsZScsXG4gIHRlbXBsYXRlVXJsOiAnLi92aXJ0dWFsLXRhYmxlLmNvbXBvbmVudC5odG1sJyxcbiAgc3R5bGVVcmxzOiBbJy4vdmlydHVhbC10YWJsZS5jb21wb25lbnQuc2NzcyddLFxuICBjaGFuZ2VEZXRlY3Rpb246IENoYW5nZURldGVjdGlvblN0cmF0ZWd5Lk9uUHVzaCxcbn0pXG5leHBvcnQgY2xhc3MgVmlydHVhbFRhYmxlQ29tcG9uZW50IHtcbiAgcHVibGljIGl0ZW1Db3VudCA9IDI1O1xuXG4gIHByaXZhdGUgX2NvbmZpZzogVmlydHVhbFRhYmxlQ29uZmlnO1xuXG4gIHB1YmxpYyBmaWx0ZXJJc09wZW4gPSBmYWxzZTtcblxuICBAVmlld0NoaWxkKCdpbnB1dEZpbHRlckZvY3VzJykgaW5wdXRGaWx0ZXJGb2N1czogRWxlbWVudFJlZjtcblxuICBASW5wdXQoKSBkYXRhU291cmNlOiBPYnNlcnZhYmxlPEFycmF5PFZpcnR1YWxUYWJsZUl0ZW0+PjtcblxuICBASW5wdXQoKSBmaWx0ZXJQbGFjZWhvbGRlciA9ICdGaWx0ZXInO1xuXG4gIEBJbnB1dCgpIGNvbmZpZzogVmlydHVhbFRhYmxlQ29uZmlnO1xuXG4gIEBJbnB1dCgpIG9uUm93Q2xpY2s6IChpdGVtOiBWaXJ0dWFsVGFibGVJdGVtKSA9PiB2b2lkO1xuXG4gIGZpbHRlckNvbnRyb2w6IEZvcm1Db250cm9sID0gbmV3IEZvcm1Db250cm9sKCcnKTtcblxuICBwcml2YXRlIF9oZWFkZXJEaWN0OiB7IFtrZXk6IHN0cmluZ106IFZpcnR1YWxUYWJsZUNvbHVtbiB9ID0gT2JqZWN0LmNyZWF0ZShudWxsKTtcblxuICBwdWJsaWMgY29sdW1uOiBBcnJheTxWaXJ0dWFsVGFibGVDb2x1bW4+ID0gW107XG5cbiAgcHVibGljIF9kYXRhU3RyZWFtOiBPYnNlcnZhYmxlPEFycmF5PFZpcnR1YWxUYWJsZUl0ZW0+PiA9IEVNUFRZO1xuXG4gIHByaXZhdGUgc29ydCQ6IFN1YmplY3Q8c3RyaW5nPiA9IG5ldyBTdWJqZWN0PHN0cmluZz4oKTtcblxuICBwcml2YXRlIF9kZXN0cm95ZWQkID0gbmV3IFN1YmplY3Q8dm9pZD4oKTtcblxuICBwcml2YXRlIF9oZWFkZXJXYXNTZXQgPSBmYWxzZTtcblxuICBwdWJsaWMgaXNFbXB0eVN1YmplY3QkOiBPYnNlcnZhYmxlPGJvb2xlYW4+O1xuXG4gIHByaXZhdGUgZmlsdGVyJCA9IHRoaXMuZmlsdGVyQ29udHJvbC52YWx1ZUNoYW5nZXMucGlwZShcbiAgICBkZWJvdW5jZVRpbWUoMzAwKSxcbiAgICBzdGFydFdpdGgobnVsbCksXG4gICAgZGlzdGluY3RVbnRpbENoYW5nZWQoKSxcbiAgICB0YWtlVW50aWwodGhpcy5fZGVzdHJveWVkJCksXG4gICk7XG5cbiAgYXBwbHlTb3J0KGNvbHVtbjogc3RyaW5nKSB7XG4gICAgdGhpcy5jb2x1bW4gPSB0aGlzLmNvbHVtbi5tYXAoKGl0ZW0pID0+IHtcbiAgICAgIGlmIChpdGVtLmtleSAhPT0gY29sdW1uKSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgLi4uaXRlbSxcbiAgICAgICAgICBzb3J0OiBudWxsLFxuICAgICAgICB9O1xuICAgICAgfVxuXG4gICAgICBpZiAoaXRlbS5zb3J0ID09PSBudWxsKSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgLi4uaXRlbSxcbiAgICAgICAgICBzb3J0OiAnYXNjJyxcbiAgICAgICAgfTtcbiAgICAgIH1cblxuICAgICAgaWYgKGl0ZW0uc29ydCA9PT0gJ2FzYycpIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAuLi5pdGVtLFxuICAgICAgICAgIHNvcnQ6ICdkZXNjJyxcbiAgICAgICAgfTtcbiAgICAgIH1cblxuICAgICAgaWYgKGl0ZW0uc29ydCA9PT0gJ2Rlc2MnKSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgLi4uaXRlbSxcbiAgICAgICAgICBzb3J0OiBudWxsLFxuICAgICAgICB9O1xuICAgICAgfVxuICAgIH0pIGFzIEFycmF5PFZpcnR1YWxUYWJsZUNvbHVtbj47XG4gICAgdGhpcy5zb3J0JC5uZXh0KGNvbHVtbik7XG4gIH1cblxuICBuZ09uQ2hhbmdlcyhjaGFuZ2VzOiBTaW1wbGVDaGFuZ2VzKSB7XG4gICAgaWYgKCdjb25maWcnIGluIGNoYW5nZXMpIHtcbiAgICAgIHRoaXMuX2NvbmZpZyA9IGNoYW5nZXMuY29uZmlnLmN1cnJlbnRWYWx1ZSBhcyBWaXJ0dWFsVGFibGVDb25maWc7XG4gICAgICB0aGlzLmNvbHVtbiA9IHRoaXMuY3JlYXRlQ29sdW1uRnJvbUFycmF5KHRoaXMuX2NvbmZpZy5jb2x1bW4pO1xuICAgIH1cblxuICAgIGlmICgnZGF0YVNvdXJjZScgaW4gY2hhbmdlcykge1xuICAgICAgY29uc3QgbmV3RGF0YVNvdXJjZSA9IGNoYW5nZXMuZGF0YVNvdXJjZS5jdXJyZW50VmFsdWUgYXMgT2JzZXJ2YWJsZTxBcnJheTxWaXJ0dWFsVGFibGVJdGVtPj47XG4gICAgICB0aGlzLl9kYXRhU3RyZWFtID0gY29tYmluZUxhdGVzdChcbiAgICAgICAgdGhpcy5zb3J0JC5hc09ic2VydmFibGUoKS5waXBlKHN0YXJ0V2l0aChudWxsKSksXG4gICAgICAgIHRoaXMuZmlsdGVyJCxcbiAgICAgICAgbmV3RGF0YVNvdXJjZS5waXBlKFxuICAgICAgICAgIHRhcCgoc3RyZWFtOiBBcnJheTxWaXJ0dWFsVGFibGVJdGVtPikgPT4ge1xuICAgICAgICAgICAgaWYgKCF0aGlzLl9oZWFkZXJXYXNTZXQpIHtcbiAgICAgICAgICAgICAgY29uc3Qgc2V0T2ZDb2x1bW4gPSBuZXcgU2V0KCk7XG4gICAgICAgICAgICAgIHN0cmVhbS5mb3JFYWNoKChlKSA9PiBPYmplY3Qua2V5cyhlKS5mb3JFYWNoKChrZXkpID0+IHNldE9mQ29sdW1uLmFkZChrZXkpKSk7XG4gICAgICAgICAgICAgIGNvbnN0IGF1dG9Db2x1bW5BcnJheSA9IEFycmF5LmZyb20oc2V0T2ZDb2x1bW4pO1xuICAgICAgICAgICAgICB0aGlzLmNvbHVtbiA9IHRoaXMuY3JlYXRlQ29sdW1uRnJvbUFycmF5KGF1dG9Db2x1bW5BcnJheSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSksXG4gICAgICAgICksXG4gICAgICApLnBpcGUoXG4gICAgICAgIG1hcCgoW3NvcnQsIGZpbHRlclN0cmluZywgc3RyZWFtXSkgPT4ge1xuICAgICAgICAgIGNvbnN0IHNsaWNlU3RyZWFtID0gc3RyZWFtLnNsaWNlKCk7XG5cbiAgICAgICAgICBjb25zdCBzb3J0Q29sdW1uID0gdGhpcy5jb2x1bW4uZmluZCgoZSkgPT4gZS5rZXkgPT09IHNvcnQpO1xuXG4gICAgICAgICAgaWYgKCFzb3J0IHx8ICFzb3J0Q29sdW1uKSB7XG4gICAgICAgICAgICByZXR1cm4gW2ZpbHRlclN0cmluZywgc2xpY2VTdHJlYW1dO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIGlmICghc29ydENvbHVtbi5zb3J0KSB7XG4gICAgICAgICAgICByZXR1cm4gW2ZpbHRlclN0cmluZywgc2xpY2VTdHJlYW1dO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIGNvbnN0IF9zb3J0Q29sdW1uID0gdGhpcy5faGVhZGVyRGljdFtzb3J0XTtcblxuICAgICAgICAgIGlmIChzb3J0Q29sdW1uLnNvcnQgPT09ICdhc2MnKSB7XG4gICAgICAgICAgICBzbGljZVN0cmVhbS5zb3J0KFxuICAgICAgICAgICAgICAoYTogVmlydHVhbFRhYmxlSXRlbSwgYjogVmlydHVhbFRhYmxlSXRlbSkgPT5cbiAgICAgICAgICAgICAgICB0aGlzLmdldEVsZW1lbnQoYSwgX3NvcnRDb2x1bW4uZnVuYykgPiB0aGlzLmdldEVsZW1lbnQoYiwgX3NvcnRDb2x1bW4uZnVuYylcbiAgICAgICAgICAgICAgICAgID8gMVxuICAgICAgICAgICAgICAgICAgOiB0aGlzLmdldEVsZW1lbnQoYSwgX3NvcnRDb2x1bW4uZnVuYykgPT09IHRoaXMuZ2V0RWxlbWVudChiLCBfc29ydENvbHVtbi5mdW5jKVxuICAgICAgICAgICAgICAgICAgICA/IDBcbiAgICAgICAgICAgICAgICAgICAgOiAtMSxcbiAgICAgICAgICAgICk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHNsaWNlU3RyZWFtLnNvcnQoXG4gICAgICAgICAgICAgIChhOiBWaXJ0dWFsVGFibGVJdGVtLCBiOiBWaXJ0dWFsVGFibGVJdGVtKSA9PlxuICAgICAgICAgICAgICAgIHRoaXMuZ2V0RWxlbWVudChhLCBfc29ydENvbHVtbi5mdW5jKSA8IHRoaXMuZ2V0RWxlbWVudChiLCBfc29ydENvbHVtbi5mdW5jKVxuICAgICAgICAgICAgICAgICAgPyAxXG4gICAgICAgICAgICAgICAgICA6IHRoaXMuZ2V0RWxlbWVudChhLCBfc29ydENvbHVtbi5mdW5jKSA9PT0gdGhpcy5nZXRFbGVtZW50KGIsIF9zb3J0Q29sdW1uLmZ1bmMpXG4gICAgICAgICAgICAgICAgICAgID8gMFxuICAgICAgICAgICAgICAgICAgICA6IC0xLFxuICAgICAgICAgICAgKTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICByZXR1cm4gW2ZpbHRlclN0cmluZywgc2xpY2VTdHJlYW1dO1xuICAgICAgICB9KSxcbiAgICAgICAgbWFwKChbZmlsdGVyU3RyaW5nLCBzdHJlYW1dKSA9PiB7XG4gICAgICAgICAgY29uc29sZS5sb2coZmlsdGVyU3RyaW5nLCAnZmlsdGVyJyk7XG4gICAgICAgICAgY29uc29sZS5sb2coc3RyZWFtKTtcbiAgICAgICAgICBjb25zdCBzbGljZVN0cmVhbSA9IHN0cmVhbS5zbGljZSgpO1xuICAgICAgICAgIGlmICghZmlsdGVyU3RyaW5nKSB7XG4gICAgICAgICAgICByZXR1cm4gc2xpY2VTdHJlYW07XG4gICAgICAgICAgfVxuICAgICAgICAgIGNvbnN0IGZpbHRlciA9IGZpbHRlclN0cmluZy50b0xvY2FsZUxvd2VyQ2FzZSgpO1xuXG4gICAgICAgICAgY29uc3QgZmlsdGVyU2xpY2VTdHJlYW0gPSBzbGljZVN0cmVhbS5maWx0ZXIoKGl0ZW06IFZpcnR1YWxUYWJsZUl0ZW0pID0+XG4gICAgICAgICAgICBPYmplY3Qua2V5cyhpdGVtKS5zb21lKFxuICAgICAgICAgICAgICAoa2V5KSA9PiBpdGVtW2tleV0gJiYgaXRlbVtrZXldLnRvU3RyaW5nKCkudG9Mb2NhbGVMb3dlckNhc2UoKS5pbmRleE9mKGZpbHRlcikgPiAtMSxcbiAgICAgICAgICAgICksXG4gICAgICAgICAgKTtcbiAgICAgICAgICByZXR1cm4gZmlsdGVyU2xpY2VTdHJlYW07XG4gICAgICAgIH0pLFxuICAgICAgICBwdWJsaXNoQmVoYXZpb3IoW10pLFxuICAgICAgICByZWZDb3VudCgpLFxuICAgICAgKTtcblxuICAgICAgdGhpcy5pc0VtcHR5U3ViamVjdCQgPSB0aGlzLl9kYXRhU3RyZWFtLnBpcGUobWFwKChkYXRhKSA9PiAhZGF0YS5sZW5ndGgpKTtcbiAgICB9XG4gIH1cblxuICBjcmVhdGVDb2x1bW5Gcm9tQXJyYXkoYXJyOiBBcnJheTxWaXJ0dWFsVGFibGVDb2x1bW4gfCBzdHJpbmc+KTogQXJyYXk8VmlydHVhbFRhYmxlQ29sdW1uPiB7XG4gICAgaWYgKCFhcnIgfHwgYXJyLmxlbmd0aCA9PT0gMCkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICB0aGlzLl9oZWFkZXJXYXNTZXQgPSB0cnVlO1xuICAgIGNvbnN0IGNvbHVtbkFyciA9IGFyci5tYXAoKGl0ZW06IFZpcnR1YWxUYWJsZUNvbHVtbikgPT4ge1xuICAgICAgbGV0IGNvbHVtbkl0ZW07XG4gICAgICBpZiAodHlwZW9mIGl0ZW0gPT09ICdzdHJpbmcnKSB7XG4gICAgICAgIGNvbHVtbkl0ZW0gPSB0aGlzLmNyZWF0ZUNvbHVtbkZyb21TdHJpbmcoaXRlbSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBjb2x1bW5JdGVtID0gaXRlbTtcbiAgICAgIH1cbiAgICAgIGlmICh0aGlzLl9oZWFkZXJEaWN0W2NvbHVtbkl0ZW0ua2V5XSkge1xuICAgICAgICB0aHJvdyBFcnJvcihgQ29sdW1uIGtleT0ke2NvbHVtbkl0ZW0ua2V5fSBhbHJlYWR5IGRlY2xhcmVgKTtcbiAgICAgIH1cbiAgICAgIHRoaXMuX2hlYWRlckRpY3RbY29sdW1uSXRlbS5rZXldID0gY29sdW1uSXRlbTtcblxuICAgICAgcmV0dXJuIGNvbHVtbkl0ZW07XG4gICAgfSk7XG4gICAgcmV0dXJuIGNvbHVtbkFycjtcbiAgfVxuXG4gIHByaXZhdGUgZ2V0RWxlbWVudChpdGVtOiBWaXJ0dWFsVGFibGVJdGVtLCBmdW5jOiAoaXRlbTogVmlydHVhbFRhYmxlSXRlbSkgPT4gYW55KSB7XG4gICAgcmV0dXJuIGZ1bmMuY2FsbCh0aGlzLCBpdGVtKTtcbiAgfVxuXG4gIHByaXZhdGUgY3JlYXRlQ29sdW1uRnJvbVN0cmluZyhzdHI6IHN0cmluZyk6IFZpcnR1YWxUYWJsZUNvbHVtbiB7XG4gICAgcmV0dXJuIHtcbiAgICAgIG5hbWU6IHN0cixcbiAgICAgIGtleTogc3RyLFxuICAgICAgZnVuYzogKGl0ZW0pID0+IGl0ZW1bc3RyXSxcbiAgICAgIHNvcnQ6IG51bGwsXG4gICAgfTtcbiAgfVxuXG4gIG5nT25EZXN0cm95KCkge1xuICAgIHRoaXMuX2Rlc3Ryb3llZCQubmV4dCgpO1xuICB9XG5cbiAgY2xpY2tJdGVtKGl0ZW06IFZpcnR1YWxUYWJsZUl0ZW0pIHtcbiAgICBpZiAodHlwZW9mIHRoaXMub25Sb3dDbGljayA9PT0gJ2Z1bmN0aW9uJykgdGhpcy5vblJvd0NsaWNrKGl0ZW0pO1xuICB9XG5cbiAgdG9nZ2xlRmlsdGVyKCkge1xuICAgIHRoaXMuZmlsdGVySXNPcGVuID0gIXRoaXMuZmlsdGVySXNPcGVuO1xuICAgIGlmICh0aGlzLmZpbHRlcklzT3Blbikge1xuICAgICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgIHRoaXMuaW5wdXRGaWx0ZXJGb2N1cy5uYXRpdmVFbGVtZW50LmZvY3VzKCk7XG4gICAgICB9KTtcbiAgICB9XG4gICAgdGhpcy5maWx0ZXJDb250cm9sLnNldFZhbHVlKCcnLCB7IGVtaXRFdmVudDogIXRoaXMuZmlsdGVySXNPcGVuIH0pO1xuICB9XG59XG4iXX0=