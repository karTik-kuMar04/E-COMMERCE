'use client';

import { useRef } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Mousewheel } from 'swiper/modules';
import 'swiper/css';
import ProductCard from './ProductCard';

export default function ProductCarousel({ books }) {
  const prevRef = useRef(null);
  const nextRef = useRef(null);

  return (
    <div className="relative overflow-visible">
      {/* Custom buttons */}
      <button ref={prevRef} className="custom-nav swiper-prev">
        ‹
      </button>
      <button ref={nextRef} className="custom-nav swiper-next">
        ›
      </button>

      <Swiper
        modules={[Navigation, Mousewheel]}
        spaceBetween={32}
        slidesPerView={1.3}
        mousewheel={{ forceToAxis: true }}
        breakpoints={{
          640: { slidesPerView: 2.2 },
          768: { slidesPerView: 3.2 },
          1024: { slidesPerView: 4 },
        }}
        navigation={{
          prevEl: prevRef.current,
          nextEl: nextRef.current,
        }}
        onBeforeInit={(swiper) => {
          swiper.params.navigation.prevEl = prevRef.current;
          swiper.params.navigation.nextEl = nextRef.current;
        }}
        className="overflow-hidden"
      >
        {books.map((book, index) => (
          <SwiperSlide key={book.id}>
            <ProductCard book={book} index={index} />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
