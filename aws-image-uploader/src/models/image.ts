export class Image {
  title: string;
  url: string;
  size: number;
  constructor(title: string, url: string, size: number) {
    this.title = title;
    this.url = url;
    this.size = size;
  }
}

export class ImageItem extends Image {
  PK: string;
  SK: string;
  constructor(PK: string, SK: string, title: string, url: string, size: number) {
    super(title, url, size);
    this.PK = PK;
    this.SK = SK;
  }
}
