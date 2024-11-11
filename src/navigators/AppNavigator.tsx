import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from '../screens/HomeScreen';
import MyProductsScreen from '../screens/MyProductsScreen';
import AddProductScreen from '../screens/AddProductScreen';
import MaterialsScreen from '../screens/MaterialsScreen';
import SalesScreen from '../screens/SalesScreen';
import AllMaterialsScreen from '../screens/AllMaterialsScreen';

const Stack = createStackNavigator();

export default function AppNavigator() {
  return (
    <Stack.Navigator initialRouteName="Home">
      <Stack.Screen name="Home" component={HomeScreen} options={{ title: 'Home' }} />
      <Stack.Screen name="MyProducts" component={MyProductsScreen} options={{ title: 'Meus Produtos' }} />
      <Stack.Screen name="AddProduct" component={AddProductScreen} options={{ title: 'Adicionar Produto' }} />
      <Stack.Screen name="MateriaisGastos" component={MaterialsScreen} options={{ title: 'Materiais Gastos' }} />
      <Stack.Screen name="Vendas" component={SalesScreen} options={{ title: 'Registrar Vendas' }} />
      <Stack.Screen name="AllMaterials" component={AllMaterialsScreen} options={{ title: 'Todos os Gastos' }} />
    </Stack.Navigator>
  );
}
