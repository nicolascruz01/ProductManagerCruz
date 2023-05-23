const exp = require('constants');
const fs = require('fs');

class ProductManager {
  constructor(path) {
    this.path = path;
    this.products = [];
    this.lastProductId = 0;
  }

  addProduct(title, description, price, thumbnail, code, stock) {
    // Validar que todos los campos sean obligatorios
    if (!title || !description || !price || !thumbnail || !code || !stock) {
      console.log("Error: Todos los campos son obligatorios");
      return;
    }

    // Validar que el campo "code" no se repita
    if (this.products.some(product => product.code === code)) {
      console.log("Error: El código del producto ya existe");
      return;
    }

    const newProduct = {
      id: ++this.lastProductId,
      title,
      description,
      price,
      thumbnail,
      code,
      stock
    };

    this.products.push(newProduct);
    this.saveProducts();
  }

  getProducts() {
    this.loadProducts();
    return this.products;
  }

  getProductById(id) {
    this.loadProducts();
    const product = this.products.find(product => product.id === id);

    if (product) {
      return product;
    } else {
      console.log("Error: Producto no encontrado");
    }
  }

  updateProduct(id, updatedFields) {
    this.loadProducts();
    const productIndex = this.products.findIndex(product => product.id === id);

    if (productIndex !== -1) {
      this.products[productIndex] = { ...this.products[productIndex], ...updatedFields };
      this.saveProducts();
    } else {
      console.log("Error: Producto no encontrado");
    }
  }

  deleteProduct(id) {
    this.loadProducts();
    const productIndex = this.products.findIndex(product => product.id === id);

    if (productIndex !== -1) {
      this.products.splice(productIndex, 1);
      this.saveProducts();
    } else {
      console.log("Error: Producto no encontrado");
    }
  }

  loadProducts() {
    try {
      const data = fs.readFileSync(this.path, 'utf8');
      this.products = JSON.parse(data);
    } catch (error) {
      this.products = [];
    }
  }

  saveProducts() {
    fs.writeFileSync(this.path, JSON.stringify(this.products));
  }
}

module.exports = ProductManager;

