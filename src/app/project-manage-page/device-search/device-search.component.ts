import { Component, OnInit, NgZone } from '@angular/core';
import { ProjectService } from '../../service/project.service';
import { Location } from '@angular/common';
import { Router, ActivatedRoute, Params } from '@angular/router';
import * as myGlobals from '../../global/globals';


@Component({
  selector: 'app-device-search',
  templateUrl: './device-search.component.html',
  styleUrls: ['./device-search.component.scss']
})
export class DeviceSearchComponent implements OnInit {

  public deviceList: any = [];
  public deviceLoading: boolean = false;
  public deviceTotal: number = 0;
  public devicePageSize: number = 15;
  public devicePage: number = 1;
  public deviceJumpPage: number = 1;
  public devicePageMax: number = 1;
  public jumpDevicePage: number;
  public deviceKeyword: string;

  public stateHash = ['离线', '报警', '预警', '故障', '启动', '屏蔽', '正常'];
  public deviceTypeHash = myGlobals.deviceTypeHash;

  constructor(private projectSerive: ProjectService, private route: ActivatedRoute, private router: Router, private zone: NgZone, private _location: Location) { }

  ngOnInit() {
    this.getProjectDeviceList();
  }

  getProjectDeviceList() {
    this.deviceLoading = true;
    this.projectSerive.getProjectDeviceListSearch(this.deviceKeyword, this.devicePage, this.devicePageSize).then((data) => {
      this.deviceList = data.device_list;
      this.deviceTotal = data.total_rows;
      this.devicePageMax = Math.ceil(this.deviceTotal / this.devicePageSize);
      this.deviceLoading = false;
      this.deviceList.forEach((item) => {
        item.efairydevice_state = this.stateHash[item.efairydevice_state];
        item.efairydevice_device_type = this.deviceTypeHash[item.efairydevice_device_type_id];
      })

    })
  }
  searchDevice() {
    if (this.deviceKeyword != undefined) {
      this.getProjectDeviceList();
    }
  }

  prevDevicePage() {
    if (this.devicePage <= 1) return false;
    this.devicePage--;
    // this.renderDeviceData();
    this.getProjectDeviceList();
  }

  nextDevicePage() {
    if (this.devicePage >= this.devicePageMax) return false;
    this.devicePage++;
    this.getProjectDeviceList();
  }

  changeDevicePage() {
    this.devicePage = this.jumpDevicePage;
    this.getProjectDeviceList();
  }

}
