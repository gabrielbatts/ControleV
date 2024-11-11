import React, { useEffect, useState } from 'react';
import { View, Text, Button, StyleSheet, Dimensions } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import AsyncStorage from '@react-native-async-storage/async-storage';

const StatsScreen = ({ navigation }) => {
  const [totalSales, setTotalSales] = useState(0);
  const [totalCosts, setTotalCosts] = useState(0);
  const [profitLoss, setProfitLoss] = useState(0);

  const loadStats = async () => {
    const sales = await AsyncStorage.getItem('sales') || '[]';
    const materials = await AsyncStorage.getItem('@materials') || '[]';
    const allSales = JSON.parse(sales);
    const allMaterials = JSON.parse(materials);

    const today = new Date().toISOString().split('T')[0];
    const todaySales = allSales.filter(sale => sale.date.startsWith(today));

    const totalSalesToday = todaySales.reduce((sum, sale) => {
      return sum + (sale.value > 0 && sale.quantity > 0 ? sale.value * sale.quantity : 0);
    }, 0);

    // Aqui vai filtrar custos apenas do dia atual
    const totalCostsToday = allMaterials.reduce((sum, material) => {
      const materialDate = material.date.split('T')[0];
      return materialDate === today ? sum + (material.unitCost > 0 && material.quantity > 0 ? material.unitCost * material.quantity : 0) : sum;
    }, 0);

    setTotalSales(totalSalesToday);
    setTotalCosts(totalCostsToday);
    setProfitLoss(totalSalesToday - totalCostsToday);
  };

  useEffect(() => {
    loadStats();
  }, []);

  const screenWidth = Dimensions.get('window').width;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Estatísticas do Dia</Text>
      <View style={styles.table}>
        <View style={styles.tableRow}>
          <Text style={styles.text}>Total de Vendas:</Text>
          <Text style={styles.text}>R$ {totalSales.toFixed(2)}</Text>
        </View>
        <View style={styles.tableRow}>
          <Text style={styles.text}>Total de Custos:</Text>
          <Text style={[styles.text, styles.lossText]}>
            R$ -{totalCosts.toFixed(2)}
          </Text>
        </View>
        <View style={styles.tableRow}>
          <Text style={styles.text}>Lucro:</Text>
          <Text style={[styles.text, profitLoss > 0 ? styles.profitText : null]}>
            R$ {profitLoss > 0 ? profitLoss.toFixed(2) : 'R$ 0.00'}
          </Text>
        </View>
        <View style={styles.tableRow}>
          <Text style={styles.text}>Prejuízo:</Text>
          <Text style={[styles.text, profitLoss < 0 ? styles.lossText : null]}>
            {profitLoss < 0 ? Math.abs(profitLoss).toFixed(2) : 'R$ 0.00'}
          </Text>
        </View>
      </View>

      <LineChart
        data={{
          labels: ['Vendas', 'Custos', 'Lucro', 'Prejuízo'],
          datasets: [
            {
              data: [
                totalSales,
                totalCosts,
                profitLoss > 0 ? profitLoss : 0,
                profitLoss < 0 ? Math.abs(profitLoss) : 0
              ],
              color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
              strokeWidth: 2
            }
          ]
        }}
        width={screenWidth - 40}
        height={220}
        yAxisLabel="R$ "
        chartConfig={{
          backgroundColor: '#1E2923',
          backgroundGradientFrom: '#08130D',
          backgroundGradientTo: '#1E2923',
          decimalPlaces: 2,
          color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
          style: {
            borderRadius: 16
          }
        }}
        style={{
          marginVertical: 8,
          borderRadius: 16
        }}
      />

      <Button title="Estatística Geral" onPress={() => navigation.navigate('AllStats')} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f0f0f0',
  },

  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },

  table: {
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    overflow: 'hidden',
  },

  tableRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
    borderBottomWidth: 1,
    borderColor: '#ccc',
  },

  text: {
    fontSize: 18,
    marginBottom: 10,
  },

  profitText: {
    color: 'green',
  },

  lossText: {
    color: 'red',
  },
});

export default StatsScreen;
