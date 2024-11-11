import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from './src/screens/HomeScreen';
import StatsScreen from './src/screens/StatsScreen';
import MyProductsScreen from './src/screens/MyProductsScreen';
import AddProductScreen from './src/screens/AddProductScreen';
import MaterialsScreen from './src/screens/MaterialsScreen';
import SalesScreen from './src/screens/SalesScreen';
import EditProductScreen from './src/screens/EditProductScreen'; 
import AllSalesScreen from './src/screens/AllSalesScreen'; 
import AllStats from './src/screens/AllStats'; 
import AllMaterialsScreen from './src/screens/AllMaterialsScreen';

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen
          name = "Home"
          component = {HomeScreen} 
          options = {{ title: 'Controle de Vendas' }}
        />
        <Stack.Screen 
          name = "Stats" 
          component = {StatsScreen} 
          options = {{ title: 'Estatísticas de Vendas' }}
        />
        <Stack.Screen 
          name = "MyProducts" 
          component = {MyProductsScreen} 
          options= {{ title: 'Meus Produtos' }} 
        />
        <Stack.Screen 
          name = "AddProduct"
          component = {AddProductScreen}
          options = {{ title: 'Adicionar Produto' }} 
        />
        <Stack.Screen 
          name = "MateriaisGastos"
          component = {MaterialsScreen} 
          options = {{ title: 'Materiais Gastos' }}
        />
        <Stack.Screen 
          name = "Vendas"
          component = {SalesScreen} 
          options = {{ title: 'Registrar Vendas' }}
        />
        <Stack.Screen 
          name = "AllSales"
          component = {AllSalesScreen} 
          options = {{ title: 'Todas as Vendas' }}
        />
        <Stack.Screen 
          name = "EditProduct" 
          component = {EditProductScreen} 
          options = {{ title: 'Editar Produto' }} 
        />
        <Stack.Screen 
          name = "AllStats" 
          component = {AllStats} 
          options = {{ title: 'Estatísticas Gerais' }} 
        />
        <Stack.Screen
          name = "AllMaterials"
          component = {AllMaterialsScreen} 
          options = {{ title: 'Todos os Gastos' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
