import { SimpleChanges } from '@angular/core';
import { Observable } from 'rxjs';
interface VirtualTableItem {
    [key: string]: any;
}
export declare class VirtualTableComponent {
    itemCount: number;
    dataSource: Observable<Array<VirtualTableItem>>;
    headerColumn: Array<string>;
    private _headerColumn;
    column: Array<string>;
    _dataStream: Observable<Array<VirtualTableItem>>;
    ngOnChanges(changes: SimpleChanges): void;
}
export {};
