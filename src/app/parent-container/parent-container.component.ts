import { Component, OnInit } from '@angular/core';
import { Router, CanActivate } from '@angular/router';
import { UserService } from '../service/user.service';
import * as myGlobals from '../global/globals';

declare var RongIMLib;

@Component({
  selector: 'app-parent-container',
  templateUrl: './parent-container.component.html',
  styleUrls: ['./parent-container.component.scss']
})

/**
 * interface rongYunMsg {
  content: string,
  extra: string,
  messageName: string
}
 */

export class ParentContainerComponent implements OnInit {

  public userInfo: any = {};

  private token = "83vM3rFNqrEO3ZaUKq3hVRoitPixpnp+mRIA8bQyzjRakYxf+CuXxJc3qM6DwOKZvtxC1bIqlWU=";

  // private appKey = "vnroth0kvdmso";  //dev
  private appKey = "m7ua80gbmpi3m"; //prod
  private instance: any;
  public allowVoice: string = '1';
  public alarmMsg: string;
  public alarmDevice: string;
  public alarmDeviceId: any;
  public msgList = [];
  public dataHash = myGlobals.dataHash;

  public voiceObj: any;

  private rongYunEvent: object = {
    getInstance: (_instance) => {
      this.instance = _instance;
    },
    receiveNewMessage: (message) => {
      // 判断消息类型
      console.log(message);
      if(message.content.extra.efairydevicemsg_alarm_id==1){
      this.msgList.unshift(message.content);
      this.alarmDevice = message.content.extra.efairydevice_name;
      this.alarmMsg = message.content.extra.efairydevicemsg_content;
      this.alarmDeviceId = message.content.extra.efairydevicemsg_from_id.split('_')[1];
      this.createAlarmVoice();
      }
    },
    getCurrentUser: (userInfo) => {
      console.log(userInfo)
    }
  }

  constructor(private userService: UserService, private router: Router, ) { }

  ngOnInit() {
    this.userInfo = this.userService.getAdminInfo();
    this.userService.getUserCenter().then((data) => {
      this.userInfo = Object.assign(this.userInfo, data);
    })
    this.rongYunSetup();
    this.initAlarmVoice();

    this.allowVoice = this.userService.getVoiceAllow()||'1';
    console.log(typeof this.userService.getVoiceAllow(), this.userService.getVoiceAllow())

  }
  waiting() {
    alert('敬请期待')
  }
  //data/0/agency/0/branch_warning/0/device/'+alarmDeviceId

  navToDeviceDetails(deviceId) {
    this.router.navigate(['/admin/data/0/agency/0/branch_warning/0/device/' + deviceId])
  }

  initAlarmVoice() {
    this.voiceObj = new Audio();
    this.voiceObj.src = "assets/alarm.mp3";
    this.voiceObj.load();
  }

  createAlarmVoice() {
    if (this.allowVoice == '1') {
      this.voiceObj.pause();
      this.voiceObj.play();
    }
  }

  toggleVoice() {
    if (this.allowVoice == '1') {
      this.allowVoice = '0';
    } else if (this.allowVoice == '0') {
      this.allowVoice = '1';
    } else {
      this.allowVoice = '0';
    }

    this.userService.setVoiceAllow(this.allowVoice);
  }

  logout() {
    this.userService.logOut();
    this.router.navigate(['/login']);
  }

  rongYunInit(params, callbacks, modules?) {
    var appKey = params.appKey;
    var token = params.token;
    var navi = params.navi || "";

    modules = modules || {};
    // var RongIMLib = modules.RongIMLib || window.RongIMLib;
    var RongIMClient = RongIMLib.RongIMClient;
    var protobuf = modules.protobuf || null;

    var config: any = {};

    //私有云切换navi导航，私有云格式 '120.92.10.214:8888'
    if (navi !== "") {
      config.navi = navi;
    }

    //私有云切换api,私有云格式 '172.20.210.38:81:8888'
    var api = params.api || "";
    if (api !== "") {
      config.api = api;
    }

    //support protobuf url + function
    if (protobuf != null) {
      config.protobuf = protobuf;
    };


    RongIMLib.RongIMClient.init(appKey, null, config);

    var instance = RongIMClient.getInstance();

    // 连接状态监听器
    RongIMClient.setConnectionStatusListener({
      onChanged: function (status) {
        // console.log(status);
        switch (status) {
          case RongIMLib.ConnectionStatus["CONNECTED"]:
          case 0:
            console.log("连接成功")
            callbacks.getInstance && callbacks.getInstance(instance);
            break;

          case RongIMLib.ConnectionStatus["CONNECTING"]:
          case 1:
            console.log("连接中")
            break;

          case RongIMLib.ConnectionStatus["DISCONNECTED"]:
          case 2:
            console.log("当前用户主动断开链接")
            break;

          case RongIMLib.ConnectionStatus["NETWORK_UNAVAILABLE"]:
          case 3:
            console.log("网络不可用")
            break;

          case RongIMLib.ConnectionStatus["CONNECTION_CLOSED"]:
          case 4:
            console.log("未知原因，连接关闭")
            break;

          case RongIMLib.ConnectionStatus["KICKED_OFFLINE_BY_OTHER_CLIENT"]:
          case 6:
            console.log("用户账户在其他设备登录，本机会被踢掉线")
            break;

          case RongIMLib.ConnectionStatus["DOMAIN_INCORRECT"]:
          case 12:
            console.log("当前运行域名错误，请检查安全域名配置")
            break;
        }
      }
    });
    RongIMClient.setOnReceiveMessageListener({
      // 接收到的消息
      onReceived: function (message) {
        // 判断消息类型
        console.log("新消息: " + message.targetId);
        console.log(message);
        callbacks.receiveNewMessage && callbacks.receiveNewMessage(message);
      }
    });

    //开始链接
    RongIMClient.connect(token, {
      onSuccess: function (userId) {
        callbacks.getCurrentUser && callbacks.getCurrentUser({ userId: userId });
        console.log("链接成功，用户id：" + userId);
      },
      onTokenIncorrect: function () {
        console.log('token无效');
      },
      onError: function (errorCode) {
        console.log(errorCode);
      }
    });
  }


  rongYunSetup() {
    this.token = this.userService.getRyToken();
    this.appKey = this.userService.getRyKey();
    this.rongYunInit({
      appKey: this.appKey,
      token: this.token
    }, this.rongYunEvent)
  }




}
