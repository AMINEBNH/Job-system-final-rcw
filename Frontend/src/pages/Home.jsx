import React from "react";
import Search from "../components/SearchDiv/Search";
import Jobs from "../components/JobDiv/Jobs";
import Value from "../components/ValueDiv/Value";

import Chatbot from "../components/Chatbot";

const Home = () => {
  return (
    <div className="w-[85%] m-auto bg-white relative">
      
      <Jobs />
      <Value />
      
      <Chatbot />
    </div>
  );
};

export default Home;
