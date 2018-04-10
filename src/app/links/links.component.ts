import {Component, Input, OnInit} from '@angular/core';
import {ConfigData} from '../config-data';

@Component({
  selector: 'app-links',
  templateUrl: './links.component.html',
  styleUrls: ['./links.component.css']
})
export class LinksComponent implements OnInit {
  @Input() discord_data: ConfigData.Discord;
  @Input() linked_in_data: ConfigData.LinkedIn;
  @Input() github_data: ConfigData.Github;


  constructor() { }

  ngOnInit() {
  }

}
