import { Component, OnInit } from '@angular/core';
import { Search } from '../search';
import { ApiService } from './api.service';

import {Recommendation} from '../recommendations';

@Component({
  selector: 'app-search-form',
  templateUrl: './search-form.component.html',
  styleUrls: ['./search-form.component.css']
})

export class SearchFormComponent implements OnInit {

  search: Search;

  message: string;

  recommendations: Recommendation[];

  themes = ['topPicks', 'trending', 'food', 'drinks', 'coffee', 'shops', 'arts',
    'outdoors', 'sights'];

  openNowOptions = ['0', '1'];

  getRecommendations(form) :void{
    let star = new Search(form.street, form.city, form.state, form.postalcode, form.theme, form.openNow);
    this.message = `Searching for ${star.theme} near ${star.street} ${star.city}, ${star.state}, ${star.postalcode}`;
    this.apiService.getRecommendations(star)
      .subscribe(
        (response: Recommendation[]) => {
          this.recommendations = response;
        },
        (err) => console.log(`Error: ${err}`),
        () => console.log(`Completed Request`)
      );
  }

  constructor(private apiService: ApiService) {
    this.message = '';
    this.search = new Search ('', '', '', '', '', '');

  }

  ngOnInit() {

  }

}
