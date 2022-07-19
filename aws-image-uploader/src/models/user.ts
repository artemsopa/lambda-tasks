export class User {
  PK: string;
  SK: string;
  email: string;
  password: string;
  constructor(PK: string, SK: string, email: string, password: string) {
    this.PK = PK;
    this.SK = SK;
    this.email = email;
    this.password = password;
  }
}

export class UserInput {
  email: string;
  password: string;
  constructor(email: string, password: string) {
    this.email = email;
    this.password = password;
  }
}
