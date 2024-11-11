import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MaterialIcons } from '@expo/vector-icons';
import { formatCurrency } from '../utils/productUtils';

const MATERIALS_KEY = '@materials';

export default function MaterialsScreen({navigation})
  {
  const [materials, setMaterials] = useState([]);
  const [materialName, setMaterialName] = useState('');
  const [unitCost, setUnitCost] = useState('');
  const [quantity, setQuantity] = useState('');
  const [displayTotalCost, setDisplayTotalCost] = useState(0);

  useEffect(() => {
    loadMaterials();
  }, []);

  useEffect(() => {
    const focusListener = navigation.addListener('focus', () => {
      loadMaterials();
    });
    return focusListener;
  }, [navigation]);

  const loadMaterials = async () => {
    const storedMaterials = await AsyncStorage.getItem(MATERIALS_KEY);
    if (storedMaterials) {
      const parsedMaterials = JSON.parse(storedMaterials);
      setMaterials(parsedMaterials);
      setDisplayTotalCost(calculateDisplayCost(parsedMaterials));
    }
  };

  const addMaterial = async () => {
    if (materialName && unitCost && quantity) {
      const date = new Date();
      const gmtDate = new Date(date.getTime() - 3 * 60 * 60 * 1000);
      const newMaterial = {
        id: Date.now().toString(),
        name: materialName,
        unitCost: parseFloat(unitCost),
        quantity: parseInt(quantity, 10),
        date: gmtDate.toISOString().split('T')[0],
        hidden: false,
      };
      const updatedMaterials = [...materials, newMaterial];
      setMaterials(updatedMaterials);
      setDisplayTotalCost(calculateDisplayCost(updatedMaterials));
      await AsyncStorage.setItem(MATERIALS_KEY, JSON.stringify(updatedMaterials));
      setMaterialName('');
      setUnitCost('');
      setQuantity('');
    } else {
      Alert.alert('Erro', 'Preencha todos os campos');
    }
  };

  const deleteMaterial = async (id) => {
    const updatedMaterials = materials.filter((material) => material.id !== id);
    setMaterials(updatedMaterials);
    setDisplayTotalCost(calculateDisplayCost(updatedMaterials)); // Aqui vai atualizar o custo total exibido ao excluir material
    await AsyncStorage.setItem(MATERIALS_KEY, JSON.stringify(updatedMaterials));
  };

  const hideMaterial = async (id) => {
    const updatedMaterials = materials.map((material) =>
      material.id === id ? { ...material, hidden: true } : material
    );
    setMaterials(updatedMaterials);
    await AsyncStorage.setItem(MATERIALS_KEY, JSON.stringify(updatedMaterials));

    const hiddenMaterial = materials.find((material) => material.id === id);
    if (hiddenMaterial) {
      const hiddenCost = hiddenMaterial.unitCost * hiddenMaterial.quantity;
      setDisplayTotalCost((prevCost) => prevCost - hiddenCost); // Aqui vai atualizar os custos exibidos, sem alterar o armazenamento
    }
  };

  const confirmDelete = (id) => {
    Alert.alert('Excluir Material', 'Você tem certeza que deseja excluir este material?', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Excluir', onPress: () => deleteMaterial(id) },
    ]);
  };

  const visibleMaterials = materials.filter((material) => !material.hidden);

  const calculateTotalCost = (materialsList = materials) => {
    return materialsList.reduce((total, material) => {
      return total + material.unitCost * material.quantity;
    }, 0);
  };

  // Função para calcular o custo exibido, descontando materiais ocultos
  const calculateDisplayCost = (materialsList) => {
    return materialsList.reduce((total, material) => {
      if (!material.hidden) {
        return total + material.unitCost * material.quantity;
      }
      return total;
    }, 0);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Materiais Gastos</Text>
      <TextInput
        style={styles.input}
        placeholder="Nome do Material"
        value={materialName}
        onChangeText={setMaterialName}
      />
      <TextInput
        style={styles.input}
        placeholder="Valor da Unidade"
        keyboardType="numeric"
        value={unitCost}
        onChangeText={setUnitCost}
      />
      <TextInput
        style={styles.input}
        placeholder="Quantidade"
        keyboardType="numeric"
        value={quantity}
        onChangeText={setQuantity}
      />
      <TouchableOpacity style={styles.button} onPress={addMaterial}>
        <Text style={styles.buttonText}>Adicionar Material</Text>
      </TouchableOpacity>

      <FlatList
        data={visibleMaterials}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.materialContainer}>
            <View style={styles.materialDetails}>
              <Text style={styles.dateText}>Data: {item.date}</Text>
              <Text style={styles.materialText}>
                {item.name} - Valor da Unidade: {formatCurrency(item.unitCost || 0)} - Quantidade:{' '}
                {item.quantity || 0} - Total: {formatCurrency((item.unitCost || 0) * (item.quantity || 0))}
              </Text>
            </View>
            <View style={styles.iconsContainer}>
              <TouchableOpacity style={styles.hideButton} onPress={() => hideMaterial(item.id)}>
                <MaterialIcons name="folder" size={24} color="#007AFF" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.deleteButton} onPress={() => confirmDelete(item.id)}>
                <MaterialIcons name="delete" size={24} color="#FF3B30" />
              </TouchableOpacity>
            </View>
          </View>
        )}
      />

      <Text style={styles.totalText}>Custo Total: {formatCurrency(displayTotalCost)}</Text>
      <TouchableOpacity
        style={styles.viewAllButton}
        onPress={() => navigation.navigate('AllMaterials')}
      >
        <Text style={styles.buttonText}>Ver todos os Gastos</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#f0f0f0' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 16 },
  input: { height: 50, borderColor: '#ccc', borderWidth: 1, borderRadius: 8, marginBottom: 10, paddingHorizontal: 10 },
  button: { backgroundColor: '#007AFF', padding: 12, borderRadius: 8, alignItems: 'center', marginBottom: 16 },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  materialContainer: { flexDirection: 'row', backgroundColor: '#fff', borderRadius: 8, marginVertical: 6, padding: 12 },
  materialDetails: { flex: 1 },
  dateText: { fontSize: 12, color: '#666' },
  materialText: { fontSize: 16 },
  iconsContainer: { justifyContent: 'flex-start', alignItems: 'center' },
  hideButton: { marginBottom: 6 },
  deleteButton: { marginBottom: 6 },
  totalText: { fontSize: 18, fontWeight: 'bold', marginTop: 20 },
  viewAllButton: { backgroundColor: '#FF9500', padding: 12, borderRadius: 8, alignItems: 'center', marginTop: 20 },
});
