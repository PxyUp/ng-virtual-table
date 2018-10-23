import { NgModule, ModuleWithProviders, EmbeddedViewRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ScrollDispatchModule,
  CdkVirtualForOf,
  CdkVirtualForOfContext,
} from '@angular/cdk/scrolling';
import { VirtualTableComponent } from './components/virtual-table.component';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';

CdkVirtualForOf.prototype['_updateContext'] = function(this: any) {
  const count = this._data.length;
  let i = this._viewContainerRef.length;
  while (i--) {
    let view = this._viewContainerRef.get(i) as EmbeddedViewRef<CdkVirtualForOfContext<any>>;
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
    ScrollDispatchModule,
  ],
  exports: [VirtualTableComponent],
  providers: [],
})
export class NgVirtualTableModule {
  public static forRoot(): ModuleWithProviders {
    return {
      ngModule: NgVirtualTableModule,
    };
  }
}
