"use client";

import { useState } from "react";
import { Eye, EyeClosed, Play, Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export default function Dictionary({
    items,
    title,
    onItemRemove,
    onDictionaryRemove,
}: {
    items: {
        front: string;
        back: string;
    }[];
    title: string;
    onItemRemove: (itemFront: string) => void;
    onDictionaryRemove: (dictionaryTitle: string) => void;
}) {
    const [areBacksVisible, setAreBacksVisible] = useState(false);
    const router = useRouter();
    return (
        <>
            <div
                className={`mt-6 m-2 w-full border-2 rounded-md border-neutral-500 self-center flex flex-col py-1`}
            >
                <div className='w-full flex justify-between items-center px-4 font-semibold text-neutral-200 pb-1'>
                    <span>{title}</span>
                    <div className='flex gap-3 items-center'>
                        <AlertDialog>
                            <AlertDialogTrigger>
                                <div>
                                    <Trash size={16} strokeWidth='3' />
                                </div>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                    <AlertDialogTitle>
                                        Are you sure you want to delete this
                                        dictionary?
                                    </AlertDialogTitle>
                                    <AlertDialogDescription>
                                        The dictionary &quot;{title}&quot; will
                                        be deleted. This action cannot be
                                        undone.
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                    <AlertDialogCancel>
                                        Cancel
                                    </AlertDialogCancel>
                                    <AlertDialogAction
                                        onClick={() => {
                                            onDictionaryRemove(title);
                                        }}
                                    >
                                        Continue
                                    </AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                        <button
                            onClick={() => {
                                setAreBacksVisible((prev) => !prev);
                            }}
                        >
                            {areBacksVisible ? <Eye /> : <EyeClosed />}
                        </button>
                    </div>
                </div>
                <div className='w-full h-[2px] bg-neutral-500'></div>
                <div className='w-full flex justify-center'>
                    <div className='flex flex-col gap-3 px-4 py-2 w-full'>
                        {items.map((item, index) => (
                            <div
                                key={index}
                                className='w-full flex justify-between'
                            >
                                <div className='w-[calc(100%-36px)] flex justify-between items-center'>
                                    <span className='text-neutral-200 text-lg'>
                                        {item.front}
                                    </span>
                                    <span className='text-neutral-300 text-lg'>
                                        {areBacksVisible ? item.back : "∗∗∗∗∗"}
                                    </span>
                                </div>
                                <button
                                    onClick={() => {
                                        onItemRemove(item.front);
                                    }}
                                    className='flex justify-center items-center text-neutral-200'
                                >
                                    <Trash size={16} />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            <Button
                className='w-full text-md flex justify-center gap-2 items-center'
                onClick={() => {
                    router.push(`/recall?&dictionary=${title}`);
                }}
            >
                <Play fill={"black"} className='size-3' />
                <span>Start examination</span>
            </Button>
        </>
    );
}
