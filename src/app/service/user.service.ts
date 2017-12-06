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

declare var moment;

@Injectable()
export class UserService {

  private serviceUrl: object = {
    login: '/webapi/login',
    getCode: '/webapi/login_checkcode',
    getUserCenter: '/webapi/user_center',
  };

  private codeHash: any;

  public projectListForGlobal: object = {};

  constructor(
    private cookieService: CookieService,
    private http: Http,
    private libService: LibService,
    private codeHashObj: errCodeMsgHash
  ) {
    this.codeHash = codeHashObj.codeHash;
  }


  public savePhoneToCookie(phone: string) {
    const list: any = this.getPhoneCookie() || [];
    console.log(list);
    if (list.indexOf(phone) == -1) list.push(phone);
    if (list.length > 8) list.shift();
    this.cookieService.putObject('pst_admin_phone', list, {
      expires: moment().add(30, 'd').format('YYYY-MM-DD HH:mm:ss')
    });
  }
  public getPhoneCookie() {
    return this.cookieService.getObject('pst_admin_phone');
  }

  public adminLogin(username: string, pass: string) {
    const params: URLSearchParams = new URLSearchParams();
    params.set('efairy_phonenumber', username);
    params.set('check_code', pass);
    return this.http.get(this.serviceUrl['login'], { search: params }).map(res => res.json()).toPromise()
      .then((data) => {
        if (data.err_code === 200) {
          data.result.user_info.user_level = data.result.level;
          this.cookieService.put('pst_token', data.result.access_token);
          this.cookieService.putObject('pst_admin_info', data.result.user_info);
          return data.result;
        } else {
          return Promise.reject(
            // this.codeHash[data.err_code] || '系统出错，请联系管理员'
            data.msg
          );
        }
      })
  }

  public getSmsCode(phone: string) {
    const params: URLSearchParams = new URLSearchParams();
    params.set('phonenumber', phone);
    return this.http.get(this.serviceUrl['getCode'], { search: params }).map(res => res.json()).toPromise()
      .then((data) => {
        if (data.err_code === 200) {
          return data.result;
        } else {
          return Promise.reject(
            // this.codeHash[data.err_code] || '系统出错，请联系管理员'
            data.msg
          );
        }
      })
  }

  public getUserCenter() {
    const param = this.libService.generateHttpGetSearchParams();
    return this.http.get(`${this.serviceUrl['getUserCenter']}?access_token=${param.token}`, { search: param.search }).map(res => res.json()).toPromise()
      .then((data) => {
        if (data.err_code === 200) {
          return data.result;
        } else {
          return Promise.reject(
            // this.codeHash[data.err_code] || '系统出错，请联系管理员'
            data.msg
          );
        }
      })
  }

  public logOut() {
    this.cookieService.remove('pst_token');
    this.cookieService.remove('pst_admin_info');
  }


  public checkAdminLogin() {
    return !!this.cookieService.get('pst_token');
  }

  public getAdminInfo() {

    return this.cookieService.getObject('pst_admin_info')

  }

  public setProjectList(list) {
    // this.projectListForGlobal=list;
    if (list) {
      this.projectListForGlobal = {};
      list.forEach((item) => {
        this.projectListForGlobal[item.efairyproject_id] = item;
      })
    }
  }

  public getProjectById(id) {
    return this.projectListForGlobal[id]
  }

}
