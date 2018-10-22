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
        this.itemCount = 25;
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
    /**
     * @param {?} item
     * @return {?}
     */
    clickItem(item) {
        if (typeof this.onRowClick === 'function')
            this.onRowClick(item);
    }
}
VirtualTableComponent.decorators = [
    { type: Component, args: [{
                selector: 'ng-virtual-table',
                template: "<div class=\"table\">\n  <div class=\"header\">\n    <div *ngFor=\"let headerItem of column\" class=\"header-item\" (click)=\"applySort(headerItem.name)\">{{ headerItem.name\n      }} {{ headerItem.sort }}</div>\n    <input type=\"text\" [formControl]=\"filterControl\">\n  </div>\n  <cdk-virtual-scroll-viewport [itemSize]=\"itemCount\" class=\"virtual-table-content\">\n    <div *cdkVirtualFor=\"let item of _dataStream;templateCacheSize: 0\" class=\"virtual-table-row\" (click)=\"clickItem(item)\">\n      <div *ngFor=\"let headerItem of column\" class=\"virtual-table-column\">{{\n        item[headerItem.name] }}</div>\n    </div>\n  </cdk-virtual-scroll-viewport>\n</div>",
                changeDetection: ChangeDetectionStrategy.OnPush,
                styles: [":host{display:block;position:relative}.table{height:100%;position:relative}.table .header{display:flex;margin-top:8px;height:40px;align-items:center;border-bottom:1px solid #000}.table .header-item{cursor:pointer;margin:0 8px}.table .virtual-table-content,.table .virtual-table-empty{display:flex;flex-direction:column;height:calc(100% - 40px)}.table .virtual-table-row{display:flex;flex-direction:row;min-height:20px;margin:8px 0}.table .virtual-table-column{display:flex;margin:0 8px}"]
            }] }
];
VirtualTableComponent.propDecorators = {
    dataSource: [{ type: Input }],
    headerColumn: [{ type: Input }],
    onRowClick: [{ type: Input }]
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

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmctdmlydHVhbC10YWJsZS5qcy5tYXAiLCJzb3VyY2VzIjpbIm5nOi8vbmctdmlydHVhbC10YWJsZS9zcmMvY29tcG9uZW50cy92aXJ0dWFsLXRhYmxlLmNvbXBvbmVudC50cyIsIm5nOi8vbmctdmlydHVhbC10YWJsZS9zcmMvbmdWaXJ0dWFsVGFibGUubW9kdWxlLnRzIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IENvbXBvbmVudCwgQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3ksIElucHV0LCBTaW1wbGVDaGFuZ2VzIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBPYnNlcnZhYmxlLCBFTVBUWSwgU3ViamVjdCwgY29tYmluZUxhdGVzdCwgb2YgfSBmcm9tICdyeGpzJztcbmltcG9ydCB7XG4gIHRhcCxcbiAgbWFwLFxuICBzdGFydFdpdGgsXG4gIGRlYm91bmNlVGltZSxcbiAgZmlsdGVyLFxuICBkaXN0aW5jdFVudGlsQ2hhbmdlZCxcbiAgdGFrZVVudGlsLFxuICBjYXRjaEVycm9yLFxufSBmcm9tICdyeGpzL29wZXJhdG9ycyc7XG5pbXBvcnQgeyBGb3JtQ29udHJvbCB9IGZyb20gJ0Bhbmd1bGFyL2Zvcm1zJztcbmludGVyZmFjZSBWaXJ0dWFsVGFibGVJdGVtIHtcbiAgW2tleTogc3RyaW5nXTogYW55O1xufVxuXG5pbnRlcmZhY2UgVmlydHVhbFRhYmxlQ29sdW1uIHtcbiAgbmFtZTogc3RyaW5nO1xuICBzb3J0OiAnYXNjJyB8ICdkZXNjJyB8IG51bGw7XG59XG5cbkBDb21wb25lbnQoe1xuICBzZWxlY3RvcjogJ25nLXZpcnR1YWwtdGFibGUnLFxuICB0ZW1wbGF0ZVVybDogJy4vdmlydHVhbC10YWJsZS5jb21wb25lbnQuaHRtbCcsXG4gIHN0eWxlVXJsczogWycuL3ZpcnR1YWwtdGFibGUuY29tcG9uZW50LnNjc3MnXSxcbiAgY2hhbmdlRGV0ZWN0aW9uOiBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneS5PblB1c2gsXG59KVxuZXhwb3J0IGNsYXNzIFZpcnR1YWxUYWJsZUNvbXBvbmVudCB7XG4gIHB1YmxpYyBpdGVtQ291bnQgPSAyNTtcblxuICBASW5wdXQoKSBkYXRhU291cmNlOiBPYnNlcnZhYmxlPEFycmF5PFZpcnR1YWxUYWJsZUl0ZW0+PjtcblxuICBASW5wdXQoKSBoZWFkZXJDb2x1bW46IEFycmF5PHN0cmluZz47XG5cbiAgQElucHV0KCkgb25Sb3dDbGljazogKGl0ZW06IFZpcnR1YWxUYWJsZUl0ZW0pID0+IHZvaWQ7XG5cbiAgZmlsdGVyQ29udHJvbDogRm9ybUNvbnRyb2wgPSBuZXcgRm9ybUNvbnRyb2woJycpO1xuXG4gIHByaXZhdGUgX2hlYWRlckNvbHVtbjogU2V0PHN0cmluZz4gPSBuZXcgU2V0KCk7XG5cbiAgcHVibGljIGNvbHVtbjogQXJyYXk8VmlydHVhbFRhYmxlQ29sdW1uPiA9IFtdO1xuXG4gIHB1YmxpYyBfZGF0YVN0cmVhbTogT2JzZXJ2YWJsZTxBcnJheTxWaXJ0dWFsVGFibGVJdGVtPj4gPSBFTVBUWTtcblxuICBwcml2YXRlIHNvcnQkOiBTdWJqZWN0PHN0cmluZz4gPSBuZXcgU3ViamVjdDxzdHJpbmc+KCk7XG5cbiAgcHJpdmF0ZSBfZGVzdHJveWVkJCA9IG5ldyBTdWJqZWN0PHZvaWQ+KCk7XG5cbiAgcHJpdmF0ZSBfaGVhZGVyV2FzU2V0ID0gZmFsc2U7XG5cbiAgcHJpdmF0ZSBmaWx0ZXIkID0gdGhpcy5maWx0ZXJDb250cm9sLnZhbHVlQ2hhbmdlcy5waXBlKFxuICAgIGRlYm91bmNlVGltZSgzMDApLFxuICAgIHN0YXJ0V2l0aChudWxsKSxcbiAgICBkaXN0aW5jdFVudGlsQ2hhbmdlZCgpLFxuICAgIHRha2VVbnRpbCh0aGlzLl9kZXN0cm95ZWQkKSxcbiAgKTtcblxuICBhcHBseVNvcnQoY29sdW1uOiBzdHJpbmcpIHtcbiAgICB0aGlzLmNvbHVtbiA9IHRoaXMuY29sdW1uLm1hcCgoaXRlbSkgPT4ge1xuICAgICAgaWYgKGl0ZW0ubmFtZSAhPT0gY29sdW1uKSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgLi4uaXRlbSxcbiAgICAgICAgICBzb3J0OiBudWxsLFxuICAgICAgICB9O1xuICAgICAgfVxuXG4gICAgICBpZiAoaXRlbS5zb3J0ID09PSBudWxsKSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgLi4uaXRlbSxcbiAgICAgICAgICBzb3J0OiAnYXNjJyxcbiAgICAgICAgfTtcbiAgICAgIH1cblxuICAgICAgaWYgKGl0ZW0uc29ydCA9PT0gJ2FzYycpIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAuLi5pdGVtLFxuICAgICAgICAgIHNvcnQ6ICdkZXNjJyxcbiAgICAgICAgfTtcbiAgICAgIH1cblxuICAgICAgaWYgKGl0ZW0uc29ydCA9PT0gJ2Rlc2MnKSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgLi4uaXRlbSxcbiAgICAgICAgICBzb3J0OiBudWxsLFxuICAgICAgICB9O1xuICAgICAgfVxuICAgIH0pIGFzIEFycmF5PFZpcnR1YWxUYWJsZUNvbHVtbj47XG4gICAgdGhpcy5zb3J0JC5uZXh0KGNvbHVtbik7XG4gIH1cblxuICBuZ09uQ2hhbmdlcyhjaGFuZ2VzOiBTaW1wbGVDaGFuZ2VzKSB7XG4gICAgaWYgKCdoZWFkZXJDb2x1bW4nIGluIGNoYW5nZXMgJiYgQXJyYXkuaXNBcnJheShjaGFuZ2VzLmhlYWRlckNvbHVtbi5jdXJyZW50VmFsdWUpKSB7XG4gICAgICB0aGlzLmNvbHVtbiA9IHRoaXMuY3JlYXRlQ29sdW1uRnJvbUFycmF5KGNoYW5nZXMuaGVhZGVyQ29sdW1uLmN1cnJlbnRWYWx1ZSk7XG4gICAgICB0aGlzLl9oZWFkZXJXYXNTZXQgPSB0cnVlO1xuICAgIH1cblxuICAgIGlmICgnZGF0YVNvdXJjZScgaW4gY2hhbmdlcykge1xuICAgICAgY29uc3QgbmV3RGF0YVNvdXJjZSA9IGNoYW5nZXMuZGF0YVNvdXJjZS5jdXJyZW50VmFsdWUgYXMgT2JzZXJ2YWJsZTxBcnJheTxWaXJ0dWFsVGFibGVJdGVtPj47XG4gICAgICB0aGlzLl9kYXRhU3RyZWFtID0gY29tYmluZUxhdGVzdChcbiAgICAgICAgdGhpcy5zb3J0JC5hc09ic2VydmFibGUoKS5waXBlKHN0YXJ0V2l0aChudWxsKSksXG4gICAgICAgIGNvbWJpbmVMYXRlc3QoXG4gICAgICAgICAgbmV3RGF0YVNvdXJjZS5waXBlKFxuICAgICAgICAgICAgdGFwKChzdHJlYW06IEFycmF5PFZpcnR1YWxUYWJsZUl0ZW0+KSA9PiB7XG4gICAgICAgICAgICAgIGlmICghdGhpcy5faGVhZGVyV2FzU2V0KSB7XG4gICAgICAgICAgICAgICAgdGhpcy5faGVhZGVyQ29sdW1uLmNsZWFyKCk7XG4gICAgICAgICAgICAgICAgc3RyZWFtLmZvckVhY2goKGUpID0+IE9iamVjdC5rZXlzKGUpLmZvckVhY2goKGtleSkgPT4gdGhpcy5faGVhZGVyQ29sdW1uLmFkZChrZXkpKSk7XG4gICAgICAgICAgICAgICAgdGhpcy5jb2x1bW4gPSB0aGlzLmNyZWF0ZUNvbHVtbkZyb21BcnJheShBcnJheS5mcm9tKHRoaXMuX2hlYWRlckNvbHVtbikpO1xuICAgICAgICAgICAgICAgIHRoaXMuX2hlYWRlcldhc1NldCA9IHRydWU7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pLFxuICAgICAgICAgICAgbWFwKChzdHJlYW0pID0+IHN0cmVhbS5zbGljZSgpKSxcbiAgICAgICAgICApLFxuICAgICAgICAgIHRoaXMuZmlsdGVyJCxcbiAgICAgICAgKS5waXBlKFxuICAgICAgICAgIG1hcCgoW3N0cmVhbSwgZmlsdGVyU3RyaW5nXSkgPT4ge1xuICAgICAgICAgICAgY29uc3Qgc2xpY2VTdHJlYW0gPSBzdHJlYW0uc2xpY2UoKTtcbiAgICAgICAgICAgIGlmICghZmlsdGVyU3RyaW5nKSB7XG4gICAgICAgICAgICAgIHJldHVybiBzbGljZVN0cmVhbTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGNvbnN0IGZpbHRlciA9IGZpbHRlclN0cmluZy50b0xvY2FsZUxvd2VyQ2FzZSgpO1xuXG4gICAgICAgICAgICBjb25zdCBmaWx0ZXJTbGljZVN0cmVhbSA9IHNsaWNlU3RyZWFtLmZpbHRlcigoaXRlbTogVmlydHVhbFRhYmxlSXRlbSkgPT5cbiAgICAgICAgICAgICAgT2JqZWN0LmtleXMoaXRlbSkuc29tZShcbiAgICAgICAgICAgICAgICAoa2V5KSA9PiBpdGVtW2tleV0gJiYgaXRlbVtrZXldLnRvU3RyaW5nKCkudG9Mb2NhbGVMb3dlckNhc2UoKS5pbmRleE9mKGZpbHRlcikgPiAtMSxcbiAgICAgICAgICAgICAgKSxcbiAgICAgICAgICAgICk7XG4gICAgICAgICAgICByZXR1cm4gZmlsdGVyU2xpY2VTdHJlYW07XG4gICAgICAgICAgfSksXG4gICAgICAgICksXG4gICAgICApLnBpcGUoXG4gICAgICAgIG1hcCgoW3NvcnQsIHN0cmVhbV0pID0+IHtcbiAgICAgICAgICBjb25zdCBzbGljZVN0cmVhbSA9IHN0cmVhbS5zbGljZSgpO1xuXG4gICAgICAgICAgY29uc3Qgc29ydENvbHVtbiA9IHRoaXMuY29sdW1uLmZpbmQoKGUpID0+IGUubmFtZSA9PT0gc29ydCk7XG5cbiAgICAgICAgICBpZiAoIXNvcnQgfHwgIXNvcnRDb2x1bW4pIHtcbiAgICAgICAgICAgIHJldHVybiBzbGljZVN0cmVhbTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBpZiAoIXNvcnRDb2x1bW4uc29ydCkge1xuICAgICAgICAgICAgcmV0dXJuIHNsaWNlU3RyZWFtO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIGlmIChzb3J0Q29sdW1uLnNvcnQgPT09ICdhc2MnKSB7XG4gICAgICAgICAgICBzbGljZVN0cmVhbS5zb3J0KFxuICAgICAgICAgICAgICAoYTogVmlydHVhbFRhYmxlSXRlbSwgYjogVmlydHVhbFRhYmxlSXRlbSkgPT5cbiAgICAgICAgICAgICAgICBhW3NvcnRDb2x1bW4ubmFtZV0gPiBiW3NvcnRDb2x1bW4ubmFtZV1cbiAgICAgICAgICAgICAgICAgID8gMVxuICAgICAgICAgICAgICAgICAgOiBhW3NvcnRDb2x1bW4ubmFtZV0gPT09IGJbc29ydENvbHVtbi5uYW1lXSA/IDAgOiAtMSxcbiAgICAgICAgICAgICk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHNsaWNlU3RyZWFtLnNvcnQoXG4gICAgICAgICAgICAgIChhOiBWaXJ0dWFsVGFibGVJdGVtLCBiOiBWaXJ0dWFsVGFibGVJdGVtKSA9PlxuICAgICAgICAgICAgICAgIGFbc29ydENvbHVtbi5uYW1lXSA8IGJbc29ydENvbHVtbi5uYW1lXVxuICAgICAgICAgICAgICAgICAgPyAxXG4gICAgICAgICAgICAgICAgICA6IGFbc29ydENvbHVtbi5uYW1lXSA9PT0gYltzb3J0Q29sdW1uLm5hbWVdID8gMCA6IC0xLFxuICAgICAgICAgICAgKTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICByZXR1cm4gc2xpY2VTdHJlYW07XG4gICAgICAgIH0pLFxuICAgICAgICB0YXAoKHZhbHVlKSA9PiBjb25zb2xlLmxvZyh2YWx1ZSkpLFxuICAgICAgKTtcbiAgICB9XG4gIH1cblxuICBjcmVhdGVDb2x1bW5Gcm9tQXJyYXkoYXJyOiBBcnJheTxzdHJpbmc+KTogQXJyYXk8VmlydHVhbFRhYmxlQ29sdW1uPiB7XG4gICAgcmV0dXJuIGFyci5tYXAoKGUpID0+ICh7IG5hbWU6IGUsIHNvcnQ6IG51bGwgfSkpO1xuICB9XG5cbiAgbmdPbkRlc3Ryb3koKSB7XG4gICAgdGhpcy5fZGVzdHJveWVkJC5uZXh0KCk7XG4gIH1cblxuICBjbGlja0l0ZW0oaXRlbTogVmlydHVhbFRhYmxlSXRlbSkge1xuICAgIGlmICh0eXBlb2YgdGhpcy5vblJvd0NsaWNrID09PSAnZnVuY3Rpb24nKSB0aGlzLm9uUm93Q2xpY2soaXRlbSk7XG4gIH1cbn1cbiIsImltcG9ydCB7IE5nTW9kdWxlIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBDb21tb25Nb2R1bGUgfSBmcm9tICdAYW5ndWxhci9jb21tb24nO1xuaW1wb3J0IHsgU2Nyb2xsRGlzcGF0Y2hNb2R1bGUgfSBmcm9tICdAYW5ndWxhci9jZGsvc2Nyb2xsaW5nJztcbmltcG9ydCB7IFZpcnR1YWxUYWJsZUNvbXBvbmVudCB9IGZyb20gJy4vY29tcG9uZW50cy92aXJ0dWFsLXRhYmxlLmNvbXBvbmVudCc7XG5pbXBvcnQgeyBSZWFjdGl2ZUZvcm1zTW9kdWxlIH0gZnJvbSAnQGFuZ3VsYXIvZm9ybXMnO1xuaW1wb3J0IHsgQnJvd3NlckFuaW1hdGlvbnNNb2R1bGUgfSBmcm9tICdAYW5ndWxhci9wbGF0Zm9ybS1icm93c2VyL2FuaW1hdGlvbnMnO1xuQE5nTW9kdWxlKHtcbiAgZGVjbGFyYXRpb25zOiBbVmlydHVhbFRhYmxlQ29tcG9uZW50XSxcbiAgaW1wb3J0czogW0NvbW1vbk1vZHVsZSwgUmVhY3RpdmVGb3Jtc01vZHVsZSwgQnJvd3NlckFuaW1hdGlvbnNNb2R1bGUsIFNjcm9sbERpc3BhdGNoTW9kdWxlXSxcbiAgZXhwb3J0czogW1ZpcnR1YWxUYWJsZUNvbXBvbmVudF0sXG4gIHByb3ZpZGVyczogW10sXG59KVxuZXhwb3J0IGNsYXNzIE5nVmlydHVhbFRhYmxlTW9kdWxlIHt9XG4iXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7O0FBQUEsTUE0QmEscUJBQXFCO0lBTmxDO1FBT1MsY0FBUyxHQUFHLEVBQUUsQ0FBQztRQVF0QixrQkFBYSxHQUFnQixJQUFJLFdBQVcsQ0FBQyxFQUFFLENBQUMsQ0FBQztRQUV6QyxrQkFBYSxHQUFnQixJQUFJLEdBQUcsRUFBRSxDQUFDO1FBRXhDLFdBQU0sR0FBOEIsRUFBRSxDQUFDO1FBRXZDLGdCQUFXLEdBQXdDLEtBQUssQ0FBQztRQUV4RCxVQUFLLEdBQW9CLElBQUksT0FBTyxFQUFVLENBQUM7UUFFL0MsZ0JBQVcsR0FBRyxJQUFJLE9BQU8sRUFBUSxDQUFDO1FBRWxDLGtCQUFhLEdBQUcsS0FBSyxDQUFDO1FBRXRCLFlBQU8sR0FBRyxJQUFJLENBQUMsYUFBYSxDQUFDLFlB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