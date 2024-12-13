import React from "react";
import { AiFillInstagram, AiOutlineTwitter } from "react-icons/ai";
import { BsFacebook } from "react-icons/bs";

const Footer = () => {
  return (
    <footer className="w-full bg-blue-600 py-6 text-white">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center px-6 gap-8">
        {/* Logo et Description */}
        <div className="text-center md:text-left">
          <h1 className="text-2xl font-bold mb-4">
            <strong>Job</strong>Lite
          </h1>
          <p className="text-sm opacity-80">
            Helping seekers and companies connect for the best opportunities.
          </p>
        </div>

        {/* Liens Rapides */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center md:text-left">
          <div>
            <h3 className="font-semibold mb-2">Company</h3>
            <ul>
              <li className="text-sm opacity-80 hover:opacity-100 cursor-pointer">About</li>
              <li className="text-sm opacity-80 hover:opacity-100 cursor-pointer">Features</li>
              <li className="text-sm opacity-80 hover:opacity-100 cursor-pointer">FAQ</li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-2">Resources</h3>
            <ul>
              <li className="text-sm opacity-80 hover:opacity-100 cursor-pointer">Support</li>
              <li className="text-sm opacity-80 hover:opacity-100 cursor-pointer">Contact</li>
            </ul>
          </div>
        </div>

        {/* Contacts et Réseaux Sociaux */}
        <div className="text-center md:text-left">
          <h3 className="font-semibold mb-2">Contact</h3>
          <p className="text-sm mb-2">
            aminebenhassine@gmail.com <br />
            babaoumarbah9@outlook.com
          </p>
          <div className="flex justify-center md:justify-start gap-4">
            <AiFillInstagram className="h-8 w-8 bg-white text-blue-600 p-2 rounded-full cursor-pointer hover:scale-110 transition" />
            <BsFacebook className="h-8 w-8 bg-white text-blue-600 p-2 rounded-full cursor-pointer hover:scale-110 transition" />
            <AiOutlineTwitter className="h-8 w-8 bg-white text-blue-600 p-2 rounded-full cursor-pointer hover:scale-110 transition" />
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
