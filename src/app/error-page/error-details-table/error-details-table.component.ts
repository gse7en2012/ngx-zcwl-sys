import { Component, OnInit } from '@angular/core';
import { DeviceService } from '../../service/device.service';
import { UserService } from '../../service/user.service';
import { Router, ActivatedRoute, Params } from '@angular/router';
import * as myGlobals from '../../global/globals';
// import { Base64 } from '../../service/base64';
import { Base64 } from 'js-base64';

import { IMyDpOptions, IMyDateModel } from 'mydatepicker';

declare var pako;
declare var moment;
@Component({
  selector: 'app-error-details-table',
  templateUrl: './error-details-table.component.html',
  styleUrls: ['./error-details-table.component.scss'],
  providers: [DeviceService]
})
export class ErrorDetailsTableComponent implements OnInit {

  public deviceId: string;
  public stateHash = ['离线', '报警', '预警', '故障', '启动', '屏蔽', '正常'];
  public dataHash = myGlobals.dataHash;
  public stateHashList = myGlobals.stateHash;

  public alarmList: any = [];
  public myDatePickerOptions: IMyDpOptions = {
    dateFormat: 'yyyy-mm-dd',
    width: '200px',
    height: '26px',
    markCurrentDay: true,
    openSelectorOnInputClick: true
  };
  public startTime: any;
  public endTime: any;
  public startTimeFormat: string;
  public endTimeFormat: string;
  public model: any = { date: { year: 2018, month: 10, day: 9 } };



  public option: any;
  public optionList: any = [];
  // public optionListForShow:any=[];
  public dataViewTypeIsChart: boolean = false;

  private defaultDays = 2;
  constructor(private deviceService: DeviceService, private route: ActivatedRoute, private router: Router, private userService: UserService) { }

  ngOnInit() {
    const nowTime = moment();
    const pastTime = moment().add(-this.defaultDays, 'd');
    this.endTime = {
      date: {
        year: nowTime.year(),
        month: nowTime.month() + 1,
        day: nowTime.date(),
      }
    }
    this.endTimeFormat = nowTime.format('YYYY-MM-DD HH:mm:ss');
    this.startTimeFormat = pastTime.format('YYYY-MM-DD HH:mm:ss');
    this.startTime = {
      date: {
        year: pastTime.year(),
        month: pastTime.month() + 1,
        day: pastTime.date(),
      }
    }


    this.route.params.subscribe(params => {
      if (params && params.device_id) {
        this.deviceId = params.device_id;
      }
    });
    this.getAlarmData(this.startTimeFormat, this.endTimeFormat);

  }



  onStartDateChanged(event: IMyDateModel) {
    if (event.epoc == 0) {
      event.formatted = moment('2000-01-01').format('YYYY-MM-DD');
    }
    this.startTimeFormat = `${event.formatted} 00:00:00`;
    const diff = Math.abs(moment(this.endTimeFormat).diff(moment(this.startTimeFormat), 'days'));
    this.getAlarmData(this.startTimeFormat, this.endTimeFormat);
  }

  onEndDateChanged(event: IMyDateModel) {
    if (event.epoc == 0) {
      event.formatted = moment().format('YYYY-MM-DD');
    }
    this.endTimeFormat = `${event.formatted} 00:00:00`;
    const diff = Math.abs(moment(this.endTimeFormat).diff(moment(this.startTimeFormat), 'days'));
    this.getAlarmData(this.startTimeFormat, this.endTimeFormat);

  }


  getAlarmData(startTime?, endTime?, days?) {
    this.deviceService.getDeviceAlarmData(this.deviceId, '3', startTime, endTime).then((data) => {
      this.alarmList = [];
      data.device_alarm_data_list.forEach(element => {
        if (element.efairydevice_alarm_cid != 0) {
          element['state'] = this['stateHashList'][element['efairydevice_detail_state']];
          console.log(element,this['stateHashList'][138]);
          
          this.alarmList.push(element)
        }
      });

    })
  }












}
