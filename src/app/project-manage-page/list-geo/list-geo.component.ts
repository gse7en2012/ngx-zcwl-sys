import { Component, OnInit, EventEmitter, Input, Output,HostListener } from '@angular/core';
import { Router, ActivatedRoute, Params,Event,NavigationEnd } from '@angular/router';
import { ProjectService } from '../../service/project.service';

@Component({
  selector: 'app-list-geo',
  templateUrl: './list-geo.component.html',
  styleUrls: ['./list-geo.component.scss']
})
export class ProjectManageListGeoComponent implements OnInit {

  public agencyId;
  public projectList = [];
  public projectListPageShow = [];
  public loading: boolean = true;
  public total: number = 0;
  public pageSize: number = 8;
  public page: number = 1;
  public jumpPage: number = 1;
  public pageMax: number = 1;
  public projectKeyword:string;
  public projectSearch:any;


  public geoInfo:any={};
  public geoLevel:string;
  public qs:any;



  constructor(private projectService: ProjectService, private route: ActivatedRoute, private router: Router) { }

  ngOnInit() {
    
    this.getInitQueryString();
    this.getData();
    this.router.events
    .filter(event => event instanceof NavigationEnd)
    .subscribe((event:NavigationEnd) => {
      // You only receive NavigationStart events

      this.getData();
      
    });


  }

  getData() {
    this.getInitQueryString();    
    this.projectService.getGeoProjectListManage(this.geoInfo,this.geoLevel).then((data) => {
      this.projectList = data.project_list;
      this.total = data.total_rows;
      this.loading = false;
      // this.agencyInfo = data.lv2_agency_info;

      this.pageMax = Math.ceil(this.total / this.pageSize)
      this.renderData();
    })
  }

  getInitQueryString(){
    this.route.queryParams.subscribe(queryParams=>{
      this.geoLevel=queryParams.geo_level;
      this.geoInfo={
        efairyproject_province:queryParams.province,
        efairyproject_city:queryParams.city,
        efairyproject_district:queryParams.district,
        efairyproject_township:queryParams.town,
        efairyproject_seaarea:''
      }
      this.qs=queryParams;
    

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

  deleteProject(pid){
    if(!confirm('确定删除该项目？')) return;
    this.projectService.deleteProject(pid).then(()=>{
      this.getData();
    })
  }


  searchProject(){
    if (this.projectKeyword !== '') {
      this.projectSearch = [];
      this.projectList.forEach((item) => {
        if (item.efairyproject_name.indexOf(this.projectKeyword) !== -1 || item.efairyproject_id.toString().indexOf(this.projectKeyword) !== -1)
          this.projectSearch.push(item);
      })
      this.projectListPageShow = this.projectSearch;
    } else {
      this.renderData();
    }
  }

  @HostListener('window:keydown', ['$event'])
  keyboardInput(event: KeyboardEvent) {
    if (event.keyCode === 13) { this.searchProject(); }
  }

}
