// import {Injectable} from '@angular/core';
//
// @Injectable()
export namespace ConfigData {


  export interface Profile {
    profile_pic_url: string;
    tag_line: string;
    actively_looking: boolean;
    looking_for: string[];
    skills: string[];
  }

  export interface Discord {
    active: boolean;
    username: string;
    url: string;
  }

  export interface Github {
    active: boolean;
    username: string;
    url: string;
  }

  export interface LinkedIn {
    active: boolean;
    username: string;
    url: string;
  }


  export interface Base {
    name: string;
    profile: Profile;
    discord: Discord;
    github: Github;
    linked_in: LinkedIn;
  }

}

