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
    [key: string]: Card[];
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
    const [signUpDialogData, setSignUpDialogData] = useState({
        email: "",
        password: "",
        passwordAgain: "",
        isLogIn: false,
        isLoading: false,
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
            .catch((err) => {
                if (err.response.data.error === "Invalid or expired token") {
                    setSignUpDialogData((prev) => ({
                        ...prev,
                        isLogIn: true,
                    }));
                    setIsUserLoggedIn(false);
                    localStorage.clear();
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

            // setToken(
            //     JSON.parse(
            //         localStorage.getItem(
            //             "sb-eecgcvumtskvsmesfbem-auth-token"
            //         ) as string
            //     ).access_token
            // );
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
                        "w-full max-w-[600px] flex flex-col justify-start items-start relative overflow-hidden no-scrollbar overflow-y-scroll overscroll-contain p-6"
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
                            className='animate-spin self-center mt-20'
                            size={80}
                        />
                    ) : (
                        Object.keys(dictionariesStore).map(
                            (key: string, index) => (
                                <Dictionary
                                    key={index}
                                    items={dictionariesStore[key]}
                                    title={key}
                                    onItemRemove={(itemFront) => {
                                        const newItems = dictionariesStore[
                                            key
                                        ].filter(
                                            (item) => item.front !== itemFront
                                        );
                                        updateDictionaries({
                                            ...dictionariesStore,
                                            [key]: newItems,
                                        }).then(() => {
                                            getDictionaries();
                                        });
                                    }}
                                    onCard
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
                                                updateDictionaries({
                                                    ...dictionariesStore,
                                                    [createNewDictionaryDialogData.name]:
                                                        [],
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
                            setAddNewCardDialogData((prev) => ({
                                ...prev,
                                isOpen: state,
                            }));
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
                                        const newVocabulary = {
                                            front: addNewCardDialogData.front,
                                            back: addNewCardDialogData.back,
                                            priority: 1,
                                        };

                                        updateDictionaries({
                                            ...dictionariesStore,
                                            [addNewCardDialogData.dictionary]: [
                                                ...dictionariesStore[
                                                    addNewCardDialogData
                                                        .dictionary
                                                ],
                                                newVocabulary,
                                            ],
                                        }).then(() => {
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
                    <div className='fixed top-0 left-0 blur-3xl bg-neutral-900/50 w-screen h-screen z-30'>
                        <Dialog
                            defaultOpen={true}
                            open={true}
                            onOpenChange={() => {}}
                        >
                            {/* <DialogTrigger>Open</DialogTrigger> */}
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>
                                        {signUpDialogData.isLogIn
                                            ? "Log In"
                                            : "Sign Up"}
                                    </DialogTitle>
                                    <DialogDescription>
                                        {signUpDialogData.isLogIn
                                            ? "Please, enter your credentials to log in"
                                            : `Seems like you are the new Memento user!
                                        Let's make a quick sign up`}
                                    </DialogDescription>
                                </DialogHeader>
                                <div className='flex flex-col gap-4 py-4'>
                                    <div className='flex flex-col gap-2'>
                                        <Label className='text-right'>
                                            E-mail
                                        </Label>
                                        <Input
                                            className='col-span-3'
                                            onChange={(e) => {
                                                setSignUpDialogData((prev) => ({
                                                    ...prev,
                                                    email: e.target.value,
                                                }));
                                            }}
                                        />
                                    </div>
                                    <div className='flex flex-col gap-2'>
                                        <Label className='text-right'>
                                            Password
                                        </Label>
                                        <Input
                                            type='password'
                                            className='col-span-3'
                                            onChange={(e) => {
                                                setSignUpDialogData((prev) => ({
                                                    ...prev,
                                                    password: e.target.value,
                                                }));
                                            }}
                                        />
                                    </div>
                                    {!signUpDialogData.isLogIn && (
                                        <div className='flex flex-col gap-2'>
                                            <Label className='text-right'>
                                                Password again
                                            </Label>
                                            <Input
                                                type='password'
                                                className='col-span-3'
                                                onChange={(e) => {
                                                    setSignUpDialogData(
                                                        (prev) => ({
                                                            ...prev,
                                                            passwordAgain:
                                                                e.target.value,
                                                        })
                                                    );
                                                }}
                                            />
                                        </div>
                                    )}
                                    <Button
                                        className='w-full text-md flex justify-center gap-2 items-center'
                                        disabled={
                                            signUpDialogData.isLoading ||
                                            signUpDialogData.email.length == 0 || signUpDialogData.password
                                            .length === 0 ||
                                            (!signUpDialogData.isLogIn &&
                                                signUpDialogData.password !==
                                                    signUpDialogData.passwordAgain)
                                        }
                                        onClick={() => {
                                            if (signUpDialogData.isLogIn) {
                                                supabase.auth
                                                    .signInWithPassword({
                                                        email: signUpDialogData.email,
                                                        password:
                                                            signUpDialogData.password,
                                                    })
                                                    .then((res) => {
                                                        console.log(res);
                                                        setIsUserLoggedIn(true);
                                                        getDictionaries();
                                                    });
                                            } else {
                                                supabase.auth
                                                    .signUp({
                                                        email: signUpDialogData.email,
                                                        password:
                                                            signUpDialogData.password,
                                                    })
                                                    .then((res) => {
                                                        console.log(res);
                                                        setIsUserLoggedIn(true);
                                                        getDictionaries();
                                                    });
                                            }
                                        }}
                                    >
                                        {(() => {
                                            switch (true) {
                                                case signUpDialogData.isLoading:
                                                    return (
                                                        <LoaderCircle className='animate-spin' />
                                                    );
                                                case signUpDialogData.isLogIn:
                                                    return "Log In";
                                                default:
                                                    return "Sign Up";
                                            }
                                        })()}
                                    </Button>
                                    {!signUpDialogData.isLogIn ? (
                                        <button
                                            className='text-neutral-400 underline'
                                            onClick={() => {
                                                setSignUpDialogData((prev) => ({
                                                    ...prev,
                                                    isLogIn: !prev.isLogIn,
                                                }));
                                            }}
                                        >
                                            I already have an account
                                        </button>
                                    ) : (
                                        <button
                                            className='text-neutral-400 underline'
                                            onClick={() => {
                                                setSignUpDialogData((prev) => ({
                                                    ...prev,
                                                    isLogIn: !prev.isLogIn,
                                                }));
                                            }}
                                        >
                                            I am a new Memento user
                                        </button>
                                    )}
                                </div>
                            </DialogContent>
                        </Dialog>
                    </div>
                )}
            </div>
        </>
    );
}
