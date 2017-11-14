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

    getNormalUserProjectList:'/webapi/project_geo_list',
    getGeoProjectList:'/webapi/geo_project_list',

    getAgencyListLv2: '/webapi/lv2_agency_list',
    getProjectAlarmData: '/webapi/project_alarm_data',
    getProjectReport: '/webapi/report',
    getProjectMonitorData:'/webapi/monitor_data',
    getProjectDetailsManage: '/webapi/manage_project',
    getProjectGmListManage: '/webapi/manage_project_gm_list',
    getProjectUserListManage: '/webapi/manage_project_user_list',
    getProjectDeviceListManage: '/webapi/manage_project_device_list',
    getProjectDeviceDetailsManage: '/webapi/manage_project_device',
    getProjectDeviceIotCardListManage: '/webapi/iotcard_list',

    editProjectDetailsManage: '/webapi/project',

    addProjectGmManage: '/webapi/manage_project_gm',
    deleteProjectGmManage: '/webapi/manage_project_gm',

    addProjectUserManage: '/webapi/manage_project_user',
    deleteProjectUserManage: '/webapi/manage_project_user',

    addProjectDeviceManage: '/webapi/manage_project_device_and_user',
    editProjectDeviceManage: '/webapi/manage_project_device',
    deleteProjectDeviceManage:'/webapi/manage_project_device',

    deleteProjectManage:'/webapi/project',
    addProjectManage:'/webapi/project',

    getDangerousProject:'/webapi/dangerous_project',
    getTotalAlarmList:'/webapi/total_alarm_data',

    postDeviceControl:'/webapi/device_control'
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

  gsevenRequestViaGet(target, opts) {
    const uri = this.serviceUrl[target];
    const param = this.libService.generateHttpGetSearchParams(opts);
    return this.http.get(`${uri}?access_token=${param.token}`, { search: param.search }).map(res => res.json()).toPromise()
      .then((data) => {
        if (data.err_code === 200) {
          return data.result;
        } else {
          return Promise.reject(data.msg || '返回数据格式出错！');
        }
      })
  }
  gsevenRequestViaDelete(target, opts) {
    const uri = this.serviceUrl[target];
    const param = this.libService.generateHttpGetSearchParams(opts);
    return this.http.delete(`${uri}?access_token=${param.token}`, { search: param.search }).map(res => res.json()).toPromise()
      .then((data) => {
        if (data.err_code === 200) {
          return data.result;
        } else {
          return Promise.reject(data.msg || '返回数据格式出错！');
        }
      })
  }
  gsevenRequestViaPost(target, opts) {
    const postData = this.libService.generateHttpPostSearchParams(opts);
    return this.http.post(this.serviceUrl[target], postData).map(res => res.json()).toPromise()
      .then((data) => {
        if (data.err_code === 200) {
          return data.result;
        } else {
          return Promise.reject(data.msg || '返回数据格式出错！');
        }
      })
  }
  gsevenRequestViaPut(target, opts) {
    const postData = this.libService.generateHttpPostSearchParams(opts);
    return this.http.put(this.serviceUrl[target], postData).map(res => res.json()).toPromise()
      .then((data) => {
        if (data.err_code === 200) {
          return data.result;
        } else {
          return Promise.reject(data.msg || '返回数据格式出错！');
        }
      })
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

  getAllProjectList() {
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
      alarm_id: aid || 1,
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

  //1-日报 2-周报 3-月报 4-季报 5-年报
  getProjectReport(projectId: number, type: number, currentDate: string) {
    const param = this.libService.generateHttpGetSearchParams({
      efairyproject_id: projectId,
      report_type: type || 5,
      current_date: currentDate
    });
    return this.http.get(`${this.serviceUrl['getProjectReport']}?access_token=${param.token}`, { search: param.search }).map(res => res.json()).toPromise()
      .then((data) => {
        if (data.err_code === 200) {
          return data.result;
        } else {
          return Promise.reject(data.msg || '返回数据格式出错！');
        }
      })
  }

  //super API
  getProjectDetailsManage(projectId) {
    const param = this.libService.generateHttpGetSearchParams({
      efairyproject_id: projectId
    });
    return this.http.get(`${this.serviceUrl['getProjectDetailsManage']}?access_token=${param.token}`, { search: param.search }).map(res => res.json()).toPromise()
      .then((data) => {
        if (data.err_code === 200) {
          return data.result;
        } else {
          return Promise.reject(data.msg || '返回数据格式出错！');
        }
      })
  }

  public getProjectDeviceListManage(pid: string, page?: number, size?: number, keyword?: string) {
    return this.gsevenRequestViaGet('getProjectDeviceListManage', {
      efairyproject_id: pid,
      page: page,
      size: size,
      keyword: keyword
    })
  }

  public getProjectGmListManage(pid: string, page?: number, size?: number, keyword?: string) {
    return this.gsevenRequestViaGet('getProjectGmListManage', {
      efairyproject_id: pid,
      page: page,
      size: size,
      keyword: keyword
    })
  }

  public getProjectUserListManage(pid: string, page?: number, size?: number, keyword?: string) {
    return this.gsevenRequestViaGet('getProjectUserListManage', {
      efairyproject_id: pid,
      page: page,
      size: size,
      keyword: keyword
    })
  }

  public getProjectDeviceIotCardListManageObservable(cardNumber: string, lastId?: string, size?: number) {
    const uri = this.serviceUrl['getProjectDeviceIotCardListManage'];
    const param = this.libService.generateHttpGetSearchParams({
      efairyiotcard_number: cardNumber,
      last_id: lastId,
      size: size
    });
    return this.http.get(`${uri}?access_token=${param.token}`, { search: param.search })
  }

  public getProjectDeviceIotCardListManage(cardNumber: string, lastId?: string, size?: number) {
    return this.gsevenRequestViaGet('getProjectDeviceIotCardListManage', {
      efairyiotcard_number: cardNumber,
      last_id: lastId,
      size: size
    })
  }




  public addProjectGm(pid: string, phone: string, name: string) {
    return this.gsevenRequestViaPost('addProjectGmManage', {
      efairyuser_phonenumber: phone,
      efairyuser_nickname: name,
      efairyproject_id: pid
    })
  }
  public deleteProjectGm(pid, gmId) {
    return this.gsevenRequestViaDelete('deleteProjectGmManage', {
      efairyproject_id: pid,
      efairyproject_gm_id_list: JSON.stringify([gmId])
    })
  }

  public addProject(opts) {
    return this.gsevenRequestViaPost('addProjectManage', opts)
  }

  public deleteProject(pid){
    return this.gsevenRequestViaDelete('deleteProjectManage',{
      efairyproject_id_list: JSON.stringify([pid])
    })
  }

  public addProjectUser(pid: string, phone: string, name: string) {
    return this.gsevenRequestViaPost('addProjectUserManage', {
      efairyuser_phonenumber: phone,
      efairyuser_nickname: name,
      efairyproject_id: pid
    })
  }
  public deleteProjectUser(pid, userId) {
    return this.gsevenRequestViaDelete('deleteProjectUserManage', {
      efairyproject_id: pid,
      efairyproject_user_id_list: JSON.stringify([userId])
    })
  }

  public deleteProjectDevice(pid, deviceId){
    return this.gsevenRequestViaDelete('deleteProjectDeviceManage', {
      efairyproject_id: pid,
      efairydevice_id_list: JSON.stringify([deviceId])
    })
  }

  public getProjectDeviceDetailsManage(pid, deviceId) {
    return this.gsevenRequestViaGet('getProjectDeviceDetailsManage', {
      efairyproject_id: pid,
      efairydevice_id: deviceId
    })
  }

  public editProjectDetailsManage(opts) {
    return this.gsevenRequestViaPut('editProjectDetailsManage', opts)
  }

  public addProjectDeviceManage(opts) {
    return this.gsevenRequestViaPost('addProjectDeviceManage', opts);
  }

  public editProjectDeviceManage(opts){
    return this.gsevenRequestViaPut('editProjectDeviceManage', opts);
  }

  public getProjectMonitorData(){
    return this.gsevenRequestViaGet('getProjectMonitorData',{})
  }

  public getNormalUserProjectList(){
    return this.gsevenRequestViaGet('getNormalUserProjectList',{})
  }

  public getGeoProjectList(geoInfo:any,geoLevel:string){
    return this.gsevenRequestViaGet('getGeoProjectList',{
      geo_info:JSON.stringify(geoInfo),
      geo_level:geoLevel
    })
  }

  public getDangerousProject(time:string){
    return this.gsevenRequestViaGet('getDangerousProject',{
     cur_time:time
    })
  }

  public getTotalAlarmList(){
    return this.gsevenRequestViaGet('getTotalAlarmList',{})
  }

  public postDeviceControl(deviceId,order){
    //66-get cid  128 reset 129 dissvoice
    return this.gsevenRequestViaPost('postDeviceControl', {
      efairydevice_id:deviceId,
      control_order:order
    });
  }

}
