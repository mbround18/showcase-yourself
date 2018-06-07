import {Component, Input, OnInit} from '@angular/core';
import {ConfigData} from '../config-data';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  @Input() name: string;
  @Input() profileData: ConfigData.Profile;
  showProfileImgLoading = true;

  constructor() {
  }

  ngOnInit() {
  }

}
