import { VirtualTableComponent } from './virtual-table.component';
import { ComponentFixture, async, TestBed, tick, fakeAsync } from '@angular/core/testing';
import { NgVirtualTableService } from '../services/ngVirtualTable.service';
import { MatIconModule } from '@angular/material/icon';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ScrollDispatchModule } from '@angular/cdk/scrolling';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { DynamicModule } from 'ng-dynamic-component';
import { VirtualTableConfig } from '../interfaces';
import { of } from 'rxjs';
import { By } from '@angular/platform-browser';
import { SimpleChange } from '@angular/core';
describe('VirtualTableComponent', () => {
  let fixture: ComponentFixture<VirtualTableComponent>;
  let component: VirtualTableComponent;
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
      fixture.detectChanges();
    }),
  );

  beforeEach(() => {});

  it('should exist', () => {
    expect(fixture).toBeTruthy();
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
        const header = fixture.nativeElement.querySelector('.header');

        expect(header).toBe(null);

        component.applyConfig(config2);
        fixture.detectChanges();

        const headerAfter = fixture.nativeElement.querySelector('.header');

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

        const header = fixture.nativeElement.querySelector('.header');

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
        const header = fixture.nativeElement.querySelector('.header');

        expect(header).not.toBe(null);
      }),
    );
  });
});
