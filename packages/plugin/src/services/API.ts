import axios, { AxiosRequestConfig } from 'axios'
import {
  PageType,
  CommentType,
  User,
  ChildrenResponse
} from '../constants/types'

export default class APIService {
  static _API_URL = 'http://localhost:3030'
  constructor() {}

  static async signup(email: string, password: string, name: string) {
    return await axios.post(`${APIService._API_URL}/users/create`, {
      email,
      name,
      password
    })
  }

  static async login(email: string, password: string) {
    return await axios.post(
      `${APIService._API_URL}/auth/login`,
      {
        email,
        password
      },
      {
        withCredentials: true
      }
    )
  }

  static async auth() {
    return await axios.post(
      `${APIService._API_URL}/auth`,
      {},
      {
        withCredentials: true
      }
    )
  }

  static async getDomains(axiosOptions: AxiosRequestConfig) {
    return await axios.post(
      `http://localhost:3030/domains/`,
      {},
      {
        withCredentials: true,
        ...axiosOptions
      }
    )
  }

  static async createDomain(address: string, axiosOptions: AxiosRequestConfig) {
    return await axios.post(
      `${APIService._API_URL}/domains/create`,
      { address },
      {
        withCredentials: true,
        ...axiosOptions
      }
    )
  }

  static async getDomainPages(
    domainKey: string,
    axiosOptions: AxiosRequestConfig
  ): Promise<{
    data: {
      page: Array<PageType>
      comment: CommentType[]
      commentedBy: User[]
      replyCount: number[]
    }
  }> {
    return await axios.post(
      'http://localhost:3030/domains/pages',
      { domainKey },
      {
        withCredentials: true,
        ...axiosOptions
      }
    )
  }

  static async createComment(
    commentId: string | null,
    mdText: string,
    status: string,
    url: string,
    title: string,
    domainKey: string
  ):  Promise<{
    data: CommentType
  }> {
    return await axios.post(
      `${APIService._API_URL}/comments/add`,
      {
        commentId,
        mdText,
        status,
        url,
        title,
        domainKey
      },
      {
        withCredentials: true
      }
    )
  }



  static async updateComment(commentId: string, status: string) {
    return await axios.post(
      `${APIService._API_URL}/comments/update`,
      {
        commentId,
        status
      },
      {
        withCredentials: true
      }
    )
  }

  static async getParentComments(domainKey: string) {
    return await axios.post(
      `${APIService._API_URL}/pages`,
      {
        domainKey
      },
      {
        withCredentials: true
      }
    )
  }

  static async getCompleteThread(
    commentId: string
  ): Promise<{ data: ChildrenResponse }> {
    return await axios.post(
      `${APIService._API_URL}/comments/thread`,
      {
        commentId
      },
      {
        withCredentials: true
      }
    )
  }
}
