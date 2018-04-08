import {Component, OnInit} from '@angular/core';
import {ConfigService} from './config.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  isConfigLoaded = false;

  public config;
  public profile_data;
  public github_data;
  public linkedin_data;

  constructor(private _configService: ConfigService) {

  }

  ngOnInit() {
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
        this.github_data = this.config.github;
        this.linkedin_data = this.config.linked_in;
      }
    );
  }
}
