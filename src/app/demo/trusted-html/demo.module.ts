import {NgModule} from "@angular/core";
import {RouterModule} from "@angular/router";
import {TrustedHtmlFullModule} from "./full/app.module";

import {TrustedHtmlFullComponent} from "./full/app.component";

export const routerConfig = [
    {
        path: 'full', component: TrustedHtmlFullComponent, recommended: true
    },
];

@NgModule({
    imports: [
        RouterModule.forChild(routerConfig),
        TrustedHtmlFullModule,
    ],
    exports: [
    ],
    providers: []
})
export class TrustedHtmlDemoModule { }
