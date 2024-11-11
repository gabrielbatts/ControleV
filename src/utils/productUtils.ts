// src/utils/productUtils.ts

export const calculateTotalCost = (materials: { cost: number; quantity: number }[]): number => {
    return materials.reduce((total, material) => {
      const unitCost = material.cost || 0;
      const quantity = material.quantity || 0;
      return total + (unitCost * quantity);
    }, 0);
  };
  
  export const formatCurrency = (value: number): string => {
    return `R$ ${value.toFixed(2).replace('.', ',')}`;
  };
  
  export const findProductById = (products: { id: string; name: string }[], id: string) => {
    return products.find(product => product.id === id);
  };
  