import { Component, ChangeDetectionStrategy, Input, NgModule } from '@angular/core';
import { EMPTY, Subject, combineLatest } from 'rxjs';
import { tap, map, startWith, debounceTime, distinctUntilChanged, takeUntil } from 'rxjs/operators';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ScrollDispatchModule } from '@angular/cdk/scrolling';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
class VirtualTableComponent {
    constructor() {
        this.itemCount = 50;
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
            }))).pipe(map(([sort, stream]) => {
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
            }), tap((value) => console.log(value)));
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
}
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

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
class NgVirtualTableModule {
}
NgVirtualTableModule.decorators = [
    { type: NgModule, args: [{
                declarations: [VirtualTableComponent],
                imports: [CommonModule, ReactiveFormsModule, BrowserAnimationsModule, ScrollDispatchModule],
                exports: [VirtualTableComponent],
                providers: [],
            },] }
];

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */

export { NgVirtualTableModule, VirtualTableComponent };

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmctdmlydHVhbC10YWJsZS5qcy5tYXAiLCJzb3VyY2VzIjpbIm5nOi8vbmctdmlydHVhbC10YWJsZS9zcmMvY29tcG9uZW50cy92aXJ0dWFsLXRhYmxlLmNvbXBvbmVudC50cyIsIm5nOi8vbmctdmlydHVhbC10YWJsZS9zcmMvbmdWaXJ0dWFsVGFibGUubW9kdWxlLnRzIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IENvbXBvbmVudCwgQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3ksIElucHV0LCBTaW1wbGVDaGFuZ2VzIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBPYnNlcnZhYmxlLCBFTVBUWSwgU3ViamVjdCwgY29tYmluZUxhdGVzdCwgb2YgfSBmcm9tICdyeGpzJztcbmltcG9ydCB7XG4gIHRhcCxcbiAgbWFwLFxuICBzdGFydFdpdGgsXG4gIGRlYm91bmNlVGltZSxcbiAgZmlsdGVyLFxuICBkaXN0aW5jdFVudGlsQ2hhbmdlZCxcbiAgdGFrZVVudGlsLFxuICBjYXRjaEVycm9yLFxufSBmcm9tICdyeGpzL29wZXJhdG9ycyc7XG5pbXBvcnQgeyBGb3JtQ29udHJvbCB9IGZyb20gJ0Bhbmd1bGFyL2Zvcm1zJztcbmludGVyZmFjZSBWaXJ0dWFsVGFibGVJdGVtIHtcbiAgW2tleTogc3RyaW5nXTogYW55O1xufVxuXG5pbnRlcmZhY2UgVmlydHVhbFRhYmxlQ29sdW1uIHtcbiAgbmFtZTogc3RyaW5nO1xuICBzb3J0OiAnYXNjJyB8ICdkZXNjJyB8IG51bGw7XG59XG5cbkBDb21wb25lbnQoe1xuICBzZWxlY3RvcjogJ25nLXZpcnR1YWwtdGFibGUnLFxuICB0ZW1wbGF0ZVVybDogJy4vdmlydHVhbC10YWJsZS5jb21wb25lbnQuaHRtbCcsXG4gIHN0eWxlVXJsczogWycuL3ZpcnR1YWwtdGFibGUuY29tcG9uZW50LnNjc3MnXSxcbiAgY2hhbmdlRGV0ZWN0aW9uOiBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneS5PblB1c2gsXG59KVxuZXhwb3J0IGNsYXNzIFZpcnR1YWxUYWJsZUNvbXBvbmVudCB7XG4gIEBJbnB1dCgpIGl0ZW1Db3VudCA9IDUwO1xuXG4gIEBJbnB1dCgpIGRhdGFTb3VyY2U6IE9ic2VydmFibGU8QXJyYXk8VmlydHVhbFRhYmxlSXRlbT4+O1xuXG4gIEBJbnB1dCgpIGhlYWRlckNvbHVtbjogQXJyYXk8c3RyaW5nPjtcblxuICBmaWx0ZXJDb250cm9sOiBGb3JtQ29udHJvbCA9IG5ldyBGb3JtQ29udHJvbCgnJyk7XG5cbiAgcHJpdmF0ZSBfaGVhZGVyQ29sdW1uOiBTZXQ8c3RyaW5nPiA9IG5ldyBTZXQoKTtcblxuICBwdWJsaWMgY29sdW1uOiBBcnJheTxWaXJ0dWFsVGFibGVDb2x1bW4+ID0gW107XG5cbiAgcHVibGljIF9kYXRhU3RyZWFtOiBPYnNlcnZhYmxlPEFycmF5PFZpcnR1YWxUYWJsZUl0ZW0+PiA9IEVNUFRZO1xuXG4gIHByaXZhdGUgc29ydCQ6IFN1YmplY3Q8c3RyaW5nPiA9IG5ldyBTdWJqZWN0PHN0cmluZz4oKTtcblxuICBwcml2YXRlIF9kZXN0cm95ZWQkID0gbmV3IFN1YmplY3Q8dm9pZD4oKTtcblxuICBwcml2YXRlIF9oZWFkZXJXYXNTZXQgPSBmYWxzZTtcblxuICBwcml2YXRlIGZpbHRlciQgPSB0aGlzLmZpbHRlckNvbnRyb2wudmFsdWVDaGFuZ2VzLnBpcGUoXG4gICAgZGVib3VuY2VUaW1lKDMwMCksXG4gICAgc3RhcnRXaXRoKG51bGwpLFxuICAgIGRpc3RpbmN0VW50aWxDaGFuZ2VkKCksXG4gICAgdGFrZVVudGlsKHRoaXMuX2Rlc3Ryb3llZCQpLFxuICApO1xuXG4gIGFwcGx5U29ydChjb2x1bW46IHN0cmluZykge1xuICAgIHRoaXMuY29sdW1uID0gdGhpcy5jb2x1bW4ubWFwKChpdGVtKSA9PiB7XG4gICAgICBpZiAoaXRlbS5uYW1lICE9PSBjb2x1bW4pIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAuLi5pdGVtLFxuICAgICAgICAgIHNvcnQ6IG51bGwsXG4gICAgICAgIH07XG4gICAgICB9XG5cbiAgICAgIGlmIChpdGVtLnNvcnQgPT09IG51bGwpIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAuLi5pdGVtLFxuICAgICAgICAgIHNvcnQ6ICdhc2MnLFxuICAgICAgICB9O1xuICAgICAgfVxuXG4gICAgICBpZiAoaXRlbS5zb3J0ID09PSAnYXNjJykge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgIC4uLml0ZW0sXG4gICAgICAgICAgc29ydDogJ2Rlc2MnLFxuICAgICAgICB9O1xuICAgICAgfVxuXG4gICAgICBpZiAoaXRlbS5zb3J0ID09PSAnZGVzYycpIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAuLi5pdGVtLFxuICAgICAgICAgIHNvcnQ6IG51bGwsXG4gICAgICAgIH07XG4gICAgICB9XG4gICAgfSkgYXMgQXJyYXk8VmlydHVhbFRhYmxlQ29sdW1uPjtcbiAgICB0aGlzLnNvcnQkLm5leHQoY29sdW1uKTtcbiAgfVxuXG4gIG5nT25DaGFuZ2VzKGNoYW5nZXM6IFNpbXBsZUNoYW5nZXMpIHtcbiAgICBpZiAoJ2hlYWRlckNvbHVtbicgaW4gY2hhbmdlcyAmJiBBcnJheS5pc0FycmF5KGNoYW5nZXMuaGVhZGVyQ29sdW1uLmN1cnJlbnRWYWx1ZSkpIHtcbiAgICAgIHRoaXMuY29sdW1uID0gdGhpcy5jcmVhdGVDb2x1bW5Gcm9tQXJyYXkoY2hhbmdlcy5oZWFkZXJDb2x1bW4uY3VycmVudFZhbHVlKTtcbiAgICAgIHRoaXMuX2hlYWRlcldhc1NldCA9IHRydWU7XG4gICAgfVxuXG4gICAgaWYgKCdkYXRhU291cmNlJyBpbiBjaGFuZ2VzKSB7XG4gICAgICBjb25zdCBuZXdEYXRhU291cmNlID0gY2hhbmdlcy5kYXRhU291cmNlLmN1cnJlbnRWYWx1ZSBhcyBPYnNlcnZhYmxlPEFycmF5PFZpcnR1YWxUYWJsZUl0ZW0+PjtcbiAgICAgIHRoaXMuX2RhdGFTdHJlYW0gPSBjb21iaW5lTGF0ZXN0KFxuICAgICAgICB0aGlzLnNvcnQkLmFzT2JzZXJ2YWJsZSgpLnBpcGUoc3RhcnRXaXRoKG51bGwpKSxcbiAgICAgICAgY29tYmluZUxhdGVzdChcbiAgICAgICAgICBuZXdEYXRhU291cmNlLnBpcGUoXG4gICAgICAgICAgICB0YXAoKHN0cmVhbTogQXJyYXk8VmlydHVhbFRhYmxlSXRlbT4pID0+IHtcbiAgICAgICAgICAgICAgaWYgKCF0aGlzLl9oZWFkZXJXYXNTZXQpIHtcbiAgICAgICAgICAgICAgICB0aGlzLl9oZWFkZXJDb2x1bW4uY2xlYXIoKTtcbiAgICAgICAgICAgICAgICBzdHJlYW0uZm9yRWFjaCgoZSkgPT4gT2JqZWN0LmtleXMoZSkuZm9yRWFjaCgoa2V5KSA9PiB0aGlzLl9oZWFkZXJDb2x1bW4uYWRkKGtleSkpKTtcbiAgICAgICAgICAgICAgICB0aGlzLmNvbHVtbiA9IHRoaXMuY3JlYXRlQ29sdW1uRnJvbUFycmF5KEFycmF5LmZyb20odGhpcy5faGVhZGVyQ29sdW1uKSk7XG4gICAgICAgICAgICAgICAgdGhpcy5faGVhZGVyV2FzU2V0ID0gdHJ1ZTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSksXG4gICAgICAgICAgICBtYXAoKHN0cmVhbSkgPT4gc3RyZWFtLnNsaWNlKCkpLFxuICAgICAgICAgICksXG4gICAgICAgICAgdGhpcy5maWx0ZXIkLFxuICAgICAgICApLnBpcGUoXG4gICAgICAgICAgbWFwKChbc3RyZWFtLCBmaWx0ZXJTdHJpbmddKSA9PiB7XG4gICAgICAgICAgICBjb25zdCBzbGljZVN0cmVhbSA9IHN0cmVhbS5zbGljZSgpO1xuICAgICAgICAgICAgaWYgKCFmaWx0ZXJTdHJpbmcpIHtcbiAgICAgICAgICAgICAgcmV0dXJuIHNsaWNlU3RyZWFtO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY29uc3QgZmlsdGVyID0gZmlsdGVyU3RyaW5nLnRvTG9jYWxlTG93ZXJDYXNlKCk7XG5cbiAgICAgICAgICAgIGNvbnN0IGZpbHRlclNsaWNlU3RyZWFtID0gc2xpY2VTdHJlYW0uZmlsdGVyKChpdGVtOiBWaXJ0dWFsVGFibGVJdGVtKSA9PlxuICAgICAgICAgICAgICBPYmplY3Qua2V5cyhpdGVtKS5zb21lKFxuICAgICAgICAgICAgICAgIChrZXkpID0+IGl0ZW1ba2V5XSAmJiBpdGVtW2tleV0udG9TdHJpbmcoKS50b0xvY2FsZUxvd2VyQ2FzZSgpLmluZGV4T2YoZmlsdGVyKSA+IC0xLFxuICAgICAgICAgICAgICApLFxuICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIHJldHVybiBmaWx0ZXJTbGljZVN0cmVhbTtcbiAgICAgICAgICB9KSxcbiAgICAgICAgKSxcbiAgICAgICkucGlwZShcbiAgICAgICAgbWFwKChbc29ydCwgc3RyZWFtXSkgPT4ge1xuICAgICAgICAgIGNvbnN0IHNsaWNlU3RyZWFtID0gc3RyZWFtLnNsaWNlKCk7XG5cbiAgICAgICAgICBjb25zdCBzb3J0Q29sdW1uID0gdGhpcy5jb2x1bW4uZmluZCgoZSkgPT4gZS5uYW1lID09PSBzb3J0KTtcblxuICAgICAgICAgIGlmICghc29ydCB8fCAhc29ydENvbHVtbikge1xuICAgICAgICAgICAgcmV0dXJuIHNsaWNlU3RyZWFtO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIGlmICghc29ydENvbHVtbi5zb3J0KSB7XG4gICAgICAgICAgICByZXR1cm4gc2xpY2VTdHJlYW07XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgaWYgKHNvcnRDb2x1bW4uc29ydCA9PT0gJ2FzYycpIHtcbiAgICAgICAgICAgIHNsaWNlU3RyZWFtLnNvcnQoXG4gICAgICAgICAgICAgIChhOiBWaXJ0dWFsVGFibGVJdGVtLCBiOiBWaXJ0dWFsVGFibGVJdGVtKSA9PlxuICAgICAgICAgICAgICAgIGFbc29ydENvbHVtbi5uYW1lXSA+IGJbc29ydENvbHVtbi5uYW1lXVxuICAgICAgICAgICAgICAgICAgPyAxXG4gICAgICAgICAgICAgICAgICA6IGFbc29ydENvbHVtbi5uYW1lXSA9PT0gYltzb3J0Q29sdW1uLm5hbWVdID8gMCA6IC0xLFxuICAgICAgICAgICAgKTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgc2xpY2VTdHJlYW0uc29ydChcbiAgICAgICAgICAgICAgKGE6IFZpcnR1YWxUYWJsZUl0ZW0sIGI6IFZpcnR1YWxUYWJsZUl0ZW0pID0+XG4gICAgICAgICAgICAgICAgYVtzb3J0Q29sdW1uLm5hbWVdIDwgYltzb3J0Q29sdW1uLm5hbWVdXG4gICAgICAgICAgICAgICAgICA/IDFcbiAgICAgICAgICAgICAgICAgIDogYVtzb3J0Q29sdW1uLm5hbWVdID09PSBiW3NvcnRDb2x1bW4ubmFtZV0gPyAwIDogLTEsXG4gICAgICAgICAgICApO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIHJldHVybiBzbGljZVN0cmVhbTtcbiAgICAgICAgfSksXG4gICAgICAgIHRhcCgodmFsdWUpID0+IGNvbnNvbGUubG9nKHZhbHVlKSksXG4gICAgICApO1xuICAgIH1cbiAgfVxuXG4gIGNyZWF0ZUNvbHVtbkZyb21BcnJheShhcnI6IEFycmF5PHN0cmluZz4pOiBBcnJheTxWaXJ0dWFsVGFibGVDb2x1bW4+IHtcbiAgICByZXR1cm4gYXJyLm1hcCgoZSkgPT4gKHsgbmFtZTogZSwgc29ydDogbnVsbCB9KSk7XG4gIH1cblxuICBuZ09uRGVzdHJveSgpIHtcbiAgICB0aGlzLl9kZXN0cm95ZWQkLm5leHQoKTtcbiAgfVxufVxuIiwiaW1wb3J0IHsgTmdNb2R1bGUgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IENvbW1vbk1vZHVsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbic7XG5pbXBvcnQgeyBTY3JvbGxEaXNwYXRjaE1vZHVsZSB9IGZyb20gJ0Bhbmd1bGFyL2Nkay9zY3JvbGxpbmcnO1xuaW1wb3J0IHsgVmlydHVhbFRhYmxlQ29tcG9uZW50IH0gZnJvbSAnLi9jb21wb25lbnRzL3ZpcnR1YWwtdGFibGUuY29tcG9uZW50JztcbmltcG9ydCB7IFJlYWN0aXZlRm9ybXNNb2R1bGUgfSBmcm9tICdAYW5ndWxhci9mb3Jtcyc7XG5pbXBvcnQgeyBCcm93c2VyQW5pbWF0aW9uc01vZHVsZSB9IGZyb20gJ0Bhbmd1bGFyL3BsYXRmb3JtLWJyb3dzZXIvYW5pbWF0aW9ucyc7XG5ATmdNb2R1bGUoe1xuICBkZWNsYXJhdGlvbnM6IFtWaXJ0dWFsVGFibGVDb21wb25lbnRdLFxuICBpbXBvcnRzOiBbQ29tbW9uTW9kdWxlLCBSZWFjdGl2ZUZvcm1zTW9kdWxlLCBCcm93c2VyQW5pbWF0aW9uc01vZHVsZSwgU2Nyb2xsRGlzcGF0Y2hNb2R1bGVdLFxuICBleHBvcnRzOiBbVmlydHVhbFRhYmxlQ29tcG9uZW50XSxcbiAgcHJvdmlkZXJzOiBbXSxcbn0pXG5leHBvcnQgY2xhc3MgTmdWaXJ0dWFsVGFibGVNb2R1bGUge31cbiJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7QUFBQSxNQTRCYSxxQkFBcUI7SUFObEM7UUFPVyxjQUFTLEdBQUcsRUFBRSxDQUFDO1FBTXhCLGtCQUFhLEdBQWdCLElBQUksV0FBVyxDQUFDLEVBQUUsQ0FBQyxDQUFDO1FBRXpDLGtCQUFhLEdBQWdCLElBQUksR0FBRyxFQUFFLENBQUM7UUFFeEMsV0FBTSxHQUE4QixFQUFFLENBQUM7UUFFdkMsZ0JBQVcsR0FBd0MsS0FBSyxDQUFDO1FBRXhELFVBQUssR0FBb0IsSUFBSSxPQUFPLEVBQVUsQ0FBQztRQUUvQyxnQkFBVyxHQUFHLElBQUksT0FBTyxFQUFRLENBQUM7UUFFbEMsa0JBQWEsR0FBRyxLQUFLLENBQUM7UUFFdEIsWUFBTyxHQUFHLElBQUksQ0FBQyxhQUFhLENBQUMsWUFBWSxDQUFDLElBQUksQ0FDcEQsWUFBWSxDQUFDLEdBQUcsQ0FBQyxFQUNqQixTQUFTLENBQUMsSUFBSSxDQUFDLEVBQ2Ysb0JBQW9CLEVBQUUsRUFDdEIsU0FBUyxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsQ0FDNUIsQ0FBQztLQXNISDs7Ozs7SUFwSEMsU0FBUyxDQUFDLE1BQWM7UUFDdEIsSUFBSSxDQUFD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