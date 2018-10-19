import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ScrollDispatchModule } from '@angular/cdk/scrolling';
import { VirtualTableComponent } from './components/virtual-table.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserModule } from '@angular/platform-browser';
@NgModule({
  declarations: [VirtualTableComponent],
  imports: [BrowserModule, CommonModule, BrowserAnimationsModule, ScrollDispatchModule],
  exports: [VirtualTableComponent],
  providers: [],
})
export class NgVirtualTableModule {}
