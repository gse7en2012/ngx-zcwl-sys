import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { ProjectService } from '../service/project.service';

@Component({
  selector: 'app-warning-page',
  templateUrl: './warning-page.component.html',
  styleUrls: ['./warning-page.component.scss']
})
export class WarningPageComponent implements OnInit, AfterViewInit {


  public loading: boolean = true;
  public agencyList = [];

  constructor(private projectService: ProjectService, private router: Router, private route: ActivatedRoute) { }


  ngOnInit() {

    const isNeedRedirect = !location.href.split('warning/')[1];
    console.log(location.href.split('warning/')[1],isNeedRedirect);
    
    this.projectService.getAgencyList().then((data) => {
      this.loading = false;
      this.agencyList = data.agency_list;
      this.agencyList[0]['current'] = true;
      this.agencyList[0]['showChildren'] = true;
      //0-超级管理员 1-一级经销商 2-二级经销商 3-项目管理员 4-普通用户
      if (data.level == 0 || data.level == 1) {
       
          this.getLv2AgencyList(this.agencyList[0]['efairyuser_id'],isNeedRedirect)
        
      }

    })
  }

  ngAfterViewInit() {

  }

  getLv2AgencyList(parentId,isNeedNav) {


    this.agencyList.forEach((item) => {
      item.showChildren = false;
      item.current = false;
      if (item.efairyuser_id == parentId) {
        item.showChildren = true;
        item.current = true;
      }
    })

    this.projectService.getAgencyListLv2(parentId).then((data) => {
      this.loading = false;
      this.agencyList.forEach((parentAgency) => {
        if (parentAgency.efairyuser_id == parentId) {
          parentAgency.secondList = data.agency_list;
        }
      })
      if(isNeedNav) this.router.navigate(['/admin/warning/agency/' + data.agency_list[0].efairyuser_id])
    })

  }

}
