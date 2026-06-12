/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion } from 'motion/react';
import { Sparkles, Scissors, HeartPulse, Flower, Clock, BadgeCheck, ArrowRight } from 'lucide-react';
import { SpaService } from '../types';
import { SPA_SERVICES } from '../data';
import { formatVND } from './ShopSection';

interface GroomingSectionProps {
  onBookService: (serviceName: string, serviceId: string) => void;
}

// Map icon string to Lucide component
const getIconComponent = (iconName: string) => {
  switch (iconName) {
    case 'Sparkles':
      return <Sparkles className="w-6 h-6" />;
    case 'Scissors':
      return <Scissors className="w-6 h-6" />;
    case 'HeartPulse':
      return <HeartPulse className="w-6 h-6" />;
    case 'Flower':
      return <Flower className="w-6 h-6" />;
    default:
      return <Sparkles className="w-6 h-6" />;
  }
};

export default function GroomingSection({ onBookService }: GroomingSectionProps) {
  return (
    <section className="py-12 bg-[#FCFBFA]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Block */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center space-x-1.5 bg-amber-50 text-amber-800 border border-amber-100 rounded-full py-1 px-3 text-xs font-bold uppercase tracking-wider mb-3">
            <span>Dịch Vụ Spa Chuyên Nghiệp Cao Cấp</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-extrabold text-slate-800 tracking-tight font-display">
            Liệu Trình Spa <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-500 to-orange-600">Phục Hồi Sắc Đẹp</span> & Sức Khỏe
          </h2>
          <p className="text-slate-500 text-sm sm:text-base mt-2.5 leading-relaxed font-sans">
            Mỗi thú cưng khi đến với Lumi Pet Spa đều được trải nghiệm hồ sục jacuzzi nano, massage xoa bóp cơ khớp thư giãn bởi các thợ Groomer có chứng chỉ chuyên nghiệp quốc tế.
          </p>
        </div>

        {/* Services List Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {SPA_SERVICES.map((service) => (
            <motion.div
              key={service.id}
              id={`spa-service-${service.id}`}
              className="bg-white rounded-3xl border border-orange-100/50 hover:border-amber-400 p-6 sm:p-8 hover:shadow-xl hover:shadow-orange-500/5 transition-all duration-300 flex flex-col justify-between relative group overflow-hidden"
            >
              {/* Light corner gradient */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-amber-50 rounded-bl-full opacity-60 group-hover:bg-amber-100 transition-colors pointer-events-none" />

              <div>
                <div className="flex items-center space-x-4">
                  {/* Icon Container */}
                  <div className="w-14 h-14 bg-amber-100/70 text-amber-600 rounded-2xl flex items-center justify-center border border-amber-200 shadow-xs relative z-10 transition-transform group-hover:scale-108 group-hover:rotate-3 duration-300">
                    {getIconComponent(service.iconName)}
                  </div>
                  <div>
                    <h3 className="text-lg sm:text-xl font-bold text-slate-800 tracking-tight group-hover:text-amber-600 transition-colors">
                      {service.name}
                    </h3>
                    
                    {/* Duration badge */}
                    <div className="flex items-center space-x-1.5 text-xs text-slate-500 font-semibold mt-1">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      <span>{service.duration}</span>
                    </div>
                  </div>
                </div>

                <p className="text-slate-500 text-sm mt-5 leading-relaxed border-b border-orange-50 pb-4">
                  {service.description}
                </p>

                {/* Benefits List */}
                <div className="mt-5 space-y-2.5">
                  <span className="block text-xs font-black text-slate-400 uppercase tracking-wider">
                    Gói dịch vụ đã bao gồm:
                  </span>
                  {service.benefits.map((benefit, index) => (
                    <div key={index} className="flex items-start space-x-2 text-slate-600 text-sm">
                      <BadgeCheck className="w-4.5 h-4.5 text-amber-500 mt-0.5 flex-shrink-0" />
                      <span className="leading-snug">{benefit}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Price & Action button booking */}
              <div className="mt-8 pt-6 border-t border-orange-50 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                  <span className="block text-[11px] text-slate-400 font-bold uppercase tracking-wider">
                    Giá dịch vụ cơ bản
                  </span>
                  <span className="text-2xl font-black text-slate-800">
                    {formatVND(service.price)}
                  </span>
                  <span className="inline-block text-[10px] text-slate-450 ml-1.5 font-semibold">
                    (Thay đổi theo cân nặng thú cưng)
                  </span>
                </div>

                <button
                  onClick={() => onBookService(service.name, service.id)}
                  id={`book-spa-btn-${service.id}`}
                  className="w-full sm:w-auto flex items-center justify-center space-x-2 bg-slate-50 group-hover:bg-amber-500 border border-slate-200 group-hover:border-amber-400 text-slate-750 group-hover:text-white font-bold px-6 py-3.5 rounded-2xl transition-all hover:scale-103 cursor-pointer text-sm"
                >
                  <span>Đặt lịch hẹn ngay</span>
                  <ArrowRight className="w-4 h-4 translate-x-0 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>

            </motion.div>
          ))}
        </div>

        {/* Spa Policy Quick Details Block */}
        <div className="mt-16 bg-amber-50/40 rounded-[32px] border border-orange-100 p-6 md:p-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 text-center md:text-left">
          <div>
            <h4 className="text-base font-bold text-amber-850 font-display">🌟 Thợ Groomer Giấp Chứng Chỉ</h4>
            <p className="text-sm text-slate-500 mt-1 leading-relaxed">
              Bạn hoàn toàn yên tâm khi các bé được chăm bẵm trực tiếp từ các thợ cắt móng, tỉa lông được đào tạo và làm việc nhiều năm tại các trung tâm quốc tế hàng đầu.
            </p>
          </div>
          <div>
            <h4 className="text-base font-bold text-amber-850 font-display">🧴 Dầu Gội Organic Cao Cấp</h4>
            <p className="text-sm text-slate-500 mt-1 leading-relaxed">
              Chỉ tin dùng dòng sữa tắm trị liệu, hương nước hoa organic thảo mộc dịu mát màng biểu bì, tuyệt đối lành tính, xua đi mầm mống nấm ngứa mẩn ngứa nhạy cảm.
            </p>
          </div>
          <div>
            <h4 className="text-base font-bold text-amber-850 font-display">🛡️ Cam Kết Thân Thiện, Sát Sao</h4>
            <p className="text-sm text-slate-500 mt-1 leading-relaxed">
              Lumi Pet trân trọng từng boss yêu và không xích, xịt rửa ép nhốt lôi ép bạo lực. Sẵn sàng hoàn 100% chi phí phục vụ nếu quý khách hàng không hài lòng.
            </p>
          </div>
        </div>

      </div>
    </section>
  );
}
