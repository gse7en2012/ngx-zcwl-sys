import { Component, OnInit } from '@angular/core';
import { ProjectService } from '../service/project.service';
// import { UserService } from '../service/user.service';


@Component({
  selector: 'app-data-page',
  templateUrl: './data-page.component.html',
  styleUrls: ['./data-page.component.scss'],
  // providers: [ProjectService]
})
export class DataPageComponent implements OnInit {

  public branchList = [];
  public branchListPageShow=[];
  public loading:boolean=true;
  public total:number=0;
  public pageSize:number=12;
  public page:number=1;
  public jumpPage:number=1;
  public pageMax:number=1;

  constructor(
    private projectService: ProjectService,
    // private userService:UserService
  ) { }

  ngOnInit() {

    this.projectService.getProjectList().then((data) => {
      this.branchList = data.project_list;
      this.total = data.total_rows
      this.loading=false;

      // this.userService.setProjectList(data.project_list);
      this.pageMax=Math.ceil(this.total/this.pageSize)
      this.renderData();
    })

    this.projectService.getAgencyList().then((data)=>{
      console.log(data);
      
    })
  }

  renderData(){
    this.branchListPageShow=this.branchList.slice((this.page-1)*this.pageSize,this.page*this.pageSize);
  }
  prevPage(){
    if(this.page<=1) return false;
    this.page--;
    this.renderData();
  }

  nextPage(){
    if(this.page>=this.pageMax) return false;
    this.page++;
    this.renderData();
  }

  changePage(){
    this.page=this.jumpPage;
    this.renderData();
  }

  search(){

  }

}
