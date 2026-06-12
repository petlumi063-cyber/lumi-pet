/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ShieldAlert, Settings, Calendar, ClipboardList, TrendingUp, Users, DollarSign,
  Layers, CheckCircle, Clock, Ban, Save, Bell, BellOff, ArrowUpRight, 
  Send, RotateCcw, AlertTriangle, MessageSquare, Info, ShieldCheck, Mail, Sliders
} from 'lucide-react';
import { Booking } from '../types';
import { formatVND } from './ShopSection';

interface AdminPanelProps {
  bookings: Booking[];
  onUpdateBookings: (updated: Booking[]) => void;
  triggerToast: (msg: string, type?: 'success' | 'info') => void;
}

export default function AdminPanel({
  bookings,
  onUpdateBookings,
  triggerToast,
}: AdminPanelProps) {
  const [filterType, setFilterType] = useState<'all' | 'spa' | 'hotel'>('all');
  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'confirmed' | 'cancelled'>('all');
  const [editingBookingId, setEditingBookingId] = useState<string | null>(null);
  const [internalNoteDraft, setInternalNoteDraft] = useState('');
  
  // Settings & Notification integration
  const [isNotifyEnabled, setIsNotifyEnabled] = useState(true);
  const [telegramToken, setTelegramToken] = useState(() => localStorage.getItem('lumi_owner_tg_token') || '');
  const [telegramChatId, setTelegramChatId] = useState(() => localStorage.getItem('lumi_owner_tg_chat') || '');
  const [ownerEmail, setOwnerEmail] = useState(() => localStorage.getItem('lumi_owner_email') || '');
  const [isSavingSettings, setIsSavingSettings] = useState(false);

  // New Booking Alert sound simulator
  const [soundEnabled, setSoundEnabled] = useState(true);
  const prevBookingsCountRef = React.useRef(bookings.length);

  useEffect(() => {
    // When a booking size increases (customer submitted a booking)
    if (bookings.length > prevBookingsCountRef.current) {
      if (soundEnabled) {
        // Trigger audio chime simulation
        try {
          const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
          // Chime 1
          const osc1 = audioCtx.createOscillator();
          const gainNode = audioCtx.createGain();
          osc1.connect(gainNode);
          gainNode.connect(audioCtx.destination);
          osc1.frequency.setValueAtTime(523.25, audioCtx.currentTime); // C5
          gainNode.gain.setValueAtTime(0.15, audioCtx.currentTime);
          gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.6);
          osc1.start();
          osc1.stop(audioCtx.currentTime + 0.6);
          
          // Chime 2 slightly offset
          setTimeout(() => {
            const osc2 = audioCtx.createOscillator();
            const gain2 = audioCtx.createGain();
            osc2.connect(gain2);
            gain2.connect(audioCtx.destination);
            osc2.frequency.setValueAtTime(659.25, audioCtx.currentTime); // E5
            gain2.gain.setValueAtTime(0.15, audioCtx.currentTime);
            gain2.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.8);
            osc2.start();
            osc2.stop(audioCtx.currentTime + 0.8);
          }, 150);
        } catch (e) {
          console.warn('Browser Audio restriction blocked chime sound before user interaction', e);
        }
      }
      triggerToast('🔔 Có Đợt Đặt Lịch Mới của Khách Hàng vừa gửi về hệ thống!', 'success');
      
      // Auto trigger simulated notify webhook if specified
      triggerSimulatedWebhooks(bookings[0]);
    }
    prevBookingsCountRef.current = bookings.length;
  }, [bookings.length]);

  const triggerSimulatedWebhooks = async (latestBooking: Booking) => {
    if (!latestBooking) return;
    
    // 1. If Telegram Integration is filled, attempt actual API push
    if (telegramToken && telegramChatId) {
      try {
        const textMessage = `🚨 *LUMI PET: CÓ LỊCH HẸN MỚI!*\n\n• *Khách hàng:* ${latestBooking.customerName}\n• *Số điện thoại:* ${latestBooking.customerPhone}\n• *Bé cưng:* ${latestBooking.petName} (${latestBooking.petType === 'dog' ? '🐶 Chó' : '🐱 Mèo'} - ${latestBooking.petWeight}kg)\n• *Dịch vụ:* ${latestBooking.serviceType}\n• *Chi phí:* ${latestBooking.totalPrice.toLocaleString('vi-VN')}đ\n\n_Vui lòng truy cập Portal Admin của Lumi Pet để quản lý trạng thái._`;
        const url = `https://api.telegram.org/bot${telegramToken}/sendMessage`;
        
        await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            chat_id: telegramChatId,
            parse_mode: 'Markdown',
            text: textMessage
          })
        });
        console.log('Successfully pushed real notification to Owner Telegram channel!');
      } catch (err) {
        console.error('Failed to dispatch webhook telegram payload', err);
      }
    }
  };

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingSettings(true);
    localStorage.setItem('lumi_owner_tg_token', telegramToken);
    localStorage.setItem('lumi_owner_tg_chat', telegramChatId);
    localStorage.setItem('lumi_owner_email', ownerEmail);
    
    setTimeout(() => {
      setIsSavingSettings(false);
      triggerToast('💾 Đã lưu cấu hình thông báo webhook thành công!', 'success');
    }, 800);
  };

  // Status changers
  const handleUpdateStatus = (id: string, nextStatus: 'confirmed' | 'cancelled' | 'pending') => {
    const updated = bookings.map(b => {
      if (b.id === id) {
        return { ...b, status: nextStatus };
      }
      return b;
    });
    onUpdateBookings(updated);
    triggerToast(`Đã chuyển lịch #${id} sang trạng thái: ${
      nextStatus === 'confirmed' ? 'Đã Xác Nhận' : nextStatus === 'cancelled' ? 'Đã Huỷ' : 'Đang Chờ'
    }`, 'info');
  };

  const handleSaveInternalNote = (id: string) => {
    const updated = bookings.map(b => {
      if (b.id === id) {
        return { ...b, notes: internalNoteDraft.trim() };
      }
      return b;
    });
    onUpdateBookings(updated);
    setEditingBookingId(null);
    triggerToast('Đã cập nhật ghi chú nội bộ cho bé thành công!', 'success');
  };

  // Metric computations
  const totalRevenue = bookings
    .filter(b => b.status === 'confirmed')
    .reduce((sum, b) => sum + b.totalPrice, 0);

  const spaCount = bookings.filter(b => b.bookingType === 'spa').length;
  const hotelCount = bookings.filter(b => b.bookingType === 'hotel').length;
  const pendingCount = bookings.filter(b => b.status === 'pending').length;

  // Filter list
  const filteredBookings = bookings.filter(b => {
    const matchType = filterType === 'all' || b.bookingType === filterType;
    const matchStatus = filterStatus === 'all' || b.status === filterStatus;
    return matchType && matchStatus;
  });

  return (
    <div className="space-y-8 animate-fade-in pb-16">
      
      {/* Admin Title Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-[32px] p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />
        
        <div className="space-y-1.5 z-10">
          <div className="flex items-center space-x-2.5">
            <span className="text-[10px] uppercase font-black tracking-widest text-amber-500 bg-amber-500/10 border border-amber-500/20 px-2.5 py-0.5 rounded-full">
              Hệ Thống Trực Tuyến 24/7
            </span>
            <div className="flex items-center text-emerald-400 text-[10px] font-bold space-x-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Cổng Server Đang Hoạt Động</span>
            </div>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white font-display">Bảng Điều Khiển Của Chủ Shop (CMS)</h1>
          <p className="text-slate-400 text-xs sm:text-sm">
            Nơi quản trị bảo mẫu chuyên nghiệp, tiếp nhận thông báo đặt lịch Spa và Cabin nghỉ dưỡng thời gian thực.
          </p>
        </div>

        {/* Chime & Sound Indicator Controls */}
        <div className="flex items-center space-x-3 z-10">
          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className={`flex items-center space-x-1.5 px-3.5 py-2.5 rounded-xl text-xs font-bold border transition-colors cursor-pointer ${
              soundEnabled 
                ? 'bg-amber-500/10 text-amber-400 border-amber-500/20 hover:bg-amber-500/20' 
                : 'bg-slate-800 text-slate-450 border-slate-700 hover:bg-slate-705'
            }`}
          >
            {soundEnabled ? (
              <>
                <Bell className="w-4 h-4" />
                <span>Âm đặt lịch: Bật</span>
              </>
            ) : (
              <>
                <BellOff className="w-4 h-4" />
                <span>Âm đặt lịch: Tắt</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* METRIC CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Rev */}
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl relative overflow-hidden">
          <div className="absolute top-4 right-4 bg-emerald-500/10 p-2 rounded-xl text-emerald-400 border border-emerald-500/20">
            <DollarSign className="w-5 h-5" />
          </div>
          <span className="text-[11px] font-bold text-slate-450 uppercase tracking-wider block">Ước tính doanh thu</span>
          <span className="text-xl sm:text-2xl font-black text-white font-display block mt-1.5">{totalRevenue.toLocaleString('vi-VN')}đ</span>
          <div className="flex items-center gap-1 text-[10px] text-slate-400 mt-2">
            <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
            <span>Chỉ tính các lịch đã xác nhận</span>
          </div>
        </div>

        {/* Pending */}
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl relative overflow-hidden">
          <div className="absolute top-4 right-4 bg-amber-500/10 p-2 rounded-xl text-amber-400 border border-amber-500/20">
            <Clock className="w-5 h-5" />
          </div>
          <span className="text-[11px] font-bold text-slate-455 uppercase tracking-wider block">Số ca chờ phê duyệt</span>
          <span className="text-xl sm:text-2xl font-black text-white font-display block mt-1.5">{pendingCount} lịch</span>
          <div className="flex items-center gap-1 text-[10px] text-emerald-400 mt-2">
            <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-ping" />
            <span>Cần duyệt ngay để thông báo khách</span>
          </div>
        </div>

        {/* Spa stats */}
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl relative overflow-hidden">
          <div className="absolute top-4 right-4 bg-orange-500/10 p-2 rounded-xl text-orange-400 border border-orange-500/20">
            <ClipboardList className="w-5 h-5" />
          </div>
          <span className="text-[11px] font-bold text-slate-455 uppercase tracking-wider block">Tổng ca Spa chăm sóc</span>
          <span className="text-xl sm:text-2xl font-black text-white font-display block mt-1.5">{spaCount} lượt đặt</span>
          <span className="text-[10px] text-slate-400 block mt-2">Grooming & tắm sấy thảo dược</span>
        </div>

        {/* Hotel stats */}
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl relative overflow-hidden">
          <div className="absolute top-4 right-4 bg-sky-500/10 p-2 rounded-xl text-sky-400 border border-sky-500/20">
            <Calendar className="w-5 h-5" />
          </div>
          <span className="text-[11px] font-bold text-slate-455 uppercase tracking-wider block">Tổng ca nghỉ mát Hotel</span>
          <span className="text-xl sm:text-2xl font-black text-white font-display block mt-1.5">{hotelCount} phòng</span>
          <span className="text-[10px] text-slate-400 block mt-2">Cabin kính vô khuẩn đón nắng</span>
        </div>
      </div>

      {/* THREE LAYOUTS: BOOKING LIST TABS & SIDEBAR CONFIGS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* LEFT & MID: MASTER BOOKINGS TABLES CONTAINER */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 sm:p-6 shadow-md">
            
            {/* Header filters */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-800">
              <h3 className="text-base font-black text-white flex items-center gap-2">
                <Layers className="w-5 h-5 text-amber-500" />
                <span>Danh Sách Đơn Đặt Lịch Đã Tiếp Nhận</span>
              </h3>

              {/* Filters */}
              <div className="flex flex-wrap items-center gap-2">
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value as any)}
                  className="bg-slate-950 border border-slate-700 rounded-xl px-3 py-1.5 text-[11px] font-bold text-slate-300 focus:outline-none focus:border-amber-550"
                >
                  <option value="all">Tất cả Phân Loại</option>
                  <option value="spa">💇 Dịch vụ Spa</option>
                  <option value="hotel">🏨 Cabin Hotel</option>
                </select>

                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value as any)}
                  className="bg-slate-950 border border-slate-700 rounded-xl px-3 py-1.5 text-[11px] font-bold text-slate-300 focus:outline-none focus:border-amber-550"
                >
                  <option value="all">Tất cả Trạng Thái</option>
                  <option value="pending">⏳ Chờ duyệt</option>
                  <option value="confirmed">✅ Đã xác nhận</option>
                  <option value="cancelled">❌ Đã huỷ bỏ</option>
                </select>
              </div>
            </div>

            {/* List Table */}
            <div className="overflow-x-auto mt-4">
              {filteredBookings.length === 0 ? (
                <div className="py-12 text-center text-slate-500 flex flex-col items-center border border-dashed border-slate-800 rounded-2xl">
                  <AlertTriangle className="w-8 h-8 text-slate-600 mb-2" />
                  <p className="text-xs font-bold text-slate-300">Không tìm thấy lịch hẹn phù hợp!</p>
                  <p className="text-[10px] text-slate-500 mt-0.5">Thử khởi tạo thêm lịch đặt mới ngoài trang chủ.</p>
                </div>
              ) : (
                <div className="divide-y divide-slate-800/60 max-h-[500px] overflow-y-auto pr-1">
                  {filteredBookings.map((b) => {
                    const isEditingNote = editingBookingId === b.id;
                    return (
                      <div key={b.id} className="py-5 flex flex-col sm:flex-row sm:items-start justify-between gap-4 text-xs">
                        
                        {/* Booking identity details */}
                        <div className="space-y-1.5 max-w-sm">
                          <div className="flex items-center space-x-2">
                            <span className="font-mono bg-slate-950 px-2 py-0.5 rounded text-amber-550 font-bold border border-slate-800 text-[10px]">
                              #{b.id}
                            </span>
                            <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold border ${
                              b.bookingType === 'spa' 
                                ? 'bg-orange-500/10 text-orange-400 border-orange-500/15' 
                                : 'bg-sky-500/10 text-sky-400 border-sky-500/15'
                            }`}>
                              {b.bookingType === 'spa' ? '💇 Spa' : '🏨 Hotel'}
                            </span>
                          </div>

                          <h4 className="text-white font-bold text-sm">{b.serviceType}</h4>

                          {/* Customer Info */}
                          <div className="text-slate-400 space-y-0.5 font-semibold text-[11px]">
                            <p>👤 Khách đặt: <strong className="text-slate-200">{b.customerName}</strong> (<span className="underline">{b.customerPhone}</span>)</p>
                            {b.customerEmail && <p>📧 Email: <span className="text-amber-500/90">{b.customerEmail}</span></p>}
                            <p>🐾 Bé cưng: <strong className="text-slate-200">{b.petName}</strong> ({b.petType === 'dog' ? 'Cún' : 'Mèo'} - {b.petWeight}kg)</p>
                            
                            {/* Time details */}
                            {b.bookingType === 'spa' ? (
                              <p className="text-orange-450 font-bold">⏰ Sắp xếp hẹn: {b.date} ({b.timeSlot})</p>
                            ) : (
                              <p className="text-sky-450 font-bold">🏨 Lưu trú: {b.checkInDate} đến {b.checkOutDate}</p>
                            )}
                          </div>

                          {/* NOTES DISPLAY OR INLINE NOTES EDTER */}
                          <div className="mt-2.5 bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                            {isEditingNote ? (
                              <div className="space-y-1.5">
                                <span className="block text-[10px] text-slate-400 font-bold uppercase">Nhập Ghi chú bảo mẫu (sợ nước, chế độ ăn...)</span>
                                <textarea
                                  value={internalNoteDraft}
                                  onChange={(e) => setInternalNoteDraft(e.target.value)}
                                  className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-white font-semibold focus:outline-none text-[11px]"
                                  rows={2}
                                />
                                <div className="flex justify-end gap-1.5">
                                  <button
                                    onClick={() => setEditingBookingId(null)}
                                    className="bg-slate-800 text-slate-400 font-bold px-2 py-1 rounded text-[10px] cursor-pointer"
                                  >
                                    Huỷ
                                  </button>
                                  <button
                                    onClick={() => handleSaveInternalNote(b.id)}
                                    className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-2.5 py-1 rounded text-[10px] flex items-center space-x-1 cursor-pointer"
                                  >
                                    <Save className="w-3 h-3" />
                                    <span>Lưu</span>
                                  </button>
                                </div>
                              </div>
                            ) : (
                              <div className="flex items-start justify-between gap-2">
                                <div className="text-[11px] text-slate-400">
                                  <span className="font-bold text-amber-500">📝 Chỉ dẫn bảo vụ: </span>
                                  {b.notes ? b.notes : 'Chưa có ghi chú dinh dưỡng hay thói quen cụ thể.'}
                                </div>
                                <button
                                  onClick={() => {
                                    setEditingBookingId(b.id);
                                    setInternalNoteDraft(b.notes || '');
                                  }}
                                  className="text-[10px] font-bold text-amber-500 hover:underline cursor-pointer flex-shrink-0"
                                >
                                  Sửa
                                </button>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Booking Status controls and prices */}
                        <div className="flex flex-col items-end justify-between sm:text-right gap-3 flex-shrink-0">
                          <div>
                            <span className="block text-[10px] text-slate-500 uppercase font-black">Giá trị thanh toán</span>
                            <span className="text-base font-black text-white font-display block mt-1">{formatVND(b.totalPrice)}</span>
                            <span className="text-[9.5px] text-slate-400 italic font-semibold">Thu ngân tại quầy trực tiếp</span>
                          </div>

                          {/* Status buttons */}
                          <div className="flex items-center gap-1.5 self-start sm:self-auto">
                            {b.status === 'pending' && (
                              <>
                                <button
                                  onClick={() => handleUpdateStatus(b.id, 'confirmed')}
                                  className="bg-emerald-600 hover:bg-emerald-700 text-white text-[10px] py-1.5 px-3 rounded-lg font-black cursor-pointer transition-colors flex items-center space-x-1 shadow-sm"
                                >
                                  <CheckCircle className="w-3.5 h-3.5" />
                                  <span>Duyệt Nhận Bé</span>
                                </button>
                                <button
                                  onClick={() => handleUpdateStatus(b.id, 'cancelled')}
                                  className="bg-rose-900/40 text-rose-450 border border-rose-900/30 text-[10px] py-1.5 px-2.5 rounded-lg font-bold cursor-pointer transition-colors"
                                >
                                  Từ chối
                                </button>
                              </>
                            )}
                            
                            {b.status === 'confirmed' && (
                              <div className="flex items-center space-x-2">
                                <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-550/20 text-[10px] py-1 px-3.5 rounded-full font-extrabold flex items-center gap-1">
                                  <CheckCircle className="w-3.5 h-3.5" />
                                  <span>Buổi hẹn hợp lệ</span>
                                </span>
                                <button
                                  onClick={() => handleUpdateStatus(b.id, 'cancelled')}
                                  className="text-slate-500 hover:text-red-500 font-bold hover:underline cursor-pointer"
                                >
                                  Huỷ
                                </button>
                              </div>
                            )}

                            {b.status === 'cancelled' && (
                              <div className="flex items-center space-x-2">
                                <span className="bg-rose-500/10 text-rose-400 border border-rose-550/20 text-[10px] py-1 px-3 rounded-full font-bold flex items-center gap-1">
                                  <Ban className="w-3.5 h-3.5" />
                                  <span>Đã Huỷ bỏ / Đầy phòng</span>
                                </span>
                                <button
                                  onClick={() => handleUpdateStatus(b.id, 'pending')}
                                  className="text-slate-500 hover:text-amber-500 font-bold hover:underline cursor-pointer flex items-center gap-1"
                                >
                                  <RotateCcw className="w-3 h-3" />
                                  <span>Duyệt lại</span>
                                </button>
                              </div>
                            )}
                          </div>
                        </div>

                      </div>
                    );
                  })}
                </div>
              )}
            </div>

          </div>
        </div>

        {/* RIGHT LAYER: WEBHOOK INTEGRATIONS & NOTIFICATION CONTROLLER */}
        <div className="space-y-4">
          <form onSubmit={handleSaveSettings} className="bg-slate-900 border border-slate-800 rounded-3xl p-5 sm:p-6 shadow-md space-y-4 flex flex-col justify-between">
            <div>
              <div className="flex items-center space-x-2 pb-3.5 border-b border-slate-800">
                <Settings className="w-5 h-5 text-amber-500" />
                <h3 className="text-sm font-black text-white">Kết Nối Đẩy Kênh Thông Báo</h3>
              </div>

              <div className="mt-4 p-3 bg-amber-500/5 rounded-2xl border border-amber-500/10 text-[11px] text-amber-400/90 leading-relaxed font-semibold">
                💡 <span className="font-bold underline text-amber-300">Tính năng thật 100%:</span> Khi khách hàng nhập form đặt lịch, hệ thống sẽ sử dụng Webhook API được khai báo dưới đây để gửi tin nhắn thông báo đẩy tức thời tới kênh quản trị của bạn!
              </div>

              {/* Telegram config bot */}
              <div className="space-y-4 mt-5">
                <div>
                  <label className="block text-[10px] text-slate-400 font-black uppercase tracking-wider mb-2 flex items-center justify-between">
                    <span>1. API Push Telegram (Bot Token)</span>
                    <a href="https://t.me/BotFather" target="_blank" rel="noreferrer" className="text-amber-500 hover:underline">Tạo Bot mới ↗</a>
                  </label>
                  <input
                    type="password"
                    placeholder="E.g. 748924729:AAHd8H2_92jds..."
                    value={telegramToken}
                    onChange={(e) => setTelegramToken(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-[11px] font-semibold text-white focus:outline-none focus:border-amber-500 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-[10px] text-slate-400 font-black uppercase tracking-wider mb-2">2. Telegram Chat ID (Cá nhân hoặc Kênh)</label>
                  <input
                    type="text"
                    placeholder="E.g. -1001472847291 hoặc 57482910"
                    value={telegramChatId}
                    onChange={(e) => setTelegramChatId(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-[11px] font-semibold text-white focus:outline-none focus:border-amber-500 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-[10px] text-slate-400 font-black uppercase tracking-wider mb-2">3. Hòm Thư Email Quản Trị Nhận Phiếu</label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <input
                      type="email"
                      placeholder="admin@lumipet.com"
                      value={ownerEmail}
                      onChange={(e) => setOwnerEmail(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-10 pr-3 p-3 text-[11px] font-semibold text-white focus:outline-none focus:border-amber-500"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-800">
              <button
                type="submit"
                disabled={isSavingSettings}
                className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-605 text-white font-black py-3 px-4 rounded-xl text-xs flex items-center justify-center space-x-1.5 transition-colors cursor-pointer shadow-sm"
              >
                {isSavingSettings ? (
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <ShieldCheck className="w-4 h-4" />
                    <span>Lưu Cài Đặt Kết Nối Thật</span>
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Quick Guidance Info card */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 space-y-3.5">
            <h4 className="text-xs font-black text-rose-400 uppercase tracking-widest flex items-center gap-1.5">
              <ShieldAlert className="w-4 h-4" />
              <span>Tiêu chuẩn xử lý hồ sơ thú cưng</span>
            </h4>
            <div className="text-[11px] text-slate-400 leading-relaxed space-y-2 font-semibold">
              <p>📍 Các bé đăng ký gói Spa hoặc Hotel luôn cần kiểm tra lâm sàng trước khi bàn giao vô buồng kính tại quầy.</p>
              <p>📍 Nếu phát hiện bé bị ve sương, bọ chét hoặc các bệnh về da truyền nhiễm, bảo mẫu cần ghi chú nội bộ và từ chối nhận bé hoặc đề xuất điều trị da liễu trước tại phân khu VIP cách ly.</p>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
