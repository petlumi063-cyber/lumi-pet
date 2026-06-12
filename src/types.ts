/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  rating: number;
  reviewsCount: number;
  category: 'food' | 'toy' | 'accessory' | 'grooming';
  image: string;
  description: string;
  isAvailable: boolean;
  breedTarget?: string; // e.g. "Chó mèo mọi lứa tuổi"
  weightTarget?: string; // e.g. "Dưới 10kg"
}

export interface SpaService {
  id: string;
  name: string;
  description: string;
  duration: string; // e.g. "45 - 60 phút"
  price: number; // Base price
  benefits: string[];
  iconName: string; // Lucide icon reference
}

export interface HotelRoom {
  id: string;
  name: string;
  description: string;
  pricePerNight: number;
  capacity: string; // e.g. "Mèo hoặc Chó < 8kg"
  amenities: string[];
  image: string;
  rating: number;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Booking {
  id: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  petName: string;
  petType: 'dog' | 'cat';
  petWeight: number; // weight in kg
  bookingType: 'spa' | 'hotel';
  serviceType: string; // service / room name
  serviceId: string; // service / room ID
  date?: string; // for spa
  timeSlot?: string; // for spa
  checkInDate?: string; // for hotel
  checkOutDate?: string; // for hotel
  notes?: string;
  totalPrice: number;
  status: 'pending' | 'confirmed' | 'cancelled';
  createdAt: string;
}

export interface Review {
  id: string;
  author: string;
  petName: string;
  petBreed: string;
  avatar: string;
  rating: number;
  text: string;
  serviceType: 'Shop' | 'Spa' | 'Hotel';
  date: string;
}
