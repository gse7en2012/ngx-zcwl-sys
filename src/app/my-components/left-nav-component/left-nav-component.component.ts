import { Component, OnInit, Input } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { ProjectService } from '../../service/project.service';
import { ShareService } from '../../service/share.service';
import { UserService } from '../../service/user.service';

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
  public isAdminUser: boolean = false;
  public normalNavList: any = [];
  public nodes = [];

  private isManage: boolean = false;

  constructor(private projectService: ProjectService, private router: Router, private route: ActivatedRoute, private shareService: ShareService, private userService: UserService) {
    shareService.changeEmitted$.subscribe(text => {
      this.initCurrentParentTab();
    });
  }

  ngOnInit() {

    this.route.params.subscribe(params => {

    });
    // this.getCurrentParentTabId();

    // const isNeedRedirect = !location.href.split(`${this.parentRouterParam}/`)[1];
    this.isManage = this.parentRouterParam == 'super/project';

    const userInfo: any = this.userService.getAdminInfo();

    if (userInfo.user_level == 0 || userInfo.user_level == 1) {
      this.projectService.getAgencyList().then((r) => {
        this.loading = false;
        this.agencyList = r.agency_list;
        this.initCurrentParentTab(); //渲染
      })
      this.isAdminUser = true;

    }
    if (userInfo.user_level == 4 || userInfo.user_level == 2 || userInfo.user_level == 3) {
      const service = this.isManage ? 'getNormalUserProjectListManage' : 'getNormalUserProjectList'
      this.projectService[service]().then((r) => {
        this.nodes = this.formatResToTree(r);
        this.normalNavList = r;
      })
    }

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

  toggleProvince(province) {
    province.isOpen = !province.isOpen;
    // this.router.navigate(['geo/project'], {
    //   queryParams: {
    //     geo_level: 1,
    //     province:province.efairyproject_province
    //   }
    // })
  }

  toggleCity(city) {
    city.isOpen = !city.isOpen;
  }
  toggleDistrict(district) {
    district.isOpen = !district.isOpen;
  }

  formatResToTree(data) {
    let indexSeed = 0;
    return data.map((province: any, index) => {
      indexSeed++;
      const p = {
        id: indexSeed,
        name: province.efairyproject_province || '直辖市',
        children: []
      }
      if (province.city_list.length > 0) {
        p['children'] = province.city_list.map((city: any, cIndex) => {
          indexSeed++;
          const c = {
            id: indexSeed,
            name: city.efairyproject_city || '省属',
            children: []
          }
          if (city.district_list.length > 0) {
            c['children'] = city.district_list.map((district: any, dIndex) => {
              indexSeed++;
              const d = {
                id: indexSeed,
                name: district.efairyproject_district || '市属',
                children: []
              }
              if (district.township_list.length > 0) {
                d['children'] = district.township_list.map((town: any, tIndex) => {
                  indexSeed++;
                  return {
                    id: indexSeed,
                    name: town.efairyproject_township
                  }
                })
              }
              return d;
            })
          }
          return c;
        })
      }
      return p;
    })
  }

  chooseTown(town) {
    this.normalNavList.forEach(province => {
      province.city_list.forEach((city) => {
        city.district_list.forEach((district) => {
          district.township_list.forEach((town) => {
            town.cur = false;
          })
        })
      })
    })
    town.cur = true;
  }

  initCurrentParentTab() {
    this.getCurrentParentTabId();
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
        item.showChildren = true;
        item.current = true;
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
