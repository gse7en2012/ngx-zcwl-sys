import { Component, OnInit } from '@angular/core';

declare var AMap;

@Component({
  selector: 'app-dashboard-page',
  templateUrl: './dashboard-page.component.html',
  styleUrls: ['./dashboard-page.component.scss']
})
export class DashboardPageComponent implements OnInit {

  constructor() { }

  ngOnInit() {
    const map = new AMap.Map('gmap', {
      resizeEnable: true,
      zoom: 12,
      center: [113.949229, 22.772876]
    });
    map.setMapStyle('amap://styles/' + 'darkblue');

    const maker1=new AMap.Marker({
      map: map,
      position: [113.949229, 22.772876],
      icon: new AMap.Icon({
        size: new AMap.Size(40, 50),  //图标大小
        image: "http://webapi.amap.com/theme/v1.3/images/newpc/way_btn2.png",
        imageOffset: new AMap.Pixel(0, -60)
      })
    });
    maker1.setLabel({//label默认蓝框白底左上角显示，样式className为：amap-marker-label
      offset: new AMap.Pixel(20, 20),//修改label相对于maker的位置
      content: "我是marker的label标签"
  });
  }

}
