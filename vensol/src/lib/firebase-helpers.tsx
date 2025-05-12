import { addDoc, collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../config/firebaseConfig";
import { errorToast } from "../components/my-custom-toast";

const usersRef = collection(db, "users");

export const createAccount = async ({ userWallet } : {
    userWallet: string,
}) => {
    
    const q = query(usersRef, where("walletAddress", "==", userWallet));
    
    const querySnapshot = await getDocs(q);

    if(querySnapshot.empty){
        try {
            await addDoc(collection(db, "users"), {
                walletAddress: userWallet,
            });
            return;
          } catch (e) {
            console.error("Error adding document: ", e);
            return;
          }
    }
}

export const getUserName = async ({ userName } : {
    userName: string
}) => {
    if(!userName.trim()){
        errorToast('Please provide a correct username');
    }
    const q = query(usersRef, where('username', '==', userName));
    const querySnapshot = await getDocs(q);
    if(querySnapshot.empty){
        errorToast('Please provide a correct username');
        return;
    }
    console.log(querySnapshot)
}