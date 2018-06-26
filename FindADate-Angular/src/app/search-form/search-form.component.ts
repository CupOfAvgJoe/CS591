import { Component, OnInit } from '@angular/core';
import { Search } from '../search';
import { ApiService } from './api.service';

@Component({
  selector: 'app-search-form',
  templateUrl: './search-form.component.html',
  styleUrls: ['./search-form.component.css']
})

export class SearchFormComponent implements OnInit {

  search: Search;

  message: string;

  recommendations: any;

  themes = ['food', 'drinks', 'coffee', 'shops', 'arts',
    'outdoors', 'sights', 'trending', 'topPicks'];

  openNowOptions = ['0', '1'];

  getRecommendations(form) :void{
    console.log(form);
    let star = new Search(form);
    this.message = `Searching for ${star.city}`;
    this.apiService.getRecommendations(star)
      .subscribe(
        (response) => this.recommendations = response,
        (err) => console.log(`Error: ${err}`),
        () => console.log(`Completed Request`)
      );
  }

  constructor(private apiService: ApiService) {
    this.message = '';
    this.search = new Search ({street: '', city: '', state: '', postalcode: '', theme: '', openNow: ''});

  }

  ngOnInit() {

  }
}
