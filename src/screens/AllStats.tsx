import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, Button } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Picker } from '@react-native-picker/picker';

const AllStats = () => {
  const [totalSales, setTotalSales] = useState(0);
  const [totalCosts, setTotalCosts] = useState(0);
  const [profitLoss, setProfitLoss] = useState(0);
  const [selectedMonth, setSelectedMonth] = useState('01');
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear().toString());
  const [monthlyData, setMonthlyData] = useState([]);
  const [monthName, setMonthName] = useState('');
  const [isDataLoaded, setIsDataLoaded] = useState(false);

  const loadAllStats = async () => {
    const sales = await AsyncStorage.getItem('sales') || '[]';
    const materials = await AsyncStorage.getItem('@materials') || '[]';
    const allSales = JSON.parse(sales);
    const allMaterials = JSON.parse(materials);

    const totalSalesAll = allSales.reduce((sum, sale) => {
      return sum + (sale.value * sale.quantity);
    }, 0);

    const totalCostsAll = allMaterials.reduce((sum, material) => {
      return sum + (material.unitCost * material.quantity);
    }, 0);

    setTotalSales(totalSalesAll);
    setTotalCosts(totalCostsAll);
    setProfitLoss(totalSalesAll - totalCostsAll);
  };

  const getMonthlyStats = async (month, year) => {
    const sales = JSON.parse(await AsyncStorage.getItem('sales') || '[]');
    const materials = JSON.parse(await AsyncStorage.getItem('@materials') || '[]');

    // Aqui é para filtrar as vendas por mês e ano
    const monthlySales = sales.filter(sale => {
      const saleDate = new Date(sale.date);
      return saleDate.getFullYear() === parseInt(year) && saleDate.getMonth() + 1 === parseInt(month);
    });

    // Aqui é para filtrar os materiais por mês e ano
    const monthlyMaterials = materials.filter(material => {
      if (material.date) {
        const materialDate = new Date(material.date);
        return materialDate.getFullYear() === parseInt(year) && materialDate.getMonth() + 1 === parseInt(month);
      }
      return false;
    });

    const totalSalesMonth = monthlySales.reduce((sum, sale) => sum + (sale.value * sale.quantity), 0);
    const totalCostsMonth = monthlyMaterials.reduce((sum, material) => sum + (material.unitCost * material.quantity), 0);

    setMonthlyData([
      { label: 'Total de Vendas', value: `R$ ${totalSalesMonth.toFixed(2)}` },
      { label: 'Total de Custos', value: `R$ -${totalCostsMonth.toFixed(2)}` },
      { label: 'Lucro', value: `R$ ${(totalSalesMonth - totalCostsMonth > 0 ? (totalSalesMonth - totalCostsMonth).toFixed(2) : '0.00')}` },
      { label: 'Prejuízo', value: `R$ ${(totalSalesMonth - totalCostsMonth < 0 ? Math.abs(totalSalesMonth - totalCostsMonth).toFixed(2) : '0.00')}` },
    ]);

    const monthNames = [
      'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
      'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
    ];
    setMonthName(monthNames[parseInt(month) - 1]);
    setIsDataLoaded(true);
  };

  const handleMonthChange = (month) => {
    setSelectedMonth(month);
    // Aqui é para resetar os dados mensais ao mudar de mês
    setMonthlyData([]);
  };

  const handleYearChange = (year) => {
    setSelectedYear(year);
    // Aqui é para resetar os dados mensais ao mudar de ano
    setMonthlyData([]);
  };

  const handleSelect = () => {
    getMonthlyStats(selectedMonth, selectedYear);
  };

  useEffect(() => {
    loadAllStats();
    getMonthlyStats(selectedMonth, selectedYear);
  }, [selectedMonth, selectedYear]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Estatísticas Gerais</Text>
      <View style={styles.pickerContainer}>
        <Text>Mês:</Text>
        <Picker
          selectedValue={selectedMonth}
          style={styles.picker}
          onValueChange={(itemValue) => handleMonthChange(itemValue)}
        >
          {['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'].map((month, index) => (
            <Picker.Item key={index} label={month} value={String(index + 1).padStart(2, '0')} />
          ))}
        </Picker>
      </View>
      <View style={styles.pickerContainer}>
        <Text>Ano:</Text>
        <Picker
          selectedValue={selectedYear}
          style={styles.picker}
          onValueChange={(itemValue) => handleYearChange(itemValue)}
        >
          {Array.from({ length: 5 }, (_, i) => (
            <Picker.Item key={i} label={`${new Date().getFullYear() - i}`} value={`${new Date().getFullYear() - i}`} />
          ))}
        </Picker>
      </View>
      <Button title="Selecionar" onPress={handleSelect} />
      <Text style={styles.monthName}>Resultados para {monthName} {selectedYear}</Text>
      <FlatList
        data={monthlyData}
        keyExtractor={(item) => item.label}
        renderItem={({ item }) => (
          <View style={styles.tableRow}>
            <Text style={styles.text}>{item.label}:</Text>
            <Text style={[styles.text, item.label.includes('Total de Custos') ? styles.lossText : item.label.includes('Lucro') ? styles.profitText : null]}>
              {item.value}
            </Text>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  pickerContainer: {
    marginBottom: 16,
  },
  picker: {
    height: 50,
    width: '100%',
  },
  monthName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 16,
  },
  tableRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
  },
  text: {
    fontSize: 16,
  },
  profitText: {
    color: 'green',
  },
  lossText: {
    color: 'red',
    fontWeight: 'bold',
  },
});

export default AllStats;
