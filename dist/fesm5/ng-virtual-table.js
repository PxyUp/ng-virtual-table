import { __assign, __read } from 'tslib';
import { Component, ChangeDetectionStrategy, Input, ViewChild, NgModule } from '@angular/core';
import { EMPTY, Subject, combineLatest } from 'rxjs';
import { tap, map, startWith, debounceTime, distinctUntilChanged, takeUntil, publishBehavior, refCount } from 'rxjs/operators';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ScrollDispatchModule } from '@angular/cdk/scrolling';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
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
                return __assign({}, item, { sort: null });
            }
            if (item.sort === null) {
                return __assign({}, item, { sort: 'asc' });
            }
            if (item.sort === 'asc') {
                return __assign({}, item, { sort: 'desc' });
            }
            if (item.sort === 'desc') {
                return __assign({}, item, { sort: null });
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
                var _b = __read(_a, 3), sort = _b[0], filterString = _b[1], stream = _b[2];
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
                var _b = __read(_a, 2), filterString = _b[0], stream = _b[1];
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

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
var NgVirtualTableModule = /** @class */ (function () {
    function NgVirtualTableModule() {
    }
    NgVirtualTableModule.decorators = [
        { type: NgModule, args: [{
                    declarations: [VirtualTableComponent],
                    imports: [
                        CommonModule,
                        ReactiveFormsModule,
                        BrowserAnimationsModule,
                        MatIconModule,
                        MatFormFieldModule,
                        ScrollDispatchModule,
                    ],
                    exports: [VirtualTableComponent],
                    providers: [],
                },] }
    ];
    return NgVirtualTableModule;
}());

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */

export { NgVirtualTableModule, VirtualTableComponent };

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmctdmlydHVhbC10YWJsZS5qcy5tYXAiLCJzb3VyY2VzIjpbIm5nOi8vbmctdmlydHVhbC10YWJsZS9zcmMvY29tcG9uZW50cy92aXJ0dWFsLXRhYmxlLmNvbXBvbmVudC50cyIsIm5nOi8vbmctdmlydHVhbC10YWJsZS9zcmMvbmdWaXJ0dWFsVGFibGUubW9kdWxlLnRzIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7XG4gIENvbXBvbmVudCxcbiAgQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3ksXG4gIElucHV0LFxuICBTaW1wbGVDaGFuZ2VzLFxuICBWaWV3Q2hpbGQsXG4gIEVsZW1lbnRSZWYsXG59IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgT2JzZXJ2YWJsZSwgRU1QVFksIFN1YmplY3QsIGNvbWJpbmVMYXRlc3QsIG9mLCBCZWhhdmlvclN1YmplY3QgfSBmcm9tICdyeGpzJztcbmltcG9ydCB7XG4gIHRhcCxcbiAgbWFwLFxuICBzdGFydFdpdGgsXG4gIGRlYm91bmNlVGltZSxcbiAgZmlsdGVyLFxuICBkaXN0aW5jdFVudGlsQ2hhbmdlZCxcbiAgdGFrZVVudGlsLFxuICBjYXRjaEVycm9yLFxuICBzaGFyZSxcbiAgc2hhcmVSZXBsYXksXG4gIHN3aXRjaE1hcCxcbiAgcHVibGlzaEJlaGF2aW9yLFxuICByZWZDb3VudCxcbn0gZnJvbSAncnhqcy9vcGVyYXRvcnMnO1xuaW1wb3J0IHsgRm9ybUNvbnRyb2wgfSBmcm9tICdAYW5ndWxhci9mb3Jtcyc7XG5pbXBvcnQgeyBWaXJ0dWFsVGFibGVDb25maWcsIFZpcnR1YWxUYWJsZUl0ZW0sIFZpcnR1YWxUYWJsZUNvbHVtbiB9IGZyb20gJy4uL2ludGVyZmFjZXMnO1xuXG5AQ29tcG9uZW50KHtcbiAgc2VsZWN0b3I6ICduZy12aXJ0dWFsLXRhYmxlJyxcbiAgdGVtcGxhdGVVcmw6ICcuL3ZpcnR1YWwtdGFibGUuY29tcG9uZW50Lmh0bWwnLFxuICBzdHlsZVVybHM6IFsnLi92aXJ0dWFsLXRhYmxlLmNvbXBvbmVudC5zY3NzJ10sXG4gIGNoYW5nZURldGVjdGlvbjogQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3kuT25QdXNoLFxufSlcbmV4cG9ydCBjbGFzcyBWaXJ0dWFsVGFibGVDb21wb25lbnQge1xuICBwdWJsaWMgaXRlbUNvdW50ID0gMjU7XG5cbiAgcHJpdmF0ZSBfY29uZmlnOiBWaXJ0dWFsVGFibGVDb25maWc7XG5cbiAgcHVibGljIGZpbHRlcklzT3BlbiA9IGZhbHNlO1xuXG4gIEBWaWV3Q2hpbGQoJ2lucHV0RmlsdGVyRm9jdXMnKSBpbnB1dEZpbHRlckZvY3VzOiBFbGVtZW50UmVmO1xuXG4gIEBJbnB1dCgpIGRhdGFTb3VyY2U6IE9ic2VydmFibGU8QXJyYXk8VmlydHVhbFRhYmxlSXRlbT4+O1xuXG4gIEBJbnB1dCgpIGZpbHRlclBsYWNlaG9sZGVyID0gJ0ZpbHRlcic7XG5cbiAgQElucHV0KCkgY29uZmlnOiBWaXJ0dWFsVGFibGVDb25maWc7XG5cbiAgQElucHV0KCkgb25Sb3dDbGljazogKGl0ZW06IFZpcnR1YWxUYWJsZUl0ZW0pID0+IHZvaWQ7XG5cbiAgZmlsdGVyQ29udHJvbDogRm9ybUNvbnRyb2wgPSBuZXcgRm9ybUNvbnRyb2woJycpO1xuXG4gIHByaXZhdGUgX2hlYWRlckRpY3Q6IHsgW2tleTogc3RyaW5nXTogVmlydHVhbFRhYmxlQ29sdW1uIH0gPSBPYmplY3QuY3JlYXRlKG51bGwpO1xuXG4gIHB1YmxpYyBjb2x1bW46IEFycmF5PFZpcnR1YWxUYWJsZUNvbHVtbj4gPSBbXTtcblxuICBwdWJsaWMgX2RhdGFTdHJlYW06IE9ic2VydmFibGU8QXJyYXk8VmlydHVhbFRhYmxlSXRlbT4+ID0gRU1QVFk7XG5cbiAgcHJpdmF0ZSBzb3J0JDogU3ViamVjdDxzdHJpbmc+ID0gbmV3IFN1YmplY3Q8c3RyaW5nPigpO1xuXG4gIHByaXZhdGUgX2Rlc3Ryb3llZCQgPSBuZXcgU3ViamVjdDx2b2lkPigpO1xuXG4gIHByaXZhdGUgX2hlYWRlcldhc1NldCA9IGZhbHNlO1xuXG4gIHB1YmxpYyBpc0VtcHR5U3ViamVjdCQ6IE9ic2VydmFibGU8Ym9vbGVhbj47XG5cbiAgcHJpdmF0ZSBmaWx0ZXIkID0gdGhpcy5maWx0ZXJDb250cm9sLnZhbHVlQ2hhbmdlcy5waXBlKFxuICAgIGRlYm91bmNlVGltZSgzMDApLFxuICAgIHN0YXJ0V2l0aChudWxsKSxcbiAgICBkaXN0aW5jdFVudGlsQ2hhbmdlZCgpLFxuICAgIHRha2VVbnRpbCh0aGlzLl9kZXN0cm95ZWQkKSxcbiAgKTtcblxuICBhcHBseVNvcnQoY29sdW1uOiBzdHJpbmcpIHtcbiAgICB0aGlzLmNvbHVtbiA9IHRoaXMuY29sdW1uLm1hcCgoaXRlbSkgPT4ge1xuICAgICAgaWYgKGl0ZW0ua2V5ICE9PSBjb2x1bW4pIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAuLi5pdGVtLFxuICAgICAgICAgIHNvcnQ6IG51bGwsXG4gICAgICAgIH07XG4gICAgICB9XG5cbiAgICAgIGlmIChpdGVtLnNvcnQgPT09IG51bGwpIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAuLi5pdGVtLFxuICAgICAgICAgIHNvcnQ6ICdhc2MnLFxuICAgICAgICB9O1xuICAgICAgfVxuXG4gICAgICBpZiAoaXRlbS5zb3J0ID09PSAnYXNjJykge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgIC4uLml0ZW0sXG4gICAgICAgICAgc29ydDogJ2Rlc2MnLFxuICAgICAgICB9O1xuICAgICAgfVxuXG4gICAgICBpZiAoaXRlbS5zb3J0ID09PSAnZGVzYycpIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAuLi5pdGVtLFxuICAgICAgICAgIHNvcnQ6IG51bGwsXG4gICAgICAgIH07XG4gICAgICB9XG4gICAgfSkgYXMgQXJyYXk8VmlydHVhbFRhYmxlQ29sdW1uPjtcbiAgICB0aGlzLnNvcnQkLm5leHQoY29sdW1uKTtcbiAgfVxuXG4gIG5nT25DaGFuZ2VzKGNoYW5nZXM6IFNpbXBsZUNoYW5nZXMpIHtcbiAgICBpZiAoJ2NvbmZpZycgaW4gY2hhbmdlcykge1xuICAgICAgdGhpcy5fY29uZmlnID0gY2hhbmdlcy5jb25maWcuY3VycmVudFZhbHVlIGFzIFZpcnR1YWxUYWJsZUNvbmZpZztcbiAgICAgIHRoaXMuY29sdW1uID0gdGhpcy5jcmVhdGVDb2x1bW5Gcm9tQXJyYXkodGhpcy5fY29uZmlnLmNvbHVtbik7XG4gICAgfVxuXG4gICAgaWYgKCdkYXRhU291cmNlJyBpbiBjaGFuZ2VzKSB7XG4gICAgICBjb25zdCBuZXdEYXRhU291cmNlID0gY2hhbmdlcy5kYXRhU291cmNlLmN1cnJlbnRWYWx1ZSBhcyBPYnNlcnZhYmxlPEFycmF5PFZpcnR1YWxUYWJsZUl0ZW0+PjtcbiAgICAgIHRoaXMuX2RhdGFTdHJlYW0gPSBjb21iaW5lTGF0ZXN0KFxuICAgICAgICB0aGlzLnNvcnQkLmFzT2JzZXJ2YWJsZSgpLnBpcGUoc3RhcnRXaXRoKG51bGwpKSxcbiAgICAgICAgdGhpcy5maWx0ZXIkLFxuICAgICAgICBuZXdEYXRhU291cmNlLnBpcGUoXG4gICAgICAgICAgdGFwKChzdHJlYW06IEFycmF5PFZpcnR1YWxUYWJsZUl0ZW0+KSA9PiB7XG4gICAgICAgICAgICBpZiAoIXRoaXMuX2hlYWRlcldhc1NldCkge1xuICAgICAgICAgICAgICBjb25zdCBzZXRPZkNvbHVtbiA9IG5ldyBTZXQoKTtcbiAgICAgICAgICAgICAgc3RyZWFtLmZvckVhY2goKGUpID0+IE9iamVjdC5rZXlzKGUpLmZvckVhY2goKGtleSkgPT4gc2V0T2ZDb2x1bW4uYWRkKGtleSkpKTtcbiAgICAgICAgICAgICAgY29uc3QgYXV0b0NvbHVtbkFycmF5ID0gQXJyYXkuZnJvbShzZXRPZkNvbHVtbik7XG4gICAgICAgICAgICAgIHRoaXMuY29sdW1uID0gdGhpcy5jcmVhdGVDb2x1bW5Gcm9tQXJyYXkoYXV0b0NvbHVtbkFycmF5KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9KSxcbiAgICAgICAgKSxcbiAgICAgICkucGlwZShcbiAgICAgICAgbWFwKChbc29ydCwgZmlsdGVyU3RyaW5nLCBzdHJlYW1dKSA9PiB7XG4gICAgICAgICAgY29uc3Qgc2xpY2VTdHJlYW0gPSBzdHJlYW0uc2xpY2UoKTtcblxuICAgICAgICAgIGNvbnN0IHNvcnRDb2x1bW4gPSB0aGlzLmNvbHVtbi5maW5kKChlKSA9PiBlLmtleSA9PT0gc29ydCk7XG5cbiAgICAgICAgICBpZiAoIXNvcnQgfHwgIXNvcnRDb2x1bW4pIHtcbiAgICAgICAgICAgIHJldHVybiBbZmlsdGVyU3RyaW5nLCBzbGljZVN0cmVhbV07XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgaWYgKCFzb3J0Q29sdW1uLnNvcnQpIHtcbiAgICAgICAgICAgIHJldHVybiBbZmlsdGVyU3RyaW5nLCBzbGljZVN0cmVhbV07XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgY29uc3QgX3NvcnRDb2x1bW4gPSB0aGlzLl9oZWFkZXJEaWN0W3NvcnRdO1xuXG4gICAgICAgICAgaWYgKHNvcnRDb2x1bW4uc29ydCA9PT0gJ2FzYycpIHtcbiAgICAgICAgICAgIHNsaWNlU3RyZWFtLnNvcnQoXG4gICAgICAgICAgICAgIChhOiBWaXJ0dWFsVGFibGVJdGVtLCBiOiBWaXJ0dWFsVGFibGVJdGVtKSA9PlxuICAgICAgICAgICAgICAgIHRoaXMuZ2V0RWxlbWVudChhLCBfc29ydENvbHVtbi5mdW5jKSA+IHRoaXMuZ2V0RWxlbWVudChiLCBfc29ydENvbHVtbi5mdW5jKVxuICAgICAgICAgICAgICAgICAgPyAxXG4gICAgICAgICAgICAgICAgICA6IHRoaXMuZ2V0RWxlbWVudChhLCBfc29ydENvbHVtbi5mdW5jKSA9PT0gdGhpcy5nZXRFbGVtZW50KGIsIF9zb3J0Q29sdW1uLmZ1bmMpXG4gICAgICAgICAgICAgICAgICAgID8gMFxuICAgICAgICAgICAgICAgICAgICA6IC0xLFxuICAgICAgICAgICAgKTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgc2xpY2VTdHJlYW0uc29ydChcbiAgICAgICAgICAgICAgKGE6IFZpcnR1YWxUYWJsZUl0ZW0sIGI6IFZpcnR1YWxUYWJsZUl0ZW0pID0+XG4gICAgICAgICAgICAgICAgdGhpcy5nZXRFbGVtZW50KGEsIF9zb3J0Q29sdW1uLmZ1bmMpIDwgdGhpcy5nZXRFbGVtZW50KGIsIF9zb3J0Q29sdW1uLmZ1bmMpXG4gICAgICAgICAgICAgICAgICA/IDFcbiAgICAgICAgICAgICAgICAgIDogdGhpcy5nZXRFbGVtZW50KGEsIF9zb3J0Q29sdW1uLmZ1bmMpID09PSB0aGlzLmdldEVsZW1lbnQoYiwgX3NvcnRDb2x1bW4uZnVuYylcbiAgICAgICAgICAgICAgICAgICAgPyAwXG4gICAgICAgICAgICAgICAgICAgIDogLTEsXG4gICAgICAgICAgICApO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIHJldHVybiBbZmlsdGVyU3RyaW5nLCBzbGljZVN0cmVhbV07XG4gICAgICAgIH0pLFxuICAgICAgICBtYXAoKFtmaWx0ZXJTdHJpbmcsIHN0cmVhbV0pID0+IHtcbiAgICAgICAgICBjb25zb2xlLmxvZyhmaWx0ZXJTdHJpbmcsICdmaWx0ZXInKTtcbiAgICAgICAgICBjb25zb2xlLmxvZyhzdHJlYW0pO1xuICAgICAgICAgIGNvbnN0IHNsaWNlU3RyZWFtID0gc3RyZWFtLnNsaWNlKCk7XG4gICAgICAgICAgaWYgKCFmaWx0ZXJTdHJpbmcpIHtcbiAgICAgICAgICAgIHJldHVybiBzbGljZVN0cmVhbTtcbiAgICAgICAgICB9XG4gICAgICAgICAgY29uc3QgZmlsdGVyID0gZmlsdGVyU3RyaW5nLnRvTG9jYWxlTG93ZXJDYXNlKCk7XG5cbiAgICAgICAgICBjb25zdCBmaWx0ZXJTbGljZVN0cmVhbSA9IHNsaWNlU3RyZWFtLmZpbHRlcigoaXRlbTogVmlydHVhbFRhYmxlSXRlbSkgPT5cbiAgICAgICAgICAgIE9iamVjdC5rZXlzKGl0ZW0pLnNvbWUoXG4gICAgICAgICAgICAgIChrZXkpID0+IGl0ZW1ba2V5XSAmJiBpdGVtW2tleV0udG9TdHJpbmcoKS50b0xvY2FsZUxvd2VyQ2FzZSgpLmluZGV4T2YoZmlsdGVyKSA+IC0xLFxuICAgICAgICAgICAgKSxcbiAgICAgICAgICApO1xuICAgICAgICAgIHJldHVybiBmaWx0ZXJTbGljZVN0cmVhbTtcbiAgICAgICAgfSksXG4gICAgICAgIHB1Ymxpc2hCZWhhdmlvcihbXSksXG4gICAgICAgIHJlZkNvdW50KCksXG4gICAgICApO1xuXG4gICAgICB0aGlzLmlzRW1wdHlTdWJqZWN0JCA9IHRoaXMuX2RhdGFTdHJlYW0ucGlwZShtYXAoKGRhdGEpID0+ICFkYXRhLmxlbmd0aCkpO1xuICAgIH1cbiAgfVxuXG4gIGNyZWF0ZUNvbHVtbkZyb21BcnJheShhcnI6IEFycmF5PFZpcnR1YWxUYWJsZUNvbHVtbiB8IHN0cmluZz4pOiBBcnJheTxWaXJ0dWFsVGFibGVDb2x1bW4+IHtcbiAgICBpZiAoIWFyciB8fCBhcnIubGVuZ3RoID09PSAwKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIHRoaXMuX2hlYWRlcldhc1NldCA9IHRydWU7XG4gICAgY29uc3QgY29sdW1uQXJyID0gYXJyLm1hcCgoaXRlbTogVmlydHVhbFRhYmxlQ29sdW1uKSA9PiB7XG4gICAgICBsZXQgY29sdW1uSXRlbTtcbiAgICAgIGlmICh0eXBlb2YgaXRlbSA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgY29sdW1uSXRlbSA9IHRoaXMuY3JlYXRlQ29sdW1uRnJvbVN0cmluZyhpdGVtKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGNvbHVtbkl0ZW0gPSBpdGVtO1xuICAgICAgfVxuICAgICAgaWYgKHRoaXMuX2hlYWRlckRpY3RbY29sdW1uSXRlbS5rZXldKSB7XG4gICAgICAgIHRocm93IEVycm9yKGBDb2x1bW4ga2V5PSR7Y29sdW1uSXRlbS5rZXl9IGFscmVhZHkgZGVjbGFyZWApO1xuICAgICAgfVxuICAgICAgdGhpcy5faGVhZGVyRGljdFtjb2x1bW5JdGVtLmtleV0gPSBjb2x1bW5JdGVtO1xuXG4gICAgICByZXR1cm4gY29sdW1uSXRlbTtcbiAgICB9KTtcbiAgICByZXR1cm4gY29sdW1uQXJyO1xuICB9XG5cbiAgcHJpdmF0ZSBnZXRFbGVtZW50KGl0ZW06IFZpcnR1YWxUYWJsZUl0ZW0sIGZ1bmM6IChpdGVtOiBWaXJ0dWFsVGFibGVJdGVtKSA9PiBhbnkpIHtcbiAgICByZXR1cm4gZnVuYy5jYWxsKHRoaXMsIGl0ZW0pO1xuICB9XG5cbiAgcHJpdmF0ZSBjcmVhdGVDb2x1bW5Gcm9tU3RyaW5nKHN0cjogc3RyaW5nKTogVmlydHVhbFRhYmxlQ29sdW1uIHtcbiAgICByZXR1cm4ge1xuICAgICAgbmFtZTogc3RyLFxuICAgICAga2V5OiBzdHIsXG4gICAgICBmdW5jOiAoaXRlbSkgPT4gaXRlbVtzdHJdLFxuICAgICAgc29ydDogbnVsbCxcbiAgICB9O1xuICB9XG5cbiAgbmdPbkRlc3Ryb3koKSB7XG4gICAgdGhpcy5fZGVzdHJveWVkJC5uZXh0KCk7XG4gIH1cblxuICBjbGlja0l0ZW0oaXRlbTogVmlydHVhbFRhYmxlSXRlbSkge1xuICAgIGlmICh0eXBlb2YgdGhpcy5vblJvd0NsaWNrID09PSAnZnVuY3Rpb24nKSB0aGlzLm9uUm93Q2xpY2soaXRlbSk7XG4gIH1cblxuICB0b2dnbGVGaWx0ZXIoKSB7XG4gICAgdGhpcy5maWx0ZXJJc09wZW4gPSAhdGhpcy5maWx0ZXJJc09wZW47XG4gICAgaWYgKHRoaXMuZmlsdGVySXNPcGVuKSB7XG4gICAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgdGhpcy5pbnB1dEZpbHRlckZvY3VzLm5hdGl2ZUVsZW1lbnQuZm9jdXMoKTtcbiAgICAgIH0pO1xuICAgIH1cbiAgICB0aGlzLmZpbHRlckNvbnRyb2wuc2V0VmFsdWUoJycsIHsgZW1pdEV2ZW50OiAhdGhpcy5maWx0ZXJJc09wZW4gfSk7XG4gIH1cbn1cbiIsImltcG9ydCB7IE5nTW9kdWxlIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBDb21tb25Nb2R1bGUgfSBmcm9tICdAYW5ndWxhci9jb21tb24nO1xuaW1wb3J0IHsgU2Nyb2xsRGlzcGF0Y2hNb2R1bGUgfSBmcm9tICdAYW5ndWxhci9jZGsvc2Nyb2xsaW5nJztcbmltcG9ydCB7IFZpcnR1YWxUYWJsZUNvbXBvbmVudCB9IGZyb20gJy4vY29tcG9uZW50cy92aXJ0dWFsLXRhYmxlLmNvbXBvbmVudCc7XG5pbXBvcnQgeyBSZWFjdGl2ZUZvcm1zTW9kdWxlIH0gZnJvbSAnQGFuZ3VsYXIvZm9ybXMnO1xuaW1wb3J0IHsgQnJvd3NlckFuaW1hdGlvbnNNb2R1bGUgfSBmcm9tICdAYW5ndWxhci9wbGF0Zm9ybS1icm93c2VyL2FuaW1hdGlvbnMnO1xuaW1wb3J0IHsgTWF0SWNvbk1vZHVsZSB9IGZyb20gJ0Bhbmd1bGFyL21hdGVyaWFsL2ljb24nO1xuaW1wb3J0IHsgTWF0Rm9ybUZpZWxkTW9kdWxlIH0gZnJvbSAnQGFuZ3VsYXIvbWF0ZXJpYWwvZm9ybS1maWVsZCc7XG5ATmdNb2R1bGUoe1xuICBkZWNsYXJhdGlvbnM6IFtWaXJ0dWFsVGFibGVDb21wb25lbnRdLFxuICBpbXBvcnRzOiBbXG4gICAgQ29tbW9uTW9kdWxlLFxuICAgIFJlYWN0aXZlRm9ybXNNb2R1bGUsXG4gICAgQnJvd3NlckFuaW1hdGlvbnNNb2R1bGUsXG4gICAgTWF0SWNvbk1vZHVsZSxcbiAgICBNYXRGb3JtRmllbGRNb2R1bGUsXG4gICAgU2Nyb2xsRGlzcGF0Y2hNb2R1bGUsXG4gIF0sXG4gIGV4cG9ydHM6IFtWaXJ0dWFsVGFibGVDb21wb25lbnRdLFxuICBwcm92aWRlcnM6IFtdLFxufSlcbmV4cG9ydCBjbGFzcyBOZ1ZpcnR1YWxUYWJsZU1vZHVsZSB7fVxuIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7SUEyQkE7UUFPUyxjQUFTLEdBQUcsRUFBRSxDQUFDO1FBSWYsaUJBQVksR0FBRyxLQUFLLENBQUM7UUFNbkIsc0JBQWlCLEdBQUcsUUFBUSxDQUFDO1FBTXRDLGtCQUFhLEdBQWdCLElBQUksV0FBVyxDQUFDLEVB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