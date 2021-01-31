import axios from "axios";

export default class APIService {
  static _API_URL = "/api";
  constructor() {}

  static async signup(email, password, name) {
    return await axios.post(`${APIService._API_URL}/users/create`, {
      email,
      name,
      password,
    });
  }

  static async login(email, password) {
    return await axios.post(`${APIService._API_URL}/auth/login`, {
      email,
      password,
    });
  }

  static async auth() {
    return await axios.post(`${APIService._API_URL}/auth`, {
      withCredentials: true,
    });
  }
}
