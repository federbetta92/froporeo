// src/data/apiProducts.js

const SHEETDB_URL = 'https://sheetdb.io/api/v1/aqkmgpiukrb2k'; // Reemplaza con tu ID de SheetDB

// 1. Cargar productos desde Google Sheets
export const fetchProducts = async () => {
  try {
    const response = await fetch(SHEETDB_URL);
    if (!response.ok) throw new Error('Error al obtener productos');
    return await response.json();
  } catch (error) {
    console.error('Error fetching products:', error);
    return [];
  }
};

// 2. Descontar stock cuando compran
export const updateProductStock = async (productId, newStock) => {
  try {
    const response = await fetch(`${SHEETDB_URL}/id/${productId}`, {
      method: 'PATCH',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        data: {
          stock_actual: newStock
        }
      })
    });
    return await response.json();
  } catch (error) {
    console.error('Error actualizando stock:', error);
  }
};
