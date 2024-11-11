import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, Button, FlatList, Alert, TouchableOpacity, StyleSheet, Image } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/FontAwesome';
import * as ImagePicker from 'expo-image-picker';

const MyProductsScreen = ({ navigation }) => {
  const [products, setProducts] = useState([]);
  const [name, setName] = useState('');
  const [value, setValue] = useState('');
  const [image, setImage] = useState(null);
  const [editIndex, setEditIndex] = useState(null);

  const loadProducts = async () => {
    try {
      const storedProducts = await AsyncStorage.getItem('myProducts');
      if (storedProducts) {
        setProducts(JSON.parse(storedProducts));
      }
    } catch (error) {
      console.error('Erro ao carregar produtos:', error);
    }
  };

  const saveProducts = async (newProducts) => {
    try {
      await AsyncStorage.setItem('myProducts', JSON.stringify(newProducts));
      setProducts(newProducts);
    } catch (error) {
      console.error('Erro ao salvar produtos:', error);
    }
  };

  const handleAddOrEditProduct = async () => {
    if (!name || !value) {
      Alert.alert('Erro', 'Por favor, preencha todos os campos.');
      return;
    }

    const newProduct = {
      id: new Date().getTime().toString(),
      name,
      value: parseFloat(value),
      image,
    };
    let newProducts;

    if (editIndex !== null) {
      newProducts = [...products];
      newProducts[editIndex] = { ...newProduct, id: products[editIndex].id };
      setEditIndex(null);
    } else {
      newProducts = [...products, newProduct];
    }

    await saveProducts(newProducts);
    setName('');
    setValue('');
    setImage(null);
    loadProducts();
  };

  const handleEditProduct = (index) => {
    const productToEdit = products[index];
    setEditIndex(index);
    setName(productToEdit.name);
    setValue(productToEdit.value.toString());
    setImage(productToEdit.image);
  };

  const handleDeleteProduct = (index) => {
    Alert.alert(
      'Confirmar Exclusão',
      'Você tem certeza que deseja excluir este produto?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir',
          onPress: () => {
            const newProducts = products.filter((_, i) => i !== index);
            saveProducts(newProducts);
            Alert.alert('Produto Excluído', 'O produto foi excluído com sucesso.');
          },
        },
      ],
      { cancelable: false }
    );
  };

  const handleSelectImage = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (permissionResult.granted === false) {
      Alert.alert('Erro', 'É necessário permitir o acesso à galeria de imagens.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync();

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Meus Produtos</Text>

      <TextInput
        style={styles.input}
        value={name}
        onChangeText={setName}
        placeholder="Nome do Produto"
      />
      <TextInput
        style={styles.input}
        value={value}
        onChangeText={setValue}
        placeholder="Valor do Produto"
        keyboardType="numeric"
      />

      <Button title="Selecionar Imagem" onPress={handleSelectImage} />

      {image && (
        <Image source={{ uri: image }} style={styles.image} />
      )}

      <View style={styles.buttonSpacing}>
        <Button title={editIndex !== null ? "Salvar Alterações" : "Adicionar Produto"} onPress={handleAddOrEditProduct} />
      </View>

      <FlatList
        data={products}
        keyExtractor={(item) => item.id}
        renderItem={({ item, index }) => (
          <View style={styles.productItem}>
            <Text>{item.name} - R$ {typeof item.value === 'number' ? item.value.toFixed(2) : 'Valor inválido'}</Text>
            {item.image && (
              <Image source={{ uri: item.image }} style={styles.image} />
            )}
            <View style={styles.buttonContainer}>
              <TouchableOpacity onPress={() => handleEditProduct(index)} style={styles.editButton}>
                <Icon name="edit" size={20} color="#fff" />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => handleDeleteProduct(index)} style={styles.deleteButton}>
                <Icon name="trash" size={20} color="#fff" />
              </TouchableOpacity>
            </View>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  input: {
    height: 50,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 25,
    marginBottom: 10,
    paddingHorizontal: 10,
    fontSize: 18,
    textAlign: 'center',
  },
  productItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
  },
  editButton: {
    backgroundColor: 'blue',
    padding: 10,
    marginRight: 10,
    borderRadius: 5,
  },
  deleteButton: {
    backgroundColor: 'red',
    padding: 10,
    borderRadius: 5,
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginTop: 10,
    marginBottom: 10,
  },
  buttonSpacing: {
    marginTop: 10,
  },
});

export default MyProductsScreen;
