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
    var mock={"result":{"project_alarm_data_list":[{"efairydevice_alarm_cid":1,"efairydevice_id":267,"efairydevice_uuid":"898602b1191750078013010101","efairydevice_alarm_thv":990,"efairydevice_name":"兴基元商务宾馆楼层2","efairydevice_alarm_pt":15,"efairydevice_alarm_time":"2017-10-24 12:06:28","efairydevice_detail_state":143,"efairydevice_alarm_rtv":999}],"total_rows":1},"err_code":200}
    return Promise.resolve(mock.result)
    // return this.http.get(`${this.serviceUrl['getProjectAlarmData']}?access_token=${param.token}`, { search: param.search }).map(res => res.json()).toPromise()
    // .then((data) => {
    //   if (data.err_code === 200) {
    //     return data.result;
    //   } else {
    //     return Promise.reject(data.msg || '返回数据格式出错！');
    //   }
    // })

  }








}
