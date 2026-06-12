/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ShoppingCart, CalendarDays, Menu, X, Phone } from 'lucide-react';
import LumiPetLogo from './LumiPetLogo';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  cartCount: number;
  onOpenCart: () => void;
  onTriggerBooking: () => void;
}

export default function Navbar({
  activeTab,
  setActiveTab,
  cartCount,
  onOpenCart,
  onTriggerBooking,
}: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { id: 'home', label: 'Trang Chủ' },
    { id: 'pricing', label: 'Bảng Giá Dịch Vụ' },
    { id: 'spa', label: 'Spa Thú Cưng' },
    { id: 'hotel', label: 'Hotel Thú Cưng' },
    { id: 'shop', label: 'Pet Shop' },
    { id: 'faq', label: 'Hỏi Đáp / FAQ' },
    { id: 'admin', label: '👑 Chủ Cửa Hàng' },
  ];

  const handleNavClick = (tabId: string) => {
    setActiveTab(tabId);
    setIsOpen(false);
    // Smooth scroll to top when changing tab
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-md border-b border-orange-100 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo */}
          <div 
            className="flex items-center cursor-pointer group"
            onClick={() => handleNavClick('home')}
          >
            <LumiPetLogo size="md" className="transition-transform group-hover:scale-102" />
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex xl:space-x-2 lg:space-x-1 space-x-0.5">
            {navItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  id={`nav-tab-${item.id}`}
                  onClick={() => handleNavClick(item.id)}
                  className={`relative xl:px-4 lg:px-2.5 px-2 py-2 rounded-xl text-xs lg:text-[14px] xl:text-[15px] font-bold transition-all duration-300 whitespace-nowrap ${
                    isActive 
                      ? 'text-orange-500' 
                      : 'text-gray-600 hover:text-orange-400 hover:bg-orange-50/50'
                  }`}
                >
                  {item.label}
                  {isActive && (
                    <motion.div
                      layoutId="activeIndicator"
                      className="absolute bottom-0 left-2.5 right-2.5 h-[3px] bg-orange-500 rounded-full"
                      transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                    />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Action Area */}
          <div className="hidden lg:flex items-center xl:space-x-4 lg:space-x-2.5 space-x-2">
            {/* Quick Contact */}
            <a 
              href="tel:0989979675" 
              className="flex items-center space-x-1.5 px-2.5 py-1.5 rounded-lg border border-orange-100 hover:border-orange-200 text-gray-600 hover:text-orange-500 text-xs xl:text-sm font-bold transition-colors cursor-pointer whitespace-nowrap"
            >
              <Phone className="w-3.5 h-3.5 text-orange-500 flex-shrink-0" />
              <span className="whitespace-nowrap">0989 979 675</span>
            </a>

            {/* Cart Icon */}
            <button
              id="navbar-cart-btn"
              onClick={onOpenCart}
              className="relative p-2 text-gray-600 hover:text-orange-500 hover:bg-orange-50 rounded-xl transition-all group flex-shrink-0"
              aria-label="Shopping Cart"
            >
              <ShoppingCart className="w-5.5 h-5.5 transition-transform group-hover:scale-105" />
              {cartCount > 0 && (
                <motion.span 
                  initial={{ scale: 0.6 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-1 -right-1 flex h-4.5 w-4.5 items-center justify-center rounded-full bg-rose-500 text-[9px] font-bold text-white shadow-sm ring-2 ring-white"
                >
                  {cartCount}
                </motion.span>
              )}
            </button>

            {/* Quick Reservation Button */}
            <button
              id="navbar-booking-btn"
              onClick={onTriggerBooking}
              className="flex items-center space-x-1.5 bg-teal-550 hover:bg-teal-600 text-white font-bold lg:px-4 xl:px-6 py-2.5 rounded-full shadow-md hover:shadow-lg transition-all cursor-pointer text-xs xl:text-sm whitespace-nowrap"
            >
              <CalendarDays className="w-4 h-4 flex-shrink-0" />
              <span className="whitespace-nowrap">Đặt Lịch Ngay</span>
            </button>
          </div>

          {/* Tablet & Mobile Action Icons (Only Cart and Menubar) */}
          <div className="flex items-center space-x-2 md:space-x-3 lg:hidden">
            {/* Cart Button */}
            <button
              id="navbar-cart-mobile-btn"
              onClick={onOpenCart}
              className="relative p-2.5 text-gray-650 hover:text-orange-500 hover:bg-orange-100/50 rounded-xl transition-all"
            >
              <ShoppingCart className="w-5.5 h-5.5" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-4.5 w-4.5 items-center justify-center rounded-full bg-rose-500 text-[9px] font-bold text-white ring-2 ring-white">
                  {cartCount}
                </span>
              )}
            </button>

            {/* Mobile Book Shortcut for Tablet/Mobile */}
            <button
              id="navbar-booking-mobile-btn"
              onClick={onTriggerBooking}
              className="sm:flex hidden items-center space-x-1 px-4 py-2 bg-teal-550 hover:bg-teal-600 text-white text-xs font-bold rounded-xl shadow-xs cursor-pointer whitespace-nowrap"
            >
              <CalendarDays className="w-3.5 h-3.5" />
              <span className="whitespace-nowrap">Đặt Lịch</span>
            </button>

            {/* Mobile Toggle Hamburger Menu */}
            <button
              id="navbar-toggle-btn"
              onClick={() => setIsOpen(!isOpen)}
              className="p-2.5 text-gray-700 hover:text-orange-500 hover:bg-orange-50 rounded-xl transition-colors"
              aria-label="Toggle Menu"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Slide down Mobile Navigation Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden border-t border-orange-50 bg-white overflow-hidden shadow-inner"
          >
            <div className="px-4 py-4 space-y-1">
              {navItems.map((item) => {
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    id={`mobile-nav-tab-${item.id}`}
                    onClick={() => handleNavClick(item.id)}
                    className={`block w-full text-left px-4 py-3 rounded-xl text-base font-semibold transition-all ${
                      isActive
                        ? 'bg-amber-50/80 text-amber-600 border-l-4 border-amber-500 pl-3'
                        : 'text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    {item.label}
                  </button>
                );
              })}

              <div className="pt-4 pb-2 border-t border-slate-100 flex flex-col space-y-3 px-4">
                <a 
                  href="tel:0989979675" 
                  className="flex items-center space-x-2 text-slate-600 hover:text-amber-600 text-sm font-medium"
                >
                  <Phone className="w-4 h-4 text-amber-500" />
                  <span>Tổng đài hỗ trợ: 0989 979 675</span>
                </a>
                
                <button
                  id="mobile-nav-booking-btn"
                  onClick={() => {
                    onTriggerBooking();
                    setIsOpen(false);
                  }}
                  className="w-full flex items-center justify-center space-x-2 bg-gradient-to-r from-amber-500 to-orange-600 text-white font-semibold py-3 px-4 rounded-xl shadow-md cursor-pointer text-sm"
                >
                  <CalendarDays className="w-4 h-4" />
                  <span>ĐẶT LỊCH SPA / HOTEL NGAY</span>
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
