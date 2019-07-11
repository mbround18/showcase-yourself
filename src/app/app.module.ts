import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { LinksComponent } from './links/links.component';
import { ProfileComponent } from './profile/profile.component';
import { ConfigService } from './config.service';
import { HttpClientModule } from '@angular/common/http';
import { MatomoModule } from 'ngx-matomo';
import { LinkComponent } from './links/link/link.component';
import { ContactComponent } from './contact/contact.component';

@NgModule({
  declarations: [AppComponent, LinksComponent, ProfileComponent, LinkComponent, ContactComponent],
  imports: [BrowserModule, HttpClientModule, MatomoModule],
  providers: [ConfigService],
  bootstrap: [AppComponent]
})
export class AppModule {}
