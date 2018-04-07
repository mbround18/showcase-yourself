import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';


import { AppComponent } from './app.component';
import { LinksComponent } from './links/links.component';
import { LinkComponent } from './links/link/link.component';
import { GithubComponent } from './github/github.component';
import { ReposComponent } from './github/repos/repos.component';


@NgModule({
  declarations: [
    AppComponent,
    LinksComponent,
    LinkComponent,
    GithubComponent,
    ReposComponent
  ],
  imports: [
    BrowserModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
