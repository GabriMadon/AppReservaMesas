
import { API_URL } from '@env';

export const login = async (email: string, password: string) => {
    return new Promise((resolve) => {
    setTimeout(() => {
      if (email === 'admin@reservas.com' && password === '123456') {
        resolve({ ok: true, usuario: 'Gabriel' });
      } else {
        resolve({ ok: false });
      }
    }, 1000);
  });
};
