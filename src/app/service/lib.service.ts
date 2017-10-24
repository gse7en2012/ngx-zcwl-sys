import { Injectable } from '@angular/core';
import { Http, Response, URLSearchParams, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { CookieService } from 'ngx-cookie';
import { errCodeMsgHash } from './err-msg';

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/catch';

@Injectable()
export class LibService {

  constructor(
    private cookieService: CookieService,
    private http: Http
  ) { }


  generateHttpGetSearchParams(opts?: object) {
    const params: URLSearchParams = new URLSearchParams();
    // params.set('access_token', (this.cookieService.get('pst_token')))
    params.set('efairyuser_id', this.cookieService.getObject('pst_admin_info')['efairyuser_id']);

    if (opts) {
      Object.keys(opts).forEach((key) => {
        if (opts[key]) params.set(key, opts[key].toString());
      });
    }
    return {
      token: encodeURIComponent(this.cookieService.get('pst_token')),
      search: params,
    }
  }

  generateHttpPostSearchParams(opts) {
    const token = this.cookieService.get('pst_token');
    const postData = Object.assign({
      efairyuser_id: this.cookieService.getObject('pst_admin_info')['efairyuser_id'],
      access_token: token
    }, opts)
    return postData;
  }


  createGetRequest(uri: string, opts: object): Promise<any> {
    const param = this.generateHttpGetSearchParams(opts);
    return this.http
      .get(`${uri}?access_token=${param.token}`, { search: param.search })
      .map(res => res.json()).toPromise()
      .then((data) => {
        if (data.err_code === 200) {
          return data.result;
        }
        return Promise.reject(data.msg || '返回数据格式出错！');
      })
  }

}
