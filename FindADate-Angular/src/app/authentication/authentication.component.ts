import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-authentication',
  templateUrl: './authentication.component.html',
  styleUrls: ['./authentication.component.css']
})
export class AuthenticationComponent implements OnInit {

  title = "Find-A-Date";

  authenticateTwitter(){
    return this.http.get("http://localhost:3000/auth/twitter");
  }

  constructor(private http: HttpClient) { }

  ngOnInit() {
  }

}
