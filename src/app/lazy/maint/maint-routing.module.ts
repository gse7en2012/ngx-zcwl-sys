import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MaintComponent } from './maint.component';

const routes: Routes = [
  { path: '', component: MaintComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MaintRoutingModule { }
