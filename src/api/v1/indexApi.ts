import { axiosApi } from '../axios'

import authApi from './authApi'
import projectApi from './projectApi'

const getItems = async (endpoint: string, params: any) => {
  const response = await axiosApi.get(`/${endpoint}`, { params })
  return response.data
}

const getItem = async (endpoint: string, id: number) => {
  const response = await axiosApi.get(`/${endpoint}/${id}`)
  return response.data
}

const createItem = async (endpoint: string, params: any) => {
  const response = await axiosApi.post(`/${endpoint}`, params)
  return response.data
}

const updateItem = async (endpoint: string, id: number, params: any) => {
  const response = await axiosApi.patch(`/${endpoint}/${id}`, params)
  return response.data
}

const updateItemWithSpecificAction = async (
  endpoint: string,
  id: number,
  action: string,
  params: any,
) => {
  const response = await axiosApi.patch(`/${endpoint}/${action}/${id}`, params)
  return response.data
}

const deleteItem = async (endpoint: string, id: number) => {
  const response = await axiosApi.delete(`/${endpoint}/${id}`)
  return response.data
}

export default {
  ...authApi,
  ...projectApi,
  getItems,
  getItem,
  createItem,
  updateItem,
  updateItemWithSpecificAction,
  deleteItem,
}
