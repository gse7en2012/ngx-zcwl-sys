import { Component, OnInit, EventEmitter, Input, Output, HostListener } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { NgStyle } from '@angular/common';
import { ProjectService } from '../../service/project.service';

@Component({
  selector: 'app-permission',
  templateUrl: './permission.component.html',
  styleUrls: ['./permission.component.scss']
})
export class PermissionComponent implements OnInit {

  public permissionList = [];
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

  public isAddingPermission: boolean = false;


  constructor(private projectService: ProjectService, private route: ActivatedRoute, private router: Router) { }


  ngOnInit() {
    this.getPermissionList();
  }


  getPermissionList() {
    this.loading = true;
    this.projectService.getPermissionList(this.page, this.pageSize, this.keyword).then((data) => {
      console.log(data);
      this.permissionList = data.efairyright_list;
      this.total = data.total_rows;
      this.pageMax = Math.ceil(this.total / this.pageSize);
      this.loading = false;
    })
  }


  prevPage() {
    if (this.page <= 1) return false;
    this.page--;
    this.getPermissionList();
  }

  nextPage() {
    if (this.page >= this.pageMax) return false;
    this.page++;
    this.getPermissionList();
  }

  changePage() {
    this.page = this.jumpPage;
    this.getPermissionList();
  }

  deletePermission(permission) {
    if (confirm('确定删除？')) {
      this.projectService.deletePermission(permission.efairyright_id).then((r) => {
        this.getPermissionList();
      }).catch((e) => {
        alert(e)
      })
    }
  }
  addNewPermission() {
    this.isAddingPermission = true;
  }
  editPermission(permission) {
    this.projectService.editPermission(permission).then(() => {
      this.getPermissionList();
    })
  }


  ensureAddNewPermission() {
    this.projectService.addPermission({
      efairyright_name: '',
      efairyright_description: '',
      efairyright_api_path: '',
      efairyright_rightgroup_id: '',
      efairyrole_id_list: []
    }).then((r) => {
      this.getPermissionList();
      this.isAddingPermission = false;
      this.addName = '';
      this.addDesc = '';
      this.addPath = ''
    }).catch((e) => {
      alert(e)
    })
  }
  cancelAddNewPermission() {
    this.isAddingPermission = false;
  }
}
