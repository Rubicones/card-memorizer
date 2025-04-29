"use client";

import { useEffect, useRef, useState } from "react";
import Card from "../components/Card";
import { Check, Eye, EyeOff, X } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";

export default function Recall() {
    const rememberBtn = useRef<HTMLButtonElement>(null);
    const forgetBtn = useRef<HTMLButtonElement>(null);
    const topWord = useRef<HTMLDivElement>(null);
    const router = useRouter();
    const params = useSearchParams();
    const dictionary = params.get("dictionary");

    useEffect(() => {
        console.log(dictionary);

        if (
            localStorage &&
            localStorage.getItem("dictionaries") &&
            dictionary
        ) {
            setVocabulary(
                JSON.parse(localStorage.getItem("dictionaries") as string)[
                    dictionary
                ]
            );
        }
    }, [dictionary]);

    const [vocabulary, setVocabulary] = useState<
        {
            front: string;
            back: string;
        }[]
    >([]);

    const [isTranslation, setIsTranslation] = useState(false);

    const onRememberClick = () => {
        console.log("REMEMBER");

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
                if (newVocabulary.length === 0) router.push("/");

                return newVocabulary;
            });
        };
    };

    const onForgetClick = () => {
        const fadeAnimation = topWord.current!.animate(
            [
                {
                    opacity: 1,
                    transform: "translateX(50%) rotate(20deg) translateY(24px)",
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

                if (newVocabulary.length === 0) router.push("/");
                return newVocabulary;
            });
        };
    };
    useEffect(() => {
        if (vocabulary.length !== 0) {
            forgetBtn.current?.addEventListener("touchstart", () => {
                topWord.current?.classList.add("onTouchForgot");
            });
            forgetBtn.current?.addEventListener("touchend", () => {
                topWord.current?.classList.remove("onTouchForgot");
            });
            rememberBtn.current?.addEventListener("touchstart", () => {
                topWord.current?.classList.add("onTouchRemember");
            });
            rememberBtn.current?.addEventListener("touchend", () => {
                topWord.current?.classList.remove("onTouchRemember");
            });
            console.log("HERE");

            rememberBtn.current?.addEventListener("click", onRememberClick);
            forgetBtn.current?.addEventListener("click", onForgetClick);
        }

        return () => {
            rememberBtn.current?.removeEventListener("click", onRememberClick);
            forgetBtn.current?.removeEventListener("click", onForgetClick);
        };
    }, [vocabulary]);

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
                            word={item.front}
                            translation={item.back}
                            isTranslation={isTranslation}
                        />
                    </div>
                ))}
            </div>
        </>
    );
}
