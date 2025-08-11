"use client";

import { cn, updateDictionaries } from "@/lib/utils";
import { Check, LoaderCircle, Plus, X } from "lucide-react";
import { Birthstone } from "next/font/google";
import { Imperial_Script } from "next/font/google";
import { Tangerine } from "next/font/google";
import { useEffect, useRef, useState } from "react";
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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import axios from "axios";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import { setDictionaries } from "@/lib/store/dictionariesStore";
import { createClient } from "@supabase/supabase-js";
import { toast } from "sonner";
import SignInModal from "./components/SignInModal";

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

export interface Card {
    front: string;
    back: string;
    priority: number;
}
export interface Dictionaries {
    [key: string]: {
        dictionary: Card[];
        repeatCount: number;
    };
}

export default function Home() {
    const [isUserLoggedIn, setIsUserLoggedIn] = useState(true);
    // const [token, setToken] = useState("");
    const dictionariesStore = useAppSelector((state) => state.dictionaries);
    const dispatch = useAppDispatch();

    const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    const [addNewCardDialogData, setAddNewCardDialogData] = useState({
        front: "",
        back: "",
        dictionary: "",
        rotation: useRef(Math.floor(Math.random() * 5)),
        rotationDirection: useRef(Math.random() > 0.5 ? "-" : ""),
        isOpen: false,
    });
    const [createNewDictionaryDialogData, setCreateNewDictionaryDialogData] =
        useState({
            name: "",
            active: false,
        });
    const [isLoading, setIsLoading] = useState(true);

    const getDictionaries = () => {
        if (!localStorage.getItem("sb-eecgcvumtskvsmesfbem-auth-token")) {
            setIsLoading(false);
            return;
        }
        axios
            .get("/api/get_dictionaries", {
                headers: {
                    Authorization: `Bearer ${
                        JSON.parse(
                            localStorage.getItem(
                                "sb-eecgcvumtskvsmesfbem-auth-token"
                            ) as string
                        ).access_token
                    }`,
                },
            })
            .then((res) => {
                dispatch(setDictionaries(res.data.data));
            })
            .catch(async (err) => {
                if (err.response.data.error === "Invalid or expired token") {
                    try {
                        await supabase.auth.refreshSession();
                        getDictionaries();
                    } catch {
                        setIsUserLoggedIn(false);
                        localStorage.clear();
                        location.reload();
                    }
                }
            })
            .finally(() => {
                setIsLoading(false);
            });
    };

    useEffect(() => {
        if (localStorage) {
            localStorage.setItem(
                "dictionaries",
                JSON.stringify(dictionariesStore)
            );
        }
    }, [dictionariesStore]);

    useEffect(() => {
        if (localStorage) {
            if (!localStorage.getItem("sb-eecgcvumtskvsmesfbem-auth-token"))
                setIsUserLoggedIn(false);
        }
    }, []);

    useEffect(() => {
        getDictionaries();
    }, []);

    return (
        <>
            <div className='w-full flex justify-center'>
                <div
                    className={cn(
                        imperialScript.variable,
                        birthstone.variable,
                        tangerine.variable,
                        "w-full max-w-[600px] flex flex-col justify-start items-start relative overflow-hidden no-scrollbar overscroll-contain p-6"
                    )}
                >
                    <span className={`birthstone-regular text-white text-6xl`}>
                        Memento
                    </span>
                    <span
                        className={`birthstone-regular text-neutral-300 text-4xl -translate-y-4`}
                    >
                        memorize things the most pure way
                    </span>
                    {isLoading ? (
                        <LoaderCircle
                            className='animate-spin self-center'
                            strokeWidth={1}
                            size={80}
                        />
                    ) : (
                        Object.keys(dictionariesStore).map(
                            (key: string, index) => (
                                <Dictionary
                                    key={index}
                                    items={dictionariesStore[key].dictionary}
                                    title={key}
                                    onSwitchBacksAndFronts={() => {
                                        const newItems = dictionariesStore[
                                            key
                                        ].dictionary.map((item) => ({
                                            ...item,
                                            front: item.back,
                                            back: item.front,
                                        }));
                                        const newDictionaries = {
                                            ...dictionariesStore,
                                            [key]: {
                                                dictionary: newItems,
                                                repeatCount:
                                                    dictionariesStore[key]
                                                        .repeatCount,
                                            },
                                        };
                                        dispatch(
                                            setDictionaries(newDictionaries)
                                        );
                                        updateDictionaries(
                                            newDictionaries
                                        ).then(() => {
                                            getDictionaries();
                                        });
                                    }}
                                    onItemRemove={(itemFront) => {
                                        const newItems = dictionariesStore[
                                            key
                                        ].dictionary.filter(
                                            (item) => item.front !== itemFront
                                        );
                                        const newDictionaries = {
                                            ...dictionariesStore,
                                            [key]: {
                                                dictionary: newItems,
                                                repeatCount:
                                                    dictionariesStore[key]
                                                        .repeatCount,
                                            },
                                        };
                                        dispatch(
                                            setDictionaries(newDictionaries)
                                        );
                                        updateDictionaries(newDictionaries)
                                            .then(() => {
                                                getDictionaries();
                                                toast.success(
                                                    "Word removed from the dictionary"
                                                );
                                            })
                                            .catch(() => {
                                                toast.error(
                                                    "Something went wrong while removing the word from the dictionary"
                                                );
                                            });
                                    }}
                                    onCardCreate={() => {
                                        setAddNewCardDialogData((prev) => ({
                                            ...prev,
                                            isOpen: true,
                                            dictionary: key,
                                        }));
                                    }}
                                    onDictionaryRemove={(title) => {
                                        const newDictionaries = {
                                            ...dictionariesStore,
                                        };
                                        delete newDictionaries[title];
                                        updateDictionaries(
                                            newDictionaries
                                        ).then(() => {
                                            getDictionaries();
                                        });
                                    }}
                                    repeatCount={
                                        dictionariesStore[key].repeatCount
                                    }
                                />
                            )
                        )
                    )}

                    {createNewDictionaryDialogData.active ? (
                        <>
                            <div className='relative w-full'>
                                <Input
                                    className='mt-6 w-full text-md'
                                    type='text'
                                    placeholder='Type the dictionary name'
                                    onChange={(e) => {
                                        setCreateNewDictionaryDialogData(
                                            (prev) => ({
                                                ...prev,
                                                name: e.target.value,
                                            })
                                        );
                                    }}
                                />
                                {createNewDictionaryDialogData.name.length >
                                    0 && (
                                    <>
                                        <button
                                            className='absolute right-10 top-8'
                                            onClick={() => {
                                                if (
                                                    !createNewDictionaryDialogData
                                                        .name.length
                                                ) {
                                                    toast.error(
                                                        "Please enter a name for the dictionary"
                                                    );
                                                    return;
                                                }
                                                if (
                                                    Object.keys(
                                                        dictionariesStore
                                                    ).includes(
                                                        createNewDictionaryDialogData.name
                                                    )
                                                ) {
                                                    toast.error(
                                                        "Dictionary with this name already exists"
                                                    );
                                                    return;
                                                }
                                                updateDictionaries({
                                                    ...dictionariesStore,
                                                    [createNewDictionaryDialogData.name]:
                                                        {
                                                            dictionary: [],
                                                            repeatCount: 0,
                                                        },
                                                }).then(() => {
                                                    getDictionaries();
                                                });
                                                setCreateNewDictionaryDialogData(
                                                    (prev) => ({
                                                        ...prev,
                                                        name: "",
                                                        active: false,
                                                    })
                                                );
                                            }}
                                        >
                                            <Check size={20} />
                                        </button>
                                    </>
                                )}
                                <button
                                    className='absolute right-3 top-8'
                                    onClick={() => {
                                        setCreateNewDictionaryDialogData(
                                            (prev) => ({
                                                ...prev,
                                                active: false,
                                            })
                                        );
                                    }}
                                >
                                    <X size={20} />
                                </button>
                            </div>
                        </>
                    ) : (
                        <Button
                            variant='outline'
                            className='mt-6 w-full text-md'
                            onClick={() => {
                                setCreateNewDictionaryDialogData((prev) => ({
                                    ...prev,
                                    active: true,
                                }));
                            }}
                        >
                            <Plus /> Create new Dictionary
                        </Button>
                    )}

                    <Dialog
                        open={addNewCardDialogData.isOpen}
                        onOpenChange={(state) => {
                            if (!state) {
                                setAddNewCardDialogData((prev) => ({
                                    ...prev,
                                    front: "",
                                    back: "",
                                    dictionary: "",
                                    isOpen: false,
                                }));
                            } else {
                                setAddNewCardDialogData((prev) => ({
                                    ...prev,
                                    isOpen: state,
                                }));
                            }
                        }}
                    >
                        <DialogTrigger>
                            <div className='fixed text-black size-14 right-5 bottom-5 bg-white rounded-lg p-4 flex items-center justify-center z-30'>
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
                                    <span className='absolute top-3 left-4 text-sm text-neutral-300 font-bold'>
                                        {addNewCardDialogData.dictionary}
                                    </span>
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
                                    <Label className='text-right'>
                                        Dictionary
                                    </Label>
                                    <Select
                                        onValueChange={(value) => {
                                            setAddNewCardDialogData((prev) => ({
                                                ...prev,
                                                dictionary: value,
                                            }));
                                        }}
                                        value={addNewCardDialogData.dictionary}
                                    >
                                        <SelectTrigger className='w-full'>
                                            <SelectValue placeholder='Dictionary' />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {Object.keys(dictionariesStore).map(
                                                (key, index) => (
                                                    <SelectItem
                                                        key={index}
                                                        value={key}
                                                    >
                                                        {key}
                                                    </SelectItem>
                                                )
                                            )}
                                        </SelectContent>
                                    </Select>
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
                                        value={addNewCardDialogData.front}
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
                                        value={addNewCardDialogData.back}
                                    />
                                </div>
                            </div>
                            <DialogFooter>
                                <Button
                                    disabled={
                                        addNewCardDialogData.front.length ===
                                            0 ||
                                        addNewCardDialogData.back.length ===
                                            0 ||
                                        addNewCardDialogData.dictionary
                                            .length === 0
                                    }
                                    className='w-full text-md flex justify-center gap-2 items-center'
                                    onClick={() => {
                                        const updatedDictionaries = {
                                            ...dictionariesStore,
                                            [addNewCardDialogData.dictionary]: {
                                                ...dictionariesStore[
                                                    addNewCardDialogData
                                                        .dictionary
                                                ],
                                                dictionary: [
                                                    ...dictionariesStore[
                                                        addNewCardDialogData
                                                            .dictionary
                                                    ].dictionary,
                                                    {
                                                        front: addNewCardDialogData.front,
                                                        back: addNewCardDialogData.back,
                                                        priority: 1,
                                                    },
                                                ],
                                            },
                                        };

                                        dispatch(
                                            setDictionaries(updatedDictionaries)
                                        );

                                        updateDictionaries(
                                            updatedDictionaries
                                        ).then(() => {
                                            getDictionaries();
                                        });

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
                {!isUserLoggedIn && (
                    <SignInModal
                        onSignIn={() => {
                            setIsUserLoggedIn(true);
                            getDictionaries();
                        }}
                        supabaseClient={supabase}
                    />
                )}
            </div>
        </>
    );
}
