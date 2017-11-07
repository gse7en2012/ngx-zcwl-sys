import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { ProjectService } from '../../service/project.service';


@Component({
  selector: '<left-nav></left-nav>',
  templateUrl: './left-nav-component.component.html',
  styleUrls: ['./left-nav-component.component.scss'],
  providers: [ProjectService]
})
export class LeftNavPartComponent implements OnInit {

  @Input() parentRouterParam: any;

  public loading: boolean = true;
  public userLevel: number;
  public agencyList = [];
  constructor(private projectService: ProjectService, private router: Router, ) { }

  ngOnInit() {

    const isNeedRedirect = !location.href.split(`${this.parentRouterParam}/`)[1];
    this.projectService.getAgencyList().then((data) => {
      this.loading = false;
      this.userLevel = data.level;
      this.agencyList = data.agency_list;
      // this.agencyList[0]['current'] = true;
      // this.agencyList[0]['showChildren'] = true;

      //0-超级管理员 1-一级经销商 2-二级经销商 3-项目管理员 4-普通用户
      // if (this.userLevel == 0 || this.userLevel == 1) {
      //   this.getLv2AgencyList(this.agencyList[0], isNeedRedirect)
      // }

    })
  }


  getLv2AgencyList(lv1Agency, isNeedNav) {
    // lv1Agency.current=!lv1Agency.current;

    const parentId = lv1Agency['efairyuser_id'];
    this.agencyList.forEach((item) => {

      if (item.efairyuser_id == parentId) {
        item.showChildren = !item.showChildren;
        item.current = !item.current;
      } else {
        item.showChildren = false;
        item.current = false;
      }
    })

    if (lv1Agency.isLoaded) return;
    this.projectService.getAgencyListLv2(parentId).then((data) => {

      this.agencyList.forEach((parentAgency) => {
        if (parentAgency.efairyuser_id == parentId) {
          parentAgency.secondList = data.agency_list;
          parentAgency.isLoaded = true;
        }
      })

      // if (isNeedNav) this.router.navigate([`/${this.parentRouterParam}/agency/${data.agency_list[0].efairyuser_id}`]);

      this.loading = false;
    })

  }


}
