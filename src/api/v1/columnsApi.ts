import { iColumn } from '@/types/columnTypes'

import { axiosApi } from '../axios'

const updateColumns = async (columns: iColumn[]) => {
  await axiosApi.patch('/columns', columns)
}

export default {
  updateColumns,
}
