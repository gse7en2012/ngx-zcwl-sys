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
    allList: '/webapi/all_project_list',
    getCode: '/webapi/login_checkcode',
    getAgencyList: '/webapi/agency_list',
    getAgencyListLv2: '/webapi/lv2_agency_list',
    getProjectAlarmData: '/webapi/project_alarm_data'
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


  getProjectList(agencyId: string) {
    const param = this.libService.generateHttpGetSearchParams({
      lv2_agency_id: agencyId
    });
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

  getAllProjectList(){
    const param = this.libService.generateHttpGetSearchParams({});
    return this.http.get(`${this.serviceUrl['allList']}?access_token=${param.token}`, { search: param.search }).map(res => res.json()).toPromise().then((data) => {
      if (data.err_code === 200) {
        return data.result;
      } else {
        return Promise.reject(data.msg || '返回数据格式出错！');
      }
    })
  }

  getAgencyList() {
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

  getAgencyListLv2(lv1AgencyId: string, page?: number, size?: number) {
    const param = this.libService.generateHttpGetSearchParams({
      lv1_agency_id: lv1AgencyId,
      page: page,
      size: size || 100
    });
    return this.http.get(`${this.serviceUrl['getAgencyListLv2']}?access_token=${param.token}`, { search: param.search }).map(res => res.json()).toPromise()
      .then((data) => {
        if (data.err_code === 200) {
          return data.result;
        } else {
          return Promise.reject(data.msg || '返回数据格式出错！');
        }
      })


  }

  getProjectAlarmData(pid: string, aid?: number) {
    const param = this.libService.generateHttpGetSearchParams({
      efairyproject_id: pid,
      alarm_id: aid||1,
    });
    return this.http.get(`${this.serviceUrl['getProjectAlarmData']}?access_token=${param.token}`, { search: param.search }).map(res => res.json()).toPromise()
    .then((data) => {
      if (data.err_code === 200) {
        return data.result;
      } else {
        return Promise.reject(data.msg || '返回数据格式出错！');
      }
    })
  }








}
