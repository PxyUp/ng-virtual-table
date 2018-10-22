/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
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
export class VirtualTableComponent {
    constructor() {
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
                styles: [":host{display:block;position:relative}.table{height:100%;position:relative}.table .header{display:flex;margin-top:8px;height:40px;align-items:center;border-bottom:1px solid #000}.table .header-item{cursor:pointer;margin:0 8px}.table .virtual-table-content,.table .virtual-table-empty{display:flex;flex-direction:column;height:calc(100% - 40px)}.table .virtual-table-row{display:flex;flex-direction:row;min-height:20px;margin:8px 0}.table .virtual-table-column{display:flex;margin:0 8px}"]
            }] }
];
VirtualTableComponent.propDecorators = {
    dataSource: [{ type: Input }],
    headerColumn: [{ type: Input }]
};
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidmlydHVhbC10YWJsZS5jb21wb25lbnQuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9uZy12aXJ0dWFsLXRhYmxlLyIsInNvdXJjZXMiOlsic3JjL2NvbXBvbmVudHMvdmlydHVhbC10YWJsZS5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7OztBQUFBLE9BQU8sRUFBRSxTQUFTLEVBQUUsdUJBQXVCLEVBQUUsS0FBSyxFQUFpQixNQUFNLGVBQWUsQ0FBQztBQUN6RixPQUFPLEVBQUUsVUFBVSxFQUFFLEtBQUssRUFBRSxPQUFPLEVBQUUsYUFBYSxFQUFNLE1BQU0sTUFBTSxDQUFDO0FBQ3JFLE9BQU8sRUFDTCxHQUFHLEVBQ0gsR0FBRyxFQUNILFNBQVMsRUFDVCxZQUFZLEVBRVosb0JBQW9CLEVBQ3BCLFNBQVMsR0FFVixNQUFNLGdCQUFnQixDQUFDO0FBQ3hCLE9BQU8sRUFBRSxXQUFXLEVBQUUsTUFBTSxnQkFBZ0IsQ0FBQzs7OztBQUM3QywrQkFFQzs7OztBQUVELGlDQUdDOzs7SUFGQyxrQ0FBYTs7SUFDYixrQ0FBNEI7O0FBUzlCLE1BQU0sT0FBTyxxQkFBcUI7SUFObEM7UUFPUyxjQUFTLEdBQUcsQ0FBQyxDQUFDO1FBTXJCLGtCQUFhLEdBQWdCLElBQUksV0FBVyxDQUFDLEVBQUUsQ0FBQyxDQUFDO1FBRXpDLGtCQUFhLEdBQWdCLElBQUksR0FBRyxFQUFFLENBQUM7UUFFeEMsV0FBTSxHQUE4QixFQUFFLENBQUM7UUFFdkMsZ0JBQVcsR0FBd0MsS0FBSyxDQUFDO1FBRXhELFVBQUssR0FBb0IsSUFBSSxPQUFPLEVBQVUsQ0FBQztRQUUvQyxnQkFBVyxHQUFHLElBQUksT0FBTyxFQUFRLENBQUM7UUFFbEMsa0JBQWEsR0FBRyxLQUFLLENBQUM7UUFFdEIsWUFBTyxHQUFHLElBQUksQ0FBQyxhQUFhLENBQUMsWUFBWSxDQUFDLElBQUksQ0FDcEQsWUFBWSxDQUFDLEdBQUcsQ0FBQyxFQUNqQixTQUFTLENBQUMsSUFBSSxDQUFDLEVB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OztJQUpOLDBDQUFxQjs7SUFFckIsMkNBQXlEOztJQUV6RCw2Q0FBcUM7O0lBRXJDLDhDQUFpRDs7SUFFakQsOENBQStDOztJQUUvQyx1Q0FBOEM7O0lBRTlDLDRDQUFnRTs7SUFFaEUsc0NBQXVEOztJQUV2RCw0Q0FBMEM7O0lBRTFDLDhDQUE4Qjs7SUFFOUIsd0NBS0UiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBDb21wb25lbnQsIENoYW5nZURldGVjdGlvblN0cmF0ZWd5LCBJbnB1dCwgU2ltcGxlQ2hhbmdlcyB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgT2JzZXJ2YWJsZSwgRU1QVFksIFN1YmplY3QsIGNvbWJpbmVMYXRlc3QsIG9mIH0gZnJvbSAncnhqcyc7XG5pbXBvcnQge1xuICB0YXAsXG4gIG1hcCxcbiAgc3RhcnRXaXRoLFxuICBkZWJvdW5jZVRpbWUsXG4gIGZpbHRlcixcbiAgZGlzdGluY3RVbnRpbENoYW5nZWQsXG4gIHRha2VVbnRpbCxcbiAgY2F0Y2hFcnJvcixcbn0gZnJvbSAncnhqcy9vcGVyYXRvcnMnO1xuaW1wb3J0IHsgRm9ybUNvbnRyb2wgfSBmcm9tICdAYW5ndWxhci9mb3Jtcyc7XG5pbnRlcmZhY2UgVmlydHVhbFRhYmxlSXRlbSB7XG4gIFtrZXk6IHN0cmluZ106IGFueTtcbn1cblxuaW50ZXJmYWNlIFZpcnR1YWxUYWJsZUNvbHVtbiB7XG4gIG5hbWU6IHN0cmluZztcbiAgc29ydDogJ2FzYycgfCAnZGVzYycgfCBudWxsO1xufVxuXG5AQ29tcG9uZW50KHtcbiAgc2VsZWN0b3I6ICduZy12aXJ0dWFsLXRhYmxlJyxcbiAgdGVtcGxhdGVVcmw6ICcuL3ZpcnR1YWwtdGFibGUuY29tcG9uZW50Lmh0bWwnLFxuICBzdHlsZVVybHM6IFsnLi92aXJ0dWFsLXRhYmxlLmNvbXBvbmVudC5zY3NzJ10sXG4gIGNoYW5nZURldGVjdGlvbjogQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3kuT25QdXNoLFxufSlcbmV4cG9ydCBjbGFzcyBWaXJ0dWFsVGFibGVDb21wb25lbnQge1xuICBwdWJsaWMgaXRlbUNvdW50ID0gMTtcblxuICBASW5wdXQoKSBkYXRhU291cmNlOiBPYnNlcnZhYmxlPEFycmF5PFZpcnR1YWxUYWJsZUl0ZW0+PjtcblxuICBASW5wdXQoKSBoZWFkZXJDb2x1bW46IEFycmF5PHN0cmluZz47XG5cbiAgZmlsdGVyQ29udHJvbDogRm9ybUNvbnRyb2wgPSBuZXcgRm9ybUNvbnRyb2woJycpO1xuXG4gIHByaXZhdGUgX2hlYWRlckNvbHVtbjogU2V0PHN0cmluZz4gPSBuZXcgU2V0KCk7XG5cbiAgcHVibGljIGNvbHVtbjogQXJyYXk8VmlydHVhbFRhYmxlQ29sdW1uPiA9IFtdO1xuXG4gIHB1YmxpYyBfZGF0YVN0cmVhbTogT2JzZXJ2YWJsZTxBcnJheTxWaXJ0dWFsVGFibGVJdGVtPj4gPSBFTVBUWTtcblxuICBwcml2YXRlIHNvcnQkOiBTdWJqZWN0PHN0cmluZz4gPSBuZXcgU3ViamVjdDxzdHJpbmc+KCk7XG5cbiAgcHJpdmF0ZSBfZGVzdHJveWVkJCA9IG5ldyBTdWJqZWN0PHZvaWQ+KCk7XG5cbiAgcHJpdmF0ZSBfaGVhZGVyV2FzU2V0ID0gZmFsc2U7XG5cbiAgcHJpdmF0ZSBmaWx0ZXIkID0gdGhpcy5maWx0ZXJDb250cm9sLnZhbHVlQ2hhbmdlcy5waXBlKFxuICAgIGRlYm91bmNlVGltZSgzMDApLFxuICAgIHN0YXJ0V2l0aChudWxsKSxcbiAgICBkaXN0aW5jdFVudGlsQ2hhbmdlZCgpLFxuICAgIHRha2VVbnRpbCh0aGlzLl9kZXN0cm95ZWQkKSxcbiAgKTtcblxuICBhcHBseVNvcnQoY29sdW1uOiBzdHJpbmcpIHtcbiAgICB0aGlzLmNvbHVtbiA9IHRoaXMuY29sdW1uLm1hcCgoaXRlbSkgPT4ge1xuICAgICAgaWYgKGl0ZW0ubmFtZSAhPT0gY29sdW1uKSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgLi4uaXRlbSxcbiAgICAgICAgICBzb3J0OiBudWxsLFxuICAgICAgICB9O1xuICAgICAgfVxuXG4gICAgICBpZiAoaXRlbS5zb3J0ID09PSBudWxsKSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgLi4uaXRlbSxcbiAgICAgICAgICBzb3J0OiAnYXNjJyxcbiAgICAgICAgfTtcbiAgICAgIH1cblxuICAgICAgaWYgKGl0ZW0uc29ydCA9PT0gJ2FzYycpIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAuLi5pdGVtLFxuICAgICAgICAgIHNvcnQ6ICdkZXNjJyxcbiAgICAgICAgfTtcbiAgICAgIH1cblxuICAgICAgaWYgKGl0ZW0uc29ydCA9PT0gJ2Rlc2MnKSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgLi4uaXRlbSxcbiAgICAgICAgICBzb3J0OiBudWxsLFxuICAgICAgICB9O1xuICAgICAgfVxuICAgIH0pIGFzIEFycmF5PFZpcnR1YWxUYWJsZUNvbHVtbj47XG4gICAgdGhpcy5zb3J0JC5uZXh0KGNvbHVtbik7XG4gIH1cblxuICBuZ09uQ2hhbmdlcyhjaGFuZ2VzOiBTaW1wbGVDaGFuZ2VzKSB7XG4gICAgaWYgKCdoZWFkZXJDb2x1bW4nIGluIGNoYW5nZXMgJiYgQXJyYXkuaXNBcnJheShjaGFuZ2VzLmhlYWRlckNvbHVtbi5jdXJyZW50VmFsdWUpKSB7XG4gICAgICB0aGlzLmNvbHVtbiA9IHRoaXMuY3JlYXRlQ29sdW1uRnJvbUFycmF5KGNoYW5nZXMuaGVhZGVyQ29sdW1uLmN1cnJlbnRWYWx1ZSk7XG4gICAgICB0aGlzLl9oZWFkZXJXYXNTZXQgPSB0cnVlO1xuICAgIH1cblxuICAgIGlmICgnZGF0YVNvdXJjZScgaW4gY2hhbmdlcykge1xuICAgICAgY29uc3QgbmV3RGF0YVNvdXJjZSA9IGNoYW5nZXMuZGF0YVNvdXJjZS5jdXJyZW50VmFsdWUgYXMgT2JzZXJ2YWJsZTxBcnJheTxWaXJ0dWFsVGFibGVJdGVtPj47XG4gICAgICB0aGlzLl9kYXRhU3RyZWFtID0gY29tYmluZUxhdGVzdChcbiAgICAgICAgdGhpcy5zb3J0JC5hc09ic2VydmFibGUoKS5waXBlKHN0YXJ0V2l0aChudWxsKSksXG4gICAgICAgIGNvbWJpbmVMYXRlc3QoXG4gICAgICAgICAgbmV3RGF0YVNvdXJjZS5waXBlKFxuICAgICAgICAgICAgdGFwKChzdHJlYW06IEFycmF5PFZpcnR1YWxUYWJsZUl0ZW0+KSA9PiB7XG4gICAgICAgICAgICAgIGlmICghdGhpcy5faGVhZGVyV2FzU2V0KSB7XG4gICAgICAgICAgICAgICAgdGhpcy5faGVhZGVyQ29sdW1uLmNsZWFyKCk7XG4gICAgICAgICAgICAgICAgc3RyZWFtLmZvckVhY2goKGUpID0+IE9iamVjdC5rZXlzKGUpLmZvckVhY2goKGtleSkgPT4gdGhpcy5faGVhZGVyQ29sdW1uLmFkZChrZXkpKSk7XG4gICAgICAgICAgICAgICAgdGhpcy5jb2x1bW4gPSB0aGlzLmNyZWF0ZUNvbHVtbkZyb21BcnJheShBcnJheS5mcm9tKHRoaXMuX2hlYWRlckNvbHVtbikpO1xuICAgICAgICAgICAgICAgIHRoaXMuX2hlYWRlcldhc1NldCA9IHRydWU7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pLFxuICAgICAgICAgICAgbWFwKChzdHJlYW0pID0+IHN0cmVhbS5zbGljZSgpKSxcbiAgICAgICAgICApLFxuICAgICAgICAgIHRoaXMuZmlsdGVyJCxcbiAgICAgICAgKS5waXBlKFxuICAgICAgICAgIG1hcCgoW3N0cmVhbSwgZmlsdGVyU3RyaW5nXSkgPT4ge1xuICAgICAgICAgICAgY29uc3Qgc2xpY2VTdHJlYW0gPSBzdHJlYW0uc2xpY2UoKTtcbiAgICAgICAgICAgIGlmICghZmlsdGVyU3RyaW5nKSB7XG4gICAgICAgICAgICAgIHJldHVybiBzbGljZVN0cmVhbTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGNvbnN0IGZpbHRlciA9IGZpbHRlclN0cmluZy50b0xvY2FsZUxvd2VyQ2FzZSgpO1xuXG4gICAgICAgICAgICBjb25zdCBmaWx0ZXJTbGljZVN0cmVhbSA9IHNsaWNlU3RyZWFtLmZpbHRlcigoaXRlbTogVmlydHVhbFRhYmxlSXRlbSkgPT5cbiAgICAgICAgICAgICAgT2JqZWN0LmtleXMoaXRlbSkuc29tZShcbiAgICAgICAgICAgICAgICAoa2V5KSA9PiBpdGVtW2tleV0gJiYgaXRlbVtrZXldLnRvU3RyaW5nKCkudG9Mb2NhbGVMb3dlckNhc2UoKS5pbmRleE9mKGZpbHRlcikgPiAtMSxcbiAgICAgICAgICAgICAgKSxcbiAgICAgICAgICAgICk7XG4gICAgICAgICAgICByZXR1cm4gZmlsdGVyU2xpY2VTdHJlYW07XG4gICAgICAgICAgfSksXG4gICAgICAgICksXG4gICAgICApLnBpcGUoXG4gICAgICAgIG1hcCgoW3NvcnQsIHN0cmVhbV0pID0+IHtcbiAgICAgICAgICBjb25zdCBzbGljZVN0cmVhbSA9IHN0cmVhbS5zbGljZSgpO1xuXG4gICAgICAgICAgY29uc3Qgc29ydENvbHVtbiA9IHRoaXMuY29sdW1uLmZpbmQoKGUpID0+IGUubmFtZSA9PT0gc29ydCk7XG5cbiAgICAgICAgICBpZiAoIXNvcnQgfHwgIXNvcnRDb2x1bW4pIHtcbiAgICAgICAgICAgIHJldHVybiBzbGljZVN0cmVhbTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBpZiAoIXNvcnRDb2x1bW4uc29ydCkge1xuICAgICAgICAgICAgcmV0dXJuIHNsaWNlU3RyZWFtO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIGlmIChzb3J0Q29sdW1uLnNvcnQgPT09ICdhc2MnKSB7XG4gICAgICAgICAgICBzbGljZVN0cmVhbS5zb3J0KFxuICAgICAgICAgICAgICAoYTogVmlydHVhbFRhYmxlSXRlbSwgYjogVmlydHVhbFRhYmxlSXRlbSkgPT5cbiAgICAgICAgICAgICAgICBhW3NvcnRDb2x1bW4ubmFtZV0gPiBiW3NvcnRDb2x1bW4ubmFtZV1cbiAgICAgICAgICAgICAgICAgID8gMVxuICAgICAgICAgICAgICAgICAgOiBhW3NvcnRDb2x1bW4ubmFtZV0gPT09IGJbc29ydENvbHVtbi5uYW1lXSA/IDAgOiAtMSxcbiAgICAgICAgICAgICk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHNsaWNlU3RyZWFtLnNvcnQoXG4gICAgICAgICAgICAgIChhOiBWaXJ0dWFsVGFibGVJdGVtLCBiOiBWaXJ0dWFsVGFibGVJdGVtKSA9PlxuICAgICAgICAgICAgICAgIGFbc29ydENvbHVtbi5uYW1lXSA8IGJbc29ydENvbHVtbi5uYW1lXVxuICAgICAgICAgICAgICAgICAgPyAxXG4gICAgICAgICAgICAgICAgICA6IGFbc29ydENvbHVtbi5uYW1lXSA9PT0gYltzb3J0Q29sdW1uLm5hbWVdID8gMCA6IC0xLFxuICAgICAgICAgICAgKTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICByZXR1cm4gc2xpY2VTdHJlYW07XG4gICAgICAgIH0pLFxuICAgICAgICB0YXAoKHZhbHVlKSA9PiBjb25zb2xlLmxvZyh2YWx1ZSkpLFxuICAgICAgKTtcbiAgICB9XG4gIH1cblxuICBjcmVhdGVDb2x1bW5Gcm9tQXJyYXkoYXJyOiBBcnJheTxzdHJpbmc+KTogQXJyYXk8VmlydHVhbFRhYmxlQ29sdW1uPiB7XG4gICAgcmV0dXJuIGFyci5tYXAoKGUpID0+ICh7IG5hbWU6IGUsIHNvcnQ6IG51bGwgfSkpO1xuICB9XG5cbiAgbmdPbkRlc3Ryb3koKSB7XG4gICAgdGhpcy5fZGVzdHJveWVkJC5uZXh0KCk7XG4gIH1cbn1cbiJdfQ==