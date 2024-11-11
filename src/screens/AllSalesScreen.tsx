import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Calendar } from 'react-native-calendars';

const AllSalesScreen = () => {
  const [sales, setSales] = useState<any[]>([]);
  const [selectedDate, setSelectedDate] = useState('');
  const [filteredSales, setFilteredSales] = useState<any[]>([]);
  const [totalValue, setTotalValue] = useState(0);

  const loadSales = async () => {
    try {
      const salesData = await AsyncStorage.getItem('sales');
      console.log("Dados brutos do AsyncStorage:", salesData);
      const parsedSales = salesData ? JSON.parse(salesData) : [];
      setSales(parsedSales);
      console.log("Dados de vendas carregados:", parsedSales);
    } catch (error) {
      console.error('Erro ao carregar vendas:', error);
    }
  };

  useEffect(() => {
    const initializeSales = async () => {
      const salesData = await AsyncStorage.getItem('sales');
      if (!salesData) {
        const testSales = [
          { productId: 1, productName: 'Produto A', quantity: 2, value: 10, date: '2024-10-28' },
          { productId: 2, productName: 'Produto B', quantity: 1, value: 20, date: '2024-10-28' },
        ];
        await AsyncStorage.setItem('sales', JSON.stringify(testSales));
        console.log("Vendas de teste armazenadas:", testSales);
      }
      loadSales();
    };

    initializeSales();
  }, []);

  const onDayPress = (day: any) => {
    setSelectedDate(day.dateString);
    const filtered = sales.filter((sale: any) => sale.date === day.dateString); // Comparação exata
    setFilteredSales(filtered);

    const total = filtered.reduce((sum, sale) => sum + (sale.value * sale.quantity), 0);
    setTotalValue(total);
    console.log("Total de vendas filtradas:", total);
    console.log(`Vendas filtradas para a data ${day.dateString}:`, filtered);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Selecionar Data</Text>
      <Calendar
        onDayPress={onDayPress}
        markedDates={{
          [selectedDate]: { selected: true, marked: true },
        }}
      />
      <Text style={styles.todaySalesTitle}>Vendas em {selectedDate}:</Text>
      <FlatList
        data={filteredSales}
        keyExtractor={(item) => item.productId.toString()}
        renderItem={({ item }) => (
          <View style={styles.tableRow}>
            <Text style={styles.tableCell}>{item.productName}</Text>
            <Text style={styles.tableCell}>{item.quantity}</Text>
            <Text style={styles.tableCell}>{`R$ ${(item.value * item.quantity).toFixed(2)}`}</Text>
          </View>
        )}
      />
      {selectedDate && (
        <Text style={styles.totalValueText}>
          Valor Total de Vendas: R$ {totalValue.toFixed(2)}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  title: {
    fontSize: 20,
    textAlign: 'center',
  },
  todaySalesTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginVertical: 10,
  },
  tableRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 5,
    padding: 5,
    borderBottomWidth: 1,
    borderColor: '#ccc',
  },
  tableCell: {
    flex: 1,
    textAlign: 'center',
  },
  totalValueText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 20,
    textAlign: 'center',
  },
});

export default AllSalesScreen;
