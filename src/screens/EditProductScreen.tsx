import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert, StyleSheet, Image } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';

const EditProductScreen = ({ route, navigation }) => {
  const { product, index } = route.params;
  const [name, setName] = useState(product?.name || '');
  const [value, setValue] = useState(product?.value?.toString() || '');
  const [image, setImage] = useState(product?.image || null);

  const handleSave = async () => {
    if (!name || !value) {
      Alert.alert('Erro', 'Por favor, preencha todos os campos.');
      return;
    }

    const newProduct = { id: product.id, name, value: parseFloat(value), image };

    try {
      const storedProducts = await AsyncStorage.getItem('myProducts');
      const products = storedProducts ? JSON.parse(storedProducts) : [];
      products[index] = newProduct;

      await AsyncStorage.setItem('myProducts', JSON.stringify(products));
      Alert.alert('Sucesso', 'Produto atualizado com sucesso.');
      navigation.goBack();
    } catch (error) {
      console.error('Erro ao salvar produto:', error);
    }
  };

  const handleDelete = async () => {
    Alert.alert(
      'Confirmar Exclusão',
      'Você tem certeza que deseja excluir este produto?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir',
          onPress: async () => {
            try {
              const storedProducts = await AsyncStorage.getItem('myProducts');
              const products = storedProducts ? JSON.parse(storedProducts) : [];
              products.splice(index, 1);

              await AsyncStorage.setItem('myProducts', JSON.stringify(products));
              Alert.alert('Sucesso', 'Produto excluído com sucesso.');
              navigation.goBack();
            } catch (error) {
              console.error('Erro ao excluir produto:', error);
            }
          },
        },
      ],
      { cancelable: false }
    );
  };

  const handleImagePicker = async () => {
    
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

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Editar Produto</Text>

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

      <Button title="Selecionar Imagem" onPress={handleImagePicker} />
      {image && (
        <Image source={{ uri: image }} style={styles.image} />
      )}

      <View style={styles.buttonContainer}>
        <Button title="Salvar" onPress={handleSave} />
        <Button title="Excluir" onPress={handleDelete} color="red" />
      </View>
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
  image: {
    width: 70,
    height: 70,
    borderRadius: 50,
    alignSelf: 'center',
    marginBottom: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 20,
  },
});

export default EditProductScreen;
