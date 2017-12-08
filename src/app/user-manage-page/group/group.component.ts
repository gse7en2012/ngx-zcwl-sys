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
  public loading: boolean = true;
  public total: number = 0;
  public pageSize: number = 30;
  public page: number = 1;
  public jumpPage: number = 1;
  public pageMax: number = 1;
  public keyword: string;

  public addPath: string;
  public addDesc: string;
  public addName: string;

  public isAddingPermissionGroup: boolean = false;


  constructor(private projectService: ProjectService, private route: ActivatedRoute, private router: Router) { }


  ngOnInit() {
    this.getPermissionGroupList();
  }


  getPermissionGroupList() {
    this.loading = true;
    this.projectService.getPermissionGroupList(this.page, this.pageSize, this.keyword).then((data) => {
      console.log(data);
      this.permissionGroupList = data.rightgroup_list;
      this.total = data.total_rows;
      this.pageMax = Math.ceil(this.total / this.pageSize);
      this.loading = false;
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
    this.projectService.editPermissionGroup({efairyright_info:permission}).then(() => {
      this.getPermissionGroupList();
    })
  }

  showBindPop(permission){

  }

  ensureAddNewPermissionGroup() {
    this.projectService.addPermissionGroup({
      efairyright_info: {
        efairyright_name: this.addName,
        efairyright_description: this.addDesc,
        efairyright_api_path: this.addPath,
        // efairyright_rightgroup_id: '',
        // efairyrole_id_list: []
      }
    }).then((r) => {
      //this.getPermissionList();
      this.permissionGroupList.unshift(r);
      this.isAddingPermissionGroup = false;
      this.addName = '';
      this.addDesc = '';
      this.addPath = ''
    }).catch((e) => {
      alert(e)
    })
  }
  cancelAddNewPermissionGroup() {
    this.isAddingPermissionGroup = false;
  }

}
