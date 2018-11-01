/* tslint:disable */
import { VirtualTableComponent } from './virtual-table.component';
import { ComponentFixture, async, TestBed, tick, fakeAsync, flush } from '@angular/core/testing';
import { NgVirtualTableService } from '../services/ngVirtualTable.service';
import { MatIconModule } from '@angular/material/icon';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import {
  ScrollDispatchModule,
  CdkVirtualForOf,
  CdkVirtualForOfContext,
} from '@angular/cdk/scrolling';
import { DragDropModule, CdkDragDrop, CdkDragMove } from '@angular/cdk/drag-drop';
import { DynamicModule } from 'ng-dynamic-component';
import { VirtualTableConfig, VirtualTableColumnInternal, sortColumn } from '../interfaces';
import { of, Observable, Observer } from 'rxjs';
import { By } from '@angular/platform-browser';
import { SimpleChange, DebugElement, EmbeddedViewRef } from '@angular/core';
import { MatPaginatorModule } from '@angular/material/paginator';
import { skip, delay } from 'rxjs/operators';

CdkVirtualForOf.prototype['_updateContext'] = function(this: any) {
  const count = this._data.length;
  let i = this._viewContainerRef.length;
  while (i--) {
    const view = this._viewContainerRef.get(i) as EmbeddedViewRef<CdkVirtualForOfContext<any>>;
    if (!view.destroyed) {
      view.context.index = this._renderedRange.start + i;
      view.context.count = count;
      this._updateComputedContextProperties(view.context);
      view.detectChanges();
    }
  }
};

function finishInit(fixture: ComponentFixture<any>) {
  // On the first cycle we render and measure the viewport.
  fixture.detectChanges();
  flush();

  // On the second cycle we render the items.
  fixture.detectChanges();
  flush();
}

describe('VirtualTableComponent', () => {
  let fixture: ComponentFixture<VirtualTableComponent>;
  let component: VirtualTableComponent;
  let debugEl: DebugElement;
  let service: NgVirtualTableService;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        BrowserAnimationsModule,
        MatIconModule,
        MatFormFieldModule,
        ScrollDispatchModule,
        MatPaginatorModule,
        MatProgressSpinnerModule,
        DragDropModule,
        DynamicModule.withComponents([]),
      ],
      declarations: [VirtualTableComponent],
      providers: [NgVirtualTableService],
    })
      .overrideComponent(VirtualTableComponent, {
        set: {
          styleUrls: [],
          // I assume you can do the same for templateUrl here
        },
      })
      .compileComponents();

    fixture = TestBed.createComponent(VirtualTableComponent);
    component = fixture.componentInstance;
    debugEl = fixture.debugElement;
    service = TestBed.get(NgVirtualTableService);
    fixture.detectChanges();
  }));

  it('should exist', () => {
    expect(fixture).toBeTruthy();
  });

  describe('applyDatasource', () => {
    it('should apply datasource', fakeAsync(() => {
      const config: VirtualTableConfig = {
        header: true,
      };

      const dataSource = of(
        Array(1)
          .fill(0)
          .map(e => ({
            name: Math.random()
              .toString(36)
              .substring(7),
            age: Math.round(Math.random() * 1000),
          })),
      );

      const dataSource2 = of(
        Array(3)
          .fill(0)
          .map(e => ({
            name: Math.random()
              .toString(36)
              .substring(7),
            age: Math.round(Math.random() * 1000),
          })),
      );

      component.config = config;
      component.dataSource = dataSource;

      component.ngOnChanges({
        config: new SimpleChange(null, component.config, false),
        dataSource: new SimpleChange(null, component.dataSource, false),
      });
      finishInit(fixture);
      tick(1);
      const header = debugEl.query(By.css('.header'));
      expect(header).not.toBe(null);
      expect(
        component.viewport.elementRef.nativeElement.querySelectorAll('.virtual-table-row').length,
      ).toBe(1);

      component.applyDatasource(dataSource2);
      finishInit(fixture);

      const headerAfter = debugEl.query(By.css('.header'));

      expect(headerAfter).not.toBe(null);
      expect(
        component.viewport.elementRef.nativeElement.querySelectorAll('.virtual-table-row').length,
      ).toBe(3);
    }));
  });

  describe('filtering', () => {
    it('should filter text by control', () => {
      const dataSource = of(
        Array(5)
          .fill(0)
          .map((e, index) => index),
      );

      const config: VirtualTableConfig = {
        column: [
          {
            key: 'name',
            name: 'Full name',
            sort: null,
            func: e => e,
          },
        ],
      };

      component.config = config;
      component.dataSource = dataSource;

      component.ngOnChanges({
        config: new SimpleChange(null, component.config, false),
        dataSource: new SimpleChange(null, component.dataSource, false),
      });
      const pipe = component._dataStream.pipe(skip(1));
      const sub = pipe.subscribe(value => {
        expect(value).toEqual([0, 1, 2, 3, 4]);
      });
      sub.unsubscribe();

      component.filterControl.setValue('0');
      const sub1 = pipe.subscribe(value => {
        expect(value).toEqual([0]);
      });
      sub1.unsubscribe();
      component.filterControl.setValue('01');
      const sub2 = pipe.subscribe(value => {
        expect(value).toEqual([]);
      });
      sub2.unsubscribe();
    });
  });

  describe('resizingEvent', () => {
    let event: CdkDragMove<any>;
    let column: VirtualTableColumnInternal;
    let dataSource: Observable<Array<number>>;
    let config: VirtualTableConfig;
    beforeEach(() => {
      dataSource = of(
        Array(5)
          .fill(0)
          .map((e, index) => index),
      );

      config = {
        column: [
          {
            name: 'Full Name',
            key: 'age2',
            sort: null,
            func: e => e,
          },
        ],
      };

      column = {
        name: 'Full Name',
        key: 'age2',
        func: expect.any(Function),
        comp: service.defaultComparator,
        sort: null as sortColumn,
        resizable: true,
        draggable: true,
        width: 120,
      };

      event = {
        pointerPosition: {
          x: 100,
          y: 0,
        },
        source: {
          element: {
            nativeElement: {
              style: {
                transform: false,
              },
              getBoundingClientRect: () => {
                return {
                  width: 20,
                  height: 20,
                  x: 0,
                  y: 0,
                  bottom: 0,
                  top: 0,
                  right: 0,
                  left: 0,
                };
              },
            } as any,
          },
        } as any,
      } as any;
    });
    it('should not set _oldWidth', fakeAsync(() => {
      component.config = config;
      component.dataSource = dataSource;
      component.ngOnChanges({
        config: new SimpleChange(null, component.config, false),
        dataSource: new SimpleChange(null, component.dataSource, false),
      });
      fixture.detectChanges();
      component.resizingEvent(event, column);
      expect(component._oldWidth).toBe(null);
    }));

    it('should reset grabber', fakeAsync(() => {
      component.config = config;
      component.dataSource = dataSource;
      component.ngOnChanges({
        config: new SimpleChange(null, component.config, false),
        dataSource: new SimpleChange(null, component.dataSource, false),
      });
      fixture.detectChanges();

      component.resizingEvent(event, column);
      expect(event.source.element.nativeElement.style.transform).toBe('none');
    }));

    it('should set new column', fakeAsync(() => {
      event = {
        pointerPosition: {
          x: 268,
          y: 0,
        },
        source: {
          element: {
            nativeElement: {
              style: {
                transform: false,
              },
              getBoundingClientRect: () => {
                return {
                  width: 20,
                  height: 20,
                  x: 0,
                  y: 0,
                  bottom: 0,
                  top: 0,
                  right: 0,
                  left: 0,
                };
              },
            } as any,
          },
        } as any,
      } as any;

      component.config = config;
      component.dataSource = dataSource;

      component.ngOnChanges({
        config: new SimpleChange(null, component.config, false),
        dataSource: new SimpleChange(null, component.dataSource, false),
      });
      fixture.detectChanges();
      component._oldWidth = 120;
      component.headerDiv = {
        nativeElement: {
          getBoundingClientRect: () => {
            return {
              width: 600,
              height: 20,
              x: 0,
              y: 0,
              bottom: 0,
              top: 0,
              right: 0,
              left: 0,
            };
          },
        } as any,
      };
      component.resizingEvent(event, column);
      expect(column.width).toBe(268);
      expect(component._oldWidth).toBe(268);
    }));
  });

  describe('showHeader', () => {
    it('should showHeader depends from config', () => {
      const config: VirtualTableConfig = {
        header: false,
      };

      const config2: VirtualTableConfig = {
        header: true,
      };

      component.applyConfig(config);
      expect(component.showHeader).toBe(false);
      component.applyConfig(config2);
      expect(component.showHeader).toBe(true);
    });
  });

  describe('resizeStart', () => {
    it('should set `true` activeResize on column', () => {
      const column = {
        width: 55,
      } as VirtualTableColumnInternal;
      component.resizeStart(column, 0);
      expect(column).toEqual({
        width: 55,
        activeResize: true,
      });
    });

    it('should set width on column', () => {
      const column = {} as VirtualTableColumnInternal;
      component.headerDiv = {
        nativeElement: {
          children: [
            {
              getBoundingClientRect: () => {
                return {
                  width: 600,
                  height: 20,
                  x: 0,
                  y: 0,
                  bottom: 0,
                  top: 0,
                  right: 0,
                  left: 0,
                };
              },
            },
          ],
        } as any,
      };
      component.resizeStart(column, 0);
      expect(column).toEqual({
        width: 600,
        activeResize: true,
      });
    });
  });

  describe('applyPagination', () => {
    it('should return part of stream', () => {
      const stream = [
        { age: 22222 },
        {
          age: 333333,
        },
      ];

      expect(
        component.applyPagination({
          stream,
          effects: {
            pagination: {
              pageSize: 2,
              pageIndex: 0,
            },
          },
        }),
      ).toEqual({
        stream: [
          { age: 22222 },
          {
            age: 333333,
          },
        ],
        effects: {
          pagination: {
            pageSize: 2,
            pageIndex: 0,
          },
        },
      });
    });

    it('should return part of stream', () => {
      const stream = [
        { age: 22222 },
        {
          age: 333333,
        },
      ];

      expect(
        component.applyPagination({
          stream,
          effects: {
            pagination: {
              pageSize: 1,
              pageIndex: 1,
            },
          },
        }),
      ).toEqual({
        stream: [
          {
            age: 333333,
          },
        ],
        effects: {
          pagination: {
            pageSize: 1,
            pageIndex: 1,
          },
        },
      });
    });

    it('should return all of stream with showPaginator', () => {
      const stream = [
        { age: 22222 },
        {
          age: 333333,
        },
      ];

      expect(
        component.applyPagination({
          stream,
          effects: {
            pagination: undefined,
          },
        }),
      ).toEqual({
        stream: [
          { age: 22222 },
          {
            age: 333333,
          },
        ],
        effects: {
          pagination: undefined,
        },
      });

      const stream1 = Array(10000)
        .fill(0)
        .map(e => 5);

      expect(
        component.applyPagination({
          stream: stream1,
          effects: {},
        }),
      ).toEqual({
        stream: stream1,
        effects: {},
      });
    });
  });

  describe('onPageChange', () => {
    it('should get data from subject', () => {
      component.onPageChange({
        pageIndex: 555,
        pageSize: 555,
      } as any);
      const sub1 = (component as any).pageChangeObs$.pipe(skip(1)).subscribe((v: number) => {
        expect(v).toBe({
          pageIndex: 555,
          pageSize: 555,
        });
      });
      sub1.unsubscribe();
    });
  });

  describe('sortingStream', () => {
    it('should not sort stream with another key', () => {
      const stream = [
        { age: 22222 },
        {
          age: 333333,
        },
      ];

      const effects = {
        sort: {
          sortColumn: 'afsafaf',
        },
      };

      (component as any).column = [
        {
          name: 'Full Name',
          key: 'age',
          func: (e: any) => e.age,
          comp: service.defaultComparator,
        },
      ];

      expect(
        component.sortingStream({
          stream,
          effects,
        }),
      ).toEqual({
        stream: [
          { age: 22222 },
          {
            age: 333333,
          },
        ],
        effects: effects,
      });
    });

    it('should sort stream by column with `desc`', () => {
      const stream = [
        { age: 22222 },
        {
          age: 333333,
        },
      ];

      const effects = {
        sort: {
          sortColumn: 'age',
          sortType: 'desc' as sortColumn,
        },
      };

      (component as any).column = [
        {
          name: 'Full Name',
          key: 'age',
          func: (e: any) => e.age,
          comp: service.defaultComparator,
        },
      ];

      expect(
        component.sortingStream({
          stream,
          effects,
        }),
      ).toEqual({
        stream: [
          {
            age: 333333,
          },
          { age: 22222 },
        ],
        effects: effects,
      });
    });

    it('should sort stream by column with `asc`', () => {
      const stream = [
        { age: 22222 },
        {
          age: 333333,
        },
      ];

      const effects = {
        sort: {
          sortColumn: 'age',
          sortType: 'asc' as sortColumn,
        },
      };

      (component as any).column = [
        {
          name: 'Full Name',
          key: 'age',
          func: (e: any) => e.age,
          comp: service.defaultComparator,
        },
      ];
      expect(
        component.sortingStream({
          stream,
          effects,
        }),
      ).toEqual({
        stream: [
          { age: 22222 },
          {
            age: 333333,
          },
        ],
        effects: effects,
      });
    });

    it('should sort stream by column with null', () => {
      const stream = [
        { age: 22222 },
        {
          age: 333333,
        },
      ];

      const effects = {
        sort: {
          sortColumn: 'age',
          sortType: null as sortColumn,
        },
      };

      component.column = [
        {
          name: 'Full Name',
          key: 'age',
          func: e => e.age,
        },
      ];
      expect(
        component.sortingStream({
          stream,
          effects,
        }),
      ).toEqual({
        stream: [
          { age: 22222 },
          {
            age: 333333,
          },
        ],
        effects: effects,
      });
    });
  });

  describe('filterStream', () => {
    it('should filter stream by string by custom get', () => {
      const stream = [
        { age: 22222 },
        {
          age: 333333,
        },
      ];
      component.column = [
        {
          name: 'Full Name',
          key: 'age',
          func: e => e.age,
          comp: service.defaultComparator,
          sort: null as sortColumn,
        },
      ];
      component.config = {};
      component.config.filter = true;
      expect(
        component.filterStream({
          stream: stream,
          effects: {
            filter: '2222',
          },
        }),
      ).toEqual({ effects: { filter: '2222' }, stream: [{ age: 22222 }] });

      expect(
        component.filterStream({
          stream: stream,
          effects: {
            filter: '4444',
          },
        }),
      ).toEqual({ effects: { filter: '4444' }, stream: [] });
    });

    it('should filter stream by string', () => {
      const stream = [22222, 33333];
      component.column = [
        {
          name: 'Full Name',
          key: 'name',
          func: e => e,
          comp: service.defaultComparator,
          sort: null as sortColumn,
        },
      ];
      component.config = {};
      component.config.filter = true;
      expect(
        component.filterStream({
          stream: stream,
          effects: {
            filter: '2222',
          },
        }),
      ).toEqual({ effects: { filter: '2222' }, stream: [22222] });
    });

    it('should filter stream by string', () => {
      component.config = {};
      component.config.filter = true;
      const stream = [22222, 33333];
      expect(
        component.filterStream({
          stream: stream,
          effects: {
            filter: '4444',
          },
        }),
      ).toEqual({
        effects: {
          filter: '4444',
        },
        stream: [],
      });
    });

    it('should return all stream because filter effect absent', () => {
      component.config = {};
      component.config.filter = true;

      const stream = [22222, 33333];
      expect(
        component.filterStream({
          stream: stream,
        }),
      ).toEqual({ effects: undefined, stream: [22222, 33333] });
    });

    it('should return all stream because filter set false', () => {
      component.config = {};
      component.config.filter = false;
      const stream = [22222, 33333];
      expect(
        component.filterStream({
          stream: stream,
          effects: {
            filter: '222',
          },
        }),
      ).toEqual({
        effects: {
          filter: '222',
        },
        stream: [22222, 33333],
      });
    });
  });

  describe('resizeEnd', () => {
    it('should set `false` activeResize on column', () => {
      const column = {
        width: 55,
        activeResize: true,
      } as VirtualTableColumnInternal;
      component.resizeEnd(column);
      expect(column).toEqual({
        width: 55,
        activeResize: false,
      });
    });

    it('should set `false` activeResize on column and reset grabber', () => {
      const column = {
        width: 55,
        activeResize: true,
      } as VirtualTableColumnInternal;
      const grabber = {
        style: {
          transform: false,
        },
      } as any;
      component.resizeEnd(column, true, grabber);
      expect(column).toEqual({
        width: 55,
        activeResize: false,
      });
      expect(grabber.style.transform).toBe('none');
    });
  });

  describe('ngOnChanges', () => {
    it('should not execute all func', () => {
      component.applyConfig = jest.fn();
      component.applyDatasource = jest.fn();

      component.ngOnChanges({});

      expect(component.applyConfig).not.toBeCalled();
      expect(component.applyDatasource).not.toBeCalled();
    });

    it('should execute all func', () => {
      component.applyConfig = jest.fn();
      component.applyDatasource = jest.fn();

      component.ngOnChanges({
        config: { currentValue: {} } as any,
        dataSource: { currentValue: of([1, 2, 3]) } as any,
      });

      expect(component.applyConfig).toBeCalled();
      expect(component.applyDatasource).toBeCalled();
    });

    it('should execute applyConfig func', () => {
      component.applyConfig = jest.fn();
      component.applyDatasource = jest.fn();

      component.ngOnChanges({
        config: { currentValue: {} } as any,
      });

      expect(component.applyConfig).toBeCalled();
      expect(component.applyDatasource).not.toBeCalled();
    });

    it('should execute applyDatasource func', () => {
      component.applyConfig = jest.fn();
      component.applyDatasource = jest.fn();

      component.ngOnChanges({
        dataSource: { currentValue: of([1, 2, 3]) } as any,
      });

      expect(component.applyConfig).not.toBeCalled();
      expect(component.applyDatasource).toBeCalled();
    });
  });

  describe('applyConfig', () => {
    it('should execute serverSideStrategyObs', fakeAsync(() => {
      const fn = (eff: any) => {
        const mock = Observable.create(o => {
          o.next({
            stream: [1, 2, 3],
            totalSize: 3,
          });
          o.complete();
        }).pipe(delay(1000));
        return mock;
      };

      const config: VirtualTableConfig = {
        header: false,
        serverSide: true,
        serverSideResolver: fn,
        pagination: true,
        column: [
          {
            key: 'name',
            name: 'Full name',
            resizable: false,
            sort: 'asc',
            func: e => e.age,
          },
        ],
      };

      component.config = config;
      (component as any).serverSideStrategyObs = jest.fn(e => of([1, 2, 3]));
      component.ngOnChanges({
        config: new SimpleChange(null, component.config, false),
      });
      fixture.detectChanges();
      tick(1);
      expect((component as any).serverSideStrategyObs).toBeCalled();
    }));

    it('should serverSideStrategyObs throw error', fakeAsync(() => {
      const fn = (eff: any) => {
        const mock = Observable.create(o => {
          o.next({
            stream: [1, 2, 3],
            totalSize: 3,
          });
          o.complete();
        }).pipe(delay(1000));
        return mock;
      };

      const config: VirtualTableConfig = {
        header: false,
        serverSide: true,
        // serverSideResolver: mock,
        pagination: true,
        column: [
          {
            key: 'name',
            name: 'Full name',
            resizable: false,
            sort: 'asc',
            func: e => e.age,
          },
        ],
      };

      component.config = config;
      try {
        component.ngOnChanges({
          config: new SimpleChange(null, component.config, false),
        });
        fixture.detectChanges();
        tick(1);
      } catch (e) {
        expect(e.message).toBe('You use serverSide, serverSideResolver must be exist!');
      }
    }));

    it('should serverSideStrategyObs apply params', fakeAsync(() => {
      const fn = (eff: any) => {
        const mock = Observable.create(o => {
          o.next({
            stream: [1, 2, 3],
            totalSize: 3,
          });
          o.complete();
        }).pipe(delay(1000));
        return mock;
      };

      const config: VirtualTableConfig = {
        header: false,
        serverSide: true,
        serverSideResolver: fn,
        pagination: true,
        column: [
          {
            key: 'name',
            name: 'Full name',
            resizable: false,
            sort: 'asc',
            func: e => e.age,
          },
        ],
      };

      component.config = config;
      component.ngOnChanges({
        config: new SimpleChange(null, component.config, false),
      });
      fixture.detectChanges();
      tick(1);
      expect(component.showLoading).toBe(true);
      tick(1000);
      expect(component.showLoading).toBe(false);
      expect(component.sliceSize).toBe(3);
    }));

    it('should apply config with paginator', fakeAsync(() => {
      const config: VirtualTableConfig = {
        header: false,
        pagination: true,
      };

      const config2: VirtualTableConfig = {
        header: true,
        pagination: false,
      };

      const dataSource = of(
        Array(100)
          .fill(0)
          .map(e => ({
            name: Math.random()
              .toString(36)
              .substring(7),
            age: Math.round(Math.random() * 1000),
          })),
      );

      component.config = config;
      component.dataSource = dataSource;
      component.ngOnChanges({
        config: new SimpleChange(null, component.config, false),
        dataSource: new SimpleChange(null, component.dataSource, false),
      });
      fixture.detectChanges();
      tick(1);

      const header = debugEl.query(By.css('.header'));
      const paginator = debugEl.query(By.css('.virtual-table-bottom'));

      expect(component.showPaginator).toBe(true);

      expect(paginator).not.toBe(null);

      expect(header).toBe(null);
      const spy2 = jest.spyOn(component.paginatorDiv, 'firstPage');
      component.applyConfig(config2);
      fixture.detectChanges();

      const headerAfter = debugEl.query(By.css('.header'));
      const paginatorAfter = debugEl.query(By.css('.virtual-table-bottom'));
      expect(headerAfter).not.toBe(null);
      expect(component.showPaginator).toBe(false);
      expect(spy2).not.toBeCalled();
      expect(paginatorAfter).toBe(null);
      component.applyConfig(config);
      fixture.detectChanges();
      const spy3 = jest.spyOn(component.paginatorDiv, 'firstPage');
      component.applyConfig(config);
      fixture.detectChanges();
      expect(spy3).toBeCalled();
    }));

    it('should apply config', fakeAsync(() => {
      const config: VirtualTableConfig = {
        header: false,
      };

      const config2: VirtualTableConfig = {
        header: true,
      };

      const dataSource = of(
        Array(100)
          .fill(0)
          .map(e => ({
            name: Math.random()
              .toString(36)
              .substring(7),
            age: Math.round(Math.random() * 1000),
          })),
      );

      component.config = config;
      component.dataSource = dataSource;

      component.ngOnChanges({
        config: new SimpleChange(null, component.config, false),
        dataSource: new SimpleChange(null, component.dataSource, false),
      });
      fixture.detectChanges();
      tick(1);
      const header = debugEl.query(By.css('.header'));

      expect(header).toBe(null);

      component.applyConfig(config2);
      fixture.detectChanges();

      const headerAfter = debugEl.query(By.css('.header'));

      expect(headerAfter).not.toBe(null);
    }));
  });

  describe('Set pagination settings', () => {
    it('should set custom pagination settings', fakeAsync(() => {
      const config: VirtualTableConfig = {
        column: [
          {
            key: 'name',
            name: 'Full name',
            resizable: false,
            sort: 'asc',
            func: e => e.age,
          },
        ],
        pagination: {
          pageSizeOptions: [1, 88, 132],
        },
      };

      const dataSource = of([
        {
          age: 44,
        },
        {
          age: 23,
        },
        {
          age: 2,
        },
      ]);

      component.config = config;
      component.dataSource = dataSource;

      component.ngOnChanges({
        config: new SimpleChange(null, component.config, false),
        dataSource: new SimpleChange(null, component.dataSource, false),
      });
      finishInit(fixture);
      expect(component.paginationPageSize).toBe(component.defaultPaginationSetting.pageSize);
      expect(component.paginationPageOptions).toEqual([1, 88, 132]);
    }));

    it('should set custom pagination settings', fakeAsync(() => {
      const config: VirtualTableConfig = {
        column: [
          {
            key: 'name',
            name: 'Full name',
            resizable: false,
            sort: 'asc',
            func: e => e.age,
          },
        ],
        pagination: {
          pageSize: 88,
        },
      };

      const dataSource = of([
        {
          age: 44,
        },
        {
          age: 23,
        },
        {
          age: 2,
        },
      ]);

      component.config = config;
      component.dataSource = dataSource;

      component.ngOnChanges({
        config: new SimpleChange(null, component.config, false),
        dataSource: new SimpleChange(null, component.dataSource, false),
      });
      finishInit(fixture);
      expect(component.paginationPageSize).toBe(88);
      expect(component.paginationPageOptions).toBe(
        component.defaultPaginationSetting.pageSizeOptions,
      );
    }));

    it('should set pagination default settings', fakeAsync(() => {
      const config: VirtualTableConfig = {
        column: [
          {
            key: 'name',
            name: 'Full name',
            resizable: false,
            sort: 'asc',
            func: e => e.age,
          },
        ],
        pagination: true,
      };

      const dataSource = of([
        {
          age: 44,
        },
        {
          age: 23,
        },
        {
          age: 2,
        },
      ]);

      component.config = config;
      component.dataSource = dataSource;

      component.ngOnChanges({
        config: new SimpleChange(null, component.config, false),
        dataSource: new SimpleChange(null, component.dataSource, false),
      });
      finishInit(fixture);
      expect(component.paginationPageSize).toBe(component.defaultPaginationSetting.pageSize);
      expect(component.paginationPageOptions).toBe(
        component.defaultPaginationSetting.pageSizeOptions,
      );
    }));
  });

  describe('Template', () => {
    it('should not render paginator by default', fakeAsync(() => {
      const config: VirtualTableConfig = {
        column: [
          {
            key: 'name',
            name: 'Full name',
            resizable: false,
            sort: 'asc',
            func: e => e.age,
          },
        ],
      };

      const dataSource = of([
        {
          age: 44,
        },
        {
          age: 23,
        },
        {
          age: 2,
        },
      ]);

      component.config = config;
      component.dataSource = dataSource;

      component.ngOnChanges({
        config: new SimpleChange(null, component.config, false),
        dataSource: new SimpleChange(null, component.dataSource, false),
      });
      finishInit(fixture);
      const item = debugEl.query(By.css('.virtual-table-bottom'));
      expect(item).toBe(null);
      expect(debugEl.nativeElement.classList.contains('with-pagination')).toBe(false);
    }));

    it('should not render paginator', fakeAsync(() => {
      const config: VirtualTableConfig = {
        column: [
          {
            key: 'name',
            name: 'Full name',
            resizable: false,
            sort: 'asc',
            func: e => e.age,
          },
        ],
        pagination: false,
      };

      const dataSource = of([
        {
          age: 44,
        },
        {
          age: 23,
        },
        {
          age: 2,
        },
      ]);

      component.config = config;
      component.dataSource = dataSource;

      component.ngOnChanges({
        config: new SimpleChange(null, component.config, false),
        dataSource: new SimpleChange(null, component.dataSource, false),
      });
      finishInit(fixture);
      const item = debugEl.query(By.css('.virtual-table-bottom'));
      expect(item).toBe(null);
      expect(debugEl.nativeElement.classList.contains('with-pagination')).toBe(false);
    }));

    it('should render paginator', fakeAsync(() => {
      const config: VirtualTableConfig = {
        column: [
          {
            key: 'name',
            name: 'Full name',
            resizable: false,
            sort: 'asc',
            func: e => e.age,
          },
        ],
        pagination: true,
      };

      const dataSource = of([
        {
          age: 44,
        },
        {
          age: 23,
        },
        {
          age: 2,
        },
      ]);

      component.config = config;
      component.dataSource = dataSource;

      component.ngOnChanges({
        config: new SimpleChange(null, component.config, false),
        dataSource: new SimpleChange(null, component.dataSource, false),
      });
      finishInit(fixture);
      const item = debugEl.query(By.css('.virtual-table-bottom'));
      expect(item).not.toBe(null);
      expect(debugEl.nativeElement.classList.contains('with-pagination')).toBe(true);
    }));

    it('should presort `ASC` item in table content ', fakeAsync(() => {
      const config: VirtualTableConfig = {
        column: [
          {
            key: 'name',
            name: 'Full name',
            resizable: false,
            sort: 'asc',
            func: e => e.age,
          },
        ],
      };

      const dataSource = of([
        {
          age: 44,
        },
        {
          age: 23,
        },
        {
          age: 2,
        },
      ]);

      component.config = config;
      component.dataSource = dataSource;

      component.ngOnChanges({
        config: new SimpleChange(null, component.config, false),
        dataSource: new SimpleChange(null, component.dataSource, false),
      });
      finishInit(fixture);
      const items = component.viewport.elementRef.nativeElement.querySelectorAll(
        '.virtual-table-column',
      );
      expect(items.length).toBe(3);

      const itemsVal = Array.from(items).map(i => i.textContent);

      expect(itemsVal).toEqual(['2', '23', '44']);
    }));

    it('should presort `DESC` item in table content ', fakeAsync(() => {
      const config: VirtualTableConfig = {
        column: [
          {
            key: 'name',
            name: 'Full name',
            resizable: false,
            sort: 'desc',
            func: e => e.age,
          },
        ],
      };

      const dataSource = of([
        {
          age: 44,
        },
        {
          age: 23,
        },
        {
          age: 2,
        },
      ]);

      component.config = config;
      component.dataSource = dataSource;

      component.ngOnChanges({
        config: new SimpleChange(null, component.config, false),
        dataSource: new SimpleChange(null, component.dataSource, false),
      });
      finishInit(fixture);
      const items = component.viewport.elementRef.nativeElement.querySelectorAll(
        '.virtual-table-column',
      );
      expect(items.length).toBe(3);

      const itemsVal = Array.from(items).map(i => i.textContent);

      expect(itemsVal).toEqual(['44', '23', '2']);
    }));

    it('should resorted after click presort `ASC` item in table content ', fakeAsync(() => {
      const config: VirtualTableConfig = {
        column: [
          {
            key: 'name',
            name: 'Full name',
            resizable: false,
            sort: 'asc',
            func: e => e.age,
          },
        ],
      };

      const dataSource = of([
        {
          age: 44,
        },
        {
          age: 23,
        },
        {
          age: 2,
        },
      ]);

      component.config = config;
      component.dataSource = dataSource;

      component.ngOnChanges({
        config: new SimpleChange(null, component.config, false),
        dataSource: new SimpleChange(null, component.dataSource, false),
      });
      finishInit(fixture);
      const items = component.viewport.elementRef.nativeElement.querySelectorAll(
        '.virtual-table-column',
      );
      expect(items.length).toBe(3);

      const itemsVal = Array.from(items).map(i => i.textContent);

      expect(itemsVal).toEqual(['2', '23', '44']);

      const headerItem = debugEl.query(By.css('.header-item'));
      headerItem.nativeElement.click();
      finishInit(fixture);

      const itemsAfterClick = component.viewport.elementRef.nativeElement.querySelectorAll(
        '.virtual-table-column',
      );
      expect(itemsAfterClick.length).toBe(3);

      const itemsAfterClickVal = Array.from(itemsAfterClick).map(i => i.textContent);

      expect(itemsAfterClickVal).toEqual(['44', '23', '2']);
    }));

    it('should not show header', fakeAsync(() => {
      const config: VirtualTableConfig = {
        header: false,
      };

      const dataSource = of(
        Array(100)
          .fill(0)
          .map(e => ({
            name: Math.random()
              .toString(36)
              .substring(7),
            age: Math.round(Math.random() * 1000),
          })),
      );

      component.config = config;
      component.dataSource = dataSource;

      component.ngOnChanges({
        config: new SimpleChange(null, component.config, false),
        dataSource: new SimpleChange(null, component.dataSource, false),
      });
      fixture.detectChanges();

      const header = debugEl.query(By.css('.header'));

      expect(header).toBe(null);
    }));

    it('should show header', fakeAsync(() => {
      const config: VirtualTableConfig = {};

      const dataSource = of(
        Array(100)
          .fill(0)
          .map(e => ({
            name: Math.random()
              .toString(36)
              .substring(7),
            age: Math.round(Math.random() * 1000),
          })),
      );

      component.config = config;
      component.dataSource = dataSource;

      component.ngOnChanges({
        config: new SimpleChange(null, component.config, false),
        dataSource: new SimpleChange(null, component.dataSource, false),
      });
      fixture.detectChanges();
      const header = debugEl.query(By.css('.header'));

      expect(header).not.toBe(null);
    }));

    it('should apply sort for header', fakeAsync(() => {
      const config: VirtualTableConfig = {};

      const dataSource = of(
        Array(100)
          .fill(0)
          .map(e => ({
            age: Math.round(Math.random() * 1000),
          })),
      );

      component.config = config;
      component.dataSource = dataSource;

      component.ngOnChanges({
        config: new SimpleChange(null, component.config, false),
        dataSource: new SimpleChange(null, component.dataSource, false),
      });
      fixture.detectChanges();

      debugEl.query(By.css('.header-item')).nativeElement.click();
      fixture.detectChanges();
      expect(debugEl.query(By.css('.header-item.asc'))).not.toBe(null);
      debugEl.query(By.css('.header-item')).nativeElement.click();
      fixture.detectChanges();
      expect(debugEl.query(By.css('.header-item.desc'))).not.toBe(null);
      debugEl.query(By.css('.header-item')).nativeElement.click();
      fixture.detectChanges();
      expect(debugEl.query(By.css('.header-item'))).not.toBe(null);
      expect(debugEl.query(By.css('.header-item.desc'))).toBe(null);
      expect(debugEl.query(By.css('.header-item.asc'))).toBe(null);
    }));

    it('should not show filter', fakeAsync(() => {
      const config: VirtualTableConfig = {};

      const dataSource = of(
        Array(100)
          .fill(0)
          .map(e => ({
            name: Math.random()
              .toString(36)
              .substring(7),
            age: Math.round(Math.random() * 1000),
          })),
      );

      component.config = config;
      component.dataSource = dataSource;

      component.ngOnChanges({
        config: new SimpleChange(null, component.config, false),
        dataSource: new SimpleChange(null, component.dataSource, false),
      });
      fixture.detectChanges();

      const filter = debugEl.query(By.css('.filter-spot'));

      expect(filter).toBe(null);
    }));

    it('should render item by default `func`', fakeAsync(() => {
      const config: VirtualTableConfig = {
        column: [
          {
            key: 'name',
            name: 'Full name',
            resizable: false,
          },
        ],
      };

      const dataSource = of(
        Array(1)
          .fill(0)
          .map(e => ({
            name: 'test',
          })),
      );

      component.config = config;
      component.dataSource = dataSource;

      component.ngOnChanges({
        config: new SimpleChange(null, component.config, false),
        dataSource: new SimpleChange(null, component.dataSource, false),
      });
      finishInit(fixture);
      const items = component.viewport.elementRef.nativeElement.querySelectorAll(
        '.virtual-table-column',
      );
      expect(items.length).toBe(1);

      expect(items[0].textContent).toBe('test');
    }));

    it('should render item provided `func', fakeAsync(() => {
      const config: VirtualTableConfig = {
        column: [
          {
            key: 'name',
            name: 'Full name',
            func: (e: any) => e.label,
            resizable: false,
          },
        ],
      };

      const dataSource = of(
        Array(1)
          .fill(0)
          .map(e => ({
            name: 'test',
            label: 'test2',
          })),
      );

      component.config = config;
      component.dataSource = dataSource;

      component.ngOnChanges({
        config: new SimpleChange(null, component.config, false),
        dataSource: new SimpleChange(null, component.dataSource, false),
      });
      finishInit(fixture);
      const items = component.viewport.elementRef.nativeElement.querySelectorAll(
        '.virtual-table-column',
      );
      expect(items.length).toBe(1);

      expect(items[0].textContent).toBe('test2');
    }));

    it('should show filter', fakeAsync(() => {
      const config: VirtualTableConfig = {
        filter: true,
      };

      const dataSource = of(
        Array(100)
          .fill(0)
          .map(e => ({
            name: Math.random()
              .toString(36)
              .substring(7),
            age: Math.round(Math.random() * 1000),
          })),
      );

      component.config = config;
      component.dataSource = dataSource;

      component.ngOnChanges({
        config: new SimpleChange(null, component.config, false),
        dataSource: new SimpleChange(null, component.dataSource, false),
      });
      fixture.detectChanges();
      const filter = debugEl.query(By.css('.filter-spot'));

      expect(filter).not.toBe(null);
    }));

    describe('toggleFilter', () => {
      it('should show filter', fakeAsync(() => {
        const config: VirtualTableConfig = {
          filter: true,
        };

        const dataSource = of(
          Array(100)
            .fill(0)
            .map(e => ({
              name: Math.random()
                .toString(36)
                .substring(7),
              age: Math.round(Math.random() * 1000),
            })),
        );

        component.config = config;
        component.dataSource = dataSource;

        component.ngOnChanges({
          config: new SimpleChange(null, component.config, false),
          dataSource: new SimpleChange(null, component.dataSource, false),
        });
        fixture.detectChanges();
        debugEl.query(By.css('.filter-spot mat-icon')).nativeElement.click();
        fixture.detectChanges();
        expect(debugEl.query(By.css('.filter-spot.open'))).not.toBe(null);
        debugEl.query(By.css('.filter-spot mat-icon')).nativeElement.click();
        tick(350);
        fixture.detectChanges();
        expect(debugEl.query(By.css('.filter-spot.open'))).toBe(null);
      }));
    });
  });

  describe('headerItemDragStarted', () => {
    it('should add class to header', () => {
      component.headerItemDragStarted();
      expect(debugEl.query(By.css('.header.cdk-drop-list-dragging'))).not.toBe(null);
    });
  });

  describe('headerItemDragFinished', () => {
    it('should remove class to header', () => {
      component.headerItemDragFinished();
      expect(debugEl.query(By.css('.header.cdk-drop-list-dragging'))).toBe(null);
    });
  });

  describe('dropColumn', () => {
    it('should change index of column', () => {
      component.column = [
        {
          key: 'name1',
          name: 'Full name',
          sort: null,
          func: e => e,
        },
        {
          key: 'name2',
          name: 'Full name',
          sort: null,
          func: e => e,
        },
        {
          key: 'name3',
          name: 'Full name',
          sort: null,
          func: e => e,
        },
      ];

      component.dropColumn({
        previousIndex: 1,
        currentIndex: 2,
      } as CdkDragDrop<string[]>);

      expect(component.column).toEqual([
        {
          key: 'name1',
          name: 'Full name',
          sort: null,
          func: expect.any(Function),
        },

        {
          key: 'name3',
          name: 'Full name',
          sort: null,
          func: expect.any(Function),
        },
        {
          key: 'name2',
          name: 'Full name',
          sort: null,
          func: expect.any(Function),
        },
      ]);
    });
  });

  describe('transformDynamicInput', () => {
    it('should transform input', () => {
      const mock = {};

      const mockItem = {
        name: 'title',
        label: 'label',
      };

      expect(component.transformDynamicInput(mock, mockItem)).toEqual({});

      const mock2 = {
        title: 5,
      };

      expect(component.transformDynamicInput(mock2, mockItem)).toEqual({
        title: 5,
      });

      const mock3 = {
        title: (e: any) => e.label,
      };

      expect(component.transformDynamicInput(mock3, mockItem)).toEqual({
        title: 'label',
      });
    });
  });

  describe('columnResizeAction', () => {
    it('should resize after datasource was set', fakeAsync(() => {
      const dataSource = of(
        Array(5)
          .fill(0)
          .map((e, index) => index),
      );

      const config: VirtualTableConfig = {
        column: [
          {
            key: 'name',
            name: 'Full name',
            sort: null,
            func: e => e,
          },
        ],
      };

      component.config = config;
      component.dataSource = dataSource;
      (component as any).columnResizeAction = jest.fn();
      component.ngOnChanges({
        config: new SimpleChange(null, component.config, false),
        dataSource: new SimpleChange(null, component.dataSource, false),
      });
      fixture.detectChanges();
      expect((component as any).columnResizeAction).toBeCalled();
    }));

    it('should not resize after datasource was set', fakeAsync(() => {
      const dataSource = of(
        Array(5)
          .fill(0)
          .map((e, index) => index),
      );

      const config: VirtualTableConfig = {
        column: [
          {
            key: 'name',
            name: 'Full name',
            sort: null,
            func: e => e,
          },
        ],
        header: false,
      };

      component.config = config;
      component.dataSource = dataSource;
      (component as any).columnResizeAction = jest.fn();
      component.ngOnChanges({
        config: new SimpleChange(null, component.config, false),
        dataSource: new SimpleChange(null, component.dataSource, false),
      });
      fixture.detectChanges();
      expect((component as any).columnResizeAction).not.toBeCalled();
    }));
  });

  describe('applySort', () => {
    it('should apply sort for column', () => {
      const dataSource = of(
        Array(5)
          .fill(0)
          .map((e, index) => index),
      );

      const config: VirtualTableConfig = {
        column: [
          {
            key: 'name',
            name: 'Full name',
            sort: null,
            func: e => e,
          },
        ],
      };

      component.config = config;
      component.dataSource = dataSource;

      component.ngOnChanges({
        config: new SimpleChange(null, component.config, false),
        dataSource: new SimpleChange(null, component.dataSource, false),
      });

      const sub = component._dataStream.subscribe(value => {
        expect(value).toEqual([0, 1, 2, 3, 4]);
      });
      sub.unsubscribe();
      component.applySort('name');
      const sub2 = component._dataStream.subscribe(value => {
        expect(value).toEqual([0, 1, 2, 3, 4]);
      });
      sub2.unsubscribe();
      component.applySort('name');

      const sub3 = component._dataStream.subscribe(value => {
        expect(value).toEqual([4, 3, 2, 1, 0]);
      });
      sub3.unsubscribe();
      component.applySort('name');
      const sub4 = component._dataStream.subscribe(value => {
        expect(value).toEqual([0, 1, 2, 3, 4]);
      });
      sub4.unsubscribe();
    });
  });

  describe('getElement', () => {
    it('should return element', () => {
      const item = {
        name: 5,
      };

      expect(component.getElement(item, e => e.name)).toBe(5);

      const item2 = {
        name: 5,
        label: {
          test: {
            test: {
              test: 'name',
            },
          },
        },
      };

      expect(component.getElement(item, e => e.name)).toBe(5);
      expect(component.getElement(item2, e => e.label.test.test.test)).toBe('name');
    });
  });

  describe('_sortAfterConfigWasSet', () => {
    it('should return null for pre sort', () => {
      const config: VirtualTableConfig = {
        column: [
          {
            key: 'name',
            name: 'Full name',
            sort: null,
            func: e => e,
          },
        ],
      };

      component.column = config.column;

      expect(component._sortAfterConfigWasSet()).toEqual(null);
    });

    it('should return key for pre sort', () => {
      const config: VirtualTableConfig = {
        column: [
          {
            key: 'name',
            name: 'Full name',
            sort: 'asc',
            func: e => e,
          },
        ],
      };

      component.column = config.column;

      expect(component._sortAfterConfigWasSet()).toEqual('name');
    });
  });

  describe('mouseDownBlock', () => {
    it('should execute on event', () => {
      const ev = {
        stopImmediatePropagation: jest.fn(),
      } as any;
      component.mouseDownBlock(ev);
      expect(ev.stopImmediatePropagation).toBeCalled();
    });
  });

  describe('clickItem', () => {
    it('should execute func', () => {
      const item = {
        test: 5,
      };

      const onClick = jest.fn();

      component.onRowClick = onClick;
      component.clickItem(item);
      expect(onClick).toBeCalledWith(item);
    });

    it('should return false', () => {
      const item = {
        test: 5,
      };
      component.clickItem(item);
      expect(component.clickItem(item)).toBe(false);
    });
  });

  describe('createColumnFromArray', () => {
    it('should create column from array', () => {
      const config: VirtualTableConfig = {
        column: [
          {
            key: 'name',
            name: 'Full name',
            sort: 'asc',
            func: e => e,
          },
        ],
      };

      expect(component.createColumnFromArray(config.column)).toEqual(
        service.createColumnFromArray(config.column),
      );
    });

    it('should throw error', () => {
      const config: VirtualTableConfig = {
        column: [
          {
            key: 'name',
            name: 'Full name',
            sort: 'asc',
            func: e => e,
          },
          {
            key: 'name',
            name: 'Full name',
            sort: 'asc',
            func: e => e,
          },
        ],
      };

      try {
        component.createColumnFromArray(config.column);
      } catch (e) {
        expect(e.message).toBe(`Column key=name already declare`);
      }
    });
  });
});
