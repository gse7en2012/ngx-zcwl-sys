import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

// import { LoadingComponent } from '../../my-components/loading/loading.component';
// import { MaintRoutingModule } from './maint-routing.module';
import { MaintComponent } from './maint.component';
import { ListComponent } from './list/list.component';
import { NewMaintComponent } from './new-maint/new-maint.component';


const routes: Routes = [
  { path: '', redirectTo:'list'},
  { path: 'list', component: ListComponent },
  { path: 'new_maint', component: NewMaintComponent },
];



@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    // MaintRoutingModule,
    RouterModule.forChild(routes)
  ],
  declarations: [MaintComponent, ListComponent, NewMaintComponent]
})
export class MaintModule { }
