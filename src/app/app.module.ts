import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule,Http } from '@angular/http';
import { RouterModule, Routes } from '@angular/router';
import { MyDatePickerModule } from 'mydatepicker';
import { CookieModule } from 'ngx-cookie';
import { AngularEchartsModule } from 'ngx-echarts';

import { AuthGuard } from './auth-guard';
// import { UserService } from './service/user.service';
import { ExtendedHttpService } from './service/extended-http.service';
import { ClickOutsideModule } from 'ng-click-outside';
import { AppComponent } from './app.component';

import { MasterPageComponent } from './master-page/master-page.component';
import { DataPageComponent } from './data-page/data-page.component';
import { WarningPageComponent } from './warning-page/warning-page.component';
import { ErrorPageComponent } from './error-page/error-page.component';
import { DashboardPageComponent } from './dashboard-page/dashboard-page.component';
import { DangerPageComponent } from './danger-page/danger-page.component';


const appRoutes: Routes = [
  { path: '', redirectTo: 'master', pathMatch: 'full' },
  // { path: 'login', component: LoginPageComponent },
  // { path: 'echarts',component:EchartsComponent}
  { path: 'master', component: MasterPageComponent },
  { path: 'data', component: DataPageComponent },
  { path: 'warning', component: WarningPageComponent },
  { path: 'mistake', component: ErrorPageComponent },
  { path: 'dashboard', component: DashboardPageComponent },
  { path: 'danger', component: DangerPageComponent },
];

@NgModule({
  declarations: [
    AppComponent,
    MasterPageComponent,
    DataPageComponent,
    WarningPageComponent,
    ErrorPageComponent,
    DashboardPageComponent,
    DangerPageComponent
  ],
  imports: [
    BrowserModule,
    CookieModule.forRoot(),
    RouterModule.forRoot(appRoutes)
  ],
  providers: [
    AuthGuard, 
    // UserService,
    { provide: Http, useClass: ExtendedHttpService }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
