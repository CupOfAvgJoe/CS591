import { Injectable } from '@angular/core';
import {Search} from '../search';
import {HttpClient, HttpErrorResponse, HttpHeaders, HttpParams} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  API_URL = 'http://localhost:3000/recommendations';

  public getRecommendations(form) :any{
    const body = new HttpParams()
      .set('street', form.street)
      .set('city', form.city)
      .set('state', form.state)
      .set('postalcode', form.postalcode)
      .set('theme', form.theme)
      .set('openNow', form.openNow);

    const headers = new HttpHeaders({ 'Content-Type': 'application/x-www-form-urlencoded', 'Access-Control-Allow-Origin': '*'});

    return this.http
      .post(`${this.API_URL}`, body, {headers: headers, responseType: 'json'})
  }

  constructor(
    private http: HttpClient
  ) { }
}
