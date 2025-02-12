"use client"

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';

import Caret from '@/components/Caret';
import Footer from '@/components/Footer';
import Header from '@/components/Header';
import useEngine from '@/hooks/useEngine';
import useIsMobile from '@/hooks/useIsMobile';
import { Mute, Refresh, Speaker } from '@/components/Icons';

import { useAppDispatch, useAppSelector } from "@/store/reduxHooks";
import { setTypingStats } from "@/store/typingSlice";
import { calculateAccuracyPercentage, wordsPerMinute } from '@/utils/helpers';
import { changeSound } from "@/store/soundSlice"

const Home = () => {
  const isMobile = useIsMobile();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { sound } = useAppSelector(state => state.sound);

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

  useEffect(() => {
    if (state === "finish") {

      dispatch(
        setTypingStats({
          cpm: totalTyped <= 0 ? 0 : totalTyped * 4,
          wpm: wordsPerMinute(totalWords),
          accuracy: calculateAccuracyPercentage(errors, totalTyped),
          totalLetters: totalTyped <= 0 ? 0 : totalTyped,
          totalWords: totalWords.split(" ").length,
          errors: errors,
        })
      );

      router.push("/velocity/result");
    }
  }, [state]);

  const progressPercentage = ((15 - timeLeft) / 15) * 100;

  return (
    <div>
      {timeLeft > 0 && <div
        className="h-1 bg-slate-500 transition-all duration-1000 fixed top-0 left-0 rounded-br-full"
        style={{
          width: `${progressPercentage}%`,
          // background: "linear-gradient(to right, red, orange, yellow, green, blue, indigo, violet)"
        }}
      >
      </div>
      }
      {
        state !== "run" ?
          <Header />
          : <div
            className="flex justify-between">
            <Link href="/">
              <div className="text-slate-500 font-bold cursor-pointer md:text-3xl text-lg ">VelociType</div>
            </Link>
            <div
              className={`hover:text-slate-200 cursor-pointer pt-2 md:text-2xl text-md ${sound ? "text-yellow-200" : "text-slate-500"}`}
              onClick={() => { dispatch(changeSound()) }}
            >
              {sound ? <Speaker /> : <Mute />}
            </div>
          </div >
      }
      <div className="w-full md:px-10 px-6 h-[80vh] flex flex-col justify-center items-center">
        <div className="w-full flex justify-between items-center h-10">
          <h2 className="text-yellow-400 font-medium text-lg">{state === "run" ? "Time " + timeLeft : ""}</h2>
          <h2 className="text-yellow-400 font-medium text-lg">
            {state === "run" ? "Wpm " + totalWords.split(" ").length * 4 : ""}
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
            <Caret state={state} />
          </div>
        </div>
        <button
          tabIndex={-1}
          ref={buttonRef}
          className="block rounded px-8 py-2 hover:text-white mx-auto mt-10 text-slate-500 text-xl"
          onClick={handleClick}
        >
          <Refresh />
        </button>

        {isCapsLockOn && (
          <motion.div
            key="caps"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="text-red-500 text-xl mt-2">
            Caps Lock is on!
          </motion.div>
        )}
      </div>

      {
        !isMobile &&
        <div className='w-full hidden md:flex justify-center items-center space-x-2 text-xs text-slate-500 '>
          <span className="bg-slate-500 rounded-sm px-1 text-white">tab</span>
          <span>- Restart</span>
        </div>
      }

      <AnimatePresence>
        {state !== "run" ? (
          <motion.div
            key="footer"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            <Footer />
          </motion.div>
        ) : null}
      </AnimatePresence>

    </div >
  )
}

export default Home