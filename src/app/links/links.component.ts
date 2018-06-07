import {Component, Input, OnInit} from '@angular/core';
import {ConfigData} from '../config-data';

@Component({
  selector: 'app-links',
  templateUrl: './links.component.html',
  styleUrls: ['./links.component.css']
})
export class LinksComponent implements OnInit {
  @Input() discordData: ConfigData.Discord;
  @Input() linkedInData: ConfigData.LinkedIn;
  @Input() githubData: ConfigData.Github;


  constructor() { }

  ngOnInit() {
  }

}
