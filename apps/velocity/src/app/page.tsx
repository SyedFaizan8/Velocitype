"use client"

import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';

import Caret from '@/components/Caret';
import useEngine from '@/hooks/useEngine';
import useIsMobile from '@/hooks/useIsMobile';
import { Refresh } from '@/components/Icons';
import MobileNotice from "@/components/MobileNotice"

import { useAppDispatch, useAppSelector } from "@/store/reduxHooks";
import { setTypingStats } from "@/store/typingSlice";
import { calculateAccuracyPercentage, calculateWPM, liveWPM } from '@/utils/helpers';
import TooltipIcon from '@/components/TooltipIcon';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

const Home = () => {
  const isMobile = useIsMobile();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [timer, setTimer] = useState<number>(15)
  const { user, loading, initialized } = useAppSelector(state => state.auth);

  const { words, typed, timeLeft, errors, state, restart, totalTyped } = useEngine(timer);
  const [isCapsLockOn, setIsCapsLockOn] = useState(false);
  const [open, setOpen] = useState<boolean>(false);

  const buttonRef = useRef<HTMLButtonElement>(null);
  const handleClick = () => {
    buttonRef.current?.blur();
    restart();
  }

  useEffect(() => {
    const checkAuth = async () => {
      if (initialized && !loading && !user) setOpen(true)
    };
    checkAuth();
  }, [user, loading, initialized]);

  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.key === "Tab") {
      event.preventDefault();
      restart();
    }
    if (event.key === "Quote") {
      event.preventDefault();
    }
    if (event.getModifierState("CapsLock")) setIsCapsLockOn(true);
    else setIsCapsLockOn(false);
  }

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  },);

  useEffect(() => {
    if (state === "finish") {
      dispatch(
        setTypingStats({
          wpm: calculateWPM(totalTyped, errors, timer),
          accuracy: calculateAccuracyPercentage(errors, totalTyped),
          raw: Math.floor((totalTyped / 5) * (timer === 15 ? 4 : 1)),
          totalLetters: Math.max(0, totalTyped),
          totalWords: Math.round(totalTyped / 5),
          errors: errors,
          timer
        })
      );

      router.push("/velocity/result");
    }
  }, [state, dispatch, errors, router, totalTyped, timer]);

  const progressPercentage = ((timer - timeLeft) / timer) * 100;

  if (isMobile) return <MobileNotice />

  return (
    <div>
      {timeLeft > 0 &&
        <div
          className="h-1 bg-yellow-500  transition-all ease-linear duration-1000 fixed top-0 left-0 rounded-br-full"
          style={{
            width: `${progressPercentage}%`,
            // background: "linear-gradient(to right, red, orange, yellow, green, blue, indigo, violet)"
          }}
        >
        </div>
      }
      <div className="w-full md:px-10 px-6 h-[80vh] flex flex-col justify-center items-center relative">
        {(state !== "run" && state !== "finish" && words) ? <div className="text-slate-400 bg-slate-900 px-6 py-2 rounded-lg text-lg space-x-6 absolute top-12">
          <span>timer:</span>
          <button className={`${timer === 15 ? "text-yellow-400" : null}`} onClick={() => setTimer(15)}>15</button>
          <button className={`${timer === 60 ? "text-yellow-400" : null}`} onClick={() => setTimer(60)}>60</button>
        </div> : null}
        <div className="w-full flex justify-between items-center h-10">
          <h2 className="text-yellow-400 font-medium text-3xl">{state === "run" ? timeLeft : ""}</h2>
          <h2 className="text-yellow-400 font-medium text-xl">
            {state === "run" ? <span className='text-slate-500'>{`wpm ${liveWPM(totalTyped, timeLeft, timer)}`}</span> : null}
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
          <TooltipIcon icon={<Refresh />} tooltipText="Restart" />
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
      <AlertDialog open={open} onOpenChange={setOpen}>
        <AlertDialogContent className="bg-slate-800">
          <AlertDialogHeader>
            <AlertDialogTitle>Log In Required</AlertDialogTitle>
            <AlertDialogDescription>
              You need to log in to continue. Please log in or cancel to go back.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setOpen(false)}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction onClick={() => {
              router.push("/velocity/login");
              setOpen(false);
            }}>
              Log In
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      <div className='w-full hidden md:flex justify-center items-center space-x-1 text-md text-slate-500 '>
        <span className="bg-slate-500 rounded-sm px-2 text-sm text-white">tab</span>
        <span>-</span>
        <span>restart</span>
      </div>
    </div >
  )
}

export default Home