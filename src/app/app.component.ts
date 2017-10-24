import { Component } from '@angular/core';
import { UserService } from './service/user.service';
import { ProjectService } from './service/project.service';

import { Router, CanActivate } from '@angular/router';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  providers: [ProjectService]
})
export class AppComponent {
  title = 'app';

  constructor(private userService: UserService, private projectService: ProjectService,private router: Router) {
    // if (this.userService.checkAdminLogin()) {
    //   this.projectService.getProjectList().then((data) => {
    //     this.userService.setProjectList(data.project_list);
    //   })
    // }else{
    //   this.router.navigate(['/login']);
    // }
  }

}
