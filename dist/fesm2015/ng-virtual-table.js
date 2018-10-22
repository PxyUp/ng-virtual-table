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
class VirtualTableComponent {
    constructor() {
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
    applySort(column) {
        this.column = (/** @type {?} */ (this.column.map((item) => {
            if (item.key !== column) {
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
        if ('config' in changes) {
            this._config = (/** @type {?} */ (changes.config.currentValue));
            this.column = this.createColumnFromArray(this._config.column);
        }
        if ('dataSource' in changes) {
            /** @type {?} */
            const newDataSource = (/** @type {?} */ (changes.dataSource.currentValue));
            this._dataStream = combineLatest(this.sort$.asObservable().pipe(startWith(null)), this.filter$, newDataSource.pipe(tap((stream) => {
                if (!this._headerWasSet) {
                    /** @type {?} */
                    const setOfColumn = new Set();
                    stream.forEach((e) => Object.keys(e).forEach((key) => setOfColumn.add(key)));
                    /** @type {?} */
                    const autoColumnArray = Array.from(setOfColumn);
                    this.column = this.createColumnFromArray(autoColumnArray);
                }
            }))).pipe(map(([sort, filterString, stream]) => {
                /** @type {?} */
                const sliceStream = stream.slice();
                /** @type {?} */
                const sortColumn = this.column.find((e) => e.key === sort);
                if (!sort || !sortColumn) {
                    return [filterString, sliceStream];
                }
                if (!sortColumn.sort) {
                    return [filterString, sliceStream];
                }
                /** @type {?} */
                const _sortColumn = this._headerDict[sort];
                if (sortColumn.sort === 'asc') {
                    sliceStream.sort((a, b) => this.getElement(a, _sortColumn.func) > this.getElement(b, _sortColumn.func)
                        ? 1
                        : this.getElement(a, _sortColumn.func) === this.getElement(b, _sortColumn.func)
                            ? 0
                            : -1);
                }
                else {
                    sliceStream.sort((a, b) => this.getElement(a, _sortColumn.func) < this.getElement(b, _sortColumn.func)
                        ? 1
                        : this.getElement(a, _sortColumn.func) === this.getElement(b, _sortColumn.func)
                            ? 0
                            : -1);
                }
                return [filterString, sliceStream];
            }), map(([filterString, stream]) => {
                console.log(filterString, 'filter');
                console.log(stream);
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
            }), publishBehavior([]), refCount());
            this.isEmptySubject$ = this._dataStream.pipe(map((data) => !data.length));
        }
    }
    /**
     * @param {?} arr
     * @return {?}
     */
    createColumnFromArray(arr) {
        if (!arr || arr.length === 0) {
            return;
        }
        this._headerWasSet = true;
        /** @type {?} */
        const columnArr = arr.map((item) => {
            /** @type {?} */
            let columnItem;
            if (typeof item === 'string') {
                columnItem = this.createColumnFromString(item);
            }
            else {
                columnItem = item;
            }
            if (this._headerDict[columnItem.key]) {
                throw Error(`Column key=${columnItem.key} already declare`);
            }
            this._headerDict[columnItem.key] = columnItem;
            return columnItem;
        });
        return columnArr;
    }
    /**
     * @param {?} item
     * @param {?} func
     * @return {?}
     */
    getElement(item, func) {
        return func.call(this, item);
    }
    /**
     * @param {?} str
     * @return {?}
     */
    createColumnFromString(str) {
        return {
            name: str,
            key: str,
            func: (item) => item[str],
            sort: null,
        };
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
    toggleFilter() {
        this.filterIsOpen = !this.filterIsOpen;
        if (this.filterIsOpen) {
            setTimeout(() => {
                this.inputFilterFocus.nativeElement.focus();
            });
        }
        this.filterControl.setValue('', { emitEvent: !this.filterIsOpen });
    }
}
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

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
class NgVirtualTableModule {
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

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */

export { NgVirtualTableModule, VirtualTableComponent };

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmctdmlydHVhbC10YWJsZS5qcy5tYXAiLCJzb3VyY2VzIjpbIm5nOi8vbmctdmlydHVhbC10YWJsZS9zcmMvY29tcG9uZW50cy92aXJ0dWFsLXRhYmxlLmNvbXBvbmVudC50cyIsIm5nOi8vbmctdmlydHVhbC10YWJsZS9zcmMvbmdWaXJ0dWFsVGFibGUubW9kdWxlLnRzIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7XG4gIENvbXBvbmVudCxcbiAgQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3ksXG4gIElucHV0LFxuICBTaW1wbGVDaGFuZ2VzLFxuICBWaWV3Q2hpbGQsXG4gIEVsZW1lbnRSZWYsXG59IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgT2JzZXJ2YWJsZSwgRU1QVFksIFN1YmplY3QsIGNvbWJpbmVMYXRlc3QsIG9mLCBCZWhhdmlvclN1YmplY3QgfSBmcm9tICdyeGpzJztcbmltcG9ydCB7XG4gIHRhcCxcbiAgbWFwLFxuICBzdGFydFdpdGgsXG4gIGRlYm91bmNlVGltZSxcbiAgZmlsdGVyLFxuICBkaXN0aW5jdFVudGlsQ2hhbmdlZCxcbiAgdGFrZVVudGlsLFxuICBjYXRjaEVycm9yLFxuICBzaGFyZSxcbiAgc2hhcmVSZXBsYXksXG4gIHN3aXRjaE1hcCxcbiAgcHVibGlzaEJlaGF2aW9yLFxuICByZWZDb3VudCxcbn0gZnJvbSAncnhqcy9vcGVyYXRvcnMnO1xuaW1wb3J0IHsgRm9ybUNvbnRyb2wgfSBmcm9tICdAYW5ndWxhci9mb3Jtcyc7XG5pbXBvcnQgeyBWaXJ0dWFsVGFibGVDb25maWcsIFZpcnR1YWxUYWJsZUl0ZW0sIFZpcnR1YWxUYWJsZUNvbHVtbiB9IGZyb20gJy4uL2ludGVyZmFjZXMnO1xuXG5AQ29tcG9uZW50KHtcbiAgc2VsZWN0b3I6ICduZy12aXJ0dWFsLXRhYmxlJyxcbiAgdGVtcGxhdGVVcmw6ICcuL3ZpcnR1YWwtdGFibGUuY29tcG9uZW50Lmh0bWwnLFxuICBzdHlsZVVybHM6IFsnLi92aXJ0dWFsLXRhYmxlLmNvbXBvbmVudC5zY3NzJ10sXG4gIGNoYW5nZURldGVjdGlvbjogQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3kuT25QdXNoLFxufSlcbmV4cG9ydCBjbGFzcyBWaXJ0dWFsVGFibGVDb21wb25lbnQge1xuICBwdWJsaWMgaXRlbUNvdW50ID0gMjU7XG5cbiAgcHJpdmF0ZSBfY29uZmlnOiBWaXJ0dWFsVGFibGVDb25maWc7XG5cbiAgcHVibGljIGZpbHRlcklzT3BlbiA9IGZhbHNlO1xuXG4gIEBWaWV3Q2hpbGQoJ2lucHV0RmlsdGVyRm9jdXMnKSBpbnB1dEZpbHRlckZvY3VzOiBFbGVtZW50UmVmO1xuXG4gIEBJbnB1dCgpIGRhdGFTb3VyY2U6IE9ic2VydmFibGU8QXJyYXk8VmlydHVhbFRhYmxlSXRlbT4+O1xuXG4gIEBJbnB1dCgpIGZpbHRlclBsYWNlaG9sZGVyID0gJ0ZpbHRlcic7XG5cbiAgQElucHV0KCkgY29uZmlnOiBWaXJ0dWFsVGFibGVDb25maWc7XG5cbiAgQElucHV0KCkgb25Sb3dDbGljazogKGl0ZW06IFZpcnR1YWxUYWJsZUl0ZW0pID0+IHZvaWQ7XG5cbiAgZmlsdGVyQ29udHJvbDogRm9ybUNvbnRyb2wgPSBuZXcgRm9ybUNvbnRyb2woJycpO1xuXG4gIHByaXZhdGUgX2hlYWRlckRpY3Q6IHsgW2tleTogc3RyaW5nXTogVmlydHVhbFRhYmxlQ29sdW1uIH0gPSBPYmplY3QuY3JlYXRlKG51bGwpO1xuXG4gIHB1YmxpYyBjb2x1bW46IEFycmF5PFZpcnR1YWxUYWJsZUNvbHVtbj4gPSBbXTtcblxuICBwdWJsaWMgX2RhdGFTdHJlYW06IE9ic2VydmFibGU8QXJyYXk8VmlydHVhbFRhYmxlSXRlbT4+ID0gRU1QVFk7XG5cbiAgcHJpdmF0ZSBzb3J0JDogU3ViamVjdDxzdHJpbmc+ID0gbmV3IFN1YmplY3Q8c3RyaW5nPigpO1xuXG4gIHByaXZhdGUgX2Rlc3Ryb3llZCQgPSBuZXcgU3ViamVjdDx2b2lkPigpO1xuXG4gIHByaXZhdGUgX2hlYWRlcldhc1NldCA9IGZhbHNlO1xuXG4gIHB1YmxpYyBpc0VtcHR5U3ViamVjdCQ6IE9ic2VydmFibGU8Ym9vbGVhbj47XG5cbiAgcHJpdmF0ZSBmaWx0ZXIkID0gdGhpcy5maWx0ZXJDb250cm9sLnZhbHVlQ2hhbmdlcy5waXBlKFxuICAgIGRlYm91bmNlVGltZSgzMDApLFxuICAgIHN0YXJ0V2l0aChudWxsKSxcbiAgICBkaXN0aW5jdFVudGlsQ2hhbmdlZCgpLFxuICAgIHRha2VVbnRpbCh0aGlzLl9kZXN0cm95ZWQkKSxcbiAgKTtcblxuICBhcHBseVNvcnQoY29sdW1uOiBzdHJpbmcpIHtcbiAgICB0aGlzLmNvbHVtbiA9IHRoaXMuY29sdW1uLm1hcCgoaXRlbSkgPT4ge1xuICAgICAgaWYgKGl0ZW0ua2V5ICE9PSBjb2x1bW4pIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAuLi5pdGVtLFxuICAgICAgICAgIHNvcnQ6IG51bGwsXG4gICAgICAgIH07XG4gICAgICB9XG5cbiAgICAgIGlmIChpdGVtLnNvcnQgPT09IG51bGwpIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAuLi5pdGVtLFxuICAgICAgICAgIHNvcnQ6ICdhc2MnLFxuICAgICAgICB9O1xuICAgICAgfVxuXG4gICAgICBpZiAoaXRlbS5zb3J0ID09PSAnYXNjJykge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgIC4uLml0ZW0sXG4gICAgICAgICAgc29ydDogJ2Rlc2MnLFxuICAgICAgICB9O1xuICAgICAgfVxuXG4gICAgICBpZiAoaXRlbS5zb3J0ID09PSAnZGVzYycpIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAuLi5pdGVtLFxuICAgICAgICAgIHNvcnQ6IG51bGwsXG4gICAgICAgIH07XG4gICAgICB9XG4gICAgfSkgYXMgQXJyYXk8VmlydHVhbFRhYmxlQ29sdW1uPjtcbiAgICB0aGlzLnNvcnQkLm5leHQoY29sdW1uKTtcbiAgfVxuXG4gIG5nT25DaGFuZ2VzKGNoYW5nZXM6IFNpbXBsZUNoYW5nZXMpIHtcbiAgICBpZiAoJ2NvbmZpZycgaW4gY2hhbmdlcykge1xuICAgICAgdGhpcy5fY29uZmlnID0gY2hhbmdlcy5jb25maWcuY3VycmVudFZhbHVlIGFzIFZpcnR1YWxUYWJsZUNvbmZpZztcbiAgICAgIHRoaXMuY29sdW1uID0gdGhpcy5jcmVhdGVDb2x1bW5Gcm9tQXJyYXkodGhpcy5fY29uZmlnLmNvbHVtbik7XG4gICAgfVxuXG4gICAgaWYgKCdkYXRhU291cmNlJyBpbiBjaGFuZ2VzKSB7XG4gICAgICBjb25zdCBuZXdEYXRhU291cmNlID0gY2hhbmdlcy5kYXRhU291cmNlLmN1cnJlbnRWYWx1ZSBhcyBPYnNlcnZhYmxlPEFycmF5PFZpcnR1YWxUYWJsZUl0ZW0+PjtcbiAgICAgIHRoaXMuX2RhdGFTdHJlYW0gPSBjb21iaW5lTGF0ZXN0KFxuICAgICAgICB0aGlzLnNvcnQkLmFzT2JzZXJ2YWJsZSgpLnBpcGUoc3RhcnRXaXRoKG51bGwpKSxcbiAgICAgICAgdGhpcy5maWx0ZXIkLFxuICAgICAgICBuZXdEYXRhU291cmNlLnBpcGUoXG4gICAgICAgICAgdGFwKChzdHJlYW06IEFycmF5PFZpcnR1YWxUYWJsZUl0ZW0+KSA9PiB7XG4gICAgICAgICAgICBpZiAoIXRoaXMuX2hlYWRlcldhc1NldCkge1xuICAgICAgICAgICAgICBjb25zdCBzZXRPZkNvbHVtbiA9IG5ldyBTZXQoKTtcbiAgICAgICAgICAgICAgc3RyZWFtLmZvckVhY2goKGUpID0+IE9iamVjdC5rZXlzKGUpLmZvckVhY2goKGtleSkgPT4gc2V0T2ZDb2x1bW4uYWRkKGtleSkpKTtcbiAgICAgICAgICAgICAgY29uc3QgYXV0b0NvbHVtbkFycmF5ID0gQXJyYXkuZnJvbShzZXRPZkNvbHVtbik7XG4gICAgICAgICAgICAgIHRoaXMuY29sdW1uID0gdGhpcy5jcmVhdGVDb2x1bW5Gcm9tQXJyYXkoYXV0b0NvbHVtbkFycmF5KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9KSxcbiAgICAgICAgKSxcbiAgICAgICkucGlwZShcbiAgICAgICAgbWFwKChbc29ydCwgZmlsdGVyU3RyaW5nLCBzdHJlYW1dKSA9PiB7XG4gICAgICAgICAgY29uc3Qgc2xpY2VTdHJlYW0gPSBzdHJlYW0uc2xpY2UoKTtcblxuICAgICAgICAgIGNvbnN0IHNvcnRDb2x1bW4gPSB0aGlzLmNvbHVtbi5maW5kKChlKSA9PiBlLmtleSA9PT0gc29ydCk7XG5cbiAgICAgICAgICBpZiAoIXNvcnQgfHwgIXNvcnRDb2x1bW4pIHtcbiAgICAgICAgICAgIHJldHVybiBbZmlsdGVyU3RyaW5nLCBzbGljZVN0cmVhbV07XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgaWYgKCFzb3J0Q29sdW1uLnNvcnQpIHtcbiAgICAgICAgICAgIHJldHVybiBbZmlsdGVyU3RyaW5nLCBzbGljZVN0cmVhbV07XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgY29uc3QgX3NvcnRDb2x1bW4gPSB0aGlzLl9oZWFkZXJEaWN0W3NvcnRdO1xuXG4gICAgICAgICAgaWYgKHNvcnRDb2x1bW4uc29ydCA9PT0gJ2FzYycpIHtcbiAgICAgICAgICAgIHNsaWNlU3RyZWFtLnNvcnQoXG4gICAgICAgICAgICAgIChhOiBWaXJ0dWFsVGFibGVJdGVtLCBiOiBWaXJ0dWFsVGFibGVJdGVtKSA9PlxuICAgICAgICAgICAgICAgIHRoaXMuZ2V0RWxlbWVudChhLCBfc29ydENvbHVtbi5mdW5jKSA+IHRoaXMuZ2V0RWxlbWVudChiLCBfc29ydENvbHVtbi5mdW5jKVxuICAgICAgICAgICAgICAgICAgPyAxXG4gICAgICAgICAgICAgICAgICA6IHRoaXMuZ2V0RWxlbWVudChhLCBfc29ydENvbHVtbi5mdW5jKSA9PT0gdGhpcy5nZXRFbGVtZW50KGIsIF9zb3J0Q29sdW1uLmZ1bmMpXG4gICAgICAgICAgICAgICAgICAgID8gMFxuICAgICAgICAgICAgICAgICAgICA6IC0xLFxuICAgICAgICAgICAgKTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgc2xpY2VTdHJlYW0uc29ydChcbiAgICAgICAgICAgICAgKGE6IFZpcnR1YWxUYWJsZUl0ZW0sIGI6IFZpcnR1YWxUYWJsZUl0ZW0pID0+XG4gICAgICAgICAgICAgICAgdGhpcy5nZXRFbGVtZW50KGEsIF9zb3J0Q29sdW1uLmZ1bmMpIDwgdGhpcy5nZXRFbGVtZW50KGIsIF9zb3J0Q29sdW1uLmZ1bmMpXG4gICAgICAgICAgICAgICAgICA/IDFcbiAgICAgICAgICAgICAgICAgIDogdGhpcy5nZXRFbGVtZW50KGEsIF9zb3J0Q29sdW1uLmZ1bmMpID09PSB0aGlzLmdldEVsZW1lbnQoYiwgX3NvcnRDb2x1bW4uZnVuYylcbiAgICAgICAgICAgICAgICAgICAgPyAwXG4gICAgICAgICAgICAgICAgICAgIDogLTEsXG4gICAgICAgICAgICApO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIHJldHVybiBbZmlsdGVyU3RyaW5nLCBzbGljZVN0cmVhbV07XG4gICAgICAgIH0pLFxuICAgICAgICBtYXAoKFtmaWx0ZXJTdHJpbmcsIHN0cmVhbV0pID0+IHtcbiAgICAgICAgICBjb25zb2xlLmxvZyhmaWx0ZXJTdHJpbmcsICdmaWx0ZXInKTtcbiAgICAgICAgICBjb25zb2xlLmxvZyhzdHJlYW0pO1xuICAgICAgICAgIGNvbnN0IHNsaWNlU3RyZWFtID0gc3RyZWFtLnNsaWNlKCk7XG4gICAgICAgICAgaWYgKCFmaWx0ZXJTdHJpbmcpIHtcbiAgICAgICAgICAgIHJldHVybiBzbGljZVN0cmVhbTtcbiAgICAgICAgICB9XG4gICAgICAgICAgY29uc3QgZmlsdGVyID0gZmlsdGVyU3RyaW5nLnRvTG9jYWxlTG93ZXJDYXNlKCk7XG5cbiAgICAgICAgICBjb25zdCBmaWx0ZXJTbGljZVN0cmVhbSA9IHNsaWNlU3RyZWFtLmZpbHRlcigoaXRlbTogVmlydHVhbFRhYmxlSXRlbSkgPT5cbiAgICAgICAgICAgIE9iamVjdC5rZXlzKGl0ZW0pLnNvbWUoXG4gICAgICAgICAgICAgIChrZXkpID0+IGl0ZW1ba2V5XSAmJiBpdGVtW2tleV0udG9TdHJpbmcoKS50b0xvY2FsZUxvd2VyQ2FzZSgpLmluZGV4T2YoZmlsdGVyKSA+IC0xLFxuICAgICAgICAgICAgKSxcbiAgICAgICAgICApO1xuICAgICAgICAgIHJldHVybiBmaWx0ZXJTbGljZVN0cmVhbTtcbiAgICAgICAgfSksXG4gICAgICAgIHB1Ymxpc2hCZWhhdmlvcihbXSksXG4gICAgICAgIHJlZkNvdW50KCksXG4gICAgICApO1xuXG4gICAgICB0aGlzLmlzRW1wdHlTdWJqZWN0JCA9IHRoaXMuX2RhdGFTdHJlYW0ucGlwZShtYXAoKGRhdGEpID0+ICFkYXRhLmxlbmd0aCkpO1xuICAgIH1cbiAgfVxuXG4gIGNyZWF0ZUNvbHVtbkZyb21BcnJheShhcnI6IEFycmF5PFZpcnR1YWxUYWJsZUNvbHVtbiB8IHN0cmluZz4pOiBBcnJheTxWaXJ0dWFsVGFibGVDb2x1bW4+IHtcbiAgICBpZiAoIWFyciB8fCBhcnIubGVuZ3RoID09PSAwKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIHRoaXMuX2hlYWRlcldhc1NldCA9IHRydWU7XG4gICAgY29uc3QgY29sdW1uQXJyID0gYXJyLm1hcCgoaXRlbTogVmlydHVhbFRhYmxlQ29sdW1uKSA9PiB7XG4gICAgICBsZXQgY29sdW1uSXRlbTtcbiAgICAgIGlmICh0eXBlb2YgaXRlbSA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgY29sdW1uSXRlbSA9IHRoaXMuY3JlYXRlQ29sdW1uRnJvbVN0cmluZyhpdGVtKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGNvbHVtbkl0ZW0gPSBpdGVtO1xuICAgICAgfVxuICAgICAgaWYgKHRoaXMuX2hlYWRlckRpY3RbY29sdW1uSXRlbS5rZXldKSB7XG4gICAgICAgIHRocm93IEVycm9yKGBDb2x1bW4ga2V5PSR7Y29sdW1uSXRlbS5rZXl9IGFscmVhZHkgZGVjbGFyZWApO1xuICAgICAgfVxuICAgICAgdGhpcy5faGVhZGVyRGljdFtjb2x1bW5JdGVtLmtleV0gPSBjb2x1bW5JdGVtO1xuXG4gICAgICByZXR1cm4gY29sdW1uSXRlbTtcbiAgICB9KTtcbiAgICByZXR1cm4gY29sdW1uQXJyO1xuICB9XG5cbiAgcHJpdmF0ZSBnZXRFbGVtZW50KGl0ZW06IFZpcnR1YWxUYWJsZUl0ZW0sIGZ1bmM6IChpdGVtOiBWaXJ0dWFsVGFibGVJdGVtKSA9PiBhbnkpIHtcbiAgICByZXR1cm4gZnVuYy5jYWxsKHRoaXMsIGl0ZW0pO1xuICB9XG5cbiAgcHJpdmF0ZSBjcmVhdGVDb2x1bW5Gcm9tU3RyaW5nKHN0cjogc3RyaW5nKTogVmlydHVhbFRhYmxlQ29sdW1uIHtcbiAgICByZXR1cm4ge1xuICAgICAgbmFtZTogc3RyLFxuICAgICAga2V5OiBzdHIsXG4gICAgICBmdW5jOiAoaXRlbSkgPT4gaXRlbVtzdHJdLFxuICAgICAgc29ydDogbnVsbCxcbiAgICB9O1xuICB9XG5cbiAgbmdPbkRlc3Ryb3koKSB7XG4gICAgdGhpcy5fZGVzdHJveWVkJC5uZXh0KCk7XG4gIH1cblxuICBjbGlja0l0ZW0oaXRlbTogVmlydHVhbFRhYmxlSXRlbSkge1xuICAgIGlmICh0eXBlb2YgdGhpcy5vblJvd0NsaWNrID09PSAnZnVuY3Rpb24nKSB0aGlzLm9uUm93Q2xpY2soaXRlbSk7XG4gIH1cblxuICB0b2dnbGVGaWx0ZXIoKSB7XG4gICAgdGhpcy5maWx0ZXJJc09wZW4gPSAhdGhpcy5maWx0ZXJJc09wZW47XG4gICAgaWYgKHRoaXMuZmlsdGVySXNPcGVuKSB7XG4gICAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgdGhpcy5pbnB1dEZpbHRlckZvY3VzLm5hdGl2ZUVsZW1lbnQuZm9jdXMoKTtcbiAgICAgIH0pO1xuICAgIH1cbiAgICB0aGlzLmZpbHRlckNvbnRyb2wuc2V0VmFsdWUoJycsIHsgZW1pdEV2ZW50OiAhdGhpcy5maWx0ZXJJc09wZW4gfSk7XG4gIH1cbn1cbiIsImltcG9ydCB7IE5nTW9kdWxlIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBDb21tb25Nb2R1bGUgfSBmcm9tICdAYW5ndWxhci9jb21tb24nO1xuaW1wb3J0IHsgU2Nyb2xsRGlzcGF0Y2hNb2R1bGUgfSBmcm9tICdAYW5ndWxhci9jZGsvc2Nyb2xsaW5nJztcbmltcG9ydCB7IFZpcnR1YWxUYWJsZUNvbXBvbmVudCB9IGZyb20gJy4vY29tcG9uZW50cy92aXJ0dWFsLXRhYmxlLmNvbXBvbmVudCc7XG5pbXBvcnQgeyBSZWFjdGl2ZUZvcm1zTW9kdWxlIH0gZnJvbSAnQGFuZ3VsYXIvZm9ybXMnO1xuaW1wb3J0IHsgQnJvd3NlckFuaW1hdGlvbnNNb2R1bGUgfSBmcm9tICdAYW5ndWxhci9wbGF0Zm9ybS1icm93c2VyL2FuaW1hdGlvbnMnO1xuaW1wb3J0IHsgTWF0SWNvbk1vZHVsZSB9IGZyb20gJ0Bhbmd1bGFyL21hdGVyaWFsL2ljb24nO1xuaW1wb3J0IHsgTWF0Rm9ybUZpZWxkTW9kdWxlIH0gZnJvbSAnQGFuZ3VsYXIvbWF0ZXJpYWwvZm9ybS1maWVsZCc7XG5ATmdNb2R1bGUoe1xuICBkZWNsYXJhdGlvbnM6IFtWaXJ0dWFsVGFibGVDb21wb25lbnRdLFxuICBpbXBvcnRzOiBbXG4gICAgQ29tbW9uTW9kdWxlLFxuICAgIFJlYWN0aXZlRm9ybXNNb2R1bGUsXG4gICAgQnJvd3NlckFuaW1hdGlvbnNNb2R1bGUsXG4gICAgTWF0SWNvbk1vZHVsZSxcbiAgICBNYXRGb3JtRmllbGRNb2R1bGUsXG4gICAgU2Nyb2xsRGlzcGF0Y2hNb2R1bGUsXG4gIF0sXG4gIGV4cG9ydHM6IFtWaXJ0dWFsVGFibGVDb21wb25lbnRdLFxuICBwcm92aWRlcnM6IFtdLFxufSlcbmV4cG9ydCBjbGFzcyBOZ1ZpcnR1YWxUYWJsZU1vZHVsZSB7fVxuIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7O0FBQUEsTUFpQ2EscUJBQXFCO0lBTmxDO1FBT1MsY0FBUyxHQUFHLEVBQUUsQ0FBQztRQUlmLGlCQUFZLEdBQUcsS0FBSyxDQUFDO1FBTW5CLHNCQUFpQixHQUFHLFFBQVEsQ0FBQztRQU10QyxrQkFBYSxHQUFnQixJ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