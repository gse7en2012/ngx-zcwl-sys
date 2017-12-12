import { Component, OnInit, EventEmitter, Input, Output, HostListener } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { NgStyle } from '@angular/common';
import { ProjectService } from '../../service/project.service';

@Component({
  selector: 'app-role',
  templateUrl: './role.component.html',
  styleUrls: ['./role.component.scss']
})
export class RoleComponent implements OnInit {

  public roleList = [];
  public permissionGroupList = [];
  public loading: boolean = true;
  public total: number = 0;
  public pageSize: number = 30;
  public page: number = 1;
  public jumpPage: number = 1;
  public pageMax: number = 1;
  public keyword: string;

  public addLevel: string;
  public addDesc: string;
  public addName: string;

  public isAddingRole: boolean = false;

  public popUp: boolean = false;
  public permissionGroupId: any;

  public popUpRole: any = {};


  constructor(private projectService: ProjectService, private route: ActivatedRoute, private router: Router) { }


  ngOnInit() {
    this.getRoleList();
    this.getPermissionList();
  }


  getRoleList() {
    this.loading = true;
    this.projectService.getRoleList(this.page, this.pageSize, this.keyword).then((data) => {
      this.roleList = data.efairyrole_list;
      this.total = data.total_rows;
      this.pageMax = Math.ceil(this.total / this.pageSize);
      this.loading = false;
    })
  }

  getPermissionList() {
    this.projectService.getPermissionGroupRightList().then((data) => {
      this.permissionGroupList = data.rightgroup_list;
    })
  }

  prevPage() {
    if (this.page <= 1) return false;
    this.page--;
    this.getRoleList();
  }

  nextPage() {
    if (this.page >= this.pageMax) return false;
    this.page++;
    this.getRoleList();
  }

  changePage() {
    this.page = this.jumpPage;
    this.getRoleList();
  }

  deleteRole(role) {
    if (confirm('确定删除？')) {
      this.projectService.deleteRole(role.efairyrole_id).then((r) => {
        this.getRoleList();
      }).catch((e) => {
        alert(e)
      })
    }
  }
  addNewRole() {
    this.isAddingRole = true;
  }
  editRole(role) {
    this.projectService.editRole({ efairyrole_info: role }).then(() => {
      alert("编辑成功!")
      this.getRoleList();
    })
  }

  closePop() {
    this.popUp = false;
    this.roleList.forEach((item) => {
      item.is_choose = false;
    })
  }

  permissionGroupCb(group) {
    group.right_list.forEach((item) => {
      item.is_choose = !item.is_choose
    })
  }


  changeEmp(list, i) {
    list[i]['is_choose'] = !list[i]['is_choose'];
  }

  showBindPop(role) {
    this.popUp = true;
    this.popUpRole = role;

    this.projectService.getRolePermissionList(role.efairyrole_id).then((r)=>{
      r.rightgroup_list.forEach((item)=>{
          item.right_list.forEach((row)=>{
            row.is_choose=row.efairyright_is_owned==1
          })
      });
      this.permissionGroupList=r.rightgroup_list;
    })

  }

  sureBind() {
    const permissionList = this.permissionGroupList
      .map((parent) => parent.right_list)
      .reduce((a, b) => a.concat(b))
      .filter((item) => item.is_choose)
      .map((item) => item.efairyright_id);
    this.projectService.bindRightToRole({
      efairyrole_id: this.popUpRole['efairyrole_id'],
      efairyright_id_list: permissionList
    }).then(() => {
      alert('添加权限成功！');
      this.closePop();
    })
  }

  ensureAddNewRole() {
    this.projectService.addRole({
      efairyrole_info: {
        efairyrole_name: this.addName,
        efairyrole_description: this.addDesc,
        efairyrole_level: this.addLevel,
        // efairyright_rightgroup_id: '',
        // efairyrole_id_list: []
      }
    }).then((r) => {
      //this.getPermissionList();
      this.roleList.unshift(r);
      this.isAddingRole = false;
      this.addName = '';
      this.addDesc = '';
      this.addLevel = ''
    }).catch((e) => {
      alert(e)
    })
  }
  cancelAddNewRole() {
    this.isAddingRole = false;
  }

}
