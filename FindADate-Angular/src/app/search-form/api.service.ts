import { Injectable } from '@angular/core';
import {Search} from '../search';
import {HttpClient, HttpErrorResponse, HttpHeaders} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  API_URL = 'http://localhost:3000/recommendations';

  public getRecommendations(form) :any{
    let searchq = new Search(form);

    const headers = new HttpHeaders({ 'Content-Type': 'application/x-www-form-urlencoded' });

    return this.http
      .post(`${this.API_URL}`, searchq, {headers: headers, responseType: 'json'})
  }

  constructor(
    private http: HttpClient
  ) { }
}
