"use client"
import Slider from "react-slick"
import Image from "next/image"
import "slick-carousel/slick/slick.css"
import "slick-carousel/slick/slick-theme.css"

const Carousel = () => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 200,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    arrows: true
  }

  const slides = [
    {
      id: 1,
      title: "วัดพระธาตุพนมวรมหาวิหาร",
      subtitle: "Phra That Phanom",
      description:
        "วัดพระธาตุพนมวรมหาวิหาร เป็นสถานที่ศักดิ์สิทธิ์ที่สำคัญที่สุดในจังหวัดนครพนม ตั้งอยู่ในอำเภอธาตุพนม เป็นพระธาตุเก่าแก่ที่สุดแห่งหนึ่งในประเทศไทย และเป็นที่สักการะของชาวพุทธทั่วประเทศ เพื่อขอพรและเป็นสิริมงคลในการเริ่มต้นชีวิตใหม่",
      imageUrl: "https://mpics.mgronline.com/pics/Images/565000010299801.JPEG"
    },
    {
      id: 2,
      title: "พระธาตุเรณูนคร",
      subtitle: "Phra That Renu Nakhon",
      description:
        "พระธาตุเรณูนคร เป็นอีกหนึ่งสถานที่สำคัญของจังหวัดนครพนม ที่ตั้งอยู่ในอำเภอเรณูนคร มีลักษณะเป็นเจดีย์องค์เล็กที่สร้างขึ้นตามแบบจำลองของพระธาตุพนม เหมาะสำหรับการมาสักการะเพื่อขอพรให้มีความเจริญรุ่งเรืองในชีวิต",
      imageUrl:
        "https://www.prachachat.net/wp-content/uploads/2021/03/%E0%B8%99%E0%B8%84%E0%B8%A3%E0%B8%9E%E0%B8%99%E0%B8%A1.jpg"
    },
    {
      id: 3,
      title: "สะพานมิตรภาพไทย-ลาว แห่งที่ 3",
      subtitle: "Third Thai-Lao Friendship Bridge",
      description:
        "สะพานมิตรภาพไทย-ลาว แห่งที่ 3 ที่นครพนม เป็นอีกหนึ่งจุดท่องเที่ยวที่น่าสนใจ ด้วยความงดงามของสะพานที่ทอดยาวข้ามแม่น้ำโขง เชื่อมต่อระหว่างไทยและลาว นักท่องเที่ยวสามารถมาชมวิวทิวทัศน์ที่นี่ในยามเย็นและแวะถ่ายรูปเป็นที่ระลึก",
      imageUrl:
        "https://cbtthailand.dasta.or.th/upload-file-api/Resources/RelateAttraction/Images/RAT480335/1.jpeg"
    },
    {
      id: 4,
      title: "ภูพานน้อย",
      subtitle: "Phu Phan Noi",
      description:
        "ภูพานน้อย เป็นแหล่งท่องเที่ยวทางธรรมชาติที่สวยงามในจังหวัดนครพนม เหมาะสำหรับการเดินป่าและการชมวิวทิวทัศน์ที่สวยงามของภูเขาและแม่น้ำโขง เป็นจุดที่นักท่องเที่ยวนิยมมาพักผ่อนและสัมผัสกับธรรมชาติ",
      imageUrl: "https://www.matichon.co.th/wp-content/uploads/2019/01/6-11.jpg"
    },
    {
      id: 5,
      title: "วัดนักบุญอันนา หนองแสง",
      subtitle: "Saint Anna Nong Saeng Church",
      description:
        "วัดนักบุญอันนา หนองแสง เป็นโบสถ์คริสต์ที่เก่าแก่และงดงาม ตั้งอยู่ริมแม่น้ำโขงในเมืองนครพนม โบสถ์นี้มีสถาปัตยกรรมที่สวยงามและเป็นสถานที่ที่สำคัญสำหรับชาวคริสต์ในพื้นที่",
      imageUrl: "https://mpics.mgronline.com/pics/Images/566000005562105.JPEG"
    }
  ]

  return (
    <div className="w-full">
      <Slider {...settings}>
        {slides.map(slide => (
          <div
            key={slide.id}
            className="relative w-full h-[60vh] md:h-[70vh] lg:h-[80vh] overflow-hidden"
          >
            <Image
              src={slide.imageUrl}
              alt={slide.title}
              layout="fill"
              objectFit="cover"
              quality={100}
              className="object-cover object-center"
              priority
            />
            <div className="absolute inset-0 bg-black bg-opacity-30 flex flex-col justify-center items-start p-8 md:p-16 lg:p-24">
              <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold text-yellow-400">
                {slide.title}
              </h2>
              <h3 className="text-lg md:text-xl lg:text-2xl text-white mt-2">
                {slide.subtitle}
              </h3>
              <p className="text-md md:text-lg lg:text-xl text-white mt-4 max-w-3xl">
                {slide.description}
              </p>
            </div>
          </div>
        ))}
      </Slider>
    </div>
  )
}

export default Carousel
