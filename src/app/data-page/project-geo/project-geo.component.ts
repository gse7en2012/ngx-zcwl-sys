import { Component, OnInit, EventEmitter, Input, Output } from '@angular/core';
import { Router, ActivatedRoute, Params,Event,NavigationEnd } from '@angular/router';
import { ProjectService } from '../../service/project.service';
import 'rxjs/add/operator/filter';

@Component({
  selector: 'app-project-geo',
  templateUrl: './project-geo.component.html',
  styleUrls: ['./project-geo.component.scss']
})
export class ProjectGeoComponent implements OnInit {

  public agencyId;
  public projectList = [];
  public agencyInfo: any = {};
  public projectListPageShow = [];
  public loading: boolean = true;
  public total: number = 0;
  public pageSize: number = 12;
  public page: number = 1;
  public jumpPage: number = 1;
  public pageMax: number = 1;

  public geoInfo:any={};
  public geoLevel:string;
  public qs:any;

  // @Output() onRedirectToFirstTab = new EventEmitter<boolean>();

  constructor(private projectService: ProjectService, private route: ActivatedRoute, private router: Router) { }

  ngOnInit() {

   
    this.getInitQueryString();
    this.getData();
    this.router.events
    .filter(event => event instanceof NavigationEnd)
    .subscribe((event:NavigationEnd) => {
      // You only receive NavigationStart events
      console.log(event);
      this.getData();
      
    });
  //   this.router.events.subscribe((val) => {
  //     // see also 
  //     this.getInitQueryString();
  //     this.getData()      ;
  //     console.log(val instanceof NavigationEnd) 
  // });

  }

  getData() {
    this.getInitQueryString();    
    this.projectService.getGeoProjectList(this.geoInfo,this.geoLevel).then((data) => {
      this.projectList = data.project_list;
      this.total = data.total_rows;
      this.loading = false;
      this.agencyInfo = data.lv2_agency_info;

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

  search() {

  }

}
