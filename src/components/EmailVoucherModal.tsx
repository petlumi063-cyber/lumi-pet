/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, Mail, Send, CheckCircle2, ShieldCheck, 
  Printer, ArrowRight, CornerDownRight, Landmark
} from 'lucide-react';
import { Booking } from '../types';
import { formatVND } from './ShopSection';

interface EmailVoucherModalProps {
  booking: Booking | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdateEmail?: (email: string) => void;
}

export default function EmailVoucherModal({
  booking,
  isOpen,
  onClose,
  onUpdateEmail,
}: EmailVoucherModalProps) {
  const [emailInput, setEmailInput] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [sendSuccess, setSendSuccess] = useState(false);

  // Weight Coefficient Multiplier
  const getWeightMultiplier = (weight: number) => {
    if (weight < 5) return 1.0;
    if (weight >= 5 && weight < 10) return 1.2;
    if (weight >= 10 && weight < 25) return 1.5;
    return 1.8;
  };

  // Initialize input draft when modal opens with booking
  React.useEffect(() => {
    if (booking) {
      setEmailInput(booking.customerEmail || '');
      setSendSuccess(false);
    }
  }, [booking, isOpen]);

  if (!isOpen || !booking) return null;

  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailInput.trim() || !emailInput.includes('@')) {
      alert('Vui lòng nhập địa chỉ Email hợp lệ!');
      return;
    }
    if (onUpdateEmail) {
      onUpdateEmail(emailInput.trim());
    }
    simulateSending(emailInput.trim());
  };

  const simulateSending = (targetEmail: string) => {
    setIsSending(true);
    setSendSuccess(false);
    
    // Build simulated latency for professional service feedback
    setTimeout(() => {
      setIsSending(false);
      setSendSuccess(true);
    }, 1800);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 md:p-10">
        {/* Backdrop glass blur */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-slate-900/60 backdrop-blur-md"
        />

        {/* Modal Card wrapper */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative bg-slate-900 border border-slate-700 w-full max-w-4xl h-[85vh] rounded-3xl overflow-hidden shadow-2xl flex flex-col"
        >
          {/* Mock Browser/Webmail Top Header Nav */}
          <div className="bg-slate-950 px-5 py-3.5 border-b border-slate-800 flex items-center justify-between flex-shrink-0">
            <div className="flex items-center space-x-2">
              {/* Fake OS windows buttons */}
              <div className="flex space-x-1.5 mr-4">
                <span className="w-3 h-3 rounded-full bg-rose-500 block opacity-80" onClick={onClose} />
                <span className="w-3 h-3 rounded-full bg-amber-500 block opacity-80" />
                <span className="w-3 h-3 rounded-full bg-emerald-500 block opacity-80" />
              </div>
              
              {/* Tab Label */}
              <span className="text-[11px] font-bold text-slate-400 bg-slate-900/80 px-3 py-1.5 rounded-lg border border-slate-800 flex items-center space-x-1.5">
                <Mail className="w-3.5 h-3.5 text-orange-400" />
                <span>Lumi Mailer: Inbox (1)</span>
              </span>
            </div>

            <button 
              onClick={onClose}
              className="text-slate-400 hover:text-white transition-colors p-1.5 bg-slate-900 rounded-lg border border-slate-800 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Email control center (Email input updating + sending feedback) */}
          <div className="bg-slate-955 px-6 py-4 border-b border-slate-800/80 flex flex-col md:flex-row md:items-center justify-between gap-4 flex-shrink-0">
            <div className="flex-1">
              <span className="block text-[10px] text-orange-400 font-extrabold uppercase tracking-widest">Thiết lập thông báo</span>
              <h3 className="text-sm font-bold text-white mt-0.5">Đặt lịch gửi về đâu?</h3>
              <p className="text-[11px] text-slate-405 leading-relaxed mt-1">
                Lịch hẹn luôn được <span className="text-emerald-400 font-bold">Lưu tự động</span> trên máy chủ Lumi Pet. Để nhận thêm bản in biên lai & hướng dẫn chuẩn bị, quý khách vui lòng điền địa chỉ email của mình bên dưới.
              </p>
            </div>

            <form onSubmit={handleUpdate} className="flex-shrink-0 flex items-stretch gap-2">
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input 
                  type="email"
                  placeholder="Nhập Email để hệ thống gửi tự động..."
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                  className="bg-slate-900 border border-slate-700 text-xs text-white rounded-xl pl-9 pr-4 py-2.5 w-64 md:w-72 focus:outline-none focus:border-orange-500 font-semibold"
                />
              </div>
              <button
                type="submit"
                disabled={isSending}
                className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 font-black text-xs text-white px-4 rounded-xl flex items-center space-x-1.5 cursor-pointer transition-all shadow-sm"
              >
                {isSending ? (
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <Send className="w-3.5 h-3.5" />
                    <span>{booking.customerEmail ? 'Gửi lại' : 'Kích Hoạt'}</span>
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Status Overlay when sending/sent successfully */}
          <div className="flex-1 overflow-y-auto bg-slate-950 p-6 flex flex-col items-center justify-start relative">
            <AnimatePresence>
              {isSending && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 z-50 bg-slate-950/95 backdrop-blur-xs flex flex-col items-center justify-center text-center px-4"
                >
                  <div className="w-16 h-16 rounded-full bg-orange-500/10 border border-orange-500/30 flex items-center justify-center mb-4 relative">
                    <span className="absolute inset-0 rounded-full bg-orange-500/20 animate-ping" />
                    <Mail className="w-6 h-6 text-orange-400" />
                  </div>
                  <h4 className="text-sm font-bold text-white uppercase tracking-wider">Đang khởi tạo máy chủ chuyển thư...</h4>
                  <p className="text-xs text-slate-400 mt-1 max-w-sm">Đang kết nối cổng SMTP của Lumi Pet để tạo mẫu HTML hóa đơn điện tử cho bé {booking.petName}...</p>
                </motion.div>
              )}

              {sendSuccess && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 z-50 bg-slate-950/95 backdrop-blur-xs flex flex-col items-center justify-center text-center px-6"
                >
                  <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center mb-4 relative">
                    <CheckCircle2 className="w-8 h-8 text-emerald-400" />
                  </div>
                  <h4 className="text-base font-black text-white">ĐÃ GỬI THƯ THÀNH CÔNG!</h4>
                  <p className="text-xs text-slate-350 mt-1.5 max-w-md leading-relaxed">
                    Hệ thống thư điện tử tự động của Lumi Pet đã gửi thông báo xác nhận lịch hẹn chính thức kèm file đính kèm tới địa chỉ <span className="text-orange-400 font-bold underline">{booking.customerEmail}</span> thành công!
                  </p>
                  <div className="mt-4 p-3.5 bg-slate-900 border border-slate-800 rounded-xl text-[11px] text-slate-400 max-w-sm italic">
                    💡 Ba mẹ vui lòng kiểm tra hộp thư đến (Inbox) hoặc kiểm tra cả mục Thư rác/Quảng cáo (Spam/Promotions) phòng trường hợp bộ lọc phân loại nhầm.
                  </div>
                  <button
                    onClick={() => setSendSuccess(false)}
                    className="mt-6 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-xl px-5 py-2 text-xs font-bold cursor-pointer"
                  >
                    Quay lại xem trước mẫu thư
                  </button>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Email Canvas inside Web Client */}
            <div className="w-full max-w-2xl bg-white rounded-3xl shadow-xl overflow-hidden text-slate-800 font-sans border border-slate-200 flex-shrink-0 mb-6">
              
              {/* Fake Email Envelope details header */}
              <div className="bg-slate-50 border-b border-slate-100 p-5 text-xs text-slate-500">
                <div className="flex justify-between items-center mb-1">
                  <div>
                    <span className="font-bold text-slate-700">Người gửi: </span>
                    <span className="text-slate-900">Lumi Pet Spa & Hotel</span> <span className="font-mono text-[10px]">&lt;booking@lumipet.com&gt;</span>
                  </div>
                  <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded font-black">XÁC THỰC SPF / DKIM</span>
                </div>
                <div className="mb-2">
                  <span className="font-bold text-slate-700">Người nhận: </span>
                  {booking.customerEmail ? (
                    <span className="text-slate-900 font-semibold underline">{booking.customerEmail}</span>
                  ) : (
                    <span className="text-red-500 font-bold bg-red-50 px-2 py-0.5 rounded border border-red-100 italic">
                      [Chưa cấu hình nhận email - hãy điền email phía trên 👆]
                    </span>
                  )}
                </div>
                <div className="border-t border-slate-100 pt-2 flex justify-between items-center">
                  <div>
                    <span className="font-bold text-slate-700">Tiêu đề: </span>
                    <span className="text-slate-800 font-bold">[LUMI PET] Thư Xác Nhận Đặt Lịch Hẹn Đã Duyệt Tự Động - Mã #{booking.id}</span>
                  </div>
                  <span className="text-[10px] text-slate-400">Vừa xong</span>
                </div>
              </div>

              {/* HTML EMAIL RENDER AREA */}
              <div className="p-8 max-w-full overflow-x-auto select-text">
                <div className="border-[8px] border-[#f6eae2] p-1.5 rounded-2xl">
                  <div className="bg-white border border-[#ebd8ce] p-6 sm:p-8 space-y-6">
                    
                    {/* Brand Banner */}
                    <div className="text-center pb-6 border-b border-[#ebd8ce]/50">
                      <div className="inline-flex items-center space-x-2 text-[#a25230] font-black text-2xl tracking-tight mb-2">
                        <span>🐾</span>
                        <span className="font-display">LUMI PET</span>
                      </div>
                      <span className="block text-[10px] text-slate-400 font-bold tracking-widest uppercase">PET SPA & LUXURY GLASS CABIN HOTEL</span>
                      <p className="text-[11px] text-[#a25230] font-semibold bg-[#FAF4F0] px-3 py-1.5 rounded-lg inline-block mt-3 border border-[#f5ded3]">
                        💌 CẢM ƠN BA MẸ ĐÃ TIN DÙNG DỊCH VỤ CỦA LUMI PET
                      </p>
                    </div>

                    {/* Intro paragraph */}
                    <div className="space-y-2.5">
                      <h4 className="text-[#a25230] text-sm font-black uppercase tracking-wide">THƯ KHÁNH THÀNH & XÁC NHẬN CHỖ TRỐNG</h4>
                      <p className="text-xs text-slate-600 leading-relaxed font-semibold">
                        Chào ba mẹ <span className="text-slate-900 font-black">{booking.customerName}</span>,
                      </p>
                      <p className="text-xs text-slate-600 leading-relaxed">
                        Hệ thống điều khoản chăm sóc tự động của Lumi Pet trân trọng thông báo: Lịch chuẩn bị kiểm tra y tế & tiếp đón bé cưng <span className="font-bold text-slate-900">{booking.petName}</span> của ba mẹ đã được duyệt, phòng ốc và nhân sự bảo mẫu đã được phân công đầy đủ!
                      </p>
                    </div>

                    {/* Receipt Ticket Panel */}
                    <div className="bg-[#FAF4F0] border border-[#f4dbcf] rounded-2xl p-5 relative">
                      {/* Inner Notch accents for voucher look */}
                      <div className="absolute -left-2.5 top-1/2 -translate-y-1/2 w-5 h-5 bg-white border border-[#f4dbcf] rounded-full" />
                      <div className="absolute -right-2.5 top-1/2 -translate-y-1/2 w-5 h-5 bg-white border border-[#f4dbcf] rounded-full" />

                      <div className="border-b border-dashed border-[#ecd5c9] pb-3 mb-3.5 flex items-center justify-between flex-wrap gap-2 text-xs">
                        <div>
                          <span className="block text-[9px] text-[#a25230] font-bold uppercase">Mã đăng ký hẹn</span>
                          <span className="font-mono text-base font-black text-slate-900">{booking.id}</span>
                        </div>
                        <div className="text-right">
                          <span className="block text-[9px] text-slate-400 font-bold uppercase">Trạng thái</span>
                          <span className="bg-emerald-100 text-emerald-800 text-[10px] font-black px-2 py-0.5 rounded-md border border-emerald-200 block mt-0.5">🐾 Đã phê duyệt tự động</span>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-y-4 gap-x-2 text-xs text-slate-605 border-b border-dashed border-[#ecd5c9] pb-4 mb-4">
                        <div>
                          <span className="block text-[9px] text-slate-400 font-bold uppercase">Số điện thoại liên lạc</span>
                          <span className="font-bold text-slate-800 block mt-0.5">{booking.customerPhone}</span>
                        </div>
                        <div>
                          <span className="block text-[9px] text-slate-400 font-bold uppercase">Bé cưng</span>
                          <span className="font-bold text-slate-800 block mt-0.5">
                            {booking.petName} ({booking.petType === 'dog' ? '🐶 Cún' : '🐱 Mèo'} - {booking.petWeight}kg)
                          </span>
                        </div>
                        <div className="col-span-2">
                          <span className="block text-[9px] text-slate-400 font-bold uppercase">Thời gian thực tế ghi nhận</span>
                          <span className="font-bold text-[#a25230] block mt-0.5 text-xs">
                            {booking.bookingType === 'spa' ? (
                              <span>📅 Sắp xếp hẹn: <strong className="text-slate-900">{booking.date}</strong> vào khung giờ <strong className="text-slate-900">{booking.timeSlot}</strong></span>
                            ) : (
                              <span>🏨 Lưu trú Hotel: Từ <strong className="text-slate-900">{booking.checkInDate}</strong> đến ngày <strong className="text-slate-900">{booking.checkOutDate}</strong></span>
                            )}
                          </span>
                        </div>
                      </div>

                      <div>
                        <span className="block text-[9px] text-slate-400 font-bold uppercase">Phân loại Dịch vụ đăng ký</span>
                        <span className="font-bold text-slate-900 text-xs block mt-0.5">
                          {booking.bookingType === 'spa' ? '💇 ' : '🏨 '} {booking.serviceType}
                        </span>
                      </div>

                      {booking.notes && (
                        <div className="mt-3 bg-white/70 p-2.5 rounded-xl border border-[#ede1db] text-[10px] text-slate-600">
                          <span className="font-bold text-[#a25230]">📝 Lưu ý bảo mẫu đặc biệt:</span> {booking.notes}
                        </div>
                      )}
                    </div>

                    {/* Final sum block */}
                    <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 flex items-center justify-between text-xs">
                      <div className="space-y-0.5">
                        <span className="font-bold text-slate-800 block">Ước tính giá trị dịch vụ:</span>
                        <span className="text-[10px] text-slate-400 block font-semibold italic">Phụ thu thể trọng lý thuyết ({getWeightMultiplier(booking.petWeight)}x) đã áp dụng.</span>
                      </div>
                      <span className="text-base font-black text-slate-900 font-display bg-white px-3 py-1.5 rounded-xl border border-slate-100">
                        {formatVND(booking.totalPrice)}
                      </span>
                    </div>

                    {/* Pre-arrival critical guidelines */}
                    <div className="border border-amber-200/50 bg-[#FFFDF9] rounded-2xl p-5 space-y-3">
                      <h5 className="text-[11px] font-black uppercase text-amber-800 tracking-wider flex items-center gap-1.5">
                        ⚠️ TIÊU CHUẨN ĐỒNG HÀNH AN TOÀN KHI GIAO NHẬN BÉ
                      </h5>
                      <p className="text-[11px] text-slate-500 leading-relaxed font-semibold">
                        Để không gian sinh hoạt chung của Lumi Pet luôn đạt trạng thái tiệt trùng, ngăn ngừa lây nhiễm mạt ve hay các loại bệnh hô hấp nguy hiểm, Lumi xin phép ba mẹ:
                      </p>
                      <ul className="text-[10px] text-slate-600 space-y-2 font-semibold">
                        <li className="flex items-start gap-1.5">
                          <span className="text-amber-600 mt-0.5">✔</span>
                          <span>Bé đã tiêm phòng vắc-xin tối thiểu 2 mũi (mèo) hoặc 3 mũi (chó), có sổ tiêm đối chiếu.</span>
                        </li>
                        <li className="flex items-start gap-1.5">
                          <span className="text-amber-600 mt-0.5">✔</span>
                          <span>Bé không trong chu kỳ bị kích động, hắt hơi liên tục, ghẻ nang lông hoặc ve rận bám sống.</span>
                        </li>
                        <li className="flex items-start gap-1.5">
                          <span className="text-amber-600 mt-0.5">✔</span>
                          <span>Lưu ý mang theo thức ăn đặc biệt hoặc ti giả nếu bé có thói quen ăn kiêng riêng.</span>
                        </li>
                      </ul>
                    </div>

                    {/* Direct Contact footer */}
                    <div className="text-center pt-4 border-t border-[#ebd8ce]/30 text-[10px] text-slate-400 space-y-1 font-semibold">
                      <p className="text-[#a25230] text-[11px] font-black">LUMI PET - TRAO NIỀM TIN, GỬI BA MẸ AN TÂM 🐾</p>
                      <p>📍 Địa chỉ: 247A Nguyễn Văn Tăng, Long Thạnh Mỹ, Quận 9, TP. Hồ Chí Minh</p>
                      <p>📞 Hotline Hotline 24/7 phản hồi tức thì: <strong className="text-slate-700">0989 979 675</strong></p>
                      <p className="text-[9px] text-slate-350 italic mt-3">Đây là thư tín điện tử xuất bản tự động từ hòm mail của Lumi Pet Service System. Vui lòng không trả lời trực tiếp thư này.</p>
                    </div>

                  </div>
                </div>
              </div>

            </div>

            {/* Simulated Desktop Actions and guidelines */}
            <div className="w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-2xl p-4 flex justify-between items-center text-xs text-slate-400 mb-4 flex-shrink-0">
              <span className="flex items-center space-x-1.5 font-semibold">
                <ShieldCheck className="w-4 h-4 text-emerald-500" />
                <span>Thư gửi được mã hóa chuẩn hóa kết nối SSL 256-bit bảo mật thông tin liên lạc.</span>
              </span>
              <button 
                type="button" 
                onClick={() => window.print()}
                className="text-slate-300 hover:text-white transition-colors flex items-center space-x-1 font-bold"
              >
                <Printer className="w-4 h-4" />
                <span>In hóa đơn PDF</span>
              </button>
            </div>

          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
