import { Component, OnInit, Input } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
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
  public parentTabId: number;
  public agencyList = [];
  constructor(private projectService: ProjectService, private router: Router, private route: ActivatedRoute) { }

  ngOnInit() {

    this.route.params.subscribe(params => {
      console.log(params, location.href);

    });
    // this.getCurrentParentTabId();

    // const isNeedRedirect = !location.href.split(`${this.parentRouterParam}/`)[1];
    this.projectService.getAgencyList().then((data) => {
      this.loading = false;
      this.userLevel = data.level;
      this.agencyList = data.agency_list;
      this.initCurrentParentTab(); //渲染
      //0-超级管理员 1-一级经销商 2-二级经销商 3-项目管理员 4-普通用户
      // if (this.userLevel == 0 || this.userLevel == 1) {
      //   this.getLv2AgencyList(this.agencyList[0], isNeedRedirect)
      // }
    })
  }

  getCurrentParentTabId() {
    const currentParentIdList = location.href.split(`${this.parentRouterParam}/`);
    if (currentParentIdList.length > 1) {
      const parentIdList = currentParentIdList[1].split('/');
      if (parentIdList.length > 0 && !isNaN(Number(parentIdList[0]))) {
        const parentId = Number(parentIdList[0]);
        this.parentTabId = parentId;
        return parentId;
      }
    }
  }

  initCurrentParentTab() {
    this.getCurrentParentTabId();
    console.log(this.parentRouterParam);

    this.agencyList.forEach((item) => {
      if (item.efairyuser_id == this.parentTabId) {
        this.getLv2AgencyList(item);
      }
    })
  }


  getLv2AgencyList(lv1Agency, isNeedNav?) {
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
    lv1Agency.loading = true;
    this.projectService.getAgencyListLv2(parentId).then((data) => {
      lv1Agency.loading = false;
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
