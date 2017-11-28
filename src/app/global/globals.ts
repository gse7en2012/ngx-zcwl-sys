'use strict';



const createHash=()=>{
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

  export const dataHash = {
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
    11: ['过流', 0.1, 'A'],
    12: ['流量', 0.1, 'L/s'],
    13: ['风量', 0.1, 'm3/min'],
    14: ['风速', 0.1, 'm/s'],
    15: ['漏电', 0.1, 'mA'],
    16: ['烟参量', 0.1, ''],
    128: ['输入检测', 1, ''],
    129: ['输出控制', 1, '']
}

export const stateHash=createHash();


export const deviceTypeHash={
  1:'DDH5116控制器（带回路号）',
  2:'DDH5118控制器（带回路号）',
  7:'4通道测温式探测器',
  8:'智慧安全用电监控探测器（DDH5268Z）',
  9:'12通道组合探测器（DDH5268S）',
  10:'2通道组合探测器（DDH5205）',
  11:'1通道组合探测器（DDH5201S）',
  12:'3通道组合探测器（DDH5206）',
  13:'8通道组合探测器（DDH5266）',
  14:'16通道组合探测器（DDH5268W）'
}