class mxRectangle extends mxPoint {
  constructor(x, y, width, height) {
    super(x, y);
    this.width = width;
    this.height = height;
  }

  getCoordinates() {
    // The method in the parent class is called
    if (this.x && this.y) {
      super.getCoordinates();
    }
  }

  setCoordinates(x, y) {
    // The method in the parent class is called
    super.setCoordinates(x, y);
  }

  calcArea() {
    return this.height * this.width;
  }

  calcPerimeter() {
    return 2 * (this.height + this.width);
  }
}
