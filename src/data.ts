/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Product, SpaService, HotelRoom, Review } from './types';

export const SPA_SERVICES: SpaService[] = [
  {
    id: 'spa-tam-say',
    name: 'Combo Tắm Vệ Sinh 10 Bước Chuyên Sâu',
    description: 'Quy trình vệ sinh sạch bách từ bảo mẫu chăm sóc bao gồm chải lông tơ, nhổ lông tai sạch sẽ, cắt mài móng bo tròn, vắt tuyến hôi phòng ngừa ẩm viêm, tắm dưỡng x2 lần, sấy tơi bồng rực rỡ và dưỡng serum mượt lông.',
    duration: '45 - 60 phút',
    price: 120000,
    benefits: [
      'Khử sạch hoàn toàn mùi hôi bằng dầu gội trị thảo dược',
      'Vắt tuyến hôi ngăn ngừa viêm nhiễm tuyến bã quanh hậu môn',
      'Cắt mài móng điện bo tròn, không sợ sệt tránh cào xước da',
      'Vệ sinh lấy sạch bẩn tai chuyên sâu bằng nước muối sinh lý',
      'Sấy tơi xốp lông bằng hệ thống sấy khí ion ấm bảo vệ da'
    ],
    iconName: 'Sparkles'
  },
  {
    id: 'spa-cacao',
    name: 'Combo Tắm Cạo Lông Sạch Sẽ Mát Mẻ',
    description: 'Combo làm sạch sâu 10 bước tích hợp đi tông đơ cao cấp cạo tỉa phom gọn gàng mát mẻ cho những ngày hè nắng nóng, hỗ trợ đặc trị nấm rận da.',
    duration: '60 - 90 phút',
    price: 180000,
    benefits: [
      'Gồm trọn quy trình tắm dưỡng sấy cơ bản của gói tắm vệ sinh',
      'Cạo lông gọn gàng sướng thân nhiệt, dễ bảo bọc bôi thuốc nấm',
      'Ủ dưỡng chất chống rụng xơ xù lông sau khi cạo tông đơ',
      'Hói ẩm biểu bì da nhạy cảm không gãi ngứa nổi mẩn đỏ',
      'Tặng kèm nơ thắt ruy bằng đính chuông cổ rủng rỉnh cực bắt tai'
    ],
    iconName: 'Scissors'
  },
  {
    id: 'spa-grooming',
    name: 'Combo Tắm Cắt Tạo Kiểu Nghệ Thuật (Grooming)',
    description: 'Trải nghiệm đỉnh cao sắc đẹp thẩm mỹ đẳng cấp 5 sao. Thiết kế kiểu dáng lông theo phom giống loài chó (phom tròn bầu mây Poodle, tỉa bo cạnh gấu Shitzu, Pom phao ly, cún nhỏ).',
    duration: '90 - 120 phút',
    price: 260000,
    benefits: [
      'Cắt tỉa tạo hình nắn nót bởi chuyên gia Groomer giàu kinh nghiệm chuyên môn',
      'Nhẹ bẫng lông tơ, tỉa gọn bớt xơ rối mà vẫn giữ được độ phồng dày xinh xắn',
      'Nhận tư vấn mẫu phom hợp mắt nhất với cấu tạo gương mặt và tai móng bé',
      'Phục hồi keratin chuyên sâu khóa ẩm dẻo dai từng sợi lông phồng bồng bềnh',
      'Tặng chuông đồng đeo cổ Lumi Pet cao cấp'
    ],
    iconName: 'Sparkles'
  }
];

export const HOTEL_ROOMS: HotelRoom[] = [
  {
    id: 'hotel-standard',
    name: 'Phòng Cozy Standard',
    description: 'Phòng kính cường lực ấm áp, sạch sẽ tuyệt đối với hệ thống thông khí tuần hoàn 2 chiều. Thích hợp cho các bé cỡ nhỏ đến trung bình thích sự riêng tư yên tĩnh.',
    pricePerNight: 120000,
    capacity: 'Chó/Mèo dưới 8kg',
    amenities: [
      'Đệm bông ép 3D kháng khuẩn êm ái',
      'Chế độ ăn 2 bữa chính (Hạt cao cấp + Súp thưởng)',
      'Hệ thống điều hòa lọc không khí duy trì 26°C ổn định',
      'Camera an ninh giám sát chung 24/7',
      'Vui chơi tự do tại sảnh chung 30 phút/ngày'
    ],
    image: 'https://images.unsplash.com/photo-1541599540903-216a46ca1bf0?w=600&auto=format&fit=crop&q=80',
    rating: 4.8
  },
  {
    id: 'hotel-deluxe',
    name: 'Phòng Deluxe Oasis',
    description: 'Không gian rộng gấp đôi phòng Standard với ban công ngắm cảnh sảnh chung. Có hệ thống đồ chơi cào móng độc lập cho mèo hoặc gối ôm riêng biệt cho chó.',
    pricePerNight: 220000,
    capacity: 'Chó dưới 15kg hoặc 2 Mèo cùng nhà',
    amenities: [
      'Đệm nằm memory foam ôm cơ thể',
      'Bát ăn sứ vệ sinh dễ lau chùi sạch',
      'Camera cá nhân riêng biệt (Gửi link xem Live cho chủ 24/24)',
      'Thực đơn tùy chọn: Hạt Royal Canin, pate tươi hoặc ức gà hấp xé',
      'Sân chơi tương tác cùng bảo mẫu 60 phút/ngày',
      'Tặng combo tắm sấy miễn phí cho kỳ lưu trú trên 5 ngày'
    ],
    image: 'https://images.unsplash.com/photo-1548767797-d8c844163c4c?w=600&auto=format&fit=crop&q=80',
    rating: 4.9
  },
  {
    id: 'hotel-penthouse',
    name: 'Căn Hộ Penthouse Hoàng Gia',
    description: 'Biệt thự sang trọng độc lập cao cấp hàng đầu. Khung cảnh cửa sổ lớn ngập nắng ngoài trời, sở hữu máy lọc nước tự động, tháp leo trèo hoặc đệm lười nhung thượng hạng.',
    pricePerNight: 450000,
    capacity: 'Phù hợp mọi kích cỡ thú cưng (Tối đa 4 mèo hoặc 2 chó lớn)',
    amenities: [
      'Phòng siêu rộng biệt lập hoàn toàn không tiếng ồn',
      'Hệ thống nước chảy thác tuần hoàn lọc 4 lớp',
      'Báo cáo sức khỏe, đo nhiệt độ & nhịp tim mỗi sáng',
      'Bữa ăn thiết kế riêng chuẩn dinh dưỡng (Bò Beefsteak thái sợi, cá hồi áp chảo)',
      'Live webcam HD 1080p hỗ trợ đàm thoại 2 chiều với pet',
      'Trải nghiệm hồ bơi cạn hoặc leo tháp không giới hạn',
      'Dịch vụ đưa đón tận nhà miễn phí trong bán kính 10km'
    ],
    image: 'https://images.unsplash.com/photo-1516734212186-a967f81ad0d7?w=600&auto=format&fit=crop&q=80',
    rating: 5.0
  }
];

export const SHOP_PRODUCTS: Product[] = [
  // Thức ăn (food)
  {
    id: 'prod-rc-adult',
    name: 'Thức Ăn Hạt Royal Canin Fit32 Cho Mèo Trưởng Thành',
    price: 185000,
    originalPrice: 210000,
    rating: 4.9,
    reviewsCount: 164,
    category: 'food',
    image: 'https://images.unsplash.com/photo-1589924691995-400dc9ecc119?w=400&auto=format&fit=crop&q=80',
    description: 'Hạt dinh dưỡng cân bằng tối ưu cho mèo trưởng thành từ 1-10 tuổi, hỗ trợ tiêu hóa tốt, giảm tình trạng búi lông dạ dày hiệu quả và duy trì vóc dáng săn chắc.',
    isAvailable: true,
    breedTarget: 'Mèo mọi giống',
    weightTarget: 'Gói 1kg - 2kg'
  },
  {
    id: 'prod-pate-whiskas',
    name: 'Pate Whiskas Vị Cá Thu & Cá Ngừ Hộp Thượng Hạng',
    price: 32000,
    originalPrice: 38000,
    rating: 4.7,
    reviewsCount: 312,
    category: 'food',
    image: 'https://images.unsplash.com/photo-1535268647977-a403b69fc756?w=400&auto=format&fit=crop&q=80',
    description: 'Pate dạng thạch sánh mịn chứa nhiều DHA, Omega-3 và vitamin thiết yếu tốt cho thị lực, hệ tim mạch và tạo vẻ bóng mượt vượt trội cho bộ lông xù của bé.',
    isAvailable: true,
    breedTarget: 'Mèo từ 1 tuổi',
    weightTarget: 'Hộp 400g'
  },
  {
    id: 'prod-smartheart-gold',
    name: 'Hạt Cao Cấp SmartHeart Gold Cho Chó Nhỏ',
    price: 240000,
    originalPrice: 280000,
    rating: 4.8,
    reviewsCount: 95,
    category: 'food',
    image: 'https://images.unsplash.com/photo-1568640347023-a61bd950be45?w=400&auto=format&fit=crop&q=80',
    description: 'Công thức độc quyền từ cừu và gạo lứt ít gây dị ứng cho da nhạy cảm. Giàu Prebiotics tự nhiên củng cố hệ tiêu hóa của chó con và chó giống có trọng lượng nhỏ.',
    isAvailable: true,
    breedTarget: 'Chó cỡ nhỏ (Poodle, Pomeranian...)',
    weightTarget: 'Bao 1.5kg'
  },
  
  // Đồ chơi (toy)
  {
    id: 'prod-can-cau-long-ga',
    name: 'Cần Câu Đồ Chơi Lông Gà Gắn Chuông Cho Mèo',
    price: 19000,
    rating: 4.6,
    reviewsCount: 520,
    category: 'toy',
    image: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=400&auto=format&fit=crop&q=80',
    description: 'Cán nhựa dẻo đàn hồi cao cấp kết hợp sợi lông gà nhuộm hữu cơ màu sắc bắt mắt và quả chuông mini kích thích bản năng săn mồi, vận động liên tục của mèo yêu.',
    isAvailable: true,
    breedTarget: 'Mèo mọi lứa tuổi',
    weightTarget: 'Dài 50cm'
  },
  {
    id: 'prod-xuong-gam-canxi',
    name: 'Đồ Chơi Xương Gặm Cao Su Giảm Ngứa Răng Cho Chó',
    price: 45000,
    originalPrice: 55000,
    rating: 4.8,
    reviewsCount: 204,
    category: 'toy',
    image: 'https://images.unsplash.com/photo-1576201836106-db1758fd1c97?w=400&auto=format&fit=crop&q=80',
    description: 'Chất liệu cao su tự nhiên siêu bền, an toàn tuyệt đối khi vô tình mài nhai nuốt nhỏ. Gai xoa bóp nướu giúp loại bỏ cao răng, giảm thói quen cắn phá đồ gỗ trong phòng của cún.',
    isAvailable: true,
    breedTarget: 'Chó cỡ nhỏ & trung bình',
    weightTarget: '12cm - Chống cắn'
  },
  {
    id: 'prod-chuot-giat-day',
    name: 'Đồ Chơi Chuột Lông Nhại Giật Dây Cót Chạy Tự Động',
    price: 25000,
    rating: 4.5,
    reviewsCount: 88,
    category: 'toy',
    image: 'https://images.unsplash.com/photo-1472491235688-bdc81a63246e?w=400&auto=format&fit=crop&q=80',
    description: 'Chuột nhắt kích thước nhỏ chạy bằng dây cót cơ học, không cần pin. Cực kỳ an toàn, di chuyển nhanh thu hút sự tập trung rèn luyện phản xạ chạy nhảy cho boss.',
    isAvailable: true,
    breedTarget: 'Mèo con & mèo lớn',
    weightTarget: 'Phổ thông'
  },

  // Phụ kiện (accessory)
  {
    id: 'prod-vong-co-bell',
    name: 'Vòng Cổ Chuông Hoạt Hình Cute Cho Thú Cưng',
    price: 35000,
    rating: 4.9,
    reviewsCount: 412,
    category: 'accessory',
    image: 'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=400&auto=format&fit=crop&q=80',
    description: 'Vòng cổ thời trang thêu hoạ tiết sắc nét kết hợp chuông đồng rủng rỉnh giúp ba mẹ dễ dàng định vị cún mèo cưng quanh phòng.',
    isAvailable: true,
    breedTarget: 'Mèo con, Chó nhỏ',
    weightTarget: 'Chu vi cổ 15-32cm'
  },
  {
    id: 'prod-day-dat-yem',
    name: 'Yếm Dây Dắt Đi Dạo Bản Lớn Êm Ái Cho Cún',
    price: 85000,
    rating: 4.8,
    reviewsCount: 180,
    category: 'accessory',
    image: 'https://images.unsplash.com/photo-1534361960057-19889db9621e?w=400&auto=format&fit=crop&q=80',
    description: 'Thiết kế chữ H lực phân bổ đều ngực trước không siết mỏi cổ họng cún cưng khi chạy kéo. Vải lưới tổ ong lót đệm siêu thoáng mát, kèm dải phản quang an toàn khi đi dạo vào ban đêm.',
    isAvailable: true,
    breedTarget: 'Chó Pug, Poodle, Phốc...',
    weightTarget: 'Ngực 35-50cm'
  },
  {
    id: 'prod-shampoo-luxury',
    name: 'Sữa Tắm Keratin SOS Trắng Sáng Dưỡng Lông Hư Tổn',
    price: 195000,
    originalPrice: 220000,
    rating: 5.0,
    reviewsCount: 78,
    category: 'grooming',
    image: 'https://images.unsplash.com/photo-1516734212186-a967f81ad0d7?w=400&auto=format&fit=crop&q=80',
    description: 'Dầu gội xả chuyên sủi bọt cao cấp chiết xuất từ hoa trà hoang dã. Làm sạch sâu lớp bụi bẩn gốc biểu bì da, giữ hương thơm mát kéo dài đến 7 ngày, phục hồi sắc tố lông sáng bóng tự nhiên.',
    isAvailable: true,
    breedTarget: 'Chó mèo lông sáng/ trắng',
    weightTarget: 'Chai 500ml'
  },
  {
    id: 'prod-luoc-mat-quy',
    name: 'Lược Chải Lông Rối Tự Động Đẩy Lông Rụng Bấm Nút',
    price: 65000,
    rating: 4.7,
    reviewsCount: 345,
    category: 'grooming',
    image: 'https://images.unsplash.com/photo-1516734212186-a967f81ad0d7?w=400&auto=format&fit=crop&q=80',
    description: 'Đầu kim thép không gỉ bọc nhựa tròn mài mịn không gây trầy xước đau rát da. Nút bấm sụt tự đẩy cả vầng lông rụng quấn bám ra ngoài cực kỳ sạch sẽ và nhanh gọn chỉ sau 1 giây click.',
    isAvailable: true,
    breedTarget: 'Chó lông dài & mèo rụng lông nhiều',
    weightTarget: 'Bản to tròn'
  }
];

export const CLIENT_REVIEWS: Review[] = [
  {
    id: 'rev-1',
    author: 'Khánh Linh',
    petName: 'Mochi',
    petBreed: 'Mèo Anh Lông Ngắn',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
    rating: 5,
    text: 'Bé Mochi nhà mình cực kỳ nhát, đem đi các tiệm khác là gầm gừ cào cấu. Nhưng mang tới Lumi Pet trải nghiệm combo spa cắt tỉa thì bé ngoan vô cùng. Các cô bảo mẫu nâng niu, cắt tỉa nhẹ nhàng, tắm xong lông thơm suốt cả tuần liền!',
    serviceType: 'Spa',
    date: '10/06/2026'
  },
  {
    id: 'rev-2',
    author: 'Anh Tuấn',
    petName: 'Rocky',
    petBreed: 'Poodle',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80',
    rating: 5,
    text: 'Kỳ nghỉ mát mát 1 tuần của gia đình không thể mang Rocky theo. Mình gửi phòng Deluxe ở Hotel 24/7 của Lumi Pet. Mỗi tối đều được gửi link xem camera riêng hoạt động 24h, Rocky ăn uống rất tốt, được dạo chơi liên tục, lúc đón về còn mập mạp và sạch sẽ!',
    serviceType: 'Hotel',
    date: '02/06/2026'
  },
  {
    id: 'rev-3',
    author: 'Minh Hằng',
    petName: 'SuKem',
    petBreed: 'Corgi',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80',
    rating: 5,
    text: 'Sản phẩm giao cực kỳ nhanh, đóng hàng hộp carton chỉn chu và được tặng thêm bánh thưởng nhỏ. Thức ăn hạt Royal Canin chính hãng date mới tinh, bé SuKem nhà mình ăn thòm thèm lắm. Sẽ ủng hộ shop lâu dài ạ.',
    serviceType: 'Shop',
    date: '28/05/2026'
  },
  {
    id: 'rev-4',
    author: 'Quốc Bảo',
    petName: 'Lu',
    petBreed: 'Golden Retriever',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80',
    rating: 4.8,
    text: 'Gửi bé Golden Lu ở đây phòng Penthouse Hoàng Gia xứng đáng từng đồng tiền bát gạo. Có máy lọc nước chảy róc rách, đồ ăn xịn sò có cả bò hầm và được live chat gọi điện nói chuyện với bé đỡ nhớ. Đội ngũ bảo mẫu chăm sóc nhiệt tình vô cùng!',
    serviceType: 'Hotel',
    date: '18/05/2026'
  }
];

export const FAQS = [
  {
    q: 'Thời gian lý tưởng để em sấy tắm và cắt tỉa lông định kỳ cho pet là bao lâu?',
    a: 'Đối với các bé cún lông dài hoặc có phom lông tạo kiểu (Poodle, Pomeranian, Maltese...), thời gian tắm vệ sinh lý tưởng là 1 lần/tuần và cắt tỉa sấy phồng định hình từ 4 - 6 tuần/lần. Đối với mèo, do mèo biết tự chải liếm sạch lông nên chu kỳ thích hợp là tắm 1 tháng/lần.'
  },
  {
    q: 'Khi gửi pet ở khách sạn Hotel thú cưng, tôi cần lưu ý chuẩn bị những giấy tờ, đồ dùng gì?',
    a: 'Để đảm bảo sức khỏe an toàn chung, Lumi Pet yêu cầu các bé đã được chích ngừa đầy đủ tối thiểu 2 mũi vắc-xin và tẩy giun định kỳ. Thú cưng không mang mầm bệnh truyền nhiễm hay ve rận rệp. Bạn có thể mang kèm chén ăn yêu thích, đồ chơi có mùi nhà quen thuộc giúp pet nhanh chóng thích nghi phòng mới.'
  },
  {
    q: 'Bé mèo của tôi cực kỳ khó tính và kén đồ ăn, khách sạn có đổi thực đơn linh hoạt được không?',
    a: 'Hoàn toàn được! Lumi Pet có kho thực phẩm ẩm thực phong phú từ pate nắp hồng, hạt hữu cơ Hàn Quốc tới súp bento nóng hổi tự làm tại bếp khách sạn. Quý khách chỉ cần thông báo thói quen ăn uống của bé khi hoàn tất thủ tục check-in tại quầy nhận phòng.'
  },
  {
    q: 'Quy trình khử khuẩn và đặt lịch vệ sinh phòng khách sạn thế nào?',
    a: 'Mỗi căn cabin phòng ngủ của bé đều được hút bụi kẽ kính, lau dung dịch khử trùng chuyên dụng hữu cơ của Mỹ (Anios/Virkon) tuyệt đối thân thiện màng hô hấp ngay sau khi trả phòng. Hàng ngày phòng luôn được sục sấy khử ozone diệt trùng 15 phút luân phiên buổi sáng dọn giường.'
  }
];
