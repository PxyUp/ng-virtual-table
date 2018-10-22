/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
import * as tslib_1 from "tslib";
import { Component, ChangeDetectionStrategy, Input } from '@angular/core';
import { Observable, EMPTY, Subject, combineLatest } from 'rxjs';
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
var VirtualTableComponent = /** @class */ (function () {
    function VirtualTableComponent() {
        this.itemCount = 1;
        this.filterControl = new FormControl('');
        this._headerColumn = new Set();
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
            if (item.name !== column) {
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
        if ('headerColumn' in changes && Array.isArray(changes.headerColumn.currentValue)) {
            this.column = this.createColumnFromArray(changes.headerColumn.currentValue);
            this._headerWasSet = true;
        }
        if ('dataSource' in changes) {
            /** @type {?} */
            var newDataSource = (/** @type {?} */ (changes.dataSource.currentValue));
            this._dataStream = combineLatest(this.sort$.asObservable().pipe(startWith(null)), combineLatest(newDataSource.pipe(tap(function (stream) {
                if (!_this._headerWasSet) {
                    _this._headerColumn.clear();
                    stream.forEach(function (e) { return Object.keys(e).forEach(function (key) { return _this._headerColumn.add(key); }); });
                    _this.column = _this.createColumnFromArray(Array.from(_this._headerColumn));
                    _this._headerWasSet = true;
                }
            }), map(function (stream) { return stream.slice(); })), this.filter$).pipe(map(function (_a) {
                var _b = tslib_1.__read(_a, 2), stream = _b[0], filterString = _b[1];
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
            }))).pipe(map(function (_a) {
                var _b = tslib_1.__read(_a, 2), sort = _b[0], stream = _b[1];
                /** @type {?} */
                var sliceStream = stream.slice();
                /** @type {?} */
                var sortColumn = _this.column.find(function (e) { return e.name === sort; });
                if (!sort || !sortColumn) {
                    return sliceStream;
                }
                if (!sortColumn.sort) {
                    return sliceStream;
                }
                if (sortColumn.sort === 'asc') {
                    sliceStream.sort(function (a, b) {
                        return a[sortColumn.name] > b[sortColumn.name]
                            ? 1
                            : a[sortColumn.name] === b[sortColumn.name] ? 0 : -1;
                    });
                }
                else {
                    sliceStream.sort(function (a, b) {
                        return a[sortColumn.name] < b[sortColumn.name]
                            ? 1
                            : a[sortColumn.name] === b[sortColumn.name] ? 0 : -1;
                    });
                }
                return sliceStream;
            }), tap(function (value) { return console.log(value); }));
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
        return arr.map(function (e) { return ({ name: e, sort: null }); });
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
    VirtualTableComponent.decorators = [
        { type: Component, args: [{
                    selector: 'ng-virtual-table',
                    template: "<div class=\"table\">\n  <div class=\"header\">\n    <div *ngFor=\"let headerItem of column\" class=\"header-item\" (click)=\"applySort(headerItem.name)\">{{ headerItem.name }} {{ headerItem.sort }}</div>\n    <input type=\"text\" [formControl]=\"filterControl\">\n  </div>\n  <cdk-virtual-scroll-viewport [itemSize]=\"itemCount\"  class=\"virtual-table-content\">\n    <div *cdkVirtualFor=\"let item of _dataStream;templateCacheSize: 0\" class=\"virtual-table-row\">\n      <div *ngFor=\"let headerItem of column\" class=\"virtual-table-column\">{{ item[headerItem.name] }}</div>\n    </div>\n  </cdk-virtual-scroll-viewport>\n</div>",
                    changeDetection: ChangeDetectionStrategy.OnPush,
                    styles: [".table .header{display:flex;margin-top:8px;border-bottom:1px solid #000}.table .header-item{cursor:pointer;margin:0 8px}.table .virtual-table-content,.table .virtual-table-empty{display:flex;flex-direction:column;min-height:200px}.table .virtual-table-row{display:flex;flex-direction:row;min-height:20px;margin:8px 0}.table .virtual-table-column{display:flex;margin:0 8px}"]
                }] }
    ];
    VirtualTableComponent.propDecorators = {
        itemCount: [{ type: Input }],
        dataSource: [{ type: Input }],
        headerColumn: [{ type: Input }]
    };
    return VirtualTableComponent;
}());
export { VirtualTableComponent };
if (false) {
    /** @type {?} */
    VirtualTableComponent.prototype.itemCount;
    /** @type {?} */
    VirtualTableComponent.prototype.dataSource;
    /** @type {?} */
    VirtualTableComponent.prototype.headerColumn;
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
    VirtualTableComponent.prototype.filter$;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidmlydHVhbC10YWJsZS5jb21wb25lbnQuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9uZy12aXJ0dWFsLXRhYmxlLyIsInNvdXJjZXMiOlsic3JjL2NvbXBvbmVudHMvdmlydHVhbC10YWJsZS5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFBQSxPQUFPLEVBQUUsU0FBUyxFQUFFLHVCQUF1QixFQUFFLEtBQUssRUFBaUIsTUFBTSxlQUFlLENBQUM7QUFDekYsT0FBTyxFQUFFLFVBQVUsRUFBRSxLQUFLLEVBQUUsT0FBTyxFQUFFLGFBQWEsRUFBTSxNQUFNLE1BQU0sQ0FBQztBQUNyRSxPQUFPLEVBQ0wsR0FBRyxFQUNILEdBQUcsRUFDSCxTQUFTLEVBQ1QsWUFBWSxFQUVaLG9CQUFvQixFQUNwQixTQUFTLEdBRVYsTUFBTSxnQkFBZ0IsQ0FBQztBQUN4QixPQUFPLEVBQUUsV0FBVyxFQUFFLE1BQU0sZ0JBQWdCLENBQUM7Ozs7QUFDN0MsK0JBRUM7Ozs7QUFFRCxpQ0FHQzs7O0lBRkMsa0NBQWE7O0lBQ2Isa0NBQTRCOztBQUc5QjtJQUFBO1FBT1csY0FBUyxHQUFHLENBQUMsQ0FBQztRQU12QixrQkFBYSxHQUFnQixJQUFJLFdBQVcsQ0FBQyxFQUFFLENBQUMsQ0FBQztRQUV6QyxrQkFBYSxHQUFnQixJQUFJLEdBQUcsRUFBRSxDQUFDO1FBRXhDLFdBQU0sR0FBOEIsRUFBRSxDQUFDO1FBRXZDLGdCQUFXLEdBQXdDLEtBQUssQ0FBQztRQUV4RCxVQUFLLEdBQW9CLElBQUksT0FBTyxFQUFVLENBQUM7UUFFL0MsZ0JBQVcsR0FBRyxJQUFJLE9BQU8sRUFBUSxDQUFDO1FBRWxDLGtCQUFhLEdBQUcsS0FBSyxDQUFDO1FBRXRCLFlBQU8sR0FBRyxJQUFJLENBQUMsYUFBYSxDQUFDLFlBQVksQ0FBQyxJQUFJLENBQ3BELFlBQVksQ0FBQyxHQUFHLENBQUMsRUFDakIsU0FBUyxDQUFDLElBQUksQ0FBQyxFQUNmLG9CQUFvQixFQUFFLEVB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QUUsa0JBQWtCO29CQUM1Qixzb0JBQTZDO29CQUU3QyxlQUFlLEVBQUUsdUJBQXVCLENBQUMsTUFBTTs7aUJBQ2hEOzs7NEJBRUUsS0FBSzs2QkFFTCxLQUFLOytCQUVMLEtBQUs7O0lBMklSLDRCQUFDO0NBQUEsQUF0SkQsSUFzSkM7U0FoSlkscUJBQXFCOzs7SUFDaEMsMENBQXVCOztJQUV2QiwyQ0FBeUQ7O0lBRXpELDZDQUFxQzs7SUFFckMsOENBQWlEOztJQUVqRCw4Q0FBK0M7O0lBRS9DLHVDQUE4Qzs7SUFFOUMsNENBQWdFOztJQUVoRSxzQ0FBdUQ7O0lBRXZELDRDQUEwQzs7SUFFMUMsOENBQThCOztJQUU5Qix3Q0FLRSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IENvbXBvbmVudCwgQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3ksIElucHV0LCBTaW1wbGVDaGFuZ2VzIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBPYnNlcnZhYmxlLCBFTVBUWSwgU3ViamVjdCwgY29tYmluZUxhdGVzdCwgb2YgfSBmcm9tICdyeGpzJztcbmltcG9ydCB7XG4gIHRhcCxcbiAgbWFwLFxuICBzdGFydFdpdGgsXG4gIGRlYm91bmNlVGltZSxcbiAgZmlsdGVyLFxuICBkaXN0aW5jdFVudGlsQ2hhbmdlZCxcbiAgdGFrZVVudGlsLFxuICBjYXRjaEVycm9yLFxufSBmcm9tICdyeGpzL29wZXJhdG9ycyc7XG5pbXBvcnQgeyBGb3JtQ29udHJvbCB9IGZyb20gJ0Bhbmd1bGFyL2Zvcm1zJztcbmludGVyZmFjZSBWaXJ0dWFsVGFibGVJdGVtIHtcbiAgW2tleTogc3RyaW5nXTogYW55O1xufVxuXG5pbnRlcmZhY2UgVmlydHVhbFRhYmxlQ29sdW1uIHtcbiAgbmFtZTogc3RyaW5nO1xuICBzb3J0OiAnYXNjJyB8ICdkZXNjJyB8IG51bGw7XG59XG5cbkBDb21wb25lbnQoe1xuICBzZWxlY3RvcjogJ25nLXZpcnR1YWwtdGFibGUnLFxuICB0ZW1wbGF0ZVVybDogJy4vdmlydHVhbC10YWJsZS5jb21wb25lbnQuaHRtbCcsXG4gIHN0eWxlVXJsczogWycuL3ZpcnR1YWwtdGFibGUuY29tcG9uZW50LnNjc3MnXSxcbiAgY2hhbmdlRGV0ZWN0aW9uOiBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneS5PblB1c2gsXG59KVxuZXhwb3J0IGNsYXNzIFZpcnR1YWxUYWJsZUNvbXBvbmVudCB7XG4gIEBJbnB1dCgpIGl0ZW1Db3VudCA9IDE7XG5cbiAgQElucHV0KCkgZGF0YVNvdXJjZTogT2JzZXJ2YWJsZTxBcnJheTxWaXJ0dWFsVGFibGVJdGVtPj47XG5cbiAgQElucHV0KCkgaGVhZGVyQ29sdW1uOiBBcnJheTxzdHJpbmc+O1xuXG4gIGZpbHRlckNvbnRyb2w6IEZvcm1Db250cm9sID0gbmV3IEZvcm1Db250cm9sKCcnKTtcblxuICBwcml2YXRlIF9oZWFkZXJDb2x1bW46IFNldDxzdHJpbmc+ID0gbmV3IFNldCgpO1xuXG4gIHB1YmxpYyBjb2x1bW46IEFycmF5PFZpcnR1YWxUYWJsZUNvbHVtbj4gPSBbXTtcblxuICBwdWJsaWMgX2RhdGFTdHJlYW06IE9ic2VydmFibGU8QXJyYXk8VmlydHVhbFRhYmxlSXRlbT4+ID0gRU1QVFk7XG5cbiAgcHJpdmF0ZSBzb3J0JDogU3ViamVjdDxzdHJpbmc+ID0gbmV3IFN1YmplY3Q8c3RyaW5nPigpO1xuXG4gIHByaXZhdGUgX2Rlc3Ryb3llZCQgPSBuZXcgU3ViamVjdDx2b2lkPigpO1xuXG4gIHByaXZhdGUgX2hlYWRlcldhc1NldCA9IGZhbHNlO1xuXG4gIHByaXZhdGUgZmlsdGVyJCA9IHRoaXMuZmlsdGVyQ29udHJvbC52YWx1ZUNoYW5nZXMucGlwZShcbiAgICBkZWJvdW5jZVRpbWUoMzAwKSxcbiAgICBzdGFydFdpdGgobnVsbCksXG4gICAgZGlzdGluY3RVbnRpbENoYW5nZWQoKSxcbiAgICB0YWtlVW50aWwodGhpcy5fZGVzdHJveWVkJCksXG4gICk7XG5cbiAgYXBwbHlTb3J0KGNvbHVtbjogc3RyaW5nKSB7XG4gICAgdGhpcy5jb2x1bW4gPSB0aGlzLmNvbHVtbi5tYXAoKGl0ZW0pID0+IHtcbiAgICAgIGlmIChpdGVtLm5hbWUgIT09IGNvbHVtbikge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgIC4uLml0ZW0sXG4gICAgICAgICAgc29ydDogbnVsbCxcbiAgICAgICAgfTtcbiAgICAgIH1cblxuICAgICAgaWYgKGl0ZW0uc29ydCA9PT0gbnVsbCkge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgIC4uLml0ZW0sXG4gICAgICAgICAgc29ydDogJ2FzYycsXG4gICAgICAgIH07XG4gICAgICB9XG5cbiAgICAgIGlmIChpdGVtLnNvcnQgPT09ICdhc2MnKSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgLi4uaXRlbSxcbiAgICAgICAgICBzb3J0OiAnZGVzYycsXG4gICAgICAgIH07XG4gICAgICB9XG5cbiAgICAgIGlmIChpdGVtLnNvcnQgPT09ICdkZXNjJykge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgIC4uLml0ZW0sXG4gICAgICAgICAgc29ydDogbnVsbCxcbiAgICAgICAgfTtcbiAgICAgIH1cbiAgICB9KSBhcyBBcnJheTxWaXJ0dWFsVGFibGVDb2x1bW4+O1xuICAgIHRoaXMuc29ydCQubmV4dChjb2x1bW4pO1xuICB9XG5cbiAgbmdPbkNoYW5nZXMoY2hhbmdlczogU2ltcGxlQ2hhbmdlcykge1xuICAgIGlmICgnaGVhZGVyQ29sdW1uJyBpbiBjaGFuZ2VzICYmIEFycmF5LmlzQXJyYXkoY2hhbmdlcy5oZWFkZXJDb2x1bW4uY3VycmVudFZhbHVlKSkge1xuICAgICAgdGhpcy5jb2x1bW4gPSB0aGlzLmNyZWF0ZUNvbHVtbkZyb21BcnJheShjaGFuZ2VzLmhlYWRlckNvbHVtbi5jdXJyZW50VmFsdWUpO1xuICAgICAgdGhpcy5faGVhZGVyV2FzU2V0ID0gdHJ1ZTtcbiAgICB9XG5cbiAgICBpZiAoJ2RhdGFTb3VyY2UnIGluIGNoYW5nZXMpIHtcbiAgICAgIGNvbnN0IG5ld0RhdGFTb3VyY2UgPSBjaGFuZ2VzLmRhdGFTb3VyY2UuY3VycmVudFZhbHVlIGFzIE9ic2VydmFibGU8QXJyYXk8VmlydHVhbFRhYmxlSXRlbT4+O1xuICAgICAgdGhpcy5fZGF0YVN0cmVhbSA9IGNvbWJpbmVMYXRlc3QoXG4gICAgICAgIHRoaXMuc29ydCQuYXNPYnNlcnZhYmxlKCkucGlwZShzdGFydFdpdGgobnVsbCkpLFxuICAgICAgICBjb21iaW5lTGF0ZXN0KFxuICAgICAgICAgIG5ld0RhdGFTb3VyY2UucGlwZShcbiAgICAgICAgICAgIHRhcCgoc3RyZWFtOiBBcnJheTxWaXJ0dWFsVGFibGVJdGVtPikgPT4ge1xuICAgICAgICAgICAgICBpZiAoIXRoaXMuX2hlYWRlcldhc1NldCkge1xuICAgICAgICAgICAgICAgIHRoaXMuX2hlYWRlckNvbHVtbi5jbGVhcigpO1xuICAgICAgICAgICAgICAgIHN0cmVhbS5mb3JFYWNoKChlKSA9PiBPYmplY3Qua2V5cyhlKS5mb3JFYWNoKChrZXkpID0+IHRoaXMuX2hlYWRlckNvbHVtbi5hZGQoa2V5KSkpO1xuICAgICAgICAgICAgICAgIHRoaXMuY29sdW1uID0gdGhpcy5jcmVhdGVDb2x1bW5Gcm9tQXJyYXkoQXJyYXkuZnJvbSh0aGlzLl9oZWFkZXJDb2x1bW4pKTtcbiAgICAgICAgICAgICAgICB0aGlzLl9oZWFkZXJXYXNTZXQgPSB0cnVlO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KSxcbiAgICAgICAgICAgIG1hcCgoc3RyZWFtKSA9PiBzdHJlYW0uc2xpY2UoKSksXG4gICAgICAgICAgKSxcbiAgICAgICAgICB0aGlzLmZpbHRlciQsXG4gICAgICAgICkucGlwZShcbiAgICAgICAgICBtYXAoKFtzdHJlYW0sIGZpbHRlclN0cmluZ10pID0+IHtcbiAgICAgICAgICAgIGNvbnN0IHNsaWNlU3RyZWFtID0gc3RyZWFtLnNsaWNlKCk7XG4gICAgICAgICAgICBpZiAoIWZpbHRlclN0cmluZykge1xuICAgICAgICAgICAgICByZXR1cm4gc2xpY2VTdHJlYW07XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjb25zdCBmaWx0ZXIgPSBmaWx0ZXJTdHJpbmcudG9Mb2NhbGVMb3dlckNhc2UoKTtcblxuICAgICAgICAgICAgY29uc3QgZmlsdGVyU2xpY2VTdHJlYW0gPSBzbGljZVN0cmVhbS5maWx0ZXIoKGl0ZW06IFZpcnR1YWxUYWJsZUl0ZW0pID0+XG4gICAgICAgICAgICAgIE9iamVjdC5rZXlzKGl0ZW0pLnNvbWUoXG4gICAgICAgICAgICAgICAgKGtleSkgPT4gaXRlbVtrZXldICYmIGl0ZW1ba2V5XS50b1N0cmluZygpLnRvTG9jYWxlTG93ZXJDYXNlKCkuaW5kZXhPZihmaWx0ZXIpID4gLTEsXG4gICAgICAgICAgICAgICksXG4gICAgICAgICAgICApO1xuICAgICAgICAgICAgcmV0dXJuIGZpbHRlclNsaWNlU3RyZWFtO1xuICAgICAgICAgIH0pLFxuICAgICAgICApLFxuICAgICAgKS5waXBlKFxuICAgICAgICBtYXAoKFtzb3J0LCBzdHJlYW1dKSA9PiB7XG4gICAgICAgICAgY29uc3Qgc2xpY2VTdHJlYW0gPSBzdHJlYW0uc2xpY2UoKTtcblxuICAgICAgICAgIGNvbnN0IHNvcnRDb2x1bW4gPSB0aGlzLmNvbHVtbi5maW5kKChlKSA9PiBlLm5hbWUgPT09IHNvcnQpO1xuXG4gICAgICAgICAgaWYgKCFzb3J0IHx8ICFzb3J0Q29sdW1uKSB7XG4gICAgICAgICAgICByZXR1cm4gc2xpY2VTdHJlYW07XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgaWYgKCFzb3J0Q29sdW1uLnNvcnQpIHtcbiAgICAgICAgICAgIHJldHVybiBzbGljZVN0cmVhbTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBpZiAoc29ydENvbHVtbi5zb3J0ID09PSAnYXNjJykge1xuICAgICAgICAgICAgc2xpY2VTdHJlYW0uc29ydChcbiAgICAgICAgICAgICAgKGE6IFZpcnR1YWxUYWJsZUl0ZW0sIGI6IFZpcnR1YWxUYWJsZUl0ZW0pID0+XG4gICAgICAgICAgICAgICAgYVtzb3J0Q29sdW1uLm5hbWVdID4gYltzb3J0Q29sdW1uLm5hbWVdXG4gICAgICAgICAgICAgICAgICA/IDFcbiAgICAgICAgICAgICAgICAgIDogYVtzb3J0Q29sdW1uLm5hbWVdID09PSBiW3NvcnRDb2x1bW4ubmFtZV0gPyAwIDogLTEsXG4gICAgICAgICAgICApO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBzbGljZVN0cmVhbS5zb3J0KFxuICAgICAgICAgICAgICAoYTogVmlydHVhbFRhYmxlSXRlbSwgYjogVmlydHVhbFRhYmxlSXRlbSkgPT5cbiAgICAgICAgICAgICAgICBhW3NvcnRDb2x1bW4ubmFtZV0gPCBiW3NvcnRDb2x1bW4ubmFtZV1cbiAgICAgICAgICAgICAgICAgID8gMVxuICAgICAgICAgICAgICAgICAgOiBhW3NvcnRDb2x1bW4ubmFtZV0gPT09IGJbc29ydENvbHVtbi5uYW1lXSA/IDAgOiAtMSxcbiAgICAgICAgICAgICk7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgcmV0dXJuIHNsaWNlU3RyZWFtO1xuICAgICAgICB9KSxcbiAgICAgICAgdGFwKCh2YWx1ZSkgPT4gY29uc29sZS5sb2codmFsdWUpKSxcbiAgICAgICk7XG4gICAgfVxuICB9XG5cbiAgY3JlYXRlQ29sdW1uRnJvbUFycmF5KGFycjogQXJyYXk8c3RyaW5nPik6IEFycmF5PFZpcnR1YWxUYWJsZUNvbHVtbj4ge1xuICAgIHJldHVybiBhcnIubWFwKChlKSA9PiAoeyBuYW1lOiBlLCBzb3J0OiBudWxsIH0pKTtcbiAgfVxuXG4gIG5nT25EZXN0cm95KCkge1xuICAgIHRoaXMuX2Rlc3Ryb3llZCQubmV4dCgpO1xuICB9XG59XG4iXX0=