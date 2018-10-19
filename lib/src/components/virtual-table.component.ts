import { Component, ChangeDetectionStrategy, Input, SimpleChanges } from '@angular/core';
import { Observable, EMPTY } from 'rxjs';
import { tap } from 'rxjs/operators';

interface VirtualTableItem {
  [key: string]: any;
}

@Component({
  selector: 'ng-virtual-table',
  templateUrl: './virtual-table.component.html',
  styleUrls: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VirtualTableComponent {
  @Input() itemCount = 50;

  @Input() dataSource: Observable<Array<VirtualTableItem>>;

  @Input() headerColumn: Array<string>;

  private _headerColumn: Set<string> = new Set();

  public column: Array<string> = [];

  public _dataStream: Observable<Array<VirtualTableItem>> = EMPTY;

  ngOnChanges(changes: SimpleChanges) {
    if ('dataSource' in changes && changes.dataSource instanceof Observable) {
      this._dataStream = changes.dataSource.pipe(
        tap((stream: Array<VirtualTableItem>) => {
          this._headerColumn.clear();
          stream.forEach((e) => Object.keys(e).forEach((key) => this._headerColumn.add(key)));
          this.column = Array.from(this._headerColumn);
        }),
      );
    }

    if ('headerColumn' in changes && Array.isArray(changes.headerColumn)) {
      this.column = changes.headerColumn;
    }
  }
}
