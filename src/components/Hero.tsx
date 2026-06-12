/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion } from 'motion/react';
import { ShieldCheck, Award, HeartPulse, Sparkles, Star } from 'lucide-react';
import LumiPetLogo from './LumiPetLogo';

interface HeroProps {
  onNavigate: (sectionId: string) => void;
}

export default function Hero({ onNavigate }: HeroProps) {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-orange-50/70 via-bg-beige to-bg-beige pt-10 pb-16 md:py-24">
      {/* Dynamic Background Blurry Blobs from Vibrant Palette Theme */}
      <div className="bg-blob w-[350px] h-[350px] bg-orange-200 top-[-100px] right-[-100px] opacity-40 pointer-events-none" />
      <div className="bg-blob w-[300px] h-[300px] bg-teal-100 bottom-[-50px] left-[-50px] opacity-60 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Text Content Block */}
          <div className="lg:col-span-7 flex flex-col space-y-6 text-center lg:text-left">
            <motion.div 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center space-x-2 bg-orange-100 text-orange-600 rounded-full py-1.5 px-4 w-fit mx-auto lg:mx-0 shadow-xs"
            >
              <Sparkles className="w-4 h-4 text-orange-500 fill-orange-500 animate-pulse" />
              <span className="text-xs font-bold uppercase tracking-wider">Chào mừng bạn đến với Lumi Pet</span>
            </motion.div>

            <motion.h1 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-4xl sm:text-5xl lg:text-6.5xl font-extrabold tracking-tight text-gray-900 leading-tight font-display"
            >
              Dành Trọn Yêu Thương Cho <br />
              <span className="text-orange-500">
                Thú Cưng
              </span> Của Bạn
            </motion.h1>

            <motion.p 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-gray-600 text-base sm:text-lg max-w-xl mx-auto lg:mx-0 leading-relaxed font-sans"
            >
              Dịch vụ chăm sóc chuyên nghiệp, spa bốc lửa làm đẹp tạo hình và khách sạn kính cao cấp trang bị camera 24/7 đón chờ riêng cho những bạn bốn chân.
            </motion.p>

            {/* Quick CTAs */}
            <motion.div 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2"
            >
              <button
                id="hero-book-spa-btn"
                onClick={() => onNavigate('booking')}
                className="w-full sm:w-auto bg-orange-500 hover:bg-orange-600 text-white font-bold px-8 py-4 rounded-2xl shadow-xl shadow-orange-200 hover:scale-102 transition-all cursor-pointer text-base"
              >
                Đặt Lịch Ngay
              </button>
              
              <button
                id="hero-explore-shop-btn"
                onClick={() => onNavigate('shop')}
                className="w-full sm:w-auto bg-white border border-orange-100 hover:border-orange-400 text-gray-700 hover:text-orange-500 font-bold px-8 py-4 rounded-2xl hover:bg-orange-50/30 transition-all cursor-pointer text-base"
              >
                Ghé Pet Shop Mua Sắm
              </button>
            </motion.div>

            {/* Trust Badges */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="grid grid-cols-3 gap-4 pt-6 max-w-md mx-auto lg:mx-0 border-t border-orange-100"
            >
              <div className="flex flex-col items-center lg:items-start">
                <div className="flex items-center text-orange-550 font-extrabold text-2xl">
                  <span>10</span><span className="text-sm font-semibold ml-0.5">+</span>
                </div>
                <span className="text-[11px] text-gray-500 font-semibold text-center lg:text-left">Năm Trải Nghiệm</span>
              </div>
              <div className="flex flex-col items-center lg:items-start">
                <div className="flex items-center text-orange-550 font-extrabold text-2xl">
                  <span>15</span><span className="text-sm font-semibold ml-0.5">k+</span>
                </div>
                <span className="text-[11px] text-gray-500 font-semibold text-center lg:text-left">Thú Cưng Đã Chăm</span>
              </div>
              <div className="flex flex-col items-center lg:items-start">
                <div className="flex items-center text-orange-550 font-extrabold text-2xl">
                  <span>4.9</span>
                  <Star className="w-4 h-4 fill-orange-500 text-orange-500 ml-1" />
                </div>
                <span className="text-[11px] text-gray-500 font-semibold text-center lg:text-left">Đánh Giá Từ Khách</span>
              </div>
            </motion.div>
          </div>

          {/* Graphical Banner Block */}
          <div className="lg:col-span-5 relative flex justify-center">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, type: 'spring' }}
              className="relative w-full max-w-[420px] aspect-square rounded-[40px] bg-orange-400 p-1.5 shadow-2xl shadow-orange-500/20 overflow-hidden border-8 border-white"
            >
              {/* Outer border glowing line */}
              <div className="absolute inset-0 bg-white/10 rounded-[38px] pointer-events-none" />
              
              {/* Inner graphic representing pets */}
              <div className="w-full h-full bg-[#FFFBEB] rounded-[32px] overflow-hidden flex flex-col justify-between items-center p-8 relative">
                {/* Visual Accent circles */}
                <div className="absolute top-4 right-4 w-32 h-32 bg-orange-100 rounded-full blur-xl pointer-events-none opacity-60" />
                <div className="absolute bottom-8 left-4 w-32 h-32 bg-teal-50 rounded-full blur-xl pointer-events-none opacity-60" />

                {/* Badge top left - Vibrant Theme accent */}
                <div className="self-start bg-orange-50 text-orange-600 px-3.5 py-1.5 rounded-full text-xs font-bold border border-orange-150 flex items-center space-x-1 shadow-xs mt-2 relative z-10 transition-transform hover:scale-105">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Bảo Mẫu Túc Trực 24/7</span>
                </div>

                {/* Central Pet Image Portrait or Stunning Mascot Card */}
                <div className="w-full h-48 my-auto relative z-10 flex items-center justify-center">
                  <div className="relative group cursor-pointer w-44 h-44 flex items-center justify-center rounded-full bg-orange-100 border-4 border-orange-400 p-4 transform transition-all duration-500 hover:rotate-3 hover:scale-105 shadow-md">
                    {/* Floating mini shapes */}
                    <span className="absolute -top-3 -left-2 text-2xl select-none animate-bounce">🐶</span>
                    <span className="absolute -bottom-2 -right-1 text-2xl select-none animate-bounce delay-300">🐱</span>
                    <span className="absolute top-1/2 -right-5 text-xl select-none">🐾</span>
                    
                    {/* Dynamic Graphic SVG of Cute pets */}
                    <LumiPetLogo iconOnly size="custom" customWidth={100} customHeight={100} className="scale-105 group-hover:scale-110 transition-transform" />
                  </div>
                </div>

                {/* Badge Bottom Right */}
                <div className="self-end bg-teal-50 text-teal-700 px-3.5 py-1.5 rounded-full text-xs font-bold border border-teal-150 flex items-center space-x-1 shadow-xs mb-2 relative z-10 transition-transform hover:scale-105">
                  <Award className="w-3.5 h-3.5 text-teal-600" />
                  <span>Cam kết chăm sóc chu đáo</span>
                </div>

                {/* Quick Info Bar */}
                <div className="w-full bg-orange-50/50 border border-orange-100 rounded-2xl p-3 flex items-center justify-around text-center relative z-10">
                  <div>
                    <span className="block text-[10px] text-orange-500/80 font-bold uppercase">Phòng Hotel</span>
                    <span className="block text-xs font-bold text-gray-800">Khử Trùng Tuyệt Đối</span>
                  </div>
                  <div className="w-px h-6 bg-orange-200" />
                  <div>
                    <span className="block text-[10px] text-orange-500/80 font-bold uppercase">Sản Phẩm</span>
                    <span className="block text-xs font-bold text-gray-800">Premium Organic</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

        </div>

        {/* Feature quick links shortcut */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-16 md:pt-20">
          
          {/* Shop Feature */}
          <div 
            onClick={() => onNavigate('shop')}
            className="group bg-white p-6 rounded-[32px] shadow-lg border-2 border-orange-50 flex flex-col justify-between vibrant-card hover:border-orange-200 cursor-pointer flex-row gap-4 items-start"
          >
            <div className="flex-shrink-0 w-12 h-12 bg-orange-100 rounded-2xl flex items-center justify-center text-orange-500 mb-4 group-hover:bg-orange-500 group-hover:text-white transition-colors">
              <span className="text-2xl select-none group-hover:scale-110 transition-transform">🛍️</span>
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-800 mb-2 group-hover:text-orange-500 transition-colors">Cửa Hàng Đồ Dùng</h3>
              <p className="text-gray-500 text-sm leading-relaxed">Cung cấp thức ăn hạt nhập ngoại, pate dinh dưỡng thơm ngon và phụ kiện sành điệu chính hãng.</p>
            </div>
          </div>

          {/* Spa Feature */}
          <div 
            onClick={() => onNavigate('spa')}
            className="group bg-teal-550 p-6 rounded-[32px] shadow-lg text-white flex flex-col justify-between vibrant-card hover:bg-teal-600 cursor-pointer flex-row gap-4 items-start"
          >
            <div className="flex-shrink-0 w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center mb-4 group-hover:bg-white group-hover:text-teal-650 transition-colors">
              <span className="text-2xl select-none group-hover:scale-110 transition-transform">✂️</span>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-2">Dịch Vụ Spa Lông Đẹp</h3>
              <p className="text-teal-50 text-sm leading-relaxed">Tắm sục, cắt tỉa lông nghệ thuật và bấm huyệt thư giãn giúp thú cưng luôn sạch thơm bong.</p>
            </div>
          </div>

          {/* Hotel Feature */}
          <div 
            onClick={() => onNavigate('hotel')}
            className="group bg-white p-6 rounded-[32px] shadow-lg border-2 border-orange-50 flex flex-col justify-between vibrant-card hover:border-orange-200 cursor-pointer flex-row gap-4 items-start"
          >
            <div className="flex-shrink-0 w-12 h-12 bg-yellow-100 rounded-2xl flex items-center justify-center text-yellow-600 mb-4 group-hover:bg-yellow-500 group-hover:text-white transition-colors">
              <span className="text-2xl select-none group-hover:scale-110 transition-transform">🏨</span>
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-800 mb-2 group-hover:text-orange-550 transition-colors">Khách Sạn Thú Cưng</h3>
              <p className="text-gray-500 text-sm leading-relaxed">Phòng cabin kính cách âm ấm áp với nhiệt độ điều hòa mát mẻ, camera liên tục 24/7.</p>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
