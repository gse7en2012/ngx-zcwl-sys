import { Component, OnInit } from '@angular/core';
import { DeviceService } from '../../service/device.service';
import { UserService } from '../../service/user.service';
import { ProjectService } from '../../service/project.service';
import { Router, ActivatedRoute, Params } from '@angular/router';


@Component({
  selector: 'app-branch',
  templateUrl: './branch.component.html',
  styleUrls: ['./branch.component.scss'],
  providers: [DeviceService, ProjectService]
})
export class BranchComponent implements OnInit {

  public deviceList = [];
  public deviceListPageShow = [];
  public deviceListSearch = [];
  public total: number = 0;
  public loading: boolean = true;

  public pageSize: number = 15;
  public page: number = 1;
  public jumpPage: number = 1;
  public pageMax: number = 1;
  public projectId: string;
  public agencyId: string;
  public agencyName: string;
  public keyword;
  public filterType: string = 'all';

  public pageFromType: number = 1; //1-admin manage  2-geo
  public geoInfo: any = {};
  public geoLevel: string;
  public qs: any;


  public project: any = {
    efairyproject_name: ''
  };
  public stateHash = ['离线', '报警', '预警', '故障', '启动', '屏蔽', '正常'];


  constructor(private deviceService: DeviceService, private route: ActivatedRoute, private router: Router, private userService: UserService, private projectService: ProjectService) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.projectId = params.branch_id;
      this.agencyId = params.agency_id;
      this.getData();
    });

    this.getInitQueryString();

    if (this.agencyId) {
      this.pageFromType = 1;
      this.projectService.getProjectList(this.agencyId).then((data) => {
        this.agencyName = data.lv2_agency_info.efairyuser_nickname
      })
    }
  }

  getInitQueryString() {
    this.route.queryParams.subscribe(queryParams => {
      this.geoLevel = queryParams.geo_level;
      this.geoInfo = {
        efairyproject_province: queryParams.province,
        efairyproject_city: queryParams.city,
        efairyproject_district: queryParams.district,
        efairyproject_township: queryParams.town,
        efairyproject_seaarea: ''
      }
      this.qs = queryParams;
      if (this.geoLevel) this.pageFromType = 2;
    })
  }

  getData() {
    this.deviceService.getDeviceList(this.projectId).then((data) => {
      this.deviceList = data.device_list;
      this.total = data.total_rows;
      this.loading = false;
      this.project = data.project_info;
      this.pageMax = Math.ceil(this.total / this.pageSize)
      this.renderData();
    })
  }

  renderData() {
    this.deviceListPageShow = this.deviceList.slice((this.page - 1) * this.pageSize, this.page * this.pageSize);
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
    if (this.keyword !== '') {
      this.deviceListSearch = [];
      this.deviceList.forEach((item) => {
        if (item.efairydevice_name.indexOf(this.keyword) !== -1 || item.efairydevice_id.toString().indexOf(this.keyword) !== -1)
          this.deviceListSearch.push(item);
      })
      this.deviceListPageShow = this.deviceListSearch;
    } else {
      this.renderData();
    }
  }
  searchEnter(e) {
    if (e.keyCode == '13') this.search();
  }

  changeType(e) {
    console.log(this.filterType);
    if (this.filterType == 'all') {
      this.getData();
    } else {
      this.deviceListPageShow = this.deviceList.filter((item: any) => {
        return item.efairydevice_state == Number(this.filterType);
      })
    }

  }

}
