"use client"

import Caret from '@/components/Caret';
import Footer from '@/components/Footer';
import Header from '@/components/Header';
import useEngine from '@/hooks/useEngine';
import useIsMobile from '@/hooks/useIsMobile';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react'
import { MdRefresh } from 'react-icons/md';

const Home = () => {
  const isMobile = useIsMobile();

  const { words, typed, timeLeft, errors, state, restart, totalTyped, totalWords } = useEngine();
  const [isCapsLockOn, setIsCapsLockOn] = useState(false);

  const buttonRef = useRef<HTMLButtonElement>(null);
  const handleClick = () => {
    buttonRef.current?.blur();
    restart();
  }

  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.key === "Tab") {
      event.preventDefault();
      restart();
    }
    if (event.getModifierState("CapsLock")) setIsCapsLockOn(true);
    else setIsCapsLockOn(false);
  }

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);
  //grid place-items-center
  return (
    <div className="bg-slate-800 text-slate-50 md:py-10	py-2 px-6 md:px-32 min-h-screen max-h-screen tracking-wider font-mono ">

      {timeLeft === 0 || timeLeft === 15 ?
        <Header />
        : <Link href="/">
          <div className="text-white font-bold cursor-pointer md:text-3xl text-lg ">VelociType</div>
        </Link>}

      < div className="w-full md:px-10 px-6 h-[80vh] flex flex-col justify-center items-center">
        <div className="w-full flex justify-between items-center h-10">
          <h2 className="text-yellow-400 font-medium text-lg">{timeLeft > 0 && timeLeft < 15 ? "Time " + timeLeft : ""}</h2>
          <h2 className="text-yellow-400 font-medium text-lg">
            {timeLeft > 0 && timeLeft < 15 ? "Wpm " + totalWords.split(" ").length * 4 : ""}
          </h2>
        </div>

        <div className="relative md:text-3xl text-lg leading-relaxed h-56">
          <div className="text-slate-500">{words}</div>
          {/* User typed characters will be overlayed over the generated words */}
          <div className="absolute inset-0">
            {typed.split("").map((char, index) => (
              <span key={`${char}_${index}`}
                className={`
                  ${char === words[index] && words[index] !== " " ? "text-yellow-400" : ""}
                  ${char !== words[index] && words[index] !== " " ? "text-red-500 " : ""}
                  ${char !== words[index] && words[index] === " " ? "bg-red-500/50" : ""}`}
              >
                {words[index]}
              </span>
            ))}
            <Caret />
          </div>
        </div>
        <button
          tabIndex={-1}
          ref={buttonRef}
          className="block rounded px-8 py-2 hover:text-white mx-auto mt-10 text-slate-500 text-xl"
          onClick={handleClick}
        >
          <MdRefresh />
        </button>
        {isCapsLockOn && (
          <div className="text-red-500 text-xl mt-2">
            Caps Lock is on!
          </div>
        )}
      </div>


      {/* <Results
        className="mt-10"
        state={state}
        errors={errors}
        accuracyPercentage={calculateAccuracyPercentage(errors, totalTyped)}
        total={totalTyped}
        totalWords={totalWords}
      /> */}
      {!isMobile &&
        <div className='w-full hidden md:flex justify-center items-center space-x-2 text-xs text-slate-50 '>
          <span className="bg-slate-500 rounded-sm px-1 ">tab</span>
          <span>- Restart</span>
        </div>}

      {(timeLeft === 0 || timeLeft === 15) && <Footer />}
    </div >
  )
}

export default Home