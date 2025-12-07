import { useMutation } from '@tanstack/react-query'
import { useRouter } from '@tanstack/react-router'
import { authService } from '@/services/auth.service'
import type { RegisterRequest } from '@/lib/types'

export function useRegister() {
   const router = useRouter()

   return useMutation({
      mutationFn: (data: RegisterRequest) => authService.register(data),
      onSuccess: (response) => {
         authService.setToken(response.token)
         router.invalidate()
         window.location.href = '/'
      },
   })
}
