import { useMutation, useQueryClient } from '@tanstack/react-query';
import { checkoutApi } from '../api/checkoutApi';
import { useCartStore } from '../store/cartStore';

export function useCheckout() {
  const cartId = useCartStore((state) => state.cartId);
  const clearCartId = useCartStore((state) => state.clearCartId);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => checkoutApi.processCheckout(cartId!),
    onSuccess: () => {
      clearCartId();
      queryClient.invalidateQueries({ queryKey: ['cart'] });
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });
}
