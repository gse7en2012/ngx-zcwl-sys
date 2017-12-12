import { Component, OnInit, EventEmitter, Input, Output, HostListener } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { NgStyle } from '@angular/common';
import { ProjectService } from '../../service/project.service';

@Component({
  selector: 'app-group',
  templateUrl: './group.component.html',
  styleUrls: ['./group.component.scss']
})
export class GroupComponent implements OnInit {

  public permissionGroupList = [];
  public permissionGroupRightList = [];
  public permissionList = [];
  public loading: boolean = true;
  public total: number = 0;
  public pageSize: number = 30;
  public page: number = 1;
  public jumpPage: number = 1;
  public pageMax: number = 1;
  public keyword: string;

  public addType: number = 1;
  public addDesc: string;
  public addName: string;

  public isAddingPermissionGroup: boolean = false;


  public popUp: boolean = false;
  public popUpGroup: any = {};

  constructor(private projectService: ProjectService, private route: ActivatedRoute, private router: Router) { }


  ngOnInit() {
    this.getPermissionGroupList();
    this.getPermissionList();
    this.getPermissionGroupRightList();
  }


  getPermissionGroupList() {
    this.loading = true;
    this.projectService.getPermissionGroupList(this.page, this.pageSize, this.keyword).then((data) => {
      this.permissionGroupList = data.rightgroup_list;
      this.total = data.total_rows;
      this.pageMax = Math.ceil(this.total / this.pageSize);
      this.loading = false;
    })
  }

  getPermissionList() {
    this.projectService.getPermissionList().then((data) => {
      this.permissionList = data.efairyright_list;
    })
  }

  getPermissionGroupRightList() {
    this.projectService.getPermissionGroupRightList().then((data) => {
      this.permissionGroupRightList = data.rightgroup_list
    })
  }


  prevPage() {
    if (this.page <= 1) return false;
    this.page--;
    this.getPermissionGroupList();
  }

  nextPage() {
    if (this.page >= this.pageMax) return false;
    this.page++;
    this.getPermissionGroupList();
  }

  changePage() {
    this.page = this.jumpPage;
    this.getPermissionGroupList();
  }

  deletePermissionGroup(permission) {
    if (confirm('确定删除？')) {
      this.projectService.deletePermissionGroup(permission.efairyright_id).then((r) => {
        alert('删除成功！')
        this.getPermissionGroupList();
      }).catch((e) => {
        alert(e)
      })
    }
  }
  addNewPermissionGroup() {
    this.isAddingPermissionGroup = true;
  }
  editPermissionGroup(permission) {
    this.projectService.editPermissionGroup({ efairyright_info: permission }).then(() => {
      this.getPermissionGroupList();
    })
  }

  showBindPop(group) {
    console.log(group);
    this.popUp = true;
    this.popUpGroup = group;
    this.permissionGroupRightList.forEach((g) => {
      if (g.efairyrightgroup_id == group.efairyrightgroup_id) {
        console.log(g);
        const chooseId = g.right_list.map((item) => item.efairyright_id);
        console.log(chooseId);
        this.permissionList.forEach((right) => {
          right.is_choose = chooseId.indexOf(right.efairyright_id) != -1
        })
      }
    })
  }

  changeEmp(list, i) {
    list[i]['is_choose'] = !list[i]['is_choose'];
  }

  permissionGroupCb() {
    this.permissionList.forEach((item) => {
      item.is_choose = !item.is_choose
    })
  }

  sureBind() {
    const chooseRightList = this.permissionList.filter((item) => item.is_choose).map((item) => item.efairyright_id);
    this.projectService.bindRightToGroup({
      efairyrightgroup_id: this.popUpGroup['efairyrightgroup_id'],
      efairyright_id_list: chooseRightList
    }).then(() => {
      alert('添加成功！');
      this.closePop();
      this.getPermissionGroupRightList();
    })
  }


  closePop() {
    this.popUp = false;
    this.permissionList.forEach((item) => {
      item.is_choose = false;
    })
  }

  ensureAddNewPermissionGroup() {
    this.projectService.addPermissionGroup({
      efairyrightgroup_info: {
        efairyrightgroup_name: this.addName,
        efairyrightgroup_description: this.addDesc,
        efairyrightgroup_type: this.addType
        // efairyright_rightgroup_id: '',
        // efairyrole_id_list: []
      }
    }).then((r) => {
      //this.getPermissionList();
      this.permissionGroupList.unshift(r);
      this.isAddingPermissionGroup = false;
      this.addName = '';
      this.addDesc = '';
      this.addType = 1;
    }).catch((e) => {
      alert(e)
    })
  }
  cancelAddNewPermissionGroup() {
    this.isAddingPermissionGroup = false;
  }

}
