"use client";

import { useEffect, useRef, useState } from "react";
import Card from "../components/Card";
import { Check, Eye, EyeOff, X } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { Card as CardItem } from "../page";
import { useAppSelector } from "@/lib/store/hooks";
import { CheckIcon } from "@/components/ui/check";
import { updateDictionaries } from "@/lib/utils";

function Recall() {
    const rememberBtn = useRef<HTMLButtonElement>(null);
    const forgetBtn = useRef<HTMLButtonElement>(null);
    const topWord = useRef<HTMLDivElement>(null);
    const router = useRouter();
    const params = useSearchParams();
    const dictionary = params?.get("dictionary");
    const dictionariesStore = useAppSelector((state) => state.dictionaries);

    useEffect(() => {
        if (dictionary) {
            setVocabulary(dictionariesStore[dictionary]);
            setNewDictionary(dictionariesStore[dictionary]);
        }
    }, [dictionary]);

    const [vocabulary, setVocabulary] = useState<CardItem[]>([]);
    const [isTranslation, setIsTranslation] = useState(false);
    const [newDictionary, setNewDictionary] = useState<CardItem[]>([]);

    const getUpdatedDictionary = (side: "lose" | "win") => {
        return newDictionary.map((item) => {
            if (item.front === vocabulary[vocabulary.length - 1].front) {
                return {
                    ...item,
                    priority:
                        side === "win"
                            ? item.priority + 0.01
                            : item.priority - 0.01,
                };
            }
            return item;
        });
    };

    const onRememberClick = async () => {
        setIsTranslation(false);
        if (vocabulary.length !== 1)
            setNewDictionary(getUpdatedDictionary("win"));

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
                if (newVocabulary.length === 0) {
                    updateDictionaries({
                        ...dictionariesStore,
                        [dictionary as string]: getUpdatedDictionary("win"),
                    })
                        .then(() => {
                            return new Promise((res) => setTimeout(res, 400));
                        })
                        .then(() => {
                            router.push("/");
                        });
                }

                return newVocabulary;
            });
        };
    };

    const onForgetClick = async () => {
        setIsTranslation(false);
        if (vocabulary.length !== 1)
            setNewDictionary(getUpdatedDictionary("lose"));

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

                if (newVocabulary.length === 0) {
                    updateDictionaries({
                        ...dictionariesStore,
                        [dictionary as string]: getUpdatedDictionary("lose"),
                    })
                        .then(() => {
                            return new Promise((res) => setTimeout(res, 400));
                        })
                        .then(() => {
                            router.push("/");
                        });
                }
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
            <Suspense>
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
                    {vocabulary && vocabulary.length ? (
                        vocabulary.map((item, index) => (
                            <div
                                key={index}
                                ref={
                                    index === vocabulary.length - 1
                                        ? topWord
                                        : null
                                }
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
                                    isTranslation={
                                        index === vocabulary.length - 1 &&
                                        isTranslation
                                    }
                                />
                            </div>
                        ))
                    ) : (
                        <CheckIcon size={62} className='revealAnimation' />
                    )}
                </div>
            </Suspense>
        </>
    );
}

export default function RecallPageWrapper() {
    return (
        <Suspense>
            <Recall />
        </Suspense>
    );
}
