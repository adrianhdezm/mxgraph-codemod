class mxRectangle {
  static counter = 0;

  constructor(width, height) {
    this.width = width;
    this.height = height;
  }

  calcArea() {
    return this.height * this.width;
  }

  calcPerimeter() {
    return 2 * (this.height + this.width);
  }

  static fromRectangle(width, height) {
    return new mxRectangle(width, height);
  }
}
