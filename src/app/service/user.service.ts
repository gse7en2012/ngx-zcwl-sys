import { Injectable } from '@angular/core';
import { Http, Response, URLSearchParams, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { CookieService } from 'ngx-cookie';

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/catch';

@Injectable()
export class UserService {

  private serviceUrl: object = {
    login: '/sgmapi/sgm_login'
  };

  constructor(
    private cookieService: CookieService,
    private http: Http
  ) { }

  public adminLogin(username: string, pass: string) {
    return this.http.post(this.serviceUrl['login'], {
      account: username,
      token: pass
    }).map(res => res.json()).toPromise()
      .then((data) => {
        if (data.err_code === 200) {
          this.cookieService.put('kg_stoken', data.result.access_token);
          this.cookieService.putObject('kg_sadmin_info', {
            "supergm_user_id": data.result.supergm_user_id, 
            "supergm_name":  data.result.supergm_name, 
            "supergm_account":  data.result.supergm_account
          });
          return data.result;
        }else{
          return Promise.reject(data.msg);
        }
      })
  }

  public logOut(){
    this.cookieService.remove('kgs_sgm_accesstoken');
    this.cookieService.remove('kg_sadmin_info');
    this.cookieService.remove('kg_stoken');
  }


  public checkAdminLogin() {
    return !!this.cookieService.get('kgs_sgm_accesstoken');
  }

  public getAdminInfo(){
    return {
      accountName:this.cookieService.get('kgs_sgm_account')
    }
  }

}
