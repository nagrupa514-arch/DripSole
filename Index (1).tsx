/* ===== Dr1pSole — Main Page ===== */

import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import Navbar from "@/components/dr1psole/Navbar";
import HeroSection from "@/components/dr1psole/HeroSection";
import ProductsSection from "@/components/dr1psole/ProductsSection";
import CartPanel from "@/components/dr1psole/CartPanel";
import LoginModal from "@/components/dr1psole/LoginModal";
import Footer from "@/components/dr1psole/Footer";
import WhatsAppButton from "@/components/dr1psole/WhatsAppButton";
import LoadingScreen from "@/components/dr1psole/LoadingScreen";
import type { Product, CartItem } from "@/components/dr1psole/types";

const Index = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [cartOpen, setCartOpen] = useState(false);
  const [loginOpen, setLoginOpen] = useState(false);
  const [cart, setCart] = useState<CartItem[]>([]);

  // Simulate loading animation
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  // Cart total
  const cartTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  // Add product to cart
  const addToCart = useCallback((product: Product) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
    toast.success(`${product.name} added to cart`);
  }, []);

  // Update item quantity
  const updateQuantity = useCallback((id: number, delta: number) => {
    setCart((prev) =>
      prev
        .map((item) =>
          item.id === id ? { ...item, quantity: item.quantity + delta } : item
        )
        .filter((item) => item.quantity > 0)
    );
  }, []);

  // Remove item
  const removeItem = useCallback((id: number) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
    toast("Item removed from cart");
  }, []);

  // Buy Now — navigate to checkout with the single product
  const handleBuyNow = useCallback((product: Product) => {
    const buyItem: CartItem = { ...product, quantity: 1 };
    navigate("/checkout", { state: { items: [buyItem], total: product.price } });
  }, [navigate]);

  // Checkout from cart — navigate to checkout with all cart items
  const handleCheckout = useCallback(() => {
    setCartOpen(false);
    navigate("/checkout", { state: { items: cart, total: cartTotal } });
  }, [navigate, cart, cartTotal]);

  return (
    <>
      <LoadingScreen isLoading={isLoading} />
      <Navbar
        cartCount={cartCount}
        onCartClick={() => setCartOpen(true)}
        onLoginClick={() => setLoginOpen(true)}
      />
      <main>
        <HeroSection />
        <ProductsSection onAddToCart={addToCart} onBuyNow={handleBuyNow} />
      </main>
      <Footer />
      <WhatsAppButton />

      {/* Modals & Panels */}
      <CartPanel
        isOpen={cartOpen}
        onClose={() => setCartOpen(false)}
        items={cart}
        onUpdateQuantity={updateQuantity}
        onRemove={removeItem}
        onCheckout={handleCheckout}
      />
      <LoginModal isOpen={loginOpen} onClose={() => setLoginOpen(false)} />
    </>
  );
};

export default Index;
