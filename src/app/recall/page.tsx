"use client";

import { useEffect, useRef, useState } from "react";
import Card from "../components/Card";
import { Check, Eye, EyeOff, X } from "lucide-react";

export default function Recall() {
    const rememberBtn = useRef<HTMLButtonElement>(null);
    const forgetBtn = useRef<HTMLButtonElement>(null);
    const topWord = useRef<HTMLDivElement>(null);
    const [vocabulary, setVocabulary] = useState<
        {
            word: string;
            translation: string;
        }[]
    >([
        {
            word: "handkerchief",
            translation: "носовой платок",
        },
        {
            word: "umbrella",
            translation: "зонт",
        },
        {
            word: "pencil",
            translation: "карандаш",
        },
        {
            word: "book",
            translation: "книга",
        },
        {
            word: "table",
            translation: "стол",
        },
    ]);

    const [isTranslation, setIsTranslation] = useState(false);

    useEffect(() => {
        forgetBtn.current?.addEventListener("touchstart", () => {
            topWord.current?.classList.add("onTouchForgot");
            console.log(topWord.current);
        });
        forgetBtn.current?.addEventListener("touchend", () => {
            topWord.current?.classList.remove("onTouchForgot");
            console.log(topWord.current);
        });
        rememberBtn.current?.addEventListener("touchstart", () => {
            topWord.current?.classList.add("onTouchRemember");
            console.log(topWord.current);
        });
        rememberBtn.current?.addEventListener("touchend", () => {
            topWord.current?.classList.remove("onTouchRemember");
            console.log(topWord.current);
        });

        rememberBtn.current?.addEventListener("click", () => {
            const fadeAnimation = topWord.current?.animate(
                [
                    {
                        opacity: 1,
                        transform:
                            "translateX(-50%) rotate(-20deg) translateY(24px)",
                    },
                    {
                        opacity: 0,
                        transform: "translateX(-120%) rotate(-40deg) ",
                    },
                    {
                        opacity: 0,
                        transform: "translateX(-200%) rotate(40deg) ",
                    },
                ],
                {
                    duration: 300,
                }
            );
            fadeAnimation!.onfinish = () => {
                topWord.current!.style.opacity = "0";
                setVocabulary((prev) => {
                    const newVocabulary = [...prev.slice(0, prev.length - 1)];
                    console.log(newVocabulary);

                    return newVocabulary;
                });
            };
        });

        forgetBtn.current?.addEventListener("click", () => {
            const fadeAnimation = topWord.current!.animate(
                [
                    {
                        opacity: 1,
                        transform:
                            "translateX(50%) rotate(20deg) translateY(24px)",
                    },
                    {
                        opacity: 0,
                        transform: "translateX(120%) rotate(40deg) ",
                    },

                    {
                        opacity: 0,
                        transform: "translateX(200%) rotate(40deg) ",
                    },
                ],
                {
                    duration: 300,
                }
            );
            fadeAnimation.onfinish = () => {
                topWord.current!.style.opacity = "0";
                setVocabulary((prev) => {
                    const newVocabulary = [...prev.slice(0, prev.length - 1)];

                    return newVocabulary;
                });
            };
        });
    }, []);

    return (
        <>
            <div className='w-screen h-screen flex justify-center items-center relative overflow-hidden '>
                <button
                    ref={rememberBtn}
                    className='peer/accept border-2 rounded-full size-16 border-white bottom-1/4 left-[calc(50%-32px-64px-16px)] absolute flex items-center justify-center'
                >
                    <Check className='text-white size-8' />
                </button>
                <button
                    onClick={() => {
                        setIsTranslation((prev) => !prev);
                    }}
                    className='border-2 rounded-full size-16 border-white bottom-1/4 left-[calc(50%-32px)] absolute flex items-center justify-center'
                >
                    {!isTranslation ? (
                        <EyeOff className='text-white size-8' />
                    ) : (
                        <Eye className='text-white size-8' />
                    )}
                </button>
                <button
                    ref={forgetBtn}
                    className='peer/deny border-2 rounded-full size-16 border-white bottom-1/4 left-[calc(50%-32px+64px+16px)] absolute flex items-center justify-center'
                >
                    <X className='text-white size-8' />
                </button>
                {vocabulary.map((item, index) => (
                    <div
                        key={index}
                        ref={index === vocabulary.length - 1 ? topWord : null}
                        className='wordCard group absolute flex flex-col gap-2 left-1/2 -translate-x-1/2 not-last:brightness-80 last:peer-hover/accept:-translate-x-full last:peer-hover/accept:translate-y-6 last:peer-hover/accept:rotate-[-20deg] last:peer-hover/deny:translate-x-0 last:peer-hover/deny:translate-y-6 last:peer-hover/deny:rotate-[20deg] transition-all duration-300'
                    >
                        {/* <span className='[.onTouchRemember_&]:opacity-100 opacity-0 text-neutral-400 font-semibold transition-all duration-300 group-last:block hidden'> */}
                        {/* <span className='[.onTouchForgot_&]:block hidden'>
                                I DON&apos;T remember this word
                            </span>
                            <span className='[.onTouchRemember_&]:block hidden'>
                                I DO remember this word
                            </span> */}
                        {/* </span> */}
                        <Card
                            word={item.word}
                            translation={item.translation}
                            isTranslation={isTranslation}
                        />
                    </div>
                ))}
            </div>
        </>
    );
}
