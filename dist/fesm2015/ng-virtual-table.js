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
        this.filter$ = this.filterControl.valueChanges.pipe(debounceTime(350), startWith(null), distinctUntilChanged(), takeUntil(this._destroyed$));
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
            }))).pipe(debounceTime(50), map(([sort, filterString, stream]) => {
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
                /** @type {?} */
                const sliceStream = stream.slice();
                if (!filterString) {
                    return sliceStream;
                }
                /** @type {?} */
                const filter = filterString.toLocaleLowerCase();
                /** @type {?} */
                const filterSliceStream = sliceStream.filter((item) => this.column.some((e) => this.getElement(item, e.func).toString().toLocaleLowerCase().indexOf(filter) > -1));
                console.log(filterSliceStream);
                return filterSliceStream;
            }), publishBehavior([]), refCount());
            this.isEmptySubject$ = this._dataStream.pipe(map((data) => !data.length), tap((value) => console.log(value)));
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
            const columnItem = this.createColumnFromConfigColumn(item);
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
     * @param {?} item
     * @return {?}
     */
    createColumnFromConfigColumn(item) {
        if (typeof item === 'string') {
            return {
                name: item,
                key: item,
                func: (e) => e[item],
                sort: null,
            };
        }
        if (!item.key) {
            throw Error(`Column key for ${item} must be exist`);
        }
        return {
            name: item.name || item.key,
            key: item.key,
            func: typeof item.func === 'function' ? item.func : (e) => e[item.key],
            sort: item.sort || null,
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

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmctdmlydHVhbC10YWJsZS5qcy5tYXAiLCJzb3VyY2VzIjpbIm5nOi8vbmctdmlydHVhbC10YWJsZS9zcmMvY29tcG9uZW50cy92aXJ0dWFsLXRhYmxlLmNvbXBvbmVudC50cyIsIm5nOi8vbmctdmlydHVhbC10YWJsZS9zcmMvbmdWaXJ0dWFsVGFibGUubW9kdWxlLnRzIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7XG4gIENvbXBvbmVudCxcbiAgQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3ksXG4gIElucHV0LFxuICBTaW1wbGVDaGFuZ2VzLFxuICBWaWV3Q2hpbGQsXG4gIEVsZW1lbnRSZWYsXG59IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgT2JzZXJ2YWJsZSwgRU1QVFksIFN1YmplY3QsIGNvbWJpbmVMYXRlc3QsIG9mLCBCZWhhdmlvclN1YmplY3QgfSBmcm9tICdyeGpzJztcbmltcG9ydCB7XG4gIHRhcCxcbiAgbWFwLFxuICBzdGFydFdpdGgsXG4gIGRlYm91bmNlVGltZSxcbiAgZmlsdGVyLFxuICBkaXN0aW5jdFVudGlsQ2hhbmdlZCxcbiAgdGFrZVVudGlsLFxuICBjYXRjaEVycm9yLFxuICBzaGFyZSxcbiAgc2hhcmVSZXBsYXksXG4gIHN3aXRjaE1hcCxcbiAgcHVibGlzaEJlaGF2aW9yLFxuICByZWZDb3VudCxcbn0gZnJvbSAncnhqcy9vcGVyYXRvcnMnO1xuaW1wb3J0IHsgRm9ybUNvbnRyb2wgfSBmcm9tICdAYW5ndWxhci9mb3Jtcyc7XG5pbXBvcnQgeyBWaXJ0dWFsVGFibGVDb25maWcsIFZpcnR1YWxUYWJsZUl0ZW0sIFZpcnR1YWxUYWJsZUNvbHVtbiB9IGZyb20gJy4uL2ludGVyZmFjZXMnO1xuXG5AQ29tcG9uZW50KHtcbiAgc2VsZWN0b3I6ICduZy12aXJ0dWFsLXRhYmxlJyxcbiAgdGVtcGxhdGVVcmw6ICcuL3ZpcnR1YWwtdGFibGUuY29tcG9uZW50Lmh0bWwnLFxuICBzdHlsZVVybHM6IFsnLi92aXJ0dWFsLXRhYmxlLmNvbXBvbmVudC5zY3NzJ10sXG4gIGNoYW5nZURldGVjdGlvbjogQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3kuT25QdXNoLFxufSlcbmV4cG9ydCBjbGFzcyBWaXJ0dWFsVGFibGVDb21wb25lbnQge1xuICBwdWJsaWMgaXRlbUNvdW50ID0gMjU7XG5cbiAgcHJpdmF0ZSBfY29uZmlnOiBWaXJ0dWFsVGFibGVDb25maWc7XG5cbiAgcHVibGljIGZpbHRlcklzT3BlbiA9IGZhbHNlO1xuXG4gIEBWaWV3Q2hpbGQoJ2lucHV0RmlsdGVyRm9jdXMnKSBpbnB1dEZpbHRlckZvY3VzOiBFbGVtZW50UmVmO1xuXG4gIEBJbnB1dCgpIGRhdGFTb3VyY2U6IE9ic2VydmFibGU8QXJyYXk8VmlydHVhbFRhYmxlSXRlbT4+O1xuXG4gIEBJbnB1dCgpIGZpbHRlclBsYWNlaG9sZGVyID0gJ0ZpbHRlcic7XG5cbiAgQElucHV0KCkgY29uZmlnOiBWaXJ0dWFsVGFibGVDb25maWc7XG5cbiAgQElucHV0KCkgb25Sb3dDbGljazogKGl0ZW06IFZpcnR1YWxUYWJsZUl0ZW0pID0+IHZvaWQ7XG5cbiAgZmlsdGVyQ29udHJvbDogRm9ybUNvbnRyb2wgPSBuZXcgRm9ybUNvbnRyb2woJycpO1xuXG4gIHByaXZhdGUgX2hlYWRlckRpY3Q6IHsgW2tleTogc3RyaW5nXTogVmlydHVhbFRhYmxlQ29sdW1uIH0gPSBPYmplY3QuY3JlYXRlKG51bGwpO1xuXG4gIHB1YmxpYyBjb2x1bW46IEFycmF5PFZpcnR1YWxUYWJsZUNvbHVtbj4gPSBbXTtcblxuICBwdWJsaWMgX2RhdGFTdHJlYW06IE9ic2VydmFibGU8QXJyYXk8VmlydHVhbFRhYmxlSXRlbT4+ID0gRU1QVFk7XG5cbiAgcHJpdmF0ZSBzb3J0JDogU3ViamVjdDxzdHJpbmc+ID0gbmV3IFN1YmplY3Q8c3RyaW5nPigpO1xuXG4gIHByaXZhdGUgX2Rlc3Ryb3llZCQgPSBuZXcgU3ViamVjdDx2b2lkPigpO1xuXG4gIHByaXZhdGUgX2hlYWRlcldhc1NldCA9IGZhbHNlO1xuXG4gIHB1YmxpYyBpc0VtcHR5U3ViamVjdCQ6IE9ic2VydmFibGU8Ym9vbGVhbj47XG5cbiAgcHJpdmF0ZSBmaWx0ZXIkID0gdGhpcy5maWx0ZXJDb250cm9sLnZhbHVlQ2hhbmdlcy5waXBlKFxuICAgIGRlYm91bmNlVGltZSgzNTApLFxuICAgIHN0YXJ0V2l0aChudWxsKSxcbiAgICBkaXN0aW5jdFVudGlsQ2hhbmdlZCgpLFxuICAgIHRha2VVbnRpbCh0aGlzLl9kZXN0cm95ZWQkKSxcbiAgKTtcblxuICBhcHBseVNvcnQoY29sdW1uOiBzdHJpbmcpIHtcbiAgICB0aGlzLmNvbHVtbiA9IHRoaXMuY29sdW1uLm1hcCgoaXRlbSkgPT4ge1xuICAgICAgaWYgKGl0ZW0ua2V5ICE9PSBjb2x1bW4pIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAuLi5pdGVtLFxuICAgICAgICAgIHNvcnQ6IG51bGwsXG4gICAgICAgIH07XG4gICAgICB9XG5cbiAgICAgIGlmIChpdGVtLnNvcnQgPT09IG51bGwpIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAuLi5pdGVtLFxuICAgICAgICAgIHNvcnQ6ICdhc2MnLFxuICAgICAgICB9O1xuICAgICAgfVxuXG4gICAgICBpZiAoaXRlbS5zb3J0ID09PSAnYXNjJykge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgIC4uLml0ZW0sXG4gICAgICAgICAgc29ydDogJ2Rlc2MnLFxuICAgICAgICB9O1xuICAgICAgfVxuXG4gICAgICBpZiAoaXRlbS5zb3J0ID09PSAnZGVzYycpIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAuLi5pdGVtLFxuICAgICAgICAgIHNvcnQ6IG51bGwsXG4gICAgICAgIH07XG4gICAgICB9XG4gICAgfSkgYXMgQXJyYXk8VmlydHVhbFRhYmxlQ29sdW1uPjtcbiAgICB0aGlzLnNvcnQkLm5leHQoY29sdW1uKTtcbiAgfVxuXG4gIG5nT25DaGFuZ2VzKGNoYW5nZXM6IFNpbXBsZUNoYW5nZXMpIHtcbiAgICBpZiAoJ2NvbmZpZycgaW4gY2hhbmdlcykge1xuICAgICAgdGhpcy5fY29uZmlnID0gY2hhbmdlcy5jb25maWcuY3VycmVudFZhbHVlIGFzIFZpcnR1YWxUYWJsZUNvbmZpZztcbiAgICAgIHRoaXMuY29sdW1uID0gdGhpcy5jcmVhdGVDb2x1bW5Gcm9tQXJyYXkodGhpcy5fY29uZmlnLmNvbHVtbik7XG4gICAgfVxuXG4gICAgaWYgKCdkYXRhU291cmNlJyBpbiBjaGFuZ2VzKSB7XG4gICAgICBjb25zdCBuZXdEYXRhU291cmNlID0gY2hhbmdlcy5kYXRhU291cmNlLmN1cnJlbnRWYWx1ZSBhcyBPYnNlcnZhYmxlPEFycmF5PFZpcnR1YWxUYWJsZUl0ZW0+PjtcbiAgICAgIHRoaXMuX2RhdGFTdHJlYW0gPSBjb21iaW5lTGF0ZXN0KFxuICAgICAgICB0aGlzLnNvcnQkLmFzT2JzZXJ2YWJsZSgpLnBpcGUoc3RhcnRXaXRoKG51bGwpKSxcbiAgICAgICAgdGhpcy5maWx0ZXIkLFxuICAgICAgICBuZXdEYXRhU291cmNlLnBpcGUoXG4gICAgICAgICAgdGFwKChzdHJlYW06IEFycmF5PFZpcnR1YWxUYWJsZUl0ZW0+KSA9PiB7XG4gICAgICAgICAgICBpZiAoIXRoaXMuX2hlYWRlcldhc1NldCkge1xuICAgICAgICAgICAgICBjb25zdCBzZXRPZkNvbHVtbiA9IG5ldyBTZXQoKTtcbiAgICAgICAgICAgICAgc3RyZWFtLmZvckVhY2goKGUpID0+IE9iamVjdC5rZXlzKGUpLmZvckVhY2goKGtleSkgPT4gc2V0T2ZDb2x1bW4uYWRkKGtleSkpKTtcbiAgICAgICAgICAgICAgY29uc3QgYXV0b0NvbHVtbkFycmF5ID0gQXJyYXkuZnJvbShzZXRPZkNvbHVtbik7XG4gICAgICAgICAgICAgIHRoaXMuY29sdW1uID0gdGhpcy5jcmVhdGVDb2x1bW5Gcm9tQXJyYXkoYXV0b0NvbHVtbkFycmF5KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9KSxcbiAgICAgICAgKSxcbiAgICAgICkucGlwZShcbiAgICAgICAgZGVib3VuY2VUaW1lKDUwKSxcbiAgICAgICAgbWFwKChbc29ydCwgZmlsdGVyU3RyaW5nLCBzdHJlYW1dKSA9PiB7XG4gICAgICAgICAgY29uc3Qgc2xpY2VTdHJlYW0gPSBzdHJlYW0uc2xpY2UoKTtcblxuICAgICAgICAgIGNvbnN0IHNvcnRDb2x1bW4gPSB0aGlzLmNvbHVtbi5maW5kKChlKSA9PiBlLmtleSA9PT0gc29ydCk7XG5cbiAgICAgICAgICBpZiAoIXNvcnQgfHwgIXNvcnRDb2x1bW4pIHtcbiAgICAgICAgICAgIHJldHVybiBbZmlsdGVyU3RyaW5nLCBzbGljZVN0cmVhbV07XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgaWYgKCFzb3J0Q29sdW1uLnNvcnQpIHtcbiAgICAgICAgICAgIHJldHVybiBbZmlsdGVyU3RyaW5nLCBzbGljZVN0cmVhbV07XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgY29uc3QgX3NvcnRDb2x1bW4gPSB0aGlzLl9oZWFkZXJEaWN0W3NvcnRdO1xuXG4gICAgICAgICAgaWYgKHNvcnRDb2x1bW4uc29ydCA9PT0gJ2FzYycpIHtcbiAgICAgICAgICAgIHNsaWNlU3RyZWFtLnNvcnQoXG4gICAgICAgICAgICAgIChhOiBWaXJ0dWFsVGFibGVJdGVtLCBiOiBWaXJ0dWFsVGFibGVJdGVtKSA9PlxuICAgICAgICAgICAgICAgIHRoaXMuZ2V0RWxlbWVudChhLCBfc29ydENvbHVtbi5mdW5jKSA+IHRoaXMuZ2V0RWxlbWVudChiLCBfc29ydENvbHVtbi5mdW5jKVxuICAgICAgICAgICAgICAgICAgPyAxXG4gICAgICAgICAgICAgICAgICA6IHRoaXMuZ2V0RWxlbWVudChhLCBfc29ydENvbHVtbi5mdW5jKSA9PT0gdGhpcy5nZXRFbGVtZW50KGIsIF9zb3J0Q29sdW1uLmZ1bmMpXG4gICAgICAgICAgICAgICAgICAgID8gMFxuICAgICAgICAgICAgICAgICAgICA6IC0xLFxuICAgICAgICAgICAgKTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgc2xpY2VTdHJlYW0uc29ydChcbiAgICAgICAgICAgICAgKGE6IFZpcnR1YWxUYWJsZUl0ZW0sIGI6IFZpcnR1YWxUYWJsZUl0ZW0pID0+XG4gICAgICAgICAgICAgICAgdGhpcy5nZXRFbGVtZW50KGEsIF9zb3J0Q29sdW1uLmZ1bmMpIDwgdGhpcy5nZXRFbGVtZW50KGIsIF9zb3J0Q29sdW1uLmZ1bmMpXG4gICAgICAgICAgICAgICAgICA/IDFcbiAgICAgICAgICAgICAgICAgIDogdGhpcy5nZXRFbGVtZW50KGEsIF9zb3J0Q29sdW1uLmZ1bmMpID09PSB0aGlzLmdldEVsZW1lbnQoYiwgX3NvcnRDb2x1bW4uZnVuYylcbiAgICAgICAgICAgICAgICAgICAgPyAwXG4gICAgICAgICAgICAgICAgICAgIDogLTEsXG4gICAgICAgICAgICApO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIHJldHVybiBbZmlsdGVyU3RyaW5nLCBzbGljZVN0cmVhbV07XG4gICAgICAgIH0pLFxuICAgICAgICBtYXAoKFtmaWx0ZXJTdHJpbmcsIHN0cmVhbV0pID0+IHtcbiAgICAgICAgICBjb25zdCBzbGljZVN0cmVhbSA9IHN0cmVhbS5zbGljZSgpO1xuICAgICAgICAgIGlmICghZmlsdGVyU3RyaW5nKSB7XG4gICAgICAgICAgICByZXR1cm4gc2xpY2VTdHJlYW07XG4gICAgICAgICAgfVxuICAgICAgICAgIGNvbnN0IGZpbHRlciA9IGZpbHRlclN0cmluZy50b0xvY2FsZUxvd2VyQ2FzZSgpO1xuXG4gICAgICAgICAgY29uc3QgZmlsdGVyU2xpY2VTdHJlYW0gPSBzbGljZVN0cmVhbS5maWx0ZXIoKGl0ZW06IFZpcnR1YWxUYWJsZUl0ZW0pID0+XG4gICAgICAgICAgICB0aGlzLmNvbHVtbi5zb21lKFxuICAgICAgICAgICAgICAoZSkgPT5cbiAgICAgICAgICAgICAgICB0aGlzLmdldEVsZW1lbnQoaXRlbSwgZS5mdW5jKS50b1N0cmluZygpLnRvTG9jYWxlTG93ZXJDYXNlKCkuaW5kZXhPZihmaWx0ZXIpID4gLTEsXG4gICAgICAgICAgICApLFxuICAgICAgICAgICk7XG4gICAgICAgICAgY29uc29sZS5sb2coZmlsdGVyU2xpY2VTdHJlYW0pO1xuICAgICAgICAgIHJldHVybiBmaWx0ZXJTbGljZVN0cmVhbTtcbiAgICAgICAgfSksXG4gICAgICAgIHB1Ymxpc2hCZWhhdmlvcihbXSksXG4gICAgICAgIHJlZkNvdW50KCksXG4gICAgICApO1xuXG4gICAgICB0aGlzLmlzRW1wdHlTdWJqZWN0JCA9IHRoaXMuX2RhdGFTdHJlYW0ucGlwZShcbiAgICAgICAgbWFwKChkYXRhKSA9PiAhZGF0YS5sZW5ndGgpLFxuICAgICAgICB0YXAoKHZhbHVlKSA9PiBjb25zb2xlLmxvZyh2YWx1ZSkpLFxuICAgICAgKTtcbiAgICB9XG4gIH1cblxuICBjcmVhdGVDb2x1bW5Gcm9tQXJyYXkoYXJyOiBBcnJheTxWaXJ0dWFsVGFibGVDb2x1bW4gfCBzdHJpbmc+KTogQXJyYXk8VmlydHVhbFRhYmxlQ29sdW1uPiB7XG4gICAgaWYgKCFhcnIgfHwgYXJyLmxlbmd0aCA9PT0gMCkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICB0aGlzLl9oZWFkZXJXYXNTZXQgPSB0cnVlO1xuICAgIGNvbnN0IGNvbHVtbkFyciA9IGFyci5tYXAoKGl0ZW06IFZpcnR1YWxUYWJsZUNvbHVtbikgPT4ge1xuICAgICAgY29uc3QgY29sdW1uSXRlbSA9IHRoaXMuY3JlYXRlQ29sdW1uRnJvbUNvbmZpZ0NvbHVtbihpdGVtKTtcblxuICAgICAgaWYgKHRoaXMuX2hlYWRlckRpY3RbY29sdW1uSXRlbS5rZXldKSB7XG4gICAgICAgIHRocm93IEVycm9yKGBDb2x1bW4ga2V5PSR7Y29sdW1uSXRlbS5rZXl9IGFscmVhZHkgZGVjbGFyZWApO1xuICAgICAgfVxuICAgICAgdGhpcy5faGVhZGVyRGljdFtjb2x1bW5JdGVtLmtleV0gPSBjb2x1bW5JdGVtO1xuXG4gICAgICByZXR1cm4gY29sdW1uSXRlbTtcbiAgICB9KTtcbiAgICByZXR1cm4gY29sdW1uQXJyO1xuICB9XG5cbiAgcHJpdmF0ZSBnZXRFbGVtZW50KGl0ZW06IFZpcnR1YWxUYWJsZUl0ZW0sIGZ1bmM6IChpdGVtOiBWaXJ0dWFsVGFibGVJdGVtKSA9PiBhbnkpIHtcbiAgICByZXR1cm4gZnVuYy5jYWxsKHRoaXMsIGl0ZW0pO1xuICB9XG5cbiAgcHJpdmF0ZSBjcmVhdGVDb2x1bW5Gcm9tQ29uZmlnQ29sdW1uKGl0ZW06IHN0cmluZyB8IFZpcnR1YWxUYWJsZUNvbHVtbik6IFZpcnR1YWxUYWJsZUNvbHVtbiB7XG4gICAgaWYgKHR5cGVvZiBpdGVtID09PSAnc3RyaW5nJykge1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgbmFtZTogaXRlbSxcbiAgICAgICAga2V5OiBpdGVtLFxuICAgICAgICBmdW5jOiAoZSkgPT4gZVtpdGVtXSxcbiAgICAgICAgc29ydDogbnVsbCxcbiAgICAgIH07XG4gICAgfVxuICAgIGlmICghaXRlbS5rZXkpIHtcbiAgICAgIHRocm93IEVycm9yKGBDb2x1bW4ga2V5IGZvciAke2l0ZW19IG11c3QgYmUgZXhpc3RgKTtcbiAgICB9XG4gICAgcmV0dXJuIHtcbiAgICAgIG5hbWU6IGl0ZW0ubmFtZSB8fCBpdGVtLmtleSxcbiAgICAgIGtleTogaXRlbS5rZXksXG4gICAgICBmdW5jOiB0eXBlb2YgaXRlbS5mdW5jID09PSAnZnVuY3Rpb24nID8gaXRlbS5mdW5jIDogKGUpID0+IGVbaXRlbS5rZXldLFxuICAgICAgc29ydDogaXRlbS5zb3J0IHx8IG51bGwsXG4gICAgfTtcbiAgfVxuXG4gIG5nT25EZXN0cm95KCkge1xuICAgIHRoaXMuX2Rlc3Ryb3llZCQubmV4dCgpO1xuICB9XG5cbiAgY2xpY2tJdGVtKGl0ZW06IFZpcnR1YWxUYWJsZUl0ZW0pIHtcbiAgICBpZiAodHlwZW9mIHRoaXMub25Sb3dDbGljayA9PT0gJ2Z1bmN0aW9uJykgdGhpcy5vblJvd0NsaWNrKGl0ZW0pO1xuICB9XG5cbiAgdG9nZ2xlRmlsdGVyKCkge1xuICAgIHRoaXMuZmlsdGVySXNPcGVuID0gIXRoaXMuZmlsdGVySXNPcGVuO1xuICAgIGlmICh0aGlzLmZpbHRlcklzT3Blbikge1xuICAgICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgIHRoaXMuaW5wdXRGaWx0ZXJGb2N1cy5uYXRpdmVFbGVtZW50LmZvY3VzKCk7XG4gICAgICB9KTtcbiAgICB9XG4gICAgdGhpcy5maWx0ZXJDb250cm9sLnNldFZhbHVlKCcnLCB7IGVtaXRFdmVudDogIXRoaXMuZmlsdGVySXNPcGVuIH0pO1xuICB9XG59XG4iLCJpbXBvcnQgeyBOZ01vZHVsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgQ29tbW9uTW9kdWxlIH0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uJztcbmltcG9ydCB7IFNjcm9sbERpc3BhdGNoTW9kdWxlIH0gZnJvbSAnQGFuZ3VsYXIvY2RrL3Njcm9sbGluZyc7XG5pbXBvcnQgeyBWaXJ0dWFsVGFibGVDb21wb25lbnQgfSBmcm9tICcuL2NvbXBvbmVudHMvdmlydHVhbC10YWJsZS5jb21wb25lbnQnO1xuaW1wb3J0IHsgUmVhY3RpdmVGb3Jtc01vZHVsZSB9IGZyb20gJ0Bhbmd1bGFyL2Zvcm1zJztcbmltcG9ydCB7IEJyb3dzZXJBbmltYXRpb25zTW9kdWxlIH0gZnJvbSAnQGFuZ3VsYXIvcGxhdGZvcm0tYnJvd3Nlci9hbmltYXRpb25zJztcbmltcG9ydCB7IE1hdEljb25Nb2R1bGUgfSBmcm9tICdAYW5ndWxhci9tYXRlcmlhbC9pY29uJztcbmltcG9ydCB7IE1hdEZvcm1GaWVsZE1vZHVsZSB9IGZyb20gJ0Bhbmd1bGFyL21hdGVyaWFsL2Zvcm0tZmllbGQnO1xuQE5nTW9kdWxlKHtcbiAgZGVjbGFyYXRpb25zOiBbVmlydHVhbFRhYmxlQ29tcG9uZW50XSxcbiAgaW1wb3J0czogW1xuICAgIENvbW1vbk1vZHVsZSxcbiAgICBSZWFjdGl2ZUZvcm1zTW9kdWxlLFxuICAgIEJyb3dzZXJBbmltYXRpb25zTW9kdWxlLFxuICAgIE1hdEljb25Nb2R1bGUsXG4gICAgTWF0Rm9ybUZpZWxkTW9kdWxlLFxuICAgIFNjcm9sbERpc3BhdGNoTW9kdWxlLFxuICBdLFxuICBleHBvcnRzOiBbVmlydHVhbFRhYmxlQ29tcG9uZW50XSxcbiAgcHJvdmlkZXJzOiBbXSxcbn0pXG5leHBvcnQgY2xhc3MgTmdWaXJ0dWFsVGFibGVNb2R1bGUge31cbiJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7OztBQUFBLE1BaUNhLHFCQUFxQjtJQU5sQztRQU9TLGNBQVMsR0FBRyxFQUFFLENBQUM7UUFJZixpQkFBWSxHQUFHLEtBQUssQ0FBQztRQU1uQixzQkFBaUIsR0FBRyxRQUFRLENBQUM7UUFNdEMsa0JBQWEsR0FBZ0IsSUFBSSxXQUFXLENBQUMsRUFBRSxDQUFDLENBQUM7UUFFekMsZ0JBQVcsR0FBMEMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUUxRSxXQUFNLEdBQThCLEVBQUUsQ0FBQztRQUV2QyxnQkFBVyxHQUF3QyxLQUFLLENBQUM7UUFFeEQsVUFBSyxHQUFvQixJQUFJLE9BQU8sRUFBVSxDQUFDO1FBRS9DLGdCQUFXLEdBQUcsSUFBSSxPQUFPLEVBQVEsQ0FBQztRQUVsQyxrQkFBYSxHQUFHLEtBQUssQ0FBQztRQUl0QixZQUFPLEdBQUcsSUFBSSxDQUFDLGFBQWEsQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUNwRCxZQUFZLENBQUMsR0FBRyxDQUFDLEVBQ2pCLFNBQVMsQ0FBQyxJQUFJLENBQUMsRUFDZixvQkFBb0IsRUFBRSxFQUN0QixTQUFTLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxDQUM1QixDQUFDO0tBcUxIOzs7OztJQW5MQyxTQUFTLENBQUMsTUFBYztRQUN0QixJQUFJLENBQUMsTUFBTSxzQkFBRyxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUk7WUFDakMsSUFBSSxJQUFJLENBQUMsR0FBRyxLQUFLLE1BQU0sRUFBRTtnQkFDdkIseUJBQ0ssSUFBSSxJQUNQLElBQUks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