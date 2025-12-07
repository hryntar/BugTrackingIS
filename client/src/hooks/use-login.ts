import { useMutation } from '@tanstack/react-query'
import { useRouter } from '@tanstack/react-router'
import { authService } from '@/services/auth.service'
import type { LoginRequest } from '@/lib/types'

export function useLogin() {
   const router = useRouter()

   return useMutation({
      mutationFn: (data: LoginRequest) => authService.login(data),
      onSuccess: (response) => {
         authService.setToken(response.token)
         router.invalidate()
         window.location.href = '/'
      },
   })
}
