import { Component, OnInit, NgZone } from '@angular/core';
import { ProjectService } from '../../service/project.service';
import { Location } from '@angular/common';
import { Router, ActivatedRoute, Params } from '@angular/router';
import * as myGlobals from '../../global/globals';

declare var AMap;
declare var AMapUI;
declare var moment;

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.scss'],
  providers: [ProjectService]
})
export class DetailsComponent implements OnInit {

  public loading: boolean = false;
  public tabIndex: number = 1;
  public projectId: string;
  public proejctInfo: any = {};

  //map
  public positionPicker: any;
  public bigMap;
  //list var
  public gmList: any = [];
  public gmListShow: any;
  public deviceList: any = [];
  public deviceListShow: any;
  public userList: any = [];
  public userListShow: any;

  public addGmNickname: string;
  public addGmPhone: string;
  public isAddingGm: boolean = false;

  public addUserNickname: string;
  public addUserPhone: string;
  public isAddingUser: boolean = false;

  //gm page
  public gmLoading: boolean = false;
  public gmTotal: number = 0;
  public gmPageSize: number = 15;
  public gmPage: number = 1;
  public gmJumpPage: number = 1;
  public gmPageMax: number = 1;
  public jumpGmPage: number;
  public gmKeyword: string;

  //devicepage
  public deviceLoading: boolean = false;
  public deviceTotal: number = 0;
  public devicePageSize: number = 15;
  public devicePage: number = 1;
  public deviceJumpPage: number = 1;
  public devicePageMax: number = 1;
  public jumpDevicePage: number;
  public deviceKeyword: string;

  //user page
  public userLoading: boolean = false;
  public userTotal: number = 0;
  public userPageSize: number = 15;
  public userPage: number = 1;
  public userJumpPage: number = 1;
  public userPageMax: number = 1;
  public jumpUserPage: number;
  public userKeyword: string;

  public stateHash = ['离线', '报警', '预警', '故障', '启动', '屏蔽', '正常'];
  public deviceTypeHash=myGlobals.deviceTypeHash;

  constructor(private projectSerive: ProjectService, private route: ActivatedRoute, private router: Router, private zone: NgZone,private _location:Location) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.projectId = params.proejct_id;
    });

    this.route.queryParams.subscribe(params => {
      console.log(params); // {order: "popular"}
      if (params.type && (!isNaN(Number(params.type)) && Number(params.type) <= 4)) {
        this.tabIndex = Number(params.type)
      }
    });

    this.getProejctInfo();
    this.getProjectGmList();
    this.getProjectUserList();
    this.getProjectDeviceList();
  }

  //map
  initAmap(lng, lat) {
    this.bigMap = new AMap.Map('map', {
      resizeEnable: true,
      zoom: 13,
      center: [lng, lat]
    });

    AMap.plugin(['AMap.Autocomplete', 'AMap.PlaceSearch'], () => {
      var autoOptions = {
        input: "address"//使用联想输入的input的id
      };
      const autocomplete = new AMap.Autocomplete(autoOptions);
      var placeSearch = new AMap.PlaceSearch({
        city: '',
        map: this.bigMap
      });
      AMap.event.addListener(autocomplete, "select", (e) => {
        //TODO 针对选中的poi实现自己的功能
        // console.log(e);

        const centerPoint = new AMap.LngLat(e.poi.location.lng, e.poi.location.lat);
        if (e.poi.location != '') {
          this.positionPicker.start(centerPoint)
        }
      });
    });

    AMapUI.loadUI(['misc/PositionPicker'], (PositionPicker) => {
      this.positionPicker = new PositionPicker({
        mode: 'dragMarker',
        map: this.bigMap
      });
      this.positionPicker.on('success', (positionResult) => {

        this.zone.run(() => {
          this.proejctInfo.efairyproject_address = positionResult.address;
          this.proejctInfo.efairyproject_location_lng = positionResult.position.lng;
          this.proejctInfo.efairyproject_location_lat = positionResult.position.lat;
        })

      });
      this.positionPicker.on('fail', (positionResult) => {
        // console.log(positionResult);
      });

      this.positionPicker.start(new AMap.LngLat(lng, lat));
    });


  }


  editProjectDetails() {
    if (!confirm('确定修改？')) return;
    const opts = Object.assign({
      efairyproject_id: this.projectId,
    }, this.proejctInfo)
    this.projectSerive.editProjectDetailsManage(opts).then((r) => {
      alert('修改成功！')
    })
  }


  //gm add part
  deleteGm(gm) {
    if (confirm('确定删除？')) {
      this.projectSerive.deleteProjectGm(this.projectId, gm.efairyuser_id).then((r) => {
        this.getProjectGmList();
      }).catch((e) => {
        alert(e)
      })
    }
  }
  addNewGm() {
    this.isAddingGm = true;
  }
  ensureAddNewGm() {
    this.projectSerive.addProjectGm(this.projectId, this.addGmPhone, this.addGmNickname).then((r) => {
      this.getProjectGmList();
      this.isAddingGm = false;
      this.addGmNickname = '';
      this.addGmPhone = ''
    }).catch((e) => {
      alert(e)
    })
  }
  cancelAddNewGm() {
    this.isAddingGm = false;
  }
  deleteDevice(device) {
    if (confirm('确定删除？')) {
      this.projectSerive.deleteProjectDevice(this.projectId, device.efairydevice_id).then((r) => {
        this.getProjectDeviceList();
      }).catch((e) => {
        alert(e)
      })
    }
  }

  //user add
  deleteUser(user) {
    if (confirm('确定删除？')) {
      this.projectSerive.deleteProjectUser(this.projectId, user.efairyuser_id).then((r) => {
        this.getProjectUserList();
      }).catch((e) => {
        alert(e)
      })
    }
  }
  addNewUser() {
    this.isAddingUser = true;
  }
  ensureAddNewUser() {
    this.projectSerive.addProjectUser(this.projectId, this.addUserPhone, this.addUserNickname).then((r) => {
      this.getProjectUserList();
      this.isAddingUser = false;
      this.addUserNickname = '';
      this.addUserPhone = '';
    }).catch((e) => {
      alert(e)
    })
  }
  cancelAddNewUser() {
    this.isAddingUser = false;
  }


  //get info list 
  getProejctInfo() {
    this.projectSerive.getProjectDetailsManage(this.projectId).then((data) => {
      this.proejctInfo = data.project_info;
      this.initAmap(this.proejctInfo.efairyproject_location_lng, this.proejctInfo.efairyproject_location_lat);
    })
  }

  getProjectGmList() {
    this.gmLoading = true;
    this.projectSerive.getProjectGmListManage(this.projectId, this.gmPage, this.gmPageSize, this.gmKeyword).then((data) => {
      this.gmList = data.gm_list;
      this.gmTotal = data.efairyproject_total_gms;
      this.gmPageMax = Math.ceil(this.gmTotal / this.gmPageSize)
      this.gmLoading = false;
    })
  }

  getProjectUserList() {
    this.userLoading = true;
    this.projectSerive.getProjectUserListManage(this.projectId, this.userPage, this.userPageSize, this.userKeyword).then((data) => {
      this.userList = data.user_list;
      this.userTotal = data.efairyproject_total_users;
      this.userPageMax = Math.ceil(this.userTotal / this.userPageSize);
      this.userLoading = false;
      // this.renderUserData();
    })
  }

  getProjectDeviceList() {
    this.deviceLoading = true;
    this.projectSerive.getProjectDeviceListManage(this.projectId, this.devicePage, this.devicePageSize, this.deviceKeyword).then((data) => {
      this.deviceList = data.device_list;
      this.deviceTotal = data.efairyproject_total_devices;
      this.devicePageMax = Math.ceil(this.deviceTotal / this.devicePageSize);
      this.deviceLoading = false;
      this.deviceList.forEach((item)=>{
        item.efairydevice_state=this.stateHash[item.efairydevice_state];
        item.efairydevice_device_type=this.deviceTypeHash[item.efairydevice_device_type_id];
      })
      // this.renderDeviceData();
    })
  }

  changeTab(index) {
    if (this.tabIndex == index) return;
    this.tabIndex = index;
    if (index == 1) {this.getProejctInfo()}
  }


  //page
  searchGm() {
    if (this.gmKeyword != undefined) {
      this.getProjectGmList();
    }
  }
  renderGmData() {
    this.gmListShow = this.gmList.slice((this.gmPage - 1) * this.gmPageSize, this.gmPage * this.gmPageSize);
  }

  prevGmPage() {
    if (this.gmPage <= 1) return false;
    this.gmPage--;
    this.getProjectGmList();
  }

  nextGmPage() {
    if (this.gmPage >= this.gmPageMax) return false;
    this.gmPage++;
    this.getProjectGmList();
  }

  changeGmPage() {
    this.gmPage = this.jumpGmPage;
    this.getProjectGmList();
  }


  //device 
  renderDeviceData() {
    this.deviceListShow = this.deviceList.slice((this.devicePage - 1) * this.devicePageSize, this.devicePage * this.devicePageSize);
  }
  deviceSearchChange() {
    console.log(this.deviceKeyword);

  }
  searchDevice() {
    // if (this.deviceKeyword && this.deviceKeyword !== '') {
    //   this.deviceListSearch = [];
    //   this.deviceList.forEach((item) => {
    //     if (item.efairydevice_name.indexOf(this.deviceKeyword) !== -1 || item.efairydevice_id.toString().indexOf(this.deviceKeyword) !== -1)
    //       this.deviceListSearch.push(item);
    //   })
    //   this.deviceListShow = this.deviceListSearch;
    // } else {
    //   this.renderDeviceData();
    // }
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



  //user page
  searchUser() {
    if (this.userKeyword != undefined) {
      this.getProjectUserList();
    }
  }


  prevUserPage() {
    if (this.userPage <= 1) return false;
    this.userPage--;
    this.getProjectUserList();
  }

  nextUserPage() {
    if (this.userPage >= this.userPageMax) return false;
    this.userPage++;
    this.getProjectUserList();
  }

  changeUserPage() {
    this.userPage = this.jumpUserPage;
    this.getProjectUserList();
  }


  goBack() {
    this._location.back();
  }

}
