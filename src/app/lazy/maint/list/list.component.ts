import { Component, OnInit, EventEmitter, Input, Output, HostListener } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { NgStyle } from '@angular/common';
import { ProjectService } from '../../../service/project.service';



@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit {


  public mtrecordList = [];
  public loading: boolean = true;
  public total: number = 0;
  public pageSize: number = 12;
  public page: number = 1;
  public jumpPage: number = 1;
  public pageMax: number = 1;
  public noticeKeyword: string;
  public scaleImgUri: string;
  public isScaleImg: boolean = false;
  public scrollTop: number = 0;

  public typeHash = ['', '产品故障', '通讯故障', '其他', '常规检查'];
  public resultHash = ['', '故障已排除', '故障待排除'];

  constructor(private projectService: ProjectService, private route: ActivatedRoute, private router: Router) { }


  ngOnInit() {
    this.getMaintainRecordList()
  }

  getMaintainRecordList() {

    this.loading = true;
    return this.projectService.getMaintainRecordList(this.page, this.pageSize).then((data) => {
      this.mtrecordList = data.mtrecord_list;
      this.total = data.total_rows;
      this.pageMax = Math.ceil(this.total / this.pageSize);
      this.loading = false;
    })
  }

  scaleImg(uri) {
    this.isScaleImg = true;
    this.scaleImgUri = uri;
    // const hh = window.innerHeight / 2;
    this.scrollTop = window.scrollY + 20;
  }
  closeImg() {
    if (this.isScaleImg)
      this.isScaleImg = false;
  }

  readNotice(notice) {
    if (!notice.efairyuserhasannouncement_is_read) {
      this.projectService.readNotice(notice.efairyannouncement_id).then(() => {
        notice.efairyuserhasannouncement_is_read = 1;
      });
    }
  }

  prevPage() {
    if (this.page <= 1) return false;
    this.page--;
    this.getMaintainRecordList();
  }

  nextPage() {
    if (this.page >= this.pageMax) return false;
    this.page++;
    this.getMaintainRecordList();
  }

  changePage() {
    this.page = this.jumpPage;
    this.getMaintainRecordList();
  }

  deleteMaint(pid) {
    if (!confirm('确定删除该维护记录吗？')) return;
    this.projectService.deleteMaint(pid).then(() => {
      alert('删除成功！')
      this.getMaintainRecordList();
    })
  }


}
