import { Component, ChangeDetectionStrategy, Input, NgModule } from '@angular/core';
import { Observable, EMPTY } from 'rxjs';
import { tap } from 'rxjs/operators';
import { CommonModule } from '@angular/common';
import { ScrollDispatchModule } from '@angular/cdk/scrolling';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserModule } from '@angular/platform-browser';

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
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

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
var NgVirtualTableModule = /** @class */ (function () {
    function NgVirtualTableModule() {
    }
    NgVirtualTableModule.decorators = [
        { type: NgModule, args: [{
                    declarations: [VirtualTableComponent],
                    imports: [BrowserModule, CommonModule, BrowserAnimationsModule, ScrollDispatchModule],
                    exports: [VirtualTableComponent],
                    providers: [],
                },] }
    ];
    return NgVirtualTableModule;
}());

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */

export { NgVirtualTableModule, VirtualTableComponent };

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmctdmlydHVhbC10YWJsZS5qcy5tYXAiLCJzb3VyY2VzIjpbIm5nOi8vbmctdmlydHVhbC10YWJsZS9zcmMvY29tcG9uZW50cy92aXJ0dWFsLXRhYmxlLmNvbXBvbmVudC50cyIsIm5nOi8vbmctdmlydHVhbC10YWJsZS9zcmMvbmdWaXJ0dWFsVGFibGUubW9kdWxlLnRzIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IENvbXBvbmVudCwgQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3ksIElucHV0LCBTaW1wbGVDaGFuZ2VzIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBPYnNlcnZhYmxlLCBFTVBUWSB9IGZyb20gJ3J4anMnO1xuaW1wb3J0IHsgdGFwIH0gZnJvbSAncnhqcy9vcGVyYXRvcnMnO1xuXG5pbnRlcmZhY2UgVmlydHVhbFRhYmxlSXRlbSB7XG4gIFtrZXk6IHN0cmluZ106IGFueTtcbn1cblxuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAnbmctdmlydHVhbC10YWJsZScsXG4gIHRlbXBsYXRlVXJsOiAnLi92aXJ0dWFsLXRhYmxlLmNvbXBvbmVudC5odG1sJyxcbiAgc3R5bGVVcmxzOiBbXSxcbiAgY2hhbmdlRGV0ZWN0aW9uOiBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneS5PblB1c2gsXG59KVxuZXhwb3J0IGNsYXNzIFZpcnR1YWxUYWJsZUNvbXBvbmVudCB7XG4gIEBJbnB1dCgpIGl0ZW1Db3VudCA9IDUwO1xuXG4gIEBJbnB1dCgpIGRhdGFTb3VyY2U6IE9ic2VydmFibGU8QXJyYXk8VmlydHVhbFRhYmxlSXRlbT4+O1xuXG4gIEBJbnB1dCgpIGhlYWRlckNvbHVtbjogQXJyYXk8c3RyaW5nPjtcblxuICBwcml2YXRlIF9oZWFkZXJDb2x1bW46IFNldDxzdHJpbmc+ID0gbmV3IFNldCgpO1xuXG4gIHB1YmxpYyBjb2x1bW46IEFycmF5PHN0cmluZz4gPSBbXTtcblxuICBwdWJsaWMgX2RhdGFTdHJlYW06IE9ic2VydmFibGU8QXJyYXk8VmlydHVhbFRhYmxlSXRlbT4+ID0gRU1QVFk7XG5cbiAgbmdPbkNoYW5nZXMoY2hhbmdlczogU2ltcGxlQ2hhbmdlcykge1xuICAgIGlmICgnZGF0YVNvdXJjZScgaW4gY2hhbmdlcyAmJiBjaGFuZ2VzLmRhdGFTb3VyY2UgaW5zdGFuY2VvZiBPYnNlcnZhYmxlKSB7XG4gICAgICB0aGlzLl9kYXRhU3RyZWFtID0gY2hhbmdlcy5kYXRhU291cmNlLnBpcGUoXG4gICAgICAgIHRhcCgoc3RyZWFtOiBBcnJheTxWaXJ0dWFsVGFibGVJdGVtPikgPT4ge1xuICAgICAgICAgIHRoaXMuX2hlYWRlckNvbHVtbi5jbGVhcigpO1xuICAgICAgICAgIHN0cmVhbS5mb3JFYWNoKChlKSA9PiBPYmplY3Qua2V5cyhlKS5mb3JFYWNoKChrZXkpID0+IHRoaXMuX2hlYWRlckNvbHVtbi5hZGQoa2V5KSkpO1xuICAgICAgICAgIHRoaXMuY29sdW1uID0gQXJyYXkuZnJvbSh0aGlzLl9oZWFkZXJDb2x1bW4pO1xuICAgICAgICB9KSxcbiAgICAgICk7XG4gICAgfVxuXG4gICAgaWYgKCdoZWFkZXJDb2x1bW4nIGluIGNoYW5nZXMgJiYgQXJyYXkuaXNBcnJheShjaGFuZ2VzLmhlYWRlckNvbHVtbikpIHtcbiAgICAgIHRoaXMuY29sdW1uID0gY2hhbmdlcy5oZWFkZXJDb2x1bW47XG4gICAgfVxuICB9XG59XG4iLCJpbXBvcnQgeyBOZ01vZHVsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgQ29tbW9uTW9kdWxlIH0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uJztcbmltcG9ydCB7IFNjcm9sbERpc3BhdGNoTW9kdWxlIH0gZnJvbSAnQGFuZ3VsYXIvY2RrL3Njcm9sbGluZyc7XG5pbXBvcnQgeyBWaXJ0dWFsVGFibGVDb21wb25lbnQgfSBmcm9tICcuL2NvbXBvbmVudHMvdmlydHVhbC10YWJsZS5jb21wb25lbnQnO1xuaW1wb3J0IHsgQnJvd3NlckFuaW1hdGlvbnNNb2R1bGUgfSBmcm9tICdAYW5ndWxhci9wbGF0Zm9ybS1icm93c2VyL2FuaW1hdGlvbnMnO1xuaW1wb3J0IHsgQnJvd3Nlck1vZHVsZSB9IGZyb20gJ0Bhbmd1bGFyL3BsYXRmb3JtLWJyb3dzZXInO1xuQE5nTW9kdWxlKHtcbiAgZGVjbGFyYXRpb25zOiBbVmlydHVhbFRhYmxlQ29tcG9uZW50XSxcbiAgaW1wb3J0czogW0Jyb3dzZXJNb2R1bGUsIENvbW1vbk1vZHVsZSwgQnJvd3NlckFuaW1hdGlvbnNNb2R1bGUsIFNjcm9sbERpc3BhdGNoTW9kdWxlXSxcbiAgZXhwb3J0czogW1ZpcnR1YWxUYWJsZUNvbXBvbmVudF0sXG4gIHByb3ZpZGVyczogW10sXG59KVxuZXhwb3J0IGNsYXNzIE5nVmlydHVhbFRhYmxlTW9kdWxlIHt9XG4iXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7O0FBQUE7SUFRQTtRQU9XLGNBQVMsR0FBRyxFQUFFLENBQUM7UUFNaEIsa0JBQWEsR0FBZ0IsSUFBSSxHQUFHLEVBQUUsQ0FBQztRQUV4QyxXQUFNLEdBQWtCLEVBQUUsQ0FBQztRQUUzQixnQkFBVyxHQUF3QyxLQUFLLENBQUM7S0FpQmpFOzs7OztJQWZDLDJDQUFXOzs7O0lBQVgsVUFBWSxPQUFzQjtRQUFsQyxpQkFjQztRQWJDLElBQUksWUFBWSxJQUFJLE9BQU8sSUFBSSxPQUFPLENBQUMsVUFBVSxZQUFZLFVBQVUsRUFBRTtZQUN2RSxJQUFJLENBQUMsV0FBVyxHQUFHLE9BQU8sQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUN4QyxHQUFHLENBQUMsVUFBQyxNQUErQjtnQkFDbEMsS0FBSSxDQUFDLGFBQWEsQ0FBQyxLQUFLLEVBQUUsQ0FBQztnQkFDM0IsTUFBTSxDQUFDLE9BQU8sQ0FBQyxVQUFDLENBQUMsSUFBSyxPQUFBLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLFVBQUMsR0FBRyxJQUFLLE9BQUEsS0FBSSxDQUFDLGFBQWEsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUEsQ0FBQyxHQUFBLENBQUMsQ0FBQztnQkFDcEYsS0FBSSxDQUFDLE1BQU0sR0FBRyxLQUFLLENBQUMsSUFBSSxDQUFDLEtBQUksQ0FBQyxhQUFhLENBQUMsQ0FBQzthQUM5QyxDQUFDLENBQ0gsQ0FBQztTQUNIO1FBRUQsSUFBSSxjQUFjLElBQUksT0FBTyxJQUFJLEtBQUssQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLFlBQVksQ0FBQyxFQUFFO1lBQ3BFLElBQUksQ0FBQyxNQUFNLEdBQUcsT0FBTyxDQUFDLFlBQVksQ0FBQztTQUNwQztLQUNGOztnQkFqQ0YsU0FBUyxTQUFDO29CQUNULFFBQVEsRUFBRSxrQkFBa0I7b0JBQzVCLHdUQUE2QztvQkFFN0MsZUFBZSxFQUFFLHVCQUF1QixDQUFDLE1BQU07aUJBQ2hEOzs7NEJBRUUsS0FBSzs2QkFFTCxLQUFLOytCQUVMLEtBQUs7O0lBdUJSLDRCQUFDO0NBbENEOzs7Ozs7QUNSQTtJQU1BO0tBTW9DOztnQkFObkMsUUFBUSxTQUFDO29CQUNSLFlBQVksRUFBRSxDQUFDLHFCQUFxQixDQUFDO29CQUNyQyxPQUFPLEVBQUUsQ0FBQyxhQUFhLEVBQUUsWUFBWSxFQUFFLHVCQUF1QixFQUFFLG9CQUFvQixDQUFDO29CQUNyRixPQUFPLEVBQUUsQ0FBQyxxQkFBcUIsQ0FBQztvQkFDaEMsU0FBUyxFQUFFLEVBQUU7aUJBQ2Q7O0lBQ2tDLDJCQUFDO0NBTnBDOzs7Ozs7Ozs7Ozs7OzsifQ==