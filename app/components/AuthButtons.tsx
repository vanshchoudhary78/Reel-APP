"use client";

import { signIn, signOut, useSession } from "next-auth/react";

export default function AuthButtons() {
    const { data:session } = useSession();

    if (session){
        return (
            <div>
                <p>WELCOME, {session.user?.name}</p>
                <button onClick={() => signOut()}>Logout</button>
            </div>
        );
    }

    return (
        <div>
            {/* <button onClick={() => signIn("credentials")}>LOGIN with Email</button>
            <button onClick={() => signIn("google", {callbackUrl: "/"   })}>LOGIN with Google</button>
            <button onClick={() => signIn("github")}>LOGIN with Github</button> */}



            
            <div className="flex flex-col gap-3 mb-4">
                <button onClick={() => signIn("google", { callbackUrl: "/"})}
                className="flex items-center justify-center gap-2 bg-white border rounded p-2 hover:bg-gray-100"
                >
                <img src="https://media1.tenor.com/m/9kLAG_sFY_sAAAAC/google-gif.gif" alt="Google" className="w-8 h-8" />
                <span>Continue with GOOGLE</span>
                </button>
            </div>




        </div>
    )
}