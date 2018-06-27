export class Search {

  public street: string;
  public city: string;
  public state: string;
  public postalcode: string;
  public theme: string;
  public openNow: string;

  constructor(street, city, state, postalcode, theme, openNow) {
    this.street = street;
    this.city = city;
    this.state = state;
    this.postalcode = postalcode;
    this.theme = theme;
    this.openNow = openNow;

  }

}
