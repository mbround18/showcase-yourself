import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';


import {AppComponent} from './app.component';
import {LinksComponent} from './links/links.component';
import {GithubComponent} from './github/github.component';
import {ReposComponent} from './github/repos/repos.component';
import {ProfileComponent} from './profile/profile.component';
import {ConfigService} from './config.service';
import {HttpClientModule} from '@angular/common/http';


@NgModule({
  declarations: [
    AppComponent,
    LinksComponent,
    GithubComponent,
    ReposComponent,
    ProfileComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule
  ],
  providers: [
    ConfigService
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
