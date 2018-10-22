(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('@angular/core'), require('rxjs'), require('rxjs/operators'), require('@angular/forms'), require('@angular/common'), require('@angular/cdk/scrolling'), require('@angular/platform-browser/animations'), require('@angular/material/icon'), require('@angular/material/form-field')) :
    typeof define === 'function' && define.amd ? define('ng-virtual-table', ['exports', '@angular/core', 'rxjs', 'rxjs/operators', '@angular/forms', '@angular/common', '@angular/cdk/scrolling', '@angular/platform-browser/animations', '@angular/material/icon', '@angular/material/form-field'], factory) :
    (factory((global['ng-virtual-table'] = {}),global.ng.core,global.rxjs,global.rxjs.operators,global.ng.forms,global.ng.common,global.ng.cdk.scrolling,global.ng.platformBrowser.animations,global.ng.material.icon,global.ng.material['form-field']));
}(this, (function (exports,core,rxjs,operators,forms,common,scrolling,animations,icon,formField) { 'use strict';

    /*! *****************************************************************************
    Copyright (c) Microsoft Corporation. All rights reserved.
    Licensed under the Apache License, Version 2.0 (the "License"); you may not use
    this file except in compliance with the License. You may obtain a copy of the
    License at http://www.apache.org/licenses/LICENSE-2.0

    THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
    KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
    WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
    MERCHANTABLITY OR NON-INFRINGEMENT.

    See the Apache Version 2.0 License for specific language governing permissions
    and limitations under the License.
    ***************************************************************************** */
    var __assign = function () {
        __assign = Object.assign || function __assign(t) {
            for (var s, i = 1, n = arguments.length; i < n; i++) {
                s = arguments[i];
                for (var p in s)
                    if (Object.prototype.hasOwnProperty.call(s, p))
                        t[p] = s[p];
            }
            return t;
        };
        return __assign.apply(this, arguments);
    };
    function __read(o, n) {
        var m = typeof Symbol === "function" && o[Symbol.iterator];
        if (!m)
            return o;
        var i = m.call(o), r, ar = [], e;
        try {
            while ((n === void 0 || n-- > 0) && !(r = i.next()).done)
                ar.push(r.value);
        }
        catch (error) {
            e = { error: error };
        }
        finally {
            try {
                if (r && !r.done && (m = i["return"]))
                    m.call(i);
            }
            finally {
                if (e)
                    throw e.error;
            }
        }
        return ar;
    }

    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
     */
    var VirtualTableComponent = /** @class */ (function () {
        function VirtualTableComponent() {
            this.itemCount = 25;
            this.filterIsOpen = false;
            this.filterPlaceholder = 'Filter';
            this.filterControl = new forms.FormControl('');
            this._headerDict = Object.create(null);
            this.column = [];
            this._dataStream = rxjs.EMPTY;
            this.sort$ = new rxjs.Subject();
            this._destroyed$ = new rxjs.Subject();
            this._headerWasSet = false;
            this.filter$ = this.filterControl.valueChanges.pipe(operators.debounceTime(300), operators.startWith(null), operators.distinctUntilChanged(), operators.takeUntil(this._destroyed$));
        }
        /**
         * @param {?} column
         * @return {?}
         */
        VirtualTableComponent.prototype.applySort = /**
         * @param {?} column
         * @return {?}
         */
            function (column) {
                this.column = ( /** @type {?} */(this.column.map(function (item) {
                    if (item.key !== column) {
                        return __assign({}, item, { sort: null });
                    }
                    if (item.sort === null) {
                        return __assign({}, item, { sort: 'asc' });
                    }
                    if (item.sort === 'asc') {
                        return __assign({}, item, { sort: 'desc' });
                    }
                    if (item.sort === 'desc') {
                        return __assign({}, item, { sort: null });
                    }
                })));
                this.sort$.next(column);
            };
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
                if ('config' in changes) {
                    this._config = ( /** @type {?} */(changes.config.currentValue));
                    this.column = this.createColumnFromArray(this._config.column);
                }
                if ('dataSource' in changes) {
                    /** @type {?} */
                    var newDataSource = ( /** @type {?} */(changes.dataSource.currentValue));
                    this._dataStream = rxjs.combineLatest(this.sort$.asObservable().pipe(operators.startWith(null)), this.filter$, newDataSource.pipe(operators.tap(function (stream) {
                        if (!_this._headerWasSet) {
                            /** @type {?} */
                            var setOfColumn_1 = new Set();
                            stream.forEach(function (e) { return Object.keys(e).forEach(function (key) { return setOfColumn_1.add(key); }); });
                            /** @type {?} */
                            var autoColumnArray = Array.from(setOfColumn_1);
                            _this.column = _this.createColumnFromArray(autoColumnArray);
                        }
                    }))).pipe(operators.map(function (_a) {
                        var _b = __read(_a, 3), sort = _b[0], filterString = _b[1], stream = _b[2];
                        /** @type {?} */
                        var sliceStream = stream.slice();
                        /** @type {?} */
                        var sortColumn = _this.column.find(function (e) { return e.key === sort; });
                        if (!sort || !sortColumn) {
                            return [filterString, sliceStream];
                        }
                        if (!sortColumn.sort) {
                            return [filterString, sliceStream];
                        }
                        /** @type {?} */
                        var _sortColumn = _this._headerDict[sort];
                        if (sortColumn.sort === 'asc') {
                            sliceStream.sort(function (a, b) {
                                return _this.getElement(a, _sortColumn.func) > _this.getElement(b, _sortColumn.func)
                                    ? 1
                                    : _this.getElement(a, _sortColumn.func) === _this.getElement(b, _sortColumn.func)
                                        ? 0
                                        : -1;
                            });
                        }
                        else {
                            sliceStream.sort(function (a, b) {
                                return _this.getElement(a, _sortColumn.func) < _this.getElement(b, _sortColumn.func)
                                    ? 1
                                    : _this.getElement(a, _sortColumn.func) === _this.getElement(b, _sortColumn.func)
                                        ? 0
                                        : -1;
                            });
                        }
                        return [filterString, sliceStream];
                    }), operators.map(function (_a) {
                        var _b = __read(_a, 2), filterString = _b[0], stream = _b[1];
                        console.log(filterString, 'filter');
                        console.log(stream);
                        /** @type {?} */
                        var sliceStream = stream.slice();
                        if (!filterString) {
                            return sliceStream;
                        }
                        /** @type {?} */
                        var filter = filterString.toLocaleLowerCase();
                        /** @type {?} */
                        var filterSliceStream = sliceStream.filter(function (item) {
                            return Object.keys(item).some(function (key) { return item[key] && item[key].toString().toLocaleLowerCase().indexOf(filter) > -1; });
                        });
                        return filterSliceStream;
                    }), operators.publishBehavior([]), operators.refCount());
                    this.isEmptySubject$ = this._dataStream.pipe(operators.map(function (data) { return !data.length; }));
                }
            };
        /**
         * @param {?} arr
         * @return {?}
         */
        VirtualTableComponent.prototype.createColumnFromArray = /**
         * @param {?} arr
         * @return {?}
         */
            function (arr) {
                var _this = this;
                if (!arr || arr.length === 0) {
                    return;
                }
                this._headerWasSet = true;
                /** @type {?} */
                var columnArr = arr.map(function (item) {
                    /** @type {?} */
                    var columnItem;
                    if (typeof item === 'string') {
                        columnItem = _this.createColumnFromString(item);
                    }
                    else {
                        columnItem = item;
                    }
                    if (_this._headerDict[columnItem.key]) {
                        throw Error("Column key=" + columnItem.key + " already declare");
                    }
                    _this._headerDict[columnItem.key] = columnItem;
                    return columnItem;
                });
                return columnArr;
            };
        /**
         * @param {?} item
         * @param {?} func
         * @return {?}
         */
        VirtualTableComponent.prototype.getElement = /**
         * @param {?} item
         * @param {?} func
         * @return {?}
         */
            function (item, func) {
                return func.call(this, item);
            };
        /**
         * @param {?} str
         * @return {?}
         */
        VirtualTableComponent.prototype.createColumnFromString = /**
         * @param {?} str
         * @return {?}
         */
            function (str) {
                return {
                    name: str,
                    key: str,
                    func: function (item) { return item[str]; },
                    sort: null,
                };
            };
        /**
         * @return {?}
         */
        VirtualTableComponent.prototype.ngOnDestroy = /**
         * @return {?}
         */
            function () {
                this._destroyed$.next();
            };
        /**
         * @param {?} item
         * @return {?}
         */
        VirtualTableComponent.prototype.clickItem = /**
         * @param {?} item
         * @return {?}
         */
            function (item) {
                if (typeof this.onRowClick === 'function')
                    this.onRowClick(item);
            };
        /**
         * @return {?}
         */
        VirtualTableComponent.prototype.toggleFilter = /**
         * @return {?}
         */
            function () {
                var _this = this;
                this.filterIsOpen = !this.filterIsOpen;
                if (this.filterIsOpen) {
                    setTimeout(function () {
                        _this.inputFilterFocus.nativeElement.focus();
                    });
                }
                this.filterControl.setValue('', { emitEvent: !this.filterIsOpen });
            };
        VirtualTableComponent.decorators = [
            { type: core.Component, args: [{
                        selector: 'ng-virtual-table',
                        template: "<div class=\"table\">\n  <div class=\"header\">\n    <div *ngFor=\"let headerItem of column\" class=\"header-item\" (click)=\"applySort(headerItem.key)\" [ngClass]=\"headerItem.sort\">{{\n      headerItem.name\n      }}</div>\n    <div class=\"filter-spot\" [ngClass]=\"[filterIsOpen ? 'open' : '']\">\n      <input #inputFilterFocus class=\"filter-spot-input\" matInput [placeholder]=\"filterPlaceholder\" [formControl]=\"filterControl\">\n      <mat-icon (click)=\"toggleFilter()\">{{ filterIsOpen ? 'close' : 'filter_list' }}</mat-icon>\n    </div>\n  </div>\n  <div class=\"virtual-table-content\">\n    <cdk-virtual-scroll-viewport *ngIf=\"!(isEmptySubject$ | async); else emptyContainer\" [itemSize]=\"itemCount\">\n      <div *cdkVirtualFor=\"let item of _dataStream;templateCacheSize: 0\" class=\"virtual-table-row\" (click)=\"clickItem(item)\">\n        <div *ngFor=\"let headerItem of column\" class=\"virtual-table-column\">{{\n          item[headerItem.name] }}</div>\n      </div>\n    </cdk-virtual-scroll-viewport>\n    <ng-template #emptyContainer>\n      Data is empty\n    </ng-template>\n  </div>\n</div>",
                        changeDetection: core.ChangeDetectionStrategy.OnPush,
                        styles: ["@font-face{font-family:'Material Icons';font-style:normal;font-weight:400;src:url(https://fonts.gstatic.com/s/materialicons/v41/flUhRq6tzZclQEJ-Vdg-IuiaDsNcIhQ8tQ.woff2) format(\"woff2\")}:host{display:block;position:relative}:host mat-icon::ng-deep{font-family:'Material Icons'}.table{height:100%;position:relative}.table .header{display:flex;margin-top:8px;height:40px;align-items:center;justify-content:space-between;border-bottom:1px solid #000}.table .header .filter-spot{display:flex;align-items:center;right:0;width:15px;min-width:15px;height:100%;position:relative}.table .header .filter-spot .filter-spot-input{display:none}.table .header .filter-spot mat-icon{cursor:pointer;margin-top:9px}.table .header .filter-spot.open mat-icon{z-index:1}.table .header .filter-spot.open .filter-spot-input{display:block;position:absolute;right:0}.table .header-item{cursor:pointer;display:flex;align-items:center;width:100%;height:100%;padding-left:16px}.table .header-item.asc:after{margin-right:4px;content:'arrow_downward';font-family:\"Material Icons\"}.table .header-item.desc:after{margin-right:4px;font-family:'Material Icons';content:'arrow_upward'}.table .virtual-table-content cdk-virtual-scroll-viewport::ng-deep{height:100%;width:100%}.table .virtual-table-content,.table .virtual-table-empty{display:flex;flex-direction:column;height:calc(100% - 40px)}.table .virtual-table-row{display:flex;flex-direction:row;min-height:20px;justify-content:space-between;align-items:center}.table .virtual-table-column{display:flex;width:100%;padding-left:16px;height:100%;align-items:center}"]
                    }] }
        ];
        VirtualTableComponent.propDecorators = {
            inputFilterFocus: [{ type: core.ViewChild, args: ['inputFilterFocus',] }],
            dataSource: [{ type: core.Input }],
            filterPlaceholder: [{ type: core.Input }],
            config: [{ type: core.Input }],
            onRowClick: [{ type: core.Input }]
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
                        imports: [
                            common.CommonModule,
                            forms.ReactiveFormsModule,
                            animations.BrowserAnimationsModule,
                            icon.MatIconModule,
                            formField.MatFormFieldModule,
                            scrolling.ScrollDispatchModule,
                        ],
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

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmctdmlydHVhbC10YWJsZS51bWQuanMubWFwIiwic291cmNlcyI6WyJub2RlX21vZHVsZXMvdHNsaWIvdHNsaWIuZXM2LmpzIiwibmc6Ly9uZy12aXJ0dWFsLXRhYmxlL3NyYy9jb21wb25lbnRzL3ZpcnR1YWwtdGFibGUuY29tcG9uZW50LnRzIiwibmc6Ly9uZy12aXJ0dWFsLXRhYmxlL3NyYy9uZ1ZpcnR1YWxUYWJsZS5tb2R1bGUudHMiXSwic291cmNlc0NvbnRlbnQiOlsiLyohICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXHJcbkNvcHlyaWdodCAoYykgTWljcm9zb2Z0IENvcnBvcmF0aW9uLiBBbGwgcmlnaHRzIHJlc2VydmVkLlxyXG5MaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpOyB5b3UgbWF5IG5vdCB1c2VcclxudGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGVcclxuTGljZW5zZSBhdCBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcclxuXHJcblRISVMgQ09ERSBJUyBQUk9WSURFRCBPTiBBTiAqQVMgSVMqIEJBU0lTLCBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTllcclxuS0lORCwgRUlUSEVSIEVYUFJFU1MgT1IgSU1QTElFRCwgSU5DTFVESU5HIFdJVEhPVVQgTElNSVRBVElPTiBBTlkgSU1QTElFRFxyXG5XQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgVElUTEUsIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFLFxyXG5NRVJDSEFOVEFCTElUWSBPUiBOT04tSU5GUklOR0VNRU5ULlxyXG5cclxuU2VlIHRoZSBBcGFjaGUgVmVyc2lvbiAyLjAgTGljZW5zZSBmb3Igc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zXHJcbmFuZCBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cclxuKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiogKi9cclxuLyogZ2xvYmFsIFJlZmxlY3QsIFByb21pc2UgKi9cclxuXHJcbnZhciBleHRlbmRTdGF0aWNzID0gZnVuY3Rpb24oZCwgYikge1xyXG4gICAgZXh0ZW5kU3RhdGljcyA9IE9iamVjdC5zZXRQcm90b3R5cGVPZiB8fFxyXG4gICAgICAgICh7IF9fcHJvdG9fXzogW10gfSBpbnN0YW5jZW9mIEFycmF5ICYmIGZ1bmN0aW9uIChkLCBiKSB7IGQuX19wcm90b19fID0gYjsgfSkgfHxcclxuICAgICAgICBmdW5jdGlvbiAoZCwgYikgeyBmb3IgKHZhciBwIGluIGIpIGlmIChiLmhhc093blByb3BlcnR5KHApKSBkW3BdID0gYltwXTsgfTtcclxuICAgIHJldHVybiBleHRlbmRTdGF0aWNzKGQsIGIpO1xyXG59O1xyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fZXh0ZW5kcyhkLCBiKSB7XHJcbiAgICBleHRlbmRTdGF0aWNzKGQsIGIpO1xyXG4gICAgZnVuY3Rpb24gX18oKSB7IHRoaXMuY29uc3RydWN0b3IgPSBkOyB9XHJcbiAgICBkLnByb3RvdHlwZSA9IGIgPT09IG51bGwgPyBPYmplY3QuY3JlYXRlKGIpIDogKF9fLnByb3RvdHlwZSA9IGIucHJvdG90eXBlLCBuZXcgX18oKSk7XHJcbn1cclxuXHJcbmV4cG9ydCB2YXIgX19hc3NpZ24gPSBmdW5jdGlvbigpIHtcclxuICAgIF9fYXNzaWduID0gT2JqZWN0LmFzc2lnbiB8fCBmdW5jdGlvbiBfX2Fzc2lnbih0KSB7XHJcbiAgICAgICAgZm9yICh2YXIgcywgaSA9IDEsIG4gPSBhcmd1bWVudHMubGVuZ3RoOyBpIDwgbjsgaSsrKSB7XHJcbiAgICAgICAgICAgIHMgPSBhcmd1bWVudHNbaV07XHJcbiAgICAgICAgICAgIGZvciAodmFyIHAgaW4gcykgaWYgKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChzLCBwKSkgdFtwXSA9IHNbcF07XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiB0O1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIF9fYXNzaWduLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX3Jlc3QocywgZSkge1xyXG4gICAgdmFyIHQgPSB7fTtcclxuICAgIGZvciAodmFyIHAgaW4gcykgaWYgKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChzLCBwKSAmJiBlLmluZGV4T2YocCkgPCAwKVxyXG4gICAgICAgIHRbcF0gPSBzW3BdO1xyXG4gICAgaWYgKHMgIT0gbnVsbCAmJiB0eXBlb2YgT2JqZWN0LmdldE93blByb3BlcnR5U3ltYm9scyA9PT0gXCJmdW5jdGlvblwiKVxyXG4gICAgICAgIGZvciAodmFyIGkgPSAwLCBwID0gT2JqZWN0LmdldE93blByb3BlcnR5U3ltYm9scyhzKTsgaSA8IHAubGVuZ3RoOyBpKyspIGlmIChlLmluZGV4T2YocFtpXSkgPCAwKVxyXG4gICAgICAgICAgICB0W3BbaV1dID0gc1twW2ldXTtcclxuICAgIHJldHVybiB0O1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19kZWNvcmF0ZShkZWNvcmF0b3JzLCB0YXJnZXQsIGtleSwgZGVzYykge1xyXG4gICAgdmFyIGMgPSBhcmd1bWVudHMubGVuZ3RoLCByID0gYyA8IDMgPyB0YXJnZXQgOiBkZXNjID09PSBudWxsID8gZGVzYyA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IodGFyZ2V0LCBrZXkpIDogZGVzYywgZDtcclxuICAgIGlmICh0eXBlb2YgUmVmbGVjdCA9PT0gXCJvYmplY3RcIiAmJiB0eXBlb2YgUmVmbGVjdC5kZWNvcmF0ZSA9PT0gXCJmdW5jdGlvblwiKSByID0gUmVmbGVjdC5kZWNvcmF0ZShkZWNvcmF0b3JzLCB0YXJnZXQsIGtleSwgZGVzYyk7XHJcbiAgICBlbHNlIGZvciAodmFyIGkgPSBkZWNvcmF0b3JzLmxlbmd0aCAtIDE7IGkgPj0gMDsgaS0tKSBpZiAoZCA9IGRlY29yYXRvcnNbaV0pIHIgPSAoYyA8IDMgPyBkKHIpIDogYyA+IDMgPyBkKHRhcmdldCwga2V5LCByKSA6IGQodGFyZ2V0LCBrZXkpKSB8fCByO1xyXG4gICAgcmV0dXJuIGMgPiAzICYmIHIgJiYgT2JqZWN0LmRlZmluZVByb3BlcnR5KHRhcmdldCwga2V5LCByKSwgcjtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fcGFyYW0ocGFyYW1JbmRleCwgZGVjb3JhdG9yKSB7XHJcbiAgICByZXR1cm4gZnVuY3Rpb24gKHRhcmdldCwga2V5KSB7IGRlY29yYXRvcih0YXJnZXQsIGtleSwgcGFyYW1JbmRleCk7IH1cclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fbWV0YWRhdGEobWV0YWRhdGFLZXksIG1ldGFkYXRhVmFsdWUpIHtcclxuICAgIGlmICh0eXBlb2YgUmVmbGVjdCA9PT0gXCJvYmplY3RcIiAmJiB0eXBlb2YgUmVmbGVjdC5tZXRhZGF0YSA9PT0gXCJmdW5jdGlvblwiKSByZXR1cm4gUmVmbGVjdC5tZXRhZGF0YShtZXRhZGF0YUtleSwgbWV0YWRhdGFWYWx1ZSk7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX2F3YWl0ZXIodGhpc0FyZywgX2FyZ3VtZW50cywgUCwgZ2VuZXJhdG9yKSB7XHJcbiAgICByZXR1cm4gbmV3IChQIHx8IChQID0gUHJvbWlzZSkpKGZ1bmN0aW9uIChyZXNvbHZlLCByZWplY3QpIHtcclxuICAgICAgICBmdW5jdGlvbiBmdWxmaWxsZWQodmFsdWUpIHsgdHJ5IHsgc3RlcChnZW5lcmF0b3IubmV4dCh2YWx1ZSkpOyB9IGNhdGNoIChlKSB7IHJlamVjdChlKTsgfSB9XHJcbiAgICAgICAgZnVuY3Rpb24gcmVqZWN0ZWQodmFsdWUpIHsgdHJ5IHsgc3RlcChnZW5lcmF0b3JbXCJ0aHJvd1wiXSh2YWx1ZSkpOyB9IGNhdGNoIChlKSB7IHJlamVjdChlKTsgfSB9XHJcbiAgICAgICAgZnVuY3Rpb24gc3RlcChyZXN1bHQpIHsgcmVzdWx0LmRvbmUgPyByZXNvbHZlKHJlc3VsdC52YWx1ZSkgOiBuZXcgUChmdW5jdGlvbiAocmVzb2x2ZSkgeyByZXNvbHZlKHJlc3VsdC52YWx1ZSk7IH0pLnRoZW4oZnVsZmlsbGVkLCByZWplY3RlZCk7IH1cclxuICAgICAgICBzdGVwKChnZW5lcmF0b3IgPSBnZW5lcmF0b3IuYXBwbHkodGhpc0FyZywgX2FyZ3VtZW50cyB8fCBbXSkpLm5leHQoKSk7XHJcbiAgICB9KTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fZ2VuZXJhdG9yKHRoaXNBcmcsIGJvZHkpIHtcclxuICAgIHZhciBfID0geyBsYWJlbDogMCwgc2VudDogZnVuY3Rpb24oKSB7IGlmICh0WzBdICYgMSkgdGhyb3cgdFsxXTsgcmV0dXJuIHRbMV07IH0sIHRyeXM6IFtdLCBvcHM6IFtdIH0sIGYsIHksIHQsIGc7XHJcbiAgICByZXR1cm4gZyA9IHsgbmV4dDogdmVyYigwKSwgXCJ0aHJvd1wiOiB2ZXJiKDEpLCBcInJldHVyblwiOiB2ZXJiKDIpIH0sIHR5cGVvZiBTeW1ib2wgPT09IFwiZnVuY3Rpb25cIiAmJiAoZ1tTeW1ib2wuaXRlcmF0b3JdID0gZnVuY3Rpb24oKSB7IHJldHVybiB0aGlzOyB9KSwgZztcclxuICAgIGZ1bmN0aW9uIHZlcmIobikgeyByZXR1cm4gZnVuY3Rpb24gKHYpIHsgcmV0dXJuIHN0ZXAoW24sIHZdKTsgfTsgfVxyXG4gICAgZnVuY3Rpb24gc3RlcChvcCkge1xyXG4gICAgICAgIGlmIChmKSB0aHJvdyBuZXcgVHlwZUVycm9yKFwiR2VuZXJhdG9yIGlzIGFscmVhZHkgZXhlY3V0aW5nLlwiKTtcclxuICAgICAgICB3aGlsZSAoXykgdHJ5IHtcclxuICAgICAgICAgICAgaWYgKGYgPSAxLCB5ICYmICh0ID0gb3BbMF0gJiAyID8geVtcInJldHVyblwiXSA6IG9wWzBdID8geVtcInRocm93XCJdIHx8ICgodCA9IHlbXCJyZXR1cm5cIl0pICYmIHQuY2FsbCh5KSwgMCkgOiB5Lm5leHQpICYmICEodCA9IHQuY2FsbCh5LCBvcFsxXSkpLmRvbmUpIHJldHVybiB0O1xyXG4gICAgICAgICAgICBpZiAoeSA9IDAsIHQpIG9wID0gW29wWzBdICYgMiwgdC52YWx1ZV07XHJcbiAgICAgICAgICAgIHN3aXRjaCAob3BbMF0pIHtcclxuICAgICAgICAgICAgICAgIGNhc2UgMDogY2FzZSAxOiB0ID0gb3A7IGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgY2FzZSA0OiBfLmxhYmVsKys7IHJldHVybiB7IHZhbHVlOiBvcFsxXSwgZG9uZTogZmFsc2UgfTtcclxuICAgICAgICAgICAgICAgIGNhc2UgNTogXy5sYWJlbCsrOyB5ID0gb3BbMV07IG9wID0gWzBdOyBjb250aW51ZTtcclxuICAgICAgICAgICAgICAgIGNhc2UgNzogb3AgPSBfLm9wcy5wb3AoKTsgXy50cnlzLnBvcCgpOyBjb250aW51ZTtcclxuICAgICAgICAgICAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKCEodCA9IF8udHJ5cywgdCA9IHQubGVuZ3RoID4gMCAmJiB0W3QubGVuZ3RoIC0gMV0pICYmIChvcFswXSA9PT0gNiB8fCBvcFswXSA9PT0gMikpIHsgXyA9IDA7IGNvbnRpbnVlOyB9XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKG9wWzBdID09PSAzICYmICghdCB8fCAob3BbMV0gPiB0WzBdICYmIG9wWzFdIDwgdFszXSkpKSB7IF8ubGFiZWwgPSBvcFsxXTsgYnJlYWs7IH1cclxuICAgICAgICAgICAgICAgICAgICBpZiAob3BbMF0gPT09IDYgJiYgXy5sYWJlbCA8IHRbMV0pIHsgXy5sYWJlbCA9IHRbMV07IHQgPSBvcDsgYnJlYWs7IH1cclxuICAgICAgICAgICAgICAgICAgICBpZiAodCAmJiBfLmxhYmVsIDwgdFsyXSkgeyBfLmxhYmVsID0gdFsyXTsgXy5vcHMucHVzaChvcCk7IGJyZWFrOyB9XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHRbMl0pIF8ub3BzLnBvcCgpO1xyXG4gICAgICAgICAgICAgICAgICAgIF8udHJ5cy5wb3AoKTsgY29udGludWU7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgb3AgPSBib2R5LmNhbGwodGhpc0FyZywgXyk7XHJcbiAgICAgICAgfSBjYXRjaCAoZSkgeyBvcCA9IFs2LCBlXTsgeSA9IDA7IH0gZmluYWxseSB7IGYgPSB0ID0gMDsgfVxyXG4gICAgICAgIGlmIChvcFswXSAmIDUpIHRocm93IG9wWzFdOyByZXR1cm4geyB2YWx1ZTogb3BbMF0gPyBvcFsxXSA6IHZvaWQgMCwgZG9uZTogdHJ1ZSB9O1xyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19leHBvcnRTdGFyKG0sIGV4cG9ydHMpIHtcclxuICAgIGZvciAodmFyIHAgaW4gbSkgaWYgKCFleHBvcnRzLmhhc093blByb3BlcnR5KHApKSBleHBvcnRzW3BdID0gbVtwXTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fdmFsdWVzKG8pIHtcclxuICAgIHZhciBtID0gdHlwZW9mIFN5bWJvbCA9PT0gXCJmdW5jdGlvblwiICYmIG9bU3ltYm9sLml0ZXJhdG9yXSwgaSA9IDA7XHJcbiAgICBpZiAobSkgcmV0dXJuIG0uY2FsbChvKTtcclxuICAgIHJldHVybiB7XHJcbiAgICAgICAgbmV4dDogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICBpZiAobyAmJiBpID49IG8ubGVuZ3RoKSBvID0gdm9pZCAwO1xyXG4gICAgICAgICAgICByZXR1cm4geyB2YWx1ZTogbyAmJiBvW2krK10sIGRvbmU6ICFvIH07XHJcbiAgICAgICAgfVxyXG4gICAgfTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fcmVhZChvLCBuKSB7XHJcbiAgICB2YXIgbSA9IHR5cGVvZiBTeW1ib2wgPT09IFwiZnVuY3Rpb25cIiAmJiBvW1N5bWJvbC5pdGVyYXRvcl07XHJcbiAgICBpZiAoIW0pIHJldHVybiBvO1xyXG4gICAgdmFyIGkgPSBtLmNhbGwobyksIHIsIGFyID0gW10sIGU7XHJcbiAgICB0cnkge1xyXG4gICAgICAgIHdoaWxlICgobiA9PT0gdm9pZCAwIHx8IG4tLSA+IDApICYmICEociA9IGkubmV4dCgpKS5kb25lKSBhci5wdXNoKHIudmFsdWUpO1xyXG4gICAgfVxyXG4gICAgY2F0Y2ggKGVycm9yKSB7IGUgPSB7IGVycm9yOiBlcnJvciB9OyB9XHJcbiAgICBmaW5hbGx5IHtcclxuICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICBpZiAociAmJiAhci5kb25lICYmIChtID0gaVtcInJldHVyblwiXSkpIG0uY2FsbChpKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZmluYWxseSB7IGlmIChlKSB0aHJvdyBlLmVycm9yOyB9XHJcbiAgICB9XHJcbiAgICByZXR1cm4gYXI7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX3NwcmVhZCgpIHtcclxuICAgIGZvciAodmFyIGFyID0gW10sIGkgPSAwOyBpIDwgYXJndW1lbnRzLmxlbmd0aDsgaSsrKVxyXG4gICAgICAgIGFyID0gYXIuY29uY2F0KF9fcmVhZChhcmd1bWVudHNbaV0pKTtcclxuICAgIHJldHVybiBhcjtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fYXdhaXQodikge1xyXG4gICAgcmV0dXJuIHRoaXMgaW5zdGFuY2VvZiBfX2F3YWl0ID8gKHRoaXMudiA9IHYsIHRoaXMpIDogbmV3IF9fYXdhaXQodik7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX2FzeW5jR2VuZXJhdG9yKHRoaXNBcmcsIF9hcmd1bWVudHMsIGdlbmVyYXRvcikge1xyXG4gICAgaWYgKCFTeW1ib2wuYXN5bmNJdGVyYXRvcikgdGhyb3cgbmV3IFR5cGVFcnJvcihcIlN5bWJvbC5hc3luY0l0ZXJhdG9yIGlzIG5vdCBkZWZpbmVkLlwiKTtcclxuICAgIHZhciBnID0gZ2VuZXJhdG9yLmFwcGx5KHRoaXNBcmcsIF9hcmd1bWVudHMgfHwgW10pLCBpLCBxID0gW107XHJcbiAgICByZXR1cm4gaSA9IHt9LCB2ZXJiKFwibmV4dFwiKSwgdmVyYihcInRocm93XCIpLCB2ZXJiKFwicmV0dXJuXCIpLCBpW1N5bWJvbC5hc3luY0l0ZXJhdG9yXSA9IGZ1bmN0aW9uICgpIHsgcmV0dXJuIHRoaXM7IH0sIGk7XHJcbiAgICBmdW5jdGlvbiB2ZXJiKG4pIHsgaWYgKGdbbl0pIGlbbl0gPSBmdW5jdGlvbiAodikgeyByZXR1cm4gbmV3IFByb21pc2UoZnVuY3Rpb24gKGEsIGIpIHsgcS5wdXNoKFtuLCB2LCBhLCBiXSkgPiAxIHx8IHJlc3VtZShuLCB2KTsgfSk7IH07IH1cclxuICAgIGZ1bmN0aW9uIHJlc3VtZShuLCB2KSB7IHRyeSB7IHN0ZXAoZ1tuXSh2KSk7IH0gY2F0Y2ggKGUpIHsgc2V0dGxlKHFbMF1bM10sIGUpOyB9IH1cclxuICAgIGZ1bmN0aW9uIHN0ZXAocikgeyByLnZhbHVlIGluc3RhbmNlb2YgX19hd2FpdCA/IFByb21pc2UucmVzb2x2ZShyLnZhbHVlLnYpLnRoZW4oZnVsZmlsbCwgcmVqZWN0KSA6IHNldHRsZShxWzBdWzJdLCByKTsgfVxyXG4gICAgZnVuY3Rpb24gZnVsZmlsbCh2YWx1ZSkgeyByZXN1bWUoXCJuZXh0XCIsIHZhbHVlKTsgfVxyXG4gICAgZnVuY3Rpb24gcmVqZWN0KHZhbHVlKSB7IHJlc3VtZShcInRocm93XCIsIHZhbHVlKTsgfVxyXG4gICAgZnVuY3Rpb24gc2V0dGxlKGYsIHYpIHsgaWYgKGYodiksIHEuc2hpZnQoKSwgcS5sZW5ndGgpIHJlc3VtZShxWzBdWzBdLCBxWzBdWzFdKTsgfVxyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19hc3luY0RlbGVnYXRvcihvKSB7XHJcbiAgICB2YXIgaSwgcDtcclxuICAgIHJldHVybiBpID0ge30sIHZlcmIoXCJuZXh0XCIpLCB2ZXJiKFwidGhyb3dcIiwgZnVuY3Rpb24gKGUpIHsgdGhyb3cgZTsgfSksIHZlcmIoXCJyZXR1cm5cIiksIGlbU3ltYm9sLml0ZXJhdG9yXSA9IGZ1bmN0aW9uICgpIHsgcmV0dXJuIHRoaXM7IH0sIGk7XHJcbiAgICBmdW5jdGlvbiB2ZXJiKG4sIGYpIHsgaVtuXSA9IG9bbl0gPyBmdW5jdGlvbiAodikgeyByZXR1cm4gKHAgPSAhcCkgPyB7IHZhbHVlOiBfX2F3YWl0KG9bbl0odikpLCBkb25lOiBuID09PSBcInJldHVyblwiIH0gOiBmID8gZih2KSA6IHY7IH0gOiBmOyB9XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX2FzeW5jVmFsdWVzKG8pIHtcclxuICAgIGlmICghU3ltYm9sLmFzeW5jSXRlcmF0b3IpIHRocm93IG5ldyBUeXBlRXJyb3IoXCJTeW1ib2wuYXN5bmNJdGVyYXRvciBpcyBub3QgZGVmaW5lZC5cIik7XHJcbiAgICB2YXIgbSA9IG9bU3ltYm9sLmFzeW5jSXRlcmF0b3JdLCBpO1xyXG4gICAgcmV0dXJuIG0gPyBtLmNhbGwobykgOiAobyA9IHR5cGVvZiBfX3ZhbHVlcyA9PT0gXCJmdW5jdGlvblwiID8gX192YWx1ZXMobykgOiBvW1N5bWJvbC5pdGVyYXRvcl0oKSwgaSA9IHt9LCB2ZXJiKFwibmV4dFwiKSwgdmVyYihcInRocm93XCIpLCB2ZXJiKFwicmV0dXJuXCIpLCBpW1N5bWJvbC5hc3luY0l0ZXJhdG9yXSA9IGZ1bmN0aW9uICgpIHsgcmV0dXJuIHRoaXM7IH0sIGkpO1xyXG4gICAgZnVuY3Rpb24gdmVyYihuKSB7IGlbbl0gPSBvW25dICYmIGZ1bmN0aW9uICh2KSB7IHJldHVybiBuZXcgUHJvbWlzZShmdW5jdGlvbiAocmVzb2x2ZSwgcmVqZWN0KSB7IHYgPSBvW25dKHYpLCBzZXR0bGUocmVzb2x2ZSwgcmVqZWN0LCB2LmRvbmUsIHYudmFsdWUpOyB9KTsgfTsgfVxyXG4gICAgZnVuY3Rpb24gc2V0dGxlKHJlc29sdmUsIHJlamVjdCwgZCwgdikgeyBQcm9taXNlLnJlc29sdmUodikudGhlbihmdW5jdGlvbih2KSB7IHJlc29sdmUoeyB2YWx1ZTogdiwgZG9uZTogZCB9KTsgfSwgcmVqZWN0KTsgfVxyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19tYWtlVGVtcGxhdGVPYmplY3QoY29va2VkLCByYXcpIHtcclxuICAgIGlmIChPYmplY3QuZGVmaW5lUHJvcGVydHkpIHsgT2JqZWN0LmRlZmluZVByb3BlcnR5KGNvb2tlZCwgXCJyYXdcIiwgeyB2YWx1ZTogcmF3IH0pOyB9IGVsc2UgeyBjb29rZWQucmF3ID0gcmF3OyB9XHJcbiAgICByZXR1cm4gY29va2VkO1xyXG59O1xyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9faW1wb3J0U3Rhcihtb2QpIHtcclxuICAgIGlmIChtb2QgJiYgbW9kLl9fZXNNb2R1bGUpIHJldHVybiBtb2Q7XHJcbiAgICB2YXIgcmVzdWx0ID0ge307XHJcbiAgICBpZiAobW9kICE9IG51bGwpIGZvciAodmFyIGsgaW4gbW9kKSBpZiAoT2JqZWN0Lmhhc093blByb3BlcnR5LmNhbGwobW9kLCBrKSkgcmVzdWx0W2tdID0gbW9kW2tdO1xyXG4gICAgcmVzdWx0LmRlZmF1bHQgPSBtb2Q7XHJcbiAgICByZXR1cm4gcmVzdWx0O1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19pbXBvcnREZWZhdWx0KG1vZCkge1xyXG4gICAgcmV0dXJuIChtb2QgJiYgbW9kLl9fZXNNb2R1bGUpID8gbW9kIDogeyBkZWZhdWx0OiBtb2QgfTtcclxufVxyXG4iLCJpbXBvcnQge1xuICBDb21wb25lbnQsXG4gIENoYW5nZURldGVjdGlvblN0cmF0ZWd5LFxuICBJbnB1dCxcbiAgU2ltcGxlQ2hhbmdlcyxcbiAgVmlld0NoaWxkLFxuICBFbGVtZW50UmVmLFxufSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IE9ic2VydmFibGUsIEVNUFRZLCBTdWJqZWN0LCBjb21iaW5lTGF0ZXN0LCBvZiwgQmVoYXZpb3JTdWJqZWN0IH0gZnJvbSAncnhqcyc7XG5pbXBvcnQge1xuICB0YXAsXG4gIG1hcCxcbiAgc3RhcnRXaXRoLFxuICBkZWJvdW5jZVRpbWUsXG4gIGZpbHRlcixcbiAgZGlzdGluY3RVbnRpbENoYW5nZWQsXG4gIHRha2VVbnRpbCxcbiAgY2F0Y2hFcnJvcixcbiAgc2hhcmUsXG4gIHNoYXJlUmVwbGF5LFxuICBzd2l0Y2hNYXAsXG4gIHB1Ymxpc2hCZWhhdmlvcixcbiAgcmVmQ291bnQsXG59IGZyb20gJ3J4anMvb3BlcmF0b3JzJztcbmltcG9ydCB7IEZvcm1Db250cm9sIH0gZnJvbSAnQGFuZ3VsYXIvZm9ybXMnO1xuaW1wb3J0IHsgVmlydHVhbFRhYmxlQ29uZmlnLCBWaXJ0dWFsVGFibGVJdGVtLCBWaXJ0dWFsVGFibGVDb2x1bW4gfSBmcm9tICcuLi9pbnRlcmZhY2VzJztcblxuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAnbmctdmlydHVhbC10YWJsZScsXG4gIHRlbXBsYXRlVXJsOiAnLi92aXJ0dWFsLXRhYmxlLmNvbXBvbmVudC5odG1sJyxcbiAgc3R5bGVVcmxzOiBbJy4vdmlydHVhbC10YWJsZS5jb21wb25lbnQuc2NzcyddLFxuICBjaGFuZ2VEZXRlY3Rpb246IENoYW5nZURldGVjdGlvblN0cmF0ZWd5Lk9uUHVzaCxcbn0pXG5leHBvcnQgY2xhc3MgVmlydHVhbFRhYmxlQ29tcG9uZW50IHtcbiAgcHVibGljIGl0ZW1Db3VudCA9IDI1O1xuXG4gIHByaXZhdGUgX2NvbmZpZzogVmlydHVhbFRhYmxlQ29uZmlnO1xuXG4gIHB1YmxpYyBmaWx0ZXJJc09wZW4gPSBmYWxzZTtcblxuICBAVmlld0NoaWxkKCdpbnB1dEZpbHRlckZvY3VzJykgaW5wdXRGaWx0ZXJGb2N1czogRWxlbWVudFJlZjtcblxuICBASW5wdXQoKSBkYXRhU291cmNlOiBPYnNlcnZhYmxlPEFycmF5PFZpcnR1YWxUYWJsZUl0ZW0+PjtcblxuICBASW5wdXQoKSBmaWx0ZXJQbGFjZWhvbGRlciA9ICdGaWx0ZXInO1xuXG4gIEBJbnB1dCgpIGNvbmZpZzogVmlydHVhbFRhYmxlQ29uZmlnO1xuXG4gIEBJbnB1dCgpIG9uUm93Q2xpY2s6IChpdGVtOiBWaXJ0dWFsVGFibGVJdGVtKSA9PiB2b2lkO1xuXG4gIGZpbHRlckNvbnRyb2w6IEZvcm1Db250cm9sID0gbmV3IEZvcm1Db250cm9sKCcnKTtcblxuICBwcml2YXRlIF9oZWFkZXJEaWN0OiB7IFtrZXk6IHN0cmluZ106IFZpcnR1YWxUYWJsZUNvbHVtbiB9ID0gT2JqZWN0LmNyZWF0ZShudWxsKTtcblxuICBwdWJsaWMgY29sdW1uOiBBcnJheTxWaXJ0dWFsVGFibGVDb2x1bW4+ID0gW107XG5cbiAgcHVibGljIF9kYXRhU3RyZWFtOiBPYnNlcnZhYmxlPEFycmF5PFZpcnR1YWxUYWJsZUl0ZW0+PiA9IEVNUFRZO1xuXG4gIHByaXZhdGUgc29ydCQ6IFN1YmplY3Q8c3RyaW5nPiA9IG5ldyBTdWJqZWN0PHN0cmluZz4oKTtcblxuICBwcml2YXRlIF9kZXN0cm95ZWQkID0gbmV3IFN1YmplY3Q8dm9pZD4oKTtcblxuICBwcml2YXRlIF9oZWFkZXJXYXNTZXQgPSBmYWxzZTtcblxuICBwdWJsaWMgaXNFbXB0eVN1YmplY3QkOiBPYnNlcnZhYmxlPGJvb2xlYW4+O1xuXG4gIHByaXZhdGUgZmlsdGVyJCA9IHRoaXMuZmlsdGVyQ29udHJvbC52YWx1ZUNoYW5nZXMucGlwZShcbiAgICBkZWJvdW5jZVRpbWUoMzAwKSxcbiAgICBzdGFydFdpdGgobnVsbCksXG4gICAgZGlzdGluY3RVbnRpbENoYW5nZWQoKSxcbiAgICB0YWtlVW50aWwodGhpcy5fZGVzdHJveWVkJCksXG4gICk7XG5cbiAgYXBwbHlTb3J0KGNvbHVtbjogc3RyaW5nKSB7XG4gICAgdGhpcy5jb2x1bW4gPSB0aGlzLmNvbHVtbi5tYXAoKGl0ZW0pID0+IHtcbiAgICAgIGlmIChpdGVtLmtleSAhPT0gY29sdW1uKSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgLi4uaXRlbSxcbiAgICAgICAgICBzb3J0OiBudWxsLFxuICAgICAgICB9O1xuICAgICAgfVxuXG4gICAgICBpZiAoaXRlbS5zb3J0ID09PSBudWxsKSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgLi4uaXRlbSxcbiAgICAgICAgICBzb3J0OiAnYXNjJyxcbiAgICAgICAgfTtcbiAgICAgIH1cblxuICAgICAgaWYgKGl0ZW0uc29ydCA9PT0gJ2FzYycpIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAuLi5pdGVtLFxuICAgICAgICAgIHNvcnQ6ICdkZXNjJyxcbiAgICAgICAgfTtcbiAgICAgIH1cblxuICAgICAgaWYgKGl0ZW0uc29ydCA9PT0gJ2Rlc2MnKSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgLi4uaXRlbSxcbiAgICAgICAgICBzb3J0OiBudWxsLFxuICAgICAgICB9O1xuICAgICAgfVxuICAgIH0pIGFzIEFycmF5PFZpcnR1YWxUYWJsZUNvbHVtbj47XG4gICAgdGhpcy5zb3J0JC5uZXh0KGNvbHVtbik7XG4gIH1cblxuICBuZ09uQ2hhbmdlcyhjaGFuZ2VzOiBTaW1wbGVDaGFuZ2VzKSB7XG4gICAgaWYgKCdjb25maWcnIGluIGNoYW5nZXMpIHtcbiAgICAgIHRoaXMuX2NvbmZpZyA9IGNoYW5nZXMuY29uZmlnLmN1cnJlbnRWYWx1ZSBhcyBWaXJ0dWFsVGFibGVDb25maWc7XG4gICAgICB0aGlzLmNvbHVtbiA9IHRoaXMuY3JlYXRlQ29sdW1uRnJvbUFycmF5KHRoaXMuX2NvbmZpZy5jb2x1bW4pO1xuICAgIH1cblxuICAgIGlmICgnZGF0YVNvdXJjZScgaW4gY2hhbmdlcykge1xuICAgICAgY29uc3QgbmV3RGF0YVNvdXJjZSA9IGNoYW5nZXMuZGF0YVNvdXJjZS5jdXJyZW50VmFsdWUgYXMgT2JzZXJ2YWJsZTxBcnJheTxWaXJ0dWFsVGFibGVJdGVtPj47XG4gICAgICB0aGlzLl9kYXRhU3RyZWFtID0gY29tYmluZUxhdGVzdChcbiAgICAgICAgdGhpcy5zb3J0JC5hc09ic2VydmFibGUoKS5waXBlKHN0YXJ0V2l0aChudWxsKSksXG4gICAgICAgIHRoaXMuZmlsdGVyJCxcbiAgICAgICAgbmV3RGF0YVNvdXJjZS5waXBlKFxuICAgICAgICAgIHRhcCgoc3RyZWFtOiBBcnJheTxWaXJ0dWFsVGFibGVJdGVtPikgPT4ge1xuICAgICAgICAgICAgaWYgKCF0aGlzLl9oZWFkZXJXYXNTZXQpIHtcbiAgICAgICAgICAgICAgY29uc3Qgc2V0T2ZDb2x1bW4gPSBuZXcgU2V0KCk7XG4gICAgICAgICAgICAgIHN0cmVhbS5mb3JFYWNoKChlKSA9PiBPYmplY3Qua2V5cyhlKS5mb3JFYWNoKChrZXkpID0+IHNldE9mQ29sdW1uLmFkZChrZXkpKSk7XG4gICAgICAgICAgICAgIGNvbnN0IGF1dG9Db2x1bW5BcnJheSA9IEFycmF5LmZyb20oc2V0T2ZDb2x1bW4pO1xuICAgICAgICAgICAgICB0aGlzLmNvbHVtbiA9IHRoaXMuY3JlYXRlQ29sdW1uRnJvbUFycmF5KGF1dG9Db2x1bW5BcnJheSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSksXG4gICAgICAgICksXG4gICAgICApLnBpcGUoXG4gICAgICAgIG1hcCgoW3NvcnQsIGZpbHRlclN0cmluZywgc3RyZWFtXSkgPT4ge1xuICAgICAgICAgIGNvbnN0IHNsaWNlU3RyZWFtID0gc3RyZWFtLnNsaWNlKCk7XG5cbiAgICAgICAgICBjb25zdCBzb3J0Q29sdW1uID0gdGhpcy5jb2x1bW4uZmluZCgoZSkgPT4gZS5rZXkgPT09IHNvcnQpO1xuXG4gICAgICAgICAgaWYgKCFzb3J0IHx8ICFzb3J0Q29sdW1uKSB7XG4gICAgICAgICAgICByZXR1cm4gW2ZpbHRlclN0cmluZywgc2xpY2VTdHJlYW1dO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIGlmICghc29ydENvbHVtbi5zb3J0KSB7XG4gICAgICAgICAgICByZXR1cm4gW2ZpbHRlclN0cmluZywgc2xpY2VTdHJlYW1dO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIGNvbnN0IF9zb3J0Q29sdW1uID0gdGhpcy5faGVhZGVyRGljdFtzb3J0XTtcblxuICAgICAgICAgIGlmIChzb3J0Q29sdW1uLnNvcnQgPT09ICdhc2MnKSB7XG4gICAgICAgICAgICBzbGljZVN0cmVhbS5zb3J0KFxuICAgICAgICAgICAgICAoYTogVmlydHVhbFRhYmxlSXRlbSwgYjogVmlydHVhbFRhYmxlSXRlbSkgPT5cbiAgICAgICAgICAgICAgICB0aGlzLmdldEVsZW1lbnQoYSwgX3NvcnRDb2x1bW4uZnVuYykgPiB0aGlzLmdldEVsZW1lbnQoYiwgX3NvcnRDb2x1bW4uZnVuYylcbiAgICAgICAgICAgICAgICAgID8gMVxuICAgICAgICAgICAgICAgICAgOiB0aGlzLmdldEVsZW1lbnQoYSwgX3NvcnRDb2x1bW4uZnVuYykgPT09IHRoaXMuZ2V0RWxlbWVudChiLCBfc29ydENvbHVtbi5mdW5jKVxuICAgICAgICAgICAgICAgICAgICA/IDBcbiAgICAgICAgICAgICAgICAgICAgOiAtMSxcbiAgICAgICAgICAgICk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHNsaWNlU3RyZWFtLnNvcnQoXG4gICAgICAgICAgICAgIChhOiBWaXJ0dWFsVGFibGVJdGVtLCBiOiBWaXJ0dWFsVGFibGVJdGVtKSA9PlxuICAgICAgICAgICAgICAgIHRoaXMuZ2V0RWxlbWVudChhLCBfc29ydENvbHVtbi5mdW5jKSA8IHRoaXMuZ2V0RWxlbWVudChiLCBfc29ydENvbHVtbi5mdW5jKVxuICAgICAgICAgICAgICAgICAgPyAxXG4gICAgICAgICAgICAgICAgICA6IHRoaXMuZ2V0RWxlbWVudChhLCBfc29ydENvbHVtbi5mdW5jKSA9PT0gdGhpcy5nZXRFbGVtZW50KGIsIF9zb3J0Q29sdW1uLmZ1bmMpXG4gICAgICAgICAgICAgICAgICAgID8gMFxuICAgICAgICAgICAgICAgICAgICA6IC0xLFxuICAgICAgICAgICAgKTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICByZXR1cm4gW2ZpbHRlclN0cmluZywgc2xpY2VTdHJlYW1dO1xuICAgICAgICB9KSxcbiAgICAgICAgbWFwKChbZmlsdGVyU3RyaW5nLCBzdHJlYW1dKSA9PiB7XG4gICAgICAgICAgY29uc29sZS5sb2coZmlsdGVyU3RyaW5nLCAnZmlsdGVyJyk7XG4gICAgICAgICAgY29uc29sZS5sb2coc3RyZWFtKTtcbiAgICAgICAgICBjb25zdCBzbGljZVN0cmVhbSA9IHN0cmVhbS5zbGljZSgpO1xuICAgICAgICAgIGlmICghZmlsdGVyU3RyaW5nKSB7XG4gICAgICAgICAgICByZXR1cm4gc2xpY2VTdHJlYW07XG4gICAgICAgICAgfVxuICAgICAgICAgIGNvbnN0IGZpbHRlciA9IGZpbHRlclN0cmluZy50b0xvY2FsZUxvd2VyQ2FzZSgpO1xuXG4gICAgICAgICAgY29uc3QgZmlsdGVyU2xpY2VTdHJlYW0gPSBzbGljZVN0cmVhbS5maWx0ZXIoKGl0ZW06IFZpcnR1YWxUYWJsZUl0ZW0pID0+XG4gICAgICAgICAgICBPYmplY3Qua2V5cyhpdGVtKS5zb21lKFxuICAgICAgICAgICAgICAoa2V5KSA9PiBpdGVtW2tleV0gJiYgaXRlbVtrZXldLnRvU3RyaW5nKCkudG9Mb2NhbGVMb3dlckNhc2UoKS5pbmRleE9mKGZpbHRlcikgPiAtMSxcbiAgICAgICAgICAgICksXG4gICAgICAgICAgKTtcbiAgICAgICAgICByZXR1cm4gZmlsdGVyU2xpY2VTdHJlYW07XG4gICAgICAgIH0pLFxuICAgICAgICBwdWJsaXNoQmVoYXZpb3IoW10pLFxuICAgICAgICByZWZDb3VudCgpLFxuICAgICAgKTtcblxuICAgICAgdGhpcy5pc0VtcHR5U3ViamVjdCQgPSB0aGlzLl9kYXRhU3RyZWFtLnBpcGUobWFwKChkYXRhKSA9PiAhZGF0YS5sZW5ndGgpKTtcbiAgICB9XG4gIH1cblxuICBjcmVhdGVDb2x1bW5Gcm9tQXJyYXkoYXJyOiBBcnJheTxWaXJ0dWFsVGFibGVDb2x1bW4gfCBzdHJpbmc+KTogQXJyYXk8VmlydHVhbFRhYmxlQ29sdW1uPiB7XG4gICAgaWYgKCFhcnIgfHwgYXJyLmxlbmd0aCA9PT0gMCkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICB0aGlzLl9oZWFkZXJXYXNTZXQgPSB0cnVlO1xuICAgIGNvbnN0IGNvbHVtbkFyciA9IGFyci5tYXAoKGl0ZW06IFZpcnR1YWxUYWJsZUNvbHVtbikgPT4ge1xuICAgICAgbGV0IGNvbHVtbkl0ZW07XG4gICAgICBpZiAodHlwZW9mIGl0ZW0gPT09ICdzdHJpbmcnKSB7XG4gICAgICAgIGNvbHVtbkl0ZW0gPSB0aGlzLmNyZWF0ZUNvbHVtbkZyb21TdHJpbmcoaXRlbSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBjb2x1bW5JdGVtID0gaXRlbTtcbiAgICAgIH1cbiAgICAgIGlmICh0aGlzLl9oZWFkZXJEaWN0W2NvbHVtbkl0ZW0ua2V5XSkge1xuICAgICAgICB0aHJvdyBFcnJvcihgQ29sdW1uIGtleT0ke2NvbHVtbkl0ZW0ua2V5fSBhbHJlYWR5IGRlY2xhcmVgKTtcbiAgICAgIH1cbiAgICAgIHRoaXMuX2hlYWRlckRpY3RbY29sdW1uSXRlbS5rZXldID0gY29sdW1uSXRlbTtcblxuICAgICAgcmV0dXJuIGNvbHVtbkl0ZW07XG4gICAgfSk7XG4gICAgcmV0dXJuIGNvbHVtbkFycjtcbiAgfVxuXG4gIHByaXZhdGUgZ2V0RWxlbWVudChpdGVtOiBWaXJ0dWFsVGFibGVJdGVtLCBmdW5jOiAoaXRlbTogVmlydHVhbFRhYmxlSXRlbSkgPT4gYW55KSB7XG4gICAgcmV0dXJuIGZ1bmMuY2FsbCh0aGlzLCBpdGVtKTtcbiAgfVxuXG4gIHByaXZhdGUgY3JlYXRlQ29sdW1uRnJvbVN0cmluZyhzdHI6IHN0cmluZyk6IFZpcnR1YWxUYWJsZUNvbHVtbiB7XG4gICAgcmV0dXJuIHtcbiAgICAgIG5hbWU6IHN0cixcbiAgICAgIGtleTogc3RyLFxuICAgICAgZnVuYzogKGl0ZW0pID0+IGl0ZW1bc3RyXSxcbiAgICAgIHNvcnQ6IG51bGwsXG4gICAgfTtcbiAgfVxuXG4gIG5nT25EZXN0cm95KCkge1xuICAgIHRoaXMuX2Rlc3Ryb3llZCQubmV4dCgpO1xuICB9XG5cbiAgY2xpY2tJdGVtKGl0ZW06IFZpcnR1YWxUYWJsZUl0ZW0pIHtcbiAgICBpZiAodHlwZW9mIHRoaXMub25Sb3dDbGljayA9PT0gJ2Z1bmN0aW9uJykgdGhpcy5vblJvd0NsaWNrKGl0ZW0pO1xuICB9XG5cbiAgdG9nZ2xlRmlsdGVyKCkge1xuICAgIHRoaXMuZmlsdGVySXNPcGVuID0gIXRoaXMuZmlsdGVySXNPcGVuO1xuICAgIGlmICh0aGlzLmZpbHRlcklzT3Blbikge1xuICAgICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgIHRoaXMuaW5wdXRGaWx0ZXJGb2N1cy5uYXRpdmVFbGVtZW50LmZvY3VzKCk7XG4gICAgICB9KTtcbiAgICB9XG4gICAgdGhpcy5maWx0ZXJDb250cm9sLnNldFZhbHVlKCcnLCB7IGVtaXRFdmVudDogIXRoaXMuZmlsdGVySXNPcGVuIH0pO1xuICB9XG59XG4iLCJpbXBvcnQgeyBOZ01vZHVsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgQ29tbW9uTW9kdWxlIH0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uJztcbmltcG9ydCB7IFNjcm9sbERpc3BhdGNoTW9kdWxlIH0gZnJvbSAnQGFuZ3VsYXIvY2RrL3Njcm9sbGluZyc7XG5pbXBvcnQgeyBWaXJ0dWFsVGFibGVDb21wb25lbnQgfSBmcm9tICcuL2NvbXBvbmVudHMvdmlydHVhbC10YWJsZS5jb21wb25lbnQnO1xuaW1wb3J0IHsgUmVhY3RpdmVGb3Jtc01vZHVsZSB9IGZyb20gJ0Bhbmd1bGFyL2Zvcm1zJztcbmltcG9ydCB7IEJyb3dzZXJBbmltYXRpb25zTW9kdWxlIH0gZnJvbSAnQGFuZ3VsYXIvcGxhdGZvcm0tYnJvd3Nlci9hbmltYXRpb25zJztcbmltcG9ydCB7IE1hdEljb25Nb2R1bGUgfSBmcm9tICdAYW5ndWxhci9tYXRlcmlhbC9pY29uJztcbmltcG9ydCB7IE1hdEZvcm1GaWVsZE1vZHVsZSB9IGZyb20gJ0Bhbmd1bGFyL21hdGVyaWFsL2Zvcm0tZmllbGQnO1xuQE5nTW9kdWxlKHtcbiAgZGVjbGFyYXRpb25zOiBbVmlydHVhbFRhYmxlQ29tcG9uZW50XSxcbiAgaW1wb3J0czogW1xuICAgIENvbW1vbk1vZHVsZSxcbiAgICBSZWFjdGl2ZUZvcm1zTW9kdWxlLFxuICAgIEJyb3dzZXJBbmltYXRpb25zTW9kdWxlLFxuICAgIE1hdEljb25Nb2R1bGUsXG4gICAgTWF0Rm9ybUZpZWxkTW9kdWxlLFxuICAgIFNjcm9sbERpc3BhdGNoTW9kdWxlLFxuICBdLFxuICBleHBvcnRzOiBbVmlydHVhbFRhYmxlQ29tcG9uZW50XSxcbiAgcHJvdmlkZXJzOiBbXSxcbn0pXG5leHBvcnQgY2xhc3MgTmdWaXJ0dWFsVGFibGVNb2R1bGUge31cbiJdLCJuYW1lcyI6WyJGb3JtQ29udHJvbCIsIkVNUFRZIiwiU3ViamVjdCIsImRlYm91bmNlVGltZSIsInN0YXJ0V2l0aCIsImRpc3RpbmN0VW50aWxDaGFuZ2VkIiwidGFrZVVudGlsIiwiY29tYmluZUxhdGVzdCIsInRhcCIsIm1hcCIsInB1Ymxpc2hCZWhhdmlvciIsInJlZkNvdW50IiwiQ29tcG9uZW50IiwiQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3kiLCJWaWV3Q2hpbGQiLCJJbnB1dCIsIk5nTW9kdWxlIiwiQ29tbW9uTW9kdWxlIiwiUmVhY3RpdmVGb3Jtc01vZHVsZSIsIkJyb3dzZXJBbmltYXRpb25zTW9kdWxlIiwiTWF0SWNvbk1vZHVsZSIsIk1hdEZvcm1GaWVsZE1vZHVsZSIsIlNjcm9sbERpc3BhdGNoTW9kdWxlIl0sIm1hcHBpbmdzIjoiOzs7Ozs7SUFBQTs7Ozs7Ozs7Ozs7Ozs7QUFjQSxJQWVPLElBQUksUUFBUSxHQUFHO1FBQ2xCLFFBQVEsR0FBRyxNQUFNLENBQUMsTUFBTSxJQUFJLFNBQVMsUUFBUSxDQUFDLENBQUM7WUFDM0MsS0FBSyxJQUFJLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxTQUFTLENB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