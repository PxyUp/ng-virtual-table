/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
import { Component, ChangeDetectionStrategy, Input } from '@angular/core';
import { Observable, EMPTY } from 'rxjs';
import { tap } from 'rxjs/operators';
/**
 * @record
 */
function VirtualTableItem() { }
export class VirtualTableComponent {
    constructor() {
        this.itemCount = 50;
        this._headerColumn = new Set();
        this.column = [];
        this._dataStream = EMPTY;
    }
    /**
     * @param {?} changes
     * @return {?}
     */
    ngOnChanges(changes) {
        if ('dataSource' in changes && changes.dataSource instanceof Observable) {
            this._dataStream = changes.dataSource.pipe(tap((stream) => {
                this._headerColumn.clear();
                stream.forEach((e) => Object.keys(e).forEach((key) => this._headerColumn.add(key)));
                this.column = Array.from(this._headerColumn);
            }));
        }
        if ('headerColumn' in changes && Array.isArray(changes.headerColumn)) {
            this.column = changes.headerColumn;
        }
    }
}
VirtualTableComponent.decorators = [
    { type: Component, args: [{
                selector: 'ng-virtual-table',
                template: "<div class=\"table\">\n  <div class=\"header\">\n    <div *ngFor=\"let headerItem of column\">{{ headerItem }}</div>\n  </div>\n  <cdk-virtual-scroll-viewport itemSize=\"itemCount\">\n    <div *cdkVirtualFor=\"let item of _dataStream | async\">{{item}}</div>\n  </cdk-virtual-scroll-viewport>\n</div>",
                changeDetection: ChangeDetectionStrategy.OnPush
            }] }
];
VirtualTableComponent.propDecorators = {
    itemCount: [{ type: Input }],
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
    VirtualTableComponent.prototype._headerColumn;
    /** @type {?} */
    VirtualTableComponent.prototype.column;
    /** @type {?} */
    VirtualTableComponent.prototype._dataStream;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidmlydHVhbC10YWJsZS5jb21wb25lbnQuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9uZy12aXJ0dWFsLXRhYmxlLyIsInNvdXJjZXMiOlsic3JjL2NvbXBvbmVudHMvdmlydHVhbC10YWJsZS5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7OztBQUFBLE9BQU8sRUFBRSxTQUFTLEVBQUUsdUJBQXVCLEVBQUUsS0FBSyxFQUFpQixNQUFNLGVBQWUsQ0FBQztBQUN6RixPQUFPLEVBQUUsVUFBVSxFQUFFLEtBQUssRUFBRSxNQUFNLE1BQU0sQ0FBQztBQUN6QyxPQUFPLEVBQUUsR0FBRyxFQUFFLE1BQU0sZ0JBQWdCLENBQUM7Ozs7QUFFckMsK0JBRUM7QUFRRCxNQUFNLE9BQU8scUJBQXFCO0lBTmxDO1FBT1csY0FBUyxHQUFHLEVBQUUsQ0FBQztRQU1oQixrQkFBYSxHQUFnQixJQUFJLEdBQUcsRUFBRSxDQUFDO1FBRXhDLFdBQU0sR0FBa0IsRUFBRSxDQUFDO1FBRTNCLGdCQUFXLEdBQXdDLEtBQUssQ0FBQztJQWlCbEUsQ0FBQzs7Ozs7SUFmQyxXQUFXLENBQUMsT0FBc0I7UUFDaEMsSUFBSSxZQUFZLElBQUksT0FBTyxJQUFJLE9BQU8sQ0FBQyxVQUFVLFlBQVksVUFBVSxFQUFFO1lBQ3ZFLElBQUksQ0FBQyxXQUFXLEdBQUcsT0FBTyxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQ3hDLEdBQUcsQ0FBQyxDQUFDLE1BQStCLEVBQUUsRUFBRTtnQkFDdEMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxLQUFLLEVBQUUsQ0FBQztnQkFDM0IsTUFBTSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxHQUFHLEVBQUUsRUFBRSxDQUFDLElBQUksQ0FBQyxhQUFhLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDcEYsSUFBSSxDQUFDLE1BQU0sR0FBRyxLQUFLLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxhQUFhLENBQUMsQ0FBQztZQUMvQyxDQUFDLENBQUMsQ0FDSCxDQUFDO1NBQ0g7UUFFRCxJQUFJLGNBQWMsSUFBSSxPQUFPLElBQUksS0FBSyxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsWUFBWSxDQUFDLEVBQUU7WUFDcEUsSUFBSSxDQUFDLE1BQU0sR0FBRyxPQUFPLENBQUMsWUFBWSxDQUFDO1NBQ3BDO0lBQ0gsQ0FBQzs7O1lBakNGLFNBQVMsU0FBQztnQkFDVCxRQUFRLEVBQUUsa0JBQWtCO2dCQUM1Qix3VEFBNkM7Z0JBRTdDLGVBQWUsRUFBRSx1QkFBdUIsQ0FBQyxNQUFNO2FBQ2hEOzs7d0JBRUUsS0FBSzt5QkFFTCxLQUFLOzJCQUVMLEtBQUs7Ozs7SUFKTiwwQ0FBd0I7O0lBRXhCLDJDQUF5RDs7SUFFekQsNkNBQXFDOztJQUVyQyw4Q0FBK0M7O0lBRS9DLHVDQUFrQzs7SUFFbEMsNENBQWdFIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQ29tcG9uZW50LCBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneSwgSW5wdXQsIFNpbXBsZUNoYW5nZXMgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IE9ic2VydmFibGUsIEVNUFRZIH0gZnJvbSAncnhqcyc7XG5pbXBvcnQgeyB0YXAgfSBmcm9tICdyeGpzL29wZXJhdG9ycyc7XG5cbmludGVyZmFjZSBWaXJ0dWFsVGFibGVJdGVtIHtcbiAgW2tleTogc3RyaW5nXTogYW55O1xufVxuXG5AQ29tcG9uZW50KHtcbiAgc2VsZWN0b3I6ICduZy12aXJ0dWFsLXRhYmxlJyxcbiAgdGVtcGxhdGVVcmw6ICcuL3ZpcnR1YWwtdGFibGUuY29tcG9uZW50Lmh0bWwnLFxuICBzdHlsZVVybHM6IFtdLFxuICBjaGFuZ2VEZXRlY3Rpb246IENoYW5nZURldGVjdGlvblN0cmF0ZWd5Lk9uUHVzaCxcbn0pXG5leHBvcnQgY2xhc3MgVmlydHVhbFRhYmxlQ29tcG9uZW50IHtcbiAgQElucHV0KCkgaXRlbUNvdW50ID0gNTA7XG5cbiAgQElucHV0KCkgZGF0YVNvdXJjZTogT2JzZXJ2YWJsZTxBcnJheTxWaXJ0dWFsVGFibGVJdGVtPj47XG5cbiAgQElucHV0KCkgaGVhZGVyQ29sdW1uOiBBcnJheTxzdHJpbmc+O1xuXG4gIHByaXZhdGUgX2hlYWRlckNvbHVtbjogU2V0PHN0cmluZz4gPSBuZXcgU2V0KCk7XG5cbiAgcHVibGljIGNvbHVtbjogQXJyYXk8c3RyaW5nPiA9IFtdO1xuXG4gIHB1YmxpYyBfZGF0YVN0cmVhbTogT2JzZXJ2YWJsZTxBcnJheTxWaXJ0dWFsVGFibGVJdGVtPj4gPSBFTVBUWTtcblxuICBuZ09uQ2hhbmdlcyhjaGFuZ2VzOiBTaW1wbGVDaGFuZ2VzKSB7XG4gICAgaWYgKCdkYXRhU291cmNlJyBpbiBjaGFuZ2VzICYmIGNoYW5nZXMuZGF0YVNvdXJjZSBpbnN0YW5jZW9mIE9ic2VydmFibGUpIHtcbiAgICAgIHRoaXMuX2RhdGFTdHJlYW0gPSBjaGFuZ2VzLmRhdGFTb3VyY2UucGlwZShcbiAgICAgICAgdGFwKChzdHJlYW06IEFycmF5PFZpcnR1YWxUYWJsZUl0ZW0+KSA9PiB7XG4gICAgICAgICAgdGhpcy5faGVhZGVyQ29sdW1uLmNsZWFyKCk7XG4gICAgICAgICAgc3RyZWFtLmZvckVhY2goKGUpID0+IE9iamVjdC5rZXlzKGUpLmZvckVhY2goKGtleSkgPT4gdGhpcy5faGVhZGVyQ29sdW1uLmFkZChrZXkpKSk7XG4gICAgICAgICAgdGhpcy5jb2x1bW4gPSBBcnJheS5mcm9tKHRoaXMuX2hlYWRlckNvbHVtbik7XG4gICAgICAgIH0pLFxuICAgICAgKTtcbiAgICB9XG5cbiAgICBpZiAoJ2hlYWRlckNvbHVtbicgaW4gY2hhbmdlcyAmJiBBcnJheS5pc0FycmF5KGNoYW5nZXMuaGVhZGVyQ29sdW1uKSkge1xuICAgICAgdGhpcy5jb2x1bW4gPSBjaGFuZ2VzLmhlYWRlckNvbHVtbjtcbiAgICB9XG4gIH1cbn1cbiJdfQ==