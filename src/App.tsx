/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Sparkles, 
  Star, 
  Search, 
  ShieldCheck, 
  HeartPulse, 
  Filter, 
  ChevronDown, 
  ShoppingBag, 
  X, 
  Check, 
  Heart, 
  Plus, 
  Minus, 
  Trash2, 
  Calendar, 
  Clock, 
  AlertTriangle, 
  User, 
  Phone, 
  Mail, 
  FileText, 
  CheckCircle2, 
  ThumbsUp, 
  MapPin, 
  ArrowRight, 
  Instagram, 
  Info,
  Gift,
  AlertCircle
} from 'lucide-react';

import Navbar from './components/Navbar';
import Hero from './components/Hero';
import PricingSection from './components/PricingSection';
import EmailVoucherModal from './components/EmailVoucherModal';
import { SPA_SERVICES, HOTEL_ROOMS, SHOP_PRODUCTS, CLIENT_REVIEWS, FAQS } from './data';
import { Product, SpaService, HotelRoom, CartItem, Booking, Review } from './types';

export default function App() {
  // Navigation & UI States
  const [activeTab, setActiveTab] = useState<string>('home');
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  
  // App Core States
  const [cart, setCart] = useState<CartItem[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [toastType, setToastType] = useState<'success' | 'info'>('success');
  
  // Booking Form State
  const [isBookingModalOpen, setIsBookingModalOpen] = useState<boolean>(false);
  const [bookingFormData, setBookingFormData] = useState({
    customerName: '',
    customerPhone: '',
    customerEmail: '',
    petName: '',
    petType: 'dog' as 'dog' | 'cat',
    petWeight: 5,
    bookingType: 'spa' as 'spa' | 'hotel',
    serviceId: SPA_SERVICES[0].id,
    date: '',
    timeSlot: '09:00 - 10:00',
    checkInDate: '',
    checkOutDate: '',
    notes: ''
  });
  
  // Custom Booking Search State for Booking History Checking
  const [searchPhoneQuery, setSearchPhoneQuery] = useState<string>('');
  const [hasSearchedBookings, setHasSearchedBookings] = useState<boolean>(false);
  const [searchResults, setSearchResults] = useState<Booking[]>([]);

  // Email voucher modal state in App
  const [selectedEmailBooking, setSelectedEmailBooking] = useState<Booking | null>(null);
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);

  const handleUpdateBookingEmail = (newEmail: string) => {
    if (!selectedEmailBooking) return;
    
    const updatedModel = { ...selectedEmailBooking, customerEmail: newEmail };
    setSelectedEmailBooking(updatedModel);
    
    // Update local bookings state
    const updated = bookings.map(b => b.id === selectedEmailBooking.id ? updatedModel : b);
    setBookings(updated);
    saveBookingsToStorage(updated);
    
    // Sync with search results list
    const updatedResults = searchResults.map(b => b.id === selectedEmailBooking.id ? updatedModel : b);
    setSearchResults(updatedResults);
  };

  // Shop page interactive states
  const [shopCategory, setShopCategory] = useState<string>('all');
  const [shopSearch, setShopSearch] = useState<string>('');
  const [likedProducts, setLikedProducts] = useState<string[]>([]);

  // Spa Page weight estimator state
  const [spaEstimatorWeight, setSpaEstimatorWeight] = useState<number>(5);
  const [spaEstimatorServiceId, setSpaEstimatorServiceId] = useState<string>(SPA_SERVICES[0].id);
  const [spaEstimatorPetType, setSpaEstimatorPetType] = useState<'dog' | 'cat'>('dog');

  // Hotel Page calculator states
  const [hotelCalculatorDays, setHotelCalculatorDays] = useState<number>(3);
  const [hotelCalculatorRoomId, setHotelCalculatorRoomId] = useState<string>(HOTEL_ROOMS[0].id);
  const [hotelCalculatorWeight, setHotelCalculatorWeight] = useState<number>(3.5);

  // Load bookings and cart from localStorage on init
  useEffect(() => {
    const savedBookings = localStorage.getItem('paws_perfect_bookings');
    if (savedBookings) {
      try {
        setBookings(JSON.parse(savedBookings));
      } catch (e) {
        console.error("Error restoration parsing", e);
      }
    }

    const savedCart = localStorage.getItem('paws_perfect_cart');
    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart));
      } catch (e) {
        console.error("Error restoration cart parsing", e);
      }
    }
  }, []);

  // Save changes to localStorage helper
  const saveBookingsToStorage = (updatedBookings: Booking[]) => {
    setBookings(updatedBookings);
    localStorage.setItem('paws_perfect_bookings', JSON.stringify(updatedBookings));
  };

  const saveCartToStorage = (updatedCart: CartItem[]) => {
    setCart(updatedCart);
    localStorage.setItem('paws_perfect_cart', JSON.stringify(updatedCart));
  };

  // Toast notification triggerrer
  const triggerToast = (msg: string, type: 'success' | 'info' = 'success') => {
    setToastMessage(msg);
    setToastType(type);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  // ADD TO CART handlers
  const handleAddToCart = (product: Product, quantity: number = 1) => {
    if (!product.isAvailable) {
      triggerToast('Sản phẩm tạm thời hết hàng!', 'info');
      return;
    }
    const existingIndex = cart.findIndex(item => item.product.id === product.id);
    let newCart = [...cart];
    
    if (existingIndex >= 0) {
      newCart[existingIndex].quantity += quantity;
    } else {
      newCart.push({ product, quantity });
    }
    
    saveCartToStorage(newCart);
    triggerToast(`Đã thêm vào giỏ hàng: ${product.name}`);
  };

  const handleUpdateCartQty = (productId: string, delta: number) => {
    const itemIndex = cart.findIndex(item => item.product.id === productId);
    if (itemIndex === -1) return;
    
    let newCart = [...cart];
    const newQty = newCart[itemIndex].quantity + delta;
    
    if (newQty <= 0) {
      newCart.splice(itemIndex, 1);
      triggerToast('Đã xoá một sản phẩm khỏi danh sách mua');
    } else {
      newCart[itemIndex].quantity = newQty;
    }
    saveCartToStorage(newCart);
  };

  const handleRemoveFromCart = (productId: string) => {
    const newCart = cart.filter(item => item.product.id !== productId);
    saveCartToStorage(newCart);
    triggerToast('Đã xoá sản phẩm khỏi giỏ hàng');
  };

  const handleToggleLikeProduct = (id: string, name: string) => {
    if (likedProducts.includes(id)) {
      setLikedProducts(likedProducts.filter(item => item !== id));
      triggerToast(`Đã xoá ${name} khỏi mục yêu thích`, 'info');
    } else {
      setLikedProducts([...likedProducts, id]);
      triggerToast(`Đã lưu ${name} vào mục yêu thích! ❤️`);
    }
  };

  // Booking handlers
  const openBookingModalWithSelections = (type: 'spa' | 'hotel', id: string) => {
    setBookingFormData(prev => ({
      ...prev,
      bookingType: type,
      serviceId: id
    }));
    setIsBookingModalOpen(true);
  };

  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Quick validation
    if (!bookingFormData.customerName.trim() || !bookingFormData.customerPhone.trim()) {
      triggerToast('Vui lòng điền đầy đủ Họ tên và Số điện thoại liên hệ!', 'info');
      return;
    }

    if (bookingFormData.bookingType === 'spa' && !bookingFormData.date) {
      triggerToast('Vui lòng chọn ngày thực hiện Spa thú cưng!', 'info');
      return;
    }

    if (bookingFormData.bookingType === 'hotel' && (!bookingFormData.checkInDate || !bookingFormData.checkOutDate)) {
      triggerToast('Vui lòng chọn đầy đủ ngày nhận và ngày trả phòng Khách sạn!', 'info');
      return;
    }

    // Computing Total Price
    let basePrice = 0;
    const weight = Number(bookingFormData.petWeight);

    const getWeightMultiplier = (w: number) => {
      if (w < 5) return 1.0;
      if (w >= 5 && w < 10) return 1.2;
      if (w >= 10 && w < 25) return 1.5;
      return 1.8;
    };

    if (bookingFormData.bookingType === 'spa') {
      const selectedSpa = SPA_SERVICES.find(s => s.id === bookingFormData.serviceId);
      const spaBase = selectedSpa ? selectedSpa.price : 150000;
      basePrice = Math.round(spaBase * getWeightMultiplier(weight));
    } else {
      const selectedRoom = HOTEL_ROOMS.find(r => r.id === bookingFormData.serviceId);
      const roomBase = selectedRoom ? selectedRoom.pricePerNight : 120000;
      
      // Calculate nights
      const checkInOffset = new Date(bookingFormData.checkInDate).getTime();
      const checkOutOffset = new Date(bookingFormData.checkOutDate).getTime();
      const differenceDays = Math.max(1, Math.ceil((checkOutOffset - checkInOffset) / (1000 * 3600 * 24)));
      
      // Apply long stay discount matching the estimator
      let discount = 1.0;
      if (differenceDays >= 10) {
        discount = 0.92; // 8% off
      } else if (differenceDays >= 5) {
        discount = 0.95; // 5% off
      }
      
      basePrice = Math.round(roomBase * differenceDays * getWeightMultiplier(weight) * discount);
    }

    const newBooking: Booking = {
      id: `BK-${Math.floor(100000 + Math.random() * 900000)}`,
      customerName: bookingFormData.customerName,
      customerPhone: bookingFormData.customerPhone,
      customerEmail: bookingFormData.customerEmail,
      petName: bookingFormData.petName || 'Thú cưng dễ thương',
      petType: bookingFormData.petType,
      petWeight: Number(bookingFormData.petWeight),
      bookingType: bookingFormData.bookingType,
      serviceType: bookingFormData.bookingType === 'spa' 
        ? (SPA_SERVICES.find(s => s.id === bookingFormData.serviceId)?.name || 'Spa Combo')
        : (HOTEL_ROOMS.find(r => r.id === bookingFormData.serviceId)?.name || 'Hotel Room'),
      serviceId: bookingFormData.serviceId,
      date: bookingFormData.bookingType === 'spa' ? bookingFormData.date : undefined,
      timeSlot: bookingFormData.bookingType === 'spa' ? bookingFormData.timeSlot : undefined,
      checkInDate: bookingFormData.bookingType === 'hotel' ? bookingFormData.checkInDate : undefined,
      checkOutDate: bookingFormData.bookingType === 'hotel' ? bookingFormData.checkOutDate : undefined,
      notes: bookingFormData.notes,
      totalPrice: basePrice,
      status: 'confirmed',
      createdAt: new Date().toLocaleDateString('vi-VN') + ' ' + new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })
    };

    const updatedBookings = [newBooking, ...bookings];
    saveBookingsToStorage(updatedBookings);
    
    // Switch to home or show my bookings dashboard immediately
    triggerToast('Đặt lịch thành công! Đơn hàng dịch vụ của bạn đã được phê duyệt tự động.');
    
    // Wipe specific dynamic form parts
    setBookingFormData(prev => ({
      ...prev,
      customerName: '',
      customerPhone: '',
      customerEmail: '',
      petName: '',
      notes: '',
      date: '',
      checkInDate: '',
      checkOutDate: ''
    }));
    
    setIsBookingModalOpen(false);
    
    // Automatically open checking page to view history voucher
    setSearchPhoneQuery(newBooking.customerPhone);
    handleSearchBookings(newBooking.customerPhone, updatedBookings);
    setActiveTab('faq'); // We will place history checker alongside FAQ
    
    // scroll to bottom where history exists or top
    setTimeout(() => {
      const historyElem = document.getElementById('history-section');
      if (historyElem) historyElem.scrollIntoView({ behavior: 'smooth' });
    }, 200);
  };

  // Searching appointment history handler
  const handleSearchBookings = (query: string, customBookingsList?: Booking[]) => {
    const targetList = customBookingsList || bookings;
    setHasSearchedBookings(true);
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }
    const filtered = targetList.filter(b => 
      b.customerPhone.includes(query.trim()) || 
      b.customerName.toLowerCase().includes(query.trim().toLowerCase())
    );
    setSearchResults(filtered);
  };

  // Cancel booking handler
  const handleCancelBooking = (bookingId: string) => {
    const updated = bookings.map(b => {
      if (b.id === bookingId) {
        return { ...b, status: 'cancelled' as const };
      }
      return b;
    });
    saveBookingsToStorage(updated);
    triggerToast('Đã huỷ buổi đặt lịch thành công!', 'info');
    
    // Refresh search list
    if (searchPhoneQuery) {
      handleSearchBookings(searchPhoneQuery, updated);
    }
  };

  // Spa dynamic fee estimate logic
  const computedSpaEstimate = (() => {
    const isCat = spaEstimatorPetType === 'cat';
    const weight = spaEstimatorWeight;
    
    // Determine service type:
    // spa-tam-say: Tắm vệ sinh (tvs)
    // spa-cacao: Tắm cạo (ctc)
    // spa-grooming: Tắm cắt tỉa (ctct)
    let serviceCategory: 'tvs' | 'ctc' | 'ctct' = 'tvs';
    if (spaEstimatorServiceId === 'spa-grooming') {
      serviceCategory = 'ctct';
    } else if (spaEstimatorServiceId === 'spa-cacao') {
      serviceCategory = 'ctc';
    }

    if (isCat) {
      if (serviceCategory === 'tvs') {
        if (weight < 3) return 150000;
        if (weight <= 6) return 200000;
        return 250000;
      } else {
        if (weight < 3) return 230000;
        if (weight <= 6) return 290000;
        return 350000;
      }
    } else {
      if (serviceCategory === 'tvs') {
        if (weight < 3) return 120000;
        if (weight <= 6) return 170000;
        if (weight <= 9) return 220000;
        if (weight <= 12) return 270000;
        return 350000;
      } else if (serviceCategory === 'ctc') {
        if (weight < 3) return 180000;
        if (weight <= 6) return 240000;
        if (weight <= 9) return 300000;
        if (weight <= 12) return 360000;
        return 460000;
      } else { // ctct
        if (weight < 3) return 260000;
        if (weight <= 6) return 320000;
        if (weight <= 9) return 380000;
        if (weight <= 12) return 450000;
        return 550000;
      }
    }
  })();

  // Hotel dynamic fee estimate logic
  const computedHotelEstimate = (() => {
    const weight = hotelCalculatorWeight;
    const room = HOTEL_ROOMS.find(r => r.id === hotelCalculatorRoomId) || HOTEL_ROOMS[0];
    
    let weightMultiplier = 1.0;
    if (weight < 5) {
      weightMultiplier = 1.0;
    } else if (weight >= 5 && weight < 10) {
      weightMultiplier = 1.2;
    } else if (weight >= 10 && weight < 25) {
      weightMultiplier = 1.5;
    } else {
      weightMultiplier = 1.8;
    }

    // Apply incremental discount based on hotel stay days
    let discount = 1.0;
    if (hotelCalculatorDays >= 10) {
      discount = 0.92; // 8% off
    } else if (hotelCalculatorDays >= 5) {
      discount = 0.95; // 5% off
    }

    return Math.round(room.pricePerNight * hotelCalculatorDays * weightMultiplier * discount);
  })();

  // Shopping cart absolute sum
  const cartTotalPrice = cart.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);

  // Cart Checkout Action
  const handleCheckoutCart = (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0) {
      triggerToast('Giỏ hàng trống!', 'info');
      return;
    }
    
    // In-app checkout confirmation simulation
    triggerToast('Đặt hàng thành công! Đội ngũ Lumi Pet sẽ sớm liên hệ xác nhận giao hàng qua số điện thoại của bạn.');
    saveCartToStorage([]); // clear cart
    setIsCartOpen(false);
  };

  // Shop filter logic
  const filteredProducts = SHOP_PRODUCTS.filter(prod => {
    const matchesCategory = shopCategory === 'all' || prod.category === shopCategory;
    const matchesSearch = prod.name.toLowerCase().includes(shopSearch.toLowerCase()) || 
                          prod.description.toLowerCase().includes(shopSearch.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="relative min-h-screen bg-bg-beige font-sans flex flex-col text-gray-800">
      
      {/* Dynamic Floating Toast */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -40, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="fixed top-24 left-1/2 -translate-x-1/2 z-50 w-full max-w-md px-4 pointer-events-none"
          >
            <div className={`p-4 rounded-2xl shadow-xl border flex items-center space-x-3 pointer-events-auto ${
              toastType === 'success' 
                ? 'bg-emerald-50 border-emerald-200 text-emerald-800 shadow-emerald-500/10' 
                : 'bg-orange-55 border-orange-200 text-orange-850 shadow-orange-500/10'
            }`}>
              <CheckCircle2 className={`w-5 h-5 flex-shrink-0 ${toastType === 'success' ? 'text-emerald-500' : 'text-orange-500'}`} />
              <div className="flex-1 text-sm font-bold">{toastMessage}</div>
              <button 
                className="text-gray-400 hover:text-gray-600 transition-colors p-1"
                onClick={() => setToastMessage(null)}
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Top Welcome Ribbon */}
      <div className="bg-orange-500 text-white py-2 px-4 text-center text-xs sm:text-sm font-bold flex items-center justify-center space-x-2 shadow-inner relative z-30">
        <Gift className="w-4.5 h-4.5 animate-bounce fill-orange-450 text-white" />
        <span>Khai trương chi nhánh sang chảnh mới: Giảm 20% dịch vụ Spa & Tặng 1 hộp Pate Royal Canin khi đặt phòng Hotel trên 3 ngày!</span>
      </div>

      {/* Navbar Component */}
      <Navbar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        cartCount={cart.reduce((sum, item) => sum + item.quantity, 0)}
        onOpenCart={() => setIsCartOpen(true)}
        onTriggerBooking={() => {
          setBookingFormData(prev => ({ ...prev, bookingType: 'spa' }));
          setIsBookingModalOpen(true);
        }}
      />

      {/* MAIN RENDER ENGINE */}
      <main className="flex-1 pb-16 relative z-10">
        
        {/* TAB 1: HOME SECTION */}
        {activeTab === 'home' && (
          <div>
            {/* Elegant Hero Segment */}
            <Hero onNavigate={(section) => {
              if (section === 'booking') {
                setIsBookingModalOpen(true);
              } else {
                setActiveTab(section);
              }
            }} />

            {/* Why Choose Us Features Area */}
            <section className="py-16 bg-white px-4">
              <div className="max-w-7xl mx-auto">
                <div className="text-center max-w-2xl mx-auto mb-12">
                  <span className="text-orange-500 text-xs font-bold uppercase tracking-widest block mb-2">Thế mạnh vượt trội</span>
                  <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 font-display">
                    Tại sao ba mẹ chọn <span className="text-orange-550">Lumi Pet</span>?
                  </h2>
                  <p className="text-gray-550 mt-3">Chúng tôi kết hợp trải nghiệm nghỉ dưỡng 5 sao sướng như hoàng gia cùng quy trình chăm sóc tỉ mỉ từng thói quen sinh hoạt của bé.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                  <div className="bg-[#FFFBEB] p-6 rounded-3xl border border-orange-50 text-center flex flex-col items-center">
                    <div className="w-14 h-14 bg-orange-100 rounded-full flex items-center justify-center text-orange-500 text-2xl font-bold mb-4">🥰</div>
                    <h4 className="text-lg font-bold text-gray-800">Đội Ngũ Bảo Mẫu Tận Tâm</h4>
                    <p className="text-sm text-gray-500 mt-2 leading-relaxed">Bộ phận chăm sóc giàu kinh nghiệm, yêu thương thú cưng hết mình, luôn nâng niu như con cái trong nhà.</p>
                  </div>

                  <div className="bg-[#FFFBEB] p-6 rounded-3xl border border-orange-50 text-center flex flex-col items-center">
                    <div className="w-14 h-14 bg-teal-100 rounded-full flex items-center justify-center text-teal-600 text-2xl font-bold mb-4">🛁</div>
                    <h4 className="text-lg font-bold text-gray-800">Vật Liệu Khử Trùng Mỹ</h4>
                    <p className="text-sm text-gray-500 mt-2 leading-relaxed">Cam kết chỉ sử dụng hoá chất sinh học hữu cơ lành tính không kích ứng giác mạc và lỗ hô hấp nhỏ của mèo con.</p>
                  </div>

                  <div className="bg-[#FFFBEB] p-6 rounded-3xl border border-orange-50 text-center flex flex-col items-center">
                    <div className="w-14 h-14 bg-rose-100 rounded-full flex items-center justify-center text-rose-500 text-2xl font-bold mb-4">🎥</div>
                    <h4 className="text-lg font-bold text-gray-800">Live Camera Web 24h</h4>
                    <p className="text-sm text-gray-500 mt-2 leading-relaxed">Giám sát riêng biệt, bảo mật tuyệt đối. Ba mẹ ngồi cơ quan hay đi du lịch nước ngoài đều ngắm con ăn pate tức thì.</p>
                  </div>

                  <div className="bg-[#FFFBEB] p-6 rounded-3xl border border-orange-50 text-center flex flex-col items-center">
                    <div className="w-14 h-14 bg-amber-100 rounded-full flex items-center justify-center text-amber-600 text-2xl font-bold mb-4">🍖</div>
                    <h4 className="text-lg font-bold text-gray-800">Bữa Ăn Chuẩn Nhà Hàng</h4>
                    <p className="text-sm text-gray-500 mt-2 leading-relaxed">Thịt tươi sơ chế trong ngày, kết hợp hạt Royal Canin, súp dinh dưỡng bổ trợ giúp lông bồng mượt bất chấp khí hậu.</p>
                  </div>
                </div>
              </div>
            </section>

            {/* Hot Spa & Hotel Promoted Section */}
            <section className="py-16 px-4">
              <div className="max-w-7xl mx-auto">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10">
                  <div>
                    <span className="text-orange-500 text-xs font-bold uppercase tracking-widest block mb-1">Dịch vụ tâm điểm</span>
                    <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 font-display">
                      Khám phá những Cabin nghỉ dưỡng tốt nhất
                    </h2>
                  </div>
                  <button 
                    onClick={() => setActiveTab('hotel')}
                    className="mt-4 md:mt-0 text-orange-550 font-bold flex items-center space-x-1.5 hover:text-orange-600 group"
                  >
                    <span>Xem tất cả các phòng kính</span>
                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {HOTEL_ROOMS.map(room => (
                    <div key={room.id} className="bg-white rounded-3xl overflow-hidden border border-orange-100 shadow-md group hover:border-orange-300 transition-all">
                      <div className="relative h-56 overflow-hidden">
                        <img 
                          src={room.image} 
                          alt={room.name} 
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                        />
                        <div className="absolute top-4 right-4 bg-orange-500 text-white font-bold text-xs px-3 py-1 rounded-full shadow-md">
                          Từ {room.pricePerNight.toLocaleString('vi-VN')}đ / đêm
                        </div>
                      </div>
                      <div className="p-6">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs font-bold text-teal-600 bg-teal-50 px-2.5 py-1 rounded-md">{room.capacity}</span>
                          <div className="flex items-center text-amber-500 text-xs font-bold">
                            <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500 mr-1" />
                            <span>{room.rating} / 5.0</span>
                          </div>
                        </div>
                        <h3 className="text-xl font-bold text-gray-800">{room.name}</h3>
                        <p className="text-gray-500 text-xs mt-1 line-clamp-2">{room.description}</p>
                        
                        <div className="mt-4 pt-4 border-t border-slate-100 space-y-1.5">
                          {room.amenities.slice(0, 3).map((a, idx) => (
                            <div key={idx} className="flex items-center text-xs text-gray-600">
                              <Check className="w-3.5 h-3.5 text-emerald-500 mr-1.5 flex-shrink-0" />
                              <span className="truncate">{a}</span>
                            </div>
                          ))}
                        </div>

                        <div className="mt-5 grid grid-cols-2 gap-3">
                          <button
                            onClick={() => openBookingModalWithSelections('hotel', room.id)}
                            className="w-full bg-[#FFFBEB] hover:bg-orange-50 border border-orange-200 text-orange-600 font-bold py-2.5 rounded-xl text-xs transition-colors cursor-pointer"
                          >
                            Đặt Cabin
                          </button>
                          <button
                            onClick={() => {
                              setHotelCalculatorRoomId(room.id);
                              setActiveTab('hotel');
                              setTimeout(() => {
                                document.getElementById('hotel_calculator_anchor')?.scrollIntoView({ behavior: 'smooth' });
                              }, 200);
                            }}
                            className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-2.5 rounded-xl text-xs transition-colors cursor-pointer"
                          >
                            Tính Giá Trực Tuyến
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* Special Premium Spa Promo Showcase */}
            <section className="bg-teal-550 text-white py-16 px-4 relative overflow-hidden">
              <div className="absolute top-[-50px] right-[-50px] w-96 h-96 bg-teal-600 rounded-full blur-3xl pointer-events-none opacity-40" />
              <div className="max-w-7xl mx-auto relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
                <div className="lg:col-span-7 flex flex-col space-y-5">
                  <span className="bg-white/20 select-none text-white px-3.5 py-1.5 rounded-full text-xs font-bold border border-white/25 w-fit uppercase tracking-widest">Grooming Masterclass</span>
                  <h2 className="text-3xl sm:text-4.5xl font-extrabold leading-tight font-display">
                    Trải Nghiệm Trị Liệu Trẻ Hoá <br /> & Tỉa Lông Nghệ Thuật Cho Thú Cưng
                  </h2>
                  <p className="text-teal-50 text-base leading-relaxed">
                    Được tắm bằng bùn khoáng Nhật Bản đào thải độc tố cơ nắp biểu bì dưới tia hồng ngoại massage sục ozone thư thái đầu óc tối đa. Sau cắt tỉa, thú cưng được phủ một lớp Keratin cao cấp giúp bảo quản nếp phồng óng mượt suốt nhiều tuần liền.
                  </p>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                    <div className="bg-white/10 p-3 rounded-2xl border border-white/10">
                      <span className="block text-xl">🛁 Step 1 - 3</span>
                      <span className="block text-xs font-bold mt-1 text-teal-100">Vệ sinh sâu 7 bước</span>
                    </div>
                    <div className="bg-white/10 p-3 rounded-2xl border border-white/10">
                      <span className="block text-xl">✂️ Step 4 - 5</span>
                      <span className="block text-xs font-bold mt-1 text-teal-100">Thiết kế form tạo kiểu</span>
                    </div>
                    <div className="bg-white/10 p-3 rounded-2xl border border-white/10">
                      <span className="block text-xl">✨ Step 6 - 7</span>
                      <span className="block text-xs font-bold mt-1 text-teal-100">Dưỡng sấy phồng chuyên sâu</span>
                    </div>
                  </div>

                  <div className="pt-4 flex flex-col sm:flex-row gap-4">
                    <button 
                      onClick={() => {
                        setBookingFormData(prev => ({ ...prev, bookingType: 'spa' }));
                        setIsBookingModalOpen(true);
                      }}
                      className="bg-orange-500 hover:bg-orange-600 text-white font-bold px-8 py-4 rounded-xl text-sm transition-colors cursor-pointer shadow-lg"
                    >
                      Bắt Đầu Đặt Spa Ngay
                    </button>
                    <button 
                      onClick={() => setActiveTab('spa')}
                      className="bg-white/10 hover:bg-white/20 text-white border border-white/30 font-bold px-8 py-4 rounded-xl text-sm transition-all cursor-pointer"
                    >
                      Bảng Giá Spa Khác
                    </button>
                  </div>
                </div>

                <div className="lg:col-span-5 flex justify-center">
                  <div className="relative bg-[#FFFBEB] p-6 rounded-[32px] w-full max-w-sm text-gray-800 shadow-2xl border-4 border-white">
                    <span className="absolute -top-3.5 -right-3.5 text-4xl transform rotate-12 bg-orange-500 p-2.5 rounded-full shadow-lg">🎁</span>
                    <h3 className="text-xl font-bold text-gray-900 border-b border-orange-100 pb-3 mb-4">Combo Hot Tuần</h3>
                    <div className="space-y-3.5">
                      <div className="flex items-start justify-between">
                        <div>
                          <span className="block font-bold text-sm text-gray-805">Spa & Vệ sinh móng mài sấy</span>
                          <span className="text-xs text-gray-500">Giảm giá ngày thường</span>
                        </div>
                        <span className="font-bold text-sm text-orange-550">150.000đ</span>
                      </div>
                      <div className="flex items-start justify-between">
                        <div>
                          <span className="block font-bold text-sm text-gray-850">Lưu trú Cabin standard</span>
                          <span className="text-xs text-gray-500">Đặt trước giữ chỗ</span>
                        </div>
                        <span className="font-bold text-sm text-orange-550">120.000đ</span>
                      </div>
                      <div className="flex items-start justify-between border-t border-orange-100 pt-3">
                        <span className="font-extrabold text-sm text-gray-900">Tổng Combo Trọn Gói</span>
                        <div className="text-right">
                          <span className="block text-xs line-through text-gray-400">270.000đ</span>
                          <span className="block font-extrabold text-base text-rose-500">216.000đ</span>
                        </div>
                      </div>
                    </div>
                    <button 
                      onClick={() => openBookingModalWithSelections('spa', 'spa-tam-say')}
                      className="w-full bg-teal-550 hover:bg-teal-600 text-white font-bold py-3 px-4 rounded-2xl text-xs mt-5 transition-colors cursor-pointer text-center"
                    >
                      Áp Dụng Nhận Khuyến Mãi
                    </button>
                  </div>
                </div>
              </div>
            </section>

            {/* Client Reviews Section */}
            <section className="py-16 px-4 max-w-7xl mx-auto">
              <div className="text-center max-w-xl mx-auto mb-10">
                <span className="text-orange-550 text-xs font-bold uppercase tracking-widest block mb-2">Đánh giá thực tế</span>
                <h2 className="text-3xl font-extrabold text-gray-900 font-display">Phản Hồi Từ Khách Hàng</h2>
                <p className="text-gray-550 text-sm mt-2">Tính minh bạch hàng đầu, tất cả đánh giá đều đến từ các ba mẹ có nick thật, thú thật được lưu trữ trên bản đồ và mạng xã hội.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {CLIENT_REVIEWS.map(rev => (
                  <div key={rev.id} className="bg-white p-5 rounded-3xl border border-orange-50 shadow-sm flex flex-col justify-between">
                    <div>
                      <div className="flex items-center space-x-1 text-sm text-amber-500 mb-2.5">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className={`w-3.5 h-3.5 ${i < Math.floor(rev.rating) ? 'fill-amber-500 text-amber-500' : 'text-gray-200'}`} />
                        ))}
                        <span className="text-xs font-bold text-gray-400 ml-1">({rev.rating})</span>
                      </div>
                      <p className="text-xs text-gray-650 leading-relaxed italic">"{rev.text}"</p>
                    </div>

                    <div className="flex items-center space-x-3 mt-4 pt-4 border-t border-slate-50">
                      <img src={rev.avatar} alt={rev.author} className="w-9 h-9 rounded-full object-cover border border-orange-200" />
                      <div>
                        <span className="block text-xs font-bold text-gray-800">{rev.author}</span>
                        <span className="block text-[10px] text-orange-500 font-semibold">{rev.petName} ({rev.petBreed})</span>
                      </div>
                      <span className="ml-auto text-[10px] bg-slate-100 px-2 py-0.5 rounded-full text-gray-550">{rev.serviceType}</span>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>
        )}

        {/* TAB: PRICING SECTION */}
        {activeTab === 'pricing' && (
          <PricingSection 
            onTriggerBooking={() => setIsBookingModalOpen(true)}
            onSelectServiceType={(type, details) => {
              setBookingFormData(prev => ({
                ...prev,
                bookingType: type,
                serviceId: details.id,
              }));
              setIsBookingModalOpen(true);
            }}
          />
        )}

        {/* TAB 2: PET SHOP SECTION */}
        {activeTab === 'shop' && (
          <div className="max-w-7xl mx-auto px-4 pt-8">
            <div className="text-center max-w-xl mx-auto mb-8">
              <span className="text-orange-500 text-xs font-bold uppercase tracking-widest block mb-2">Đại siêu thị trực tuyến</span>
              <h1 className="text-3xl sm:text-4.5xl font-extrabold text-gray-900 font-display">Pet Shop Cao Cấp</h1>
              <p className="text-gray-550 text-sm mt-2">Nhập khẩu chính ngạch 100% từ Pháp, Mỹ, Hàn Quốc. Đền bù 500% nếu phát hiện hàng giả, hàng kém chất lượng bảo đảm dạ dày các con.</p>
            </div>

            {/* Filtering & Search Row */}
            <div className="bg-white p-4 sm:p-5 rounded-3xl border border-orange-100 shadow-md mb-8 flex flex-col md:flex-row items-center justify-between gap-4">
              
              {/* Categories */}
              <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
                {[
                  { id: 'all', label: 'Tất Cả' },
                  { id: 'food', label: 'Thức Ăn 🍖' },
                  { id: 'toy', label: 'Đồ Chơi 🎾' },
                  { id: 'accessory', label: 'Phụ Kiện 🧣' },
                  { id: 'grooming', label: 'Vệ Sinh/Chải Lông 🧼' }
                ].map(cat => (
                  <button
                    key={cat.id}
                    onClick={() => setShopCategory(cat.id)}
                    className={`px-4 py-2 rounded-2xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                      shopCategory === cat.id 
                        ? 'bg-orange-500 text-white shadow-md shadow-orange-500/10' 
                        : 'bg-orange-50/50 hover:bg-orange-100/50 text-orange-600'
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>

              {/* Search Box */}
              <div className="relative w-full md:w-80">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-gray-400" />
                <input 
                  type="text" 
                  value={shopSearch}
                  onChange={(e) => setShopSearch(e.target.value)}
                  placeholder="Tìm thức ăn, lược chải, yếm dắt..."
                  className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-orange-100 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
                />
                {shopSearch && (
                  <button 
                    onClick={() => setShopSearch('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-450 hover:text-gray-650"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>

            {/* Product count status */}
            <div className="text-sm font-semibold text-gray-550 mb-5 flex items-center justify-between">
              <span>Đang hiển thị {filteredProducts.length} sản phẩm phù hợp</span>
              {likedProducts.length > 0 && (
                <span className="text-xs bg-rose-50 text-rose-600 px-3 py-1 rounded-full border border-rose-100">
                  ❤️ Đã lưu {likedProducts.length} sản phẩm yêu thích
                </span>
              )}
            </div>

            {/* Product Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {filteredProducts.map(prod => (
                <div 
                  key={prod.id} 
                  className={`bg-white rounded-[32px] overflow-hidden border border-orange-100 shadow-xs flex flex-col justify-between group hover:border-orange-300 transition-all ${
                    !prod.isAvailable ? 'opacity-80' : ''
                  }`}
                >
                  <div className="relative h-52 bg-slate-50 overflow-hidden flex items-center justify-center">
                    {prod.image ? (
                      <img 
                        src={prod.image} 
                        alt={prod.name} 
                        className="w-full h-full object-cover group-hover:scale-103 transition-transform"
                      />
                    ) : (
                      <div className="text-4xl text-gray-300">📦</div>
                    )}
                    
                    {/* Like button absolute */}
                    <button
                      onClick={() => handleToggleLikeProduct(prod.id, prod.name)}
                      className="absolute top-3 right-3 p-2 bg-white/90 backdrop-blur-xs rounded-full shadow-sm hover:text-rose-500 text-gray-400 hover:scale-105 transition-all cursor-pointer"
                    >
                      <Heart className={`w-4 h-4 ${likedProducts.includes(prod.id) ? 'fill-rose-500 text-rose-500' : ''}`} />
                    </button>

                    {/* Discount badge absolute */}
                    {prod.originalPrice && (
                      <div className="absolute top-3 left-3 bg-rose-500 text-white font-extrabold text-[10px] px-2.5 py-1 rounded-md uppercase tracking-wider shadow-sm">
                        Sale {Math.round(((prod.originalPrice - prod.price) / prod.originalPrice) * 100)}%
                      </div>
                    )}

                    {/* Breed targeting indicator on card hover */}
                    {prod.breedTarget && (
                      <div className="absolute bottom-2 left-2 bg-orange-600/90 text-white text-[9px] font-bold py-0.5 px-2 rounded-md">
                        {prod.breedTarget}
                      </div>
                    )}
                  </div>

                  <div className="p-5 flex-1 flex flex-col justify-between">
                    <div>
                      {/* Category helper */}
                      <span className="text-[10px] uppercase tracking-wider font-extrabold text-teal-650 bg-teal-50 px-2 py-0.5 rounded-md">
                        {prod.category === 'food' ? 'Hạt & Pate' : prod.category === 'toy' ? 'Đồ Chơi' : prod.category === 'accessory' ? 'Phụ Kiện' : 'Mỹ Phẩm / Spa'}
                      </span>
                      
                      <h3 className="font-extrabold text-sm text-gray-800 line-clamp-2 mt-2 group-hover:text-orange-550 transition-colors">
                        {prod.name}
                      </h3>
                      
                      <div className="flex items-center text-amber-500 text-xs font-bold mt-1 mb-2">
                        <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500 mr-1" />
                        <span>{prod.rating || '4.8'}</span>
                        <span className="text-gray-400 font-semibold ml-1">({prod.reviewsCount || '12'} reviews)</span>
                      </div>
                    </div>

                    <div>
                      <div className="flex items-baseline space-x-2 mt-2">
                        <span className="text-lg font-extrabold text-rose-500 font-display">
                          {prod.price ? prod.price.toLocaleString('vi-VN') : '0'}đ
                        </span>
                        {prod.originalPrice && (
                          <span className="text-xs text-gray-400 line-through font-medium">
                            {prod.originalPrice.toLocaleString('vi-VN')}đ
                          </span>
                        )}
                      </div>

                      {/* Add button inside wrapper */}
                      <div className="mt-4 pt-3 border-t border-slate-50 flex gap-2">
                        <button
                          onClick={() => setSelectedProduct(prod)}
                          className="flex-1 bg-orange-50 hover:bg-orange-150 text-orange-600 font-bold py-2 rounded-xl text-xs transition-colors cursor-pointer text-center"
                        >
                          Chi Tiết
                        </button>
                        
                        {prod.isAvailable ? (
                          <button
                            onClick={() => handleAddToCart(prod)}
                            className="bg-orange-500 hover:bg-orange-600 text-white font-bold p-2 rounded-xl text-xs transition-colors cursor-pointer flex items-center justify-center"
                            title="Thêm vào giỏ hàng"
                            id={`add-to-cart-btn-${prod.id}`}
                          >
                            <ShoppingBag className="w-4 h-4" />
                          </button>
                        ) : (
                          <span className="text-[10px] text-orange-550 bg-orange-55 px-2 py-2 rounded-xl font-bold flex items-center">
                            Đã Hết Hàng
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: SPA DỊCH VỤ */}
        {activeTab === 'spa' && (
          <div className="max-w-7xl mx-auto px-4 pt-8">
            {/* Header Block with Google Ads & CRO Optimization */}
            <div className="text-center max-w-3xl mx-auto mb-10">
              <span className="inline-flex items-center space-x-1 bg-amber-50 text-amber-800 border border-amber-100 rounded-full py-1 px-3 text-xs font-bold uppercase tracking-wider mb-2.5">
                🌟 Dịch Vụ Spa & Grooming Chó Mèo Cao Cấp Bình Thạnh
              </span>
              <h1 className="text-3xl sm:text-5xl font-black text-slate-800 tracking-tight font-display mb-3">
                SPA & GROOMING <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-500 to-orange-600">LUMI PET 24/7</span>
              </h1>
              <p className="text-sm text-slate-500 leading-relaxed font-sans max-w-2xl mx-auto">
                Bảng giá trọn gói tắm spa, vệ sinh cạo lông mát mẻ hay thiết kế mẫu cắt kéo nghệ thuật tuyệt vời cho thú cưng chó mèo của ba mẹ. Đội ngũ Groomer kinh nghiệm, phục vụ bằng cả trái tim yêu thương.
              </p>
            </div>

            {/* Value Pillars Block */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 max-w-4xl mx-auto mb-10 text-center">
              <div className="bg-white rounded-2xl border border-orange-100/60 p-4 shadow-3xs">
                <span className="text-2xl block mb-1">🛡️</span>
                <h4 className="text-xs font-bold text-slate-800">AN TOÀN LÀNH TÍNH</h4>
                <p className="text-[10px] text-slate-450 mt-0.5">Sử dụng 100% dòng sản phẩm sữa tắm organic nhập khẩu</p>
              </div>
              <div className="bg-white rounded-2xl border border-orange-100/60 p-4 shadow-3xs">
                <span className="text-2xl block mb-1">💖</span>
                <h4 className="text-xs font-bold text-slate-800">TẬN TÂM YÊU THƯƠNG</h4>
                <p className="text-[10px] text-slate-450 mt-0.5">Nuông chiều vuốt ve sướng thân như con trẻ nhà mình</p>
              </div>
              <div className="bg-white rounded-2xl border border-orange-100/60 p-4 shadow-3xs">
                <span className="text-2xl block mb-1">🧼</span>
                <h4 className="text-xs font-bold text-slate-800">VỆ SINH VÔ TRÙNG</h4>
                <p className="text-[10px] text-slate-450 mt-0.5">Không gian sạch sẽ thoáng mát, sấy diệt khuẩn kĩ càng</p>
              </div>
              <div className="bg-white rounded-2xl border border-orange-100/60 p-4 shadow-3xs">
                <span className="text-2xl block mb-1">🧘</span>
                <h4 className="text-xs font-bold text-slate-800">THƯ GIÃN KHÔNG STRESS</h4>
                <p className="text-[10px] text-slate-450 mt-0.5">Tần sóng âm dịu bớt lo sợ, mát mát thoải mái suốt quy trình</p>
              </div>
            </div>

            {/* INTERACTIVE SPA CALCULATOR WIDGET (Formulated precisely to the flyers) */}
            <div className="bg-white p-6 md:p-8 rounded-[32px] shadow-lg border-2 border-orange-100 max-w-4xl mx-auto mb-12 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-orange-100 rounded-bl-full pointer-events-none opacity-40" />
              
              <div className="flex flex-col sm:flex-row items-center justify-between pb-4 mb-6 border-b border-orange-100 gap-2">
                <div className="flex items-center space-x-2.5">
                  <Sparkles className="w-5.5 h-5.5 text-orange-500 fill-orange-400" />
                  <div>
                    <h3 className="text-lg font-black text-gray-900">Tính Toán Chi Phí Spa Tự Động</h3>
                    <span className="text-xs text-slate-400 font-semibold block">Tra cứu giá chuẩn xác theo đúng cân nặng từ tờ rơi</span>
                  </div>
                </div>
                <div className="bg-orange-50 text-orange-600 text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-md border border-orange-100">
                  Phát sinh 0 đồng phụ thu vô lí
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* 1. Pet selection */}
                <div className="space-y-3">
                  <label className="block text-xs font-extrabold uppercase text-gray-700 tracking-wider">1. Loài thú cưng của bạn</label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={() => {
                        setSpaEstimatorPetType('dog');
                      }}
                      className={`py-3.5 px-4 rounded-xl font-extrabold text-xs transition-all cursor-pointer flex-col items-center flex justify-center border-2 ${
                        spaEstimatorPetType === 'dog' 
                          ? 'bg-orange-50/70 border-orange-500 text-orange-600 shadow-sm' 
                          : 'bg-white border-slate-200 text-slate-500 hover:border-orange-200'
                      }`}
                    >
                      <span className="text-2xl">🐶</span>
                      <span className="mt-1 font-bold font-display">Cún / Chó Cưng</span>
                    </button>
                    <button
                      onClick={() => {
                        setSpaEstimatorPetType('cat');
                        if (spaEstimatorServiceId === 'spa-grooming') {
                          setSpaEstimatorServiceId('spa-tam-say'); // Cats don't have standard grooming style combo on flyer
                        }
                      }}
                      className={`py-3.5 px-4 rounded-xl font-extrabold text-xs transition-all cursor-pointer flex-col items-center flex justify-center border-2 ${
                        spaEstimatorPetType === 'cat' 
                          ? 'bg-orange-50/70 border-orange-500 text-orange-600 shadow-sm' 
                          : 'bg-white border-slate-200 text-slate-500 hover:border-orange-200'
                      }`}
                    >
                      <span className="text-2xl">🐱</span>
                      <span className="mt-1 font-bold font-display">Mèo Cưng</span>
                    </button>
                  </div>
                </div>

                {/* 2. Weight Selector */}
                <div className="space-y-3">
                  <div className="flex justify-between items-baseline">
                    <label className="block text-xs font-extrabold uppercase text-gray-700 tracking-wider">2. Cân nặng thực tế</label>
                    <span className="text-xs font-black text-orange-600 bg-orange-50 border border-orange-100 px-2.5 py-0.5 rounded-lg">{spaEstimatorWeight} kg</span>
                  </div>
                  <input 
                    type="range" 
                    min="1" 
                    max="18" 
                    step="0.5"
                    value={spaEstimatorWeight}
                    onChange={(e) => setSpaEstimatorWeight(Number(e.target.value))}
                    className="w-full accent-orange-500 bg-orange-100 rounded-lg appearance-none h-2 cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-gray-400 font-bold">
                    <span>Dưới 3kg</span>
                    <span>3 - 6kg</span>
                    <span>6 - 12kg</span>
                    <span>Hơn 15kg</span>
                  </div>
                </div>

                {/* 3. Service Selector */}
                <div className="space-y-3">
                  <label className="block text-xs font-extrabold uppercase text-gray-700 tracking-wider">3. Chọn Combo dịch vụ</label>
                  <select
                    value={spaEstimatorServiceId}
                    onChange={(e) => setSpaEstimatorServiceId(e.target.value)}
                    className="w-full bg-slate-50 border-2 border-slate-150 rounded-xl p-3 text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-orange-400"
                  >
                    <option value="spa-tam-say">Combo Tắm Vệ Sinh 10 Bước chuẩn y khoa</option>
                    <option value="spa-cacao">Combo Tắm Cạo Lông Sạch Sẽ Mát Mẻ</option>
                    {spaEstimatorPetType === 'dog' && (
                      <option value="spa-grooming">Combo Tắm Cắt Tạo Kiểu Nghệ Thuật (Grooming)</option>
                    )}
                  </select>
                </div>
              </div>

              {/* Total Calculation Display */}
              <div className="mt-6 pt-5 border-t border-orange-100 bg-orange-50/20 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="text-center sm:text-left">
                  <span className="text-xs text-slate-500 font-bold block">Tổng chi phí ước tính (Trọn gói dịch vụ):</span>
                  <div className="flex items-center justify-center sm:justify-start space-x-2 mt-1">
                    <span className="text-2xl font-black text-rose-500 font-display">
                      {computedSpaEstimate.toLocaleString('vi-VN')}đ
                    </span>
                    <span className="text-[10px] bg-amber-50 border border-amber-100 text-amber-800 px-2 py-0.5 rounded-md font-extrabold">
                      Tặng kèm nơ thắt ruy băng xinh xắn
                    </span>
                  </div>
                </div>

                <button
                  id="estimator-spa-book-btn"
                  onClick={() => {
                    setBookingFormData(prev => ({
                      ...prev,
                      bookingType: 'spa',
                      serviceId: spaEstimatorServiceId,
                      petType: spaEstimatorPetType,
                      petWeight: spaEstimatorWeight
                    }));
                    setIsBookingModalOpen(true);
                  }}
                  className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-black py-3 px-6 rounded-xl text-xs transition-colors cursor-pointer text-center whitespace-nowrap shadow-md flex items-center gap-1.5"
                >
                  <Calendar className="w-4 h-4" />
                  <span>Xác Nhận Giữ Chỗ Luôn</span>
                </button>
              </div>
            </div>

            {/* OFFICIAL FLYERS PRICE TABLES (Conforms perfectly to the images sent) */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
              
              {/* Part 1: BẢNG GIÁ MÈO (Exactly Cat Flyer) */}
              <div className="bg-white rounded-[32px] border border-orange-105 shadow-xs p-6 md:p-8">
                <div className="flex items-center justify-between border-b border-orange-50 pb-4 mb-6">
                  <div className="flex items-center space-x-2">
                    <span className="text-2xl">🐈</span>
                    <div>
                      <h4 className="text-lg font-black text-slate-800 font-display">Bảng Giá Spa Mèo Cưng</h4>
                      <span className="text-[10px] text-amber-800 font-bold bg-amber-100/50 px-2 py-0.5 rounded">LUMI PET SPA 24/7</span>
                    </div>
                  </div>
                  <span className="text-[10px] text-slate-400 font-bold uppercase">Áp dụng cho mọi dòng mèo</span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-orange-55 text-slate-800 text-[11px] font-black border-b border-orange-100">
                        <th className="py-3 px-4 rounded-l-lg">CÂN NẶNG</th>
                        <th className="py-3 px-4">COMBO TẮM VỆ SINH (VND)</th>
                        <th className="py-3 px-4 rounded-r-lg">COMBO TẮM CẠO LÔNG (VND)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-orange-50 text-xs font-semibold text-slate-650">
                      <tr className="hover:bg-slate-50/50 transition-colors">
                        <td className="py-4 px-4 font-bold text-slate-800">Dưới 3kg</td>
                        <td className="py-4 px-4 font-extrabold text-slate-900">150.000</td>
                        <td className="py-4 px-4 font-extrabold text-orange-605">230.000</td>
                      </tr>
                      <tr className="hover:bg-slate-50/50 transition-colors">
                        <td className="py-4 px-4 font-bold text-slate-800">3 - 6kg</td>
                        <td className="py-4 px-4 font-extrabold text-slate-900">200.000</td>
                        <td className="py-4 px-4 font-extrabold text-orange-605">290.000</td>
                      </tr>
                      <tr className="hover:bg-slate-50/50 transition-colors">
                        <td className="py-4 px-4 font-bold text-slate-800">6 - 10kg</td>
                        <td className="py-4 px-4 font-extrabold text-slate-900">250.000</td>
                        <td className="py-4 px-4 font-extrabold text-orange-605">350.000</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div className="mt-5 p-3.5 bg-amber-50/40 rounded-xl border border-amber-205 text-[11px] text-amber-850 font-medium space-y-1.5 home-rules-block">
                  <div className="font-extrabold flex items-center gap-1">
                    <span>⚠️</span> Quyết định sức khỏe & lề lối tiếp nhận:
                  </div>
                  <p>✓ Giá trên không áp dụng những ngày Lễ, Tết dọn dẹp hệ thống cao điểm.</p>
                  <p>✓ Không khấu trừ hoặc hoàn giảm tiền trong trường hợp ba mẹ tự xách mang loại sữa tắm dưỡng riêng biệt từ bên ngoài tới.</p>
                </div>
              </div>

              {/* Part 2: BẢNG GIÁ CHÓ (Exactly Dog/Grooming Flyer) */}
              <div className="bg-white rounded-[32px] border border-orange-105 shadow-xs p-6 md:p-8">
                <div className="flex items-center justify-between border-b border-orange-50 pb-4 mb-6">
                  <div className="flex items-center space-x-2">
                    <span className="text-2xl">🐩</span>
                    <div>
                      <h4 className="text-lg font-black text-slate-800 font-display">Bảng Giá Spa & Grooming Chó</h4>
                      <span className="text-[10px] text-amber-850 font-bold bg-amber-100/50 px-2 py-0.5 rounded">LUMI PET GROOMING</span>
                    </div>
                  </div>
                  <span className="text-[10px] text-slate-400 font-bold uppercase">Báo giá theo cân trọng chính xác</span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-orange-55 text-slate-800 text-[11px] font-black border-b border-orange-100">
                        <th className="py-3 px-3 rounded-l-lg">CÂN NẶNG</th>
                        <th className="py-3 px-3">TẮM VỆ SINH (VND)</th>
                        <th className="py-3 px-3">COMBO TẮM CẠO (VND)</th>
                        <th className="py-3 px-3 rounded-r-lg">COMBO TẮM CẮT TỈA (VND)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-orange-50 text-[11px] font-semibold text-slate-655">
                      <tr className="hover:bg-slate-50/50 transition-colors">
                        <td className="py-3.5 px-3 font-bold text-slate-800">Dưới 3kg</td>
                        <td className="py-3.5 px-3 font-extrabold text-slate-900">120.000</td>
                        <td className="py-3.5 px-3 font-extrabold text-amber-700">180.000</td>
                        <td className="py-3.5 px-3 font-extrabold text-orange-605">260.000</td>
                      </tr>
                      <tr className="hover:bg-slate-50/50 transition-colors">
                        <td className="py-3.5 px-3 font-bold text-slate-800">3 - 6kg</td>
                        <td className="py-3.5 px-3 font-extrabold text-slate-900">170.000</td>
                        <td className="py-3.5 px-3 font-extrabold text-amber-700">240.000</td>
                        <td className="py-3.5 px-3 font-extrabold text-orange-605">320.000</td>
                      </tr>
                      <tr className="hover:bg-slate-50/50 transition-colors">
                        <td className="py-3.5 px-3 font-bold text-slate-800">6 - 9kg</td>
                        <td className="py-3.5 px-3 font-extrabold text-slate-900">220.000</td>
                        <td className="py-3.5 px-3 font-extrabold text-amber-700">300.000</td>
                        <td className="py-3.5 px-3 font-extrabold text-orange-605">380.000</td>
                      </tr>
                      <tr className="hover:bg-slate-50/50 transition-colors">
                        <td className="py-3.5 px-3 font-bold text-slate-800">9 - 12kg</td>
                        <td className="py-3.5 px-3 font-extrabold text-slate-900">270.000</td>
                        <td className="py-3.5 px-3 font-extrabold text-amber-700">360.000</td>
                        <td className="py-3.5 px-3 font-extrabold text-orange-605">450.000</td>
                      </tr>
                      <tr className="hover:bg-slate-50/50 transition-colors">
                        <td className="py-3.5 px-3 font-bold text-slate-800">12 - 18kg</td>
                        <td className="py-3.5 px-3 font-extrabold text-slate-900">350.000</td>
                        <td className="py-3.5 px-3 font-extrabold text-amber-700">460.000</td>
                        <td className="py-3.5 px-3 font-extrabold text-orange-605">550.000</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div className="mt-4 p-3 bg-slate-50 rounded-xl border border-slate-200 text-[11px] text-slate-500 font-semibold">
                  🐾 Trên 15kg - 18kg quý khách hàng vui lòng liên hệ trực tiếp đến cửa hàng để thợ kiểm tra lông dày thưa và báo mức giá phù hợp với thể trạng bé cưng.
                </div>
              </div>

            </div>

            {/* COMBO 10 STEPS DISPLAY & ADDONS LIST (Direct copy from flyer contents) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-10">
              
              {/* 10 Steps Core list */}
              <div className="lg:col-span-7 bg-white rounded-[32px] shadow-sm border border-orange-100 p-6 md:p-8">
                <div className="flex items-center space-x-2 border-b border-orange-50 pb-3.5 mb-6">
                  <div className="bg-orange-500 text-white w-7 h-7 rounded-lg flex items-center justify-center font-black text-xs font-display">
                    10
                  </div>
                  <div>
                    <h3 className="text-base font-black text-slate-800 tracking-tight">COMBO 10 BƯỚC SPA CHĂM SÓC TOÀN DIỆN</h3>
                    <span className="text-[11px] text-slate-400 font-semibold block">Quy trình chuyên nghiệp cam kết không đau rát, an toàn tuyệt nhiên</span>
                  </div>
                </div>

                <div className="space-y-4">
                  {[
                    { step: 1, title: 'Kiểm tra lâm sàng tình trạng da lông', desc: 'Kiểm tra phát hiện bọ chét, mẩn ngứa hay nấm da để chọn sữa tắm y khoa phù hợp nhất.' },
                    { step: 2, title: 'Chải thông lông tơ xơ rối', desc: 'Sử dụng lược mềm chuyên nghiệp chải tơi gỡ bỏ toàn bộ lông chết bụi bẩn bám dính.' },
                    { step: 3, title: 'Cạo dọn lông bàn chân tránh trượt', desc: 'Tránh trơn ngã dập chân khi bé cưng đùa nghịch vui chơi trong nhà.' },
                    { step: 4, title: 'Cạo sạch lông vùng bụng & hậu môn', desc: 'Giúp bé đi vệ sinh sạch sẽ, tuyệt đối không bị dính bệt phân nước tiểu làm hoen bẩn.' },
                    { step: 5, title: 'Vệ sinh tai, mắt, mũi miệng kĩ lưỡng', desc: 'Nhổ lông tai an toàn bằng phấn chuyên biệt, sát khuẩn nước muối dịu mát.' },
                    { step: 6, title: 'Cắt mài móng bo tròn góc cạnh', desc: 'Mài dũa móng êm ái bằng đầu sục xoay điện, tránh cào làm xước da tay ba mẹ.' },
                    { step: 7, title: 'Vắt sạch tuyến hôi quanh hậu môn', desc: 'Tránh ngứa ngáy bé hay lết đít xuống sàn, khử 90% mùi hôi đặc trưng của cún mèo.' },
                    { step: 8, title: 'Tắm xả cao cấp chuyên sâu gấp 2 lần', desc: 'Ủ bọt mềm xoa bóp cơ khớp, xịt tinh dầu thảo mộc organic thư thả làn màng biểu bì.' },
                    { step: 9, title: 'Sấy ion chống khô, chải tạo động phồng lông', desc: 'Hệ thống sấy ấm khí ion vừa khóa ẩm da vừa giúp tạo tơi xốp lông dễ tạo hình.' },
                    { step: 10, title: 'Serum dưỡng Keratin bảo bọc lưu hương 7 ngày', desc: 'Phủ bóng lớp bảo hộ chống bết dính cáu bẩn, mùi hương dịu ngọt sảng khoái lâu dài.' }
                  ].map((x) => (
                    <div key={x.step} className="flex gap-3.5 items-start">
                      <div className="w-5.5 h-5.5 rounded-full bg-orange-100 border border-orange-200 text-orange-655 flex items-center justify-center text-[11px] font-black flex-shrink-0 mt-0.5">
                        {x.step}
                      </div>
                      <div>
                        <h4 className="text-xs font-black text-slate-800">{x.title}</h4>
                        <p className="text-[11px] text-slate-500 leading-normal mt-0.5">{x.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Addons and Fine details */}
              <div className="lg:col-span-5 flex flex-col gap-6">
                
                {/* Visual flyer notes block */}
                <div className="bg-white rounded-[32px] border border-orange-100 p-6 md:p-8 shadow-3xs">
                  <h4 className="text-xs font-black text-slate-800 uppercase tracking-widest border-l-4 border-orange-500 pl-2.5 mb-5">
                    ⚙️ PHỤ THU PHÁT SINH (NẾU CÓ)
                  </h4>
                  <ul className="space-y-3.5 text-xs font-semibold text-slate-650">
                    <li className="flex justify-between items-center pb-2.5 border-b border-orange-50/50">
                      <span className="text-slate-800">✦ Gỡ rối lông dày nặng</span>
                      <span className="text-orange-550 font-black">50k - 500k <span className="text-[10px] text-slate-400 font-medium">(báo trước)</span></span>
                    </li>
                    <li className="flex justify-between items-center pb-2.5 border-b border-orange-50/50">
                      <span className="text-slate-800">✦ Tạo kiểu đặc biệt (Tròn rốn, trái tim,...)</span>
                      <span className="text-orange-550 font-black">50k - 100k</span>
                    </li>
                    <li className="flex justify-between items-center pb-2.5 border-b border-orange-50/50">
                      <span className="text-slate-800">✦ Sữa tắm trắng đặc trị nấm, ve rận kĩ</span>
                      <span className="text-orange-550 font-black">50k - 100k</span>
                    </li>
                    <li className="flex justify-between items-center">
                      <span className="text-red-500">✦ Bé có tính khí quấy khóc dữ dằn</span>
                      <span className="text-orange-550 font-black">50k - 100k</span>
                    </li>
                  </ul>
                </div>

                {/* Promises cards block */}
                <div className="bg-amber-50/15 rounded-[32px] border border-amber-205 p-6 md:p-8 flex-1 flex flex-col justify-between">
                  <div>
                    <h4 className="text-xs font-black text-amber-850 uppercase tracking-wider mb-4 flex items-center gap-1.5">
                      📣 CAM KẾT VẬN HÀNH & GIỮ LỊCH
                    </h4>
                    <p className="text-xs text-slate-550 leading-relaxed font-semibold mb-3">
                      Lumi Pet luôn trân trọng thời gian của ba mẹ và sự an tâm của boss cưng quý báu. Để phục vụ tốt nhất, Lumi cam kết:
                    </p>
                    <ul className="space-y-2.5 text-[11px] text-slate-550 font-semibold">
                      <li className="flex items-center gap-1.5">
                        <span className="text-emerald-500">✔</span>
                        <span>ĐẶT LỊCH TRƯỚC để được chuẩn bị dầu tắm sấy tỉ mi nhất.</span>
                      </li>
                      <li className="flex items-center gap-1.5">
                        <span className="text-emerald-500">✔</span>
                        <span>ĐẾN ĐÚNG GIỜ HẸN giúp bé không bị hồi hộp, bớt chờ lâu.</span>
                      </li>
                      <li className="flex items-center gap-1.5">
                        <span className="text-emerald-500">✔</span>
                        <span>CAM KẾT AN TOÀN bảo hiểm 100% không stress ép ép cọ khó cưng.</span>
                      </li>
                    </ul>
                  </div>

                  <div className="pt-6 border-t border-orange-100/50 mt-6 text-center">
                    <p className="text-[11px] text-amber-700 italic font-black">
                      Hotline Đặt Lịch Spa 24/7: 0989 979 675
                    </p>
                    <p className="text-[10px] text-slate-400 mt-1">
                      Địa chỉ: 27 Võ Trường Toản, Phường 2, Bình Thạnh, TP.HCM
                    </p>
                  </div>
                </div>

              </div>

            </div>

          </div>
        )}

        {/* TAB 4: HOTEL LƯU TRÚ */}
        {activeTab === 'hotel' && (
          <div className="max-w-7xl mx-auto px-4 pt-8">
            {/* Header Block with Google Ads & CRO Optimization */}
            <div className="text-center max-w-3xl mx-auto mb-10">
              <span className="inline-flex items-center space-x-1 bg-amber-50 text-amber-800 border border-amber-100 rounded-full py-1 px-3 text-xs font-bold uppercase tracking-wider mb-2.5">
                🏨 Khách Sạn Thú Cưng Kính Cường Lực Cao Cấp Bình Thạnh
              </span>
              <h1 className="text-3xl sm:text-5xl font-black text-slate-800 tracking-tight font-display mb-3">
                PET HOTEL <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-500 to-orange-600">LUMI PET 24/7</span>
              </h1>
              <p className="text-sm text-slate-500 leading-relaxed font-sans max-w-2xl mx-auto">
                Cabin khách sạn kính cường lực ấm áp, sạch bách tuyệt trùng nhờ tia cực tím khử mùi. Điều hòa trung tâm luôn duy trì đúng tinh chất 26°C, không gian sảnh chơi rộng rãi mát mẻ giúp thú cưng của ba mẹ sướng sảng khoái suốt hành trình du ngoạn.
              </p>
            </div>

            {/* Value Pillars Block */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 max-w-4xl mx-auto mb-10 text-center">
              <div className="bg-white rounded-2xl border border-orange-100/60 p-4 shadow-3xs">
                <span className="text-2xl block mb-1">❄️</span>
                <h4 className="text-xs font-bold text-slate-800">ĐIỀU HOÀ 26°C</h4>
                <p className="text-[10px] text-slate-450 mt-0.5">Duy trì không khí mát dịu sướng thể trạng 24h liên tục</p>
              </div>
              <div className="bg-white rounded-2xl border border-orange-100/60 p-4 shadow-3xs">
                <span className="text-2xl block mb-1">📹</span>
                <h4 className="text-xs font-bold text-slate-800">HE LIVE CAMERA</h4>
                <p className="text-[10px] text-slate-450 mt-0.5">Quét sắc nét mọi hoạt chất, gửi link xem con cưng trực tiếp</p>
              </div>
              <div className="bg-white rounded-2xl border border-orange-100/60 p-4 shadow-3xs">
                <span className="text-2xl block mb-1">🍛</span>
                <h4 className="text-xs font-bold text-slate-800">DINH DƯỠNG SẠCH</h4>
                <p className="text-[10px] text-slate-450 mt-0.5">Hai bữa chính hạt Royal Canin / Pate tươi súp thưởng ngon miệng</p>
              </div>
              <div className="bg-white rounded-2xl border border-orange-100/60 p-4 shadow-3xs">
                <span className="text-2xl block mb-1">🧼</span>
                <h4 className="text-xs font-bold text-slate-800">TIỆT TRÙNG OZONE</h4>
                <p className="text-[10px] text-slate-450 mt-0.5">Khử trùng hầm sấy tia cực tím dọn giường thơm tho sau mỗi bé</p>
              </div>
            </div>

            {/* HOTEL ESTIMATOR ARCHOR & CALCULATOR (Formulated on weight structure) */}
            <div id="hotel_calculator_anchor" className="bg-white p-6 md:p-8 rounded-[32px] shadow-lg border-2 border-orange-100 max-w-4xl mx-auto mb-12 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-orange-100 rounded-bl-full pointer-events-none opacity-40" />

              <div className="flex flex-col sm:flex-row items-center justify-between pb-4 mb-6 border-b border-orange-100 gap-2">
                <div className="flex items-center space-x-2.5">
                  <Calendar className="w-5.5 h-5.5 text-orange-500" />
                  <div>
                    <h3 className="text-lg font-black text-gray-900">Ước Tính Giá Hotel Lưu Trú Tự Động</h3>
                    <span className="text-xs text-slate-400 font-semibold block">Tính toán nhanh chi phí dựa theo cân nặng của thú cưng</span>
                  </div>
                </div>
                <div className="bg-orange-50 text-orange-600 text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-md border border-orange-100">
                  Phòng kính rộng - Đặt chỗ 24/7
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* 1. Weight Selector Slider */}
                <div className="space-y-3">
                  <div className="flex justify-between items-baseline">
                    <label className="block text-xs font-extrabold uppercase text-slate-700 tracking-wider">1. Cân nặng của thú cưng</label>
                    <span className="text-xs font-black text-orange-605 bg-orange-50 border border-orange-100 px-2.5 py-0.5 rounded-lg">{hotelCalculatorWeight} kg</span>
                  </div>
                  <input 
                    type="range" 
                    min="1" 
                    max="18" 
                    step="0.5"
                    value={hotelCalculatorWeight}
                    onChange={(e) => setHotelCalculatorWeight(Number(e.target.value))}
                    className="w-full accent-orange-500 bg-orange-100 rounded-lg appearance-none h-2 cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-gray-400 font-bold">
                    <span>Dưới 3kg</span>
                    <span>3 - 6kg</span>
                    <span>6 - 9kg</span>
                    <span>9 - 15kg</span>
                  </div>
                </div>

                {/* 2. Stay nights duration selector */}
                <div className="space-y-3">
                  <div className="flex justify-between items-baseline">
                    <label className="block text-xs font-extrabold uppercase text-slate-700 tracking-wider">2. Số đêm ngủ khách sạn</label>
                    <span className="text-xs font-black text-orange-605 bg-orange-50 border border-orange-100 px-2.5 py-0.5 rounded-lg">{hotelCalculatorDays} đêm</span>
                  </div>
                  <input 
                    type="range" 
                    min="1" 
                    max="30" 
                    value={hotelCalculatorDays}
                    onChange={(e) => setHotelCalculatorDays(Number(e.target.value))}
                    className="w-full accent-orange-500 bg-orange-100 rounded-lg appearance-none h-2 cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-gray-400 font-bold">
                    <span>1 Đêm</span>
                    <span>5 Đêm (Giảm 5%)</span>
                    <span>10 Đêm (Giảm 8%)</span>
                  </div>
                </div>

                {/* 3. Selecting Room type for booking metadata */}
                <div className="space-y-3">
                  <label className="block text-xs font-extrabold uppercase text-slate-700 tracking-wider">3. Hạng Cabin mong muốn</label>
                  <select
                    value={hotelCalculatorRoomId}
                    onChange={(e) => setHotelCalculatorRoomId(e.target.value)}
                    className="w-full bg-slate-50 border-2 border-slate-150 rounded-xl p-3 text-xs font-bold focus:outline-none focus:ring-1 focus:ring-orange-400"
                  >
                    {HOTEL_ROOMS.map(r => (
                      <option key={r.id} value={r.id}>{r.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Total Calculation Display */}
              <div className="mt-6 pt-5 border-t border-orange-100 bg-orange-50/20 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="text-center sm:text-left">
                  <span className="text-xs text-slate-500 font-bold block">Tổng chi phí dự kiến tạm tính (Có áp đãi giảm giá):</span>
                  <div className="flex items-center justify-center sm:justify-start space-x-2 mt-1">
                    <span className="text-2xl font-black text-rose-500 font-display">
                      {computedHotelEstimate.toLocaleString('vi-VN')}đ
                    </span>
                    {hotelCalculatorDays >= 10 ? (
                      <span className="text-[10px] bg-amber-50 border border-amber-100 text-amber-805 px-2.5 py-0.5 rounded-md font-extrabold">
                        Giảm 8% + Tặng tắm sấy + Đón 2km Free! 🎁
                      </span>
                    ) : hotelCalculatorDays >= 5 ? (
                      <span className="text-[10px] bg-emerald-50 border border-emerald-100 text-emerald-800 px-2.5 py-0.5 rounded-md font-extrabold">
                        Giảm 5% + Tặng combo tắm sấy! 🎁
                      </span>
                    ) : null}
                  </div>
                </div>

                <button
                  onClick={() => {
                    setBookingFormData(prev => ({
                      ...prev,
                      bookingType: 'hotel',
                      serviceId: hotelCalculatorRoomId,
                      petWeight: hotelCalculatorWeight,
                    }));
                    setIsBookingModalOpen(true);
                  }}
                  className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-black py-3 px-6 rounded-xl text-xs transition-colors cursor-pointer text-center whitespace-nowrap shadow-md flex items-center gap-1.5"
                >
                  <Calendar className="w-4 h-4" />
                  <span>Xác Nhận Giữ Phòng Kính</span>
                </button>
              </div>
            </div>

            {/* HIGH-FIDELITY HOTEL OFFICIAL FLYER PRICE TABLE */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-12">
              
              {/* Hotel Flyer Price list */}
              <div className="lg:col-span-7 bg-white rounded-[32px] border border-orange-105 shadow-xs p-6 md:p-8">
                <div className="flex items-center justify-between border-b border-orange-50 pb-4 mb-6">
                  <div className="flex items-center space-x-2">
                    <span className="text-2xl">🏨</span>
                    <div>
                      <h4 className="text-lg font-black text-slate-800 font-display">Bảng Giá Hạng Phòng Chi Tiết</h4>
                      <span className="text-[10px] text-amber-800 font-bold bg-amber-100/50 px-2 py-0.5 rounded">LUMI PET HOTEL 24/7</span>
                    </div>
                  </div>
                  <span className="text-[10px] text-slate-400 font-bold uppercase">Áp dụng cho cả Chó & Mèo</span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-orange-55 text-slate-800 text-[11px] font-black border-b border-orange-100">
                        <th className="py-3 px-4 rounded-l-lg">HẠNG CABIN</th>
                        <th className="py-3 px-4">DƯỚI 5KG (1.0x)</th>
                        <th className="py-3 px-4">5KG - 10KG (1.2x)</th>
                        <th className="py-3 px-4 rounded-r-lg">10KG - 25KG (1.5x)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-orange-50 text-xs font-semibold text-slate-650">
                      <tr className="hover:bg-slate-50/50 transition-colors">
                        <td className="py-4 px-4 font-bold text-slate-800">Cozy Standard</td>
                        <td className="py-4 px-4 font-black text-slate-900 text-base">120.000đ <span className="text-[10px] text-slate-400 font-normal">/ đêm</span></td>
                        <td className="py-4 px-4 font-black text-slate-700 text-base">144.000đ <span className="text-[10px] text-slate-450 font-normal">/ đêm</span></td>
                        <td className="py-4 px-4 text-slate-400 font-bold py-4">Chỉ nhận mèo nhỏ</td>
                      </tr>
                      <tr className="hover:bg-slate-50/50 transition-colors">
                        <td className="py-4 px-4 font-bold text-slate-800">Deluxe Oasis</td>
                        <td className="py-4 px-4 font-black text-slate-900 text-base">220.000đ <span className="text-[10px] text-slate-400 font-normal">/ đêm</span></td>
                        <td className="py-4 px-4 font-black text-slate-700 text-base">264.000đ <span className="text-[10px] text-slate-450 font-normal">/ đêm</span></td>
                        <td className="py-4 px-4 font-black text-slate-700 text-base">330.000đ <span className="text-[10px] text-slate-450 font-normal">/ đêm</span></td>
                      </tr>
                      <tr className="hover:bg-slate-50/50 transition-colors">
                        <td className="py-4 px-4 font-bold text-slate-800">Penthouse Hoàng Gia</td>
                        <td className="py-4 px-4 font-black text-slate-900 text-base">450.000đ <span className="text-[10px] text-slate-400 font-normal">/ đêm</span></td>
                        <td className="py-4 px-4 font-black text-slate-700 text-base">540.000đ <span className="text-[10px] text-slate-450 font-normal">/ đêm</span></td>
                        <td className="py-4 px-4 font-black text-slate-700 text-base">675.000đ <span className="text-[10px] text-slate-450 font-normal">/ đêm</span></td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div className="mt-4 p-3 bg-slate-50 rounded-xl border border-slate-200 text-[11px] text-slate-550 italic font-semibold">
                  🐾 Bé trên 25kg (Hệ số 1.8x) quý khách vui lòng đem bé trực tiếp hoặc kết nối Hotline 0989 979 675 để bảo mẫu kiểm tra thể trạng và báo giá cụ thể.
                </div>
              </div>

              {/* Policies and Guidelines */}
              <div className="lg:col-span-5 flex flex-col gap-6">
                {/* Visual flyer notes block */}
                <div className="bg-white rounded-[32px] border border-orange-100 p-6 md:p-8 shadow-3xs">
                  <h4 className="text-xs font-black text-slate-800 uppercase tracking-widest border-l-4 border-orange-500 pl-2.5 mb-5">
                    ⚙️ CHÍNH SÁCH ƯU ĐÃI LŨY TIẾN
                  </h4>
                  <ul className="space-y-4 text-xs font-semibold text-slate-655 font-sans">
                    <li className="flex gap-2 items-start">
                      <span className="text-orange-500 text-base">🎁</span>
                      <div>
                        <span className="text-slate-800 font-bold block">Gửi trên 5 ngày:</span>
                        <p className="text-[11px] text-slate-500 font-medium">Giảm 5% tổng hoá đơn phòng và TẶNG hoàn toàn 1 combo tắm sấy vệ sỹ sâu chuẩn y khoa.</p>
                      </div>
                    </li>
                    <li className="flex gap-2 items-start">
                      <span className="text-orange-500 text-base">🚚</span>
                      <div>
                        <span className="text-slate-800 font-bold block">Gửi trên 10 ngày:</span>
                        <p className="text-[11px] text-slate-500 font-medium">Giảm 8% tổng hoá đơn phòng, TẶNG trọn gói combo tắm sấy và MIỄN PHÍ dịch vụ đưa đón cún mèo tận cổng trong bán kính 2km nội quận.</p>
                      </div>
                    </li>
                  </ul>
                </div>

                {/* Requirements check block */}
                <div className="bg-amber-50/15 rounded-[32px] border border-amber-200 p-6 md:p-8 flex-1 flex flex-col justify-between">
                  <div>
                    <h4 className="text-xs font-black text-amber-850 uppercase tracking-wider mb-4 flex items-center gap-1.5">
                      ⚠️ TIÊU CHUẨN ĐỂ LUMI PET ĐÓN BÉ
                    </h4>
                    <p className="text-xs text-slate-550 leading-relaxed font-semibold mb-3">
                      Để bảo vệ tuyệt đối sức đề kháng chung và tránh nguy cơ lây nhiễm chéo, Lumi Pet chỉ tiếp nhận cún mèo đáp ứng đầy đủ:
                    </p>
                    <ul className="space-y-2.5 text-[11px] text-slate-550 font-semibold mb-4">
                      <li className="flex items-center gap-1.5">
                        <span className="text-red-500">✔</span>
                        <span>Bé hoàn toàn khoẻ mạnh bình thường, không nhiễm nấm rận nặng hoặc bệnh dịch.</span>
                      </li>
                      <li className="flex items-center gap-1.5">
                        <span className="text-red-500">✔</span>
                        <span>Đã được tiêm ngừa vaccin đầy đủ (khuyến nghị chụp hình sổ tiêm khi check-in).</span>
                      </li>
                      <li className="flex items-center gap-1.5">
                        <span className="text-red-500">✔</span>
                        <span>Bé không bị kích động dữ dội hoặc quá hung dữ (Lumi tôn trọng tinh thần thoải mái).</span>
                      </li>
                    </ul>
                  </div>

                  <div className="pt-6 border-t border-orange-100/50 mt-6 text-center">
                    <p className="text-[11px] text-amber-700 italic font-black">
                      Hotline Đặt Phòng 24/7: 0989 979 675
                    </p>
                    <p className="text-[10px] text-slate-400 mt-1">
                      Địa chỉ: 27 Võ Trường Toản, Phường 2, Bình Thạnh, TP.HCM
                    </p>
                  </div>
                </div>

              </div>

            </div>

            {/* In-depth Hotel Room Style Cards */}
            <div className="text-center max-w-xl mx-auto mb-8 mt-12">
              <span className="text-orange-550 text-[10px] font-black uppercase tracking-widest block mb-1">Thiết kế không gian đẳng cấp nghỉ dưỡng</span>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-800 font-display">Các Hạng Cabin Khách Sạn Kính Cường Lực</h2>
              <p className="text-xs text-slate-450 mt-1">Lựa chọn kiểu hạng phòng thích hợp cho bé để bảo mẫu trang hoàng chuẩn bị đệm sục êm ái trước khi đến.</p>
            </div>

            <div className="space-y-8">
              {HOTEL_ROOMS.map((room, idx) => (
                <div 
                  key={room.id} 
                  className={`bg-white rounded-[32px] border border-orange-100 overflow-hidden shadow-sm hover:border-orange-200 transition-all p-6 sm:p-8 flex flex-col lg:flex-row gap-8 ${
                    idx % 2 === 1 ? 'lg:flex-row-reverse' : ''
                  }`}
                >
                  <div className="lg:w-1/2 min-h-64 sm:min-h-80 rounded-2xl overflow-hidden relative">
                    <img src={room.image} alt={room.name} className="absolute inset-0 w-full h-full object-cover" />
                    <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-xs py-2 px-4 rounded-xl border border-orange-100 flex items-center space-x-2">
                      <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-ping" />
                      <span className="text-xs font-bold text-gray-800">Cabin luôn sẵn sàng phục vụ</span>
                    </div>
                  </div>

                  <div className="lg:w-1/2 flex flex-col justify-between">
                    <div>
                      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-orange-50 mb-4">
                        <div>
                          <h3 className="text-xl sm:text-2xl font-black text-slate-800 font-display">{room.name}</h3>
                          <div className="flex items-center space-x-2.5 mt-1">
                            <span className="text-xs font-bold text-orange-600 bg-orange-50 px-2.5 py-1 rounded-md">{room.capacity}</span>
                            <div className="flex items-center text-amber-500 text-xs font-bold">
                              <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500 mr-1" />
                              <span>{room.rating} / 5.0</span>
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <span className="block text-[10px] uppercase font-black text-slate-400">Thiết bị Cabin cao cấp</span>
                          <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2.5 py-1 rounded-md font-extrabold inline-block mt-0.5">Tiêu chuẩn 5 sao</span>
                        </div>
                      </div>

                      <p className="text-sm text-gray-650 leading-relaxed mb-6 font-medium">{room.description}</p>
                      
                      <h4 className="text-xs font-extrabold uppercase text-gray-700 mb-3 tracking-wider">📦 Trải nghiệm chăm sóc cao cấp bao gồm:</h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
                        {room.amenities.map((item, index) => (
                          <div key={index} className="flex items-start text-xs text-slate-600">
                            <Check className="w-4 h-4 text-emerald-500 mr-2 flex-shrink-0 mt-0.5" />
                            <span>{item}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-slate-50">
                      <button
                        onClick={() => openBookingModalWithSelections('hotel', room.id)}
                        className="flex-1 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-black py-3.5 px-4 rounded-xl text-center text-xs transition-colors cursor-pointer shadow-sm"
                      >
                        Đặt Phòng Ngay - Đăng ký Cabin này
                      </button>
                      <button
                        onClick={() => {
                          setHotelCalculatorRoomId(room.id);
                          document.getElementById('hotel_calculator_anchor')?.scrollIntoView({ behavior: 'smooth' });
                          triggerToast(`Đã chọn tính toán cho ${room.name}`);
                        }}
                        className="bg-orange-50 hover:bg-orange-100 text-orange-600 border-2 border-orange-100/50 py-3 px-6 rounded-xl text-xs transition-all cursor-pointer font-bold"
                      >
                        Tính thử chi phí số đêm
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 5: FAQ & BOOKING CHECKER */}
        {activeTab === 'faq' && (
          <div className="max-w-4xl mx-auto px-4 pt-8">
            <div className="text-center max-w-xl mx-auto mb-10">
              <span className="text-orange-500 text-xs font-bold uppercase tracking-widest block mb-2">Thông tin minh bạch</span>
              <h1 className="text-3xl sm:text-4.5xl font-extrabold text-gray-950 font-display">Tra Cứu & Giải Đáp</h1>
              <p className="text-gray-550 text-sm mt-2">Dễ dàng quản lý lịch hẹn Spa, kiểm tra tình trạng Cabin Khách sạn của pet yêu thông qua Số điện thoại đặt hàng cực kỳ bảo mật.</p>
            </div>

            {/* BOOKING HISTORY CHECKER SECTION (Real client-side implementation) */}
            <div id="history-section" className="bg-white p-6 sm:p-8 rounded-[32px] shadow-lg border-2 border-orange-100 mb-12 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-teal-50 rounded-bl-full pointer-events-none opacity-50" />
              
              <div className="flex items-center space-x-2 pb-3 mb-6 border-b border-orange-100 text-gray-800">
                <FileText className="w-5.5 h-5.5 text-orange-500" />
                <h3 className="text-lg font-bold">Tra Cứu Lịch Hẹn Đã Đặt</h3>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <input 
                  type="text" 
                  value={searchPhoneQuery}
                  onChange={(e) => setSearchPhoneQuery(e.target.value)}
                  placeholder="Nhập Số điện thoại hoặc Họ tên chính xác..."
                  className="flex-1 bg-slate-50 border border-orange-100 rounded-xl p-3.5 text-sm font-semibold focus:outline-none focus:ring-1 focus:ring-orange-400"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleSearchBookings(searchPhoneQuery);
                  }}
                />
                <button
                  onClick={() => handleSearchBookings(searchPhoneQuery)}
                  className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-3.5 px-6 rounded-xl text-sm transition-colors cursor-pointer text-center"
                >
                  Kiểm tra lịch hẹn
                </button>
              </div>

              {/* Has searched results display */}
              {hasSearchedBookings && (
                <div className="mt-8 pt-6 border-t border-slate-100">
                  <h4 className="text-xs font-extrabold uppercase tracking-wide text-gray-400 mb-4">Kết Quả Tra Cứu ({searchResults.length} lịch hẹn)</h4>
                  
                  {searchResults.length === 0 ? (
                    <div className="bg-orange-50/50 rounded-2xl p-5 text-center flex flex-col items-center border border-dashed border-orange-200">
                      <AlertTriangle className="w-8 h-8 text-orange-400 mb-2" />
                      <p className="text-xs font-bold text-gray-700">Không tìm thấy lịch hẹn nào!</p>
                      <p className="text-[11px] text-gray-500 mt-0.5">Vui lòng nhập đúng số điện thoại di động đã dùng khai báo khi đặt Spa hoặc Hotel.</p>
                    </div>
                  ) : (
                    <div className="space-y-5">
                      {searchResults.map(b => (
                        <div key={b.id} className="bg-slate-50 border border-slate-200 rounded-3xl p-5 relative overflow-hidden">
                          {/* Voucher Stamp */}
                          <div className="absolute top-2 right-2 text-slate-100 font-extrabold text-3xl opacity-20 pointer-events-none select-none font-display">
                            {b.id}
                          </div>

                          <div className="flex items-start justify-between pb-3.5 border-b border-dashed border-slate-200">
                            <div>
                              <span className="text-[10px] uppercase font-bold text-orange-550 bg-orange-55 px-2.5 py-0.5 rounded-full">
                                {b.bookingType === 'spa' ? '⚙️ Dịch Vụ Spa' : '🏨 Lưu Trú Hotel'}
                              </span>
                              <h4 className="text-base font-bold text-gray-800 mt-2">{b.serviceType}</h4>
                              <span className="text-xs text-gray-500 block">Mã Booking: <span className="font-mono text-gray-800 font-bold">{b.id}</span></span>
                            </div>

                            <div className="text-right">
                              <span className="block text-xs font-bold text-gray-450">Tổng thanh toán:</span>
                              <span className="text-base font-extrabold text-rose-500 font-display">{(b.totalPrice).toLocaleString('vi-VN')}đ</span>
                              <span className="block text-[9px] text-gray-400 mt-0.5">Thanh toán tại quầy</span>
                            </div>
                          </div>

                          {/* Pet & Time Details */}
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 my-3.5 bg-white p-3.5 rounded-2xl border border-slate-100">
                            <div>
                              <span className="block text-[10px] text-gray-400 font-bold uppercase">Khách hàng & Bé cưng</span>
                              <span className="text-xs font-bold text-gray-800 block mt-0.5">{b.petName} ({b.petType === 'dog' ? 'Chó' : 'Mèo'} - {b.petWeight}kg)</span>
                              <span className="text-[10px] text-gray-500">Chủ: {b.customerName} - {b.customerPhone}</span>
                            </div>
                            
                            {b.bookingType === 'spa' ? (
                              <div>
                                <span className="block text-[10px] text-gray-400 font-bold uppercase">Ngày & Giờ Spa</span>
                                <span className="text-xs font-bold text-gray-800 block mt-0.5">📅 {b.date}</span>
                                <span className="text-[10px] text-gray-500">⏰ Khung giờ: {b.timeSlot}</span>
                              </div>
                            ) : (
                              <div>
                                <span className="block text-[10px] text-gray-400 font-bold uppercase">Thời gian lưu trú</span>
                                <span className="text-xs font-bold text-gray-800 block mt-0.5">📥 Vào: {b.checkInDate}</span>
                                <span className="text-[10px] text-gray-500">📤 Trả: {b.checkOutDate}</span>
                              </div>
                            )}

                            <div className="sm:self-center text-center sm:text-right">
                              <span className="block text-[10px] text-gray-400 font-bold uppercase">Trạng thái</span>
                              {b.status === 'confirmed' ? (
                                <span className="inline-flex items-center space-x-1 text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full text-xs font-bold border border-emerald-200 mt-1">
                                  <Check className="w-3.5 h-3.5" />
                                  <span>Đã Xác Nhận</span>
                                </span>
                              ) : (
                                <span className="inline-flex items-center space-x-1 text-rose-700 bg-rose-55 px-3 py-1 rounded-full text-xs font-bold border border-rose-200 mt-1">
                                  <X className="w-3.5 h-3.5" />
                                  <span>Đã Huỷ Nhờ Đọc</span>
                                </span>
                              )}
                            </div>
                          </div>

                          {/* Notes */}
                          {b.notes && (
                            <div className="bg-amber-50/50 p-2.5 rounded-xl border border-amber-100 text-[11px] text-gray-600 mb-3 flex items-start space-x-1.5">
                              <AlertCircle className="w-4 h-4 text-orange-500 mt-0.5 flex-shrink-0" />
                              <div>
                                <span className="font-bold">Yêu cầu ăn kiêng/bảo hộ: </span>
                                <span>{b.notes}</span>
                              </div>
                            </div>
                          )}

                          {/* Cancel booking option */}
                          {b.status === 'confirmed' && (
                            <div className="flex justify-between items-center bg-white p-3 rounded-2xl border border-slate-100 mt-3.5">
                              <button
                                onClick={() => {
                                  setSelectedEmailBooking(b);
                                  setIsEmailModalOpen(true);
                                }}
                                className="flex items-center space-x-1.5 text-xs text-[#a25230] hover:text-orange-600 bg-[#FAF4F0] border border-[#f4dbcf] hover:bg-[#ebd8ce]/30 px-3.5 py-1.5 rounded-xl font-semibold cursor-pointer transition-colors"
                              >
                                <Mail className="w-3.5 h-3.5 opacity-80" />
                                <span>📧 Xem Email Xác Nhận</span>
                              </button>
                              <button
                                onClick={() => {
                                  if (confirm("Ba mẹ có thực sự muốn huỷ bỏ buổi hẹn chăm sóc cho bé này không?")) {
                                    handleCancelBooking(b.id);
                                  }
                                }}
                                className="text-xs text-rose-500 hover:text-rose-700 font-bold hover:underline py-1 px-3 cursor-pointer"
                              >
                                Huỷ lịch đặt này
                              </button>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* FAQs AREA */}
            <div className="bg-white p-6 sm:p-8 rounded-[31px] shadow-sm border border-orange-50">
              <h3 className="text-xl font-bold text-gray-900 border-b border-orange-100 pb-3 mb-6">Câu hỏi thường gặp FAQ</h3>
              
              <div className="space-y-4">
                {FAQS.map((faq, index) => (
                  <div key={index} className="border-b border-slate-50 pb-4 last:border-0 last:pb-0">
                    <h4 className="text-base font-bold text-gray-800 flex items-start space-x-2">
                      <span className="text-orange-500 text-lg">❓</span>
                      <span>{faq.q}</span>
                    </h4>
                    <p className="text-sm text-gray-500 mt-2 pl-7 leading-relaxed">{faq.a}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

      </main>

      {/* FOOTER AREA */}
      <footer className="bg-white border-t border-orange-100 py-12 px-4 shadow-inner mt-auto relative z-20">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Logo & About */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="w-9 h-9 rounded-xl bg-orange-500 text-white flex items-center justify-center font-bold">🐾</div>
              <span className="text-2xl font-bold tracking-tight text-gray-800 font-display">Lumi<span className="text-orange-500">Pet</span></span>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed">
              Hệ thống khách sạn chăm sóc & Spa cắt lông tạo kiểu nghệ thuật hàng đầu Việt Nam. Lumi Pet ra đời với mong muốn mang lại trải nghiệm tiện nghi, hạnh phúc trọn vẹn nhất cho boss yêu.
            </p>
            <div className="flex space-x-3 pt-1">
              <span className="w-8 h-8 rounded-full bg-orange-50 flex items-center justify-center text-xs text-orange-500 hover:bg-orange-500 hover:text-white transition-all cursor-pointer">FB</span>
              <span className="w-8 h-8 rounded-full bg-orange-50 flex items-center justify-center text-xs text-orange-500 hover:bg-orange-500 hover:text-white transition-all cursor-pointer">IG</span>
              <span className="w-8 h-8 rounded-full bg-orange-50 flex items-center justify-center text-xs text-orange-500 hover:bg-orange-500 hover:text-white transition-all cursor-pointer">YT</span>
            </div>
          </div>

          {/* Links 1: Dịch vụ */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider text-gray-700 mb-4">Các dịch vụ</h4>
            <div className="flex flex-col space-y-2.5 text-xs text-gray-400">
              <button onClick={() => setActiveTab('spa')} className="text-left hover:text-orange-500 transition-colors cursor-pointer">Tắm sục sấy phồng dưỡng mềm lông</button>
              <button onClick={() => setActiveTab('spa')} className="text-left hover:text-orange-500 transition-colors cursor-pointer">Cắt tỉa tạo kiểu phom Golden, Poodle</button>
              <button onClick={() => setActiveTab('spa')} className="text-left hover:text-orange-500 transition-colors cursor-pointer">Ủ dưỡng bùn khoáng trị liệu phục hồi da</button>
              <button onClick={() => setActiveTab('hotel')} className="text-left hover:text-orange-500 transition-colors cursor-pointer">Cabin standard, deluxe, penthouse hoàng gia</button>
            </div>
          </div>

          {/* Links 2: Shop */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider text-gray-700 mb-4">Danh mục Pet shop</h4>
            <div className="flex flex-col space-y-2.5 text-xs text-gray-400">
              <button onClick={() => { setActiveTab('shop'); setShopCategory('food'); }} className="text-left hover:text-orange-500 transition-colors cursor-pointer">Hạt Royal Canin, hạt Lamb & Rice mềm</button>
              <button onClick={() => { setActiveTab('shop'); setShopCategory('food'); }} className="text-left hover:text-orange-500 transition-colors cursor-pointer">Pate hộp Whiskas vị cá ngừ thu</button>
              <button onClick={() => { setActiveTab('shop'); setShopCategory('toy'); }} className="text-left hover:text-orange-500 transition-colors cursor-pointer">Chuột giật cót, xương đồ chơi cao su mài răng</button>
              <button onClick={() => { setActiveTab('shop'); setShopCategory('accessory'); }} className="text-left hover:text-orange-500 transition-colors cursor-pointer">Vòng cổ đeo chuông bạc hoạt hình cute</button>
            </div>
          </div>

          {/* Contact & Address info */}
          <div className="space-y-3 text-xs text-gray-400">
            <h4 className="text-sm font-bold uppercase tracking-wider text-gray-700 mb-3">Liên Hệ & Chi Nhánh</h4>
            <div className="flex items-start space-x-2">
              <MapPin className="w-4.5 h-4.5 text-orange-500 flex-shrink-0 mt-0.5" />
              <span>Cơ sở chính: 27 Võ Trường Toản, Phường 2, Bình Thạnh, TP. Hồ Chí Minh</span>
            </div>
            <div className="pt-2 border-t border-slate-50 flex justify-between items-center text-gray-500">
              <span>Hotline và Zalo: 0989 979 675</span>
              <span>© 2026 Lumi Pet</span>
            </div>
          </div>

        </div>
      </footer>

      {/* SHOPPING CART INTEGRATION DRAWER/SIDEBAR */}
      <AnimatePresence>
        {isCartOpen && (
          <div className="fixed inset-0 z-50 overflow-hidden">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-xs transition-opacity" onClick={() => setIsCartOpen(false)} />
            
            <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
              <motion.div 
                initial={{ x: '100%' }}
                animate={{ x: 0 }}
                exit={{ x: '100%' }}
                className="w-screen max-w-md bg-white shadow-2xl relative flex flex-col justify-between"
              >
                {/* Header cart */}
                <div className="p-6 border-b border-orange-50 flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <ShoppingBag className="w-5.5 h-5.5 text-orange-500" />
                    <h3 className="text-lg font-bold text-gray-900">Giỏ Hàng Online</h3>
                  </div>
                  <button 
                    onClick={() => setIsCartOpen(false)}
                    className="p-1 text-gray-400 hover:text-gray-600 rounded-lg transition-colors cursor-pointer"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>

                {/* Main Content cart items list */}
                <div className="flex-1 overflow-y-auto p-6 space-y-4">
                  {cart.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-3">
                      <span className="text-6xl select-none">🛒</span>
                      <h4 className="text-base font-bold text-gray-700">Giỏ hàng của mẹ trống rỗng!</h4>
                      <p className="text-xs text-gray-400 max-w-xs">Ghé mục siêu thị Pet Shop sắm ngay súp thưởng bồi bổ hoặc xương cao su để boss nhai đỡ ngứa phá nệm nhé</p>
                      <button
                        onClick={() => {
                          setIsCartOpen(false);
                          setActiveTab('shop');
                        }}
                        className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-2.5 px-6 rounded-xl text-sm transition-colors cursor-pointer"
                      >
                        Quay lại Pet Shop
                      </button>
                    </div>
                  ) : (
                    cart.map(item => (
                      <div key={item.product.id} className="flex items-start justify-between space-x-3 bg-slate-50 p-3 rounded-2xl border border-slate-100">
                        {item.product.image && (
                          <img src={item.product.image} alt={item.product.name} className="w-14 h-14 rounded-xl object-cover flex-shrink-0" />
                        )}
                        <div className="flex-1">
                          <h4 className="text-xs font-bold text-gray-800 line-clamp-2 leading-tight">{item.product.name}</h4>
                          <span className="text-[10px] text-gray-405 block mt-0.5">{item.product.breedTarget || 'All breeds'}</span>
                          
                          <div className="flex items-center justify-between mt-2.5">
                            {/* Quantity buttons */}
                            <div className="flex items-center space-x-1.5 bg-white border border-slate-250 rounded-lg p-1">
                              <button 
                                onClick={() => handleUpdateCartQty(item.product.id, -1)}
                                className="p-0.5 text-gray-400 hover:text-gray-600 cursor-pointer"
                              >
                                <Minus className="w-3.5 h-3.5" />
                              </button>
                              <span className="text-xs font-bold px-1.5">{item.quantity}</span>
                              <button 
                                onClick={() => handleUpdateCartQty(item.product.id, 1)}
                                className="p-0.5 text-gray-400 hover:text-gray-600 cursor-pointer"
                              >
                                <Plus className="w-3.5 h-3.5" />
                              </button>
                            </div>

                            <span className="text-xs font-bold text-rose-500">
                              {(item.product.price * item.quantity).toLocaleString('vi-VN')}đ
                            </span>
                          </div>
                        </div>

                        <button 
                          onClick={() => handleRemoveFromCart(item.product.id)}
                          className="text-gray-300 hover:text-rose-500 cursor-pointer p-0.5"
                          title="Xoá sản phẩm"
                        >
                          <Trash2 className="w-4.5 h-4.5" />
                        </button>
                      </div>
                    ))
                  )}
                </div>

                {/* Footer sum & checkout form */}
                {cart.length > 0 && (
                  <div className="p-6 border-t border-orange-50 bg-orange-50/20">
                    <div className="flex justify-between items-baseline mb-4">
                      <span className="text-sm font-bold text-gray-600">Tổng Hoá Đơn</span>
                      <span className="text-xl font-extrabold text-rose-650 font-display">
                        {cartTotalPrice.toLocaleString('vi-VN')}đ
                      </span>
                    </div>

                    {/* Simple Checkout details on drawer directly */}
                    <form onSubmit={handleCheckoutCart} className="space-y-3.5">
                      <div className="space-y-1.5">
                        <label className="block text-[10px] font-bold uppercase text-gray-500">Nhập Địa chỉ giao hàng & SDT</label>
                        <input 
                          required
                          type="text" 
                          placeholder="Số điện thoại nhận hàng..." 
                          className="w-full text-xs p-2.5 bg-white border border-orange-100 rounded-xl focus:outline-none focus:ring-1 focus:ring-orange-400"
                        />
                        <input 
                          required
                          type="text" 
                          placeholder="Địa chỉ giao hàng chi tiết..." 
                          className="w-full text-xs p-2.5 bg-white border border-orange-100 rounded-xl focus:outline-none focus:ring-1 focus:ring-orange-400"
                        />
                      </div>

                      <button
                        type="submit"
                        className="w-full bg-orange-500 hover:bg-orange-650 text-white font-bold py-3.5 px-4 rounded-xl text-center text-sm transition-all cursor-pointer shadow-lg"
                      >
                        Xác Nhận Đặt Giao Mua Sắm
                      </button>
                    </form>
                  </div>
                )}

              </motion.div>
            </div>
          </div>
        )}
      </AnimatePresence>

      {/* DETAIL MODAL FOR SEARCHED / CLICKED SPECIFIC PRODUCT */}
      <AnimatePresence>
        {selectedProduct && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-xs" onClick={() => setSelectedProduct(null)} />
            
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-[#FFFBEB] rounded-[36px] overflow-hidden max-w-2xl w-full relative z-10 border-4 border-white shadow-2xl flex flex-col md:flex-row"
            >
              <button 
                onClick={() => setSelectedProduct(null)}
                className="absolute top-4 right-4 z-20 p-1.5 bg-white/90 backdrop-blur-xs rounded-full shadow-sm text-gray-400 hover:text-gray-650 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="md:w-1/2 bg-slate-50 h-64 md:h-auto min-h-64 relative">
                {selectedProduct.image && (
                  <img src={selectedProduct.image} alt={selectedProduct.name} className="absolute inset-0 w-full h-full object-cover" />
                )}
              </div>

              <div className="p-6 md:w-1/2 flex flex-col justify-between">
                <div>
                  <span className="text-[10px] uppercase font-bold text-orange-500 bg-orange-50 px-2.5 py-1 rounded-full border border-orange-100">
                    {selectedProduct.category}
                  </span>
                  <h3 className="text-lg font-bold text-gray-900 mt-2.5 leading-snug">{selectedProduct.name}</h3>
                  
                  <div className="flex items-center text-amber-500 text-xs font-bold mt-1.5 mb-3">
                    <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500 mr-1" />
                    <span>{selectedProduct.rating}</span>
                    <span className="text-gray-400 font-semibold ml-1">({selectedProduct.reviewsCount} reviews)</span>
                  </div>

                  <p className="text-xs text-gray-500 leading-normal mb-4">{selectedProduct.description}</p>
                  
                  <div className="bg-orange-50/50 p-3 rounded-xl border border-orange-100 space-y-1 text-[10px]">
                    {selectedProduct.breedTarget && <div className="text-gray-700 font-medium">🎯 <span className="font-bold">Đối tượng khuyên dùng:</span> {selectedProduct.breedTarget}</div>}
                    {selectedProduct.weightTarget && <div className="text-gray-700 font-medium">⚖️ <span className="font-bold">Dung tích/Khối lượng:</span> {selectedProduct.weightTarget}</div>}
                    <div className="text-gray-700 font-medium">📦 <span className="font-bold">Nhập khẩu chính ngạch:</span> FDA Approved, 100% Organic</div>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
                  <div>
                    <span className="block text-[10px] text-gray-400 font-bold uppercase">Mức Giá</span>
                    <span className="text-xl font-extrabold text-rose-500 font-display">{(selectedProduct.price).toLocaleString('vi-VN')}đ</span>
                  </div>

                  {selectedProduct.isAvailable ? (
                    <button
                      onClick={() => {
                        handleAddToCart(selectedProduct);
                        setSelectedProduct(null);
                      }}
                      className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 px-6 rounded-xl text-xs transition-colors cursor-pointer"
                    >
                      Thêm vào giỏ
                    </button>
                  ) : (
                    <span className="text-xs text-orange-550 bg-orange-55 px-3 py-2.5 rounded-xl font-bold">
                      Tạm Hết Hàng
                    </span>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* UNIFIED BOOKING FORM MODAL */}
      <AnimatePresence>
        {isBookingModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-xs" onClick={() => setIsBookingModalOpen(false)} />
            
            <motion.div 
              initial={{ scale: 0.95, opacity: 0, y: 15 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 15 }}
              className="bg-white rounded-[32px] overflow-hidden max-w-2xl w-full relative z-10 border border-orange-100 shadow-2xl flex flex-col max-h-[90vh]"
            >
              {/* Header */}
              <div className="p-6 border-b border-orange-100 flex items-center justify-between bg-orange-50/20">
                <div className="flex items-center space-x-2">
                  <Calendar className="w-5.5 h-5.5 text-orange-500" />
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 leading-tight">Đặt lịch dịch vụ Lumi Pet</h3>
                    <span className="text-xs text-gray-500 font-medium">Báo cáo tình trạng phòng tự động qua SMS</span>
                  </div>
                </div>
                <button 
                  onClick={() => setIsBookingModalOpen(false)}
                  className="p-1.5 text-gray-400 hover:text-gray-600 rounded-lg transition-colors cursor-pointer"
                >
                  <X className="w-5.5 h-5.5" />
                </button>
              </div>

              {/* Form Content Scrollable */}
              <form onSubmit={handleBookingSubmit} className="flex-grow overflow-y-auto p-6 space-y-5">
                
                {/* Segment 1: Thú cưng */}
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-150 space-y-4">
                  <h4 className="text-xs font-extrabold uppercase text-orange-550 tracking-wider">🐾 Đại diện thông tin thú nuôi</h4>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="block text-[11px] font-bold uppercase text-gray-550">Tên của bé boss (nếu có)</label>
                      <input 
                        type="text" 
                        value={bookingFormData.petName}
                        onChange={(e) => setBookingFormData({ ...bookingFormData, petName: e.target.value })}
                        placeholder="Mochi, Rocky, Bánh Bao..." 
                        className="w-full text-xs p-2.5 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-orange-400"
                      />
                    </div>

                    <div className="space-y-1">
                      <label id="booking-pet-type-label" className="block text-[11px] font-bold uppercase text-gray-550">Thú cưng thuộc loài nào</label>
                      <div className="grid grid-cols-2 gap-2">
                        <button
                          type="button"
                          onClick={() => setBookingFormData({ ...bookingFormData, petType: 'dog' })}
                          className={`py-2 text-xs font-bold rounded-xl cursor-pointer ${
                            bookingFormData.petType === 'dog' 
                              ? 'bg-orange-500 text-white shadow-sm' 
                              : 'bg-white border border-slate-200 text-slate-500'
                          }`}
                        >
                          Chó Cưng 🐶
                        </button>
                        <button
                          type="button"
                          onClick={() => setBookingFormData({ ...bookingFormData, petType: 'cat' })}
                          className={`py-2 text-xs font-bold rounded-xl cursor-pointer ${
                            bookingFormData.petType === 'cat' 
                              ? 'bg-orange-500 text-white shadow-sm' 
                              : 'bg-white border border-slate-200 text-slate-500'
                          }`}
                        >
                          Mèo Hoa 🐱
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Weight Selector inside booking */}
                  <div className="space-y-1">
                    <div className="flex justify-between items-baseline">
                      <label className="block text-[11px] font-bold uppercase text-gray-555">Cân nặng dự tính của bé: <span className="text-orange-550 font-bold">{bookingFormData.petWeight} kg</span></label>
                      <span className="text-[10px] text-gray-400">(Trọng lượng quyết định thời gian thợ spa tắm sấy)</span>
                    </div>
                    <input 
                      type="range" 
                      min="1" 
                      max="35" 
                      value={bookingFormData.petWeight}
                      onChange={(e) => setBookingFormData({ ...bookingFormData, petWeight: Number(e.target.value) })}
                      className="w-full accent-orange-500 bg-orange-100 rounded-lg appearance-none h-1.5"
                    />
                  </div>
                </div>

                {/* Segment 2: Chọn hình thức Spa vs Hotel */}
                <div className="space-y-3">
                  <label className="block text-xs font-bold uppercase text-gray-700">🗓️ Kiểu đặt lịch</label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setBookingFormData({ ...bookingFormData, bookingType: 'spa', serviceId: SPA_SERVICES[0].id })}
                      className={`p-3.5 rounded-2xl font-bold text-xs cursor-pointer border-2 transition-all flex flex-col items-center justify-center ${
                        bookingFormData.bookingType === 'spa' 
                          ? 'border-orange-500 bg-orange-50/50 text-orange-600' 
                          : 'border-slate-100 bg-white text-slate-500'
                      }`}
                    >
                      <span className="text-lg">🛁</span>
                      <span className="mt-1">Dịch Vụ Spa Lông</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setBookingFormData({ ...bookingFormData, bookingType: 'hotel', serviceId: HOTEL_ROOMS[0].id })}
                      className={`p-3.5 rounded-2xl font-bold text-xs cursor-pointer border-2 transition-all flex flex-col items-center justify-center ${
                        bookingFormData.bookingType === 'hotel' 
                          ? 'border-orange-500 bg-orange-50/50 text-orange-600' 
                          : 'border-slate-100 bg-white text-slate-500'
                      }`}
                    >
                      <span className="text-lg">🏨</span>
                      <span className="mt-1">Lưu Trú Khách Sạn</span>
                    </button>
                  </div>
                </div>

                {/* Specific option dropdown based on tab type */}
                <div className="space-y-1">
                  <label id="booking-item-select-label" className="block text-[11px] font-bold uppercase text-gray-550">
                    {bookingFormData.bookingType === 'spa' ? 'Chọn Combo Spa chăm sóc' : 'Chọn Hạng phòng cabin kính nghỉ dưỡng'}
                  </label>
                  <select
                    value={bookingFormData.serviceId}
                    onChange={(e) => setBookingFormData({ ...bookingFormData, serviceId: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs font-bold focus:outline-none focus:ring-1 focus:ring-orange-405"
                  >
                    {bookingFormData.bookingType === 'spa' ? (
                      SPA_SERVICES.map(s => <option key={s.id} value={s.id}>{s.name} - (Khởi điểm: {s.price.toLocaleString('vi-VN')}đ)</option>)
                    ) : (
                      HOTEL_ROOMS.map(r => <option key={r.id} value={r.id}>{r.name} - (Phục vụ 24h: {r.pricePerNight.toLocaleString('vi-VN')}đ)</option>)
                    )}
                  </select>
                </div>

                {/* Date & Time config depending on booking type */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {bookingFormData.bookingType === 'spa' ? (
                    <>
                      <div className="space-y-1">
                        <label className="block text-[11px] font-bold uppercase text-gray-550">Chọn ngày thực hiện</label>
                        <input 
                          type="date" 
                          required={bookingFormData.bookingType === 'spa'}
                          value={bookingFormData.date}
                          onChange={(e) => setBookingFormData({ ...bookingFormData, date: e.target.value })}
                          className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="block text-[11px] font-bold uppercase text-gray-550">Khung giờ vàng rảnh rỗi</label>
                        <select
                          value={bookingFormData.timeSlot}
                          onChange={(e) => setBookingFormData({ ...bookingFormData, timeSlot: e.target.value })}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-semibold focus:outline-none"
                        >
                          <option>08:00 - 09:00</option>
                          <option>09:00 - 10:00 (Khuyên dùng)</option>
                          <option>10:00 - 11:30</option>
                          <option>13:30 - 14:30</option>
                          <option>14:30 - 16:00</option>
                          <option>16:00 - 17:30</option>
                        </select>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="space-y-1">
                        <label className="block text-[11px] font-bold uppercase text-gray-555">Ngày nhận phòng (Check-in)</label>
                        <input 
                          type="date" 
                          required={bookingFormData.bookingType === 'hotel'}
                          value={bookingFormData.checkInDate}
                          onChange={(e) => setBookingFormData({ ...bookingFormData, checkInDate: e.target.value })}
                          className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="block text-[11px] font-bold uppercase text-gray-555">Ngày trả phòng (Check-out)</label>
                        <input 
                          type="date" 
                          required={bookingFormData.bookingType === 'hotel'}
                          value={bookingFormData.checkOutDate}
                          onChange={(e) => setBookingFormData({ ...bookingFormData, checkOutDate: e.target.value })}
                          className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none"
                        />
                      </div>
                    </>
                  )}
                </div>

                {/* Segment 3: Customer contact details */}
                <div className="space-y-3.5 border-t border-slate-100 pt-4">
                  <h4 className="text-xs font-extrabold uppercase text-orange-550 tracking-wider">📞 Liên hệ chủ nuôi chính xác</h4>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="block text-[11px] font-bold uppercase text-gray-550">Họ & Tên ba mẹ *</label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300" />
                        <input 
                          required
                          type="text" 
                          placeholder="Ví dụ: Nguyễn Linh Chi" 
                          value={bookingFormData.customerName}
                          onChange={(e) => setBookingFormData({ ...bookingFormData, customerName: e.target.value })}
                          className="w-full text-xs pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-orange-400"
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label id="booking-phone-label" className="block text-[11px] font-bold uppercase text-gray-550">Số điện thoại liên lạc *</label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300" />
                        <input 
                          required
                          type="tel" 
                          placeholder="Ví dụ: 0988xxxxxx" 
                          value={bookingFormData.customerPhone}
                          onChange={(e) => setBookingFormData({ ...bookingFormData, customerPhone: e.target.value })}
                          className="w-full text-xs pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="block text-[11px] font-bold uppercase text-gray-555">Thư điện tử Email (Không bắt buộc)</label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300" />
                      <input 
                        type="email" 
                        placeholder="Ví dụ: name@gmail.com" 
                        value={bookingFormData.customerEmail}
                        onChange={(e) => setBookingFormData({ ...bookingFormData, customerEmail: e.target.value })}
                        className="w-full text-xs pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="block text-[11px] font-bold uppercase text-gray-550">Lưu ý đặc biệt về tính cách hoặc thói quen của bé</label>
                    <textarea 
                      placeholder="Bé kén ăn cơm, nhát kéo cắt tỉa, sợ người lạ hoặc có thói quen ăn hạt riêng mang theo..." 
                      value={bookingFormData.notes}
                      onChange={(e) => setBookingFormData({ ...bookingFormData, notes: e.target.value })}
                      className="w-full text-xs p-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none h-16 resize-none"
                    />
                  </div>
                </div>

                {/* Footer submit wrapper */}
                <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-4">
                  <div className="text-xs text-gray-400">
                    * Ấn Hoàn tất lịch trình đồng nghĩa ba mẹ nhất trí với chính sách giữ lồng cabin của Lumi Pet.
                  </div>
                  <button
                    type="submit"
                    className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-3.5 px-6 rounded-xl text-xs transition-colors cursor-pointer text-center shadow-lg"
                  >
                    Hoàn Tất Đặt Lịch & Đăng Ký
                  </button>
                </div>

              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <EmailVoucherModal
        booking={selectedEmailBooking}
        isOpen={isEmailModalOpen}
        onClose={() => setIsEmailModalOpen(false)}
        onUpdateEmail={handleUpdateBookingEmail}
      />

    </div>
  );
}
