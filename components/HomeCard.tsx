import React from "react";
import Image from "next/image";
const HomeCard = () => {
  return (
    <div
      className="bg-orange-1 px-4 py-6 flex flex-col justify-between w-full xl:max-w-[270px] min-h-[260px] rounded-[14px] cursor-pointer"
      onClick={() => {}}
    >
      <div className="flex-center glassmorphism size-12 rounded-[10px]">
        <Image
          src="/icons/add-meeting.svg"
          alt="meeting"
          width={27}
          height={27}
        />
      </div>
      <div className="flex-col gap-2">
        <h1>New Meeting</h1>
        <p>Start an instant meeting</p>
      </div>
    </div>
  );
};

export default HomeCard;
