export class Recommendation {
  public name: string;
  public location: any;
  public category: string;
  public Uber_estimates: any[];
  public Lyft_estimates: any[];

  constructor(name, location, category, Uber_estimates, Lyft_estimates) {
    this.name = name;
    this.location = location;
    this.category = category;
    this.Uber_estimates = Uber_estimates;
    this.Lyft_estimates = Lyft_estimates;
  }
}
