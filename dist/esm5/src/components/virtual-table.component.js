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
        this.filter$ = this.filterControl.valueChanges.pipe(debounceTime(350), startWith(null), distinctUntilChanged(), takeUntil(this._destroyed$));
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
            }))).pipe(debounceTime(50), map(function (_a) {
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
                /** @type {?} */
                var sliceStream = stream.slice();
                if (!filterString) {
                    return sliceStream;
                }
                /** @type {?} */
                var filter = filterString.toLocaleLowerCase();
                /** @type {?} */
                var filterSliceStream = sliceStream.filter(function (item) {
                    return _this.column.some(function (e) {
                        return _this.getElement(item, e.func).toString().toLocaleLowerCase().indexOf(filter) > -1;
                    });
                });
                console.log(filterSliceStream);
                return filterSliceStream;
            }), publishBehavior([]), refCount());
            this.isEmptySubject$ = this._dataStream.pipe(map(function (data) { return !data.length; }), tap(function (value) { return console.log(value); }));
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
            var columnItem = _this.createColumnFromConfigColumn(item);
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
     * @param {?} item
     * @return {?}
     */
    VirtualTableComponent.prototype.createColumnFromConfigColumn = /**
     * @param {?} item
     * @return {?}
     */
    function (item) {
        if (typeof item === 'string') {
            return {
                name: item,
                key: item,
                func: function (e) { return e[item]; },
                sort: null,
            };
        }
        if (!item.key) {
            throw Error("Column key for " + item + " must be exist");
        }
        return {
            name: item.name || item.key,
            key: item.key,
            func: typeof item.func === 'function' ? item.func : function (e) { return e[item.key]; },
            sort: item.sort || null,
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidmlydHVhbC10YWJsZS5jb21wb25lbnQuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9uZy12aXJ0dWFsLXRhYmxlLyIsInNvdXJjZXMiOlsic3JjL2NvbXBvbmVudHMvdmlydHVhbC10YWJsZS5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFBQSxPQUFPLEVBQ0wsU0FBUyxFQUNULHVCQUF1QixFQUN2QixLQUFLLEVBRUwsU0FBUyxFQUNULFVBQVUsR0FDWCxNQUFNLGVBQWUsQ0FBQztBQUN2QixPQUFPLEVBQUUsVUFBVSxFQUFFLEtBQUssRUFBRSxPQUFPLEVBQUUsYUFBYSxFQUF1QixNQUFNLE1BQU0sQ0FBQztBQUN0RixPQUFPLEVBQ0wsR0FBRyxFQUNILEdBQUcsRUFDSCxTQUFTLEVBQ1QsWUFBWSxFQUVaLG9CQUFvQixFQUNwQixTQUFTLEVBS1QsZUFBZSxFQUNmLFFBQVEsR0FDVCxNQUFNLGdCQUFnQixDQUFDO0FBQ3hCLE9BQU8sRUFBRSxXQUFXLEVBQUUsTUFBTSxnQkFBZ0IsQ0FBQztBQUc3QztJQUFBO1FBT1MsY0FBUyxHQUFHLEVBQUUsQ0FBQztRQUlmLGlCQUFZLEdBQUcsS0FBSyxDQUFDO1FBTW5CLHNCQUFpQixHQUFHLFFBQVEsQ0FBQztRQU10QyxrQkFBYSxHQUFnQixJQUFJLFdBQVcsQ0FBQyxFQUFFLENBQUMsQ0FBQztRQUV6QyxnQkFBVyxHQUEwQyxNQUFNLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDO1FBRTFFLFdBQU0sR0FBOEIsRUFBRSxDQUFDO1FBRXZDLGdCQUFXLEdBQXdDLEtBQUssQ0FBQztRQUV4RCxVQUFLLEdBQW9CLElBQUksT0FBTyxFQUFVLENBQUM7UUFFL0MsZ0JBQVcsR0FBRyxJQUFJLE9BQU8sRUFBUSxDQUFDO1FBRWxDLGtCQUFhLEdBQUcsS0FBSyxDQUFDO1FBSXRCLFlBQU8sR0FBRyxJQUFJLENBQUMsYUFBYSxDQUFDLFlBQVksQ0FBQyxJQUFJLENBQ3BELFlBQVksQ0FBQyxH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QUFRLENBQUMsRUFBRSxFQUFFLEVBQUUsU0FBUyxFQUFFLENBQUMsSUFBSSxDQUFDLFlBQVksRUFBRSxDQUFDLENBQUM7SUFDckUsQ0FBQzs7Z0JBaE9GLFNBQVMsU0FBQztvQkFDVCxRQUFRLEVBQUUsa0JBQWtCO29CQUM1QiwrbUNBQTZDO29CQUU3QyxlQUFlLEVBQUUsdUJBQXVCLENBQUMsTUFBTTs7aUJBQ2hEOzs7bUNBUUUsU0FBUyxTQUFDLGtCQUFrQjs2QkFFNUIsS0FBSztvQ0FFTCxLQUFLO3lCQUVMLEtBQUs7NkJBRUwsS0FBSzs7SUE0TVIsNEJBQUM7Q0FBQSxBQWpPRCxJQWlPQztTQTNOWSxxQkFBcUI7OztJQUNoQywwQ0FBc0I7O0lBRXRCLHdDQUFvQzs7SUFFcEMsNkNBQTRCOztJQUU1QixpREFBNEQ7O0lBRTVELDJDQUF5RDs7SUFFekQsa0RBQXNDOztJQUV0Qyx1Q0FBb0M7O0lBRXBDLDJDQUFzRDs7SUFFdEQsOENBQWlEOztJQUVqRCw0Q0FBaUY7O0lBRWpGLHVDQUE4Qzs7SUFFOUMsNENBQWdFOztJQUVoRSxzQ0FBdUQ7O0lBRXZELDRDQUEwQzs7SUFFMUMsOENBQThCOztJQUU5QixnREFBNEM7O0lBRTVDLHdDQUtFIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtcbiAgQ29tcG9uZW50LFxuICBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneSxcbiAgSW5wdXQsXG4gIFNpbXBsZUNoYW5nZXMsXG4gIFZpZXdDaGlsZCxcbiAgRWxlbWVudFJlZixcbn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBPYnNlcnZhYmxlLCBFTVBUWSwgU3ViamVjdCwgY29tYmluZUxhdGVzdCwgb2YsIEJlaGF2aW9yU3ViamVjdCB9IGZyb20gJ3J4anMnO1xuaW1wb3J0IHtcbiAgdGFwLFxuICBtYXAsXG4gIHN0YXJ0V2l0aCxcbiAgZGVib3VuY2VUaW1lLFxuICBmaWx0ZXIsXG4gIGRpc3RpbmN0VW50aWxDaGFuZ2VkLFxuICB0YWtlVW50aWwsXG4gIGNhdGNoRXJyb3IsXG4gIHNoYXJlLFxuICBzaGFyZVJlcGxheSxcbiAgc3dpdGNoTWFwLFxuICBwdWJsaXNoQmVoYXZpb3IsXG4gIHJlZkNvdW50LFxufSBmcm9tICdyeGpzL29wZXJhdG9ycyc7XG5pbXBvcnQgeyBGb3JtQ29udHJvbCB9IGZyb20gJ0Bhbmd1bGFyL2Zvcm1zJztcbmltcG9ydCB7IFZpcnR1YWxUYWJsZUNvbmZpZywgVmlydHVhbFRhYmxlSXRlbSwgVmlydHVhbFRhYmxlQ29sdW1uIH0gZnJvbSAnLi4vaW50ZXJmYWNlcyc7XG5cbkBDb21wb25lbnQoe1xuICBzZWxlY3RvcjogJ25nLXZpcnR1YWwtdGFibGUnLFxuICB0ZW1wbGF0ZVVybDogJy4vdmlydHVhbC10YWJsZS5jb21wb25lbnQuaHRtbCcsXG4gIHN0eWxlVXJsczogWycuL3ZpcnR1YWwtdGFibGUuY29tcG9uZW50LnNjc3MnXSxcbiAgY2hhbmdlRGV0ZWN0aW9uOiBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneS5PblB1c2gsXG59KVxuZXhwb3J0IGNsYXNzIFZpcnR1YWxUYWJsZUNvbXBvbmVudCB7XG4gIHB1YmxpYyBpdGVtQ291bnQgPSAyNTtcblxuICBwcml2YXRlIF9jb25maWc6IFZpcnR1YWxUYWJsZUNvbmZpZztcblxuICBwdWJsaWMgZmlsdGVySXNPcGVuID0gZmFsc2U7XG5cbiAgQFZpZXdDaGlsZCgnaW5wdXRGaWx0ZXJGb2N1cycpIGlucHV0RmlsdGVyRm9jdXM6IEVsZW1lbnRSZWY7XG5cbiAgQElucHV0KCkgZGF0YVNvdXJjZTogT2JzZXJ2YWJsZTxBcnJheTxWaXJ0dWFsVGFibGVJdGVtPj47XG5cbiAgQElucHV0KCkgZmlsdGVyUGxhY2Vob2xkZXIgPSAnRmlsdGVyJztcblxuICBASW5wdXQoKSBjb25maWc6IFZpcnR1YWxUYWJsZUNvbmZpZztcblxuICBASW5wdXQoKSBvblJvd0NsaWNrOiAoaXRlbTogVmlydHVhbFRhYmxlSXRlbSkgPT4gdm9pZDtcblxuICBmaWx0ZXJDb250cm9sOiBGb3JtQ29udHJvbCA9IG5ldyBGb3JtQ29udHJvbCgnJyk7XG5cbiAgcHJpdmF0ZSBfaGVhZGVyRGljdDogeyBba2V5OiBzdHJpbmddOiBWaXJ0dWFsVGFibGVDb2x1bW4gfSA9IE9iamVjdC5jcmVhdGUobnVsbCk7XG5cbiAgcHVibGljIGNvbHVtbjogQXJyYXk8VmlydHVhbFRhYmxlQ29sdW1uPiA9IFtdO1xuXG4gIHB1YmxpYyBfZGF0YVN0cmVhbTogT2JzZXJ2YWJsZTxBcnJheTxWaXJ0dWFsVGFibGVJdGVtPj4gPSBFTVBUWTtcblxuICBwcml2YXRlIHNvcnQkOiBTdWJqZWN0PHN0cmluZz4gPSBuZXcgU3ViamVjdDxzdHJpbmc+KCk7XG5cbiAgcHJpdmF0ZSBfZGVzdHJveWVkJCA9IG5ldyBTdWJqZWN0PHZvaWQ+KCk7XG5cbiAgcHJpdmF0ZSBfaGVhZGVyV2FzU2V0ID0gZmFsc2U7XG5cbiAgcHVibGljIGlzRW1wdHlTdWJqZWN0JDogT2JzZXJ2YWJsZTxib29sZWFuPjtcblxuICBwcml2YXRlIGZpbHRlciQgPSB0aGlzLmZpbHRlckNvbnRyb2wudmFsdWVDaGFuZ2VzLnBpcGUoXG4gICAgZGVib3VuY2VUaW1lKDM1MCksXG4gICAgc3RhcnRXaXRoKG51bGwpLFxuICAgIGRpc3RpbmN0VW50aWxDaGFuZ2VkKCksXG4gICAgdGFrZVVudGlsKHRoaXMuX2Rlc3Ryb3llZCQpLFxuICApO1xuXG4gIGFwcGx5U29ydChjb2x1bW46IHN0cmluZykge1xuICAgIHRoaXMuY29sdW1uID0gdGhpcy5jb2x1bW4ubWFwKChpdGVtKSA9PiB7XG4gICAgICBpZiAoaXRlbS5rZXkgIT09IGNvbHVtbikge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgIC4uLml0ZW0sXG4gICAgICAgICAgc29ydDogbnVsbCxcbiAgICAgICAgfTtcbiAgICAgIH1cblxuICAgICAgaWYgKGl0ZW0uc29ydCA9PT0gbnVsbCkge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgIC4uLml0ZW0sXG4gICAgICAgICAgc29ydDogJ2FzYycsXG4gICAgICAgIH07XG4gICAgICB9XG5cbiAgICAgIGlmIChpdGVtLnNvcnQgPT09ICdhc2MnKSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgLi4uaXRlbSxcbiAgICAgICAgICBzb3J0OiAnZGVzYycsXG4gICAgICAgIH07XG4gICAgICB9XG5cbiAgICAgIGlmIChpdGVtLnNvcnQgPT09ICdkZXNjJykge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgIC4uLml0ZW0sXG4gICAgICAgICAgc29ydDogbnVsbCxcbiAgICAgICAgfTtcbiAgICAgIH1cbiAgICB9KSBhcyBBcnJheTxWaXJ0dWFsVGFibGVDb2x1bW4+O1xuICAgIHRoaXMuc29ydCQubmV4dChjb2x1bW4pO1xuICB9XG5cbiAgbmdPbkNoYW5nZXMoY2hhbmdlczogU2ltcGxlQ2hhbmdlcykge1xuICAgIGlmICgnY29uZmlnJyBpbiBjaGFuZ2VzKSB7XG4gICAgICB0aGlzLl9jb25maWcgPSBjaGFuZ2VzLmNvbmZpZy5jdXJyZW50VmFsdWUgYXMgVmlydHVhbFRhYmxlQ29uZmlnO1xuICAgICAgdGhpcy5jb2x1bW4gPSB0aGlzLmNyZWF0ZUNvbHVtbkZyb21BcnJheSh0aGlzLl9jb25maWcuY29sdW1uKTtcbiAgICB9XG5cbiAgICBpZiAoJ2RhdGFTb3VyY2UnIGluIGNoYW5nZXMpIHtcbiAgICAgIGNvbnN0IG5ld0RhdGFTb3VyY2UgPSBjaGFuZ2VzLmRhdGFTb3VyY2UuY3VycmVudFZhbHVlIGFzIE9ic2VydmFibGU8QXJyYXk8VmlydHVhbFRhYmxlSXRlbT4+O1xuICAgICAgdGhpcy5fZGF0YVN0cmVhbSA9IGNvbWJpbmVMYXRlc3QoXG4gICAgICAgIHRoaXMuc29ydCQuYXNPYnNlcnZhYmxlKCkucGlwZShzdGFydFdpdGgobnVsbCkpLFxuICAgICAgICB0aGlzLmZpbHRlciQsXG4gICAgICAgIG5ld0RhdGFTb3VyY2UucGlwZShcbiAgICAgICAgICB0YXAoKHN0cmVhbTogQXJyYXk8VmlydHVhbFRhYmxlSXRlbT4pID0+IHtcbiAgICAgICAgICAgIGlmICghdGhpcy5faGVhZGVyV2FzU2V0KSB7XG4gICAgICAgICAgICAgIGNvbnN0IHNldE9mQ29sdW1uID0gbmV3IFNldCgpO1xuICAgICAgICAgICAgICBzdHJlYW0uZm9yRWFjaCgoZSkgPT4gT2JqZWN0LmtleXMoZSkuZm9yRWFjaCgoa2V5KSA9PiBzZXRPZkNvbHVtbi5hZGQoa2V5KSkpO1xuICAgICAgICAgICAgICBjb25zdCBhdXRvQ29sdW1uQXJyYXkgPSBBcnJheS5mcm9tKHNldE9mQ29sdW1uKTtcbiAgICAgICAgICAgICAgdGhpcy5jb2x1bW4gPSB0aGlzLmNyZWF0ZUNvbHVtbkZyb21BcnJheShhdXRvQ29sdW1uQXJyYXkpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0pLFxuICAgICAgICApLFxuICAgICAgKS5waXBlKFxuICAgICAgICBkZWJvdW5jZVRpbWUoNTApLFxuICAgICAgICBtYXAoKFtzb3J0LCBmaWx0ZXJTdHJpbmcsIHN0cmVhbV0pID0+IHtcbiAgICAgICAgICBjb25zdCBzbGljZVN0cmVhbSA9IHN0cmVhbS5zbGljZSgpO1xuXG4gICAgICAgICAgY29uc3Qgc29ydENvbHVtbiA9IHRoaXMuY29sdW1uLmZpbmQoKGUpID0+IGUua2V5ID09PSBzb3J0KTtcblxuICAgICAgICAgIGlmICghc29ydCB8fCAhc29ydENvbHVtbikge1xuICAgICAgICAgICAgcmV0dXJuIFtmaWx0ZXJTdHJpbmcsIHNsaWNlU3RyZWFtXTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBpZiAoIXNvcnRDb2x1bW4uc29ydCkge1xuICAgICAgICAgICAgcmV0dXJuIFtmaWx0ZXJTdHJpbmcsIHNsaWNlU3RyZWFtXTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBjb25zdCBfc29ydENvbHVtbiA9IHRoaXMuX2hlYWRlckRpY3Rbc29ydF07XG5cbiAgICAgICAgICBpZiAoc29ydENvbHVtbi5zb3J0ID09PSAnYXNjJykge1xuICAgICAgICAgICAgc2xpY2VTdHJlYW0uc29ydChcbiAgICAgICAgICAgICAgKGE6IFZpcnR1YWxUYWJsZUl0ZW0sIGI6IFZpcnR1YWxUYWJsZUl0ZW0pID0+XG4gICAgICAgICAgICAgICAgdGhpcy5nZXRFbGVtZW50KGEsIF9zb3J0Q29sdW1uLmZ1bmMpID4gdGhpcy5nZXRFbGVtZW50KGIsIF9zb3J0Q29sdW1uLmZ1bmMpXG4gICAgICAgICAgICAgICAgICA/IDFcbiAgICAgICAgICAgICAgICAgIDogdGhpcy5nZXRFbGVtZW50KGEsIF9zb3J0Q29sdW1uLmZ1bmMpID09PSB0aGlzLmdldEVsZW1lbnQoYiwgX3NvcnRDb2x1bW4uZnVuYylcbiAgICAgICAgICAgICAgICAgICAgPyAwXG4gICAgICAgICAgICAgICAgICAgIDogLTEsXG4gICAgICAgICAgICApO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBzbGljZVN0cmVhbS5zb3J0KFxuICAgICAgICAgICAgICAoYTogVmlydHVhbFRhYmxlSXRlbSwgYjogVmlydHVhbFRhYmxlSXRlbSkgPT5cbiAgICAgICAgICAgICAgICB0aGlzLmdldEVsZW1lbnQoYSwgX3NvcnRDb2x1bW4uZnVuYykgPCB0aGlzLmdldEVsZW1lbnQoYiwgX3NvcnRDb2x1bW4uZnVuYylcbiAgICAgICAgICAgICAgICAgID8gMVxuICAgICAgICAgICAgICAgICAgOiB0aGlzLmdldEVsZW1lbnQoYSwgX3NvcnRDb2x1bW4uZnVuYykgPT09IHRoaXMuZ2V0RWxlbWVudChiLCBfc29ydENvbHVtbi5mdW5jKVxuICAgICAgICAgICAgICAgICAgICA/IDBcbiAgICAgICAgICAgICAgICAgICAgOiAtMSxcbiAgICAgICAgICAgICk7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgcmV0dXJuIFtmaWx0ZXJTdHJpbmcsIHNsaWNlU3RyZWFtXTtcbiAgICAgICAgfSksXG4gICAgICAgIG1hcCgoW2ZpbHRlclN0cmluZywgc3RyZWFtXSkgPT4ge1xuICAgICAgICAgIGNvbnN0IHNsaWNlU3RyZWFtID0gc3RyZWFtLnNsaWNlKCk7XG4gICAgICAgICAgaWYgKCFmaWx0ZXJTdHJpbmcpIHtcbiAgICAgICAgICAgIHJldHVybiBzbGljZVN0cmVhbTtcbiAgICAgICAgICB9XG4gICAgICAgICAgY29uc3QgZmlsdGVyID0gZmlsdGVyU3RyaW5nLnRvTG9jYWxlTG93ZXJDYXNlKCk7XG5cbiAgICAgICAgICBjb25zdCBmaWx0ZXJTbGljZVN0cmVhbSA9IHNsaWNlU3RyZWFtLmZpbHRlcigoaXRlbTogVmlydHVhbFRhYmxlSXRlbSkgPT5cbiAgICAgICAgICAgIHRoaXMuY29sdW1uLnNvbWUoXG4gICAgICAgICAgICAgIChlKSA9PlxuICAgICAgICAgICAgICAgIHRoaXMuZ2V0RWxlbWVudChpdGVtLCBlLmZ1bmMpLnRvU3RyaW5nKCkudG9Mb2NhbGVMb3dlckNhc2UoKS5pbmRleE9mKGZpbHRlcikgPiAtMSxcbiAgICAgICAgICAgICksXG4gICAgICAgICAgKTtcbiAgICAgICAgICBjb25zb2xlLmxvZyhmaWx0ZXJTbGljZVN0cmVhbSk7XG4gICAgICAgICAgcmV0dXJuIGZpbHRlclNsaWNlU3RyZWFtO1xuICAgICAgICB9KSxcbiAgICAgICAgcHVibGlzaEJlaGF2aW9yKFtdKSxcbiAgICAgICAgcmVmQ291bnQoKSxcbiAgICAgICk7XG5cbiAgICAgIHRoaXMuaXNFbXB0eVN1YmplY3QkID0gdGhpcy5fZGF0YVN0cmVhbS5waXBlKFxuICAgICAgICBtYXAoKGRhdGEpID0+ICFkYXRhLmxlbmd0aCksXG4gICAgICAgIHRhcCgodmFsdWUpID0+IGNvbnNvbGUubG9nKHZhbHVlKSksXG4gICAgICApO1xuICAgIH1cbiAgfVxuXG4gIGNyZWF0ZUNvbHVtbkZyb21BcnJheShhcnI6IEFycmF5PFZpcnR1YWxUYWJsZUNvbHVtbiB8IHN0cmluZz4pOiBBcnJheTxWaXJ0dWFsVGFibGVDb2x1bW4+IHtcbiAgICBpZiAoIWFyciB8fCBhcnIubGVuZ3RoID09PSAwKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIHRoaXMuX2hlYWRlcldhc1NldCA9IHRydWU7XG4gICAgY29uc3QgY29sdW1uQXJyID0gYXJyLm1hcCgoaXRlbTogVmlydHVhbFRhYmxlQ29sdW1uKSA9PiB7XG4gICAgICBjb25zdCBjb2x1bW5JdGVtID0gdGhpcy5jcmVhdGVDb2x1bW5Gcm9tQ29uZmlnQ29sdW1uKGl0ZW0pO1xuXG4gICAgICBpZiAodGhpcy5faGVhZGVyRGljdFtjb2x1bW5JdGVtLmtleV0pIHtcbiAgICAgICAgdGhyb3cgRXJyb3IoYENvbHVtbiBrZXk9JHtjb2x1bW5JdGVtLmtleX0gYWxyZWFkeSBkZWNsYXJlYCk7XG4gICAgICB9XG4gICAgICB0aGlzLl9oZWFkZXJEaWN0W2NvbHVtbkl0ZW0ua2V5XSA9IGNvbHVtbkl0ZW07XG5cbiAgICAgIHJldHVybiBjb2x1bW5JdGVtO1xuICAgIH0pO1xuICAgIHJldHVybiBjb2x1bW5BcnI7XG4gIH1cblxuICBwcml2YXRlIGdldEVsZW1lbnQoaXRlbTogVmlydHVhbFRhYmxlSXRlbSwgZnVuYzogKGl0ZW06IFZpcnR1YWxUYWJsZUl0ZW0pID0+IGFueSkge1xuICAgIHJldHVybiBmdW5jLmNhbGwodGhpcywgaXRlbSk7XG4gIH1cblxuICBwcml2YXRlIGNyZWF0ZUNvbHVtbkZyb21Db25maWdDb2x1bW4oaXRlbTogc3RyaW5nIHwgVmlydHVhbFRhYmxlQ29sdW1uKTogVmlydHVhbFRhYmxlQ29sdW1uIHtcbiAgICBpZiAodHlwZW9mIGl0ZW0gPT09ICdzdHJpbmcnKSB7XG4gICAgICByZXR1cm4ge1xuICAgICAgICBuYW1lOiBpdGVtLFxuICAgICAgICBrZXk6IGl0ZW0sXG4gICAgICAgIGZ1bmM6IChlKSA9PiBlW2l0ZW1dLFxuICAgICAgICBzb3J0OiBudWxsLFxuICAgICAgfTtcbiAgICB9XG4gICAgaWYgKCFpdGVtLmtleSkge1xuICAgICAgdGhyb3cgRXJyb3IoYENvbHVtbiBrZXkgZm9yICR7aXRlbX0gbXVzdCBiZSBleGlzdGApO1xuICAgIH1cbiAgICByZXR1cm4ge1xuICAgICAgbmFtZTogaXRlbS5uYW1lIHx8IGl0ZW0ua2V5LFxuICAgICAga2V5OiBpdGVtLmtleSxcbiAgICAgIGZ1bmM6IHR5cGVvZiBpdGVtLmZ1bmMgPT09ICdmdW5jdGlvbicgPyBpdGVtLmZ1bmMgOiAoZSkgPT4gZVtpdGVtLmtleV0sXG4gICAgICBzb3J0OiBpdGVtLnNvcnQgfHwgbnVsbCxcbiAgICB9O1xuICB9XG5cbiAgbmdPbkRlc3Ryb3koKSB7XG4gICAgdGhpcy5fZGVzdHJveWVkJC5uZXh0KCk7XG4gIH1cblxuICBjbGlja0l0ZW0oaXRlbTogVmlydHVhbFRhYmxlSXRlbSkge1xuICAgIGlmICh0eXBlb2YgdGhpcy5vblJvd0NsaWNrID09PSAnZnVuY3Rpb24nKSB0aGlzLm9uUm93Q2xpY2soaXRlbSk7XG4gIH1cblxuICB0b2dnbGVGaWx0ZXIoKSB7XG4gICAgdGhpcy5maWx0ZXJJc09wZW4gPSAhdGhpcy5maWx0ZXJJc09wZW47XG4gICAgaWYgKHRoaXMuZmlsdGVySXNPcGVuKSB7XG4gICAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgdGhpcy5pbnB1dEZpbHRlckZvY3VzLm5hdGl2ZUVsZW1lbnQuZm9jdXMoKTtcbiAgICAgIH0pO1xuICAgIH1cbiAgICB0aGlzLmZpbHRlckNvbnRyb2wuc2V0VmFsdWUoJycsIHsgZW1pdEV2ZW50OiAhdGhpcy5maWx0ZXJJc09wZW4gfSk7XG4gIH1cbn1cbiJdfQ==