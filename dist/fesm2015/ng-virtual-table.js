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
class VirtualTableComponent {
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

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
class NgVirtualTableModule {
}
NgVirtualTableModule.decorators = [
    { type: NgModule, args: [{
                declarations: [VirtualTableComponent],
                imports: [BrowserModule, CommonModule, BrowserAnimationsModule, ScrollDispatchModule],
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

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmctdmlydHVhbC10YWJsZS5qcy5tYXAiLCJzb3VyY2VzIjpbIm5nOi8vbmctdmlydHVhbC10YWJsZS9zcmMvY29tcG9uZW50cy92aXJ0dWFsLXRhYmxlLmNvbXBvbmVudC50cyIsIm5nOi8vbmctdmlydHVhbC10YWJsZS9zcmMvbmdWaXJ0dWFsVGFibGUubW9kdWxlLnRzIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IENvbXBvbmVudCwgQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3ksIElucHV0LCBTaW1wbGVDaGFuZ2VzIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBPYnNlcnZhYmxlLCBFTVBUWSB9IGZyb20gJ3J4anMnO1xuaW1wb3J0IHsgdGFwIH0gZnJvbSAncnhqcy9vcGVyYXRvcnMnO1xuXG5pbnRlcmZhY2UgVmlydHVhbFRhYmxlSXRlbSB7XG4gIFtrZXk6IHN0cmluZ106IGFueTtcbn1cblxuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAnbmctdmlydHVhbC10YWJsZScsXG4gIHRlbXBsYXRlVXJsOiAnLi92aXJ0dWFsLXRhYmxlLmNvbXBvbmVudC5odG1sJyxcbiAgc3R5bGVVcmxzOiBbXSxcbiAgY2hhbmdlRGV0ZWN0aW9uOiBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneS5PblB1c2gsXG59KVxuZXhwb3J0IGNsYXNzIFZpcnR1YWxUYWJsZUNvbXBvbmVudCB7XG4gIEBJbnB1dCgpIGl0ZW1Db3VudCA9IDUwO1xuXG4gIEBJbnB1dCgpIGRhdGFTb3VyY2U6IE9ic2VydmFibGU8QXJyYXk8VmlydHVhbFRhYmxlSXRlbT4+O1xuXG4gIEBJbnB1dCgpIGhlYWRlckNvbHVtbjogQXJyYXk8c3RyaW5nPjtcblxuICBwcml2YXRlIF9oZWFkZXJDb2x1bW46IFNldDxzdHJpbmc+ID0gbmV3IFNldCgpO1xuXG4gIHB1YmxpYyBjb2x1bW46IEFycmF5PHN0cmluZz4gPSBbXTtcblxuICBwdWJsaWMgX2RhdGFTdHJlYW06IE9ic2VydmFibGU8QXJyYXk8VmlydHVhbFRhYmxlSXRlbT4+ID0gRU1QVFk7XG5cbiAgbmdPbkNoYW5nZXMoY2hhbmdlczogU2ltcGxlQ2hhbmdlcykge1xuICAgIGlmICgnZGF0YVNvdXJjZScgaW4gY2hhbmdlcyAmJiBjaGFuZ2VzLmRhdGFTb3VyY2UgaW5zdGFuY2VvZiBPYnNlcnZhYmxlKSB7XG4gICAgICB0aGlzLl9kYXRhU3RyZWFtID0gY2hhbmdlcy5kYXRhU291cmNlLnBpcGUoXG4gICAgICAgIHRhcCgoc3RyZWFtOiBBcnJheTxWaXJ0dWFsVGFibGVJdGVtPikgPT4ge1xuICAgICAgICAgIHRoaXMuX2hlYWRlckNvbHVtbi5jbGVhcigpO1xuICAgICAgICAgIHN0cmVhbS5mb3JFYWNoKChlKSA9PiBPYmplY3Qua2V5cyhlKS5mb3JFYWNoKChrZXkpID0+IHRoaXMuX2hlYWRlckNvbHVtbi5hZGQoa2V5KSkpO1xuICAgICAgICAgIHRoaXMuY29sdW1uID0gQXJyYXkuZnJvbSh0aGlzLl9oZWFkZXJDb2x1bW4pO1xuICAgICAgICB9KSxcbiAgICAgICk7XG4gICAgfVxuXG4gICAgaWYgKCdoZWFkZXJDb2x1bW4nIGluIGNoYW5nZXMgJiYgQXJyYXkuaXNBcnJheShjaGFuZ2VzLmhlYWRlckNvbHVtbikpIHtcbiAgICAgIHRoaXMuY29sdW1uID0gY2hhbmdlcy5oZWFkZXJDb2x1bW47XG4gICAgfVxuICB9XG59XG4iLCJpbXBvcnQgeyBOZ01vZHVsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgQ29tbW9uTW9kdWxlIH0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uJztcbmltcG9ydCB7IFNjcm9sbERpc3BhdGNoTW9kdWxlIH0gZnJvbSAnQGFuZ3VsYXIvY2RrL3Njcm9sbGluZyc7XG5pbXBvcnQgeyBWaXJ0dWFsVGFibGVDb21wb25lbnQgfSBmcm9tICcuL2NvbXBvbmVudHMvdmlydHVhbC10YWJsZS5jb21wb25lbnQnO1xuaW1wb3J0IHsgQnJvd3NlckFuaW1hdGlvbnNNb2R1bGUgfSBmcm9tICdAYW5ndWxhci9wbGF0Zm9ybS1icm93c2VyL2FuaW1hdGlvbnMnO1xuaW1wb3J0IHsgQnJvd3Nlck1vZHVsZSB9IGZyb20gJ0Bhbmd1bGFyL3BsYXRmb3JtLWJyb3dzZXInO1xuQE5nTW9kdWxlKHtcbiAgZGVjbGFyYXRpb25zOiBbVmlydHVhbFRhYmxlQ29tcG9uZW50XSxcbiAgaW1wb3J0czogW0Jyb3dzZXJNb2R1bGUsIENvbW1vbk1vZHVsZSwgQnJvd3NlckFuaW1hdGlvbnNNb2R1bGUsIFNjcm9sbERpc3BhdGNoTW9kdWxlXSxcbiAgZXhwb3J0czogW1ZpcnR1YWxUYWJsZUNvbXBvbmVudF0sXG4gIHByb3ZpZGVyczogW10sXG59KVxuZXhwb3J0IGNsYXNzIE5nVmlydHVhbFRhYmxlTW9kdWxlIHt9XG4iXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7O0FBQUEsTUFjYSxxQkFBcUI7SUFObEM7UUFPVyxjQUFTLEdBQUcsRUFBRSxDQUFDO1FBTWhCLGtCQUFhLEdBQWdCLElBQUksR0FBRyxFQUFFLENBQUM7UUFFeEMsV0FBTSxHQUFrQixFQUFFLENBQUM7UUFFM0IsZ0JBQVcsR0FBd0MsS0FBSyxDQUFDO0tBaUJqRTs7Ozs7SUFmQyxXQUFXLENBQUMsT0FBc0I7UUFDaEMsSUFBSSxZQUFZLElBQUksT0FBTyxJQUFJLE9BQU8sQ0FBQyxVQUFVLFlBQVksVUFBVSxFQUFFO1lBQ3ZFLElBQUksQ0FBQyxXQUFXLEdBQUcsT0FBTyxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQ3hDLEdBQUcsQ0FBQyxDQUFDLE1BQStCO2dCQUNsQyxJQUFJLENBQUMsYUFBYSxDQUFDLEtBQUssRUFBRSxDQUFDO2dCQUMzQixNQUFNLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxLQUFLLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsR0FBRyxLQUFLLElBQUksQ0FBQyxhQUFhLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDcEYsSUFBSSxDQUFDLE1BQU0sR0FBRyxLQUFLLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxhQUFhLENBQUMsQ0FBQzthQUM5QyxDQUFDLENBQ0gsQ0FBQztTQUNIO1FBRUQsSUFBSSxjQUFjLElBQUksT0FBTyxJQUFJLEtBQUssQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLFlBQVksQ0FBQyxFQUFFO1lBQ3BFLElBQUksQ0FBQyxNQUFNLEdBQUcsT0FBTyxDQUFDLFlBQVksQ0FBQztTQUNwQztLQUNGOzs7WUFqQ0YsU0FBUyxTQUFDO2dCQUNULFFBQVEsRUFBRSxrQkFBa0I7Z0JBQzVCLHdUQUE2QztnQkFFN0MsZUFBZSxFQUFFLHVCQUF1QixDQUFDLE1BQU07YUFDaEQ7Ozt3QkFFRSxLQUFLO3lCQUVMLEtBQUs7MkJBRUwsS0FBSzs7Ozs7OztBQ25CUixNQVlhLG9CQUFvQjs7O1lBTmhDLFFBQVEsU0FBQztnQkFDUixZQUFZLEVBQUUsQ0FBQyxxQkFBcUIsQ0FBQztnQkFDckMsT0FBTyxFQUFFLENBQUMsYUFBYSxFQUFFLFlBQVksRUFBRSx1QkFBdUIsRUFBRSxvQkFBb0IsQ0FBQztnQkFDckYsT0FBTyxFQUFFLENBQUMscUJBQXFCLENBQUM7Z0JBQ2hDLFNBQVMsRUFBRSxFQUFFO2FBQ2Q7Ozs7Ozs7Ozs7Ozs7OzsifQ==