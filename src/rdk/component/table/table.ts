import {
    Component, Input, NgModule, ComponentFactoryResolver, AfterViewInit, ViewChild, Type, ChangeDetectorRef
} from "@angular/core";
import {CommonModule} from "@angular/common";

import {RdkRendererHost} from "../core";
import {TableData} from "../../core/data/table-data";
import {TableCellRenderer} from "./table-api";


export class TableCellBasic implements AfterViewInit {
    constructor(private _componentFactoryResolver: ComponentFactoryResolver,
                private _changeDetector: ChangeDetectorRef) {
    }

    @Input()
    public tableData: TableData;
    @Input()
    public cellData: any;
    @Input()
    public row: number;
    @Input()
    public column: number;

    protected renderer: Type<TableCellRenderer>;

    @ViewChild(RdkRendererHost) rendererHost: RdkRendererHost;

    ngAfterViewInit(): void {
        let componentFactory = this._componentFactoryResolver.resolveComponentFactory(this.renderer);
        let viewContainerRef = this.rendererHost.viewContainerRef;
        viewContainerRef.clear();
        let componentRef = viewContainerRef.createComponent(componentFactory);
        componentRef.instance.tableData = this.tableData;
        componentRef.instance.cellData = this.cellData;
        componentRef.instance.row = this.row;
        componentRef.instance.column = this.column;
        this._changeDetector.detectChanges();
    }
}

@Component({
    selector: 'rdk-table',
    templateUrl: 'table.html'
})
export class RdkTable {
    @Input()
    public data: TableData;
}

@Component({
    selector: '[rdk-table-cell]',
    template: '<template rdk-renderer-host></template>'
})
export class RdkTableCell extends TableCellBasic {
    constructor(cfr: ComponentFactoryResolver, cd: ChangeDetectorRef) {
        super(cfr, cd);
        this.renderer = DefaultCellRenderer;
    }
}

@Component({
    selector: '[rdk-table-header]',
    template: '<template rdk-renderer-host></template>'
})
export class RdkTableHeader extends TableCellBasic {
    constructor(cfr: ComponentFactoryResolver, cd: ChangeDetectorRef) {
        super(cfr, cd);
        this.renderer = DefaultCellRenderer;
    }
}

@Component({
    template: '<span>{{cellData}}</span>'
})
export class DefaultCellRenderer extends TableCellRenderer {
}

@NgModule({
    declarations: [
        RdkTable, RdkTableCell, RdkRendererHost, RdkTableHeader, DefaultCellRenderer
    ],
    imports: [
        CommonModule
    ],
    exports: [CommonModule, RdkTable, RdkTableCell, RdkRendererHost, RdkTableHeader, DefaultCellRenderer],
    entryComponents: [DefaultCellRenderer]
})
export class RdkTableModule {
}