"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

export default function Card({
    word,
    translation,
    classes = "",
    isTranslation = false,
}: {
    word: string;
    translation: string;
    classes?: string;
    isTranslation?: boolean;
}) {
    const wordSpan = useRef<HTMLSpanElement>(null);
    const translationSpan = useRef<HTMLSpanElement>(null);
    const opacityOut = useRef<Animation | null>(null);
    const blurOut = useRef<Animation | null>(null);
    const opacityIn = useRef<Animation | null>(null);
    const blurIn = useRef<Animation | null>(null);
    const rotationDirection = useRef(Math.random() > 0.5 ? "-" : "");
    const rotationAngle = useRef(Math.floor(Math.random() * 5));
    const flipNumber = useRef(0);

    const flipCard = () => {
        console.log("Next visible: ", isTranslation ? word : translation);

        const opacityOutKeyframes = new KeyframeEffect(
            isTranslation ? translationSpan.current : wordSpan.current,
            [{ opacity: 1 }, { opacity: 0 }],
            {
                duration: 500,
                fill: "forwards",
            }
        );

        const blurOutKeyframes = new KeyframeEffect(
            isTranslation ? translationSpan.current : wordSpan.current,
            [{ filter: "blur(0px)" }, { filter: "blur(10px)" }],
            {
                duration: 500,
                fill: "forwards",
            }
        );

        const opacityInKeyframes = new KeyframeEffect(
            !isTranslation ? translationSpan.current : wordSpan.current,
            [{ opacity: 0 }, { opacity: 1 }],
            {
                duration: 500,
                fill: "forwards",
            }
        );

        const blurInKeyframes = new KeyframeEffect(
            !isTranslation ? translationSpan.current : wordSpan.current,
            [{ filter: "blur(10px)" }, { filter: "blur(0)" }],
            {
                duration: 500,
                fill: "forwards",
            }
        );
        opacityOut.current = new Animation(
            opacityOutKeyframes,
            document.timeline
        );

        blurOut.current = new Animation(blurOutKeyframes, document.timeline);

        opacityIn.current = new Animation(
            opacityInKeyframes,
            document.timeline
        );
        blurIn.current = new Animation(blurInKeyframes, document.timeline);
    };
    useEffect(() => {
        if (wordSpan.current && translationSpan.current) {
            flipCard();
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [word]);

    useEffect(() => {
        console.log("Flip number: ", flipNumber.current);

        if (flipNumber.current >= 1 && blurOut.current) {
            translationSpan.current?.classList.remove("temporarilyHidden");
            opacityIn.current?.play();
            blurIn.current?.play();
            opacityOut.current?.play();
            blurOut.current?.play();

            blurOut.current.onfinish = () => {
                flipCard();
            };
        }
        flipNumber.current = flipNumber.current + 1;

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isTranslation]);
    return (
        <>
            <div
                className={cn(
                    `  rotate-[2deg] bg-black w-[300px] h-[150px] border-2 border-neutral-500 rounded-md flex flex-col justify-center items-center p-4`,
                    classes
                )}
                style={{
                    rotate: `${rotationDirection.current}${rotationAngle.current}deg`,
                }}
            >
                <div className='w-full relative z-0 '>
                    <span
                        ref={wordSpan}
                        style={{
                            fontSize:
                                word && word.length > 30
                                    ? "1.25rem"
                                    : word && word.length > 20
                                    ? "1.5rem"
                                    : word && word.length > 12
                                    ? "1.75rem"
                                    : "2.25rem",
                            lineHeight:
                                word && word.length > 30
                                    ? "1.2"
                                    : word && word.length > 20
                                    ? "1.1"
                                    : word && word.length > 12
                                    ? "1"
                                    : "1.3",
                        }}
                        className='z-0 select-none text-white hyphens-auto text-center absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-full overflow-hidden line-clamp-4'
                    >
                        {word}
                    </span>
                    <span
                        ref={translationSpan}
                        style={{
                            fontSize:
                                translation && translation.length > 30
                                    ? "1.25rem"
                                    : translation && translation.length > 20
                                    ? "1.5rem"
                                    : translation && translation.length > 12
                                    ? "1.75rem"
                                    : "2.25rem",
                            lineHeight:
                                translation && translation.length > 30
                                    ? "1.2"
                                    : translation && translation.length > 20
                                    ? "1.1"
                                    : translation && translation.length > 12
                                    ? "1"
                                    : "1",
                        }}
                        className='z-0 temporarilyHidden select-none text-white hyphens-auto text-center absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-full overflow-hidden line-clamp-4'
                    >
                        {translation}
                    </span>
                </div>
            </div>
        </>
    );
}
