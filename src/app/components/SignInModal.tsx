import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { LoaderCircle, X } from "lucide-react";
import { toast } from "sonner";
import { useState } from "react";
import { SupabaseClient } from "@supabase/supabase-js";

export default function SignInModal({
    onSignIn,
    supabaseClient,
}: {
    onSignIn: () => void;
    supabaseClient: SupabaseClient;
}) {
    const [signUpDialogData, setSignUpDialogData] = useState({
        email: "",
        password: "",
        passwordAgain: "",
        isLogIn: false,
        isLoading: false,
    });
    return (
        <div className='fixed top-0 left-0 bg-neutral-900/50 w-screen h-screen z-30 flex items-center justify-center'>
            <Card className='w-full sm:min-w-[560px] max-w-md mx-6 relative'>
                <CardHeader>
                    <CardTitle>
                        {signUpDialogData.isLogIn ? "Log In" : "Sign Up"}
                    </CardTitle>
                    <CardDescription>
                        {signUpDialogData.isLogIn
                            ? "Please, enter your credentials to log in"
                            : `Seems like you are the new Memento user!
                Let's make a quick sign up`}
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className='flex flex-col gap-4'>
                        <div className='flex flex-col gap-2'>
                            <Label className='text-right'>E-mail</Label>
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
                            <Label className='text-right'>Password</Label>
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
                                        setSignUpDialogData((prev) => ({
                                            ...prev,
                                            passwordAgain: e.target.value,
                                        }));
                                    }}
                                />
                            </div>
                        )}
                        <Button
                            className='w-full text-md flex justify-center gap-2 items-center'
                            disabled={
                                signUpDialogData.isLoading ||
                                signUpDialogData.email.length == 0 ||
                                signUpDialogData.password.length === 0 ||
                                (!signUpDialogData.isLogIn &&
                                    signUpDialogData.password !==
                                        signUpDialogData.passwordAgain)
                            }
                            onClick={() => {
                                if (signUpDialogData.isLogIn) {
                                    supabaseClient.auth
                                        .signInWithPassword({
                                            email: signUpDialogData.email,
                                            password: signUpDialogData.password,
                                        })
                                        .then((res) => {
                                            if (res.error) throw res.error;
                                            onSignIn();
                                        })
                                        .catch((err) => {
                                            toast.error(err.message);
                                        });
                                } else {
                                    supabaseClient.auth
                                        .signUp({
                                            email: signUpDialogData.email,
                                            password: signUpDialogData.password,
                                        })
                                        .then((res) => {
                                            if (res.error) throw res.error;
                                            onSignIn();
                                        })
                                        .catch((err) => {
                                            toast.error(err.message);
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
                </CardContent>
            </Card>
        </div>
    );
}
