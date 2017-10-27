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
      zoom: 11,
      center: [116.397428, 39.90923]
    });
    map.setMapStyle('amap://styles/'+'darkblue');
  }

}
