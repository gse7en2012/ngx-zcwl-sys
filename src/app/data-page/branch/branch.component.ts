import { Component, OnInit } from '@angular/core';
import { DeviceService } from '../../service/device.service';
import { UserService } from '../../service/user.service';
import { Router, ActivatedRoute, Params } from '@angular/router';


@Component({
  selector: 'app-branch',
  templateUrl: './branch.component.html',
  styleUrls: ['./branch.component.scss'],
  providers: [DeviceService]
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
  public keyword;

  public project: object;

  constructor(private deviceService: DeviceService, private route: ActivatedRoute, private router: Router, private userService: UserService) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      if (params && params.branch_id) {
        this.projectId = params.branch_id;
        this.getData();

        this.project = this.userService.getProjectById(this.projectId);
        console.log(this.project);

      }
    });
  }

  getData() {
    this.deviceService.getDeviceList(this.projectId).then((data) => {
      this.deviceList = data.device_list;
      this.total = data.total_rows;
      this.loading = false;


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
    }else{
      this.renderData();
    }
  }

}
