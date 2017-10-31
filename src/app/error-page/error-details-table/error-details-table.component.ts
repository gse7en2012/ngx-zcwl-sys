import { Component, OnInit } from '@angular/core';
import { DeviceService } from '../../service/device.service';
import { UserService } from '../../service/user.service';
import { Router, ActivatedRoute, Params } from '@angular/router';
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
  public dataHash = {
    1: ['高度', 0.01, 'm'],
    2: ['温度', 0.1, '℃'],
    3: ['压力', 0.1, 'MPa'],
    4: ['压力', 0.1, 'kPa'],
    5: ['气体浓度', 0.1, '%LEL'],
    6: ['气体浓度', 0.1, '%VOL'],
    7: ['气体浓度', 1, '10^-6体积分数'],
    8: ['气体浓度', 1, 'mg/m3'],
    9: ['时间', 1, 's'],
    10: ['电压', 0.1, 'V'],
    11: ['电流', 0.1, 'A'],
    12: ['流量', 0.1, 'L/s'],
    13: ['风量', 0.1, 'm3/min'],
    14: ['风速', 0.1, 'm/s'],
    15: ['剩余电流', 0.1, 'mA'],
    16: ['烟参量', 0.1, ''],
    128: ['输入检测', 1, ''],
    129: ['输出控制', 1, '']
  }
  public stateHashList = this.createHash();
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


  createHash() {
    let hashArray = new Array(255);
    hashArray[0] = '预留';
    hashArray[1] = '正常';
    hashArray[2] = '火警';
    hashArray[3] = '启动';
    hashArray[4] = '动作';
    hashArray[5] = '监管';
    hashArray[6] = '故障';
    hashArray[7] = '自检';
    hashArray[21] = '通讯故障';
    hashArray[22] = '主电故障';
    hashArray[23] = '备电故障';
    hashArray[24] = '线路故障';
    hashArray[40] = '故障恢复';
    hashArray[41] = '通讯故障恢复';
    hashArray[42] = '主电故障恢复';
    hashArray[43] = '备电故障恢复';
    hashArray[44] = '线路故障恢复';
    hashArray[70] = '停止';
    hashArray[71] = '屏蔽';
    hashArray[72] = '屏蔽撤销';
    hashArray[73] = '开机';
    hashArray[74] = '关机';
    hashArray[75] = '复位';
    hashArray[76] = '手动状态';
    hashArray[77] = '自动状态';
    hashArray[78] = '确认/消音';
    hashArray[128] = '主电欠压故障';
    hashArray[129] = '主电欠压恢复';
    hashArray[130] = '备电欠压故障';
    hashArray[131] = '备电欠压恢复';
    hashArray[132] = '温度传感器短路';
    hashArray[133] = '温度传感器短路恢复';
    hashArray[134] = '温度传感器开路';
    hashArray[135] = '温度传感器开路恢复';
    hashArray[136] = '电流互感器短路';
    hashArray[137] = '电流互感器短路恢复';
    hashArray[138] = '电流互感器开路';
    hashArray[139] = '电流互感器开路恢复';
    hashArray[140] = '漏电预警';
    hashArray[141] = '温度预警';
    hashArray[142] = '过流预警';
    hashArray[143] = '漏电报警';
    hashArray[144] = '温度报警';
    hashArray[145] = '过流报警';
    hashArray[146] = '电源短路故障';
    hashArray[147] = '电源短路故障恢复';
    hashArray[148] = '回路短路';
    hashArray[149] = '回路短路恢复';
    hashArray[150] = '回路通信故障';
    hashArray[151] = '回路通信故障恢复';
    hashArray[152] = '输出线故障';
    hashArray[153] = '输出线故障恢复';
    hashArray[154] = '输入线故障';
    hashArray[155] = '输入线故障恢复';
    hashArray[156] = '模块电源故障';
    hashArray[157] = '模块电源故障恢复';
    hashArray[158] = '新设备注册';
    hashArray[159] = '打印机故障';
    hashArray[160] = '打印机故障恢复';
    hashArray[161] = '打印机缺纸';
    hashArray[162] = '打印机缺纸恢复';
    hashArray[163] = '系统故障';
    hashArray[164] = '系统故障恢复';
    hashArray[165] = '反馈';
    hashArray[166] = '停止反馈';
    return hashArray;
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
          this.alarmList.push(element)
        }
      });

    })
  }












}
