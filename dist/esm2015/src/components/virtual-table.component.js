/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
import { Component, ChangeDetectionStrategy, Input, ViewChild, ElementRef, } from '@angular/core';
import { Observable, EMPTY, Subject, combineLatest } from 'rxjs';
import { tap, map, startWith, debounceTime, distinctUntilChanged, takeUntil, publishBehavior, refCount, } from 'rxjs/operators';
import { FormControl } from '@angular/forms';
export class VirtualTableComponent {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidmlydHVhbC10YWJsZS5jb21wb25lbnQuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9uZy12aXJ0dWFsLXRhYmxlLyIsInNvdXJjZXMiOlsic3JjL2NvbXBvbmVudHMvdmlydHVhbC10YWJsZS5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7OztBQUFBLE9BQU8sRUFDTCxTQUFTLEVBQ1QsdUJBQXVCLEVBQ3ZCLEtBQUssRUFFTCxTQUFTLEVBQ1QsVUFBVSxHQUNYLE1BQU0sZUFBZSxDQUFDO0FBQ3ZCLE9BQU8sRUFBRSxVQUFVLEVBQUUsS0FBSyxFQUFFLE9BQU8sRUFBRSxhQUFhLEVBQXVCLE1BQU0sTUFBTSxDQUFDO0FBQ3RGLE9BQU8sRUFDTCxHQUFHLEVBQ0gsR0FBRyxFQUNILFNBQVMsRUFDVCxZQUFZLEVBRVosb0JBQW9CLEVBQ3BCLFNBQVMsRUFLVCxlQUFlLEVBQ2YsUUFBUSxHQUNULE1BQU0sZ0JBQWdCLENBQUM7QUFDeEIsT0FBTyxFQUFFLFdBQVcsRUFBRSxNQUFNLGdCQUFnQixDQUFDO0FBUzdDLE1BQU0sT0FBTyxxQkFBcUI7SUFObEM7UUFPUyxjQUFTLEdBQUcsRUFBRSxDQUFDO1FBSWYsaUJBQVksR0FBRyxLQUFLLENBQUM7UUFNbkIsc0JBQWlCLEdBQUcsUUFBUSxDQUFDO1FBTXRDLGtCQUFhLEdBQWdCLElBQUksV0FBVyxDQUFDLEVBQUUsQ0FBQyxDQUFDO1FBRXpDLGdCQUFXLEdBQTBDLE1BQU0sQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUM7UUFFMUUsV0FBTSxHQUE4QixFQUFFLENBQUM7UUFFdkMsZ0JBQVcsR0FBd0MsS0FBSyxDQUFDO1FBRXhELFVBQUssR0FBb0IsSUFBSSxPQUFPLEVBQVUsQ0FBQztRQUUvQyxnQkFBVyxHQUFHLElBQUksT0FBTyxFQUFRLENBQUM7UUFFbEMsa0JBQWEsR0FBRyxLQUFLLENBQUM7UUFJdEIsWUFBTyxHQUFHLElBQUksQ0FBQyxhQUFhLENBQUMsWUFBWSxDQUFDLElBQUks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N0MsZUFBZSxFQUFFLHVCQUF1QixDQUFDLE1BQU07O2FBQ2hEOzs7K0JBUUUsU0FBUyxTQUFDLGtCQUFrQjt5QkFFNUIsS0FBSztnQ0FFTCxLQUFLO3FCQUVMLEtBQUs7eUJBRUwsS0FBSzs7OztJQWROLDBDQUFzQjs7SUFFdEIsd0NBQW9DOztJQUVwQyw2Q0FBNEI7O0lBRTVCLGlEQUE0RDs7SUFFNUQsMkNBQXlEOztJQUV6RCxrREFBc0M7O0lBRXRDLHVDQUFvQzs7SUFFcEMsMkNBQXNEOztJQUV0RCw4Q0FBaUQ7O0lBRWpELDRDQUFpRjs7SUFFakYsdUNBQThDOztJQUU5Qyw0Q0FBZ0U7O0lBRWhFLHNDQUF1RDs7SUFFdkQsNENBQTBDOztJQUUxQyw4Q0FBOEI7O0lBRTlCLGdEQUE0Qzs7SUFFNUMsd0NBS0UiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge1xuICBDb21wb25lbnQsXG4gIENoYW5nZURldGVjdGlvblN0cmF0ZWd5LFxuICBJbnB1dCxcbiAgU2ltcGxlQ2hhbmdlcyxcbiAgVmlld0NoaWxkLFxuICBFbGVtZW50UmVmLFxufSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IE9ic2VydmFibGUsIEVNUFRZLCBTdWJqZWN0LCBjb21iaW5lTGF0ZXN0LCBvZiwgQmVoYXZpb3JTdWJqZWN0IH0gZnJvbSAncnhqcyc7XG5pbXBvcnQge1xuICB0YXAsXG4gIG1hcCxcbiAgc3RhcnRXaXRoLFxuICBkZWJvdW5jZVRpbWUsXG4gIGZpbHRlcixcbiAgZGlzdGluY3RVbnRpbENoYW5nZWQsXG4gIHRha2VVbnRpbCxcbiAgY2F0Y2hFcnJvcixcbiAgc2hhcmUsXG4gIHNoYXJlUmVwbGF5LFxuICBzd2l0Y2hNYXAsXG4gIHB1Ymxpc2hCZWhhdmlvcixcbiAgcmVmQ291bnQsXG59IGZyb20gJ3J4anMvb3BlcmF0b3JzJztcbmltcG9ydCB7IEZvcm1Db250cm9sIH0gZnJvbSAnQGFuZ3VsYXIvZm9ybXMnO1xuaW1wb3J0IHsgVmlydHVhbFRhYmxlQ29uZmlnLCBWaXJ0dWFsVGFibGVJdGVtLCBWaXJ0dWFsVGFibGVDb2x1bW4gfSBmcm9tICcuLi9pbnRlcmZhY2VzJztcblxuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAnbmctdmlydHVhbC10YWJsZScsXG4gIHRlbXBsYXRlVXJsOiAnLi92aXJ0dWFsLXRhYmxlLmNvbXBvbmVudC5odG1sJyxcbiAgc3R5bGVVcmxzOiBbJy4vdmlydHVhbC10YWJsZS5jb21wb25lbnQuc2NzcyddLFxuICBjaGFuZ2VEZXRlY3Rpb246IENoYW5nZURldGVjdGlvblN0cmF0ZWd5Lk9uUHVzaCxcbn0pXG5leHBvcnQgY2xhc3MgVmlydHVhbFRhYmxlQ29tcG9uZW50IHtcbiAgcHVibGljIGl0ZW1Db3VudCA9IDI1O1xuXG4gIHByaXZhdGUgX2NvbmZpZzogVmlydHVhbFRhYmxlQ29uZmlnO1xuXG4gIHB1YmxpYyBmaWx0ZXJJc09wZW4gPSBmYWxzZTtcblxuICBAVmlld0NoaWxkKCdpbnB1dEZpbHRlckZvY3VzJykgaW5wdXRGaWx0ZXJGb2N1czogRWxlbWVudFJlZjtcblxuICBASW5wdXQoKSBkYXRhU291cmNlOiBPYnNlcnZhYmxlPEFycmF5PFZpcnR1YWxUYWJsZUl0ZW0+PjtcblxuICBASW5wdXQoKSBmaWx0ZXJQbGFjZWhvbGRlciA9ICdGaWx0ZXInO1xuXG4gIEBJbnB1dCgpIGNvbmZpZzogVmlydHVhbFRhYmxlQ29uZmlnO1xuXG4gIEBJbnB1dCgpIG9uUm93Q2xpY2s6IChpdGVtOiBWaXJ0dWFsVGFibGVJdGVtKSA9PiB2b2lkO1xuXG4gIGZpbHRlckNvbnRyb2w6IEZvcm1Db250cm9sID0gbmV3IEZvcm1Db250cm9sKCcnKTtcblxuICBwcml2YXRlIF9oZWFkZXJEaWN0OiB7IFtrZXk6IHN0cmluZ106IFZpcnR1YWxUYWJsZUNvbHVtbiB9ID0gT2JqZWN0LmNyZWF0ZShudWxsKTtcblxuICBwdWJsaWMgY29sdW1uOiBBcnJheTxWaXJ0dWFsVGFibGVDb2x1bW4+ID0gW107XG5cbiAgcHVibGljIF9kYXRhU3RyZWFtOiBPYnNlcnZhYmxlPEFycmF5PFZpcnR1YWxUYWJsZUl0ZW0+PiA9IEVNUFRZO1xuXG4gIHByaXZhdGUgc29ydCQ6IFN1YmplY3Q8c3RyaW5nPiA9IG5ldyBTdWJqZWN0PHN0cmluZz4oKTtcblxuICBwcml2YXRlIF9kZXN0cm95ZWQkID0gbmV3IFN1YmplY3Q8dm9pZD4oKTtcblxuICBwcml2YXRlIF9oZWFkZXJXYXNTZXQgPSBmYWxzZTtcblxuICBwdWJsaWMgaXNFbXB0eVN1YmplY3QkOiBPYnNlcnZhYmxlPGJvb2xlYW4+O1xuXG4gIHByaXZhdGUgZmlsdGVyJCA9IHRoaXMuZmlsdGVyQ29udHJvbC52YWx1ZUNoYW5nZXMucGlwZShcbiAgICBkZWJvdW5jZVRpbWUoMzUwKSxcbiAgICBzdGFydFdpdGgobnVsbCksXG4gICAgZGlzdGluY3RVbnRpbENoYW5nZWQoKSxcbiAgICB0YWtlVW50aWwodGhpcy5fZGVzdHJveWVkJCksXG4gICk7XG5cbiAgYXBwbHlTb3J0KGNvbHVtbjogc3RyaW5nKSB7XG4gICAgdGhpcy5jb2x1bW4gPSB0aGlzLmNvbHVtbi5tYXAoKGl0ZW0pID0+IHtcbiAgICAgIGlmIChpdGVtLmtleSAhPT0gY29sdW1uKSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgLi4uaXRlbSxcbiAgICAgICAgICBzb3J0OiBudWxsLFxuICAgICAgICB9O1xuICAgICAgfVxuXG4gICAgICBpZiAoaXRlbS5zb3J0ID09PSBudWxsKSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgLi4uaXRlbSxcbiAgICAgICAgICBzb3J0OiAnYXNjJyxcbiAgICAgICAgfTtcbiAgICAgIH1cblxuICAgICAgaWYgKGl0ZW0uc29ydCA9PT0gJ2FzYycpIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAuLi5pdGVtLFxuICAgICAgICAgIHNvcnQ6ICdkZXNjJyxcbiAgICAgICAgfTtcbiAgICAgIH1cblxuICAgICAgaWYgKGl0ZW0uc29ydCA9PT0gJ2Rlc2MnKSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgLi4uaXRlbSxcbiAgICAgICAgICBzb3J0OiBudWxsLFxuICAgICAgICB9O1xuICAgICAgfVxuICAgIH0pIGFzIEFycmF5PFZpcnR1YWxUYWJsZUNvbHVtbj47XG4gICAgdGhpcy5zb3J0JC5uZXh0KGNvbHVtbik7XG4gIH1cblxuICBuZ09uQ2hhbmdlcyhjaGFuZ2VzOiBTaW1wbGVDaGFuZ2VzKSB7XG4gICAgaWYgKCdjb25maWcnIGluIGNoYW5nZXMpIHtcbiAgICAgIHRoaXMuX2NvbmZpZyA9IGNoYW5nZXMuY29uZmlnLmN1cnJlbnRWYWx1ZSBhcyBWaXJ0dWFsVGFibGVDb25maWc7XG4gICAgICB0aGlzLmNvbHVtbiA9IHRoaXMuY3JlYXRlQ29sdW1uRnJvbUFycmF5KHRoaXMuX2NvbmZpZy5jb2x1bW4pO1xuICAgIH1cblxuICAgIGlmICgnZGF0YVNvdXJjZScgaW4gY2hhbmdlcykge1xuICAgICAgY29uc3QgbmV3RGF0YVNvdXJjZSA9IGNoYW5nZXMuZGF0YVNvdXJjZS5jdXJyZW50VmFsdWUgYXMgT2JzZXJ2YWJsZTxBcnJheTxWaXJ0dWFsVGFibGVJdGVtPj47XG4gICAgICB0aGlzLl9kYXRhU3RyZWFtID0gY29tYmluZUxhdGVzdChcbiAgICAgICAgdGhpcy5zb3J0JC5hc09ic2VydmFibGUoKS5waXBlKHN0YXJ0V2l0aChudWxsKSksXG4gICAgICAgIHRoaXMuZmlsdGVyJCxcbiAgICAgICAgbmV3RGF0YVNvdXJjZS5waXBlKFxuICAgICAgICAgIHRhcCgoc3RyZWFtOiBBcnJheTxWaXJ0dWFsVGFibGVJdGVtPikgPT4ge1xuICAgICAgICAgICAgaWYgKCF0aGlzLl9oZWFkZXJXYXNTZXQpIHtcbiAgICAgICAgICAgICAgY29uc3Qgc2V0T2ZDb2x1bW4gPSBuZXcgU2V0KCk7XG4gICAgICAgICAgICAgIHN0cmVhbS5mb3JFYWNoKChlKSA9PiBPYmplY3Qua2V5cyhlKS5mb3JFYWNoKChrZXkpID0+IHNldE9mQ29sdW1uLmFkZChrZXkpKSk7XG4gICAgICAgICAgICAgIGNvbnN0IGF1dG9Db2x1bW5BcnJheSA9IEFycmF5LmZyb20oc2V0T2ZDb2x1bW4pO1xuICAgICAgICAgICAgICB0aGlzLmNvbHVtbiA9IHRoaXMuY3JlYXRlQ29sdW1uRnJvbUFycmF5KGF1dG9Db2x1bW5BcnJheSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSksXG4gICAgICAgICksXG4gICAgICApLnBpcGUoXG4gICAgICAgIGRlYm91bmNlVGltZSg1MCksXG4gICAgICAgIG1hcCgoW3NvcnQsIGZpbHRlclN0cmluZywgc3RyZWFtXSkgPT4ge1xuICAgICAgICAgIGNvbnN0IHNsaWNlU3RyZWFtID0gc3RyZWFtLnNsaWNlKCk7XG5cbiAgICAgICAgICBjb25zdCBzb3J0Q29sdW1uID0gdGhpcy5jb2x1bW4uZmluZCgoZSkgPT4gZS5rZXkgPT09IHNvcnQpO1xuXG4gICAgICAgICAgaWYgKCFzb3J0IHx8ICFzb3J0Q29sdW1uKSB7XG4gICAgICAgICAgICByZXR1cm4gW2ZpbHRlclN0cmluZywgc2xpY2VTdHJlYW1dO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIGlmICghc29ydENvbHVtbi5zb3J0KSB7XG4gICAgICAgICAgICByZXR1cm4gW2ZpbHRlclN0cmluZywgc2xpY2VTdHJlYW1dO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIGNvbnN0IF9zb3J0Q29sdW1uID0gdGhpcy5faGVhZGVyRGljdFtzb3J0XTtcblxuICAgICAgICAgIGlmIChzb3J0Q29sdW1uLnNvcnQgPT09ICdhc2MnKSB7XG4gICAgICAgICAgICBzbGljZVN0cmVhbS5zb3J0KFxuICAgICAgICAgICAgICAoYTogVmlydHVhbFRhYmxlSXRlbSwgYjogVmlydHVhbFRhYmxlSXRlbSkgPT5cbiAgICAgICAgICAgICAgICB0aGlzLmdldEVsZW1lbnQoYSwgX3NvcnRDb2x1bW4uZnVuYykgPiB0aGlzLmdldEVsZW1lbnQoYiwgX3NvcnRDb2x1bW4uZnVuYylcbiAgICAgICAgICAgICAgICAgID8gMVxuICAgICAgICAgICAgICAgICAgOiB0aGlzLmdldEVsZW1lbnQoYSwgX3NvcnRDb2x1bW4uZnVuYykgPT09IHRoaXMuZ2V0RWxlbWVudChiLCBfc29ydENvbHVtbi5mdW5jKVxuICAgICAgICAgICAgICAgICAgICA/IDBcbiAgICAgICAgICAgICAgICAgICAgOiAtMSxcbiAgICAgICAgICAgICk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHNsaWNlU3RyZWFtLnNvcnQoXG4gICAgICAgICAgICAgIChhOiBWaXJ0dWFsVGFibGVJdGVtLCBiOiBWaXJ0dWFsVGFibGVJdGVtKSA9PlxuICAgICAgICAgICAgICAgIHRoaXMuZ2V0RWxlbWVudChhLCBfc29ydENvbHVtbi5mdW5jKSA8IHRoaXMuZ2V0RWxlbWVudChiLCBfc29ydENvbHVtbi5mdW5jKVxuICAgICAgICAgICAgICAgICAgPyAxXG4gICAgICAgICAgICAgICAgICA6IHRoaXMuZ2V0RWxlbWVudChhLCBfc29ydENvbHVtbi5mdW5jKSA9PT0gdGhpcy5nZXRFbGVtZW50KGIsIF9zb3J0Q29sdW1uLmZ1bmMpXG4gICAgICAgICAgICAgICAgICAgID8gMFxuICAgICAgICAgICAgICAgICAgICA6IC0xLFxuICAgICAgICAgICAgKTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICByZXR1cm4gW2ZpbHRlclN0cmluZywgc2xpY2VTdHJlYW1dO1xuICAgICAgICB9KSxcbiAgICAgICAgbWFwKChbZmlsdGVyU3RyaW5nLCBzdHJlYW1dKSA9PiB7XG4gICAgICAgICAgY29uc3Qgc2xpY2VTdHJlYW0gPSBzdHJlYW0uc2xpY2UoKTtcbiAgICAgICAgICBpZiAoIWZpbHRlclN0cmluZykge1xuICAgICAgICAgICAgcmV0dXJuIHNsaWNlU3RyZWFtO1xuICAgICAgICAgIH1cbiAgICAgICAgICBjb25zdCBmaWx0ZXIgPSBmaWx0ZXJTdHJpbmcudG9Mb2NhbGVMb3dlckNhc2UoKTtcblxuICAgICAgICAgIGNvbnN0IGZpbHRlclNsaWNlU3RyZWFtID0gc2xpY2VTdHJlYW0uZmlsdGVyKChpdGVtOiBWaXJ0dWFsVGFibGVJdGVtKSA9PlxuICAgICAgICAgICAgdGhpcy5jb2x1bW4uc29tZShcbiAgICAgICAgICAgICAgKGUpID0+XG4gICAgICAgICAgICAgICAgdGhpcy5nZXRFbGVtZW50KGl0ZW0sIGUuZnVuYykudG9TdHJpbmcoKS50b0xvY2FsZUxvd2VyQ2FzZSgpLmluZGV4T2YoZmlsdGVyKSA+IC0xLFxuICAgICAgICAgICAgKSxcbiAgICAgICAgICApO1xuICAgICAgICAgIGNvbnNvbGUubG9nKGZpbHRlclNsaWNlU3RyZWFtKTtcbiAgICAgICAgICByZXR1cm4gZmlsdGVyU2xpY2VTdHJlYW07XG4gICAgICAgIH0pLFxuICAgICAgICBwdWJsaXNoQmVoYXZpb3IoW10pLFxuICAgICAgICByZWZDb3VudCgpLFxuICAgICAgKTtcblxuICAgICAgdGhpcy5pc0VtcHR5U3ViamVjdCQgPSB0aGlzLl9kYXRhU3RyZWFtLnBpcGUoXG4gICAgICAgIG1hcCgoZGF0YSkgPT4gIWRhdGEubGVuZ3RoKSxcbiAgICAgICAgdGFwKCh2YWx1ZSkgPT4gY29uc29sZS5sb2codmFsdWUpKSxcbiAgICAgICk7XG4gICAgfVxuICB9XG5cbiAgY3JlYXRlQ29sdW1uRnJvbUFycmF5KGFycjogQXJyYXk8VmlydHVhbFRhYmxlQ29sdW1uIHwgc3RyaW5nPik6IEFycmF5PFZpcnR1YWxUYWJsZUNvbHVtbj4ge1xuICAgIGlmICghYXJyIHx8IGFyci5sZW5ndGggPT09IDApIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgdGhpcy5faGVhZGVyV2FzU2V0ID0gdHJ1ZTtcbiAgICBjb25zdCBjb2x1bW5BcnIgPSBhcnIubWFwKChpdGVtOiBWaXJ0dWFsVGFibGVDb2x1bW4pID0+IHtcbiAgICAgIGNvbnN0IGNvbHVtbkl0ZW0gPSB0aGlzLmNyZWF0ZUNvbHVtbkZyb21Db25maWdDb2x1bW4oaXRlbSk7XG5cbiAgICAgIGlmICh0aGlzLl9oZWFkZXJEaWN0W2NvbHVtbkl0ZW0ua2V5XSkge1xuICAgICAgICB0aHJvdyBFcnJvcihgQ29sdW1uIGtleT0ke2NvbHVtbkl0ZW0ua2V5fSBhbHJlYWR5IGRlY2xhcmVgKTtcbiAgICAgIH1cbiAgICAgIHRoaXMuX2hlYWRlckRpY3RbY29sdW1uSXRlbS5rZXldID0gY29sdW1uSXRlbTtcblxuICAgICAgcmV0dXJuIGNvbHVtbkl0ZW07XG4gICAgfSk7XG4gICAgcmV0dXJuIGNvbHVtbkFycjtcbiAgfVxuXG4gIHByaXZhdGUgZ2V0RWxlbWVudChpdGVtOiBWaXJ0dWFsVGFibGVJdGVtLCBmdW5jOiAoaXRlbTogVmlydHVhbFRhYmxlSXRlbSkgPT4gYW55KSB7XG4gICAgcmV0dXJuIGZ1bmMuY2FsbCh0aGlzLCBpdGVtKTtcbiAgfVxuXG4gIHByaXZhdGUgY3JlYXRlQ29sdW1uRnJvbUNvbmZpZ0NvbHVtbihpdGVtOiBzdHJpbmcgfCBWaXJ0dWFsVGFibGVDb2x1bW4pOiBWaXJ0dWFsVGFibGVDb2x1bW4ge1xuICAgIGlmICh0eXBlb2YgaXRlbSA9PT0gJ3N0cmluZycpIHtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIG5hbWU6IGl0ZW0sXG4gICAgICAgIGtleTogaXRlbSxcbiAgICAgICAgZnVuYzogKGUpID0+IGVbaXRlbV0sXG4gICAgICAgIHNvcnQ6IG51bGwsXG4gICAgICB9O1xuICAgIH1cbiAgICBpZiAoIWl0ZW0ua2V5KSB7XG4gICAgICB0aHJvdyBFcnJvcihgQ29sdW1uIGtleSBmb3IgJHtpdGVtfSBtdXN0IGJlIGV4aXN0YCk7XG4gICAgfVxuICAgIHJldHVybiB7XG4gICAgICBuYW1lOiBpdGVtLm5hbWUgfHwgaXRlbS5rZXksXG4gICAgICBrZXk6IGl0ZW0ua2V5LFxuICAgICAgZnVuYzogdHlwZW9mIGl0ZW0uZnVuYyA9PT0gJ2Z1bmN0aW9uJyA/IGl0ZW0uZnVuYyA6IChlKSA9PiBlW2l0ZW0ua2V5XSxcbiAgICAgIHNvcnQ6IGl0ZW0uc29ydCB8fCBudWxsLFxuICAgIH07XG4gIH1cblxuICBuZ09uRGVzdHJveSgpIHtcbiAgICB0aGlzLl9kZXN0cm95ZWQkLm5leHQoKTtcbiAgfVxuXG4gIGNsaWNrSXRlbShpdGVtOiBWaXJ0dWFsVGFibGVJdGVtKSB7XG4gICAgaWYgKHR5cGVvZiB0aGlzLm9uUm93Q2xpY2sgPT09ICdmdW5jdGlvbicpIHRoaXMub25Sb3dDbGljayhpdGVtKTtcbiAgfVxuXG4gIHRvZ2dsZUZpbHRlcigpIHtcbiAgICB0aGlzLmZpbHRlcklzT3BlbiA9ICF0aGlzLmZpbHRlcklzT3BlbjtcbiAgICBpZiAodGhpcy5maWx0ZXJJc09wZW4pIHtcbiAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICB0aGlzLmlucHV0RmlsdGVyRm9jdXMubmF0aXZlRWxlbWVudC5mb2N1cygpO1xuICAgICAgfSk7XG4gICAgfVxuICAgIHRoaXMuZmlsdGVyQ29udHJvbC5zZXRWYWx1ZSgnJywgeyBlbWl0RXZlbnQ6ICF0aGlzLmZpbHRlcklzT3BlbiB9KTtcbiAgfVxufVxuIl19