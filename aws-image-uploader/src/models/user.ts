export class UserInput {
  userName: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  constructor(userName: string, firstName: string, lastName: string, email: string, password: string) {
    this.userName = userName;
    this.firstName = firstName;
    this.lastName = lastName;
    this.email = email;
    this.password = password;
  }
}

export class User extends UserInput {
  PK: string;
  SK: string;
  constructor(PK: string, SK: string, userName: string, firstName: string, lastName: string, email: string, password: string) {
    super(userName, firstName, lastName, email, password);
    this.PK = PK;
    this.SK = SK;
  }
}
