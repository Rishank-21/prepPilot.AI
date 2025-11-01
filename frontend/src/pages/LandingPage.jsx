import React, { useContext, useState } from "react";
import { APP_FEATURES } from "../utils/data";
import { useNavigate } from "react-router-dom";
import { LuSparkles } from "react-icons/lu";
import Modal from "../components/Modal";
import Login from "./auth/Login";
import Signup from "./auth/SignUp";
import { UserContext } from "../contexts/UserContext";
import ProfileInfoCard from "../components/cards/ProfileInfoCard";

const LandingPage = () => {
  const navigate = useNavigate();
  const [openAuthModel, setOpenAuthModel] = useState(false);
  const [currentPage, setCurrentPage] = useState("login");
  const { user } = useContext(UserContext);

  const handleCTA = () => {
    if (!user) {
      setOpenAuthModel(true);
    } else {
      navigate("/dashboard");
    }
  };
  return (
    <>
      <div className="w-full min-h-full bg-[#fff3cf] ">
        <div className="w-[500px] bg-amber-200/20 blur-[65px] absolute top-0 left-0"></div>
        <div className="container mx-auto px-4 pt-6 pb-[200px] relative z-10">
          <header className="flex justify-between items-center mb-20">
            <div className="text-2xl md:text-3xl text-black font-extrabold tracking-tight">
              PrepPilot.<span className="text-amber-600">AI</span>
            </div>
            {user ? (
              <ProfileInfoCard />
            ) : (
              <button
                className="bg-gradient-to-r from-[#FF9324] to-[#e99a4b] text-base md:text-lg font-semibold text-white px-8 py-3 rounded-full hover:bg-black hover:text-white border border-white transition-colors"
                onClick={() => setOpenAuthModel(true)}
              >
                Login / Sign Up
              </button>
            )}
          </header>
          <div className="flex flex-col md:flex-row items-center">
            <div className="w-full md:w-1/2 pr-4 mb-10 md:mb-2">
              <div className="flex items-center justify-left mb-4">
                <div className="flex items-center gap-2 text-sm md:text-[15px] text-amber-600 font-semibold bg-amber-100 px-3 py-1 rounded-full border border-amber-300">
                  <LuSparkles /> AI Powered
                </div>
              </div>
              <h1 className="text-4xl md:text-6xl text-black font-bold mb-6 leading-tight">
                Level Up Your Future with <br />
                <span className="text-transparent bg-clip-text bg-[radial-gradient(circle,_#FF9324_0%,_#FCD760_100%)] bg-[length:200%_200%] animate-text-shine font-extrabold">
                  AI-Powered
                </span>{" "}
                Learning
              </h1>
            </div>
            <div className="w-full md:w-1/2">
              <p className="text-base md:text-lg text-gray-800 mr-0 md:mr-20 mb-8 leading-relaxed">
                Practice role-specific questions, expand answers instantly, and dive deeper into key concepts — all in one place. From first prep to final mastery, your complete interview toolkit is here.
              </p>
              <button
                className="bg-black text-base md:text-lg font-semibold text-white px-8 py-3 rounded-full hover:bg-yellow-100 hover:text-black border border-yellow-50 hover:border-yellow-300 transition-colors cursor-pointer"
                onClick={handleCTA}
              >
                Get Started
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="w-full min-h-full relative z-10 ">
        <div>
          <section className="flex items-center justify-center -mt-36">
            <img
              src="/ChatGPT Image Aug 18, 2025, 04_04_36 AM.png"
              alt="hero"
              className="w-[80vw] rounded-lg"
            />
          </section>
        </div>
        <div className="w-full min-h-full bg-[#FFFCEF] mt-10">
          <div className="container mx-auto px-4 pt-10 pb-20">
            <section className="mt-5">
              <h2 className="text-2xl font-medium text-center mb-12">
                Features That Make You Shine
              </h2>
              <div className="flex flex-col items-center gap-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full">
                  {APP_FEATURES.slice(0, 3).map((feature) => (
                    <div
                      key={feature.id}
                      className="bg-[#FFFEF8] p-6 rounded-xl shadow-xs hover:shadow-lg shadow-amber-100 transition border border-amber-100"
                    >
                      <h3 className="text-base font-semibold mb-3">
                        {feature.title}
                      </h3>
                      <p className="text-gray-600">{feature.description}</p>
                    </div>
                  ))}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {APP_FEATURES.slice(3).map((feature) => {
                    <div
                      key={feature.id}
                      className="bg-[#FFFEF8] p-6 rounded-xl shadow-xs hover:shadow-lg shadow-amber-100 transition border border-amber-100"
                    >
                      <h3 className="text-base font-semibold mb-3">
                        {feature.title}
                      </h3>
                      <p className="text-gray-600">{feature.description}</p>
                    </div>;
                  })}
                </div>
              </div>
            </section>
          </div>
        </div>
        <div className="text-sm text-secondary text-center p-5 mt-5 bg-black  text-white">
         © 2025 perpPilot.AI. All rights reserved.
        </div>
      </div>

      <Modal
        isOpen={openAuthModel}
        onClose={() => {
          setOpenAuthModel(false);
          setCurrentPage("login");
        }}
        hideHeader
      >
        <div>
          {currentPage === "login" && <Login setCurrentPage={setCurrentPage} />}

          {currentPage === "signup" && (
            <Signup setCurrentPage={setCurrentPage} />
          )}
        </div>
      </Modal>
    </>
  );
};

export default LandingPage;

// import React, { useContext, useState } from 'react';
// import { APP_FEATURES } from '../utils/data';
// import { useNavigate } from 'react-router-dom';
// import { LuSparkles } from 'react-icons/lu';
// import Modal from '../components/Modal';
// import Login from './auth/Login';
// import Signup from './auth/SignUp';
// import { UserContext } from '../contexts/UserContext';
// import ProfileInfoCard from '../components/cards/ProfileInfoCard';

// const LandingPage = () => {
//   const navigate = useNavigate();
//   const [openAuthModel, setOpenAuthModel] = useState(false);
//   const [currentPage, setCurrentPage] = useState('login');
//   const { user } = useContext(UserContext);

//   const handleCTA = () => {
//     if (!user) {
//       setOpenAuthModel(true);
//     } else {
//       navigate('/dashboard');
//     }
//   };

//   return (
//     <>
//       <div className="w-full min-h-full bg-[#fff3cf]">
//         <div className="w-[500px] bg-amber-200/20 blur-[65px] absolute top-0 left-0" />
//         <div className="container mx-auto px-4 pt-6 pb-[200px] relative z-10">
//           <header className="flex justify-between items-center mb-16">
//             <div className="text-xl text-black font-bold">InterView Prep AI</div>
//             {user ? (
//               <ProfileInfoCard />
//             ) : (
//               <button
//                 className="bg-gradient-to-r from-[#FF9324] to-[#e99a4b] text-sm font-semibold text-white px-7 py-2.5 rounded-full hover:bg-black hover:text-white border border-white transition-colors"
//                 onClick={() => setOpenAuthModel(true)}
//               >
//                 Login/Sign Up
//               </button>
//             )}
//           </header>

//           <div className="flex flex-col md:flex-row items-center">
//             <div className="w-full md:w-1/2 pr-4 mb-8 md:mb-2">
//               <div className="flex items-center justify-left mb-2">
//                 <div className="flex items-center gap-2 text-[13px] text-amber-600 font-semibold bg-amber-100 px-3 py-1 rounded-full border border-amber-300">
//                   <LuSparkles /> AI Powered
//                 </div>
//               </div>
//               <h1 className="text-5xl text-black font-medium mb-6 leading-tight">
//                 Ace Interviews with <br />
//                 <span className="text-transparent bg-clip-text bg-[radial-gradient(circle,_#FF9324_0%,_#FCD760_100%)] bg-[length:200%_200%] animate-text-shine font-semibold">
//                   AI-Powered
//                 </span>{' '}
//                 Learning
//               </h1>
//             </div>
//             <div className="w-full md:w-1/2">
//               <p className="text-[17px] text-gray-900 mr-0 md:mr-20 mb-6">
//                 Get role-specific questions, expand answers when you need them, dive deeper into concepts, and organize everything your way. From preparation to mastery — your ultimate interview toolkit is here.
//               </p>
//               <button
//                 className="bg-black text-sm font-semibold text-white px-7 py-2.5 rounded-full hover:bg-yellow-100 hover:text-black border border-yellow-50 hover:border-yellow-300 transition-colors"
//                 onClick={handleCTA}
//               >
//                 Get Started
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>

//       <div className="w-full min-h-full relative z-10">
//         <section className="flex items-center justify-center -mt-36">
//           {/* Replace with a real image in /public or an external URL */}
//           <img
//             src="https://placehold.co/1200x600?text=Interview+Prep+AI"
//             alt="hero"
//             className="w-[80vw] rounded-lg"
//           />
//         </section>

//         <div className="w-full min-h-full bg-[#FFFCEF] mt-10">
//           <div className="container mx-auto px-4 pt-10 pb-20">
//             <section className="mt-5">
//               <h2 className="text-2xl font-medium text-center mb-12">
//                 Features That Make You Shine
//               </h2>
//               <div className="flex flex-col items-center gap-8">
//                 <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full">
//                   {APP_FEATURES.slice(0, 3).map((feature) => (
//                     <div
//                       key={feature.id}
//                       className="bg-[#FFFEF8] p-6 rounded-xl shadow-xs hover:shadow-lg shadow-amber-100 transition border border-amber-100"
//                     >
//                       <h3 className="text-base font-semibold mb-3">{feature.title}</h3>
//                       <p className="text-gray-600">{feature.description}</p>
//                     </div>
//                   ))}
//                 </div>

//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full">
//                   {APP_FEATURES.slice(3).map((feature) => (
//                     <div
//                       key={feature.id}
//                       className="bg-[#FFFEF8] p-6 rounded-xl shadow-xs hover:shadow-lg shadow-amber-100 transition border border-amber-100"
//                     >
//                       <h3 className="text-base font-semibold mb-3">{feature.title}</h3>
//                       <p className="text-gray-600">{feature.description}</p>
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             </section>
//           </div>
//         </div>

//         <div className="text-sm bg-gray-50 text-secondary text-center p-5 mt-5">
//           Made with ❤️... Happy Coding
//         </div>
//       </div>

//       <Modal
//         isOpen={openAuthModel}
//         onClose={() => {
//           setOpenAuthModel(false);
//           setCurrentPage('login');
//         }}
//         hideHeader
//       >
//         <div>
//           {currentPage === 'login' && <Login setCurrentPage={setCurrentPage} />}
//           {currentPage === 'signup' && <Signup setCurrentPage={setCurrentPage} />}
//         </div>
//       </Modal>
//     </>
//   );
// };

// export default LandingPage;
