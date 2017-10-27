import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule, Http } from '@angular/http';
import { RouterModule, Routes } from '@angular/router';
import { MyDatePickerModule } from 'mydatepicker';
import { CookieModule } from 'ngx-cookie';
import { AngularEchartsModule } from 'ngx-echarts';

import { errCodeMsgHash } from './service/err-msg';
import { LibService } from './service/lib.service';
import { UserService } from './service/user.service';
import { AuthGuard } from './auth-guard';

import { ExtendedHttpService } from './service/extended-http.service';
import { ClickOutsideModule } from 'ng-click-outside';
import { AppComponent } from './app.component';

import { MasterPageComponent } from './master-page/master-page.component';


import { DataPageComponent } from './data-page/data-page.component';
import { BranchComponent } from './data-page/branch/branch.component';
import { DeviceComponent } from './data-page/device/device.component';



import { WarningPageComponent } from './warning-page/warning-page.component';
import { ErrorPageComponent } from './error-page/error-page.component';
import { DashboardPageComponent } from './dashboard-page/dashboard-page.component';
import { DangerPageComponent } from './danger-page/danger-page.component';
import { LoginPageComponent } from './login-page/login-page.component';
import { ParentContainerComponent } from './parent-container/parent-container.component';
import { ProjectComponent } from './data-page/project/project.component';
import { ListComponent } from './warning-page/list/list.component';
import { DetailsTableComponent } from './warning-page/details-table/details-table.component';

const appRoutes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginPageComponent },


];


const dataRoutes:Routes=[
  { path: '',   component:DataPageComponent },
  { path: 'agency/:agency_id', component: ProjectComponent },
  { path: 'agency/:agency_id/branch/:branch_id', component: BranchComponent },
  { path: 'agency/:agency_id/device/:device_id', component: DeviceComponent },
]

const warningRoutes:Routes=[
  { path: '',   component:WarningPageComponent },
  { path: 'agency/:agency_id', component: ProjectComponent },
  { path: 'agency/:agency_id/branch/:branch_id', component: ListComponent },
  { path: 'agency/:agency_id/device/:device_id', component: DetailsTableComponent },
]

const adminRoutes: Routes = [
  {
    path: 'admin', component: ParentContainerComponent, children: [
      { path: 'master', component: MasterPageComponent },
      { path: 'data', component: DataPageComponent,children:dataRoutes },
      { path: 'warning', component: WarningPageComponent,children:warningRoutes },
      { path: 'mistake', component: ErrorPageComponent },
      { path: 'dashboard', component: DashboardPageComponent },
      { path: 'danger', component: DangerPageComponent },
    ],
    canActivate: [AuthGuard]
  }
]

@NgModule({
  declarations: [
    AppComponent,
    MasterPageComponent,
    DataPageComponent,
    WarningPageComponent,
    ErrorPageComponent,
    DashboardPageComponent,
    DangerPageComponent,
    BranchComponent,
    DeviceComponent,
    LoginPageComponent,
    ParentContainerComponent,
    ProjectComponent,
    ListComponent,
    DetailsTableComponent,
  ],
  imports: [
    BrowserModule,
    AngularEchartsModule,
    FormsModule,
    HttpModule,
    MyDatePickerModule,
    CookieModule.forRoot(),
    RouterModule.forRoot(appRoutes),
    RouterModule.forChild(adminRoutes),
    RouterModule.forChild(dataRoutes)
  ],
  providers: [
    errCodeMsgHash,
    AuthGuard,
    LibService,
    UserService,
    { provide: Http, useClass: ExtendedHttpService }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
