/**
 * @license
 * SPDX-License-Identifier: Apache-2.5
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Star, Smile, Sparkles, MessageCircleCode, CheckCircle, Feather } from 'lucide-react';
import { Review } from '../types';
import { CLIENT_REVIEWS } from '../data';

export default function ReviewsSection() {
  const [reviewsList, setReviewsList] = useState<Review[]>(CLIENT_REVIEWS);
  const [showReviewForm, setShowReviewForm] = useState(false);

  // Form State
  const [author, setAuthor] = useState('');
  const [petName, setPetName] = useState('');
  const [petBreed, setPetBreed] = useState('');
  const [rating, setRating] = useState(5);
  const [text, setText] = useState('');
  const [serviceType, setServiceType] = useState<'Shop' | 'Spa' | 'Hotel'>('Spa');
  const [success, setSuccess] = useState(false);

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!author || !petName || !text) {
      alert('Vui lòng điền đầy đủ Tên, Tên thú cưng và nội dung phản hồi!');
      return;
    }

    const newRev: Review = {
      id: 'rev-' + (reviewsList.length + 1),
      author,
      petName,
      petBreed: petBreed || 'Thú cưng dễ thương',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80', // generic avatar representation
      rating,
      text,
      serviceType,
      date: new Date().toLocaleDateString('vi-VN')
    };

    setReviewsList([newRev, ...reviewsList]);
    setSuccess(true);

    // Reset fields
    setAuthor('');
    setPetName('');
    setPetBreed('');
    setText('');
    
    setTimeout(() => {
      setSuccess(false);
      setShowReviewForm(false);
    }, 2500);
  };

  return (
    <section className="py-12 bg-white/70">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Title Block */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 border-b border-orange-50 pb-6">
          <div>
            <div className="inline-flex items-center space-x-1 bg-amber-50 text-amber-800 border border-amber-100 rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wider mb-2">
              <span>Đánh giá từ khách hàng</span>
            </div>
            <h2 className="text-3xl font-extrabold text-slate-800 tracking-tight font-display">
              Họ Đã Nói Gì Về <span className="text-amber-500">Lumi Pet</span>?
            </h2>
            <p className="text-slate-500 text-sm mt-1">
              Phản hồi thực tế từ các hội nhóm ba mẹ nuôi chó mèo trải nghiệm chăm sóc dịch vụ tại Lumi Pet.
            </p>
          </div>

          <button
            onClick={() => setShowReviewForm(!showReviewForm)}
            id="write-review-btn"
            className="flex items-center space-x-2 bg-slate-900 border border-slate-900 hover:bg-amber-500 hover:border-amber-400 text-white font-bold px-6 py-3 rounded-2xl shadow-sm text-sm transition-all duration-300 transform active:scale-97 cursor-pointer"
          >
            <Feather className="w-4 h-4" />
            <span>Viết Đánh Giá Của Bạn</span>
          </button>
        </div>

        {/* Dropdown review writing form */}
        <AnimatePresence>
          {showReviewForm && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden mb-12"
            >
              <div className="bg-slate-50 border border-orange-100/60 p-6 md:p-8 rounded-[32px] max-w-2xl mx-auto">
                {success ? (
                  <div className="py-8 text-center flex flex-col items-center justify-center">
                    <div className="w-12 h-12 bg-emerald-100 rounded-full text-emerald-650 flex items-center justify-center mb-3">
                      <CheckCircle className="w-8 h-8" />
                    </div>
                    <h3 className="text-lg font-bold text-slate-800 font-display">Đã đăng đánh giá thành công!</h3>
                    <p className="text-slate-500 text-xs mt-1">
                      Chân thành cảm ơn đóng góp ý kiến của ba mẹ đã giúp Lumi Pet ngày một hoàn thiện hơn.
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmitReview} className="space-y-4">
                    <h3 className="text-md font-bold text-slate-800 font-display mb-2">
                       Chia sẻ niềm hạnh phúc cùng cộng đồng ba mẹ thú cưng
                    </h3>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-650 mb-1.5" htmlFor="rev-author">
                          Tên của bạn *
                        </label>
                        <input
                          type="text"
                          required
                          id="rev-author"
                          value={author}
                          onChange={(e) => setAuthor(e.target.value)}
                          placeholder="Ví dụ: Minh Châu"
                          className="w-full px-4 py-2 rounded-xl border border-orange-100 bg-white text-xs text-slate-705 focus:outline-none focus:ring-2 focus:ring-amber-400"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-655 mb-1.5" htmlFor="rev-pet-name">
                          Tên boss yêu *
                        </label>
                        <input
                          type="text"
                          required
                          id="rev-pet-name"
                          value={petName}
                          onChange={(e) => setPetName(e.target.value)}
                          placeholder="Ví dụ: LuLu, Cam..."
                          className="w-full px-4 py-2 rounded-xl border border-orange-100 bg-white text-xs text-slate-705 focus:outline-none focus:ring-2 focus:ring-amber-400"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-655 mb-1.5" htmlFor="rev-pet-breed">
                          Giống loài thú cưng
                        </label>
                        <input
                          type="text"
                          id="rev-pet-breed"
                          value={petBreed}
                          onChange={(e) => setPetBreed(e.target.value)}
                          placeholder="Ví dụ: Corgi, Mèo ALN..."
                          className="w-full px-4 py-2 rounded-xl border border-orange-100 bg-white text-xs text-slate-705 focus:outline-none focus:ring-2 focus:ring-amber-400"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* Service Category Option */}
                      <div>
                        <label className="block text-xs font-bold text-slate-655 mb-1.5">
                          Trải nghiệm dịch vụ nào? *
                        </label>
                        <select
                          value={serviceType}
                          onChange={(e) => setServiceType(e.target.value as 'Shop' | 'Spa' | 'Hotel')}
                          className="w-full px-4 py-2 rounded-xl border border-orange-100 bg-white text-xs text-slate-705 focus:outline-none focus:ring-2 focus:ring-amber-405"
                        >
                          <option value="Spa">Combo Tắm Sấy & Cắt Tỉa (Spa)</option>
                          <option value="Hotel">Dịch Vụ Khách Sạn Gửi Trọ (Hotel)</option>
                          <option value="Shop">Mua Hàng Siêu Thị (Pet Shop)</option>
                        </select>
                      </div>

                      {/* Score Selector */}
                      <div>
                        <label className="block text-xs font-bold text-slate-655 mb-1.5">
                          Số sao đánh giá *
                        </label>
                        <div className="flex items-center space-x-2 bg-white px-4 py-1.5 rounded-xl border border-orange-100 h-9.5">
                          {[5, 4, 3, 2, 1].map((stars) => (
                            <button
                              key={stars}
                              type="button"
                              onClick={() => setRating(stars)}
                              className={`p-0.5 hover:scale-110 transition-transform ${
                                rating >= stars ? 'text-amber-500' : 'text-slate-300'
                              }`}
                            >
                              <Star className="w-4.5 h-4.5 fill-current" />
                            </button>
                          ))}
                          <span className="text-xs font-bold text-slate-550 pl-2">
                            {rating} sao
                          </span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-655 mb-1.5" htmlFor="rev-text">
                        Nội dung phản hồi dịch vụ *
                      </label>
                      <textarea
                        required
                        id="rev-text"
                        rows={3}
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        placeholder="Hãy gửi gắm cảm nhận và nụ cười hài lòng khi được Lumi Pet phục vụ bé ba mẹ nhé..."
                        className="w-full px-4 py-2.5 rounded-xl border border-orange-100 bg-white text-xs text-slate-705 focus:outline-none focus:ring-2 focus:ring-amber-400"
                      />
                    </div>

                    <button
                      type="submit"
                      id="submit-review-draft"
                      className="w-full py-3 bg-amber-500 hover:bg-amber-600 text-white text-xs font-black rounded-xl shadow-xs transition-colors cursor-pointer"
                    >
                      ĐĂNG BẢN ĐÁNH GIÁ NGAY
                    </button>
                  </form>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Masonry-like Feedbacks Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {reviewsList.map((review) => (
            <div
              key={review.id}
              className="p-6 bg-slate-50/50 border border-slate-100 rounded-3xl space-y-4 shadow-xs relative"
            >
              <div className="flex items-start justify-between">
                
                {/* Author Info */}
                <div className="flex items-center space-x-3.5">
                  <img
                    src={review.avatar}
                    alt={review.author}
                    referrerPolicy="no-referrer"
                    className="w-10 h-10 rounded-full object-cover border border-orange-100 shadow-inner"
                  />
                  <div>
                    <h4 className="text-sm font-bold text-slate-800">{review.author}</h4>
                    <span className="block text-[11px] text-slate-500">
                      Bố mẹ bé <span className="font-bold text-slate-700">{review.petName}</span> ({review.petBreed})
                    </span>
                  </div>
                </div>

                {/* Star rating info */}
                <div className="flex items-center space-x-1">
                  <div className="flex text-amber-500">
                    {[...Array(5)].map((_, i) => (
                      <Star 
                        key={i} 
                        className={`w-3.5 h-3.5 ${
                          i < Math.floor(review.rating) 
                            ? 'fill-amber-500 text-amber-500' 
                            : 'text-slate-300'
                        }`} 
                      />
                    ))}
                  </div>
                  <span className="text-[11px] font-bold text-slate-500 pl-1">{review.rating}</span>
                </div>

              </div>

              {/* Review Text Body */}
              <p className="text-slate-600 text-sm leading-relaxed italic">
                "{review.text}"
              </p>

              {/* Service Tag Bottom */}
              <div className="flex items-center justify-between pt-1 border-t border-orange-50/50 text-[11px] text-slate-450 font-semibold">
                <span className="flex items-center space-x-1">
                  <Smile className="w-3.5 h-3.5 text-amber-550" />
                  <span>Dịch vụ đã dùng: <span className="text-amber-600 font-bold">{review.serviceType}</span></span>
                </span>
                <span>Ngày đăng: {review.date}</span>
              </div>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
