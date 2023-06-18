import { axiosApi } from '../axios'
import { iMoveTaskPayload } from '@/types/taskTypes'

const moveTask = async ({
  taskId,
  ...payload
}: { taskId: number } & iMoveTaskPayload): Promise<void> => {
  return await axiosApi.patch(`/tasks/move/${taskId}`, payload)
}

export default {
  moveTask,
}
