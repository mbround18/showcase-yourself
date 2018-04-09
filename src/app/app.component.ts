import {Component, OnInit} from '@angular/core';
import {ConfigService} from './config.service';
import {Meta} from '@angular/platform-browser';
import * as $ from 'jquery';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  isConfigLoaded = false;

  public config;
  public profile_data;
  public discord_data;
  public github_data;
  public linkedin_data;

  constructor(private _configService: ConfigService, private _meta: Meta) {

  }

  ngOnInit() {
    $('#requires_js_enabled').remove();
    this.getConfig();
  }

  getConfig() {
    this._configService.getConfig().subscribe(
      data => {
        this.config = data;
      },
      err => console.error(err),
      () => {
        this.isConfigLoaded = true;
        this.profile_data = this.config.profile;
        this.discord_data = this.config.discord;
        this.github_data = this.config.github;
        this.linkedin_data = this.config.linked_in;
        this.setMetaTags();
      }
    );
  }

  setMetaTags() {
    this._meta.addTags([
      {property: 'og:title', content: this.config.name},
      {property: 'og:description', content: this.profile_data.tag_line},
      {property: 'og:image', content: this.profile_data.profile_pic_url},
      {property: 'og:url', content: `${window.location.hostname}${window.location.pathname}`}
    ]);
  }
}
