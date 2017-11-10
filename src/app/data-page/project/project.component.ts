import { Component, OnInit, EventEmitter, Input, Output } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { ProjectService } from '../../service/project.service';

@Component({
  selector: 'app-project',
  templateUrl: './project.component.html',
  styleUrls: ['./project.component.scss'],
  // providers:[ProjectService]
})
export class ProjectComponent implements OnInit {

  public agencyId;
  public projectList = [];
  public agencyInfo:any={};
  public projectListPageShow = [];
  public loading: boolean = true;
  public total: number = 0;
  public pageSize: number = 12;
  public page: number = 1;
  public jumpPage: number = 1;
  public pageMax: number = 1;
 
  @Output() onRedirectToFirstTab = new EventEmitter<boolean>();

  constructor( private projectService: ProjectService,private route: ActivatedRoute, private router: Router ) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      if (params && params.agency_id) {
        this.agencyId = params.agency_id;
        if(this.agencyId!=='init'){
          this.getData(); 
        }else{
          console.log('emit');
          this.onRedirectToFirstTab.emit(true);
        }
      }
    });
  }

  getData(){
    this.projectService.getProjectList(this.agencyId).then((data) => {
      this.projectList = data.project_list;
      this.total = data.total_rows;
      this.loading = false;
      this.agencyInfo=data.lv2_agency_info;

      this.pageMax = Math.ceil(this.total / this.pageSize)
      this.renderData();
    })
  }

  renderData() {
    this.projectListPageShow = this.projectList.slice((this.page - 1) * this.pageSize, this.page * this.pageSize);
  }
  prevPage() {
    if (this.page <= 1) return false;
    this.page--;
    this.renderData();
  }

  nextPage() {
    if (this.page >= this.pageMax) return false;
    this.page++;
    this.renderData();
  }

  changePage() {
    this.page = this.jumpPage;
    this.renderData();
  }

  search() {

  }
}
