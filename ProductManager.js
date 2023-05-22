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

// Tests
const manager = new ProductManager('products.json');

// Test 1
console.log("Test 1:");
console.log(manager.getProducts()); // []

// Test 2
console.log("Test 2:");
manager.addProduct("producto prueba", "Este es un producto prueba", 200, "Sin imagen", "abc123", 25);

// Test 3
console.log("Test 3:");
console.log(manager.getProducts()); // [{ id: 1, title: 'producto prueba', description: 'Este es un producto prueba', price: 200, thumbnail: 'Sin imagen', code: 'abc123', stock: 25 }]

// Test 4
console.log("Test 4:");
const productById = manager.getProductById(1);
console.log(productById); // { id: 1, title: 'producto prueba', description: 'Este es un producto prueba', price: 200, thumbnail: 'Sin imagen', code: 'abc123', stock: 25 }

// Test 5
console.log("Test 5:");
const nonExistentProduct = manager.getProductById(5); // Producto no encontrado, muestra un error en la consola

// Test 6
console.log("Test 6:");
manager.updateProduct(1, { price: 250, stock: 20 });
console.log(manager.getProducts()); // [{ id: 1, title: 'producto prueba', description: 'Este es un producto prueba', price: 250, thumbnail: 'Sin imagen', code: 'abc123', stock: 20 }]

// Test 7
console.log("Test 7:");
manager.deleteProduct(1);
console.log(manager.getProducts()); // []