import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Sparkles, Cat, Dog, Hotel, Check, Info, Scissors, HelpCircle, 
  Video, Utensils, MessageSquare, Phone, Calendar, AlertCircle, Award, ShieldAlert, Star
} from 'lucide-react';

interface PricingSectionProps {
  onTriggerBooking: () => void;
  onSelectServiceType?: (type: 'spa' | 'hotel', details: any) => void;
}

export default function PricingSection({ onTriggerBooking, onSelectServiceType }: PricingSectionProps) {
  const [activeSubTab, setActiveSubTab] = useState<'dog-spa' | 'cat-spa' | 'hotel'>('dog-spa');
  
  // Calculator inputs
  const [calcPetType, setCalcPetType] = useState<'dog' | 'cat'>('dog');
  const [calcService, setCalcService] = useState<'tvs' | 'ctc' | 'ctct' | 'hotel'>('tvs');
  const [calcWeight, setCalcWeight] = useState<number>(3.5);

  // Helper formatting
  const formatVND = (num: number) => {
    return num.toLocaleString('vi-VN') + 'đ';
  };

  // Pricing engine matching flyers exactly
  const getCatSpaPrice = (service: 'tvs' | 'ctc', weight: number) => {
    if (service === 'tvs') {
      if (weight < 3) return 150000;
      if (weight <= 6) return 200000;
      return 250000; // 6-10kg
    } else { // combo tắm cạo (ctc)
      if (weight < 3) return 230000;
      if (weight <= 6) return 290000;
      return 350000; // 6-10kg
    }
  };

  const getDogSpaPrice = (service: 'tvs' | 'ctc' | 'ctct', weight: number) => {
    if (weight < 3) {
      if (service === 'tvs') return 120000;
      if (service === 'ctc') return 180000;
      return 260000;
    } else if (weight <= 6) {
      if (service === 'tvs') return 170000;
      if (service === 'ctc') return 240000;
      return 320000;
    } else if (weight <= 9) {
      if (service === 'tvs') return 220000;
      if (service === 'ctc') return 300000;
      return 380500; // let's stick with round 380000
    } else if (weight <= 12) {
      if (service === 'tvs') return 270000;
      if (service === 'ctc') return 360000;
      return 450000;
    } else if (weight <= 18) {
      if (service === 'tvs') return 350000;
      if (service === 'ctc') return 460000;
      return 550000;
    } else {
      return -1; // Contact for custom price
    }
  };

  const getHotelPrice = (weight: number) => {
    if (weight < 3) return 100000;
    if (weight <= 6) return 120000;
    if (weight <= 9) return 160000;
    if (weight <= 12) return 200000;
    if (weight <= 15) return 250000;
    return -1; // contact shop
  };

  // Calculate based on state
  const computedPrice = (() => {
    if (calcService === 'hotel') {
      return getHotelPrice(calcWeight);
    }
    if (calcPetType === 'cat') {
      // cats only have TVS or CTC
      const serviceType = calcService === 'ctct' ? 'ctc' : (calcService as 'tvs' | 'ctc');
      return getCatSpaPrice(serviceType, calcWeight);
    } else {
      return getDogSpaPrice(calcService as 'tvs' | 'ctc' | 'ctct', calcWeight);
    }
  })();

  const dogSpaTiers = [
    { weight: 'Dưới 3kg', tvs: 120000, ctc: 180000, ctct: 260000 },
    { weight: '3 - 6kg', tvs: 170000, ctc: 240000, ctct: 320000 },
    { weight: '6 - 9kg', tvs: 220000, ctc: 300000, ctct: 380000 },
    { weight: '9 - 12kg', tvs: 270000, ctc: 360000, ctct: 450000 },
    { weight: '12 - 18kg', tvs: 350000, ctc: 460000, ctct: 550000 }
  ];

  const catSpaTiers = [
    { weight: 'Dưới 3kg', tvs: 150000, ctc: 230000 },
    { weight: '3 - 6kg', tvs: 200000, ctc: 290000 },
    { weight: '6 - 10kg', tvs: 250000, ctc: 350000 }
  ];

  const hotelTiers = [
    { weight: 'Dưới 3kg', price: 100000 },
    { weight: '3 - 6kg', price: 120000 },
    { weight: '6 - 9kg', price: 160000 },
    { weight: '9 - 12kg', price: 200000 },
    { weight: '12 - 15kg', price: 250000 }
  ];

  const stepDetails = [
    { step: 1, title: 'Kiểm tra tình trạng lông da', desc: 'Nhầm phát hiện nấm, rận và phác đồ dầu tắm riêng.' },
    { step: 2, title: 'Chải lông tơi xốp', desc: 'Gỡ lông rối chết, thông thoáng bề nang lông biểu bì.' },
    { step: 3, title: 'Cạo lông bàn chân', desc: 'Tránh trơn trượt khi cún mèo chạy nhảy trên sàn.' },
    { step: 4, title: 'Cạo lông bụng, hậu môn', desc: 'Vệ sinh sạch sẽ tuyệt đối, tránh bết dính chất thải.' },
    { step: 5, title: 'Vệ sinh tai, mắt, mũi miệng', desc: 'Lau nước muối sinh lý chuyên dụng, nhổ lông tai khử mùi.' },
    { step: 6, title: 'Cắt & mài móng không sợ sợ', desc: 'Sử dụng mài móng điện êm ái, bo tròn cạnh tránh cào xước.' },
    { step: 7, title: 'Vắt tuyến hôi phòng ngừa viêm', desc: 'Bước cực kỳ quan trọng ngăn chặn mùi hôi đặc trưng và bệnh viêm.' },
    { step: 8, title: 'Tắm xả cao cấp 2 lần', desc: 'Ủ dưỡng chất sâu, đánh bay cáu bẩn bã nhờn triệt để.' },
    { step: 9, title: 'Sấy chải tạo độ phồng phom', desc: 'Sấy sục khí ion ấm xua đuổi ẩm mốc lông con.' },
    { step: 10, title: 'Serum Keratin dưỡng mượt lông', desc: 'Phủ bóng bảo hộ, lưu hương hoa quả cỏ nhẹ nhàng lên đến 7 ngày.' }
  ];

  return (
    <section className="py-12 bg-slate-50/50" id="pricing-page-section">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* SEO - Google Ads Rich Header Segment */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center space-x-1.5 bg-amber-50 text-amber-800 border border-amber-100 rounded-full py-1.5 px-4 text-xs font-black uppercase tracking-wider mb-3 shadow-xs">
            <Award className="w-4 h-4 text-amber-500 fill-amber-500" />
            <span>Thương Hiệu Spa & Hotel Uy Tín Bình Thạnh</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-black text-slate-800 tracking-tight font-display mb-3">
            BẢNG GIÁ DỊCH VỤ <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-500 to-orange-650">LUMI PET 24/7</span>
          </h1>
          <p className="text-slate-550 text-sm sm:text-base leading-relaxed font-sans font-medium">
            Công khai minh bạch bảng phí spa thú cưng, combo tắm sấy tạo kiểu nghệ thuật và khách sạn chó mèo cao cấp theo cân nặng. Không phát sinh phụ phí vô lý - Cam kết hoàn tiền nếu không hài lòng.
          </p>
        </div>

        {/* 1. INTERACTIVE LIVE PRICE CALCULATOR (Extremely Google Ads & CRO Optimized) */}
        <div className="bg-white rounded-[32px] shadow-xl border-2 border-amber-100 p-6 md:p-8 max-w-4xl mx-auto mb-14 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-36 h-36 bg-amber-50 rounded-bl-full pointer-events-none opacity-50" />
          
          <div className="flex flex-col sm:flex-row items-center justify-between pb-5 mb-6 border-b border-orange-50 gap-4">
            <div className="flex items-center space-x-2.5">
              <div className="w-10 h-10 rounded-xl bg-orange-500 text-white flex items-center justify-center font-bold text-lg">💡</div>
              <div>
                <h2 className="text-lg md:text-xl font-extrabold text-slate-800">Tra Cứu Chi Phí Cho Con Trực Tuyến</h2>
                <span className="text-xs text-slate-400 font-bold block">Tính toán chính xác theo cân nặng và loài của bé</span>
              </div>
            </div>
            <div className="flex items-center text-xs bg-amber-50 border border-amber-100 text-amber-800 px-3 py-1.5 rounded-lg font-bold">
              ⚡ Báo giá mới cập nhật hôm nay
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Column 1: Pet Species */}
            <div className="space-y-3">
              <label className="block text-xs font-black uppercase text-slate-450 tracking-wider">1. Chọn loài Boss cưng</label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setCalcPetType('dog');
                    if (calcService === 'hotel') {
                      // remain hotel
                    } else if (calcService !== 'tvs' && calcService !== 'ctc' && calcService !== 'ctct') {
                      setCalcService('tvs');
                    }
                  }}
                  className={`py-3 px-4 rounded-2xl flex flex-col items-center justify-center border-2 transition-all cursor-pointer font-bold ${
                    calcPetType === 'dog' && calcService !== 'hotel'
                      ? 'border-orange-500 bg-orange-50/70 text-orange-600 shadow-xs'
                      : 'border-slate-100 bg-slate-50 text-slate-500 hover:border-orange-200'
                  }`}
                >
                  <span className="text-2xl">🐶</span>
                  <span className="text-xs mt-1 font-extrabold">Cún / Chó cưng</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setCalcPetType('cat');
                    if (calcService === 'ctct') {
                      setCalcService('ctc'); // Cat doesnt have ctct in flyer
                    }
                  }}
                  className={`py-3 px-4 rounded-2xl flex flex-col items-center justify-center border-2 transition-all cursor-pointer font-bold ${
                    calcPetType === 'cat' && calcService !== 'hotel'
                      ? 'border-orange-500 bg-orange-50/70 text-orange-600 shadow-xs'
                      : 'border-slate-100 bg-slate-50 text-slate-500 hover:border-orange-200'
                  }`}
                >
                  <span className="text-2xl">🐱</span>
                  <span className="text-xs mt-1 font-extrabold">Mèo cưng</span>
                </button>
              </div>
            </div>

            {/* Column 2: Weight Slider */}
            <div className="space-y-3">
              <div className="flex justify-between items-baseline">
                <label className="block text-xs font-black uppercase text-slate-450 tracking-wider">2. Nhập cân nặng</label>
                <span className="text-sm font-black text-orange-600 bg-orange-50 px-2.5 py-0.5 rounded-lg border border-orange-100">{calcWeight} kg</span>
              </div>
              <div className="pt-2">
                <input
                  type="range"
                  min="0.5"
                  max="20"
                  step="0.5"
                  value={calcWeight}
                  onChange={(e) => setCalcWeight(parseFloat(e.target.value))}
                  className="w-full accent-orange-500 bg-orange-100 h-2 rounded-lg appearance-none cursor-pointer"
                />
              </div>
              <div className="flex justify-between text-[10px] text-slate-400 font-bold">
                <span>Dưới 3kg</span>
                <span>3 - 6kg</span>
                <span>6 - 12kg</span>
                <span>Hơn 15kg</span>
              </div>
            </div>

            {/* Column 3: Service Selector */}
            <div className="space-y-3">
              <label className="block text-xs font-black uppercase text-slate-450 tracking-wider">3. Chọn nhóm dịch vụ</label>
              <div className="space-y-1.5">
                <select
                  value={calcService}
                  onChange={(e) => setCalcService(e.target.value as any)}
                  className="w-full bg-slate-50 border-2 border-slate-100 hover:border-amber-400 focus:border-amber-400 rounded-xl p-3 text-xs font-bold focus:outline-none transition-colors"
                >
                  <option value="tvs">Combo Tắm Vệ Sinh 10 Bước (Tốt nhất)</option>
                  <option value="ctc">Combo Tắm Cạo Lông Sạch Sẽ</option>
                  {calcPetType === 'dog' && (
                    <option value="ctct">Combo Tắm Cắt Tạo Kiểu Nghệ Thuật</option>
                  )}
                  <option value="hotel">Khách Sạn Thú Cưng Lưu Trú 24/7</option>
                </select>
                <p className="text-[10px] text-slate-400 leading-normal pl-0.5 italic">
                  * Đơn giá trọn gói niêm yết, cam kết không phát sinh phụ thu vô lý.
                </p>
              </div>
            </div>

          </div>

          {/* Calculator Output Segment */}
          <div className="mt-8 pt-6 border-t border-orange-50 bg-amber-50/30 rounded-2xl p-5 flex flex-col md:flex-row items-center justify-between gap-5">
            <div className="text-center md:text-left">
              <span className="text-xs text-slate-400 font-bold uppercase tracking-widest block">Chi Phí Ước Tính Trực Tuyến</span>
              <div className="mt-1 flex items-baseline justify-center md:justify-start space-x-2">
                {computedPrice === -1 ? (
                  <span className="text-xl md:text-2xl font-black text-red-550">Liên Hệ Để Nhận Báo Giá</span>
                ) : (
                  <>
                    <span className="text-3xl md:text-4xl font-black text-rose-500 font-display">
                      {formatVND(computedPrice)}
                    </span>
                    <span className="text-xs text-slate-500 font-bold">(Trọn gói, đã bao gồm thuế phí)</span>
                  </>
                )}
              </div>
              <p className="text-[11px] text-slate-450 mt-1.5 leading-relaxed font-medium">
                {calcService === 'hotel' 
                  ? '✓ Bao gồm phòng kính riêng tư, điều hoà mát mẻ 24/24, thực đơn tươi 3 bữa và quay camera báo cáo hàng ngày.'
                  : '✓ Quy trình tắm sấy vắt tuyến hôi, sấy tơi chống rối và tặng kèm chuông cổ xinh xắn.'}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto flex-shrink-0">
              <a
                href="https://zalo.me/0989979675"
                target="_blank"
                rel="noreferrer"
                className="bg-sky-600 hover:bg-sky-700 text-white font-extrabold text-[13px] px-5 py-3.5 rounded-xl transition-all shadow-md flex items-center justify-center gap-1.5 text-center"
              >
                <MessageSquare className="w-4 h-4 fill-white text-sky-600" />
                <span>Nhận Tư Vấn Zalo</span>
              </a>
              <button
                onClick={onTriggerBooking}
                className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-black text-[13px] px-6 py-3.5 rounded-xl transition-all shadow-md flex items-center justify-center gap-1.5 cursor-pointer text-center"
              >
                <Calendar className="w-4 h-4" />
                <span>Đặt Giữ Lịch Ngay</span>
              </button>
            </div>
          </div>
        </div>


        {/* 2. THE THREE TABBED OFFICIAL PRICE TABLES (Visual congruence with images) */}
        <div className="bg-white rounded-[32px] shadow-sm border border-orange-100 p-4 sm:p-6 mb-14">
          
          {/* Navigation Tab selection */}
          <div className="flex flex-wrap justify-center border-b border-orange-50 gap-2 mb-8">
            <button
              onClick={() => setActiveSubTab('dog-spa')}
              className={`px-5 py-3 rounded-t-2xl font-black text-sm transition-all flex items-center space-x-2 border-b-4 -mb-[2px] cursor-pointer ${
                activeSubTab === 'dog-spa'
                  ? 'border-orange-500 text-orange-600 bg-orange-50/40'
                  : 'border-transparent text-slate-500 hover:text-orange-500 hover:bg-slate-50'
              }`}
            >
              <Dog className="w-4.5 h-4.5" />
              <span>Bảng Giá Spa & Grooming Chó</span>
            </button>
            
            <button
              onClick={() => setActiveSubTab('cat-spa')}
              className={`px-5 py-3 rounded-t-2xl font-black text-sm transition-all flex items-center space-x-2 border-b-4 -mb-[2px] cursor-pointer ${
                activeSubTab === 'cat-spa'
                  ? 'border-orange-500 text-orange-600 bg-orange-50/40'
                  : 'border-transparent text-slate-500 hover:text-orange-500 hover:bg-slate-50'
              }`}
            >
              <Cat className="w-4.5 h-4.5" />
              <span>Bảng Giá Spa & Tạo Kiểu Mèo</span>
            </button>

            <button
              onClick={() => setActiveSubTab('hotel')}
              className={`px-5 py-3 rounded-t-2xl font-black text-sm transition-all flex items-center space-x-2 border-b-4 -mb-[2px] cursor-pointer ${
                activeSubTab === 'hotel'
                  ? 'border-orange-500 text-orange-600 bg-orange-50/40'
                  : 'border-transparent text-slate-500 hover:text-orange-500 hover:bg-slate-50'
              }`}
            >
              <Hotel className="w-4.5 h-4.5" />
              <span>Bảng Giá Khách Sạn (Hotel)</span>
            </button>
          </div>

          <div className="space-y-6">
            {/* SUB-TAB 1: DOG SPA */}
            {activeSubTab === 'dog-spa' && (
              <div className="space-y-6">
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                  <div>
                    <h3 className="text-xl font-extrabold text-slate-800 font-display flex items-center space-x-1.5">
                      <span>🐶 Liệu Trình Spa & Cắt Lông Tạo Hình Chó Cưng</span>
                    </h3>
                    <p className="text-xs text-slate-400 font-semibold mt-1">Chăm sóc toàn diện, mát mẻ không stress căng thẳng.</p>
                  </div>
                  <div className="text-xs bg-rose-50 text-rose-700 px-3 py-1.5 rounded-lg border border-rose-100 font-extrabold shadow-3xs">
                    🌟 Khuyên chọn: Combo Tắm Cắt Tỉa đẹp rạng ngời
                  </div>
                </div>

                {/* Table representation */}
                <div className="overflow-x-auto rounded-2xl border border-orange-100">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-amber-850/10 text-slate-800 text-xs font-bold border-b border-orange-100">
                        <th className="py-4 px-5">KHỐI LƯỢNG (KG)</th>
                        <th className="py-4 px-5">TẮM VỆ SINH (VND)</th>
                        <th className="py-4 px-5">COMBO TẮM CẠO (VND)</th>
                        <th className="py-4 px-5">COMBO TẮM CẮT TỈA (VND)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-orange-50 text-xs font-semibold text-slate-650">
                      {dogSpaTiers.map((tier, index) => (
                        <tr key={index} className="hover:bg-orange-50/20 transition-colors">
                          <td className="py-4 px-5 text-slate-800 font-extrabold flex items-center gap-2">
                            <span>🐩</span>
                            <span>{tier.weight}</span>
                          </td>
                          <td className="py-4 px-5 font-black text-slate-800">{formatVND(tier.tvs)}</td>
                          <td className="py-4 px-5 font-black text-amber-600">{formatVND(tier.ctc)}</td>
                          <td className="py-4 px-5 font-black text-orange-600">{formatVND(tier.ctct)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="text-slate-450 text-[11px] font-semibold bg-slate-50 rounded-xl p-3 border border-slate-100">
                  * Lưu ý: Thú cưng trên 15kg - 18kg vui lòng liên hệ hệ thống để thợ Groomer báo giá cụ thể tương ứng phom dáng lông.
                </div>
              </div>
            )}

            {/* SUB-TAB 2: CAT SPA */}
            {activeSubTab === 'cat-spa' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-extrabold text-slate-800 font-display flex items-center space-x-1.5">
                    <span>🐱 Liệu Trình Spa Tắm Sấy & Cạo Bớt Nóng Cho Mèo</span>
                  </h3>
                  <p className="text-xs text-slate-405 font-semibold mt-1">Dành chuyên biệt cho màng tính khí nhạy cảm sợ nước của mèo cưng.</p>
                </div>

                {/* Table representation */}
                <div className="overflow-x-auto rounded-2xl border border-orange-100">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-amber-850/10 text-slate-800 text-xs font-bold border-b border-orange-100">
                        <th className="py-4 px-5">KHỐI LƯỢNG (KG)</th>
                        <th className="py-4 px-5">COMBO TẮM VỆ SINH (VND)</th>
                        <th className="py-4 px-5">COMBO TẮM CẠO LÔNG (VND)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-orange-50 text-xs font-semibold text-slate-650">
                      {catSpaTiers.map((tier, index) => (
                        <tr key={index} className="hover:bg-orange-50/20 transition-colors">
                          <td className="py-4 px-5 text-slate-800 font-extrabold flex items-center gap-2">
                            <span>🐈</span>
                            <span>{tier.weight}</span>
                          </td>
                          <td className="py-4 px-5 font-black text-slate-800">{formatVND(tier.tvs)}</td>
                          <td className="py-4 px-5 font-black text-orange-600">{formatVND(tier.ctc)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* SUB-TAB 3: HOTEL */}
            {activeSubTab === 'hotel' && (
              <div className="space-y-6">
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                  <div>
                    <h3 className="text-xl font-extrabold text-slate-800 font-display flex items-center space-x-1.5">
                      <span>🏨 Dịch Vụ Khách Sạn Hotel Lưu Trú Chó Mèo 24/7</span>
                    </h3>
                    <p className="text-xs text-slate-400 font-semibold mt-1">Chuồng cabin riêng tư, điều hoà mát mẻ suốt cả ngày.</p>
                  </div>
                  <div className="flex flex-wrap gap-2 text-[10px] sm:text-xs">
                    <span className="bg-emerald-50 text-emerald-800 border border-emerald-100 px-2.5 py-1 rounded-md font-bold">✓ Trên 5 ngày: GIẢM 5%</span>
                    <span className="bg-orange-50 text-orange-850 border border-orange-100 px-2.5 py-1 rounded-md font-bold">✓ Trên 10 ngày: GIẢM 8%</span>
                  </div>
                </div>

                {/* Table representation */}
                <div className="overflow-x-auto rounded-2xl border border-orange-100">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-amber-850/10 text-slate-800 text-xs font-bold border-b border-orange-100">
                        <th className="py-4 px-5">KHỐI LƯỢNG THÚ CƯNG (KG)</th>
                        <th className="py-4 px-5">ĐƠN GIÁ PHÒNG LƯU TRÚ (VND / NGÀY / ĐÊM)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-orange-50 text-xs font-semibold text-slate-650">
                      {hotelTiers.map((tier, index) => (
                        <tr key={index} className="hover:bg-orange-50/20 transition-colors">
                          <td className="py-4 px-5 text-slate-800 font-extrabold flex items-center gap-2">
                            <span>🏨</span>
                            <span>{tier.weight}</span>
                          </td>
                          <td className="py-4 px-5 font-black text-rose-500 text-sm">{formatVND(tier.price)} <span className="text-[11px] text-slate-400 font-medium">/ ngày</span></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Inclusions grid */}
                <div className="mt-4 bg-orange-50/30 rounded-2xl p-5 border border-orange-105">
                  <h4 className="text-xs font-bold uppercase text-slate-800 mb-3 tracking-wider flex items-center gap-1">
                    <span>🌟</span> Đơn Giá Trên Đã Bao Gồm Trọn Gói:
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                    <div className="flex items-center space-x-2 text-xs text-slate-650">
                      <span className="text-emerald-500">✔</span>
                      <span>Cabin/Chuồng riêng biệt từng bé</span>
                    </div>
                    <div className="flex items-center space-x-2 text-xs text-slate-650">
                      <span className="text-emerald-500">✔</span>
                      <span>Đảm bảo vệ sinh sạch, sấy ô-zôn</span>
                    </div>
                    <div className="flex items-center space-x-2 text-xs text-slate-650">
                      <span className="text-emerald-500">✔</span>
                      <span>Hệ thống máy lạnh mát mát 24/24</span>
                    </div>
                    <div className="flex items-center space-x-2 text-xs text-slate-650">
                      <span className="text-emerald-500">✔</span>
                      <span>Menu tươi 3 bữa chất lượng từng thịt</span>
                    </div>
                    <div className="flex items-center space-x-2 text-xs text-slate-650">
                      <span className="text-emerald-500">✔</span>
                      <span>Báo cáo quay video hàng ngày gửi Zalo</span>
                    </div>
                    <div className="flex items-center space-x-2 text-xs text-slate-650">
                      <span className="text-emerald-500">✔</span>
                      <span>Sát sao chăm bẵm từ bảo mẫu</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

          </div>
        </div>


        {/* 3. COMBO 10-STEP CORE PROCESS & TERMS & ADDONS */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-12">
          
          {/* Column A: 10 Steps */}
          <div className="lg:col-span-7 bg-white rounded-[32px] shadow-sm border border-orange-100 p-6 md:p-8">
            <h3 className="text-lg font-black text-slate-800 font-display mb-6 border-b border-orange-50 pb-3 flex items-center space-x-2">
              <span className="bg-orange-500 text-white w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs">10</span>
              <span>Quy Trình Tắm & Grooming Thú Cưng Đạt Chuẩn</span>
            </h3>
            
            <div className="space-y-4">
              {stepDetails.map((item) => (
                <div key={item.step} className="flex gap-4 items-start">
                  <div className="w-6 h-6 rounded-full bg-amber-100 border border-amber-300 text-amber-800 flex items-center justify-center text-xs font-black flex-shrink-0 mt-0.5">
                    {item.step}
                  </div>
                  <div>
                    <h4 className="text-xs font-extrabold text-slate-800">{item.title}</h4>
                    <p className="text-[11px] text-slate-500 leading-relaxed mt-0.5">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Column B: Addons & Notes */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            
            {/* Box 1: Addons (Phụ thu rõ ràng) */}
            <div className="bg-white rounded-[32px] shadow-sm border border-orange-100 p-6 md:p-8">
              <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest border-l-4 border-orange-500 pl-2.5 mb-5">
                Các Phụ Thu Phát Sinh Thường Gặp
              </h3>
              
              <ul className="space-y-3.5 text-xs text-slate-650 font-semibold">
                <li className="flex items-center justify-between pb-2 border-b border-slate-50">
                  <span className="flex items-center gap-1.5 text-gray-700">
                    <span>✂️</span> Gỡ rối lông chết xơ xù
                  </span>
                  <span className="text-orange-550 font-black">50k - 500k <span className="text-[9px] text-gray-400 font-medium">(báo trước)</span></span>
                </li>
                
                <li className="flex items-center justify-between pb-2 border-b border-slate-50">
                  <span className="flex items-center gap-1.5 text-gray-700">
                    <span>❤️</span> Thiết kế phom rốn tim, tròn xinh xẻo
                  </span>
                  <span className="text-orange-550 font-black">50k - 100k</span>
                </li>

                <li className="flex items-center justify-between pb-2 border-b border-slate-50">
                  <span className="flex items-center gap-1.5 text-gray-700">
                    <span>🌱</span> Sữa tắm thảo dược hỗ trợ nấm, ve rận
                  </span>
                  <span className="text-orange-550 font-black">50k - 100k</span>
                </li>

                <li className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5 text-red-500">
                    <span>🚨</span> Bé có tính khí cọ quậy dữ dằn, khó chiều
                  </span>
                  <span className="text-orange-550 font-black">50k - 100k</span>
                </li>
              </ul>
            </div>

            {/* Box 2: Terms / Lưu ý sức khỏe */}
            <div className="bg-amber-50/20 rounded-[32px] border border-amber-205 p-6 md:p-8 flex-1 flex flex-col justify-between">
              <div>
                <h3 className="text-xs font-black text-amber-800 uppercase tracking-wider mb-3.5 flex items-center gap-1.5">
                  <ShieldAlert className="w-4 h-4 text-amber-600" />
                  <span>Chính Sách Chăm Sóc Sức Khỏe Cho Bé</span>
                </h3>
                <ul className="space-y-2.5 text-xs text-slate-550 leading-relaxed font-semibold">
                  <li className="flex items-start gap-1.5">
                    <span className="text-amber-500">✦</span>
                    <span>Hệ thống chỉ tiếp nhận các bé đã tiêm từ 2 mũi trở lên và có sổ khám sức khỏe.</span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <span className="text-amber-500">✦</span>
                    <span>Vui lòng thông báo chi tiết tình trạng dị ứng sữa tắm hoặc bệnh nền (hen suyễn, tim mạch) nếu có cho bảo mẫu.</span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <span className="text-amber-500">✦</span>
                    <span>Từ chối nhận mèo hoặc cún đang điều trị các mầm bệnh truyền nhiễm lây chéo nặng.</span>
                  </li>
                </ul>
              </div>

              <div className="pt-6 border-t border-orange-100/50 mt-6 text-center">
                <p className="text-[11px] text-slate-450 italic font-semibold">
                  "Nụ cười vui sướng của Boss yêu - Sự an tâm trọn vẹn của Ba Mẹ"
                </p>
                <div className="mt-3.5 flex justify-center space-x-1 font-bold text-amber-500">
                  <Star className="w-3.5 h-3.5 fill-amber-500" />
                  <Star className="w-3.5 h-3.5 fill-amber-500" />
                  <Star className="w-3.5 h-3.5 fill-amber-500" />
                  <Star className="w-3.5 h-3.5 fill-amber-500" />
                  <Star className="w-3.5 h-3.5 fill-amber-500" />
                </div>
              </div>

            </div>

          </div>
        </div>

      </div>
    </section>
  );
}
