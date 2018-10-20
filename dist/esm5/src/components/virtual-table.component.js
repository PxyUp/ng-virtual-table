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
        this.itemCount = 50;
        this.filterControl = new FormControl('');
        this._headerColumn = new Set();
        this.column = [];
        this._dataStream = EMPTY;
        this.sort$ = new Subject();
        this._destroyed$ = new Subject();
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
                return item;
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
        if ('dataSource' in changes) {
            /** @type {?} */
            var newDataSource = (/** @type {?} */ (changes.dataSource.currentValue));
            this._dataStream = combineLatest(this.sort$.asObservable().pipe(startWith(null)), combineLatest(newDataSource.pipe(map(function (stream, index) { return stream.map(function (e) { return (tslib_1.__assign({}, e, { $$$id: index })); }); }), tap(function (stream) {
                _this._headerColumn.clear();
                stream.forEach(function (e) { return Object.keys(e).forEach(function (key) { return _this._headerColumn.add(key); }); });
                _this.column = _this.createColumnFromArray(Array.from(_this._headerColumn));
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
                var sliceStream = (/** @type {?} */ (stream.slice()));
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
        if ('headerColumn' in changes && Array.isArray(changes.headerColumn.currentValue)) {
            this.column = this.createColumnFromArray(changes.headerColumn.currentValue);
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
    /**
     * @param {?} item
     * @return {?}
     */
    VirtualTableComponent.prototype.trackBy = /**
     * @param {?} item
     * @return {?}
     */
    function (item) {
        return item.$$$id;
    };
    VirtualTableComponent.decorators = [
        { type: Component, args: [{
                    selector: 'ng-virtual-table',
                    template: "<div class=\"table\">\n  <div class=\"header\">\n    <div *ngFor=\"let headerItem of column\" class=\"header-item\" (click)=\"applySort(headerItem.name)\">{{ headerItem.name }} {{ headerItem.sort }}</div>\n    <input type=\"text\" [formControl]=\"filterControl\">\n  </div>\n  <cdk-virtual-scroll-viewport [itemSize]=\"itemCount\"  class=\"virtual-table-content\">\n    <div *cdkVirtualFor=\"let item of _dataStream;trackBy: trackBy\" class=\"virtual-table-row\">\n      <div *ngFor=\"let headerItem of column\" class=\"virtual-table-column\">{{ item[headerItem.name] }}</div>\n    </div>\n  </cdk-virtual-scroll-viewport>\n</div>",
                    changeDetection: ChangeDetectionStrategy.OnPush,
                    styles: [".table .header{display:flex;margin-top:8px;border-bottom:1px solid #000}.table .header-item{cursor:pointer;margin:0 8px}.table .virtual-table-content{display:flex;flex-direction:column;min-height:200px}.table .virtual-table-row{display:flex;flex-direction:row;min-height:20px;margin:8px 0}.table .virtual-table-column{display:flex;margin:0 8px}"]
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
    VirtualTableComponent.prototype.filter$;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidmlydHVhbC10YWJsZS5jb21wb25lbnQuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9uZy12aXJ0dWFsLXRhYmxlLyIsInNvdXJjZXMiOlsic3JjL2NvbXBvbmVudHMvdmlydHVhbC10YWJsZS5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFBQSxPQUFPLEVBQUUsU0FBUyxFQUFFLHVCQUF1QixFQUFFLEtBQUssRUFBaUIsTUFBTSxlQUFlLENBQUM7QUFDekYsT0FBTyxFQUFFLFVBQVUsRUFBRSxLQUFLLEVBQUUsT0FBTyxFQUFFLGFBQWEsRUFBTSxNQUFNLE1BQU0sQ0FBQztBQUNyRSxPQUFPLEVBQ0wsR0FBRyxFQUNILEdBQUcsRUFDSCxTQUFTLEVBQ1QsWUFBWSxFQUVaLG9CQUFvQixFQUNwQixTQUFTLEdBRVYsTUFBTSxnQkFBZ0IsQ0FBQztBQUN4QixPQUFPLEVBQUUsV0FBVyxFQUFFLE1BQU0sZ0JBQWdCLENBQUM7Ozs7QUFDN0MsK0JBRUM7Ozs7QUFFRCxpQ0FHQzs7O0lBRkMsa0NBQWE7O0lBQ2Isa0NBQTRCOztBQUc5QjtJQUFBO1FBT1csY0FBUyxHQUFHLEVBQUUsQ0FBQztRQU14QixrQkFBYSxHQUFnQixJQUFJLFdBQVcsQ0FBQyxFQUFFLENBQUMsQ0FBQztRQUV6QyxrQkFBYSxHQUFnQixJQUFJLEdBQUcsRUFBRSxDQUFDO1FBRXhDLFdBQU0sR0FBOEIsRUFBRSxDQUFDO1FBRXZDLGdCQUFXLEdBQXdDLEtBQUssQ0FBQztRQUV4RCxVQUFLLEdBQW9CLElBQUksT0FBTyxFQUFVLENBQUM7UUFFL0MsZ0JBQVcsR0FBRyxJQUFJLE9BQU8sRUFBUSxDQUFDO1FBRWxDLFlBQU8sR0FBRyxJQUFJLENBQUMsYUFBYSxDQUFDLFlBQVksQ0FBQyxJQUFJLENBQ3BELFlBQVksQ0FBQyxHQUFHLENBQUMsRUFDakIsU0FBUyxDQUFDLElBQUksQ0FBQyxFQUNmLG9CQUFvQixFQUFFLEVBQ3RCLFNBQVMsQ0FBQyxJQUFJLENBQUMsV0FB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LElBQXNCO1FBQzVCLE9BQU8sSUFBSSxDQUFDLEtBQUssQ0FBQztJQUNwQixDQUFDOztnQkFqSkYsU0FBUyxTQUFDO29CQUNULFFBQVEsRUFBRSxrQkFBa0I7b0JBQzVCLGtvQkFBNkM7b0JBRTdDLGVBQWUsRUFBRSx1QkFBdUIsQ0FBQyxNQUFNOztpQkFDaEQ7Ozs0QkFFRSxLQUFLOzZCQUVMLEtBQUs7K0JBRUwsS0FBSzs7SUF1SVIsNEJBQUM7Q0FBQSxBQWxKRCxJQWtKQztTQTVJWSxxQkFBcUI7OztJQUNoQywwQ0FBd0I7O0lBRXhCLDJDQUF5RDs7SUFFekQsNkNBQXFDOztJQUVyQyw4Q0FBaUQ7O0lBRWpELDhDQUErQzs7SUFFL0MsdUNBQThDOztJQUU5Qyw0Q0FBZ0U7O0lBRWhFLHNDQUF1RDs7SUFFdkQsNENBQTBDOztJQUUxQyx3Q0FLRSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IENvbXBvbmVudCwgQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3ksIElucHV0LCBTaW1wbGVDaGFuZ2VzIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBPYnNlcnZhYmxlLCBFTVBUWSwgU3ViamVjdCwgY29tYmluZUxhdGVzdCwgb2YgfSBmcm9tICdyeGpzJztcbmltcG9ydCB7XG4gIHRhcCxcbiAgbWFwLFxuICBzdGFydFdpdGgsXG4gIGRlYm91bmNlVGltZSxcbiAgZmlsdGVyLFxuICBkaXN0aW5jdFVudGlsQ2hhbmdlZCxcbiAgdGFrZVVudGlsLFxuICBjYXRjaEVycm9yLFxufSBmcm9tICdyeGpzL29wZXJhdG9ycyc7XG5pbXBvcnQgeyBGb3JtQ29udHJvbCB9IGZyb20gJ0Bhbmd1bGFyL2Zvcm1zJztcbmludGVyZmFjZSBWaXJ0dWFsVGFibGVJdGVtIHtcbiAgW2tleTogc3RyaW5nXTogYW55O1xufVxuXG5pbnRlcmZhY2UgVmlydHVhbFRhYmxlQ29sdW1uIHtcbiAgbmFtZTogc3RyaW5nO1xuICBzb3J0OiAnYXNjJyB8ICdkZXNjJyB8IG51bGw7XG59XG5cbkBDb21wb25lbnQoe1xuICBzZWxlY3RvcjogJ25nLXZpcnR1YWwtdGFibGUnLFxuICB0ZW1wbGF0ZVVybDogJy4vdmlydHVhbC10YWJsZS5jb21wb25lbnQuaHRtbCcsXG4gIHN0eWxlVXJsczogWycuL3ZpcnR1YWwtdGFibGUuY29tcG9uZW50LnNjc3MnXSxcbiAgY2hhbmdlRGV0ZWN0aW9uOiBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneS5PblB1c2gsXG59KVxuZXhwb3J0IGNsYXNzIFZpcnR1YWxUYWJsZUNvbXBvbmVudCB7XG4gIEBJbnB1dCgpIGl0ZW1Db3VudCA9IDUwO1xuXG4gIEBJbnB1dCgpIGRhdGFTb3VyY2U6IE9ic2VydmFibGU8QXJyYXk8VmlydHVhbFRhYmxlSXRlbT4+O1xuXG4gIEBJbnB1dCgpIGhlYWRlckNvbHVtbjogQXJyYXk8c3RyaW5nPjtcblxuICBmaWx0ZXJDb250cm9sOiBGb3JtQ29udHJvbCA9IG5ldyBGb3JtQ29udHJvbCgnJyk7XG5cbiAgcHJpdmF0ZSBfaGVhZGVyQ29sdW1uOiBTZXQ8c3RyaW5nPiA9IG5ldyBTZXQoKTtcblxuICBwdWJsaWMgY29sdW1uOiBBcnJheTxWaXJ0dWFsVGFibGVDb2x1bW4+ID0gW107XG5cbiAgcHVibGljIF9kYXRhU3RyZWFtOiBPYnNlcnZhYmxlPEFycmF5PFZpcnR1YWxUYWJsZUl0ZW0+PiA9IEVNUFRZO1xuXG4gIHByaXZhdGUgc29ydCQ6IFN1YmplY3Q8c3RyaW5nPiA9IG5ldyBTdWJqZWN0PHN0cmluZz4oKTtcblxuICBwcml2YXRlIF9kZXN0cm95ZWQkID0gbmV3IFN1YmplY3Q8dm9pZD4oKTtcblxuICBwcml2YXRlIGZpbHRlciQgPSB0aGlzLmZpbHRlckNvbnRyb2wudmFsdWVDaGFuZ2VzLnBpcGUoXG4gICAgZGVib3VuY2VUaW1lKDMwMCksXG4gICAgc3RhcnRXaXRoKG51bGwpLFxuICAgIGRpc3RpbmN0VW50aWxDaGFuZ2VkKCksXG4gICAgdGFrZVVudGlsKHRoaXMuX2Rlc3Ryb3llZCQpLFxuICApO1xuXG4gIGFwcGx5U29ydChjb2x1bW46IHN0cmluZykge1xuICAgIHRoaXMuY29sdW1uID0gdGhpcy5jb2x1bW4ubWFwKChpdGVtKSA9PiB7XG4gICAgICBpZiAoaXRlbS5uYW1lICE9PSBjb2x1bW4pIHtcbiAgICAgICAgcmV0dXJuIGl0ZW07XG4gICAgICB9XG5cbiAgICAgIGlmIChpdGVtLnNvcnQgPT09IG51bGwpIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAuLi5pdGVtLFxuICAgICAgICAgIHNvcnQ6ICdhc2MnLFxuICAgICAgICB9O1xuICAgICAgfVxuXG4gICAgICBpZiAoaXRlbS5zb3J0ID09PSAnYXNjJykge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgIC4uLml0ZW0sXG4gICAgICAgICAgc29ydDogJ2Rlc2MnLFxuICAgICAgICB9O1xuICAgICAgfVxuXG4gICAgICBpZiAoaXRlbS5zb3J0ID09PSAnZGVzYycpIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAuLi5pdGVtLFxuICAgICAgICAgIHNvcnQ6IG51bGwsXG4gICAgICAgIH07XG4gICAgICB9XG4gICAgfSkgYXMgQXJyYXk8VmlydHVhbFRhYmxlQ29sdW1uPjtcbiAgICB0aGlzLnNvcnQkLm5leHQoY29sdW1uKTtcbiAgfVxuXG4gIG5nT25DaGFuZ2VzKGNoYW5nZXM6IFNpbXBsZUNoYW5nZXMpIHtcbiAgICBpZiAoJ2RhdGFTb3VyY2UnIGluIGNoYW5nZXMpIHtcbiAgICAgIGNvbnN0IG5ld0RhdGFTb3VyY2UgPSBjaGFuZ2VzLmRhdGFTb3VyY2UuY3VycmVudFZhbHVlIGFzIE9ic2VydmFibGU8QXJyYXk8VmlydHVhbFRhYmxlSXRlbT4+O1xuICAgICAgdGhpcy5fZGF0YVN0cmVhbSA9IGNvbWJpbmVMYXRlc3QoXG4gICAgICAgIHRoaXMuc29ydCQuYXNPYnNlcnZhYmxlKCkucGlwZShzdGFydFdpdGgobnVsbCkpLFxuICAgICAgICBjb21iaW5lTGF0ZXN0KFxuICAgICAgICAgIG5ld0RhdGFTb3VyY2UucGlwZShcbiAgICAgICAgICAgIG1hcCgoc3RyZWFtLCBpbmRleCkgPT4gc3RyZWFtLm1hcCgoZSkgPT4gKHsgLi4uZSwgJCQkaWQ6IGluZGV4IH0pKSksXG4gICAgICAgICAgICB0YXAoKHN0cmVhbTogQXJyYXk8VmlydHVhbFRhYmxlSXRlbT4pID0+IHtcbiAgICAgICAgICAgICAgdGhpcy5faGVhZGVyQ29sdW1uLmNsZWFyKCk7XG4gICAgICAgICAgICAgIHN0cmVhbS5mb3JFYWNoKChlKSA9PiBPYmplY3Qua2V5cyhlKS5mb3JFYWNoKChrZXkpID0+IHRoaXMuX2hlYWRlckNvbHVtbi5hZGQoa2V5KSkpO1xuICAgICAgICAgICAgICB0aGlzLmNvbHVtbiA9IHRoaXMuY3JlYXRlQ29sdW1uRnJvbUFycmF5KEFycmF5LmZyb20odGhpcy5faGVhZGVyQ29sdW1uKSk7XG4gICAgICAgICAgICB9KSxcbiAgICAgICAgICAgIG1hcCgoc3RyZWFtKSA9PiBzdHJlYW0uc2xpY2UoKSksXG4gICAgICAgICAgKSxcbiAgICAgICAgICB0aGlzLmZpbHRlciQsXG4gICAgICAgICkucGlwZShcbiAgICAgICAgICBtYXAoKFtzdHJlYW0sIGZpbHRlclN0cmluZ10pID0+IHtcbiAgICAgICAgICAgIGNvbnN0IHNsaWNlU3RyZWFtID0gc3RyZWFtLnNsaWNlKCk7XG4gICAgICAgICAgICBpZiAoIWZpbHRlclN0cmluZykge1xuICAgICAgICAgICAgICByZXR1cm4gc2xpY2VTdHJlYW07XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjb25zdCBmaWx0ZXIgPSBmaWx0ZXJTdHJpbmcudG9Mb2NhbGVMb3dlckNhc2UoKTtcblxuICAgICAgICAgICAgY29uc3QgZmlsdGVyU2xpY2VTdHJlYW0gPSBzbGljZVN0cmVhbS5maWx0ZXIoKGl0ZW06IFZpcnR1YWxUYWJsZUl0ZW0pID0+XG4gICAgICAgICAgICAgIE9iamVjdC5rZXlzKGl0ZW0pLnNvbWUoXG4gICAgICAgICAgICAgICAgKGtleSkgPT4gaXRlbVtrZXldICYmIGl0ZW1ba2V5XS50b1N0cmluZygpLnRvTG9jYWxlTG93ZXJDYXNlKCkuaW5kZXhPZihmaWx0ZXIpID4gLTEsXG4gICAgICAgICAgICAgICksXG4gICAgICAgICAgICApO1xuICAgICAgICAgICAgcmV0dXJuIGZpbHRlclNsaWNlU3RyZWFtO1xuICAgICAgICAgIH0pLFxuICAgICAgICApLFxuICAgICAgKS5waXBlKFxuICAgICAgICBtYXAoKFtzb3J0LCBzdHJlYW1dKSA9PiB7XG4gICAgICAgICAgY29uc3Qgc2xpY2VTdHJlYW0gPSBzdHJlYW0uc2xpY2UoKSBhcyBBcnJheTxWaXJ0dWFsVGFibGVJdGVtPjtcblxuICAgICAgICAgIGNvbnN0IHNvcnRDb2x1bW4gPSB0aGlzLmNvbHVtbi5maW5kKChlKSA9PiBlLm5hbWUgPT09IHNvcnQpO1xuXG4gICAgICAgICAgaWYgKCFzb3J0IHx8ICFzb3J0Q29sdW1uKSB7XG4gICAgICAgICAgICByZXR1cm4gc2xpY2VTdHJlYW07XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgaWYgKCFzb3J0Q29sdW1uLnNvcnQpIHtcbiAgICAgICAgICAgIHJldHVybiBzbGljZVN0cmVhbTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBpZiAoc29ydENvbHVtbi5zb3J0ID09PSAnYXNjJykge1xuICAgICAgICAgICAgc2xpY2VTdHJlYW0uc29ydChcbiAgICAgICAgICAgICAgKGE6IFZpcnR1YWxUYWJsZUl0ZW0sIGI6IFZpcnR1YWxUYWJsZUl0ZW0pID0+XG4gICAgICAgICAgICAgICAgYVtzb3J0Q29sdW1uLm5hbWVdID4gYltzb3J0Q29sdW1uLm5hbWVdXG4gICAgICAgICAgICAgICAgICA/IDFcbiAgICAgICAgICAgICAgICAgIDogYVtzb3J0Q29sdW1uLm5hbWVdID09PSBiW3NvcnRDb2x1bW4ubmFtZV0gPyAwIDogLTEsXG4gICAgICAgICAgICApO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBzbGljZVN0cmVhbS5zb3J0KFxuICAgICAgICAgICAgICAoYTogVmlydHVhbFRhYmxlSXRlbSwgYjogVmlydHVhbFRhYmxlSXRlbSkgPT5cbiAgICAgICAgICAgICAgICBhW3NvcnRDb2x1bW4ubmFtZV0gPCBiW3NvcnRDb2x1bW4ubmFtZV1cbiAgICAgICAgICAgICAgICAgID8gMVxuICAgICAgICAgICAgICAgICAgOiBhW3NvcnRDb2x1bW4ubmFtZV0gPT09IGJbc29ydENvbHVtbi5uYW1lXSA/IDAgOiAtMSxcbiAgICAgICAgICAgICk7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgcmV0dXJuIHNsaWNlU3RyZWFtO1xuICAgICAgICB9KSxcbiAgICAgICAgdGFwKCh2YWx1ZSkgPT4gY29uc29sZS5sb2codmFsdWUpKSxcbiAgICAgICk7XG4gICAgfVxuXG4gICAgaWYgKCdoZWFkZXJDb2x1bW4nIGluIGNoYW5nZXMgJiYgQXJyYXkuaXNBcnJheShjaGFuZ2VzLmhlYWRlckNvbHVtbi5jdXJyZW50VmFsdWUpKSB7XG4gICAgICB0aGlzLmNvbHVtbiA9IHRoaXMuY3JlYXRlQ29sdW1uRnJvbUFycmF5KGNoYW5nZXMuaGVhZGVyQ29sdW1uLmN1cnJlbnRWYWx1ZSk7XG4gICAgfVxuICB9XG5cbiAgY3JlYXRlQ29sdW1uRnJvbUFycmF5KGFycjogQXJyYXk8c3RyaW5nPik6IEFycmF5PFZpcnR1YWxUYWJsZUNvbHVtbj4ge1xuICAgIHJldHVybiBhcnIubWFwKChlKSA9PiAoeyBuYW1lOiBlLCBzb3J0OiBudWxsIH0pKTtcbiAgfVxuXG4gIG5nT25EZXN0cm95KCkge1xuICAgIHRoaXMuX2Rlc3Ryb3llZCQubmV4dCgpO1xuICB9XG5cbiAgdHJhY2tCeShpdGVtOiBWaXJ0dWFsVGFibGVJdGVtKSB7XG4gICAgcmV0dXJuIGl0ZW0uJCQkaWQ7XG4gIH1cbn1cbiJdfQ==