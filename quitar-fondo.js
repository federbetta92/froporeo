import { removeBackground } from '@imgly/background-removal-node';
import fs from 'fs';
import path from 'path';

// Configura las rutas de tus carpetas aquí:
const carpetaOrigen = './public/products/Snacks';
const carpetaDestino = './public/products/Snacks - copia';

async function procesarImagenes() {
  try {
    // Leer los archivos de la carpeta origen
    const archivos = fs.readdirSync(carpetaOrigen);
    // Filtrar solo los que sean imágenes comunes
    const imagenes = archivos.filter(file => /\.(jpg|jpeg|png|webp)$/i.test(file));

    console.log(`📸 Se encontraron ${imagenes.length} imágenes para procesar...`);

    for (let i = 0; i < imagenes.length; i++) {
      const nombreArchivo = imagenes[i];
      const rutaEntrada = path.join(carpetaOrigen, nombreArchivo);
      
      // Obligamos a que la salida sea .png para conservar la transparencia del fondo
      const nombreSalida = path.parse(nombreArchivo).name + '.png';
      const rutaSalida = path.join(carpetaDestino, nombreSalida);

      console.log(`[${i + 1}/${imagenes.length}] Procesando: ${nombreArchivo}...`);

      // Ejecutar la IA para quitar el fondo
      const blob = await removeBackground(rutaEntrada);
      
      // Convertir el resultado a un buffer de Node para poder guardarlo
      const buffer = Buffer.from(await blob.arrayBuffer());
      
      // Guardar la foto limpia
      fs.writeFileSync(rutaSalida, buffer);
      console.log(`✅ Guardada en: ${rutaSalida}`);
    }

    console.log('🎉 ¡Proceso terminado! Todas las imágenes están limpias.');
  } catch (error) {
    console.error('❌ Hubo un error en el proceso:', error);
  }
}

procesarImagenes();