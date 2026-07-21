// src/services/productService.js

const SHEETDB_URL = 'https://sheetdb.io/api/v1/aqkmgpiukrb2k'; // ⚠️ Reemplazá por tu ID

export const getProducts = async () => {
  try {
    const res = await fetch(SHEETDB_URL);
    const data = await res.json();
    return data;
  } catch (error) {
    console.error("Error obteniendo productos:", error);
    return [];
  }
};
