export class ContractEvent {
  name: string;
  url: string;
  symbol:string;
  countOfTokens: number;
  constructor(name, url, symbol, countOfTokens) {
    this.name = name;
    this.url = url;
    this.symbol = symbol;
    this.countOfTokens = countOfTokens;
  }
}
export class Response{
  status: number;
  message:string;
  hash: string
  constructor(status, message, hash?) {
    this.status = status;
    this.message = message;
    this.hash = hash;
  }
}
