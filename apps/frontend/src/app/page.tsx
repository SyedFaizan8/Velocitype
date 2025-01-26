"use client"
import Caret from '@/components/Caret';
import Results from '@/components/Results';
import useEngine from '@/hooks/useEngine';
import { calculateAccuracyPercentage } from '@/utils/helpers';
import { useRef } from 'react'
import { MdRefresh } from 'react-icons/md';

const Home = () => {

  const { words, typed, timeLeft, errors, state, restart, totalTyped, totalWords } = useEngine();

  const buttonRef = useRef<HTMLButtonElement>(null);
  const handleClick = () => {
    buttonRef.current?.blur();
    restart();
  }

  return (
    <div className="bg-slate-800 text-slate-50 min-h-screen grid place-items-center	px-4 tracking-wider font-mono">
      <h2 className="text-yellow-400 font-medium">Time: {timeLeft}</h2>
      <h2 className="text-yellow-400 font-medium">WPM: {timeLeft < 15 ? totalWords.split(" ").length * 4 : 0} (Words per Minute)</h2>
      <h2 className="text-yellow-400 font-medium">CPM: {totalTyped * 4} (Character per Minute)</h2>
      <div className="relative text-3xl max-w-xl leading-relaxed break-all mt-3">

        <div className="text-slate-500">{words}</div>
        {/* User typed characters will be overlayed over the generated words */}

        <div className={`absolute inset-0`}>
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
        tabIndex={-1} // to prevent focus
        ref={buttonRef}
        className={`block rounded px-8 py-2 hover:bg-slate-700/50  mx-auto mt-10 text-slate-500`}
        onClick={handleClick}
      >
        <MdRefresh size={30} />
      </button>

      <Results
        className="mt-10"
        state={state}
        errors={errors}
        accuracyPercentage={calculateAccuracyPercentage(errors, totalTyped)}
        total={totalTyped}
        totalWords={totalWords}
      />

    </div>
  )
}

export default Home