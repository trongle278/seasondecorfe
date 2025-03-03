"use client";

import { GlowingCard } from "@/app/components/ui/animated/GlowingEffect";
import Avatar from "@/app/components/ui/Avatar/Avatar";


const ProviderCard = ({id,avatar, name, onFollowClick,}) => {
  const handleClick = () => {
    console.log("clicked"); 
  }

  const Test = () => {
    console.log("clicked");
  }
  
  return (
    <>
      <GlowingCard
        id={id}  
        onClick={handleClick}
        icon={<Avatar userImg={avatar} w={72} h={72} className="cursor-pointer"/>}
        userDetails={name}
        onFollowClick={onFollowClick}
        onChatClick={()=>{console.log("clicked")}}
        className="w-full"
      />
    </>
  );
};

export default ProviderCard;
