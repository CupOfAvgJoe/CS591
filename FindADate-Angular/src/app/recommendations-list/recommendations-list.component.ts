import { Component, OnInit, Input } from '@angular/core';
import {Recommendation} from '../recommendations';

@Component({
  selector: 'app-recommendations-list',
  templateUrl: './recommendations-list.component.html',
  styleUrls: ['./recommendations-list.component.css']
})
export class RecommendationsListComponent implements OnInit {

  @Input() recommendations: Recommendation[];

  constructor() { }

  ngOnInit() {
  }

}
