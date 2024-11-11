import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';

export default function HomeScreen() {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Controle de Vendas</Text>
      </View>
      
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('MyProducts')}
      >
        <Text style={styles.buttonText}>Meus Produtos</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('MateriaisGastos')}
      >
        <Text style={styles.buttonText}>Materiais Gastos</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('Vendas')}
      >
        <Text style={styles.buttonText}>Vendas</Text>
      </TouchableOpacity>
      
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('Stats')}
        >
        <Text style={styles.buttonText}>Ver Estatísticas</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f0f0',
  },
  header: {
    backgroundColor: '#007AFF', 
    width: '100%', 
    paddingVertical: 20,
    alignItems: 'center', 
    justifyContent: 'center', 
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff', 
  },
  button: {
    backgroundColor: '#007AFF',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
    marginVertical: 10,
    width: '80%',
    alignSelf: 'center', 
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
