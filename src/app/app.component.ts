import { Component } from '@angular/core';
import { UserService } from './service/user.service';
import { ProjectService } from './service/project.service';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  providers:[ProjectService]
})
export class AppComponent {
  title = 'app';

  constructor(private userService:UserService,private projectService:ProjectService){
    this.projectService.getProjectList().then((data)=>{
      this.userService.setProjectList(data.project_list);
    })
  }

}
