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

  public isAddingRole: boolean = false;


  constructor(private projectService: ProjectService, private route: ActivatedRoute, private router: Router) { }


  ngOnInit() {
    this.getRoleList();
  }


  getRoleList() {
    this.loading = true;
    this.projectService.getRoleList(this.page, this.pageSize, this.keyword).then((data) => {
      console.log(data);
      this.roleList = data.efairyrole_list;
      this.total = data.total_rows;
      this.pageMax = Math.ceil(this.total / this.pageSize);
      this.loading = false;
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
    this.projectService.editRole(role).then(() => {
      this.getRoleList();
    })
  }

  showBindPop(role) {

  }

  ensureAddNewRole() {
    this.projectService.addRole({
      efairyrole_info: {
        efairyrole_name: this.addName,
        efairyright_description: this.addDesc,
        efairyright_api_path: this.addPath,
        // efairyright_rightgroup_id: '',
        // efairyrole_id_list: []
      }
    }).then((r) => {
      //this.getPermissionList();
      this.roleList.unshift(r);
      this.isAddingRole = false;
      this.addName = '';
      this.addDesc = '';
      this.addPath = ''
    }).catch((e) => {
      alert(e)
    })
  }
  cancelAddNewRole() {
    this.isAddingRole = false;
  }

}
