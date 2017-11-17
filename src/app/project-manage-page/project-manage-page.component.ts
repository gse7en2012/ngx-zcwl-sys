import { Component, OnInit } from '@angular/core';
import { ShareService } from '../service/share.service';

@Component({
  selector: 'app-project-manage-page',
  templateUrl: './project-manage-page.component.html',
  styleUrls: ['./project-manage-page.component.scss'],
  providers: [ShareService]
})
export class ProjectManagePageComponent implements OnInit {

  constructor(private shareService: ShareService) { }
  
  ngOnInit() {
  }

  componentAdded(e){
    this.shareService.emitChange('Data from child');
  }

}
