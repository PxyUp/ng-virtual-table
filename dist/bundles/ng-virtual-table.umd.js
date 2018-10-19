(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('@angular/core'), require('rxjs'), require('rxjs/operators'), require('@angular/common'), require('@angular/cdk/scrolling'), require('@angular/platform-browser/animations'), require('@angular/platform-browser')) :
    typeof define === 'function' && define.amd ? define('ng-virtual-table', ['exports', '@angular/core', 'rxjs', 'rxjs/operators', '@angular/common', '@angular/cdk/scrolling', '@angular/platform-browser/animations', '@angular/platform-browser'], factory) :
    (factory((global['ng-virtual-table'] = {}),global.ng.core,global.rxjs,global.rxjs.operators,global.ng.common,global.ng.cdk.scrolling,global.ng.platformBrowser.animations,global.ng.platformBrowser));
}(this, (function (exports,core,rxjs,operators,common,scrolling,animations,platformBrowser) { 'use strict';

    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
     */
    var VirtualTableComponent = /** @class */ (function () {
        function VirtualTableComponent() {
            this.itemCount = 50;
            this._headerColumn = new Set();
            this.column = [];
            this._dataStream = rxjs.EMPTY;
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
                if ('dataSource' in changes && changes.dataSource instanceof rxjs.Observable) {
                    this._dataStream = changes.dataSource.pipe(operators.tap(function (stream) {
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
            { type: core.Component, args: [{
                        selector: 'ng-virtual-table',
                        template: "<div class=\"table\">\n  <div class=\"header\">\n    <div *ngFor=\"let headerItem of column\">{{ headerItem }}</div>\n  </div>\n  <cdk-virtual-scroll-viewport itemSize=\"itemCount\">\n    <div *cdkVirtualFor=\"let item of _dataStream | async\">{{item}}</div>\n  </cdk-virtual-scroll-viewport>\n</div>",
                        changeDetection: core.ChangeDetectionStrategy.OnPush
                    }] }
        ];
        VirtualTableComponent.propDecorators = {
            itemCount: [{ type: core.Input }],
            dataSource: [{ type: core.Input }],
            headerColumn: [{ type: core.Input }]
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
            { type: core.NgModule, args: [{
                        declarations: [VirtualTableComponent],
                        imports: [platformBrowser.BrowserModule, common.CommonModule, animations.BrowserAnimationsModule, scrolling.ScrollDispatchModule],
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

    exports.NgVirtualTableModule = NgVirtualTableModule;
    exports.VirtualTableComponent = VirtualTableComponent;

    Object.defineProperty(exports, '__esModule', { value: true });

})));

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmctdmlydHVhbC10YWJsZS51bWQuanMubWFwIiwic291cmNlcyI6WyJuZzovL25nLXZpcnR1YWwtdGFibGUvc3JjL2NvbXBvbmVudHMvdmlydHVhbC10YWJsZS5jb21wb25lbnQudHMiLCJuZzovL25nLXZpcnR1YWwtdGFibGUvc3JjL25nVmlydHVhbFRhYmxlLm1vZHVsZS50cyJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBDb21wb25lbnQsIENoYW5nZURldGVjdGlvblN0cmF0ZWd5LCBJbnB1dCwgU2ltcGxlQ2hhbmdlcyB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgT2JzZXJ2YWJsZSwgRU1QVFkgfSBmcm9tICdyeGpzJztcbmltcG9ydCB7IHRhcCB9IGZyb20gJ3J4anMvb3BlcmF0b3JzJztcblxuaW50ZXJmYWNlIFZpcnR1YWxUYWJsZUl0ZW0ge1xuICBba2V5OiBzdHJpbmddOiBhbnk7XG59XG5cbkBDb21wb25lbnQoe1xuICBzZWxlY3RvcjogJ25nLXZpcnR1YWwtdGFibGUnLFxuICB0ZW1wbGF0ZVVybDogJy4vdmlydHVhbC10YWJsZS5jb21wb25lbnQuaHRtbCcsXG4gIHN0eWxlVXJsczogW10sXG4gIGNoYW5nZURldGVjdGlvbjogQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3kuT25QdXNoLFxufSlcbmV4cG9ydCBjbGFzcyBWaXJ0dWFsVGFibGVDb21wb25lbnQge1xuICBASW5wdXQoKSBpdGVtQ291bnQgPSA1MDtcblxuICBASW5wdXQoKSBkYXRhU291cmNlOiBPYnNlcnZhYmxlPEFycmF5PFZpcnR1YWxUYWJsZUl0ZW0+PjtcblxuICBASW5wdXQoKSBoZWFkZXJDb2x1bW46IEFycmF5PHN0cmluZz47XG5cbiAgcHJpdmF0ZSBfaGVhZGVyQ29sdW1uOiBTZXQ8c3RyaW5nPiA9IG5ldyBTZXQoKTtcblxuICBwdWJsaWMgY29sdW1uOiBBcnJheTxzdHJpbmc+ID0gW107XG5cbiAgcHVibGljIF9kYXRhU3RyZWFtOiBPYnNlcnZhYmxlPEFycmF5PFZpcnR1YWxUYWJsZUl0ZW0+PiA9IEVNUFRZO1xuXG4gIG5nT25DaGFuZ2VzKGNoYW5nZXM6IFNpbXBsZUNoYW5nZXMpIHtcbiAgICBpZiAoJ2RhdGFTb3VyY2UnIGluIGNoYW5nZXMgJiYgY2hhbmdlcy5kYXRhU291cmNlIGluc3RhbmNlb2YgT2JzZXJ2YWJsZSkge1xuICAgICAgdGhpcy5fZGF0YVN0cmVhbSA9IGNoYW5nZXMuZGF0YVNvdXJjZS5waXBlKFxuICAgICAgICB0YXAoKHN0cmVhbTogQXJyYXk8VmlydHVhbFRhYmxlSXRlbT4pID0+IHtcbiAgICAgICAgICB0aGlzLl9oZWFkZXJDb2x1bW4uY2xlYXIoKTtcbiAgICAgICAgICBzdHJlYW0uZm9yRWFjaCgoZSkgPT4gT2JqZWN0LmtleXMoZSkuZm9yRWFjaCgoa2V5KSA9PiB0aGlzLl9oZWFkZXJDb2x1bW4uYWRkKGtleSkpKTtcbiAgICAgICAgICB0aGlzLmNvbHVtbiA9IEFycmF5LmZyb20odGhpcy5faGVhZGVyQ29sdW1uKTtcbiAgICAgICAgfSksXG4gICAgICApO1xuICAgIH1cblxuICAgIGlmICgnaGVhZGVyQ29sdW1uJyBpbiBjaGFuZ2VzICYmIEFycmF5LmlzQXJyYXkoY2hhbmdlcy5oZWFkZXJDb2x1bW4pKSB7XG4gICAgICB0aGlzLmNvbHVtbiA9IGNoYW5nZXMuaGVhZGVyQ29sdW1uO1xuICAgIH1cbiAgfVxufVxuIiwiaW1wb3J0IHsgTmdNb2R1bGUgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IENvbW1vbk1vZHVsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbic7XG5pbXBvcnQgeyBTY3JvbGxEaXNwYXRjaE1vZHVsZSB9IGZyb20gJ0Bhbmd1bGFyL2Nkay9zY3JvbGxpbmcnO1xuaW1wb3J0IHsgVmlydHVhbFRhYmxlQ29tcG9uZW50IH0gZnJvbSAnLi9jb21wb25lbnRzL3ZpcnR1YWwtdGFibGUuY29tcG9uZW50JztcbmltcG9ydCB7IEJyb3dzZXJBbmltYXRpb25zTW9kdWxlIH0gZnJvbSAnQGFuZ3VsYXIvcGxhdGZvcm0tYnJvd3Nlci9hbmltYXRpb25zJztcbmltcG9ydCB7IEJyb3dzZXJNb2R1bGUgfSBmcm9tICdAYW5ndWxhci9wbGF0Zm9ybS1icm93c2VyJztcbkBOZ01vZHVsZSh7XG4gIGRlY2xhcmF0aW9uczogW1ZpcnR1YWxUYWJsZUNvbXBvbmVudF0sXG4gIGltcG9ydHM6IFtCcm93c2VyTW9kdWxlLCBDb21tb25Nb2R1bGUsIEJyb3dzZXJBbmltYXRpb25zTW9kdWxlLCBTY3JvbGxEaXNwYXRjaE1vZHVsZV0sXG4gIGV4cG9ydHM6IFtWaXJ0dWFsVGFibGVDb21wb25lbnRdLFxuICBwcm92aWRlcnM6IFtdLFxufSlcbmV4cG9ydCBjbGFzcyBOZ1ZpcnR1YWxUYWJsZU1vZHVsZSB7fVxuIl0sIm5hbWVzIjpbIkVNUFRZIiwiT2JzZXJ2YWJsZSIsInRhcCIsIkNvbXBvbmVudCIsIkNoYW5nZURldGVjdGlvblN0cmF0ZWd5IiwiSW5wdXQiLCJOZ01vZHVsZSIsIkJyb3dzZXJNb2R1bGUiLCJDb21tb25Nb2R1bGUiLCJCcm93c2VyQW5pbWF0aW9uc01vZHVsZSIsIlNjcm9sbERpc3BhdGNoTW9kdWxlIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0FBQUE7UUFRQTtZQU9XLGNBQVMsR0FBRyxFQUFFLENBQUM7WUFNaEIsa0JBQWEsR0FBZ0IsSUFBSSxHQUFHLEVBQUUsQ0FBQztZQUV4QyxXQUFNLEdBQWtCLEVBQUUsQ0FBQztZQUUzQixnQkFBVyxHQUF3Q0EsVUFBSyxDQUFDO1NBaUJqRTs7Ozs7UUFmQywyQ0FBVzs7OztZQUFYLFVBQVksT0FBc0I7Z0JBQWxDLGlCQWNDO2dCQWJDLElBQUksWUFBWSxJQUFJLE9BQU8sSUFBSSxPQUFPLENBQUMsVUFBVSxZQUFZQyxlQUFVLEVBQUU7b0JBQ3ZFLElBQUksQ0FBQyxXQUFXLEdBQUcsT0FBTyxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQ3hDQyxhQUFHLENBQUMsVUFBQyxNQUErQjt3QkFDbEMsS0FBSSxDQUFDLGFBQWEsQ0FBQyxLQUFLLEVBQUUsQ0FBQzt3QkFDM0IsTUFBTSxDQUFDLE9BQU8sQ0FBQyxVQUFDLENBQUMsSUFBSyxPQUFBLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLFVBQUMsR0FBRyxJQUFLLE9BQUEsS0FBSSxDQUFDLGFBQWEsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUEsQ0FBQyxHQUFBLENBQUMsQ0FBQzt3QkFDcEYsS0FBSSxDQUFDLE1BQU0sR0FBRyxLQUFLLENBQUMsSUFBSSxDQUFDLEtBQUksQ0FBQyxhQUFhLENBQUMsQ0FBQztxQkFDOUMsQ0FBQyxDQUNILENBQUM7aUJBQ0g7Z0JBRUQsSUFBSSxjQUFjLElBQUksT0FBTyxJQUFJLEtBQUssQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLFlBQVksQ0FBQyxFQUFFO29CQUNwRSxJQUFJLENBQUMsTUFBTSxHQUFHLE9BQU8sQ0FBQyxZQUFZLENBQUM7aUJBQ3BDO2FBQ0Y7O29CQWpDRkMsY0FBUyxTQUFDO3dCQUNULFFBQVEsRUFBRSxrQkFBa0I7d0JBQzVCLHdUQUE2Qzt3QkFFN0MsZUFBZSxFQUFFQyw0QkFBdUIsQ0FBQyxNQUFNO3FCQUNoRDs7O2dDQUVFQyxVQUFLO2lDQUVMQSxVQUFLO21DQUVMQSxVQUFLOztRQXVCUiw0QkFBQztLQWxDRDs7Ozs7O0FDUkE7UUFNQTtTQU1vQzs7b0JBTm5DQyxhQUFRLFNBQUM7d0JBQ1IsWUFBWSxFQUFFLENBQUMscUJBQXFCLENBQUM7d0JBQ3JDLE9BQU8sRUFBRSxDQUFDQyw2QkFBYSxFQUFFQyxtQkFBWSxFQUFFQyxrQ0FBdUIsRUFBRUMsOEJBQW9CLENBQUM7d0JBQ3JGLE9BQU8sRUFBRSxDQUFDLHFCQUFxQixDQUFDO3dCQUNoQyxTQUFTLEVBQUUsRUFBRTtxQkFDZDs7UUFDa0MsMkJBQUM7S0FOcEM7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OyJ9