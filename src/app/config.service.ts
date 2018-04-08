import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs/Observable';
import {ConfigData} from './config-data';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';

const httpOptions = {
  headers: new HttpHeaders({'Content-Type': 'application/json'})
};

@Injectable()
export class ConfigService {

  constructor(private http: HttpClient) {
  }

  // Uses http.get() to load data from a single API endpoint
  getConfig(): Observable<ConfigData.Base> {
    return this.http.get('/config.json').map(res => res as ConfigData.Base);
  }

}
