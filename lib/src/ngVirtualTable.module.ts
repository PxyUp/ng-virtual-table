import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ScrollDispatchModule } from '@angular/cdk/scrolling';
import { VirtualTableComponent } from './components/virtual-table.component';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
@NgModule({
  declarations: [VirtualTableComponent],
  imports: [CommonModule, ReactiveFormsModule, BrowserAnimationsModule, ScrollDispatchModule],
  exports: [VirtualTableComponent],
  providers: [],
})
export class NgVirtualTableModule {}
