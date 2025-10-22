"use client"

import { useEffect, useRef, useState, useCallback } from 'react'
import { useRouter } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';

import axios from 'axios';
import Turnstile from "react-turnstile";

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
import { TURNSTILE_SITE_KEY } from '@/utils/constants';
import { setError } from '@/store/positionSlice';
import { Timer } from '@/types/customTypes';
import Keyboard from '@/components/Keyboard';
import { changekeyboard, changeTiming } from '@/store/settingsSlice';

const Home = () => {
  const isMobile = useIsMobile();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { user, loading, initialized } = useAppSelector(state => state.auth);

  const { timing, keyboard: keyboardBool } = useAppSelector(state => state.setting)
  const [timer, setTimer] = useState<Timer>(timing)
  const [keyboard, setKeyboard] = useState<boolean>(keyboardBool);

  const { words, typed, timeLeft, errors, state, restart, totalTyped, isShift } = useEngine(timer);
  const [isCapsLockOn, setIsCapsLockOn] = useState(false);
  const [open, setOpen] = useState<boolean>(false);

  const [loadingScreen, setLoadingScreen] = useState<boolean>(false);
  const [message, setMessage] = useState<string>('');
  const { error } = useAppSelector(state => state.position)


  const buttonRef = useRef<HTMLButtonElement>(null);
  const handleClick = () => {
    buttonRef.current?.blur();
    restart();
  }

  useEffect(() => {
    if (error) {
      setLoadingScreen(true);
      restart();
    }
  }, [error]);

  useEffect(() => {
    if (window.navigator.webdriver) {
      setLoadingScreen(true);
      dispatch(setError(true))
    }
  });

  const handleSubmitToken = useCallback(async (token: string) => {

    if (!token) {
      setMessage('Something went wrong, CAPTCHA challenge.');
      setLoadingScreen(true);
      dispatch(setError(true))
      return;
    }

    try {
      await axios.post('/api/verify-turnstile', { token });
    } catch (error) {
      if (axios.isAxiosError(error)) {
        setMessage(error.response?.data?.message || 'An error occurred while verifying CAPTCHA.');
        setLoadingScreen(true);
        dispatch(setError(true))
        return;
      }
    }

  }, [dispatch, loadingScreen]);


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
          raw: Math.floor((totalTyped / 5) * (timer === 15 ? 4 : timer === 30 ? 2 : timer === 45 ? 1.333 : 1)),
          totalLetters: Math.max(0, totalTyped),
          totalWords: Math.round(totalTyped / 5),
          errors: errors,
          timer
        })
      );

      router.push("/velocity/result");
    }
  }, [state, dispatch, errors, router, totalTyped, timer]);

  const keyboardUpdate = useCallback(() => {
    dispatch(changekeyboard())
    setKeyboard(!keyboard)
  }, [keyboard, dispatch, changekeyboard])

  const progressPercentage = ((timer - timeLeft) / timer) * 100;

  if (isMobile) return <MobileNotice />
  else if (!isMobile && loadingScreen) return (
    <div className='flex justify-center items-center flex-col space-y-2'>
      <p className='text-3xl text-red-500 font-extrabold'>automation detected</p>
      {message ? <p className='text-xl font-extrabold text-yellow-400'>{message}</p> : null}
      <p className='text-xl text-white'>Something went wrong please refresh the page...</p>
      <button
        tabIndex={-1}
        className="block rounded px-8 py-2 hover:text-white mx-auto mt-10 text-slate-500 text-5xl"
        onClick={() => window.location.reload()}
      >
        <TooltipIcon icon={<Refresh />} tooltipText="Refresh" />
      </button>
    </div>
  )
  else return (
    <div>
      <Turnstile
        theme="dark"
        sitekey={TURNSTILE_SITE_KEY}
        onVerify={(token: string) => { if (!loadingScreen) handleSubmitToken(token) }}
        onError={() => {
          setLoadingScreen(true);
          setMessage("Something went wrong with CAPTCHA. This site works well on Edge, Chrome, and Mozilla.")
          dispatch(setError(true))
        }}
        onUnsupported={() => {
          setLoadingScreen(true);
          setMessage("Something went wrong with CAPTCHA. This site does not support this browser.")
          dispatch(setError(true))
        }}
        appearance='interaction-only'
        className='hidden'
      />
      {timeLeft > 0 &&
        <div
          className="lg:h-1 md:h-[2px] bg-yellow-500  transition-all ease-linear duration-1000 fixed top-0 left-0 rounded-br-full"
          style={{
            width: `${progressPercentage}%`
          }}
        >
        </div>
      }
      <div className="w-full xl:px-10 lg:px-6 md:px-0 h-[90vh] flex flex-col justify-center items-center relative">
        <AnimatePresence>
          {!keyboard && state === 'run' && (
            <div className='flex justify-between w-full'>
              <motion.div
                initial={{ y: "-100%" }}
                animate={{ y: 0 }}
                transition={{
                  type: "tween",
                  duration: 0.25,
                  ease: "easeOut"
                }}
              >
                <div className="flex flex-col justify-end">
                  <div className="text-center lg:mb-1 md:mb-0 bg-slate-900/80 border border-slate-700/50 rounded-xl lg:p-4 md:p-2">
                    <h3 className="lg:text-xl md:text-sm font-semibold text-slate-200">Time Left</h3>
                    <h2 className="lg:text-3xl md:text-xl text-yellow-400 font-medium ">{timeLeft}</h2>
                  </div>
                </div>
              </motion.div>
              <motion.div
                initial={{ y: "-100%" }}
                animate={{ y: 0 }}
                transition={{
                  type: "tween",
                  duration: 0.25,
                  ease: "easeOut"
                }}
              >
                <div className="flex flex-col justify-end">
                  <div className="text-center lg:mb-1 md:mb-0 bg-slate-900/80 border border-slate-700/50 rounded-xl lg:p-4 md:p-2">
                    <h3 className="lg:text-xl md:text-sm font-semibold text-slate-200">WPM</h3>
                    <h2 className="lg:text-3xl md:text-xl text-yellow-400 font-medium">{liveWPM(totalTyped, timeLeft, timer)}</h2>
                  </div>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {(state !== "run" && state !== "finish" && words) ?
          <div className="text-slate-400 bg-slate-900 px-3 py-1 rounded-lg xl:text-xl lg:text-sm md:text-xs lg:space-x-4 md:space-x-2 absolute top-0 z-20">
            <span>timer:</span>
            <button className={`${timer === 15 ? "text-yellow-400" : null}`} onClick={() => { setTimer(15); dispatch(changeTiming(15)) }}>15</button>
            <button className={`${timer === 30 ? "text-yellow-400" : null}`} onClick={() => { setTimer(30); dispatch(changeTiming(30)) }}>30</button>
            <button className={`${timer === 45 ? "text-yellow-400" : null}`} onClick={() => { setTimer(45); dispatch(changeTiming(45)) }}>45</button>
            <button className={`${timer === 60 ? "text-yellow-400" : null}`} onClick={() => { setTimer(60); dispatch(changeTiming(60)) }}>60</button>
          </div> : null}

        <div className={`relative ${!keyboard ? "xl:text-4xl lg:text-3xl md:text-xl" : "xl:text-3xl lg:text-2xl md:text-md"} leading-relaxed h-64 mt-10`}>
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
            <Caret state={state} keyboard={keyboard} />
          </div>
        </div>

        <label
          className="inline-flex items-center gap-2 cursor-pointer px-1 py-0.5 rounded-md transition-colors duration-150 focus:outline-none"
          onKeyDown={(e) => e.key === " " && e.preventDefault()}
        >
          {/* icon + text */}
          <div className="flex items-center gap-2">
            <svg className="w-3 h-3 sm:w-3.5 sm:h-3.5 lg:w-4 lg:h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            <span className="text-xs sm:text-sm font-medium text-slate-200 select-none">Virtual Keyboard</span>
          </div>

          {/* accessible checkbox (controlled) */}
          <input
            type="checkbox"
            className="sr-only"
            checked={keyboard}
            onChange={keyboardUpdate}
            aria-checked={keyboard}
            aria-label="Toggle virtual keyboard"
          />

          {/* track: ON = green, OFF = slate */}
          <div
            className={`flex items-center w-9 h-4 sm:w-10 sm:h-5 lg:w-12 lg:h-6 rounded-full px-1 transition-colors duration-200
      ${keyboard ? "bg-emerald-500" : "bg-slate-700"}`}
            aria-hidden="true"
          >
            {/* knob: checked=true -> moves to right (ml-auto). left->right indicates ON */}
            <span
              className={`block w-3 h-3 sm:w-3.5 sm:h-3.5 lg:w-4 lg:h-4 rounded-full transition-all duration-300 ease-in-out
        ${keyboard ? "ml-auto bg-white shadow-md" : "ml-0 bg-white shadow"}`}
              style={{ willChange: "margin, background-color" }}
            />
          </div>
        </label>


        {/* Keyboard */}
        <AnimatePresence>
          {keyboard && (
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{
                type: "tween",
                duration: 0.25,
                ease: "easeOut"
              }}
            >
              <Keyboard isCapsOn={isCapsLockOn} isShiftOn={isShift} nextKey={words[typed.length]} timeLeft={timeLeft} state={state} livewpm={liveWPM(totalTyped, timeLeft, timer)} />
            </motion.div>
          )}
        </AnimatePresence>

        <button
          tabIndex={-1}
          ref={buttonRef}
          className="block rounded px-8 py-1 hover:text-white mx-auto  text-slate-500 text-xl"
          onClick={handleClick}
        >
          <TooltipIcon icon={<Refresh />} tooltipText="Restart" />
        </button>
        <div className='w-full hidden md:flex justify-center items-center space-x-1 lg:text-md md:text-sm text-slate-500 '>
          <span className="bg-slate-500 rounded-sm lg:px-2 md:px-[6px] text-xs text-white">tab</span>
          <span>-</span>
          <span className='lg:text-sm md:text-xs'>restart</span>
        </div>

        {isCapsLockOn && (
          <motion.div
            key="caps"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="text-red-500 lg:text-xl md:text-xs lg:mt-1 md:mt-0">
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

    </div >
  )
}

export default Home