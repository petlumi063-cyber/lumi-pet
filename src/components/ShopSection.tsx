/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Search, Filter, Star, ShoppingCart, Eye, Plus, Minus, 
  Trash2, X, CheckCircle, PackageOpen, Tag, MapPin, Keyboard
} from 'lucide-react';
import { Product, CartItem } from '../types';
import { SHOP_PRODUCTS } from '../data';

// Helper for Vietnamese currency formatting
export const formatVND = (price: number) => {
  return price.toLocaleString('vi-VN') + ' ₫';
};

interface ShopSectionProps {
  cartItems: CartItem[];
  onAddToCart: (product: Product, quantity: number) => void;
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onRemoveFromCart: (productId: string) => void;
  onClearCart: () => void;
  isCartOpen: boolean;
  onCloseCart: () => void;
  onOpenCart: () => void;
}

export default function ShopSection({
  cartItems,
  onAddToCart,
  onUpdateQuantity,
  onRemoveFromCart,
  onClearCart,
  isCartOpen,
  onCloseCart,
  onOpenCart,
}: ShopSectionProps) {
  // State
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [qtyToBuy, setQtyToBuy] = useState(1);
  
  // Checkout Form State
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [buyerName, setBuyerName] = useState('');
  const [buyerPhone, setBuyerPhone] = useState('');
  const [buyerAddress, setBuyerAddress] = useState('');
  const [buyerNote, setBuyerNote] = useState('');
  const [orderSuccess, setOrderSuccess] = useState<boolean>(false);
  const [orderCode, setOrderCode] = useState('');

  // Categories definition
  const categoriesList = [
    { id: 'all', label: 'Tất Cả Sản Phẩm' },
    { id: 'food', label: 'Thức Ăn Dinh Dưỡng' },
    { id: 'toy', label: 'Đồ Chơi Thú Cưng' },
    { id: 'accessory', label: 'Phụ Kiện Thời Trang' },
    { id: 'grooming', label: 'Dầu Gội & Grooming' },
  ];

  // Filtering products
  const filteredProducts = SHOP_PRODUCTS.filter((product) => {
    // Some products are placeholders with undefined stats
    if (!product.name) return false;
    
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          (product.description && product.description.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  // Calculate Cart Subtotal
  const cartSubtotal = cartItems.reduce((acc, item) => acc + item.product.price * item.quantity, 0);

  const handleProductClick = (product: Product) => {
    setSelectedProduct(product);
    setQtyToBuy(1);
  };

  const handleModalAddToCart = () => {
    if (selectedProduct) {
      onAddToCart(selectedProduct, qtyToBuy);
      setSelectedProduct(null);
    }
  };

  const handleCheckoutSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!buyerName || !buyerPhone || !buyerAddress) {
      alert('Vui lòng điền đầy đủ thông tin giao hàng gồm Tên, Số điện thoại và Địa chỉ!');
      return;
    }

    const code = 'DH-' + Math.floor(100000 + Math.random() * 900000);
    setOrderCode(code);
    setOrderSuccess(true);
    setIsCheckingOut(false);
    onClearCart();
  };

  return (
    <div className="py-10 bg-slate-50/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Search and Title Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b border-orange-100">
          <div>
            <h2 className="text-3xl font-extrabold text-slate-800 tracking-tight font-display">
              Đại Siêu Thị <span className="text-amber-500">Pet Shop</span> CoCo
            </h2>
            <p className="text-slate-500 mt-2 text-sm sm:text-base">
              Cam kết 100% thức ăn hữu cơ, phụ kiện và đồ chơi cao cấp nhập khẩu chính ngạch từ Pháp, Nhật và Hàn Quốc.
            </p>
          </div>
          
          {/* Quick Search */}
          <div className="relative w-full md:max-w-xs">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-slate-400">
              <Search className="w-5 h-5" />
            </span>
            <input
              type="text"
              id="shop-search-input"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Tìm kiếm hạt, can câu, đồ chơi..."
              className="w-full pl-10 pr-4 py-3 rounded-2xl bg-white border border-orange-100 text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-amber-400 text-sm shadow-xs transition-all"
            />
          </div>
        </div>

        {/* Categories Bar */}
        <div className="flex items-center space-x-2 overflow-x-auto py-6 no-scrollbar">
          {categoriesList.map((cat) => (
            <button
              key={cat.id}
              id={`cat-filter-${cat.id}`}
              onClick={() => setSelectedCategory(cat.id)}
              className={`flex-shrink-0 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all duration-200 cursor-pointer ${
                selectedCategory === cat.id
                  ? 'bg-amber-500 text-white shadow-md shadow-amber-500/10'
                  : 'bg-white border border-orange-50 text-slate-650 hover:bg-amber-50/50 hover:border-amber-200'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Products Grid */}
        {filteredProducts.length === 0 ? (
          <div className="py-20 text-center rounded-3xl bg-white border border-dashed border-slate-200 max-w-xl mx-auto my-10 px-6">
            <PackageOpen className="w-16 h-16 mx-auto text-slate-300 stroke-1 animate-bounce" />
            <h3 className="text-xl font-bold text-slate-700 mt-4 font-display">Không tìm thấy sản phẩm phù hợp</h3>
            <p className="text-slate-500 text-sm mt-2">
              Hãy thử gõ cụm từ tìm kiếm khác hoặc đổi thẻ chủ đề phân loại để tham khảo thêm bé yêu nhé.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <motion.div
                key={product.id}
                id={`product-card-${product.id}`}
                layout
                className={`group relative bg-white rounded-3xl border border-orange-100/60 shadow-xs hover:shadow-xl hover:border-amber-200 transition-all duration-300 overflow-hidden flex flex-col justify-between ${
                  !product.isAvailable ? 'opacity-70' : ''
                }`}
              >
                
                {/* Out of Stock Ribbon / Discount Tag */}
                {!product.isAvailable && (
                  <div className="absolute top-3 left-3 z-10 bg-slate-500/90 text-white px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider shadow-sm">
                    Tạm hết hàng
                  </div>
                )}
                {product.isAvailable && product.originalPrice && (
                  <div className="absolute top-3 left-3 z-10 bg-rose-500 text-white px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider shadow-sm flex items-center space-x-1">
                    <Tag className="w-3 h-3" />
                    <span>Sale</span>
                  </div>
                )}

                {/* Rating / Review Tag Top Right */}
                {product.rating && (
                  <div className="absolute top-3 right-3 z-10 bg-white/95 backdrop-blur-xs text-amber-550 border border-amber-50 px-2 py-1 rounded-lg text-[11px] font-bold flex items-center space-x-0.5 shadow-xs">
                    <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                    <span>{product.rating}</span>
                  </div>
                )}

                {/* Image Section */}
                <div className="aspect-square bg-slate-50 overflow-hidden p-6 flex items-center justify-center relative">
                  <img
                    src={product.image}
                    alt={product.name}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-contain transform group-hover:scale-106 transition-transform duration-550"
                  />
                  {/* Quick Action Overlay */}
                  <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center space-x-2">
                    <button
                      onClick={() => handleProductClick(product)}
                      className="p-3 bg-white hover:bg-amber-50 text-slate-800 hover:text-amber-600 rounded-full shadow-lg transition-transform hover:scale-110"
                      title="Xem chi tiết"
                    >
                      <Eye className="w-5 h-5" />
                    </button>
                    {product.isAvailable && (
                      <button
                        onClick={() => onAddToCart(product, 1)}
                        className="p-3 bg-amber-500 hover:bg-amber-600 text-white rounded-full shadow-lg transition-transform hover:scale-110"
                        title="Thêm vào giỏ hàng"
                      >
                        <ShoppingCart className="w-5 h-5" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Product Meta Body */}
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <span className="text-[10px] uppercase tracking-widest font-bold text-slate-400">
                      {product.breedTarget || 'Thân thiện thú cưng'}
                    </span>
                    <h3 
                      onClick={() => handleProductClick(product)}
                      className="text-sm font-bold text-slate-800 mt-1 hover:text-amber-500 cursor-pointer line-clamp-2 min-h-10 leading-snug"
                    >
                      {product.name}
                    </h3>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-50 flex items-center justify-between">
                    <div>
                      {product.originalPrice && (
                        <span className="block text-slate-400 line-through text-xs font-semibold">
                          {formatVND(product.originalPrice)}
                        </span>
                      )}
                      <span className="text-base font-extrabold text-slate-800">
                        {formatVND(product.price)}
                      </span>
                    </div>

                    {product.isAvailable ? (
                      <button
                        onClick={() => onAddToCart(product, 1)}
                        className="relative overflow-hidden bg-amber-50 hover:bg-amber-500 border border-amber-100 hover:border-amber-400 text-amber-600 hover:text-white px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-1 cursor-pointer"
                      >
                        <ShoppingCart className="w-3.5 h-3.5" />
                        <span className="hidden sm:inline">Mua</span>
                      </button>
                    ) : (
                      <span className="text-xs font-bold text-slate-400 bg-slate-100 py-1.5 px-3 rounded-lg">
                        Hết hàng
                      </span>
                    )}
                  </div>
                </div>

              </motion.div>
            ))}
          </div>
        )}

      </div>

      {/* Slide-out Cart Drawer */}
      <AnimatePresence>
        {isCartOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={onCloseCart}
              className="fixed inset-0 z-50 bg-black/60"
            />

            {/* Sidebar Container */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'tween', duration: 0.3 }}
              className="fixed right-0 top-0 bottom-0 z-50 w-full max-w-md bg-white shadow-2xl flex flex-col justify-between"
            >
              
              {/* Header */}
              <div className="p-5 border-b border-orange-50 flex items-center justify-between bg-orange-50/20">
                <div className="flex items-center space-x-2">
                  <div className="p-2 bg-amber-100 rounded-lg text-amber-600">
                    <ShoppingCart className="w-5 h-5" />
                  </div>
                  <span className="font-extrabold text-lg text-slate-800 font-display">
                    Giỏ hàng của bé ({cartItems.length})
                  </span>
                </div>
                <button
                  onClick={onCloseCart}
                  className="p-1.5 hover:bg-slate-100 text-slate-500 hover:text-slate-800 rounded-lg transition-colors cursor-pointer"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Success Order Overlay inside Cart Slot */}
              {orderSuccess ? (
                <div className="flex-1 p-6 flex flex-col items-center justify-center text-center">
                  <div className="w-16 h-16 bg-emerald-100 rounded-full text-emerald-600 flex items-center justify-center mb-4">
                    <CheckCircle className="w-10 h-10" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-850 font-display">Đặt hàng thành công!</h3>
                  <p className="text-slate-500 text-sm mt-2 max-w-xs">
                    Mã số đơn hàng là <span className="font-bold text-amber-600">{orderCode}</span>. Lumi Pet sẽ liên hệ gọi điện tư vấn xác nhận vận chuyển trong vòng 15-30 phút tới.
                  </p>
                  <button
                    onClick={() => {
                      setOrderSuccess(false);
                      onCloseCart();
                    }}
                    className="mt-6 px-6 py-2.5 bg-amber-500 hover:bg-amber-600 text-white rounded-xl text-sm font-bold shadow-xs cursor-pointer"
                  >
                    Tiếp tục mua sắm
                  </button>
                </div>
              ) : isCheckingOut ? (
                /* Checkout Form Panel */
                <div className="flex-1 overflow-y-auto p-5">
                  <div className="mb-4">
                    <button
                      onClick={() => setIsCheckingOut(false)}
                      className="text-xs font-bold text-amber-600 hover:text-amber-700 flex items-center space-x-1"
                    >
                      <span>← Quay lại giỏ sửa món</span>
                    </button>
                  </div>
                  <h3 className="text-lg font-bold text-slate-800 font-display border-b pb-2 mb-4">
                    Thông tin nhận hàng
                  </h3>

                  <form onSubmit={handleCheckoutSubmit} className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-550 uppercase tracking-wider mb-1.5" htmlFor="buyer-name">
                        Họ & Tên Chủ Nuôi *
                      </label>
                      <input
                        type="text"
                        required
                        id="buyer-name"
                        value={buyerName}
                        onChange={(e) => setBuyerName(e.target.value)}
                        placeholder="Ví dụ: Nguyễn Văn A"
                        className="w-full px-4 py-2.5 rounded-xl border border-orange-100/85 text-sm bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-550 uppercase tracking-wider mb-1.5" htmlFor="buyer-phone">
                        Số Điện Thoại Nhận Máy *
                      </label>
                      <input
                        type="tel"
                        required
                        id="buyer-phone"
                        value={buyerPhone}
                        onChange={(e) => setBuyerPhone(e.target.value)}
                        placeholder="Ví dụ: 0987654321"
                        className="w-full px-4 py-2.5 rounded-xl border border-orange-100/85 text-sm bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-550 uppercase tracking-wider mb-1.5" htmlFor="buyer-address">
                        Địa Chỉ Giao Tận Nhà *
                      </label>
                      <textarea
                        required
                        rows={3}
                        id="buyer-address"
                        value={buyerAddress}
                        onChange={(e) => setBuyerAddress(e.target.value)}
                        placeholder="Ví dụ: Số 12, Ngõ 45, Đường Lê Lợi, Quận Cầu Giấy, Hà Nội..."
                        className="w-full px-4 py-2.5 rounded-xl border border-orange-100/85 text-sm bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-550 uppercase tracking-wider mb-1.5" htmlFor="buyer-note">
                        Ghi chú gửi ship hàng (nếu có)
                      </label>
                      <input
                        type="text"
                        id="buyer-note"
                        value={buyerNote}
                        onChange={(e) => setBuyerNote(e.target.value)}
                        placeholder="Ví dụ: Giao ngoài giờ hành chính, gọi trước 10 phút..."
                        className="w-full px-4 py-2.5 rounded-xl border border-orange-100/85 text-sm bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                      />
                    </div>

                    {/* Order summary mini summary */}
                    <div className="bg-amber-50/50 rounded-2xl p-4 border border-amber-100/60 flex flex-col space-y-2 mt-4">
                      <div className="flex justify-between text-xs text-slate-500 font-semibold">
                        <span>Giá trị hàng hóa:</span>
                        <span>{formatVND(cartSubtotal)}</span>
                      </div>
                      <div className="flex justify-between text-xs text-slate-500 font-semibold">
                        <span>Vận chuyển (Phí ship):</span>
                        <span className="text-emerald-600 font-bold">Miễn phí ship</span>
                      </div>
                      <div className="h-px bg-slate-200 my-1" />
                      <div className="flex justify-between text-sm text-slate-805 font-bold">
                        <span>Tổng Thanh Toán:</span>
                        <span className="text-amber-600">{formatVND(cartSubtotal)}</span>
                      </div>
                    </div>

                    <button
                      type="submit"
                      id="submit-order-btn"
                      className="w-full py-3.5 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-extrabold rounded-2xl shadow-md transition-all mt-4 cursor-pointer"
                    >
                      XÁC NHẬN GỬI ĐƠN HÀNG COD
                    </button>
                  </form>
                </div>
              ) : (
                /* Standard Cart Item list */
                <div className="flex-1 overflow-y-auto p-5 space-y-4">
                  {cartItems.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-center text-slate-400 py-10 px-4">
                      <div className="text-5xl mb-4 select-none animate-pulse">📦</div>
                      <p className="text-slate-550 font-bold text-base font-display">Giỏ hàng rỗng sạch sẽ!</p>
                      <p className="text-xs text-slate-400 mt-1 max-w-[220px]">
                        Hãy lướt qua quầy siêu thị của Lumi Pet để sắm sửa những túi hạt pate ngon nhất cho boss nhé!
                      </p>
                    </div>
                  ) : (
                    cartItems.map((item) => (
                      <div
                        key={item.product.id}
                        className="flex items-center space-x-3 bg-slate-50 border border-slate-100/80 p-3 rounded-2xl relative"
                      >
                        {/* Image */}
                        <div className="w-16 h-16 bg-white border rounded-xl overflow-hidden flex items-center justify-center p-1 flex-shrink-0">
                          <img
                            src={item.product.image}
                            alt={item.product.name}
                            referrerPolicy="no-referrer"
                            className="w-full h-full object-contain"
                          />
                        </div>
                        {/* Meta */}
                        <div className="flex-1 min-w-0">
                          <h4 className="text-xs font-bold text-slate-800 line-clamp-1">
                            {item.product.name}
                          </h4>
                          <span className="block text-xs font-extrabold text-slate-500 mt-0.5">
                            {formatVND(item.product.price)}
                          </span>
                          
                          {/* Counter */}
                          <div className="flex items-center space-x-2 mt-2">
                            <button
                              onClick={() => {
                                if (item.quantity > 1) {
                                  onUpdateQuantity(item.product.id, item.quantity - 1);
                                } else {
                                  onRemoveFromCart(item.product.id);
                                }
                              }}
                              className="w-6 h-6 rounded-md bg-white border hover:bg-slate-100 flex items-center justify-center text-slate-650 cursor-pointer"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="text-xs font-bold px-1.5">{item.quantity}</span>
                            <button
                              onClick={() => onUpdateQuantity(item.product.id, item.quantity + 1)}
                              className="w-6 h-6 rounded-md bg-white border hover:bg-slate-100 flex items-center justify-center text-slate-650 cursor-pointer"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>
                        </div>

                        {/* Remove trash */}
                        <button
                          onClick={() => onRemoveFromCart(item.product.id)}
                          className="bg-white hover:bg-rose-50 text-slate-400 hover:text-rose-500 p-2 border border-slate-100 hover:border-rose-100 rounded-xl transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))
                  )}
                </div>
              )}

              {/* Bottom calculations & Checkout Button */}
              {cartItems.length > 0 && !isCheckingOut && !orderSuccess && (
                <div className="p-5 border-t border-orange-50 bg-slate-50/70">
                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between text-sm text-slate-500 font-semibold">
                      <span>Tạm tính giá trị:</span>
                      <span>{formatVND(cartSubtotal)}</span>
                    </div>
                    <div className="flex justify-between text-sm text-slate-500 font-semibold">
                      <span>Gói vận giao COD:</span>
                      <span className="text-emerald-600 font-bold">Freeship miễn phí</span>
                    </div>
                    <div className="h-px bg-slate-200 my-2" />
                    <div className="flex justify-between text-base text-slate-800 font-black">
                      <span>Thành tiền:</span>
                      <span className="text-amber-600">{formatVND(cartSubtotal)}</span>
                    </div>
                  </div>

                  <button
                    id="cart-checkout-btn"
                    onClick={() => setIsCheckingOut(true)}
                    className="w-full py-4 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-extrabold text-sm rounded-2xl shadow-md transition-all text-center flex items-center justify-center space-x-2 cursor-pointer"
                  >
                    <span>TIẾN HÀNH THANH TOÁN GIAO HÀNG</span>
                  </button>
                </div>
              )}

            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Lightbox details modal and item sheet */}
      <AnimatePresence>
        {selectedProduct && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.6 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedProduct(null)}
              className="fixed inset-0 z-50 bg-black/60"
            />
            
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="fixed inset-x-4 top-10 bottom-10 md:inset-auto md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:w-full md:max-w-2xl bg-white rounded-[32px] overflow-hidden shadow-2xl z-50 flex flex-col md:flex-row"
            >
              <button
                onClick={() => setSelectedProduct(null)}
                className="absolute top-4 right-4 p-2 bg-slate-100 hover:bg-slate-200 text-slate-650 hover:text-slate-800 rounded-full transition-colors z-10 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Left Column Image */}
              <div className="md:w-1/2 bg-slate-50 p-8 flex items-center justify-center relative select-none">
                <img
                  src={selectedProduct.image}
                  alt={selectedProduct.name}
                  referrerPolicy="no-referrer"
                  className="w-full max-h-60 object-contain"
                />
              </div>

              {/* Right Column Body details */}
              <div className="md:w-1/2 p-6 md:p-8 flex flex-col justify-between overflow-y-auto">
                <div>
                  <div className="inline-block bg-amber-50 text-amber-800 border border-amber-100 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider">
                    {selectedProduct.breedTarget || 'Dành cho thú cưng'}
                  </div>
                  
                  <h3 className="text-lg md:text-xl font-bold text-slate-800 mt-2.5 font-display leading-tight">
                    {selectedProduct.name}
                  </h3>

                  {/* Rating */}
                  {selectedProduct.rating && (
                    <div className="flex items-center space-x-1.5 mt-2">
                      <div className="flex text-amber-500">
                        {[...Array(5)].map((_, i) => (
                          <Star 
                            key={i} 
                            className={`w-3.5 h-3.5 ${
                              i < Math.floor(selectedProduct.rating) 
                                ? 'fill-amber-500 text-amber-500' 
                                : 'text-slate-300'
                            }`} 
                          />
                        ))}
                      </div>
                      <span className="text-xs font-semibold text-slate-500">
                        {selectedProduct.rating} ({selectedProduct.reviewsCount} đánh giá)
                      </span>
                    </div>
                  )}

                  {/* Price info */}
                  <div className="mt-4 flex items-baseline space-x-2">
                    <span className="text-xl font-black text-slate-850">
                      {formatVND(selectedProduct.price)}
                    </span>
                    {selectedProduct.originalPrice && (
                      <span className="text-sm font-semibold text-slate-400 line-through">
                        {formatVND(selectedProduct.originalPrice)}
                      </span>
                    )}
                  </div>

                  <p className="text-slate-500 text-sm mt-4 leading-relaxed font-sans border-t pt-4">
                    {selectedProduct.description}
                  </p>

                  <ul className="text-xs text-slate-550 space-y-1.5 mt-4 bg-orange-50/20 p-3 rounded-xl border border-orange-100/50">
                    <li className="flex items-center space-x-1">
                      <span className="font-bold text-slate-700">✓ Quy cách:</span>
                      <span>{selectedProduct.weightTarget || 'Đóng gói tiêu chuẩn'}</span>
                    </li>
                    <li className="flex items-center space-x-1">
                      <span className="font-bold text-slate-700">✓ Trạng thái:</span>
                      <span>{selectedProduct.isAvailable ? 'Sẵn hàng tại quầy' : 'Tạm hết hàng'}</span>
                    </li>
                  </ul>
                </div>

                {/* Purchase Button */}
                {selectedProduct.isAvailable ? (
                  <div className="mt-6 pt-4 border-t flex items-center space-x-4">
                    <div className="flex items-center border border-slate-200 rounded-xl bg-slate-50/50 p-1 flex-shrink-0">
                      <button
                        onClick={() => qtyToBuy > 1 && setQtyToBuy(qtyToBuy - 1)}
                        className="w-8 h-8 rounded-lg hover:bg-white text-slate-650 flex items-center justify-center cursor-pointer font-bold"
                      >
                        -
                      </button>
                      <span className="text-sm font-bold px-3 select-none">{qtyToBuy}</span>
                      <button
                        onClick={() => setQtyToBuy(qtyToBuy + 1)}
                        className="w-8 h-8 rounded-lg hover:bg-white text-slate-650 flex items-center justify-center cursor-pointer font-bold"
                      >
                        +
                      </button>
                    </div>

                    <button
                      onClick={handleModalAddToCart}
                      className="flex-1 py-3 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-extrabold text-sm rounded-xl transition-all shadow-sm cursor-pointer flex items-center justify-center space-x-2"
                    >
                      <ShoppingCart className="w-4 h-4" />
                      <span>THÊM VÀO GIỎ HÀNG</span>
                    </button>
                  </div>
                ) : (
                  <div className="mt-6 bg-slate-100 text-slate-500 py-3 rounded-xl text-center text-sm font-bold">
                    Sản phẩm này tạm hết hàng tại chi nhánh
                  </div>
                )}

              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

    </div>
  );
}
