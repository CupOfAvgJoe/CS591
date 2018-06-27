export class Recommendation {
  public name: string;
  public address: string[];
  public category: string;
  public Uber_estimates: string[];
  public Lyft_estimates: string[];

  constructor(name, address, category, Uber_estimates, Lyft_estimates) {
    this.name = name;
    this.address = address;
    this.category = category;
    this.Uber_estimates = Uber_estimates;
    this.Lyft_estimates = Lyft_estimates;
  }
}
