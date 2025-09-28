const API_BASE_URL = 'http://localhost:3000/api';

interface SignupData {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  phone_number: string;
  country: string;
  agreement?: boolean;
}

interface SigninData {
  email: string;
  password: string;
}

interface ApiResponse {
  success: boolean;
  message: string;
  token?: string;
  user?: any;
  result?: any;
}

class ApiService {
  private getAuthHeaders() {
    const token = localStorage.getItem('FF_BioGuide_token');
    return {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` })
    };
  }

  async signup(data: SignupData): Promise<ApiResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/signup`, {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(data)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Signup failed');
      }

      return await response.json();
    } catch (error) {
      console.error('Signup error:', error);
      throw error;
    }
  }

  async signin(data: SigninData): Promise<ApiResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/signin`, {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(data)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Signin failed');
      }

      return await response.json();
    } catch (error) {
      console.error('Signin error:', error);
      throw error;
    }
  }

  async logout(): Promise<ApiResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/logout`, {
        method: 'POST',
        headers: this.getAuthHeaders()
      });

      return await response.json();
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    }
  }
}

export const apiService = new ApiService();
