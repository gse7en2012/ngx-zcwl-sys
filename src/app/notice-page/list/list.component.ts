import { Component, OnInit, EventEmitter, Input, Output,HostListener } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { ProjectService } from '../../service/project.service';
@Component({
  selector: 'app-notice-page',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class NoticeListComponent implements OnInit {


  public noticeList = [];
  // public projectListPageShow = [];
  public loading: boolean = true;
  public total: number = 0;
  public pageSize: number = 12;
  public page: number = 1;
  public jumpPage: number = 1;
  public pageMax: number = 1;
  public noticeKeyword:string;
  // public projectSearch:any;


  constructor( private projectService: ProjectService,private route: ActivatedRoute, private router: Router ) { }
  

  ngOnInit() {
    this.getNoticeList();
  }


  getNoticeList() {
    this.loading = true;
    this.projectService.getNoticeList(this.page, this.pageSize, this.noticeKeyword).then((data) => {
      this.noticeList = data.announcement_list;
      this.total = data.total_rows;
      this.pageMax = Math.ceil(this.total / this.pageSize);
      this.loading = false;
    })
  }

}
