import { Component, OnInit, Input } from '@angular/core';
import { ConfigData } from '../../config-data';
import { supportedIcons } from '../../utils/constants';

@Component({
  selector: 'app-link',
  templateUrl: './link.component.html',
  styleUrls: ['./link.component.scss']
})
export class LinkComponent implements OnInit {
  @Input() linkData: ConfigData.LinkData;
  public iconName: string;

  constructor() {}

  ngOnInit() {
    console.log(this.linkData.logo);
    if (this.linkData.logo) {
      this.iconName = supportedIcons.includes(this.linkData.logo)
        ? this.linkData.logo
        : 'Generic';
    } else {
      this.iconName = 'Generic';
    }
  }

  setToGeneric() {
    this.iconName = 'Generic';
  }
}
