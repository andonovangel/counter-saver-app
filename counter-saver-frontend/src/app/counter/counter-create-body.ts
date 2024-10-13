export class CounterCreateBody {
  clicks: number;

  constructor(params: CounterCreateBody) {
    this.clicks = params.clicks;
  }
}
