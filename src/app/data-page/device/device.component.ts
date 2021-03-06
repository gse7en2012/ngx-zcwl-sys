import { Component, OnInit, OnDestroy } from '@angular/core';
import { DeviceService } from '../../service/device.service';
import { UserService } from '../../service/user.service';
import { ProjectService } from '../../service/project.service';
import { Router, ActivatedRoute, Params } from '@angular/router';
import * as myGlobals from '../../global/globals';
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
  //for breadcrumb
  public agencyId: string;
  public agencyName: string;

  public dataUpdateTime: any;
  public loading: boolean = true;


  public pageFromType: number = 1; //1-admin manage  2-geo
  public geoInfo: any = {};
  public geoLevel: string;
  public qs: any;

  public stateHash = ['离线', '报警', '预警', '故障', '启动', '屏蔽', '正常'];
  public dataHash = myGlobals.dataHash;
  public stateHashList = myGlobals.stateHash;


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

    this.getInitQueryString();

    if (this.agencyId) {
      this.pageFromType = 1;
      this.projectService.getProjectList(this.agencyId).then((data) => {
        this.agencyName = data.lv2_agency_info.efairyuser_nickname
      })
    }

    this.deviceService.getDeviceList(this.projectId).then((data) => {
      this.project = data.project_info;
    })
    this.getAlarmData();
  }

  ngOnDestroy() {
    clearInterval(this.stId);
  }

  conrtolDevice(order) {
    this.projectService.postDeviceControl(this.deviceId, order).then((r) => {
      alert(r.efairydevicemsg_content + '操作成功！')
    }).catch(e => {
      alert(e)
    })
  }

  historyChartNavigate() {
    this.router.navigate(['../../../../branch_warning/' + this.projectId + '/device/' + this.deviceId], { relativeTo: this.route })
  }


  getInitQueryString() {
    this.route.queryParams.subscribe(queryParams => {
      this.geoLevel = queryParams.geo_level;
      this.geoInfo = {
        efairyproject_province: queryParams.province,
        efairyproject_city: queryParams.city,
        efairyproject_district: queryParams.district,
        efairyproject_township: queryParams.town,
        efairyproject_seaarea: ''
      }
      this.qs = queryParams;
      if (this.geoLevel) this.pageFromType = 2;
    })
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
          const single = {
            itemName: this.dataHash[element.pt][0] + '通道' + element.cid,
            itemValue: [(element.rtv * this.dataHash[element.pt][1]).toFixed(2), this.dataHash[element.pt][2], '/', (element.thv * this.dataHash[element.pt][1]).toFixed(2), this.dataHash[element.pt][2]].join(''),
            itemError: (element.rtv > element.thv) || false
          };

          if (element.pt == '128' || element.pt == '129') {
            if (element.thv == '0') single.itemValue = '不启用'
            if (element.thv == '1') single.itemValue = '常开检测'
            if (element.thv == '2') single.itemValue = '常闭检测'
            single.itemError = false;
          }
          if (element.cid == 9) single.itemName = '烟感探测输入1';
          if (element.cid == 10) single.itemName = '气体探测输入2';
          this.dataList.push(single)
        }
      });
    }
    if (data.realtime_data && data.realtime_data.ts) {
      this.dataUpdateTime = moment(data.realtime_data.ts * 1000).format('YYYY/MM/DD HH:mm:ss')
    }

    this.deviceDetails.device_info.master = this.deviceDetails.device_info.efairydevice_uuid.slice(0, 20);
    this.deviceDetails.device_info.follow = this.deviceDetails.device_info.efairydevice_uuid.slice(20, 26);
    this.deviceDetails.device_info.follow = [
      parseInt(this.deviceDetails.device_info.follow.slice(0, 2), 16),
      parseInt(this.deviceDetails.device_info.follow.slice(2, 4), 16),
      parseInt(this.deviceDetails.device_info.follow.slice(4, 6), 16)
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
          //stack: '总量',
          // areaStyle: { normal: {} },
          data: yData
        },
      ]
    };
  }



}
