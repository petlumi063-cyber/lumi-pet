/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Phone, Mail, MapPin, Clock, 
  Send, ShieldCheck, Heart, ArrowUp
} from 'lucide-react';
import LumiPetLogo from './LumiPetLogo';

interface FooterProps {
  setActiveTab: (tabId: string) => void;
}

export default function Footer({ setActiveTab }: FooterProps) {
  const [emailSub, setEmailSub] = useState('');
  const [subSuccess, setSubSuccess] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (emailSub) {
      setSubSuccess(true);
      setEmailSub('');
      setTimeout(() => setSubSuccess(false), 3000);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navigationLinks = [
    { label: 'Cửa hàng Pet Shop', id: 'shop' },
    { label: 'Dịch vụ Spa Thú Cưng', id: 'spa' },
    { label: 'Khách sạn Hotel Thú Cưng', id: 'hotel' },
    { label: 'Hỏi đáp & FAQ', id: 'faq' },
  ];

  return (
    <footer className="bg-slate-900 text-slate-300 pt-16 pb-8 border-t-4 border-amber-550 relative overflow-hidden">
      {/* Visual Accent Ornaments */}
      <div className="absolute top-0 right-10 w-64 h-64 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 pb-12 border-b border-slate-800">
          
          {/* Column 1: Brand & Intro */}
          <div className="lg:col-span-4 flex flex-col space-y-4">
            <div className="flex items-center cursor-pointer" onClick={() => setActiveTab('home')}>
              <LumiPetLogo size="md" color="#f59e0b" />
            </div>
            
            <p className="text-slate-400 text-sm leading-relaxed font-sans pr-2">
              Chào mừng bạn đến với chuyên trang dịch vụ chuẩn quốc tế của Lumi Pet. Nơi gửi gắm boss yêu lý tưởng nhất với dịch vụ Spa tắm cắt tỉa, Khách Sạn Hotel 24/7 sang trọng và Pet Shop cung cấp thực phẩm phụ kiện chính hãng tốt nhất.
            </p>

            <div className="space-y-2 text-xs pt-2">
              <div className="flex items-start space-x-2">
                <Clock className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" />
                <span className="leading-snug text-slate-400">
                  Thời gian mở cửa: <strong className="text-white">Spa & Shop: 08:00 - 21:00</strong> | <strong className="text-white">Hotel: Hoạt động 24/7</strong> hằng ngày (Kể cả lễ Tết)
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <ShieldCheck className="w-4 h-4 text-amber-500 flex-shrink-0" />
                <span className="text-slate-400">Đội ngũ bảo mẫu tận tâm chăm sóc và dọn dẹp vệ sinh liên tục mỗi ngày.</span>
              </div>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div className="lg:col-span-2.5 flex flex-col space-y-3">
            <h3 className="text-sm font-black text-white uppercase tracking-widest border-l-2 border-amber-500 pl-2">
              Dịch Vụ Nổi Bật
            </h3>
            <ul className="space-y-2.5 text-sm font-semibold">
              {navigationLinks.map((link, index) => (
                <li key={index}>
                  <button
                    onClick={() => {
                      setActiveTab(link.id);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="text-slate-400 hover:text-amber-500 transition-colors block text-left cursor-pointer"
                  >
                    ✦ {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Branch Locations contacts */}
          <div className="lg:col-span-3 flex flex-col space-y-3">
            <h3 className="text-sm font-black text-white uppercase tracking-widest border-l-2 border-amber-500 pl-2">
              Liên Hệ Hệ Thống
            </h3>
            <ul className="space-y-3 text-xs leading-relaxed text-slate-400">
              <li className="flex items-start space-x-2">
                <MapPin className="w-4.5 h-4.5 text-amber-500 mt-0.5 flex-shrink-0" />
                <span>
                  <strong className="text-white">Trụ sở Bình Thạnh:</strong> 27 Võ Trường Toản, Phường 2, Bình Thạnh, TP. Hồ Chí Minh <br />
                  <a href="tel:0989979675" className="text-amber-500 hover:underline font-bold">SĐT Hotline: 0989 979 675</a>
                </span>
              </li>
              <li className="flex items-center space-x-2">
                <Mail className="w-4.5 h-4.5 text-amber-500 flex-shrink-0" />
                <span className="text-slate-400">contact@lumipet.vn</span>
              </li>
            </ul>
          </div>

          {/* Column 4: Newsletter */}
          <div className="lg:col-span-2.5 flex flex-col space-y-3">
            <h3 className="text-sm font-black text-white uppercase tracking-widest border-l-2 border-amber-500 pl-2">
              Nhận Ưu Đãi
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed font-sans">
              Đăng ký email để nhận voucher giảm ngay <strong className="text-amber-550">10%</strong> cho lần đặt lịch spa tiếp theo.
            </p>

            <form onSubmit={handleSubscribe} className="flex flex-col space-y-2 pt-1.5">
              <div className="relative">
                <input
                  type="email"
                  required
                  placeholder="Nhập email của bạn..."
                  value={emailSub}
                  onChange={(e) => setEmailSub(e.target.value)}
                  className="w-full bg-slate-800 text-xs text-white rounded-xl py-2.5 pl-3 pr-10 border border-slate-700 focus:outline-none focus:border-amber-500 shadow-inner"
                />
                <button
                  type="submit"
                  id="newsletter-sub-btn"
                  className="absolute right-1 top-1 h-8 w-8 bg-amber-500 hover:bg-amber-600 text-white rounded-lg flex items-center justify-center transition-colors shadow-xs cursor-pointer"
                  aria-label="Subscribe"
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </div>

              {subSuccess && (
                <span className="text-[10px] text-emerald-400 font-bold animate-pulse">
                  ✓ Đăng ký thành công! Hãy check hộp thư nhé.
                </span>
              )}
            </form>
          </div>

        </div>

        {/* Lower row */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© 2026 Lumi Pet. All rights reserved.</p>
          
          <div className="flex items-center space-x-4">
            <span className="flex items-center space-x-1">
              <span>Được xây dựng với</span>
              <Heart className="w-3.5 h-3.5 text-red-550 fill-red-500" />
              <span>Dành cho Boss yêu</span>
            </span>

            {/* Back to top bullet */}
            <button
               onClick={scrollToTop}
               className="p-2 bg-slate-820 hover:bg-amber-500 text-slate-400 hover:text-white rounded-xl border border-slate-800 hover:border-amber-400 transition-all flex items-center justify-center cursor-pointer"
               title="Lên đầu trang"
            >
              <ArrowUp className="w-4.5 h-4.5" />
            </button>
          </div>
        </div>

      </div>
    </footer>
  );
}
