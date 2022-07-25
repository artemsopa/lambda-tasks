export class CognitoConfigs {
  userPoolId: string;
  userClientId: string;
  constructor(userPoolId: string, userClientId: string) {
    this.userPoolId = userPoolId;
    this.userClientId = userClientId;
  }
}

export class AuthConfigs {
  cognito: CognitoConfigs;
  passwordSalt: number;
  constructor(cognito: CognitoConfigs, passwordSalt: number) {
    this.cognito = cognito;
    this.passwordSalt = passwordSalt;
  }
}

export class S3Configs {
  bucketName: string;
  constructor(bucketName: string) {
    this.bucketName = bucketName;
  }
}

export class DynamoDBConfigs {
  tableName: string;
  constructor(tableName: string) {
    this.tableName = tableName;
  }
}

export class Configs {
  auth: AuthConfigs;
  s3: S3Configs;
  dynamodb: DynamoDBConfigs;
  constructor(auth: AuthConfigs, s3: S3Configs, dynamodb: DynamoDBConfigs) {
    this.auth = auth;
    this.s3 = s3;
    this.dynamodb = dynamodb;
  }
}
