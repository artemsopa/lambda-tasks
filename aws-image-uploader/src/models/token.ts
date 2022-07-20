export class Token {
  token: string;
  constructor(token: string) {
    this.token = token;
  }
}

export interface JwtPlaceholder {
    PK: string;
}
