"use client";

import Image from "next/image";
import clsx from "clsx";
import { Badge } from "@mui/material";

const Avatar = ({ userImg, className, h = 120, w = 120, isProvider = false, status}) => {
  const defaultAvatar = "/img/user-ava.jpg";

  // Function to determine badge color based on status
  const getBadgeColor = (status) => {
    switch(status) {
      case 1:
        return 'success';
      case 2:
        return 'error';
      default:
        return 'default';
    }
  };

  return (
    <div
      className={clsx(
        "relative",
        `w-[${w}px] h-[${h}px]`, 
        className
      )}
      style={{ width: `${w}px`, height: `${h}px` }}
    >
      {isProvider && status ? (
        <Badge
          overlap="circular"
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
          variant="dot"
          color={getBadgeColor(status)}
          sx={{ 
            '& .MuiBadge-badge': { 
              width: h > 60 ? 16 : 12, 
              height: h > 60 ? 16 : 12,
              borderRadius: '50%',
              border: '2px solid white'
            } 
          }}
        >
          <Image
            className="object-cover w-full h-full overflow-hidden rounded-full"
            height={h}
            width={w}
            alt="User Avatar"
            src={userImg || defaultAvatar}
            priority 
            draggable={false}
          />
        </Badge>
      ) : (
        <Image
          className="object-cover w-full h-full overflow-hidden rounded-full"
          height={h}
          width={w}
          alt="User Avatar"
          src={userImg || defaultAvatar}
          priority 
          draggable={false}
        />
      )}
    </div>
  );
};

export default Avatar;
