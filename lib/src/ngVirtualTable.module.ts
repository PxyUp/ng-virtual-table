import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ScrollDispatchModule } from '@angular/cdk/scrolling';
import { VirtualTableComponent } from './components/virtual-table.component';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
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
