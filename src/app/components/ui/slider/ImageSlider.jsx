import * as React from "react";
import Image from "next/image";

const ImageSlider = () => {
  const [images, setImages] = React.useState({
    img1: "https://images.unsplash.com/photo-1623192094462-f2456bdb1544?q=80&w=2129&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    img2: "https://images.unsplash.com/photo-1614743559948-d158e36ecb4f?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTF8fGxhbXB8ZW58MHwwfDB8fHww",
    img3: "https://images.unsplash.com/photo-1585056050604-f5cd7f56902d?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    img4: "https://images.unsplash.com/photo-1485119502162-016e4409beab?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTV8fGxhbXB8ZW58MHwwfDB8fHww",
  });

  const [activeImg, setActiveImg] = React.useState(images.img1);

  return (
    <div className="flex flex-col lg:flex-col  gap-6 items-center">
      {/* Main Image */}
      <div className="w-full max-w-lg">
        <Image
          src={activeImg}
          alt="Selected Image"
          width={500}
          height={500}
          unoptimized={true}
          className="w-full h-96 object-cover rounded-xl shadow-lg"
        />
      </div>

      {/* Thumbnail Images */}
      <div className="flex flex-row gap-4 overflow-x-auto">
        {Object.values(images).map((img, index) => (
          <Image
            key={index}
            src={img}
            alt={`Thumbnail ${index + 1}`}
            width={100}
            height={100}
            unoptimized={true}
            className={`w-24 h-24 object-cover rounded-md cursor-pointer border-2 ${
              activeImg === img ? "border-primary" : "border-gray-300"
            }`}
            onClick={() => setActiveImg(img)}
          />
        ))}
      </div>
    </div>
  );
};

export default ImageSlider;
