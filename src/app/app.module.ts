import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { LinksComponent } from './links/links.component';
import { ProfileComponent } from './profile/profile.component';
import { ConfigService } from './config.service';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  declarations: [AppComponent, LinksComponent, ProfileComponent],
  imports: [BrowserModule, HttpClientModule],
  providers: [ConfigService],
  bootstrap: [AppComponent]
})
export class AppModule {}
