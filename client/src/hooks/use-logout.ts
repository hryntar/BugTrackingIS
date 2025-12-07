import { useMutation } from '@tanstack/react-query'
import { useRouter } from '@tanstack/react-router'
import { authService } from '@/services/auth.service'

export function useLogout() {
   const router = useRouter()

   return useMutation({
      mutationFn: async () => {
         authService.removeToken()
      },
      onSuccess: () => {
         router.invalidate()
         window.location.href = '/login'
      },
   })
}
