import { useEffect, useMemo, useRef, useState } from "react";
import { Navigation, Thumbs } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import PhotoSwipeLightbox from "photoswipe/lightbox";
import Drift from "drift-zoom";

const FALLBACK = [
  "/images/store/p1.jpg",
  "/images/store/p1b.jpg",
  "/images/store/p2.jpg",
  "/images/store/p2b.jpg",
  "/images/store/p3.jpg",
  "/images/store/p3b.jpg",
];

export default function Slider1({ images }) {
  const [swiperThumb, setSwiperThumb] = useState(null);
  const lightboxRef = useRef(null);

  const slides = useMemo(() => {
    const srcs =
      images?.filter(Boolean)?.length > 0 ? [...images] : [...FALLBACK];
    while (srcs.length < 6) {
      srcs.push(srcs[srcs.length - 1]);
    }
    return srcs.slice(0, 6).map((src) => ({ src, color: "gray" }));
  }, [images]);

  useEffect(() => {
    const lightbox = new PhotoSwipeLightbox({
      gallery: "#gallery-swiper-started",
      children: ".item",
      pswpModule: () => import("photoswipe"),
    });

    lightbox.init();
    lightboxRef.current = lightbox;

    return () => {
      lightbox.destroy();
    };
  }, []);

  useEffect(() => {
    const checkWindowSize = () => window.innerWidth >= 1200;
    if (!checkWindowSize()) return;

    const imageZoom = () => {
      const driftAll = document.querySelectorAll(".tf-image-zoom");
      const pane = document.querySelector(".tf-zoom-main");

      driftAll.forEach((el) => {
        new Drift(el, {
          zoomFactor: 2,
          paneContainer: pane,
          inlinePane: false,
          handleTouch: false,
          hoverBoundingBox: true,
          containInline: true,
        });
      });
    };
    imageZoom();
    const zoomElements = document.querySelectorAll(".tf-image-zoom");

    const handleMouseOver = (event) => {
      const parent = event.target.closest(".section-image-zoom");
      if (parent) {
        parent.classList.add("zoom-active");
      }
    };

    const handleMouseLeave = (event) => {
      const parent = event.target.closest(".section-image-zoom");
      if (parent) {
        parent.classList.remove("zoom-active");
      }
    };

    zoomElements.forEach((element) => {
      element.addEventListener("mouseover", handleMouseOver);
      element.addEventListener("mouseleave", handleMouseLeave);
    });

    return () => {
      zoomElements.forEach((element) => {
        element.removeEventListener("mouseover", handleMouseOver);
        element.removeEventListener("mouseleave", handleMouseLeave);
      });
    };
  }, [slides]);

  return (
    <>
      <Swiper
        className="swiper tf-product-media-main"
        id="gallery-swiper-started"
        thumbs={{ swiper: swiperThumb }}
        modules={[Thumbs]}
        key={slides[0]?.src}
      >
        {slides.map((item, i) => (
          <SwiperSlide className="swiper-slide" data-color="gray" key={i}>
            <a
              href={item.src}
              target="_blank"
              className="item"
              rel="noreferrer"
              data-pswp-width="600px"
              data-pswp-height="800px"
            >
              <img
                className="tf-image-zoom lazyload"
                src={item.src}
                data-zoom={item.src}
                alt=""
                width={652}
                height={652}
              />
            </a>
          </SwiperSlide>
        ))}
      </Swiper>
      <div className="container-swiper">
        <Swiper
          className="swiper tf-product-media-thumbs other-image-zoom"
          modules={[Navigation, Thumbs]}
          onSwiper={setSwiperThumb}
          key={`thumbs-${slides[0]?.src}`}
          {...{
            spaceBetween: 10,
            slidesPerView: "auto",
            freeMode: true,
            watchSlidesProgress: true,
            observer: true,
            observeParents: true,
            direction: "horizontal",
            navigation: {
              nextEl: ".thumbs-next",
              prevEl: ".thumbs-prev",
            },

            breakpoints: {
              0: {
                direction: "horizontal",
              },
              1200: {
                direction: "horizontal",
              },
            },
          }}
        >
          {slides.map((item, index) => (
            <SwiperSlide
              key={index}
              className="swiper-slide stagger-item"
              data-color={item.color}
            >
              <div className="item">
                <img
                  className="lazyload"
                  data-src={item.src}
                  alt=""
                  src={item.src}
                  width={652}
                  height={652}
                />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </>
  );
}
