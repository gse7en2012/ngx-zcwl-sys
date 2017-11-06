import { Component, OnInit } from '@angular/core';
import { ProjectService } from '../../service/project.service';
import { Router, ActivatedRoute, Params } from '@angular/router';

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
  public gmTotal: number = 0;
  public gmPageSize: number = 15;
  public gmPage: number = 1;
  public gmJumpPage: number = 1;
  public gmPageMax: number = 1;
  public jumpGmPage: number;

  //devicepage
  public deviceTotal: number = 0;
  public devicePageSize: number = 15;
  public devicePage: number = 1;
  public deviceJumpPage: number = 1;
  public devicePageMax: number = 1;
  public jumpDevicePage: number;

  //user page
  public userTotal: number = 0;
  public userPageSize: number = 15;
  public userPage: number = 1;
  public userJumpPage: number = 1;
  public userPageMax: number = 1;
  public jumpUserPage: number;


  constructor(private projectSerive: ProjectService, private route: ActivatedRoute, private router: Router, ) { }

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
    })
  }

  getProjectGmList() {
    this.projectSerive.getProjectGmListManage(this.projectId).then((data) => {
      this.gmList = data.gm_list;
      this.gmTotal = data.efairyproject_total_gms;
      this.gmPageMax = Math.ceil(this.gmTotal / this.gmPageSize)
      this.renderGmData();
    })
  }

  getProjectUserList() {
    this.projectSerive.getProjectUserListManage(this.projectId).then((data) => {
      this.userList = data.user_list;
      this.userTotal = data.efairyproject_total_users;
      this.userPageMax = Math.ceil(this.userTotal / this.userPageSize)
      this.renderUserData();
    })
  }

  getProjectDeviceList() {
    this.projectSerive.getProjectDeviceListManage(this.projectId).then((data) => {
      this.deviceList = data.device_list;
      this.deviceTotal = data.efairyproject_total_devices;
      this.devicePageMax = Math.ceil(this.deviceTotal / this.devicePageSize)
      this.renderDeviceData();
    })
  }

  changeTab(index) {
    this.tabIndex = index;
  }



  //page
  renderGmData() {
    this.gmListShow = this.gmList.slice((this.gmPage - 1) * this.gmPageSize, this.gmPage * this.gmPageSize);
  }

  prevGmPage() {
    if (this.gmPage <= 1) return false;
    this.gmPage--;
    this.renderGmData();
  }

  nextGmPage() {
    if (this.gmPage >= this.gmPageMax) return false;
    this.gmPage++;
    this.renderGmData();
  }

  changeGmPage() {
    this.gmPage = this.jumpGmPage;
    this.renderGmData();
  }


  //device 
  renderDeviceData() {
    this.deviceListShow = this.deviceList.slice((this.devicePage - 1) * this.devicePageSize, this.devicePage * this.devicePageSize);
  }

  prevDevicePage() {
    if (this.devicePage <= 1) return false;
    this.devicePage--;
    this.renderDeviceData();
  }

  nextDevicePage() {
    if (this.devicePage >= this.devicePageMax) return false;
    this.devicePage++;
    this.renderDeviceData();
  }

  changeDevicePage() {
    this.devicePage = this.jumpDevicePage;
    this.renderDeviceData();
  }

  //user page
  renderUserData() {
    this.userListShow = this.userList.slice((this.userPage - 1) * this.userPageSize, this.userPage * this.userPageSize);
  }

  prevUserPage() {
    if (this.userPage <= 1) return false;
    this.userPage--;
    this.renderUserData();
  }

  nextUserPage() {
    if (this.userPage >= this.userPageMax) return false;
    this.userPage++;
    this.renderUserData();
  }

  changeUserPage() {
    this.userPage = this.jumpUserPage;
    this.renderUserData();
  }


}
