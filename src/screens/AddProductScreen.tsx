import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const PRODUCTS_KEY = '@products';

export default function AddProductScreen({ navigation }) {
  const [productName, setProductName] = useState('');
  const [productPrice, setProductPrice] = useState('');
  const [productQuantity, setProductQuantity] = useState('');
  const [productImage, setProductImage] = useState('');

  const addProduct = async () => {
    if (productName && productPrice && productQuantity) {
      const newProduct = {
        id: Date.now().toString(),
        name: productName,
        price: parseFloat(productPrice),
        quantity: parseInt(productQuantity),
        image: productImage,
      };

      const storedProducts = await AsyncStorage.getItem(PRODUCTS_KEY);
      const products = storedProducts ? JSON.parse(storedProducts) : [];
      products.push(newProduct);
      await AsyncStorage.setItem(PRODUCTS_KEY, JSON.stringify(products));

      navigation.navigate('MyProducts');
    } else {
      alert('Preencha todos os campos');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Adicionar Produto</Text>
      <TextInput
        style={styles.input}
        placeholder="Nome do Produto"
        value={productName}
        onChangeText={setProductName}
      />
      <TextInput
        style={styles.input}
        placeholder="Preço"
        keyboardType="numeric"
        value={productPrice}
        onChangeText={setProductPrice}
      />
      <TextInput
        style={styles.input}
        placeholder="Quantidade"
        keyboardType="numeric"
        value={productQuantity}
        onChangeText={setProductQuantity}
      />
      <TextInput
        style={styles.input}
        placeholder="URL da Imagem (opcional)"
        value={productImage}
        onChangeText={setProductImage}
      />
      <TouchableOpacity style={styles.button} onPress={addProduct}>
        <Text style={styles.buttonText}>Adicionar</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#f0f0f0' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 16 },
  input: {
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  button: {
    backgroundColor: '#007AFF',
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
});
