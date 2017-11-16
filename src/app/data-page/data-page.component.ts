import { Component, OnInit } from '@angular/core';
import { ShareService } from '../service/share.service';


@Component({
  selector: 'app-data-page',
  templateUrl: './data-page.component.html',
  styleUrls: ['./data-page.component.scss'],
  providers: [ShareService]
})
export class DataPageComponent implements OnInit {


  constructor(private shareService: ShareService) { }

  ngOnInit() {}

  componentAdded(e){
    this.shareService.emitChange('Data from child');
  }

}



