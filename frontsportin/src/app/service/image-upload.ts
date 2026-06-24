import { Injectable } from '@angular/core';

/**
 * Servicio de utilidad para la gestión de imágenes en la aplicación.
 *
 * Proporciona métodos para:
 * - Convertir un archivo de imagen (File) a Base64 para enviarlo al backend.
 * - Convertir una cadena Base64 (con o sin prefijo data URI) en una URL
 *   válida para usar como src de un <img>.
 *
 * Se usa en los formularios de creación/edición de entidades con imagen
 * (club, noticia, artículo) y en las vistas de detalle/listado para
 * mostrar previsualizaciones.
 */
@Injectable({
  providedIn: 'root',
})
export class ImageUploadService {
  /** Tamaño máximo permitido: 100 KB */
  private readonly maxImageSizeBytes = 100 * 1024;

  /**
   * Lee un archivo de imagen y devuelve su contenido en Base64
   * (sin el prefijo `data:image/...`).
   *
   * @param file - Archivo de imagen seleccionado por el usuario.
   * @returns Una promesa que resuelve con el contenido Base64.
   * @throws Si el archivo no es una imagen o supera los 100 KB.
   */
  async fileToBase64(file: File): Promise<string> {
    if (!file.type.startsWith('image/')) {
      throw new Error('Selecciona una imagen válida');
    }

    if (file.size > this.maxImageSizeBytes) {
      throw new Error('La imagen es demasiado pesada. Elige una imagen de menos de 100 KB');
    }

    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        // Si el FileReader devuelve data URI con prefijo, lo eliminamos
        const base64 = result.includes(',') ? result.split(',')[1] : result;
        resolve(base64);
      };
      reader.onerror = () => reject(new Error('No se pudo leer la imagen seleccionada'));
      reader.readAsDataURL(file);
    });
  }

  /**
   * Convierte una cadena Base64 (tal como la devuelve el backend) en una
   * URL de datos (`data:image/jpeg;base64,...`) utilizable como src de <img>.
   *
   * Si la cadena ya es una data URI completa, se devuelve tal cual.
   * Si es null o undefined, se devuelve null.
   *
   * @param base64 - Cadena Base64 de la imagen (con o sin prefijo data URI).
   * @returns La data URI completa, o null si no hay imagen.
   */
  toPreviewSrc(base64: string | null | undefined): string | null {
    if (!base64) {
      return null;
    }

    if (base64.startsWith('data:image/')) {
      return base64;
    }

    return `data:image/jpeg;base64,${base64}`;
  }
}