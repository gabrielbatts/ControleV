import React, { useEffect, useState } from 'react';
import { View, Text, Button, FlatList, TextInput, Alert, StyleSheet } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { formatInTimeZone } from 'date-fns-tz'; 

const SalesScreen = () => {
  const [products, setProducts] = useState([]);
  const [selectedProductId, setSelectedProductId] = useState('');
  const [quantity, setQuantity] = useState('');
  const [todaySales, setTodaySales] = useState([]);
  const [totalSales, setTotalSales] = useState(0);
  const [totalValue, setTotalValue] = useState(0);
  const navigation = useNavigation();

  const loadProducts = async () => {
    try {
      const storedProducts = await AsyncStorage.getItem('myProducts');
      if (storedProducts) {
        setProducts(JSON.parse(storedProducts));
      }
    } 
    catch (error) {
      console.error('Erro ao carregar produtos:', error);
    }
  };

  const registerSale = async () => {
    if (!selectedProductId || !quantity) {
      Alert.alert('Erro', 'Por favor, selecione um produto e insira a quantidade.');
      return;
    }

    const product = products.find(p => p.id === selectedProductId);
    const saleQuantity = parseInt(quantity, 10);

    const today = formatInTimeZone(new Date(), 'America/Sao_Paulo', 'yyyy-MM-dd'); 

    const newSale = {
      productId: selectedProductId,
      productName: product.name || 'Produto Desconhecido',
      quantity: saleQuantity,
      value: product.value,
      date: today,
    };

    try {
      const salesData = await AsyncStorage.getItem('sales') || '[]';
      const allSales = JSON.parse(salesData);
      const updatedSales = [...allSales, newSale];

      await AsyncStorage.setItem('sales', JSON.stringify(updatedSales));
      Alert.alert('Sucesso!', 'Venda registrada com sucesso!');
      setSelectedProductId('');
      setQuantity('');
      loadTodaySales();
    } catch (error) {
      console.error('Erro ao registrar venda:', error);
    }
  };

  const deleteSale = async (productId) => {
    const updatedSales = todaySales.filter(sale => sale.productId !== productId);
    setTodaySales(updatedSales);
    
    try {
      const salesData = await AsyncStorage.getItem('sales') || '[]';
      const allSales = JSON.parse(salesData);
      const filteredSales = allSales.filter(sale => sale.productId !== productId);
      await AsyncStorage.setItem('sales', JSON.stringify(filteredSales));
      Alert.alert('Sucesso!', 'Venda excluída com sucesso!');
      loadTodaySales();
    } catch (error) {
      console.error('Erro ao excluir venda:', error);
    }
  };

  const loadTodaySales = async () => {
    const today = formatInTimeZone(new Date(), 'America/Sao_Paulo', 'yyyy-MM-dd'); 
    try {
      const sales = await AsyncStorage.getItem('sales') || '[]';
      const allSales = JSON.parse(sales);
      const filteredTodaySales = allSales.filter(sale => sale.date === today);
      setTodaySales(filteredTodaySales);

      const total = filteredTodaySales.reduce((sum, sale) => sum + sale.quantity, 0);
      const totalVal = filteredTodaySales.reduce((sum, sale) => sum + (sale.quantity * sale.value), 0);

      setTotalSales(total);
      setTotalValue(totalVal);
    } catch (error) {
      console.error('Erro ao carregar vendas:', error);
    }
  };

  useEffect(() => {
    loadProducts();
    loadTodaySales();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Registrar Vendas</Text>

      <Picker
        selectedValue={selectedProductId}
        onValueChange={(itemValue) => setSelectedProductId(itemValue)}
      >
        <Picker.Item label="Selecione um produto" value="" />
        {products.map((product) => (
          <Picker.Item key={product.id} label={product.name} value={product.id} />
        ))}
      </Picker>

      <Text style={styles.subtitle}>Quantidade</Text>
      <TextInput
        value={quantity}
        onChangeText={setQuantity}
        placeholder="Quantidade"
        keyboardType="numeric"
        style={styles.input}
      />

      <View style={styles.buttonContainer}>
        <Button title="Registrar Venda" onPress={registerSale} />
        <Button title="Ver Todas as Vendas" onPress={() => navigation.navigate('AllSales')} />
      </View>

      <Text style={styles.todaySalesTitle}>Vendas de Hoje:</Text>
      <FlatList
        data={todaySales}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <View style={styles.tableRow}>
            <Text style={styles.tableCell}>{item.productName}</Text>
            <Text style={styles.tableCell}>{item.quantity}</Text>
            <Text style={styles.tableCell}>{`R$ ${(item.value).toFixed(2)}`}</Text>
            <Button title="Excluir" onPress={() => deleteSale(item.productId)} />
          </View>
        )}
      />
      <Text style={styles.totalText}>Total de Vendas Hoje: {totalSales}</Text>
      <Text style={styles.totalText}>Valor Total de Vendas Hoje: R$ {totalValue.toFixed(2)}</Text>
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
  subtitle: {
    fontSize: 18,
    textAlign: 'center',
    marginVertical: 10,
  },
  input: {
    marginTop: 20,
    fontSize: 18,
    marginBottom: 20,
  },
  buttonContainer: {
    marginTop: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
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
  totalText: {
    fontWeight: 'bold',
  },
});

export default SalesScreen;
