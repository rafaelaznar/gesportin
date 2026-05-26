import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ImageUploadService {
  private readonly maxImageSizeBytes = 100 * 1024;

  async fileToBase64(file: File): Promise<string> {
    if (!file.type.startsWith('image/')) {
      throw new Error('El archivo seleccionado no es una imagen válida');
    }

    if (file.size > this.maxImageSizeBytes) {
      throw new Error('La imagen es demasiado pesada. Elige una imagen de menos de 100 KB');
    }

    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        const base64 = result.includes(',') ? result.split(',')[1] : result;
        resolve(base64);
      };
      reader.onerror = () => reject(new Error('No se pudo leer la imagen seleccionada'));
      reader.readAsDataURL(file);
    });
  }

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
