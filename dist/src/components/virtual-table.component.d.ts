import { SimpleChanges } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { FormControl } from '@angular/forms';
interface VirtualTableItem {
    [key: string]: any;
}
interface VirtualTableColumn {
    name: string;
    sort: 'asc' | 'desc' | null;
}
export declare class VirtualTableComponent {
    itemCount: number;
    dataSource: Observable<Array<VirtualTableItem>>;
    headerColumn: Array<string>;
    onRowClick: (item: VirtualTableItem) => void;
    filterControl: FormControl;
    private _headerColumn;
    column: Array<VirtualTableColumn>;
    _dataStream: Observable<Array<VirtualTableItem>>;
    private sort$;
    private _destroyed$;
    private _headerWasSet;
    empty$: BehaviorSubject<boolean>;
    private filter$;
    applySort(column: string): void;
    ngOnChanges(changes: SimpleChanges): void;
    createColumnFromArray(arr: Array<string>): Array<VirtualTableColumn>;
    ngOnDestroy(): void;
    clickItem(item: VirtualTableItem): void;
    readonly isEmptySubject$: Observable<boolean>;
}
export {};
