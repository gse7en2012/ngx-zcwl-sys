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
  selector: 'app-details-table',
  templateUrl: './details-table.component.html',
  styleUrls: ['./details-table.component.scss'],
  providers: [DeviceService]
})
export class DetailsTableComponent implements OnInit {

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
  public dataViewTypeIsChart: boolean = false;

  private defaultDays = 30;
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
    this.getHistoryData();
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
    this.getAlarmData(this.startTimeFormat, this.endTimeFormat)
  }

  onEndDateChanged(event: IMyDateModel) {
    if (event.epoc == 0) {
      event.formatted = moment().format('YYYY-MM-DD');
    }
    this.endTimeFormat = `${event.formatted} 00:00:00`;
    const diff = Math.abs(moment(this.endTimeFormat).diff(moment(this.startTimeFormat), 'days'));
    this.getAlarmData(this.startTimeFormat, this.endTimeFormat)
  }


  getAlarmData(startTime?, endTime?, days?) {
    this.deviceService.getDeviceAlarmData(this.deviceId, '1', startTime, endTime).then((data) => {
      data.device_alarm_data_list.forEach(element => {
        element['state'] = this['stateHashList'][element['efairydevice_detail_state']];
        element['type'] = this['dataHash'][element.efairydevice_alarm_pt][0];
        element['value'] = (element.efairydevice_alarm_rtv * this['dataHash'][element.efairydevice_alarm_pt][1]).toFixed(2);
        element['valueThv'] = (element.efairydevice_alarm_thv * this['dataHash'][element.efairydevice_alarm_pt][1]).toFixed(2);
        element['efairydevice_alarm_rtv'] = element.value + this['dataHash'][element.efairydevice_alarm_pt][2]
        element['efairydevice_alarm_thv'] = element.valueThv + this['dataHash'][element.efairydevice_alarm_pt][2]
      });
      this.alarmList = data.device_alarm_data_list;
    })
  }

  getHistoryData() {
    // const base64Lib=new Base64();
    this.deviceService.getDeviceHistoryData(this.deviceId).then((data) => {
      let t=data.data_stream_list[0];
      // t='eAHtkr0SgjAQhN8lNUUOAkl8FaBgpNDOkYyNw7t7SyT8ZWS0saHbyeTL3l62FM9KtI1rKnEqWZ6vLSuZVKJzLAqoGxTE3T3eyl0G1ScBoRGhzIwM5RGokHKGpROmRgxnayu9oLJAqQhlFYb1Iy45XB5yUZxDiBiHHJ84TBzjisCxGNZIsFiHM4tw+hcIO\/cTfuFkt1CKh9bz0ezDKHQDSXymfWhqxwTBfetU86nruGaUSzLW5Er3IjlaGpZl1dHS\/cL9o6X1C05DgU4=';
      var c=Base64.atob(t);
      console.log(pako.inflate(c,{to:'string'}));
      
    })
  }

  changeViewType(e) {
    this.dataViewTypeIsChart = !this.dataViewTypeIsChart;
    if (this.dataViewTypeIsChart) {

    }
  }


  clearResponseToChartList(data) {
    const tmp = {};

    data.forEach((item) => {
      if (!tmp[item.efairydevice_alarm_pt]) {
        tmp[item.efairydevice_alarm_pt] = {
          title: this.dataHash[item.efairydevice_alarm_pt][0],
          unit: this.dataHash[item.efairydevice_alarm_pt][2],
          xAxis: {

          }
        };
      }
      if (!tmp[item.efairydevice_alarm_pt].xAxis[item.efairydevice_alarm_time]) {
        tmp[item.efairydevice_alarm_pt].xAxis[item.efairydevice_alarm_time] = {};
      }
      if (!tmp[item.efairydevice_alarm_pt].xAxis[item.efairydevice_alarm_time][item.efairydevice_alarm_cid]) {
        tmp[item.efairydevice_alarm_pt].xAxis[item.efairydevice_alarm_time][item.efairydevice_alarm_cid] = {
          name: '通道' + item.efairydevice_alarm_cid
        }
      }
      tmp[item.efairydevice_alarm_pt].xAxis[item.efairydevice_alarm_time][item.efairydevice_alarm_cid]['value'] = item.value;
    })
    console.log(JSON.stringify(tmp, null, 2));

    Object.keys(tmp).forEach((item) => {
      console.log(tmp[item]);

    })


  }



  formatChartData(title, unit, xData, series) {
    const option = {
      title: {
        text: title,
        left: 'center'
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'cross',
          label: {
            backgroundColor: '#6a7985'
          }
        }
      },
      grid: {
        top: '5%',
        left: '2%',
        right: '2%',
        bottom: '14%',
        containLabel: true
      },
      dataZoom: [
        {   // 这个dataZoom组件，默认控制x轴。
          type: 'slider', // 这个 dataZoom 组件是 slider 型 dataZoom 组件
          start: 10,      // 左边在 10% 的位置。
          end: 90,         // 右边在 60% 的位置。   
          bottom: 0
        },
        {   // 这个dataZoom组件，也控制x轴。
          type: 'inside', // 这个 dataZoom 组件是 inside 型 dataZoom 组件
          start: 10,      // 左边在 10% 的位置。
          end: 90         // 右边在 60% 的位置。
        }
      ],
      toolbox: {
        orient: 'vertical',
        feature: {
          magicType: {
            type: ['line', 'bar']
          }
        }
      },
      xAxis: [
        {
          type: 'category',
          boundaryGap: false,
          data: xData,
        }
      ],
      yAxis: [
        {
          type: 'value',
          name: unit
        }
      ],
      series: series || [
        {
          name: '报警次数',
          type: 'line',
          stack: '总量',
          // areaStyle: { normal: {} },
          data: []
        },
      ]
    };
    return option;
  }

 
}
