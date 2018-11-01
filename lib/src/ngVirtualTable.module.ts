import { NgModule, ModuleWithProviders, EmbeddedViewRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ScrollingModule, CdkVirtualForOf, CdkVirtualForOfContext } from '@angular/cdk/scrolling';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { VirtualTableComponent } from './components/virtual-table.component';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { DynamicModule } from 'ng-dynamic-component';
import { NgVirtualTableService } from './services/ngVirtualTable.service';
import { LayoutModule } from '@angular/cdk/layout';

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
    BrowserAnimationsModule,
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
  providers: [NgVirtualTableService],
})
export class NgVirtualTableModule {
  public static forRoot(): ModuleWithProviders {
    return {
      ngModule: NgVirtualTableModule,
    };
  }
}
