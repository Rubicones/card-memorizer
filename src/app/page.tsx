"use client";

import { cn } from "@/lib/utils";
import { Plus } from "lucide-react";
import { Birthstone } from "next/font/google";
import { Imperial_Script } from "next/font/google";
import { Tangerine } from "next/font/google";
import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Dictionary from "./components/Dictionary";

const birthstone = Birthstone({
    variable: "--font-birthstone",
    subsets: ["latin"],
    weight: "400",
});
const imperialScript = Imperial_Script({
    variable: "--font-imperialScript",
    subsets: ["latin"],
    weight: "400",
});
const tangerine = Tangerine({
    variable: "--font-tangerine",
    subsets: ["latin"],
    weight: "400",
});
export default function Home() {
    const [vocabulary, setVocabulary] = useState<
        {
            front: string;
            back: string;
        }[]
    >([
        {
            front: "handkerchief",
            back: "носовой платок",
        },
        {
            front: "umbrella",
            back: "зонт",
        },
        {
            front: "pencil",
            back: "карандаш",
        },
        {
            front: "book",
            back: "книга",
        },
        {
            front: "table",
            back: "стол",
        },
    ]);
    const [addNewCardDialogData, setAddNewCardDialogData] = useState({
        front: "",
        back: "",
        rotation: useRef(Math.floor(Math.random() * 5)),
        rotationDirection: useRef(Math.random() > 0.5 ? "-" : ""),
        isOpen: false,
    });

    return (
        <>
            <div
                className={cn(
                    imperialScript.variable,
                    birthstone.variable,
                    tangerine.variable,
                    "w-screen h-screen flex flex-col justify-start items-start relative overflow-hidden p-6"
                )}
            >
                <span className={`birthstone-regular text-white text-6xl`}>
                    Memento
                </span>
                <span
                    className={`birthstone-regular text-neutral-300 text-4xl -translate-y-3`}
                >
                    Memorize foreign words the most pure way
                </span>
                <Dictionary items={vocabulary} title='English' />
                <Dialog
                    open={addNewCardDialogData.isOpen}
                    onOpenChange={(state) => {
                        setAddNewCardDialogData((prev) => ({
                            ...prev,
                            isOpen: state,
                        }));
                    }}
                >
                    <DialogTrigger>
                        <div className='absolute text-black size-14 right-5 bottom-5 bg-white rounded-lg p-4 flex items-center justify-center z-30'>
                            <Plus className='size-16' />
                        </div>
                    </DialogTrigger>
                    <DialogContent className='sm:max-w-[425px]'>
                        <DialogHeader>
                            <DialogTitle>Add new card</DialogTitle>
                            <DialogDescription></DialogDescription>
                        </DialogHeader>
                        <div className='flex flex-col gap-4 py-4'>
                            <div
                                style={{
                                    rotate: `${addNewCardDialogData.rotationDirection.current}${addNewCardDialogData.rotation.current}deg`,
                                }}
                                className={`self-center bg-black w-[300px] h-[150px] border-2 border-neutral-500 rounded-md flex flex-col justify-center items-center p-4`}
                            >
                                <div className='w-full relative z-0 flex flex-col items-center justify-center'>
                                    <span className='z-0  select-none text-3xl text-white text-center w-full overflow-hidden whitespace-nowrap overflow-ellipsis'>
                                        {addNewCardDialogData.front}
                                    </span>
                                    <span className='z-0 select-none text-2xl text-neutral-300  hyphens-auto text-center w-full overflow-hidden whitespace-nowrap overflow-ellipsis'>
                                        {addNewCardDialogData.back}
                                    </span>
                                </div>
                            </div>
                            <div className='flex flex-col gap-2'>
                                <Label className='text-right'>Front</Label>
                                <Input
                                    className='col-span-3'
                                    onChange={(e) => {
                                        setAddNewCardDialogData((prev) => ({
                                            ...prev,
                                            front: e.target.value,
                                        }));
                                    }}
                                />
                            </div>
                            <div className='flex flex-col gap-2'>
                                <Label className='text-right'>Back</Label>
                                <Input
                                    className='col-span-3'
                                    onChange={(e) => {
                                        setAddNewCardDialogData((prev) => ({
                                            ...prev,
                                            back: e.target.value,
                                        }));
                                    }}
                                />
                            </div>
                        </div>
                        <DialogFooter>
                            <Button
                                onClick={() => {
                                    setVocabulary((prev) => [
                                        ...prev,
                                        {
                                            front: addNewCardDialogData.front,
                                            back: addNewCardDialogData.back,
                                        },
                                    ]);
                                    setAddNewCardDialogData((prev) => ({
                                        ...prev,
                                        front: "",
                                        back: "",
                                        isOpen: false,
                                    }));
                                }}
                            >
                                Add card
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>
        </>
    );
}
