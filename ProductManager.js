const fs = require('fs');

class ProductManager {
  constructor(path) {
    this.path = path;
    this.products = [];
    this.lastProductId = 0;

    if (fs.existsSync(this.path)) {
      const data = fs.readFileSync(this.path);
      if (data) {
        this.products = JSON.parse(data);
        this.lastProductId = this.products[this.products.length - 1].id;
      }
    }
  }

  _saveProducts() {
    fs.writeFileSync(this.path, JSON.stringify(this.products));
  }

  addProduct(product) {
    // Validar que todos los campos sean obligatorios
    if (!product.title || !product.description || !product.price || !product.thumbnail || !product.code || !product.stock) {
      console.log("Error: Todos los campos son obligatorios");
      return;
    }

    // Validar que el campo "code" no se repita
    if (this.products.some(p => p.code === product.code)) {
      console.log("Error: El código del producto ya existe");
      return;
    }

    const newProduct = {
      id: ++this.lastProductId,
      title: product.title,
      description: product.description,
      price: product.price,
      thumbnail: product.thumbnail,
      code: product.code,
      stock: product.stock
    };

    this.products.push(newProduct);
    this._saveProducts();
  }

  getProducts() {
    return this.products;
  }

  getProductById(id) {
    const product = this.products.find(p => p.id === id);

    if (product) {
      return product;
    } else {
      console.log("Error: Producto no encontrado");
    }
  }

  updateProduct(id, productData) {
    const productIndex = this.products.findIndex(p => p.id === id);

    if (productIndex === -1) {
      console.log("Error: Producto no encontrado");
      return;
    }

    this.products[productIndex] = {
      ...this.products[productIndex],
      ...productData,
      id // asegurarse de que no se cambie el id
    };

    this._saveProducts();
  }

  deleteProduct(id) {
    const productIndex = this.products.findIndex(p => p.id === id);

    if (productIndex === -1) {
      console.log("Error: Producto no encontrado");
      return;
    }

    this.products.splice(productIndex, 1);
    this._saveProducts();
  }
}

// Ejemplo de uso:
const manager = new ProductManager('./products.json');
manager.addProduct({
  title: "Camiseta",
  description: "Camiseta de algodón",
  price: 19.99,
  thumbnail: "/path/to/thumbnail1.jpg",
  code: "123",
  stock: 10
});
manager.addProduct({
  title: "Pantalón",
  description: "Pantalón vaquero",
  price: 29.99,
  thumbnail: "/path/to/thumbnail2.jpg",
  code: "456",
  stock: 5
});
manager.addProduct({
  title: "Zapatos",
  description: "Zapatos de cuero",
  price: 59.99,
  thumbnail: "/path/to/thumbnail3.jpg",
  code: "789",
  stock: 3
});

const products = manager.getProducts();
console.log(products);

const productById = manager.getProductById(2);
console.log(productById);

manager.updateProduct(2, { price: 39.99 });
console.log(manager.getProductById(2));

manager.deleteProduct(1);
console.log
