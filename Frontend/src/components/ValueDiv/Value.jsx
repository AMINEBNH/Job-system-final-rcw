import React from "react";
import { motion } from "framer-motion";
import simple from "../../Assets/simple.jpg";
import valentines from "../../Assets/valentines.png";
import shield from "../../Assets/shield.jpg";

const Value = () => {
  const values = [
    {
      img: simple,
      title: "Simplicity",
      desc: "Things being made beautiful simple are at the heart of everything we do.",
    },
    {
      img: valentines,
      title: "Empathy",
      desc: "We believe in making things better for everyone, even if just by a little bit!",
    },
    {
      img: shield,
      title: "Trust",
      desc: "We work on the basis of creating trust nurtured through authenticity and transparency.",
    },
  ];

  return (
    <div className="mb-[4rem] mt-[6rem]">
      <h1 className="text-textColor text-[25px] py-[2rem] pb-[3rem] font-bold w-[400px] block">
        The value that holds us true and to account
      </h1>
      <div className="grid gap-[10rem] grid-cols-1 md:grid-cols-3 items-center">
        {values.map((value, index) => (
          <motion.div
            key={index}
            className="singleGrid rounded-[10px] hover:bg-[#eeedf7] p-[1.5rem]"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.2 }}
          >
            <div className="flex items-center gap-3">
              <div className="imgDiv p-[4px] rounded-[.8rem] h-[40px] w-[40px] flex items-center justify-center">
                <img src={value.img} alt="" className="w-[70%]" />
              </div>
              <span className="font-semibold text-textColor text-[18px]">{value.title}</span>
            </div>
            <p className="text-[15px] text-textColor opacity-[.7] py-[1rem]">
              {value.desc}
            </p>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default Value;
