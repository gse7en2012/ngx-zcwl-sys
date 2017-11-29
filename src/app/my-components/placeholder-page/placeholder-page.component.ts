import { Component, OnInit } from '@angular/core';
import { ProjectService } from '../../service/project.service';
import { UserService } from '../../service/user.service';
import { Router, ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-placeholder-page',
  templateUrl: './placeholder-page.component.html',
  styleUrls: ['./placeholder-page.component.scss']
})
export class PlaceholderPageComponent implements OnInit {

  private agencyList: any;
  public isSuper:boolean=false;
  public newProjectUrl:string;

  constructor(private projectService: ProjectService, private userService: UserService, private router: Router, private route: ActivatedRoute) { }

  ngOnInit() {


    const userInfo: any = this.userService.getAdminInfo();
    if (userInfo.user_level == 0 || userInfo.user_level == 1)
      this.getSuperAdminNav();
    if (userInfo.user_level == 2 || userInfo.user_level == 3 || userInfo.user_level == 4)
      this.getGeoNavList();

    if(location.href.indexOf('/super/')!=-1){
      this.isSuper=true;
    }
    
  }


  getSuperAdminNav() {
    this.projectService.getAgencyList().then((data) => {
      this.agencyList = data.agency_list;
    }).then(() => {
      this.lockNav();
    })
  }

  getGeoNavList() {
    this.projectService.getNormalUserProjectList().then((data) => {
      if (data.length > 0) {
        const province = data[0].efairyproject_province;
        this.router.navigate(['geo/project'], { relativeTo: this.route, queryParams: { province: province, geo_level: 1 } });
      }
    })
  }

  lockNav() {
    const item = this.agencyList.shift();
    if (item) {
      this.getLv2AgencyList(item.efairyuser_id).then((result: any) => {
        if (result && result.length > 0) {
          console.log(result[0]);
          this.router.navigate([item.efairyuser_id + '/agency/' + result[0].efairyuser_id], { relativeTo: this.route });
        } else {
          this.lockNav();
        }
      })
    }
  }

  getLv2AgencyList(id) {
    return this.projectService.getAgencyListLv2(id).then((list) => {
      return list.agency_list;
    });
  }

}
