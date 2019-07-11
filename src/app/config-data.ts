export namespace ConfigData {
  export interface Profile {
    profile_pic_url: string;
    tag_line: string;
    actively_looking: boolean;
    looking_for: string[];
    skills: string[];
  }

  export interface LinkData {
    active: boolean;
    username: string;
    url: string;
    logo?: string;
  }

  export interface Base {
    name: string;
    profile: Profile;
    links: LinkData[];
  }
}
