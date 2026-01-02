import { auth } from "@/constants/firebase";

import{
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    updateProfile,
} from "firebase/auth";

export async function registerEmail(email, password, displayName){
    const cred = await createUserWithEmailAndPassword(auth, email, password);
    if (displayName){
        await updateProfile(cred.user, { displayName });
    }
    return cred.user;
}

export async function loginEmail (email, password){
    const cred = await signInWithEmailAndPassword(auth, email, password);
    console.log("API Firebase Auth: 200 OK");
    console.log("Usuario autenticado:", cred.user.email);
    return cred.user;
}

export async function logout(){
    await signOut (auth);
}