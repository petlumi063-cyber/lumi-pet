/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  CalendarDays, Cat, Dog, HeartPulse, Sparkles, User, 
  Phone, Clock, FileText, CheckCircle2, Ticket, Scale, CalendarCheck2, Trash2, Mail
} from 'lucide-react';
import { Booking, SpaService, HotelRoom } from '../types';
import { SPA_SERVICES, HOTEL_ROOMS } from '../data';
import { formatVND } from './ShopSection';
import EmailVoucherModal from './EmailVoucherModal';

interface ReservationFormProps {
  preselectedBookingType: 'spa' | 'hotel' | null;
  preselectedServiceId: string | null;
  clearPreselection: () => void;
}

export default function ReservationForm({
  preselectedBookingType,
  preselectedServiceId,
  clearPreselection,
}: ReservationFormProps) {
  // Booking Category tabs: spa or hotel
  const [bookingType, setBookingType] = useState<'spa' | 'hotel'>('spa');
  
  // Form Inputs
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [petName, setPetName] = useState('');
  const [petType, setPetType] = useState<'dog' | 'cat'>('dog');
  const [petWeight, setPetWeight] = useState<number>(3); // base in kg
  
  const [selectedServiceId, setSelectedServiceId] = useState(SPA_SERVICES[0].id);
  const [selectedRoomId, setSelectedRoomId] = useState(HOTEL_ROOMS[0].id);

  // Spa schedule
  const [spaDate, setSpaDate] = useState('');
  const [spaTimeSlot, setSpaTimeSlot] = useState('09:00 - 10:00');

  // Hotel schedule
  const [hotelCheckIn, setHotelCheckIn] = useState('');
  const [hotelCheckOut, setHotelCheckOut] = useState('');

  const [notes, setNotes] = useState('');

  // Confirmation state
  const [recentBooking, setRecentBooking] = useState<Booking | null>(null);
  const [allBookings, setAllBookings] = useState<Booking[]>([]);

  // Email voucher modal state
  const [selectedEmailBooking, setSelectedEmailBooking] = useState<Booking | null>(null);
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);

  const handleUpdateBookingEmail = (newEmail: string) => {
    if (!selectedEmailBooking) return;
    
    const updatedModel = { ...selectedEmailBooking, customerEmail: newEmail };
    setSelectedEmailBooking(updatedModel);
    
    if (recentBooking && recentBooking.id === selectedEmailBooking.id) {
      setRecentBooking(updatedModel);
    }
    
    const updatedList = allBookings.map(b => b.id === selectedEmailBooking.id ? updatedModel : b);
    saveBookingsList(updatedList);
  };

  // Time slots for spa
  const timeSlots = [
    '08:30 - 09:30',
    '09:45 - 10:45',
    '11:00 - 12:00',
    '13:30 - 14:30',
    '14:45 - 15:45',
    '16:00 - 17:00',
    '17:15 - 18:15',
  ];

  // Sync with Preselected state from Shop or Hero or detail cards
  useEffect(() => {
    if (preselectedBookingType) {
      setBookingType(preselectedBookingType);
      if (preselectedBookingType === 'spa' && preselectedServiceId) {
        setSelectedServiceId(preselectedServiceId);
      } else if (preselectedBookingType === 'hotel' && preselectedServiceId) {
        setSelectedRoomId(preselectedServiceId);
      }
      clearPreselection();
    }
  }, [preselectedBookingType, preselectedServiceId]);

  // Load existing bookings of user
  useEffect(() => {
    const saved = localStorage.getItem('pet_all_bookings');
    if (saved) {
      try {
        setAllBookings(JSON.parse(saved));
      } catch (err) {
        console.error(err);
      }
    }
  }, []);

  // Save bookings to localStorage helper
  const saveBookingsList = (list: Booking[]) => {
    setAllBookings(list);
    localStorage.setItem('pet_all_bookings', JSON.stringify(list));
  };

  // Weight Coefficient Multiplier
  // - Pet under 5kg: Base price (Multiplier x1.0)
  // - Pet 5kg - 10kg: +20% (Multiplier x1.2)
  // - Pet 10kg - 25kg: +50% (Multiplier x1.5)
  // - Pet over 25kg: +80% (Multiplier x1.8)
  const getWeightMultiplier = (weight: number) => {
    if (weight < 5) return 1.0;
    if (weight >= 5 && weight < 10) return 1.2;
    if (weight >= 10 && weight < 25) return 1.5;
    return 1.8;
  };

  // Dynamic pricing calculation
  const calculateTotalPrice = () => {
    const weightMultiplier = getWeightMultiplier(petWeight);
    if (bookingType === 'spa') {
      const service = SPA_SERVICES.find(s => s.id === selectedServiceId) || SPA_SERVICES[0];
      return Math.round(service.price * weightMultiplier);
    } else {
      const room = HOTEL_ROOMS.find(r => r.id === selectedRoomId) || HOTEL_ROOMS[0];
      
      // Calculate nights if possible, fallback to 1 night
      if (hotelCheckIn && hotelCheckOut) {
        const inDate = new Date(hotelCheckIn);
        const outDate = new Date(hotelCheckOut);
        const timeDiff = outDate.getTime() - inDate.getTime();
        const nights = Math.max(1, Math.ceil(timeDiff / (1000 * 3600 * 24)));
        return Math.round(room.pricePerNight * nights * weightMultiplier);
      }
      return Math.round(room.pricePerNight * weightMultiplier);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!customerName || !customerPhone) {
      alert('Vui lòng nhập đầy đủ Tên chủ nuôi và Số điện thoại!');
      return;
    }

    if (bookingType === 'spa' && !spaDate) {
      alert('Vui lòng chọn ngày mong muốn làm spa!');
      return;
    }

    if (bookingType === 'hotel') {
      if (!hotelCheckIn || !hotelCheckOut) {
        alert('Vui lòng chọn đầy đủ ngày nhận phòng và ngày trả phòng khách sạn!');
        return;
      }
      const inDate = new Date(hotelCheckIn);
      const outDate = new Date(hotelCheckOut);
      if (outDate < inDate) {
        alert('Ngày trả phòng phải diễn ra sau ngày nhận phòng!');
        return;
      }
    }

    const matchedService = bookingType === 'spa'
      ? SPA_SERVICES.find(s => s.id === selectedServiceId)
      : HOTEL_ROOMS.find(r => r.id === selectedRoomId);

    const price = calculateTotalPrice();
    const code = 'BK-' + Math.floor(100000 + Math.random() * 900000);

    const newBooking: Booking = {
      id: code,
      customerName,
      customerPhone,
      customerEmail,
      petName,
      petType,
      petWeight,
      bookingType,
      serviceId: bookingType === 'spa' ? selectedServiceId : selectedRoomId,
      serviceType: matchedService ? matchedService.name : 'Dịch vụ cao cấp',
      date: bookingType === 'spa' ? spaDate : undefined,
      timeSlot: bookingType === 'spa' ? spaTimeSlot : undefined,
      checkInDate: bookingType === 'hotel' ? hotelCheckIn : undefined,
      checkOutDate: bookingType === 'hotel' ? hotelCheckOut : undefined,
      notes,
      totalPrice: price,
      status: 'confirmed',
      createdAt: new Date().toLocaleDateString('vi-VN')
    };

    const updatedList = [newBooking, ...allBookings];
    saveBookingsList(updatedList);
    setRecentBooking(newBooking);

    // Clean inputs up
    setPetName('');
    setNotes('');
  };

  const handleDeleteBooking = (id: string) => {
    if (confirm('Bạn chắc chắn muốn hủy bỏ lịch đặt này chứ?')) {
      const filtered = allBookings.filter(b => b.id !== id);
      saveBookingsList(filtered);
    }
  };

  return (
    <div className="py-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      
      {/* Upper header */}
      <div className="text-center max-w-3xl mx-auto mb-12">
        <h2 className="text-3xl font-extrabold text-slate-800 tracking-tight font-display">
          Đặt Lịch Hẹn <span className="text-amber-500">Đặt Phòng Thú Cưng</span> Trực Tuyển
        </h2>
        <p className="text-slate-500 text-sm mt-2 leading-relaxed">
          Tối ưu thời gian chờ đợi. Ước tính chi phí chi tiết theo cân nặng, tự động lưu lịch sử chăm sóc và thông báo ngay lập tức.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Booking Form Card */}
        <div className="lg:col-span-7 bg-white rounded-3xl border border-orange-100 p-6 sm:p-8 shadow-xs relative">
          
          {/* Internal Tabs Switch */}
          <div className="flex border-b border-orange-50 pb-4 mb-6">
            <button
              onClick={() => {
                setBookingType('spa');
                setRecentBooking(null);
              }}
              className={`flex-1 flex items-center justify-center space-x-2 py-3 rounded-xl font-bold text-sm cursor-pointer transition-all ${
                bookingType === 'spa'
                  ? 'bg-amber-500 text-white shadow-xs'
                  : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              <Sparkles className="w-4.5 h-4.5" />
              <span>Grooming & Spa</span>
            </button>
            <button
              onClick={() => {
                setBookingType('hotel');
                setRecentBooking(null);
              }}
              className={`flex-1 flex items-center justify-center space-x-2 py-3 rounded-xl font-bold text-sm cursor-pointer transition-all ${
                bookingType === 'hotel'
                  ? 'bg-amber-500 text-white shadow-xs'
                  : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              <CalendarDays className="w-4.5 h-4.5" />
              <span>Hotel Khách Sạn</span>
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Grid 1: Owner Details */}
            <div className="bg-slate-50/50 rounded-2xl p-4 border border-slate-100 space-y-4">
              <span className="block text-xs font-black text-slate-400 uppercase tracking-widest flex items-center space-x-1.5">
                <User className="w-3.5 h-3.5 text-slate-400" />
                <span>1. Thông tin liên lạc chủ nuôi</span>
              </span>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1.5" htmlFor="cust-name">
                    Tên chủ nuôi *
                  </label>
                  <input
                    type="text"
                    required
                    id="cust-name"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="Ví dụ: Anh Tuấn"
                    className="w-full px-4 py-2.5 rounded-xl border border-orange-100/60 bg-white text-sm text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1.5" htmlFor="cust-phone">
                    SĐT di động *
                  </label>
                  <input
                    type="tel"
                    required
                    id="cust-phone"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    placeholder="Ví dụ: 0987654321"
                    className="w-full px-4 py-2.5 rounded-xl border border-orange-100/60 bg-white text-sm text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1.5" htmlFor="cust-email">
                  Địa chỉ Email (Nếu có)
                </label>
                <input
                  type="email"
                  id="cust-email"
                  value={customerEmail}
                  onChange={(e) => setCustomerEmail(e.target.value)}
                  placeholder="name@email.com"
                  className="w-full px-4 py-2.5 rounded-xl border border-orange-100/60 bg-white text-sm text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>
            </div>

            {/* Grid 2: Pet Details */}
            <div className="bg-slate-50/50 rounded-2xl p-4 border border-slate-100 space-y-4">
              <span className="block text-xs font-black text-slate-400 uppercase tracking-widest flex items-center space-x-1.5">
                <Cat className="w-3.5 h-3.5 text-slate-400" />
                <span>2. Miêu tả thông số thú cưng</span>
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1.5" htmlFor="pet-name">
                    Tên thú cưng *
                  </label>
                  <input
                    type="text"
                    required
                    id="pet-name"
                    value={petName}
                    onChange={(e) => setPetName(e.target.value)}
                    placeholder="Ví dụ: Mochi, Rocky..."
                    className="w-full px-4 py-2.5 rounded-xl border border-orange-100/60 bg-white text-sm text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>

                {/* Pet Type Dog or Cat */}
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1.5">
                    Thú cưng là *
                  </label>
                  <div className="flex space-x-2">
                    <button
                      type="button"
                      onClick={() => setPetType('dog')}
                      className={`flex-1 py-2.5 rounded-xl text-xs font-bold border transition-all flex items-center justify-center space-x-1 cursor-pointer ${
                        petType === 'dog'
                          ? 'bg-amber-100/80 border-amber-400 text-amber-700 font-extrabold'
                          : 'bg-white border-slate-200 text-slate-650'
                      }`}
                    >
                      <Dog className="w-4 h-4" />
                      <span>Bé Chó</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setPetType('cat')}
                      className={`flex-1 py-2.5 rounded-xl text-xs font-bold border transition-all flex items-center justify-center space-x-1 cursor-pointer ${
                        petType === 'cat'
                          ? 'bg-amber-100/80 border-amber-400 text-amber-700 font-extrabold'
                          : 'bg-white border-slate-200 text-slate-650'
                      }`}
                    >
                      <Cat className="w-4 h-4" />
                      <span>Bé Mèo</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Pet Weight - Vital for cost multiplier */}
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1 flex items-center justify-between">
                  <span>Cân nặng ước lượng (kg) *</span>
                  <span className="text-amber-600 text-xs font-bold bg-amber-50 px-2 py-0.5 rounded-md">
                    Hệ số giá: x{getWeightMultiplier(petWeight).toFixed(1)}
                  </span>
                </label>
                <div className="flex items-center space-x-3 bg-white p-2 border border-orange-100/60 rounded-xl">
                  <Scale className="w-4.5 h-4.5 text-slate-400 flex-shrink-0 ml-1" />
                  <input
                    type="range"
                    min="1"
                    max="45"
                    value={petWeight}
                    onChange={(e) => setPetWeight(Number(e.target.value))}
                    className="flex-1 accent-amber-500 cursor-pointer h-1.5"
                  />
                  <span className="text-sm font-extrabold text-slate-800 w-12 text-right">
                    {petWeight} kg
                  </span>
                </div>
                <p className="text-[10px] text-slate-450 mt-1 pl-1 leading-relaxed">
                  * Lumi Pet áp dụng các bậc hệ số: Dưới 5kg: giá gốc; Từ 5 - 10kg: +20%; Từ 10 - 25kg: +50%; Trên 25kg: +80%.
                </p>
              </div>
            </div>

            {/* Grid 3: Service Specifications */}
            <div className="bg-slate-50/50 rounded-2xl p-4 border border-slate-100 space-y-4">
              <span className="block text-xs font-black text-slate-400 uppercase tracking-widest flex items-center space-x-1.5">
                <CalendarCheck2 className="w-3.5 h-3.5 text-slate-400" />
                <span>3. Chọn lựa gói dịch vụ & Lịch hẹn</span>
              </span>

              {bookingType === 'spa' ? (
                /* SPA SPECIFICS */
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-600 mb-1.5" htmlFor="spa-package-select">
                      Chọn gói dịch vụ Spa *
                    </label>
                    <select
                      id="spa-package-select"
                      value={selectedServiceId}
                      onChange={(e) => setSelectedServiceId(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-orange-100/60 bg-white text-sm text-slate-755 font-semibold focus:outline-none focus:ring-2 focus:ring-amber-500"
                    >
                      {SPA_SERVICES.map((s) => (
                        <option key={s.id} value={s.id}>
                          {s.name} (Từ {formatVND(s.price)})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-600 mb-1.5" htmlFor="spa-date-pick">
                        Ngày đặt hẹn *
                      </label>
                      <input
                        type="date"
                        required
                        id="spa-date-pick"
                        value={spaDate}
                        onChange={(e) => setSpaDate(e.target.value)}
                        min={new Date().toISOString().split('T')[0]}
                        className="w-full px-4 py-2.5 rounded-xl border border-orange-100/60 bg-white text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-amber-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-600 mb-1.5" htmlFor="spa-time-pick">
                        Khung giờ đến *
                      </label>
                      <select
                        id="spa-time-pick"
                        value={spaTimeSlot}
                        onChange={(e) => setSpaTimeSlot(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl border border-orange-100/60 bg-white text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-amber-500"
                      >
                        {timeSlots.map((slot, index) => (
                          <option key={index} value={slot}>
                            {slot}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              ) : (
                /* HOTEL SPECIFICS */
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-600 mb-1.5" htmlFor="hotel-room-select">
                      Hạng phòng kính khách sạn *
                    </label>
                    <select
                      id="hotel-room-select"
                      value={selectedRoomId}
                      onChange={(e) => setSelectedRoomId(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-orange-100/60 bg-white text-sm text-slate-755 font-semibold focus:outline-none focus:ring-2 focus:ring-amber-500"
                    >
                      {HOTEL_ROOMS.map((r) => (
                        <option key={r.id} value={r.id}>
                          {r.name} (Từ {formatVND(r.pricePerNight)} / đêm)
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-600 mb-1.5" htmlFor="hotel-check-in-date">
                        Ngày nhận phòng (Check-in) *
                      </label>
                      <input
                        type="date"
                        required
                        id="hotel-check-in-date"
                        value={hotelCheckIn}
                        onChange={(e) => setHotelCheckIn(e.target.value)}
                        min={new Date().toISOString().split('T')[0]}
                        className="w-full px-4 py-2.5 rounded-xl border border-orange-100/60 bg-white text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-amber-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-600 mb-1.5" htmlFor="hotel-check-out-date">
                        Ngày trả phòng (Check-out) *
                      </label>
                      <input
                        type="date"
                        required
                        id="hotel-check-out-date"
                        value={hotelCheckOut}
                        disabled={!hotelCheckIn}
                        onChange={(e) => setHotelCheckOut(e.target.value)}
                        min={hotelCheckIn || new Date().toISOString().split('T')[0]}
                        className="w-full px-4 py-2.5 rounded-xl border border-orange-100/60 bg-white text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-amber-500 disabled:opacity-50"
                      />
                    </div>
                  </div>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1.5" htmlFor="pet-note-text">
                  Dặn dò bảo mẫu / Tiền sử bệnh lý thú cưng (nếu có)
                </label>
                <textarea
                  id="pet-note-text"
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Ghi rõ thói quen ăn uống, bé nhát người hay sợ tiếng sấy hoặc tiểu sử nấm ngứa..."
                  className="w-full px-4 py-2.5 rounded-xl border border-orange-100/60 bg-white text-sm text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

            </div>

            {/* Calculations Panel Display in-place */}
            <div className="bg-amber-100/40 rounded-3xl p-5 border border-amber-300/40 relative overflow-hidden">
              <div className="absolute -right-5 -bottom-5 w-20 h-20 bg-amber-500/5 rounded-full pointer-events-none" />
              
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                  <span className="block text-xs text-amber-800 font-bold uppercase tracking-wider mb-0.5">
                    💸 Chi phí ước tính tạm tính
                  </span>
                  <div className="flex items-baseline space-x-1.5">
                    <span className="text-3xl font-black text-amber-700 font-display">
                      {formatVND(calculateTotalPrice())}
                    </span>
                    <span className="text-[11px] text-slate-500 font-bold">
                      {bookingType === 'hotel' ? '(Tính theo đêm & cân nặng)' : '(Bao trọn các bước & cân nặng)'}
                    </span>
                  </div>
                </div>

                <button
                  type="submit"
                  id="book-main-submit"
                  className="w-full sm:w-auto bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-extrabold px-8 py-4 rounded-2xl shadow-md transition-all text-sm cursor-pointer hover:scale-103"
                >
                  XÁC NHẬN ĐẶT LỊCH HẸN
                </button>
              </div>
            </div>

          </form>

        </div>

        {/* Right column: Ticket Confirmation / My Bookings panel */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* 1. Show ticket voucher of current booking if there is one */}
          <AnimatePresence mode="wait">
            {recentBooking && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="bg-amber-50 rounded-[32px] border border-amber-200 overflow-hidden shadow-md"
              >
                {/* Visual Ticket Header */}
                <div className="bg-gradient-to-r from-amber-500 to-orange-500 p-5 text-white flex items-center justify-between relative">
                  {/* Decorative ticket notch holes */}
                  <div className="absolute -left-3 top-1/2 -translate-y-1/2 w-6 h-6 bg-[#FCFBFA] border-r border-amber-200 rounded-full" />
                  <div className="absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-6 bg-[#FCFBFA] border-l border-amber-200 rounded-full" />

                  <div className="pl-2">
                    <span className="block text-[10px] font-black uppercase tracking-widest text-amber-100">PHIẾU ĐẶT CHỖ CHÍNH THỨC</span>
                    <span className="block text-xl font-black font-display mt-0.5">Lumi Pet Confirmation</span>
                  </div>
                  <Ticket className="w-8 h-8 text-amber-100 pr-2 stroke-1" />
                </div>

                {/* Ticket Body */}
                <div className="p-6 space-y-4">
                  <div className="flex items-center justify-between border-b border-dashed border-amber-200 pb-3">
                    <div>
                      <span className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider">MÃ ĐĂNG KÝ HẸN</span>
                      <span className="text-lg font-black text-slate-800 font-display">{recentBooking.id}</span>
                    </div>
                    <div className="text-right">
                      <span className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider">TRẠNG THÁI</span>
                      <span className="inline-block bg-emerald-100 text-emerald-800 text-xs px-2.5 py-0.5 rounded-full font-bold">✓ Đã xác nhận</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-y-4 gap-x-2 text-xs border-b border-dashed border-amber-200 pb-4">
                    <div>
                      <span className="block text-[10px] text-slate-405 font-bold uppercase">CHỦ NUÔI</span>
                      <span className="font-bold text-slate-700">{recentBooking.customerName}</span>
                    </div>
                    <div>
                      <span className="block text-[10px] text-slate-405 font-bold uppercase">SỐ ĐIỆN THOẠI</span>
                      <span className="font-bold text-slate-700">{recentBooking.customerPhone}</span>
                    </div>
                    <div>
                      <span className="block text-[10px] text-slate-405 font-bold uppercase">BOSS CƯNG</span>
                      <span className="font-bold text-slate-700">{recentBooking.petName} ({recentBooking.petType === 'dog' ? 'Chó' : 'Mèo'} - {recentBooking.petWeight}kg)</span>
                    </div>
                    <div>
                      <span className="block text-[10px] text-slate-405 font-bold uppercase">NGÀY LÀM VIỆC</span>
                      <span className="font-bold text-slate-700">
                        {recentBooking.bookingType === 'spa' 
                          ? `${recentBooking.date} / ${recentBooking.timeSlot}`
                          : `Từ ${recentBooking.checkInDate} đến ${recentBooking.checkOutDate}`
                        }
                      </span>
                    </div>
                  </div>

                  <div>
                    <span className="block text-[10px] text-slate-405 font-bold uppercase">DỊCH VỤ PHỤC VỤ</span>
                    <span className="block font-bold text-sm text-slate-820 mt-0.5">
                      {recentBooking.serviceType}
                    </span>
                  </div>

                  <div className="bg-white rounded-2xl p-4 border border-amber-100 flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-500">Thành tiền thanh toán tại quầy</span>
                    <span className="text-lg font-black text-amber-700 font-display">
                      {formatVND(recentBooking.totalPrice)}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setSelectedEmailBooking(recentBooking);
                      setIsEmailModalOpen(true);
                    }}
                    className="w-full flex items-center justify-center space-x-1.5 bg-[#FAF4F0] hover:bg-[#ebd8ce]/50 text-[#a25230] border border-[#f4dbcf] font-semibold py-2.5 px-4 rounded-xl text-xs transition-colors cursor-pointer shadow-xs"
                  >
                    <Mail className="w-4 h-4" />
                    <span>Xem Thư Xác Nhận Gửi Về Email</span>
                  </button>

                  <p className="text-[10px] text-slate-450 leading-relaxed italic text-center">
                    Cảm ơn bợn đã tin dùng Lumi Pet. Vui lòng chuẩn bị sẵn sổ khám của bé và tới đúng giờ hẹn nhé!
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* 2. List of All Confirmed Bookings saved in this browser session */}
          <div className="bg-white rounded-3xl border border-orange-100 p-6 shadow-xs">
            <h3 className="text-base font-bold text-slate-800 mb-4 font-display flex items-center space-x-2">
              <span className="text-xl">📋</span>
              <span>Lịch hẹn lưu trú và chăm sóc ({allBookings.length})</span>
            </h3>

            {allBookings.length === 0 ? (
              <div className="py-8 text-center text-slate-400">
                <p className="text-xs">Hiện tại chưa có lịch hẹn ghi nhận trong đợt này.</p>
                <p className="text-[10px] text-slate-400 mt-1">Sử dụng biểu mẫu bên cạnh để book lịch spa thú cưng lý tưởng nhất.</p>
              </div>
            ) : (
              <div className="space-y-3 max-h-[380px] overflow-y-auto pr-1">
                {allBookings.map((b) => (
                  <div
                    key={b.id}
                    id={`saved-booking-${b.id}`}
                    className="p-3 bg-slate-50 border border-slate-100 hover:border-amber-200 rounded-2xl flex items-start justify-between space-x-2 transition-all relative"
                  >
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="text-[10px] font-black uppercase text-amber-600 bg-amber-50 px-2 py-0.5 rounded-lg">
                          {b.id}
                        </span>
                        <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full ${
                          b.bookingType === 'spa' 
                            ? 'bg-emerald-50 text-emerald-800' 
                            : 'bg-indigo-50 text-indigo-800'
                        }`}>
                          {b.bookingType === 'spa' ? 'Spa' : 'Hotel'}
                        </span>
                      </div>
                      
                      <h4 className="text-xs font-bold text-slate-850 mt-1.5">
                        {b.petName} ({b.petWeight}kg) - {b.serviceType}
                      </h4>
                      
                      <p className="text-[10px] text-slate-500 mt-1 leading-snug">
                        {b.bookingType === 'spa' 
                          ? `Hẹn: ${b.date} lúc ${b.timeSlot}`
                          : `Lưu trú: ${b.checkInDate} → ${b.checkOutDate}`
                        }
                      </p>

                      <span className="block text-xs font-extrabold text-amber-700 mt-1.5 font-display">
                        Giá: {formatVND(b.totalPrice)}
                      </span>
                    </div>

                    <div className="flex flex-col space-y-1 flex-shrink-0">
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedEmailBooking(b);
                          setIsEmailModalOpen(true);
                        }}
                        className="p-1.5 hover:bg-orange-50 text-slate-400 hover:text-orange-500 border border-transparent hover:border-orange-100 rounded-lg transition-colors flex-shrink-0 cursor-pointer"
                        title="Xem hộp thư xác nhận Email"
                      >
                        <Mail className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteBooking(b.id)}
                        className="p-1.5 hover:bg-rose-50 text-slate-400 hover:text-rose-500 border border-transparent hover:border-rose-100 rounded-lg transition-colors flex-shrink-0 cursor-pointer"
                        title="Hủy lịch hẹn"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

      </div>

      <EmailVoucherModal
        booking={selectedEmailBooking}
        isOpen={isEmailModalOpen}
        onClose={() => setIsEmailModalOpen(false)}
        onUpdateEmail={handleUpdateBookingEmail}
      />

    </div>
  );
}
