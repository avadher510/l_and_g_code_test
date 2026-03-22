import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { cartApi } from '../api/cartApi';
import { useCartStore } from '../store/cartStore';

export function useCart() {
  const cartId = useCartStore((state) => state.cartId);

  return useQuery({
    queryKey: ['cart', cartId],
    queryFn: () => cartApi.getById(cartId!),
    enabled: !!cartId,
  });
}

export function useCreateCart() {
  const setCartId = useCartStore((state) => state.setCartId);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: cartApi.create,
    onSuccess: (cart) => {
      setCartId(cart.id);
      queryClient.setQueryData(['cart', cart.id], cart);
    },
  });
}

export function useAddToCart() {
  const cartId = useCartStore((state) => state.cartId);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ productId, quantity }: { productId: string; quantity: number }) =>
      cartApi.addItem(cartId!, productId, quantity),
    onSuccess: (cart) => {
      queryClient.setQueryData(['cart', cartId], cart);
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });
}

export function useUpdateCartItem() {
  const cartId = useCartStore((state) => state.cartId);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ productId, quantity }: { productId: string; quantity: number }) =>
      cartApi.updateItemQuantity(cartId!, productId, quantity),
    onSuccess: (cart) => {
      queryClient.setQueryData(['cart', cartId], cart);
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });
}

export function useRemoveFromCart() {
  const cartId = useCartStore((state) => state.cartId);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (productId: string) => cartApi.removeItem(cartId!, productId),
    onSuccess: (cart) => {
      queryClient.setQueryData(['cart', cartId], cart);
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });
}
