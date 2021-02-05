import axios, { AxiosRequestConfig } from "axios";

export default class APIService {
  static _API_URL = "http://localhost:3030/";
  constructor() {}

  static async signup(email:string, password:string, name:string ) {
    return await axios.post(`${APIService._API_URL}/users/create`, {
      email,
      name,
      password,
    });
  }

  static async login(email:string, password:string) {
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

  static async getDomains(axiosOptions: AxiosRequestConfig){
    return await axios.post(`http://localhost:3030/domains/`,{},{
      withCredentials: true,
      ...axiosOptions
    })
  }


  static async createDomain(address:string ,axiosOptions:AxiosRequestConfig){
    return await axios.post(`${APIService._API_URL}/domains/create`,{address},{
      withCredentials: true,
      ...axiosOptions
    })
  }

  static async getDomainPages(domainKey: string, axiosOptions: AxiosRequestConfig){
    return await axios.post('http://localhost:3030/domains/pages',{key:domainKey},{
      withCredentials: true,
      ...axiosOptions
    })
  }
}