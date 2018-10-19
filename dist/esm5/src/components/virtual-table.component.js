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
var VirtualTableComponent = /** @class */ (function () {
    function VirtualTableComponent() {
        this.itemCount = 50;
        this._headerColumn = new Set();
        this.column = [];
        this._dataStream = EMPTY;
    }
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
        if ('dataSource' in changes && changes.dataSource instanceof Observable) {
            this._dataStream = changes.dataSource.pipe(tap(function (stream) {
                _this._headerColumn.clear();
                stream.forEach(function (e) { return Object.keys(e).forEach(function (key) { return _this._headerColumn.add(key); }); });
                _this.column = Array.from(_this._headerColumn);
            }));
        }
        if ('headerColumn' in changes && Array.isArray(changes.headerColumn)) {
            this.column = changes.headerColumn;
        }
    };
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
    VirtualTableComponent.prototype._headerColumn;
    /** @type {?} */
    VirtualTableComponent.prototype.column;
    /** @type {?} */
    VirtualTableComponent.prototype._dataStream;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidmlydHVhbC10YWJsZS5jb21wb25lbnQuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9uZy12aXJ0dWFsLXRhYmxlLyIsInNvdXJjZXMiOlsic3JjL2NvbXBvbmVudHMvdmlydHVhbC10YWJsZS5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7OztBQUFBLE9BQU8sRUFBRSxTQUFTLEVBQUUsdUJBQXVCLEVBQUUsS0FBSyxFQUFpQixNQUFNLGVBQWUsQ0FBQztBQUN6RixPQUFPLEVBQUUsVUFBVSxFQUFFLEtBQUssRUFBRSxNQUFNLE1BQU0sQ0FBQztBQUN6QyxPQUFPLEVBQUUsR0FBRyxFQUFFLE1BQU0sZ0JBQWdCLENBQUM7Ozs7QUFFckMsK0JBRUM7QUFFRDtJQUFBO1FBT1csY0FBUyxHQUFHLEVBQUUsQ0FBQztRQU1oQixrQkFBYSxHQUFnQixJQUFJLEdBQUcsRUFBRSxDQUFDO1FBRXhDLFdBQU0sR0FBa0IsRUFBRSxDQUFDO1FBRTNCLGdCQUFXLEdBQXdDLEtBQUssQ0FBQztJQWlCbEUsQ0FBQzs7Ozs7SUFmQywyQ0FBVzs7OztJQUFYLFVBQVksT0FBc0I7UUFBbEMsaUJBY0M7UUFiQyxJQUFJLFlBQVksSUFBSSxPQUFPLElBQUksT0FBTyxDQUFDLFVBQVUsWUFBWSxVQUFVLEVBQUU7WUFDdkUsSUFBSSxDQUFDLFdBQVcsR0FBRyxPQUFPLENBQUMsVUFBVSxDQUFDLElBQUksQ0FDeEMsR0FBRyxDQUFDLFVBQUMsTUFBK0I7Z0JBQ2xDLEtBQUksQ0FBQyxhQUFhLENBQUMsS0FBSyxFQUFFLENBQUM7Z0JBQzNCLE1BQU0sQ0FBQyxPQUFPLENBQUMsVUFBQyxDQUFDLElBQUssT0FBQSxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxVQUFDLEdBQUcsSUFBSyxPQUFBLEtBQUksQ0FBQyxhQUFhLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxFQUEzQixDQUEyQixDQUFDLEVBQTVELENBQTRELENBQUMsQ0FBQztnQkFDcEYsS0FBSSxDQUFDLE1BQU0sR0FBRyxLQUFLLENBQUMsSUFBSSxDQUFDLEtBQUksQ0FBQyxhQUFhLENBQUMsQ0FBQztZQUMvQyxDQUFDLENBQUMsQ0FDSCxDQUFDO1NBQ0g7UUFFRCxJQUFJLGNBQWMsSUFBSSxPQUFPLElBQUksS0FBSyxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsWUFBWSxDQUFDLEVBQUU7WUFDcEUsSUFBSSxDQUFDLE1BQU0sR0FBRyxPQUFPLENBQUMsWUFBWSxDQUFDO1NBQ3BDO0lBQ0gsQ0FBQzs7Z0JBakNGLFNBQVMsU0FBQztvQkFDVCxRQUFRLEVBQUUsa0JBQWtCO29CQUM1Qix3VEFBNkM7b0JBRTdDLGVBQWUsRUFBRSx1QkFBdUIsQ0FBQyxNQUFNO2lCQUNoRDs7OzRCQUVFLEtBQUs7NkJBRUwsS0FBSzsrQkFFTCxLQUFLOztJQXVCUiw0QkFBQztDQUFBLEFBbENELElBa0NDO1NBNUJZLHFCQUFxQjs7O0lBQ2hDLDBDQUF3Qjs7SUFFeEIsMkNBQXlEOztJQUV6RCw2Q0FBcUM7O0lBRXJDLDhDQUErQzs7SUFFL0MsdUNBQWtDOztJQUVsQyw0Q0FBZ0UiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBDb21wb25lbnQsIENoYW5nZURldGVjdGlvblN0cmF0ZWd5LCBJbnB1dCwgU2ltcGxlQ2hhbmdlcyB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgT2JzZXJ2YWJsZSwgRU1QVFkgfSBmcm9tICdyeGpzJztcbmltcG9ydCB7IHRhcCB9IGZyb20gJ3J4anMvb3BlcmF0b3JzJztcblxuaW50ZXJmYWNlIFZpcnR1YWxUYWJsZUl0ZW0ge1xuICBba2V5OiBzdHJpbmddOiBhbnk7XG59XG5cbkBDb21wb25lbnQoe1xuICBzZWxlY3RvcjogJ25nLXZpcnR1YWwtdGFibGUnLFxuICB0ZW1wbGF0ZVVybDogJy4vdmlydHVhbC10YWJsZS5jb21wb25lbnQuaHRtbCcsXG4gIHN0eWxlVXJsczogW10sXG4gIGNoYW5nZURldGVjdGlvbjogQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3kuT25QdXNoLFxufSlcbmV4cG9ydCBjbGFzcyBWaXJ0dWFsVGFibGVDb21wb25lbnQge1xuICBASW5wdXQoKSBpdGVtQ291bnQgPSA1MDtcblxuICBASW5wdXQoKSBkYXRhU291cmNlOiBPYnNlcnZhYmxlPEFycmF5PFZpcnR1YWxUYWJsZUl0ZW0+PjtcblxuICBASW5wdXQoKSBoZWFkZXJDb2x1bW46IEFycmF5PHN0cmluZz47XG5cbiAgcHJpdmF0ZSBfaGVhZGVyQ29sdW1uOiBTZXQ8c3RyaW5nPiA9IG5ldyBTZXQoKTtcblxuICBwdWJsaWMgY29sdW1uOiBBcnJheTxzdHJpbmc+ID0gW107XG5cbiAgcHVibGljIF9kYXRhU3RyZWFtOiBPYnNlcnZhYmxlPEFycmF5PFZpcnR1YWxUYWJsZUl0ZW0+PiA9IEVNUFRZO1xuXG4gIG5nT25DaGFuZ2VzKGNoYW5nZXM6IFNpbXBsZUNoYW5nZXMpIHtcbiAgICBpZiAoJ2RhdGFTb3VyY2UnIGluIGNoYW5nZXMgJiYgY2hhbmdlcy5kYXRhU291cmNlIGluc3RhbmNlb2YgT2JzZXJ2YWJsZSkge1xuICAgICAgdGhpcy5fZGF0YVN0cmVhbSA9IGNoYW5nZXMuZGF0YVNvdXJjZS5waXBlKFxuICAgICAgICB0YXAoKHN0cmVhbTogQXJyYXk8VmlydHVhbFRhYmxlSXRlbT4pID0+IHtcbiAgICAgICAgICB0aGlzLl9oZWFkZXJDb2x1bW4uY2xlYXIoKTtcbiAgICAgICAgICBzdHJlYW0uZm9yRWFjaCgoZSkgPT4gT2JqZWN0LmtleXMoZSkuZm9yRWFjaCgoa2V5KSA9PiB0aGlzLl9oZWFkZXJDb2x1bW4uYWRkKGtleSkpKTtcbiAgICAgICAgICB0aGlzLmNvbHVtbiA9IEFycmF5LmZyb20odGhpcy5faGVhZGVyQ29sdW1uKTtcbiAgICAgICAgfSksXG4gICAgICApO1xuICAgIH1cblxuICAgIGlmICgnaGVhZGVyQ29sdW1uJyBpbiBjaGFuZ2VzICYmIEFycmF5LmlzQXJyYXkoY2hhbmdlcy5oZWFkZXJDb2x1bW4pKSB7XG4gICAgICB0aGlzLmNvbHVtbiA9IGNoYW5nZXMuaGVhZGVyQ29sdW1uO1xuICAgIH1cbiAgfVxufVxuIl19