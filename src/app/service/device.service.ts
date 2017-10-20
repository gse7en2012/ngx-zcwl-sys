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
export class DeviceService {
  private serviceUrl: object = {
    list: '/webapi/device_list',
    details: '/webapi/device',
    alarmData:'/webapi/device_alarm_data'
  };

  private codeHash: any;


  constructor(
    private cookieService: CookieService,
    private http: Http,
    private libService: LibService,
    private codeHashObj: errCodeMsgHash
  ) {
    this.codeHash = codeHashObj.codeHash;
  }


  getDeviceList(pid: string, alarmId?: string) {
    return this.libService.createGetRequest(this.serviceUrl['list'],{
      efairyproject_id: pid,
      alarm_id: alarmId
    })
  }

  getDeviceDetails(deviceId: string, startTime?: string, days?: number) {
    return this.libService.createGetRequest(this.serviceUrl['details'],{
      efairydevice_id: deviceId,
      start_time: startTime,
      days:days
    })
  }

  getDeviceAlarmData(deviceId: string,alarmId:string,startTime?:string,days?:number) {
    return this.libService.createGetRequest(this.serviceUrl['alarmData'],{
      efairydevice_id: deviceId,
      alarm_id:alarmId||1,
      start_time: startTime,
      days:days||7
    })
  }




}
