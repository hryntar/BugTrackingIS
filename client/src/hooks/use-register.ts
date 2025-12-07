import { useMutation } from '@tanstack/react-query'
import { useRouter } from '@tanstack/react-router'
import { authService } from '@/services/auth.service'
import { useAuth } from './use-auth'
import type { RegisterRequest } from '@/lib/types'

export function useRegister() {
   const router = useRouter()
   const { refetch } = useAuth()

   return useMutation({
      mutationFn: (data: RegisterRequest) => authService.register(data),
      onSuccess: async (response) => {
         authService.setToken(response.token)
         await refetch()
         router.invalidate()
         router.navigate({ to: '/' })
      },
   })
}