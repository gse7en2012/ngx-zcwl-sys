import { Component, OnInit, EventEmitter, Input, Output, HostListener } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { NgStyle } from '@angular/common';
import { ProjectService } from '../../service/project.service';
@Component({
  selector: 'app-notice-page',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class NoticeListComponent implements OnInit {


  public noticeList = [];
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

  constructor(private projectService: ProjectService, private route: ActivatedRoute, private router: Router) { }


  ngOnInit() {
    this.getNoticeList();
  }


  getNoticeList() {
    this.loading = true;
    this.projectService.getNoticeList(this.page, this.pageSize, this.noticeKeyword).then((data) => {
      this.noticeList = data.announcement_list;
      this.total = data.total_rows;
      this.pageMax = Math.ceil(this.total / this.pageSize);
      this.loading = false;
    })
  }

  scaleImg(uri) {
    this.isScaleImg = true;
    this.scaleImgUri = uri;
    // const hh = window.innerHeight / 2;
    this.scrollTop = window.scrollY +20;
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
    this.getNoticeList();
  }

  nextPage() {
    if (this.page >= this.pageMax) return false;
    this.page++;
    this.getNoticeList();
  }

  changePage() {
    this.page = this.jumpPage;
    this.getNoticeList();
  }

  deleteNotice(pid) {
    if (!confirm('确定删除该公告吗？')) return;
    this.projectService.deleteNotice(pid).then(() => {
      alert('删除成功！')
      this.getNoticeList();
    })
  }

}
