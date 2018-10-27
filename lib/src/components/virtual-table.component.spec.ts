import { VirtualTableComponent } from './virtual-table.component';
import { ComponentFixture, async, TestBed, tick, fakeAsync } from '@angular/core/testing';
import { NgVirtualTableService } from '../services/ngVirtualTable.service';
import { MatIconModule } from '@angular/material/icon';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ScrollDispatchModule } from '@angular/cdk/scrolling';
import { DragDropModule, CdkDragDrop } from '@angular/cdk/drag-drop';
import { DynamicModule } from 'ng-dynamic-component';
import { VirtualTableConfig, VirtualTableColumn, VirtualTableColumnInternal } from '../interfaces';
import { of } from 'rxjs';
import { By } from '@angular/platform-browser';
import { SimpleChange, DebugElement } from '@angular/core';
describe('VirtualTableComponent', () => {
  let fixture: ComponentFixture<VirtualTableComponent>;
  let component: VirtualTableComponent;
  let debugEl: DebugElement;
  let service: NgVirtualTableService;
  beforeEach(
    async(() => {
      TestBed.configureTestingModule({
        imports: [
          ReactiveFormsModule,
          BrowserAnimationsModule,
          MatIconModule,
          MatFormFieldModule,
          ScrollDispatchModule,
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
    }),
  );

  it('should exist', () => {
    expect(fixture).toBeTruthy();
  });

  describe('applyDatasource', () => {
    it(
      'should apply datasource',
      fakeAsync(() => {
        const config: VirtualTableConfig = {
          header: true,
        };

        const dataSource = of(
          Array(1).fill(0).map((e) => ({
            name: Math.random().toString(36).substring(7),
            age: Math.round(Math.random() * 1000),
          })),
        );

        const dataSource2 = of(
          Array(3).fill(0).map((e) => ({
            name: Math.random().toString(36).substring(7),
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

        expect(header).not.toBe(null);
        expect(debugEl.nativeElement.querySelectorAll('.virtual-table-row').length).toBe(1);

        component.applyDatasource(dataSource2);
        fixture.detectChanges();

        const headerAfter = debugEl.query(By.css('.header'));

        expect(headerAfter).not.toBe(null);
        expect(debugEl.nativeElement.querySelectorAll('.virtual-table-row').length).toBe(3);
      }),
    );
  });

  describe('filtering', () => {
    it('should filter text by control', () => {
      const dataSource = of(Array(5).fill(0).map((e, index) => index));

      const config: VirtualTableConfig = {
        column: [
          {
            key: 'name',
            name: 'Full name',
            sort: null,
            func: (e) => e,
          },
        ],
      };

      component.config = config;
      component.dataSource = dataSource;

      const sub = component._dataStream.subscribe((value) => {
        expect(value).toEqual([0, 1, 2, 3, 4]);
      });
      sub.unsubscribe();

      component.filterControl.setValue('0');
      const sub1 = component._dataStream.subscribe((value) => {
        expect(value).toEqual([0]);
      });
      sub1.unsubscribe();
      component.filterControl.setValue('01');
      const sub2 = component._dataStream.subscribe((value) => {
        expect(value).toEqual([]);
      });
      sub2.unsubscribe();
    });
  });

  describe('isEmptySubject', () => {
    it('should emit false when datasource not  empty', () => {
      const dataSource = of(Array(5).fill(0).map((e, index) => index));

      const config: VirtualTableConfig = {
        column: [
          {
            key: 'name',
            name: 'Full name',
            sort: null,
            func: (e) => e,
          },
        ],
      };

      component.config = config;
      component.dataSource = dataSource;

      component.ngOnChanges({
        config: new SimpleChange(null, component.config, false),
        dataSource: new SimpleChange(null, component.dataSource, false),
      });
      fixture.detectChanges();

      const sub = component.isEmptySubject$.subscribe((value) => {
        expect(value).toBe(false);
      });
      sub.unsubscribe();
    });

    it('should emit true when datasource not empty', () => {
      const dataSource = of([]);

      const config: VirtualTableConfig = {
        column: [
          {
            key: 'name',
            name: 'Full name',
            sort: null,
            func: (e) => e,
          },
        ],
      };

      component.config = config;
      component.dataSource = dataSource;

      component.ngOnChanges({
        config: new SimpleChange(null, component.config, false),
        dataSource: new SimpleChange(null, component.dataSource, false),
      });
      fixture.detectChanges();

      const sub = component.isEmptySubject$.subscribe((value) => {
        expect(value).toBe(true);
      });
      sub.unsubscribe();
    });

    it(
      'should emit true when datasource change on empty',
      fakeAsync(() => {
        const dataSource = of(Array(5).fill(0).map((e, index) => index));

        const dataSource2 = of([]);

        const config: VirtualTableConfig = {
          column: [
            {
              key: 'name',
              name: 'Full name',
              sort: null,
              func: (e) => e,
            },
          ],
        };

        component.config = config;
        component.dataSource = dataSource;

        component.ngOnChanges({
          config: new SimpleChange(null, component.config, false),
          dataSource: new SimpleChange(null, component.dataSource, false),
        });
        fixture.detectChanges();

        const sub = component.isEmptySubject$.subscribe((value) => {
          expect(value).toBe(false);
        });
        sub.unsubscribe();
        component.applyDatasource(dataSource2);
        const sub2 = component.isEmptySubject$.subscribe((value) => {
          expect(value).toBe(true);
        });
        sub2.unsubscribe();
      }),
    );
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
  });

  describe('resizeEnd', () => {
    it('should set `false` activeResize on column', () => {
      const column = {
        width: 55,
        activeResize: true,
      } as VirtualTableColumnInternal;
      component.resizeEnd(column, 0);
      expect(column).toEqual({
        width: 55,
        activeResize: false,
      });
    });
  });

  describe('applyConfig', () => {
    it(
      'should apply config',
      fakeAsync(() => {
        const config: VirtualTableConfig = {
          header: false,
        };

        const config2: VirtualTableConfig = {
          header: true,
        };

        const dataSource = of(
          Array(100).fill(0).map((e) => ({
            name: Math.random().toString(36).substring(7),
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
      }),
    );
  });

  describe('Template', () => {
    it(
      'should not show header',
      fakeAsync(() => {
        const config: VirtualTableConfig = {
          header: false,
        };

        const dataSource = of(
          Array(100).fill(0).map((e) => ({
            name: Math.random().toString(36).substring(7),
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
      }),
    );

    it(
      'should show header',
      fakeAsync(() => {
        const config: VirtualTableConfig = {};

        const dataSource = of(
          Array(100).fill(0).map((e) => ({
            name: Math.random().toString(36).substring(7),
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
      }),
    );

    it(
      'should apply sort',
      fakeAsync(() => {
        const config: VirtualTableConfig = {};

        const dataSource = of(
          Array(100).fill(0).map((e) => ({
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
      }),
    );

    it(
      'should not show filter',
      fakeAsync(() => {
        const config: VirtualTableConfig = {};

        const dataSource = of(
          Array(100).fill(0).map((e) => ({
            name: Math.random().toString(36).substring(7),
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
      }),
    );

    it(
      'should show filter',
      fakeAsync(() => {
        const config: VirtualTableConfig = {
          filter: true,
        };

        const dataSource = of(
          Array(100).fill(0).map((e) => ({
            name: Math.random().toString(36).substring(7),
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
      }),
    );

    describe('toggleFilter', () => {
      it(
        'should show filter',
        fakeAsync(() => {
          const config: VirtualTableConfig = {
            filter: true,
          };

          const dataSource = of(
            Array(100).fill(0).map((e) => ({
              name: Math.random().toString(36).substring(7),
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
        }),
      );
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
          func: (e) => e,
        },
        {
          key: 'name2',
          name: 'Full name',
          sort: null,
          func: (e) => e,
        },
        {
          key: 'name3',
          name: 'Full name',
          sort: null,
          func: (e) => e,
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

  describe('applySort', () => {
    it('should apply sort for column', () => {
      const dataSource = of(Array(5).fill(0).map((e, index) => index));

      const config: VirtualTableConfig = {
        column: [
          {
            key: 'name',
            name: 'Full name',
            sort: null,
            func: (e) => e,
          },
        ],
      };

      component.config = config;
      component.dataSource = dataSource;

      const sub = component._dataStream.subscribe((value) => {
        expect(value).toEqual([0, 1, 2, 3, 4]);
      });
      sub.unsubscribe();
      component.applySort('name');
      const sub2 = component._dataStream.subscribe((value) => {
        expect(value).toEqual([0, 1, 2, 3, 4]);
      });
      sub2.unsubscribe();
      component.applySort('name');

      const sub3 = component._dataStream.subscribe((value) => {
        expect(value).toEqual([4, 3, 2, 1, 0]);
      });
      sub3.unsubscribe();

      const sub4 = component._dataStream.subscribe((value) => {
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

      expect(component.getElement(item, (e) => e.name)).toBe(5);

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

      expect(component.getElement(item, (e) => e.name)).toBe(5);
      expect(component.getElement(item2, (e) => e.label.test.test.test)).toBe('name');
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
            func: (e) => e,
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
            func: (e) => e,
          },
        ],
      };

      component.column = config.column;

      expect(component._sortAfterConfigWasSet()).toEqual('name');
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
            func: (e) => e,
          },
        ],
      };

      expect(component.createColumnFromArray(config.column)).toEqual(
        service.createColumnFromArray(config.column),
      );
    });
  });
});
