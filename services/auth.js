import { auth } from "@/constants/firebase";
import { createUserProfile } from "@/services/user";

import {
    createUserWithEmailAndPassword,
    EmailAuthProvider,
    reauthenticateWithCredential,
    signInWithEmailAndPassword,
    signOut,
    updateProfile,
    verifyBeforeUpdateEmail,
} from "firebase/auth";

export async function registerEmail(email, password, displayName){
    const cred = await createUserWithEmailAndPassword(auth, email, password);
    if (displayName){
        await updateProfile(cred.user, { displayName });
    }

    await createUserProfile({ name: displayName, email 
    });
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

export async function getCurrentUser(){
    return auth.currentUser;
}

export async function reauthenticate(password){
    const user = auth.currentUser;
    if(!user || !user.email){
        throw new Error("Usuario no autenticado");
    }
    const credential = EmailAuthProvider.credential(user.email, password);
    await reauthenticateWithCredential(user, credential);
}

export async function updateUserEmail(newEmail){
    const user = auth.currentUser;
    if(!user) throw new Error ("Usuario no autenticado");
    await verifyBeforeUpdateEmail(user, newEmail);
}

export async function updateUserName(newName){
    const user = auth.currentUser;
    if(!user) throw new Error("Usuario no autenticado");
    await updateProfile (user, { displayName: newName });
}

