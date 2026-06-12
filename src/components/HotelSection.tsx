/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion } from 'motion/react';
import { Rating } from 'react'; // we don't have react-rating, we can use simple Star symbols
import { Star, Shield, Play, HelpCircle, Footprints, Video, Utensils, CheckCircle } from 'lucide-react';
import { HotelRoom } from '../types';
import { HOTEL_ROOMS } from '../data';
import { formatVND } from './ShopSection';

interface HotelSectionProps {
  onBookRoom: (roomName: string, roomId: string) => void;
}

export default function HotelSection({ onBookRoom }: HotelSectionProps) {
  return (
    <section className="py-12 bg-slate-50/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center space-x-1.5 bg-amber-50 text-amber-800 border border-amber-100 rounded-full py-1 px-3 text-xs font-bold uppercase tracking-wider mb-3">
            <span>Dịch Vụ Lưu Trú Đẳng Cấp 5 Sao</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-extrabold text-slate-800 tracking-tight font-display">
            Khách Sạn Thú Cưng <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-500 to-orange-600">Hotel Resort 24/7</span>
          </h2>
          <p className="text-slate-500 text-sm sm:text-base mt-2.5 leading-relaxed font-sans">
            Hệ thống phòng lưu trú khép kín, cách âm giảm tiếng sủa lo âu, thông khí Fresh Air áp suất dương đảm bảo không mùi, luôn duy trì rèm sưởi giữ ấm về đêm cho chó mèo.
          </p>
        </div>

        {/* Room grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {HOTEL_ROOMS.map((room) => (
            <motion.div
              key={room.id}
              id={`hotel-room-${room.id}`}
              className="bg-white rounded-3xl border border-orange-100/50 hover:border-amber-400 p-6 shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between overflow-hidden group"
            >
              <div>
                {/* Room Image with overlay tags */}
                <div className="relative h-56 rounded-2xl overflow-hidden bg-slate-100">
                  <img
                    src={room.image}
                    alt={room.name}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-104 transition-transform duration-500"
                  />
                  
                  {/* Rating Tag */}
                  <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-xs text-amber-500 border border-amber-50 px-2.5 py-1 rounded-full text-xs font-bold flex items-center space-x-1 shadow-xs">
                    <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                    <span>{room.rating.toFixed(1)}</span>
                  </div>

                  {/* Size Capacity Badge */}
                  <div className="absolute bottom-3 left-3 bg-slate-900/80 backdrop-blur-xs text-white px-3 py-1.5 rounded-lg text-xs font-semibold">
                    🔑 {room.capacity}
                  </div>
                </div>

                {/* Info Header */}
                <div className="mt-5">
                  <h3 className="text-xl font-bold text-slate-850 group-hover:text-amber-600 transition-colors">
                    {room.name}
                  </h3>
                  <p className="text-xs text-slate-500 mt-2 leading-relaxed min-h-12 font-sans">
                    {room.description}
                  </p>
                </div>

                {/* Amenities checklist */}
                <div className="mt-6 space-y-2.5 border-t border-orange-50/50 pt-5">
                  <span className="block text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    Chính sách chăm sóc kèm theo:
                  </span>
                  {room.amenities.map((amenity, index) => (
                    <div key={index} className="flex items-start space-x-2 text-slate-600 text-xs">
                      <CheckCircle className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
                      <span className="leading-snug">{amenity}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Price / Booking Action Footer */}
              <div className="mt-8 pt-5 border-t border-orange-50 flex items-center justify-between gap-4">
                <div>
                  <span className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                    Giá lưu trú / Đêm
                  </span>
                  <span className="text-xl font-black text-slate-800">
                    {formatVND(room.pricePerNight)}
                  </span>
                </div>

                <button
                  onClick={() => onBookRoom(room.name, room.id)}
                  id={`book-room-btn-${room.id}`}
                  className="px-5 py-3.5 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-extrabold text-xs rounded-xl shadow-xs cursor-pointer active:scale-98 transition-all"
                >
                  Đặt phòng ngay
                </button>
              </div>

            </motion.div>
          ))}
        </div>

        {/* Feature quick badges for Hotel */}
        <div className="mt-14 grid grid-cols-1 md:grid-cols-4 gap-6 bg-white border border-orange-100 p-8 rounded-3xl text-center md:text-left shadow-xs">
          <div className="flex flex-col md:flex-row items-center md:items-start space-y-3 md:space-y-0 md:space-x-3.5">
            <div className="p-3 bg-amber-550/10 text-amber-600 rounded-2xl flex-shrink-0">
              <Video className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-800 font-display">Live Webcam HD</h4>
              <p className="text-xs text-slate-500 mt-1">Gửi link livestream chuẩn HD 24/7 để bạn ngắm boss, yên tâm tận hưởng chuyến đi xa.</p>
            </div>
          </div>

          <div className="flex flex-col md:flex-row items-center md:items-start space-y-3 md:space-y-0 md:space-x-3.5">
            <div className="p-3 bg-rose-550/10 text-rose-600 rounded-2xl flex-shrink-0">
              <Utensils className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-800 font-display">Menu Ẩm Thực Tươi</h4>
              <p className="text-xs text-slate-500 mt-1">Chuẩn bị thực đơn nêm nếm hấp chín tươi sạch (Ức gà hấp xé, súp cua đồng) theo nhu cầu riêng khách gửi.</p>
            </div>
          </div>

          <div className="flex flex-col md:flex-row items-center md:items-start space-y-3 md:space-y-0 md:space-x-3.5">
            <div className="p-3 bg-indigo-550/10 text-indigo-600 rounded-2xl flex-shrink-0">
              <Footprints className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-800 font-display">Bảo Mẫu Vui Chơi</h4>
              <p className="text-xs text-slate-500 mt-1">Được dạo chơi, chạy nhảy trong sảnh điều hòa máy mát lạnh cùng bảo mẫu vuốt ve hàng tiếng mỗi ngày.</p>
            </div>
          </div>

          <div className="flex flex-col md:flex-row items-center md:items-start space-y-3 md:space-y-0 md:space-x-3.5">
            <div className="p-3 bg-emerald-550/10 text-emerald-600 rounded-2xl flex-shrink-0">
              <Shield className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-800 font-display">Bảo Mẫu Giám Sát Sức Khỏe</h4>
              <p className="text-xs text-slate-500 mt-1">Theo dõi sát sao thể trạng, kiểm tra da tai mắt mũi miệng mỗi sáng để kịp thời cập nhật cho ba mẹ.</p>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
