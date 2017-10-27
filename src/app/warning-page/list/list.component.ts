import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { ProjectService } from '../../service/project.service';
import { DeviceService } from '../../service/device.service';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss'],
  providers: [DeviceService]
})
export class ListComponent implements OnInit {

  public alarmList = [];
  public alarmListPageShow = [];
  public alarmListSearch = [];
  public total: number = 0;
  public loading: boolean = true;

  public pageSize: number = 15;
  public page: number = 1;
  public jumpPage: number = 1;
  public pageMax: number = 1;
  public projectId: string;
  public keyword;

  public project: any={
    efairyproject_name:''
  };
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
  public stateHashList=this.createHash();



  constructor(private deviceService: DeviceService, private route: ActivatedRoute, private router: Router, private projectService: ProjectService) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      if (params && params.branch_id) {
        this.projectId = params.branch_id;
        this.getData();

        // this.project = this.userService.getProjectById(this.projectId);


      }
    });
  }

  createHash(){
    let hashArray=new Array(255);
    hashArray[0]='预留'; 
    hashArray[1]='正常';
    hashArray[2]='火警';
    hashArray[3]='启动';
    hashArray[4]='动作';
    hashArray[5]='监管';
    hashArray[6]='故障';
    hashArray[7]='自检';
    hashArray[21]='通讯故障';
    hashArray[22]='主电故障';
    hashArray[23]='备电故障';
    hashArray[24]='线路故障';
    hashArray[40]='故障恢复';
    hashArray[41]='通讯故障恢复';
    hashArray[42]='主电故障恢复';
    hashArray[43]='备电故障恢复';
    hashArray[44]='线路故障恢复';
    hashArray[70]='停止'; 
    hashArray[71]='屏蔽';
    hashArray[72]='屏蔽撤销';
    hashArray[73]='开机';
    hashArray[74]='关机';
    hashArray[75]='复位';
    hashArray[76]='手动状态';
    hashArray[77]='自动状态';
    hashArray[78]='确认/消音';
    hashArray[128]='主电欠压故障';
    hashArray[129]='主电欠压恢复';
    hashArray[130]='备电欠压故障';
    hashArray[131]='备电欠压恢复';
    hashArray[132]='温度传感器短路'; 
    hashArray[133]='温度传感器短路恢复';
    hashArray[134]='温度传感器开路';
    hashArray[135]='温度传感器开路恢复';
    hashArray[136]='电流互感器短路';
    hashArray[137]='电流互感器短路恢复';
    hashArray[138]='电流互感器开路';
    hashArray[139]='电流互感器开路恢复';
    hashArray[140]='漏电预警';
    hashArray[141]='温度预警';
    hashArray[142]='过流预警';
    hashArray[143]='漏电报警';
    hashArray[144]='温度报警';
    hashArray[145]='过流报警';
    hashArray[146]='电源短路故障';
    hashArray[147]='电源短路故障恢复';
    hashArray[148]='回路短路';
    hashArray[149]='回路短路恢复';
    hashArray[150]='回路通信故障';
    hashArray[151]='回路通信故障恢复';
    hashArray[152]='输出线故障';
    hashArray[153]='输出线故障恢复';
    hashArray[154]='输入线故障';
    hashArray[155]='输入线故障恢复';
    hashArray[156]='模块电源故障';
    hashArray[157]='模块电源故障恢复';
    hashArray[158]='新设备注册';
    hashArray[159]='打印机故障';
    hashArray[160]='打印机故障恢复';
    hashArray[161]='打印机缺纸';
    hashArray[162]='打印机缺纸恢复';
    hashArray[163]='系统故障';
    hashArray[164]='系统故障恢复';
    hashArray[165]='反馈';
    hashArray[166]='停止反馈';   
    return hashArray;         
  }

  getData() {
    this.projectService.getProjectAlarmData(this.projectId).then((data) => {
      this.alarmList = data.project_alarm_data_list;
      this.total = data.total_rows;
      this.loading = false;
      this.alarmList.forEach((item)=>{
        item.label=this.dataHash[item.efairydevice_alarm_pt][0];
        item.state=this.stateHashList[item.efairydevice_detail_state];
        item.efairydevice_alarm_rtv=(item.efairydevice_alarm_rtv*this.dataHash[item.efairydevice_alarm_pt][1]).toFixed(2)+this.dataHash[item.efairydevice_alarm_pt][2]
        item.efairydevice_alarm_thv=(item.efairydevice_alarm_thv*this.dataHash[item.efairydevice_alarm_pt][1]).toFixed(2)+this.dataHash[item.efairydevice_alarm_pt][2]
      })

      this.pageMax = Math.ceil(this.total / this.pageSize)
      this.renderData();
    })
  }

  renderData() {
    this.alarmListPageShow = this.alarmList.slice((this.page - 1) * this.pageSize, this.page * this.pageSize);
  }

  prevPage() {
    if (this.page <= 1) return false;
    this.page--;
    this.renderData();
  }

  nextPage() {
    if (this.page >= this.pageMax) return false;
    this.page++;
    this.renderData();
  }

  changePage() {
    this.page = this.jumpPage;
    this.renderData();
  }
 

  search() {
    if (this.keyword !== '') {
      this.alarmListSearch = [];
      this.alarmList.forEach((item) => {
        if (item.efairydevice_name.indexOf(this.keyword) !== -1 || item.efairydevice_id.toString().indexOf(this.keyword) !== -1)
          this.alarmListSearch.push(item);
      })
      this.alarmListPageShow = this.alarmListSearch;
    }else{
      this.renderData();
    }
  }
}
