import { CommonModule } from '@angular/common';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { DynamicModule } from 'ng-dynamic-component';
import { LayoutModule } from '@angular/cdk/layout';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { VirtualTableComponent } from './components/virtual-table.component';

@NgModule({
  declarations: [VirtualTableComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatIconModule,
    MatFormFieldModule,
    ScrollingModule,
    DragDropModule,
    MatPaginatorModule,
    MatProgressSpinnerModule,
    LayoutModule,
    DynamicModule.withComponents([]),
  ],
  exports: [VirtualTableComponent],
})
export class NgVirtualTableModule {}
