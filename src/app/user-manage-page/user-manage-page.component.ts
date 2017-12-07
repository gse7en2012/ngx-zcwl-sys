import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-user-manage-page',
  templateUrl: './user-manage-page.component.html',
  styleUrls: ['./user-manage-page.component.scss']
})
export class UserManagePageComponent implements OnInit {


  public navList = [
    {
      title: '用户管理',
      current:false,
      showChildren:false,
      children: [
        { title: '一级经销商', link: ['lv1'] },
        { title: '二级级经销商', link: ['lv2'] },
        { title: '普通用户', link: ['normal'] }
      ]
    },
    {
      title: '权限管理',
      current:false,
      showChildren:false,
      children: [
        { title: '权限管理', link: ['permission'] },
        { title: '角色管理', link: ['role'] },
        { title: '权限组管理', link: ['per_group'] }
      ]
    }
  ];

  constructor() { }

  ngOnInit() {
    this.navList.forEach((item)=>{
      item.children.forEach((row)=>{
        if(location.href.indexOf(row.link[0])!==-1){
          item.current=true;
          item.showChildren=true;
        }
      })
    })

  }


  parentNavClick(item){
    item.current=!item.current;
    item.showChildren=!item.showChildren;
  }

}
