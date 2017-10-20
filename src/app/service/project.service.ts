import { Injectable } from '@angular/core';
import { Http, Response, URLSearchParams, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { CookieService } from 'ngx-cookie';
import { errCodeMsgHash } from './err-msg';
import { LibService } from './lib.service';

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/catch';


@Injectable()
export class ProjectService {


  private serviceUrl: object = {
    list: '/webapi/project_list',
    getCode: '/webapi/login_checkcode',
    getAgencyList:'/webapi/agency_list'
  };

  private codeHash: any;

  public projectList: object = {};

  constructor(
    private cookieService: CookieService,
    private http: Http,
    private libService: LibService,
    private codeHashObj: errCodeMsgHash
  ) {
    this.codeHash = codeHashObj.codeHash;
  }


  getProjectList() {
    const param = this.libService.generateHttpGetSearchParams();
    return this.http.get(`${this.serviceUrl['list']}?access_token=${param.token}`, { search: param.search }).map(res => res.json()).toPromise()
      //  return this.http.get(`${this.serviceUrl['list']}`, { search: param.search }).map(res => res.json()).toPromise()
      .then((data) => {
        if (data.err_code === 200) {          
          return data.result;
        } else {
          return Promise.reject(data.msg || '返回数据格式出错！');
        }
      })
  }

  getAgencyList(){
    const param = this.libService.generateHttpGetSearchParams();
    return this.http.get(`${this.serviceUrl['getAgencyList']}?access_token=${param.token}`, { search: param.search }).map(res => res.json()).toPromise()
    .then((data) => {
      if (data.err_code === 200) {          
        return data.result;
      } else {
        return Promise.reject(data.msg || '返回数据格式出错！');
      }
    })
  }








}
