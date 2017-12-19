import { Component, OnInit, OnDestroy } from '@angular/core';
import { DeviceService } from '../../service/device.service';
import { UserService } from '../../service/user.service';
import { Router, ActivatedRoute, Params, Event, NavigationEnd } from '@angular/router';
// import { Base64 } from '../../service/base64';
import { Base64 } from 'js-base64';

import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import 'rxjs/add/operator/filter';

import { IMyDpOptions, IMyDateModel } from 'mydatepicker';
import * as myGlobals from '../../global/globals';


declare var pako;
declare var moment;

@Component({
  selector: 'app-details-table',
  templateUrl: './details-table.component.html',
  styleUrls: ['./details-table.component.scss'],
  providers: [DeviceService]
})
export class DetailsTableComponent implements OnInit, OnDestroy {

  public loading:boolean=false;
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

  public ecList: any = [];

  public option: any;
  public optionList: any = [];
  // public optionListForShow:any=[];
  public dataViewTypeIsChart: boolean = false;
  public urlSubscription: any;
  private defaultDays = 3;

  private defaultPointTotal = 600;

  constructor(private deviceService: DeviceService, private route: ActivatedRoute, private router: Router, private userService: UserService) { }


  ngOnDestroy() {
    this.urlSubscription.unsubscribe();
  }

  ngOnInit() {

    this.urlSubscription = this.router.events.filter(event => event instanceof NavigationEnd).subscribe((event: NavigationEnd) => {
      // You only receive NavigationStart events
      this.getAlarmData(this.startTimeFormat, this.endTimeFormat);
      this.getHistoryData(this.startTimeFormat, this.endTimeFormat);
    });


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
    this.getHistoryData(this.startTimeFormat, this.endTimeFormat);
  }




  onStartDateChanged(event: IMyDateModel) {
    if (event.epoc == 0) {
      event.formatted = moment('2000-01-01').format('YYYY-MM-DD');
    }
    this.startTimeFormat = `${event.formatted} 00:00:00`;
    const diff = Math.abs(moment(this.endTimeFormat).diff(moment(this.startTimeFormat), 'days'));
    this.getAlarmData(this.startTimeFormat, this.endTimeFormat);
    this.getHistoryData(this.startTimeFormat, this.endTimeFormat);
  }

  onEndDateChanged(event: IMyDateModel) {
    if (event.epoc == 0) {
      event.formatted = moment().format('YYYY-MM-DD');
    }
    this.endTimeFormat = `${event.formatted} 00:00:00`;
    const diff = Math.abs(moment(this.endTimeFormat).diff(moment(this.startTimeFormat), 'days'));
    this.getAlarmData(this.startTimeFormat, this.endTimeFormat);
    this.getHistoryData(this.startTimeFormat, this.endTimeFormat);
  }


  getAlarmData(startTime?, endTime?, days?) {
    this.deviceService.getDeviceAlarmData(this.deviceId, '1', startTime, endTime).then((data) => {
      data.device_alarm_data_list.forEach(element => {
        element['state'] = this['stateHashList'][element['efairydevice_detail_state']];
        element['type'] = this['dataHash'][element.efairydevice_alarm_pt][0];
        element['value'] = (element.efairydevice_alarm_rtv * this['dataHash'][element.efairydevice_alarm_pt][1]).toFixed(2);
        element['valueThv'] = (element.efairydevice_alarm_thv * this['dataHash'][element.efairydevice_alarm_pt][1]).toFixed(2);
        element['efairydevice_alarm_rtv'] = element.value + this['dataHash'][element.efairydevice_alarm_pt][2]
        element['efairydevice_alarm_thv'] = element.valueThv + this['dataHash'][element.efairydevice_alarm_pt][2];
        if (element.efairydevice_alarm_pt == '128' || element.efairydevice_alarm_pt == '129') {
          element.efairydevice_alarm_rtv = element.rtv == '1' ? '常开' : '常闭';
          element.efairydevice_alarm_thv = '--'
        }
        if (element.efairydevice_alarm_cid == 9) element['type'] = '烟感探测输入1';
        if (element.efairydevice_alarm_cid == 10) element['type'] = '气体探测输入2';
      });
      this.alarmList = data.device_alarm_data_list;
    })
  }

  getHistoryData(startTime, endTime) {
    this.optionList = [];
    this.loading=true;
    this.deviceService.getDeviceHistoryData(this.deviceId, startTime, endTime).then((data) => {
      if (data.data_stream_list && data.data_stream_list.length > 0) {
        let historyData: any[] = [];
        let tsList = [];
        const tmpStore = {};

        //临时hack

        // data.data_stream_list = [data.data_stream_list[data.data_stream_list.length - 1]]

        data.data_stream_list.forEach((ele) => {
          let eleData = (pako.inflate(window.atob(ele), { to: 'string' }));
          let eleDataJSON = JSON.parse(eleData);
          if (typeof eleDataJSON[0] != 'object') {
            eleDataJSON = JSON.parse(eleDataJSON[0]);
          }
          // console.log(typeof eleData, typeof eleDataJSON, eleDataJSON.length, eleDataJSON[0], typeof eleDataJSON[0], moment(eleDataJSON[0].ts * 1000).format('YYYY-MM-DD'));

          historyData = historyData.concat(eleDataJSON);
        })
        const splitPoint = Math.floor(historyData.length / this.defaultPointTotal);
        historyData = historyData.filter((item, index) => {
          return index % splitPoint == 0;
        })
        console.log(historyData.length);

        historyData.forEach(item => {
          tsList.push(moment(item['ts'] * 1000).format('YYYY-MM-DD HH:mm:ss'));
          try {
            item.data.forEach(row => {
              if (row['cid'] == 0) return;
              if (!tmpStore[row['pt']]) {
                tmpStore[row['pt']] = {
                  series: {},
                }
              }
              if (!tmpStore[row.pt].series[row['cid']]) {
                tmpStore[row.pt].series[row['cid']] = [];
              }
              tmpStore[row.pt].series[row['cid']].push((row.rtv * this.dataHash[row['pt']][1]).toFixed(2));
            })
          } catch (e) {

          }
        })
        // console.log(tsList);
        //  console.log(tmpStore);

        this.clearResponseToChartList(tmpStore, tsList);
        // this.loading=false;
      }
    })
  }

  changeViewType(e) {
    this.dataViewTypeIsChart = !this.dataViewTypeIsChart;
    if (this.dataViewTypeIsChart) {
      // this.loading=true;
      this.ecList.forEach((ec, index) => {
        console.log(ec,this.optionList[index])
        ec.setOption(this.optionList[index], true);
        console.log(ec.setOption,this.optionList[index])
        ec.resize();
      })
    }else{
      this.loading=false;
    }
  }


  clearResponseToChartList(data, tsList) {
    Object.keys(data).forEach(item => {
      const row = data[item];
      const series = [];
      Object.keys(row['series']).forEach(k => {
        series.push({
          data: row['series'][k].reverse(),
          type: 'line',
          name: '通道' + k,
          // stack: '总量',
        })
      })



      this.optionList.push(this.formatChartData(
        this.dataHash[item][0],
        this.dataHash[item][2],
        tsList.reverse(),
        series
      ))

    })
    // console.log(this.optionList)
    this.loading=false;
  }

  onChartInit(ec) {
    this.ecList.push(ec);
  }

  formatChartData(title, unit, xData, series) {
    const option = {
      title: {
        text: title,
        left: 'center',
      },
      tooltip: {
        right: '10',
        trigger: 'axis',
        axisPointer: {
          type: 'cross',
          label: {
            backgroundColor: '#6a7985'
          }
        }
      },
      grid: {
        top: '15%',
        left: '3%',
        right: '3%',
        bottom: '15%',
        containLabel: true
      },
      dataZoom: [
        {   // 这个dataZoom组件，默认控制x轴。
          type: 'slider', // 这个 dataZoom 组件是 slider 型 dataZoom 组件
          start: 0,      // 左边在 10% 的位置。
          end: 100,         // 右边在 60% 的位置。   
          bottom: 0
        },
        // {   // 这个dataZoom组件，也控制x轴。
        //   type: 'inside', // 这个 dataZoom 组件是 inside 型 dataZoom 组件
        //   start: 10,      // 左边在 10% 的位置。
        //   end: 90         // 右边在 60% 的位置。
        // }
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
          name: unit,
          min: 'dataMin'
        }
      ],
      series: series || [
        {
          name: '报警次数',
          type: 'line',
          // stack: '总量',
          // areaStyle: { normal: {} },
          data: []
        },
      ]
    };
    return option;
  }


}
