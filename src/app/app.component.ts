import { Component, OnInit } from '@angular/core';
import { ConfigService } from './config.service';
import { Meta, Title } from '@angular/platform-browser';
import * as $ from 'jquery';
import { ConfigData } from './config-data';
import { MatomoInjector } from 'ngx-matomo';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  public config: ConfigData.Base;
  public profileData: ConfigData.Profile;
  public links: ConfigData.LinkData[];

  constructor(
    private _configService: ConfigService,
    private _meta: Meta,
    private _title: Title,
    private matomoInjector: MatomoInjector
  ) {
    this.matomoInjector.init('//matomo.boop.ninja/', 4);
  }

  ngOnInit() {
    $('#requires_js_enabled').remove();
    this.getConfig();
  }

  setVariables(config: ConfigData.Base) {
    this.profileData = config.profile;
    this.links = config.links;
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

  setMetaTags() {
    this._meta.addTags([
      { property: 'og:title', content: this.config.name },
      { property: 'og:description', content: this.profileData.tag_line },
      { property: 'og:image', content: this.profileData.profile_pic_url },
      {
        property: 'og:url',
        content: `${window.location.hostname}${window.location.pathname}`
      }
    ]);
  }
}
