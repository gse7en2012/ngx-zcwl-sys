import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule, Http } from '@angular/http';
import { RouterModule, Routes } from '@angular/router';
import { MyDatePickerModule } from 'mydatepicker';
import { CookieModule } from 'ngx-cookie';
import { AngularEchartsModule } from 'ngx-echarts';
import { NguiAutoCompleteModule } from '@ngui/auto-complete';


import { errCodeMsgHash } from './service/err-msg';
import { LibService } from './service/lib.service';
import { UserService } from './service/user.service';
import { AuthGuard } from './auth-guard';

import { ExtendedHttpService } from './service/extended-http.service';
import { ClickOutsideModule } from 'ng-click-outside';
import { AppComponent } from './app.component';




/**
 * my components
 */
import { LeftNavPartComponent } from './my-components/left-nav-component/left-nav-component.component';
import { LoadingComponent } from './my-components/loading/loading.component';
import { PlaceholderPageComponent } from './my-components/placeholder-page/placeholder-page.component';
/**
 * admin part
 */
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
import { ErrorListComponent } from './error-page/error-list/error-list.component';
import { ProjectListComponent } from './error-page/project-list/project-list.component';
import { ErrorDetailsTableComponent } from './error-page/error-details-table/error-details-table.component';

/**
 * super part
 */
import { SuperContainerComponent } from './super-container/super-container.component';
import { UserManagePageComponent } from './user-manage-page/user-manage-page.component';
import { ProjectManagePageComponent } from './project-manage-page/project-manage-page.component';
import { SmsManagePageComponent } from './sms-manage-page/sms-manage-page.component';
import { ProjectManageListComponent } from './project-manage-page/list/list.component';
import { ProjectManageListGeoComponent } from './project-manage-page/list-geo/list-geo.component';
import { ProjectManageListGeoVComponent } from './project-manage-page/list-geo-v/list-geo-v.component';

import { DetailsComponent as ProjectManageDeatilsComponent } from './project-manage-page/details/details.component';
import { NewDeviceComponent } from './project-manage-page/new-device/new-device.component';
import { EditDeviceComponent } from './project-manage-page/edit-device/edit-device.component';
import { NewProjectComponent } from './project-manage-page/new-project/new-project.component';
import { ProjectGeoComponent } from './data-page/project-geo/project-geo.component';



const appRoutes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginPageComponent },
];


const dataRoutes: Routes = [
  { path: '', component: PlaceholderPageComponent },

  { path: 'geo/project', component: ProjectGeoComponent },
  { path: 'geo/project/branch/:branch_id', component: BranchComponent },
  { path: 'geo/project/branch/:branch_id/device/:device_id', component: DeviceComponent },
  { path: 'geo/project/branch/:branch_id/device/:device_id/edit', component: EditDeviceComponent },

  { path: ':parent_id/agency/:agency_id', component: ProjectComponent },
  { path: ':parent_id/agency/:agency_id/branch/:branch_id', component: BranchComponent },
  { path: ':parent_id/agency/:agency_id/branch_warning/:branch_id', component: ListComponent },
  { path: ':parent_id/agency/:agency_id/branch_mistake/:branch_id', component: ErrorListComponent },
  { path: ':parent_id/agency/:agency_id/branch/:branch_id/device/:device_id', component: DeviceComponent },
  { path: ':parent_id/agency/:agency_id/branch/:branch_id/device/:device_id/edit', component: EditDeviceComponent },
]

const warningRoutes: Routes = [
  { path: '', component: PlaceholderPageComponent },
  { path: 'agency/:agency_id', component: ProjectComponent },
  { path: 'agency/:agency_id/branch/:branch_id', component: ListComponent },
  { path: 'agency/:agency_id/device/:device_id', component: DetailsTableComponent },
]

const mistakeRoutes: Routes = [
  { path: '', component: PlaceholderPageComponent },
  { path: 'agency/:agency_id', component: ProjectListComponent },
  { path: 'agency/:agency_id/branch/:branch_id', component: ErrorListComponent },
  { path: 'agency/:agency_id/device/:device_id', component: ErrorDetailsTableComponent },
]

//super manage

const projectManageRoutes: Routes = [
  { path: '', component: PlaceholderPageComponent },

  { path: 'geo/project', component: ProjectManageListGeoComponent },
  { path: 'geo/project/details/:proejct_id', component: ProjectManageDeatilsComponent },
  { path: 'geo/project/details/:proejct_id/new_device', component: NewDeviceComponent },
  { path: 'geo/project/details/:proejct_id/edit_device/:device_id', component: EditDeviceComponent },
  { path: 'geo/project/new_project', component: NewProjectComponent },
  { path: 'geo/project/agency/:agency_id/device/:device_id', component: DeviceComponent },

  { path: ':parent_id/agency/:agency_id', component: ProjectManageListComponent },
  { path: ':parent_id/agency/:agency_id/new_project', component: NewProjectComponent },
  { path: ':parent_id/agency/:agency_id/details/:proejct_id', component: ProjectManageDeatilsComponent },
  { path: ':parent_id/agency/:agency_id/details/:proejct_id/new_device', component: NewDeviceComponent },
  { path: ':parent_id/agency/:agency_id/details/:proejct_id/edit_device/:device_id', component: EditDeviceComponent },
  { path: ':parent_id/agency/:agency_id/device/:device_id', component: DeviceComponent },
]


const adminRoutes: Routes = [
  {
    path: 'admin', component: ParentContainerComponent, children: [
      { path: '', redirectTo: 'master', pathMatch: 'full' },
      { path: 'master', component: MasterPageComponent },
      { path: 'data', component: DataPageComponent, children: dataRoutes },
      { path: 'warning', component: WarningPageComponent, children: warningRoutes },
      { path: 'mistake', component: ErrorPageComponent, children: mistakeRoutes },
      // { path: 'dashboard', component: DashboardPageComponent },
      { path: 'danger', component: DangerPageComponent },
    ],
    canActivate: [AuthGuard]
  },
  { path: 'dashboard', component: DashboardPageComponent },
  {
    path: 'super', component: SuperContainerComponent, children: [
      { path: '', redirectTo: 'project', pathMatch: 'full' },
      { path: 'user', component: UserManagePageComponent },
      { path: 'project', component: ProjectManagePageComponent, children: projectManageRoutes },
      { path: 'sms', component: SmsManagePageComponent },
    ]
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
    SuperContainerComponent,
    UserManagePageComponent,
    ProjectManagePageComponent,
    SmsManagePageComponent,
    ErrorListComponent,
    ProjectListComponent,
    ErrorDetailsTableComponent,

    LeftNavPartComponent,
    LoadingComponent,
    PlaceholderPageComponent,

    ProjectManageListComponent,
    ProjectManageListGeoComponent,
    ProjectManageListGeoVComponent,
    ProjectManageDeatilsComponent,

    NewDeviceComponent,
    EditDeviceComponent,
    NewProjectComponent,
    ProjectGeoComponent,


  ],
  imports: [
    BrowserModule,
    AngularEchartsModule,
    FormsModule,
    HttpModule,
    NguiAutoCompleteModule,
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
