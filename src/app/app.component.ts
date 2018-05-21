import {Component, OnInit} from '@angular/core';
import {ConfigService} from './config.service';
import {Meta, Title} from '@angular/platform-browser';
import * as $ from 'jquery';
import {ConfigData} from './config-data';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {


  public config;
  public profile_data;
  public discord_data;
  public github_data;
  public linked_in_data;
  private get_config;

  constructor(private _configService: ConfigService, private _meta: Meta, private _title: Title) {

  }

  ngOnInit() {
    $('#requires_js_enabled').remove();
    this.getConfig();
  }


  setVariables(config: ConfigData.Base) {
    this.profile_data = config.profile;
    this.discord_data = config.discord;
    this.github_data = config.github;
    this.linked_in_data = config.linked_in;
    this.setMetaTags();
    this._title.setTitle(this.config.name);
  }


  getConfig() {
    this._configService.getDefaultConfig().subscribe(
      data => {
        this.config = data;
      },
      err => console.log(err),
      () => {
        this.setVariables(this.config);
      }
    );
  }

  // getDefaultConfig() {
  //   this._configService.getDefaultConfig().subscribe(
  //     data => {
  //       this.config = data;
  //     },
  //     err => console.log(err),
  //     () => {
  //       this.setVariables(this.config);
  //     }
  //   );
  // }
  //
  // getCustomConfig() {
  //   this._configService.getCustomConfig().subscribe(
  //     data => {
  //       this.config = data;
  //     },
  //     err => {
  //       this.getDefaultConfig();
  //       console.log(err);
  //     },
  //     () => {
  //       this.setVariables(this.config);
  //     }
  //   );
  // }


  setMetaTags() {
    this._meta.addTags([
      {property: 'og:title', content: this.config.name},
      {property: 'og:description', content: this.profile_data.tag_line},
      {property: 'og:image', content: this.profile_data.profile_pic_url},
      {property: 'og:url', content: `${window.location.hostname}${window.location.pathname}`}
    ]);
  }


}
