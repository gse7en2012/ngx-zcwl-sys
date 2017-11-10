import { Component, OnInit, OnDestroy } from '@angular/core';
import { DeviceService } from '../../service/device.service';
import { UserService } from '../../service/user.service';
import { ProjectService } from '../../service/project.service';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Base64 } from '../../service/base64';
declare var pako;
declare var moment;

@Component({
  selector: 'app-device',
  templateUrl: './device.component.html',
  styleUrls: ['./device.component.scss'],
  providers: [DeviceService, ProjectService]
})
export class DeviceComponent implements OnInit, OnDestroy {

  public isDeviceEditing: boolean = false;
  public deviceId: string;
  public deviceDetails: any = {
    device_info: {
      efairydevice_name: ''
    }
  };
  public project: any = {
    efairyproject_name: ''
  };
  public projectId: string;
  public agencyId: string;
  public agencyName: string;


  public dataUpdateTime: any;
  public loading: boolean = true;

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
    15: ['漏电', 0.1, 'mA'],
    16: ['烟参量', 0.1, ''],
    128: ['输入检测', 1, ''],
    129: ['输出控制', 1, '']
  }
  public dataList: any = [];
  //0-离线 1- 警 2-预警 3-故障 4-启动 5-屏蔽 6-正常，优先级:离线 报警 预警 故障 启动 屏蔽 正常


  public option: object;
  public stId;

  constructor(private deviceService: DeviceService, private route: ActivatedRoute, private router: Router, private userService: UserService, private projectService: ProjectService) { }


  ngOnInit() {
    this.route.params.subscribe(params => {
      this.projectId = params.branch_id;
      this.agencyId = params.agency_id;


      if (params && params.device_id) {
        this.deviceId = params.device_id;
        this.getData();
        this.stId = setInterval(() => {
          
          this.getData();
        }, 30000);

      }
    });


    this.projectService.getProjectList(this.agencyId).then((data) => {
      this.agencyName = data.lv2_agency_info.efairyuser_nickname
    })

    this.deviceService.getDeviceList(this.projectId).then((data) => {
      this.project=data.project_info;
    })

    this.getAlarmData();

  }

  ngOnDestroy() {
    console.log('leave device');

    clearInterval(this.stId);
  }

  getData() {
    this.loading = true;
    this.deviceService.getDeviceDetails(this.deviceId).then((data) => {
      this.loading = false;
      this.deviceDetails = data;
      this.formatDataList(data);

    });
  }

  getAlarmData() {
    this.deviceService.getDeviceAlarmData(this.deviceId, '1').then((data) => {

      const tmpDayObj = {};
      const dayList = [];
      const dayValueList = [];


      for (let i = 6; i >= 0; i--) {
        tmpDayObj[moment().add(-i, 'd').format('YYYY-MM-DD')] = 0;
      }

      data.device_alarm_data_list.forEach((item) => {
        const time = item.efairydevice_alarm_time.split(' ')[0];
        if (time && tmpDayObj.hasOwnProperty(time)) {
          tmpDayObj[time]++;
        }
      });
      Object.keys(tmpDayObj).forEach((k) => {
        dayList.push(k);
        dayValueList.push(tmpDayObj[k])
      })
      this.formatChartData(dayList, dayValueList);


    })
  }

  editDevice() {
    this.isDeviceEditing = !this.isDeviceEditing;
  }
  closePop() {
    this.isDeviceEditing = false;
  }

  formatDataList(data) {
    if (data.realtime_data && data.realtime_data.data && data.realtime_data.data.length > 0) {
      this.dataList = [];
      data.realtime_data.data.forEach(element => {
        if (element.cid != 0 && this.dataHash[element.pt]) {
          //{cid: 0, st: 30, pt: 1, rtv: 0, thv: 0}
          const single={
            itemName: this.dataHash[element.pt][0] + '通道' + element.cid,
            itemValue: [(element.rtv * this.dataHash[element.pt][1]), this.dataHash[element.pt][2], '/', (element.thv * this.dataHash[element.pt][1]), this.dataHash[element.pt][2]].join('')
          };
          if(element.pt=='128'){
            single.itemValue=element.rtv=='1'?'启用':'不启用'
          }
          this.dataList.push(single)
        }
      });
    }
    if (data.realtime_data && data.realtime_data.ts) {
      this.dataUpdateTime = moment(data.realtime_data.ts * 1000).format('YYYY/MM/DD HH:mm:ss')
    }

    this.deviceDetails.device_info.master=this.deviceDetails.device_info.efairydevice_uuid.slice(0,20);
    this.deviceDetails.device_info.follow=this.deviceDetails.device_info.efairydevice_uuid.slice(20,26);
    this.deviceDetails.device_info.follow=[
      parseInt(this.deviceDetails.device_info.follow.slice(0,2),16),
      parseInt(this.deviceDetails.device_info.follow.slice(2,4),16),
      parseInt(this.deviceDetails.device_info.follow.slice(4,6),16)
    ].join('-')
  }

  formatChartData(xData, yData) {
    this.option = {
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
        top: '10%',
        left: '5%',
        right: '5%',
        bottom: '5%',
        containLabel: true
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
          minInterval: 1
        }
      ],
      series: [
        {
          name: '报警次数',
          type: 'line',
          stack: '总量',
          // areaStyle: { normal: {} },
          data: yData
        },
      ]
    };
  }



}
