import { Component, OnInit } from '@angular/core';
import { Router, CanActivate } from '@angular/router';
import { UserService } from '../service/user.service';
import { ProjectService } from '../service/project.service';
import { DeviceService } from '../service/device.service';
import * as myGlobals from '../global/globals';

declare var AMap;
declare var AMapUI;
declare var moment;


@Component({
  selector: 'app-master-page',
  templateUrl: './master-page.component.html',
  styleUrls: ['./master-page.component.scss'],
  providers: [DeviceService]
})
export class MasterPageComponent implements OnInit {

  public userLevelLabel: string;
  public userInfo: any;
  public time: string;
  public deviceAlarmData: any;
  public userCenter: any = {};
  public projectList: any;
  public bigMap: any;

  public warningProjectNums: number = 0;
  public mistakeProjectNums: number = 0;
  public normalProjectNums: number = 0;
  public locationPointLngLat: string[];

  public stateHash = ['离线', '报警', '预警', '故障', '启动', '屏蔽', '正常'];
  public dataHash = myGlobals.dataHash;
  public stateHashList = myGlobals.stateHash;
  public projectAlarmList: any;
  public projectAlarmTotal: number = 0;

  public leftChartOption: any;
  public rightChartOption: any;
  public totalDevice: number;
  public offDevice: number;
  public onlineDevice: number;

  public bottomChartOption: any;
  public deviceAlarmDataLoading: boolean = true;
  public projectAlarmListLoading: boolean = true;
  public userCenterLoading: boolean = true;

  constructor(private userService: UserService, private router: Router, private deviceService: DeviceService, private projectService: ProjectService) { }

  ngOnInit() {
    const userLevelList = ['超级管理员', '总监+', '总监', '项目管理员', '普通用户'];
    this.userInfo = this.userService.getAdminInfo();
    this.userLevelLabel = userLevelList[this.userInfo.user_level];
    this.time = moment().format('YYYY年MM月DD日');

    this.getLastAlarmData();
    this.getUserCenter();
    this.getAllProject();
    this.getDeviceStatistics();
    this.getDangerousProject();
    this.getTotalAlarmList();
  }

  getTotalAlarmList() {
    this.projectService.getTotalAlarmList().then((data) => {
      this.projectAlarmListLoading = false;
      this.projectAlarmList = data.alarm_data_list;
      this.projectAlarmTotal = data.total_rows;
      this.projectAlarmList.forEach((item) => {
        item.label = this.dataHash[item.efairydevice_alarm_pt] ? this.dataHash[item.efairydevice_alarm_pt][0] : '';
        item.state = this.stateHashList[item.efairydevice_detail_state];
        item.efairydevice_alarm_time = moment(item.efairydevice_alarm_time).format('MM-DD HH:mm');
        if (this.dataHash[item.efairydevice_alarm_pt] && this.dataHash[item.efairydevice_alarm_pt][1]) {
          item.efairydevice_alarm_rtv = (item.efairydevice_alarm_rtv * this.dataHash[item.efairydevice_alarm_pt][1]).toFixed(2) + this.dataHash[item.efairydevice_alarm_pt][2];
          item.efairydevice_alarm_thv = (item.efairydevice_alarm_thv * this.dataHash[item.efairydevice_alarm_pt][1]).toFixed(2) + this.dataHash[item.efairydevice_alarm_pt][2];
        }
      })
    })
  }

  getDangerousProject() {
    const curTime = moment().format('YYYY-MM-DD HH:mm:ss')
    this.projectService.getDangerousProject(curTime).then((data) => {
      if (data.length == 0) return;
      const dangerList = data.alarm_times_list;
      if (dangerList.length > 0) {
        this.bottomChartOption = this.formatLineChartData(
          data.project_info.efairyproject_name + '报警累计',
          dangerList.map((item) => { return item.time }),
          dangerList.map((item) => { return item.alarm_times })
        )
      }
    })
  }


  getLastAlarmData() {
    this.deviceService.getLastDeviceAlarmData().then((data) => {
      this.deviceAlarmData = data.device_alarm_data_list;
      this.deviceAlarmData.forEach((item) => {
        item.blueTime = moment(item.efairydevicefiredata_time).format('MM-DD');
        item.spanTime = moment(item.efairydevicefiredata_time).format('HH:mm');

        item.ss = this.dataHash[item.efairydevicefiredata_parameter][0];
        item.efairydevicefiredata_thv_v = (this.dataHash[item.efairydevicefiredata_parameter][1] * item.efairydevicefiredata_thv).toFixed(2) + '' + this.dataHash[item.efairydevicefiredata_parameter][2];
        item.efairydevicefiredata_rtv_v = (this.dataHash[item.efairydevicefiredata_parameter][1] * item.efairydevicefiredata_rtv).toFixed(2) + '' + this.dataHash[item.efairydevicefiredata_parameter][2];
      })

      this.deviceAlarmDataLoading = false;
    })
  }


  getDeviceStatistics() {
    this.deviceService.getDeviceStatistics().then((data) => {
      const leftChartData = data.devices_status;

      this.leftChartOption = this.formatPieChartData('设备情况', [
        { value: leftChartData.device_normal_number, name: '正常数:' + leftChartData.device_normal_number },
        { value: leftChartData.device_fire_number, name: '报警数:' + leftChartData.device_fire_number },
        { value: leftChartData.device_trouble_number, name: '故障数:' + leftChartData.device_trouble_number }
      ]);
      this.totalDevice = leftChartData.device_offline_number + leftChartData.device_online_number;
      this.onlineDevice = leftChartData.device_online_number;
      this.offDevice = leftChartData.device_offline_number;

      if (data.scale_map_list.length > 0) {
        const rightChartData = data.scale_map_list.map((item) => {
          return {
            value: item.alarm_times,
            name: this.dataHash[item.pt][0] + ':' + item.alarm_times
          }
        });
        this.rightChartOption = this.formatPieChartData('报警占比', rightChartData, [
          "#e50304",
          "#f08300",
          "#f8da10",
          "#6e7074",
          "#61a0a8",
          "#efa18d",
          "#787464",
          "#cc7e63",
          "#724e58",
          "#4b565b"
        ]);
      }

    })
  }

  getUserCenter() {
    this.userService.getUserCenter().then((data) => {
      this.userCenter = data;
      this.userCenterLoading = false;
    })
  }
  formatLineChartData(title, xData, yData) {
    return {
      tooltip: {
        trigger: 'axis'
      },
      legend: {
        data: ['报警次数'],
        top: 10
      },
      title: {
        text: title,
        top: 10,
        left: 10
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
      },
      toolbox: {
        feature: {
          magicType: {
            type: ['line', 'bar']
          }
        }
      },
      xAxis: {
        type: 'category',
        boundaryGap: false,
        data: xData
      },
      yAxis: {
        type: 'value'
      },
      series: [
        {
          name: '报警次数',
          type: 'line',
          // stack: '总量',
          data: yData
        }
      ]
    };
  }

  formatPieChartData(title: string, data: object[], color?: string[]) {
    return {
      tooltip: {
        trigger: 'item',
        formatter: "{b} ({d}%)",
        textStyle: {
          fontSize: 14
        },
        position: ['40%', '50%']
      },
      color: color,
      title: {
        text: title,
        left: 5,
        top: 5,
        textStyle: {
          fontSize: 14,
        }
      },
      legend: {
        orient: 'vertical',
        x: 'right',
        data: data.map((item: any) => item.name),
        textStyle: {
          fontSize: 12,
          color: '#666'
        },
        itemWidth: 10,
        itemHeight: 10,
        itemGap: 5,
        top: 5
      },
      series: [
        {
          // name: '访问来源',
          type: 'pie',
          radius: ['0%', '60%'],
          center: ['30%', '60%'],
          avoidLabelOverlap: false,
          label: {
            normal: {
              show: false,
              position: 'center'
            },
            emphasis: {
              show: false,
              textStyle: {
                fontSize: '16',
                fontWeight: 'normal'
              }
            }
          },
          labelLine: {
            normal: {
              show: false
            }
          },
          data: data
        }
      ]
    };
  }


  getAllProject() {
    this.projectService.getAllProjectList().then((data) => {
      this.projectList = data.project_list;
      this.locationPointLngLat = this.projectList.map((row: any) => {
        const color = row.efairyproject_fire_number > 0 ? "r" : (row.efairyproject_trouble_number > 0 ? 'o' : 'g');
        if (color == 'r') {
          this.warningProjectNums++;
        } else if (color == 'o') {
          this.mistakeProjectNums++;
        } else {
          this.normalProjectNums++;
        }
        return [row['efairyproject_location_lng'], row['efairyproject_location_lat'], color, row.efairyproject_name].join(',')
      })
      return data.project_list;
    }).then(list => {
      this.drawMap(list);
    });
  }

  drawMap(pointList) {
    this.bigMap = new AMap.Map('m-map', {
      resizeEnable: true,
      zoom: 12,
      mapStyle: "amap://styles/macaron"
    });
    this.bigMap.on('click', (e) => {
      this.bigMap.clearInfoWindow()
    })
    let infoWindow = new AMap.InfoWindow({
      offset: new AMap.Pixel(10, -40),
      isCustom: true,
    });
    pointList.forEach((point, index) => {
      if (index === 0) this.bigMap.setCenter([point.efairyproject_location_lng, point.efairyproject_location_lat]);
      const img = point.efairyproject_fire_number > 0 ?
        "assets/image/building_red.png" : ((point.efairyproject_trouble_number > 0 || point.efairyproject_state == 0) ? 'assets/image/building_orange.png' : 'assets/image/building_green.png');
      const pointMaker = new AMap.Marker({
        map: this.bigMap,
        position: [point.efairyproject_location_lng, point.efairyproject_location_lat],
        title: point.efairyproject_name,
        icon: new AMap.Icon({
          size: new AMap.Size(30, 30),  //图标大小
          image: img,
        })
      });
      pointMaker.content = `
        <div class="info-window">
          <h3 class="name">
          ${point.efairyproject_name}
          </h3>
          <p class="address">
            ${point.efairyproject_address}<br>
            <a href="/admin/data/${point.efairyproject_user_id}/agency/${point.efairyproject_user_id}/branch/${point.efairyproject_id}" class="link">点击查看>></a>
          </p>
        </div>
      `;
      pointMaker.on('click', (e) => {
        infoWindow.setContent(e.target.content);
        infoWindow.open(this.bigMap, e.target.getPosition());
      });

    })

  }


}
