import { Component, OnInit } from '@angular/core';
import { Router, CanActivate } from '@angular/router';
import { UserService } from '../service/user.service';
import { DeviceService } from '../service/device.service';

declare var moment;

@Component({
  selector: 'app-master-page',
  templateUrl: './master-page.component.html',
  styleUrls: ['./master-page.component.scss'],
  providers: [DeviceService]
})
export class MasterPageComponent implements OnInit {

  public userInfo: any;
  public time: string;
  public deviceAlarmData: any;

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


  constructor(private userService: UserService, private router: Router, private deviceService: DeviceService) { }

  ngOnInit() {
    this.userInfo = this.userService.getAdminInfo();
    this.time = moment().format('YYYY年MM月DD日');

    this.deviceService.getLastDeviceAlarmData().then((data) => {
      this.deviceAlarmData = data.device_alarm_data_list;
      this.deviceAlarmData.forEach((item) => {
        item.blueTime = moment(item.efairydevicefiredata_time).format('MM-DD');
        item.spanTime = moment(item.efairydevicefiredata_time).format('HH:mm');
        item.state=this.stateHash[item.efairydevicefiredata_state];
        item.ss=this.dataHash[item.efairydevicefiredata_parameter][0]
      })


    })

  }

}
