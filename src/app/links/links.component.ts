import { Component, Input, OnInit } from '@angular/core';
import { ConfigData } from '../config-data';

@Component({
  selector: 'app-links',
  templateUrl: './links.component.html',
  styleUrls: ['./links.component.scss']
})
export class LinksComponent implements OnInit {
  @Input() links: ConfigData.LinkData[];

  constructor() {}

  ngOnInit() {}
}
