"use client";

import { GlowingCard } from "@/app/components/ui/animated/GlowingEffect";
import Avatar from "@/app/components/ui/Avatar/Avatar";
import { useRouter } from "next/navigation";


const ProviderCard = ({id,avatar, name, onFollowClick, onChatClick, slug, href, isFollowed, isLoading}) => {
  const router = useRouter();

  const handleClick = () => {
    if (href) {
      console.log("clicked");
      router.push(href);
    }
  };

  
  return (
    <>
      <GlowingCard
        id={id}  
        onClick={handleClick}
        icon={<Avatar userImg={avatar} w={72} h={72} className="cursor-pointer"/>}
        userDetails={name}
        slug={slug}
        onFollowClick={onFollowClick}
        onChatClick={onChatClick}
        className="w-full"
        href={href}
        isFollowed={isFollowed}
        isLoading={isLoading}
      />
    </>
  );
};

export default ProviderCard;
