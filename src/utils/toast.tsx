/**
 * Wrapper compatível com react-native-tiny-toast
 * Usa react-native-toast-message internamente
 * Mantém a mesma API para facilitar migração
 */
import Toast from 'react-native-toast-message';

interface ToastOptions {
  duration?: number;
}

class ToastWrapper {
  show(message: string, options?: ToastOptions) {
    const visibilityTime = options?.duration || 3500;

    Toast.show({
      type: 'info',
      text1: message,
      visibilityTime,
      position: 'bottom',
    });
  }

  success(message: string, options?: ToastOptions) {
    const visibilityTime = options?.duration || 3500;

    Toast.show({
      type: 'success',
      text1: message,
      visibilityTime,
      position: 'bottom',
    });
  }

  error(message: string, options?: ToastOptions) {
    const visibilityTime = options?.duration || 3500;

    Toast.show({
      type: 'error',
      text1: message,
      visibilityTime,
      position: 'bottom',
    });
  }

  showLoading(message: string): number {
    // Gera um ID único para o loading (retornado para compatibilidade com API antiga)
    const id = Date.now();

    // Mostra um toast de loading que não desaparece automaticamente
    Toast.show({
      type: 'info',
      text1: message,
      position: 'bottom',
      visibilityTime: 0, // 0 = não desaparece automaticamente
      autoHide: false,
    });

    return id;
  }

  hide(id?: number) {
    // Esconde o toast atual (react-native-toast-message não suporta IDs específicos)
    // O parâmetro id é ignorado para compatibilidade com API antiga
    Toast.hide();
  }
}

export default new ToastWrapper();
