import { CdkVirtualForOf, CdkVirtualForOfContext, ScrollingModule } from '@angular/cdk/scrolling';
import { EmbeddedViewRef, ModuleWithProviders, NgModule } from '@angular/core';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CommonModule } from '@angular/common';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { DynamicModule } from 'ng-dynamic-component';
import { LayoutModule } from '@angular/cdk/layout';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { NgVirtualTableService } from './services/ngVirtualTable.service';
import { ReactiveFormsModule } from '@angular/forms';
import { VirtualTableComponent } from './components/virtual-table.component';

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
