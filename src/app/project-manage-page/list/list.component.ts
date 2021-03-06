import { Component, OnInit, EventEmitter, Input, Output,HostListener } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { ProjectService } from '../../service/project.service';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ProjectManageListComponent implements OnInit {

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

  constructor(private projectService: ProjectService, private route: ActivatedRoute, private router: Router) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      if (params && params.agency_id) {
        this.agencyId = params.agency_id;
        if (this.agencyId !== 'init') {
          this.getData();
        } 
      }
    });
  }

  getData() {
    this.projectService.getProjectList(this.agencyId).then((data) => {
      this.projectList = data.project_list;
      this.total = data.total_rows;
      this.loading = false;


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
