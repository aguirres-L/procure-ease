import React, { useState, useEffect } from "react";
import { Button, View, Text, TextInput, FlatList } from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Provider({ isProvider, setIsProvider, idProvider ,setIdProvider}) {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [newProduct, setNewProduct] = useState({ name: '', stock: 0 });

  console.log(idProvider,'idProvider de Provide.jsx');

  console.log(products,'products');

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const productsFromStorage = await AsyncStorage.getItem('products');
        if (productsFromStorage) {
          const parsedProducts = JSON.parse(productsFromStorage);
          // Filtrar los productos para mostrar solo los del proveedor actual
          const filteredProducts = parsedProducts.filter(product => product.providerId === idProvider);
          setProducts(filteredProducts);
        }
      } catch (error) {
        console.error('Error al recuperar productos de AsyncStorage:', error);
      }
    };

    fetchProducts();
  }, [idProvider]);

  const addProduct = () => {
    // Validar que se haya ingresado un nombre y una cantidad válida
    if (newProduct.name.trim() !== '' && newProduct.stock >= 0) {
      // Crear un nuevo objeto de producto con los detalles proporcionados
      const productToAdd = {
        id: Date.now().toString(),
        providerId: idProvider, // Agregar el id del proveedor al producto
        name: newProduct.name,
        stock: newProduct.stock,
        lastOrder: new Date().toLocaleDateString(),
        quantity: 0,
      };

      // Agregar el nuevo producto a la lista de productos
      const updatedProducts = [...products, productToAdd];
      setProducts(updatedProducts);

      // Limpiar el formulario
      setNewProduct({ name: '', stock: 0 });

      // Guardar los productos en AsyncStorage
      try {
        AsyncStorage.setItem('products', JSON.stringify(updatedProducts));
      } catch (error) {
        console.error('Error al guardar los productos en AsyncStorage:', error);
      }
    }
  };

  const updateQuantity = (productId, newQuantity) => {
    const updatedProducts = products.map((product) =>
      product.id === productId ? { ...product, quantity: newQuantity } : product
    );
    setProducts(updatedProducts);

    // Actualizar los productos en AsyncStorage
    try {
      AsyncStorage.setItem('products', JSON.stringify(updatedProducts));
    } catch (error) {
      console.error('Error al guardar los productos en AsyncStorage:', error);
    }
  };

  const deleteProduct = (productId) => {
    // Filtrar la lista de productos para eliminar el producto con el ID proporcionado
    const updatedProducts = products.filter((product) => product.id !== productId);
    setProducts(updatedProducts);

    // Actualizar los productos en AsyncStorage
    try {
      AsyncStorage.setItem('products', JSON.stringify(updatedProducts));
    } catch (error) {
      console.error('Error al guardar los productos en AsyncStorage:', error);
    }
  };

  const filteredProducts = products.filter((product) =>
    product.providerId === idProvider &&
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <View style={{ padding: 16 }}>
      <Text>{isProvider}</Text>
      <Text>Agregar Producto:</Text>
      <TextInput
        placeholder="Nombre del producto"
        value={newProduct.name}
        onChangeText={(text) => setNewProduct({ ...newProduct, name: text })}
        style={{ borderWidth: 1, borderColor: 'gray', padding: 8, marginBottom: 8 }}
      />
      <TextInput
        placeholder="Cantidad en stock"
        value={newProduct.stock.toString()}
        onChangeText={(text) => {
          // Validar si el texto es un número antes de actualizar la cantidad
          if (/^\d+$/.test(text)) {
            setNewProduct({ ...newProduct, stock: parseInt(text) });
          }
        }}
        keyboardType="numeric"
        style={{ borderWidth: 1, borderColor: 'gray', padding: 8, marginBottom: 8 }}
      />
      <Button title="Agregar Producto" onPress={addProduct} />
      <TextInput
        style={{ borderWidth: 1, borderColor: 'gray', padding: 8, marginBottom: 16 }}
        placeholder="Buscar productos"
        value={searchTerm}
        onChangeText={(text) => setSearchTerm(text)}
      />
      <FlatList
        style={{ height: 400 }}
        data={filteredProducts}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={{ flexDirection: "column", alignItems: "center", marginBottom: 8 }}>
            <Text style={{ flex: 1 }}>Producto: {item.name}</Text>
            <Text>Stock: {item.stock}</Text>
            <Text>Último pedido: {item.lastOrder}</Text>
            <View style={{ flexDirection: "row" }}>
              <TextInput
                style={{ width: 50, height: 30, borderWidth: 1, marginRight: 10 }}
                placeholder="Cantidad"
                keyboardType="numeric"
                value={item.quantity.toString()}
                onChangeText={(text) => {
                  // Validar si el texto es un número antes de actualizar la cantidad
                  if (/^\d+$/.test(text)) {
                    updateQuantity(item.id, parseInt(text));
                  }
                }}
              />
              <Button title="+" onPress={() => updateQuantity(item.id, item.quantity + 1)} />
              <Button
                title="-"
                onPress={() => {
                  if (item.quantity > 0) {
                    updateQuantity(item.id, item.quantity - 1);
                  }
                }}
              />
              <Button
                title="Eliminar"
                onPress={() => deleteProduct(item.id)}
                color="red"
              />
            </View>
          </View>
        )}
      />
      <Button title="Volver" onPress={() => {setIsProvider(false) }} />
    </View>
  );
}
