import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { Calendar } from 'react-native-calendars';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MaterialIcons } from '@expo/vector-icons';
import { formatCurrency } from '../utils/productUtils';

const MATERIALS_KEY = '@materials';

export default function AllMaterialsScreen() {
  const [materials, setMaterials] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [filteredMaterials, setFilteredMaterials] = useState([]);

  useEffect(() => {
    const loadMaterials = async () => {
      const storedMaterials = await AsyncStorage.getItem(MATERIALS_KEY);
      if (storedMaterials) {
        const parsedMaterials = JSON.parse(storedMaterials);
        setMaterials(parsedMaterials);
        setFilteredMaterials(parsedMaterials.filter((material) => material.date === selectedDate));
      }
    };

    loadMaterials();
  }, []);

  useEffect(() => {
    setFilteredMaterials(materials.filter((material) => material.date === selectedDate));
  }, [selectedDate, materials]);

  const onDayPress = (day) => {
    setSelectedDate(day.dateString);
  };

  const calculateTotalCost = (materialsList) => {
    return materialsList.reduce((total, material) => {
      return total + (material.unitCost * material.quantity);
    }, 0);
  };

  const restoreMaterial = async (id) => {
    const updatedMaterials = materials.map((material) => {
      if (material.id === id) {
        return { ...material, hidden: false };
      }
      return material;
    });

    setMaterials(updatedMaterials);
    setFilteredMaterials(updatedMaterials.filter((material) => material.date === selectedDate));
    await AsyncStorage.setItem(MATERIALS_KEY, JSON.stringify(updatedMaterials));
  };

  return (
    <View style={styles.container}>
      <Calendar
        onDayPress={onDayPress}
        markedDates={{ [selectedDate]: { selected: true, selectedColor: '#007AFF' } }}
      />
      <Text style={styles.dateText}>Materiais do dia {selectedDate}:</Text>
      <FlatList
        data={filteredMaterials}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.materialContainer}>
            <Text style={styles.materialText}>
              {item.name} - Valor da Unidade: {formatCurrency(item.unitCost || 0)} - Quantidade: {item.quantity || 0} - Total: {formatCurrency((item.unitCost || 0) * (item.quantity || 0))} - Data: {item.date}
            </Text>
            {item.hidden && (
              <TouchableOpacity style={styles.restoreButton} onPress={() => restoreMaterial(item.id)}>
                <MaterialIcons name="refresh" size={24} color="#34C759" />
              </TouchableOpacity>
            )}
          </View>
        )}
      />
      <Text style={styles.totalText}>
        Custo Total: {formatCurrency(calculateTotalCost(filteredMaterials))}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#f0f0f0' },
  materialContainer: { backgroundColor: '#fff', borderRadius: 8, marginVertical: 6, padding: 12, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  dateText: { fontSize: 16, fontWeight: 'bold', marginBottom: 10 },
  materialText: { fontSize: 16, flex: 1 },
  restoreButton: { padding: 8 },
  totalText: { fontSize: 18, fontWeight: 'bold', marginTop: 20 },
});
