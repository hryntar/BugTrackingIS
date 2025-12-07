import { useMutation } from '@tanstack/react-query'
import { useRouter } from '@tanstack/react-router'
import { authService } from '@/services/auth.service'
import { useAuth } from './use-auth'
import type { LoginRequest } from '@/lib/types'

export function useLogin() {
   const router = useRouter()
   const { refetch } = useAuth()

   return useMutation({
      mutationFn: (data: LoginRequest) => authService.login(data),
      onSuccess: async (response) => {
         authService.setToken(response.token)
         await refetch()
         router.invalidate()
         router.navigate({ to: '/' })
      },
   })
}
