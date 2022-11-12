import axios, { AxiosResponse } from "axios";
import { API_URL } from "./url";

export interface LoginInput {
  username: string;
  password: string;
}

export interface SignupInput extends LoginInput {
  full_name: string;
}

export interface SelfResponse {
  data: {
    full_name: string;
    username: string;
  };
}

export interface LoginResponse {
  data: {
    access_token: string;
  };
}

export async function fetchSelf(token: string) {
  try {
    const res = await axios.get(`${API_URL}/auth/`, {
      headers: {
        authorization: `Bearer ${token}`,
      },
    });

    return res;
  } catch (error) {
    throw error;
  }
}

export async function fetchLogin(input: LoginInput) {
  try {
    const res = await axios.post<LoginResponse>(`${API_URL}/auth/login`, input);

    return res;
  } catch (error) {
    throw error;
  }
}

export async function fetchSignup(input: SignupInput) {
  try {
    const res = await axios.post(`${API_URL}/auth/signup`, input);

    return res;
  } catch (error) {
    throw error;
  }
}
