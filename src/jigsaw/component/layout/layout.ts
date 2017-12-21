import {
    Component, ComponentFactory, ComponentFactoryResolver, ComponentRef, ElementRef, NgModule,
    ViewChild, Input, Output, EventEmitter,
} from "@angular/core";
import {AbstractJigsawComponent, JigsawCommonModule, JigsawRendererHost} from "../common";
import {CommonModule} from "@angular/common";

export enum LayoutType {row, column}

@Component({
    selector: 'jigsaw-layout, j-layout',
    templateUrl: './layout.html',
    host: {
        '[class.jigsaw-layout]': 'true',
        '[class.jigsaw-layout-optioned]': '_$children.length',
        '[style.width]': 'width',
        '[style.height]': 'height',
        '[style.margin-bottom]': 'marginBottom',
        '[style.margin-right]': 'marginRight'
    }
})
export class JigsawLayout extends AbstractJigsawComponent {
    constructor(private _resolver: ComponentFactoryResolver, private _elementRef: ElementRef) {
        super();
    }

    @ViewChild(JigsawRendererHost)
    public rendererHost: JigsawRendererHost;

    /**
     * internal
     */
    public _$children: ComponentRef<JigsawLayout>[] = [];

    @Input()
    public childMarginBottom: number = 4;

    @Input()
    public childMarginRight: number = 4;

    public marginBottom: string;

    public marginRight: string;

    public selfRef: ComponentRef<JigsawLayout>;

    private _maxChildWidth = 50;
    private _maxChildHeight = 30;
    private _layoutType;

    @Output()
    public remove = new EventEmitter<ComponentRef<JigsawLayout>>();

    /**
     * internal
     */
    public _$layout(layoutType: LayoutType, layoutNum: number = 2) {
        if (layoutNum <= 0) return;

        let childMarginSetting,
            childMaxSizeSetting,
            childSize,
            childWidth,
            childHeight,
            childMargin;

        childSize = this._getChildSize(layoutType, layoutNum);
        if (layoutType === LayoutType.row) {
            childMarginSetting = this.childMarginBottom;
            childMaxSizeSetting = this._maxChildHeight;
            childWidth = '100%';
            childHeight = childSize + '';
            childMargin = 'marginBottom';
        } else if (layoutType === LayoutType.column) {
            childMarginSetting = this.childMarginRight;
            childMaxSizeSetting = this._maxChildWidth;
            childWidth = childSize + '';
            childHeight = '100%';
            childMargin = 'marginRight';
        }

        if (childSize < childMaxSizeSetting) {
            console.warn(`Can not layout less ${childMaxSizeSetting}px ${layoutType === LayoutType.row ? 'height' : 'width'} box.`);
            return;
        }

        for (let i = 0; i < layoutNum; i++) {
            const layoutRef = this._childBoxFactory();
            const layout = layoutRef.instance;
            layout.selfRef = layoutRef;
            layout.width = childWidth;
            layout.height = childHeight;
            if (i < layoutNum - 1) {
                layout[childMargin] = childMarginSetting + 'px';
            }
            layout.remove.subscribe(layoutRef => {
                const viewContainerRef = this.rendererHost.viewContainerRef;
                viewContainerRef.remove(viewContainerRef.indexOf(layoutRef));
                this._$children.splice(this._$children.indexOf(layoutRef), 1);
                this._resizeChild();
            });

            this._$children.push(layoutRef);
        }

        this._layoutType = layoutType;
    }

    /**
     * internal
     */
    public _$remove() {
        this.remove.emit(this.selfRef);
    }

    private _childBoxFactory(): ComponentRef<JigsawLayout> {
        const layoutFactory: ComponentFactory<JigsawLayout> = this._resolver.resolveComponentFactory(JigsawLayout);
        return this.rendererHost.viewContainerRef.createComponent(layoutFactory);
    }

    private _getChildSize(layoutType: LayoutType, layoutNum: number): number {
        if (layoutNum <= 0) return 0;

        let hostOffset, childMarginSetting;
        childMarginSetting = layoutType === LayoutType.row ? this.childMarginBottom : this.childMarginRight;
        hostOffset = layoutType === LayoutType.row ? 'offsetHeight' : 'offsetWidth';
        return Math.floor((this._elementRef.nativeElement[hostOffset] - (layoutNum - 1) * childMarginSetting) / layoutNum);
    }

    private _resizeChild() {
        if (!this._$children.length) return;

        const childSize = this._getChildSize(this._layoutType, this._$children.length);
        const resizeProp = this._layoutType == LayoutType.row ? 'height' : 'width';
        this._$children.forEach(layoutRef => {
            layoutRef.instance[resizeProp] = childSize + 'px';
        })
    }

}

@NgModule({
    imports: [CommonModule, JigsawCommonModule],
    declarations: [JigsawLayout,],
    exports: [JigsawLayout],
    entryComponents: [JigsawLayout]
})
export class JigsawLayoutModule {

}
