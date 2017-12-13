import { Component, OnInit, NgZone } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { ProjectService } from '../service/project.service';
import { Location } from '@angular/common';


declare var plupload: any;
declare var Qiniu: any;
declare var QiniuJsSDK: any;


@Component({
  selector: 'app-personal-page',
  templateUrl: './personal-page.component.html',
  styleUrls: ['./personal-page.component.scss']
})
export class PersonalPageComponent implements OnInit {

  public uploading: boolean = false;
  public userInfo: any = {};

  constructor(private projectService: ProjectService, private route: ActivatedRoute, private router: Router, private zone: NgZone, private _location: Location, ) { }

  ngOnInit() {
    const uploadImg = Qiniu.uploader(this.getUploadOpts());
    this.getUserCenter();
  }


  getUserCenter() {
    this.projectService.getUserCenter().then((data) => {
      this.userInfo = data;
    })
  }


  getQiniuToken() {
    return this.projectService.getQiniuUploadToken().then((r) => {
      return r.uptoken;
    })
  }
  goBack() {
    this._location.back();
  }
  getQiniuTokenUrl() {
    return this.projectService.getQiniuUploadTokenUrl();
  }

  editUserInfo() {
    this.projectService.putUserCenter(this.userInfo).then((r)=>{
      alert('修改成功！')
    })

  }


  private getUploadOpts() {
    let loading;
    const _self = this;
    return {
      runtimes: 'html5,flash,html4',      // 上传模式，依次退化
      browse_button: 'img-upload',         // 上传选择的点选按钮，必需
      // container: 'container',
      //uptoken_func: this.getQiniuToken(),
      //uptoken_url: '/wxapi/qiniu_upload_token',         // Ajax请求uptoken的Url，强烈建议设置（服务端提供）
      uptoken_url: this.getQiniuTokenUrl(),
      // uptoken: 'POQvaC2kzeErHALP6TVgVrWAB3_WLQG--ti5Wfmz:SxHtMD5CRdVVmtr88BtjuWNELc0=:eyJtaW1lTGltaXQiOiJpbWFnZS9qcGVnO2ltYWdlL3BuZyIsInNjb3BlIjoieWR0LXBhcnRuZXIiLCJkZWFkbGluZSI6MTQ5NjcyMDA5OX0=',
      get_new_uptoken: false,             // 设置上传文件的时候是否每次都重新获取新的uptoken
      domain: 'https://efairyqiniu.tokabu.com/',     // bucket域名，下载资源时用到，必需
      max_file_size: '5mb',             // 最大文件体积限制
      filters: {
        max_file_size: '5mb',
        prevent_duplicates: false,
        // Specify what files to browse for
        mime_types: [
          { title: "image files", extensions: "jpg,png,jpeg" },
        ]
      },
      max_retries: 3,                     // 上传失败最大重试次数
      dragdrop: false,                     // 开启可拖曳上传
      drop_element: 'container',          // 拖曳上传区域元素的ID，拖曳文件或文件夹后可触发上传
      chunk_size: '4mb',                  // 分块上传时，每块的体积
      auto_start: true,                   // 选择文件后自动上传，若关闭需要自己绑定事件触发上传
      init: {
        'FilesAdded': function (up, files) {
          plupload.each(files, function (file) {
            // 文件添加进队列后，处理相关的事情
          });
        },
        'BeforeUpload': function (up, file) {
          _self.uploading=true;
          // 每个文件上传前，处理相关的事情
        },
        'UploadProgress': function (up, file) {
          // loading = weui.loading('正在上传');
        },
        'FileUploaded': function (up, file, info) {
          const domain = up.getOption('domain');
          const res = JSON.parse(info);
          _self.zone.run(() => {
            _self.userInfo.efairyuser_headimg_url = (domain + res.key);
            _self.uploading=false;
          })


        },
        'Error': function (up, err, errTip) {
          // loading.hide();
          console.log(err, errTip);
          alert(err.response)
        },
        'UploadComplete': function () {
          //队列文件处理完毕后，处理相关的事情
        },
        'Key': function (up, file) {
          // 若想在前端对每个文件的key进行个性化处理，可以配置该函数
          // 该配置必须要在 unique_names: false , save_key: false 时才生效
          var key = 'pst_admin_avatar' + (new Date()).valueOf() + "." + file.name.split('.')[1];
          // do something with key here
          return key;
        }
      }
    }
  }



}
