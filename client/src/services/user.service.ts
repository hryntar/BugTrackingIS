import { apiClient } from '@/lib/api-client'
import type { User } from '@/lib/types'

export const userService = {
   async getUsers(): Promise<User[]> {
      const response = await apiClient.get<User[]>('/users')
      return response.data
   },

   async getUserById(id: number): Promise<User> {
      const response = await apiClient.get<User>(`/users/${id}`)
      return response.data
   },
}
