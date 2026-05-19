export class AuthService {
  async validateToken(token) {
    if (token === 'token-secreto-admin') {
      return { id: 1, username: 'admin' };
    }
    return null;
  }

  async login(username, password) {
    if (username === 'admin' && password === '1234') {
      return { token: 'token-secreto-admin', username };
    }
    throw new Error('Credenciais inválidas');
  }
}