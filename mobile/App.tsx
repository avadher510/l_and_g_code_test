import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView, StyleSheet, Text, View, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useProducts } from './src/hooks/useProducts';
import { useCart, useCreateCart, useAddToCart } from './src/hooks/useCart';
import { useCartStore } from './src/store/cartStore';
import { formatCurrency } from './src/utils/formatCurrency';
import type { Product } from './src/api/types';

const queryClient = new QueryClient();

function ProductsList() {
  const { data: products, isLoading, error } = useProducts();
  const cartId = useCartStore((state) => state.cartId);
  const createCart = useCreateCart();
  const addToCart = useAddToCart();

  const handleAddToCart = async (product: Product) => {
    if (!cartId) {
      await createCart.mutateAsync();
    }
    addToCart.mutate({ productId: product.id, quantity: 1 });
  };

  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>Error loading products</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={products}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <View style={styles.productCard}>
          <Text style={styles.productName}>{item.name}</Text>
          <Text style={styles.productPrice}>{formatCurrency(item.priceInPence)}</Text>
          <Text style={styles.productStock}>Available: {item.availableStock}</Text>
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => handleAddToCart(item)}
            disabled={item.availableStock === 0}
          >
            <Text style={styles.addButtonText}>
              {item.availableStock === 0 ? 'Out of Stock' : 'Add to Cart'}
            </Text>
          </TouchableOpacity>
        </View>
      )}
    />
  );
}

function CartSummary() {
  const cartId = useCartStore((state) => state.cartId);
  const { data: cart } = useCart();

  if (!cartId || !cart) {
    return (
      <View style={styles.cartSummary}>
        <Text style={styles.cartText}>Cart is empty</Text>
      </View>
    );
  }

  return (
    <View style={styles.cartSummary}>
      <Text style={styles.cartText}>
        {cart.totalItemCount} items • {formatCurrency(cart.subtotalInPence)}
      </Text>
    </View>
  );
}

function AppContent() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Retail Shopping</Text>
      </View>
      <ProductsList />
      <CartSummary />
      <StatusBar style="auto" />
    </SafeAreaView>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AppContent />
    </QueryClientProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    color: 'red',
    fontSize: 16,
  },
  productCard: {
    backgroundColor: '#fff',
    padding: 16,
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  productName: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
  },
  productPrice: {
    fontSize: 16,
    color: '#2e7d32',
    marginBottom: 4,
  },
  productStock: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
  },
  addButton: {
    backgroundColor: '#1976d2',
    padding: 12,
    borderRadius: 6,
    alignItems: 'center',
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  cartSummary: {
    backgroundColor: '#fff',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  cartText: {
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
});
