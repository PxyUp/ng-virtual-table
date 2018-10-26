import { VirtualTableComponent } from './virtual-table.component';
import { ComponentFixture, async, TestBed } from '@angular/core/testing';
import { NgVirtualTableService } from '../services/ngVirtualTable.service';
import { MatIconModule } from '@angular/material/icon';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ScrollDispatchModule } from '@angular/cdk/scrolling';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { DynamicModule } from 'ng-dynamic-component';
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
});
