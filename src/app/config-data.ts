// import {Injectable} from '@angular/core';
//
// @Injectable()
export namespace ConfigData {


  export interface Profile {
    profile_pic_url: string;
    tag_line: string;
  }


  export interface LinkedIn {
    username: string;
    url: string;
  }


  export interface Github {
    username: string;
    url: string;
  }


  export interface Base {
    name: string;
    profile: Profile;
    linked_in: LinkedIn;
    github: Github;
  }

}

