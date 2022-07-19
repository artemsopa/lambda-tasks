export class Image {
  PK: string;
  SK: string;
  title: string;
  url: string;
  size: string;
  type: string;
  constructor(PK: string, SK: string, title: string, url: string, size: string, type: string) {
    this.PK = PK;
    this.SK = SK;
    this.title = title;
    this.url = url;
    this.size = size;
    this.type = type;
  }
}

export class ImageInput {
  title: string;
  url: string;
  size: string;
  type: string;
  constructor(title: string, url: string, size: string, type: string) {
    this.title = title;
    this.url = url;
    this.size = size;
    this.type = type;
  }
}
