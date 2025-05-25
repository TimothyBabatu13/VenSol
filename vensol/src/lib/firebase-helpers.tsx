import { addDoc, collection, doc, getDocs, onSnapshot, query, updateDoc, where } from "firebase/firestore";
import { db } from "../config/firebaseConfig";
import { errorToast, successToast } from "../components/my-custom-toast";

export interface userType {
    username: string, 
    profileURL: string,
    walletAddress: string,
    bio: string,
}

const usersRef = collection(db, "users");
const transactionRef = collection(db, 'transactions');

export const createAccount = async ({ userWallet } : {
    userWallet: string,
}) => {
    
    if(!userWallet) return;
console.log(userWallet)
    const q = query(usersRef, where("walletAddress", "==", userWallet));
    const querySnapshot = await getDocs(q);

    if(querySnapshot.empty){
        try {
            await addDoc(collection(db, "users"), {
                walletAddress: userWallet,
                username: '',
                profileURL: '',
                bio: ''
            });
            return;
          } catch (e) {
            const error = e as Error;
            errorToast(error.message) 
            return;
          }
    }
}

export const getUserDetails = async ({
    userWallet,callBack
}: {
    userWallet: string,
    callBack: (e: Array<userType>) => void
}) => {
    if(!userWallet){
        return;
    }
    const q = query(usersRef, where("walletAddress", "==", userWallet));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const cities: Array<userType> = [];
        querySnapshot.forEach((doc) => {
            const rr = doc.data() as userType
            cities.push(rr);
            callBack(cities)
        })})
        unsubscribe;
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
        errorToast(`This username doesn't exist. Please provide a correct username`);
        return;
    }

    const result : string = querySnapshot.docs.map(item=> item.data().walletAddress)[0]
    console.log(querySnapshot, result)
}

export const updateProfile = ({
    userName, profileURL
} : {
    userName?: string,
    profileURL?: string
}) => {

    console.log(userName, profileURL)
    
}

export const uploadImage = async ({ file, walletAddress, bio, username } : {
    file: File,
    walletAddress: string,
    bio: string,
    username: string
}) => {


    const CLOUD_NAME: string = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME!
    const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_CLOUD_UPLOAD_PRESET!
    
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", UPLOAD_PRESET);

    const documents = await getDocs(usersRef);
    const data = documents.docs.map(doc => doc.data());

    const check = () => {
        const myUserName = data.filter(item => item.walletAddress === walletAddress && item.username === username);
        if(myUserName.length) return true;
        const notMyUserName = data.filter(item => item.username === username);
        if(notMyUserName.length) {
            errorToast('This username has already been taken.')
            return false;
        };
        return true
    }

    const res = check();

    if(!res) return;

    const q = query(usersRef, where("walletAddress", "==", walletAddress));
    const uploadPicture = async () => {
        const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,{
            method: "POST",
            body: formData,
        });
        const data = await res.json();
        const url = data.url
        return url as string
    }

    const getAllDocs = async () => {
        const docs = await getDocs(q);
        return docs
    }

    if(!file){
        const doc = await getAllDocs();
        await updateDoc(doc.docs[0].ref, {
            bio,
            username
        });
        successToast('Profile updated successfully')
        return true
    }

    const [imgURL, docs] = await Promise.all([uploadPicture(), getAllDocs()])
    
    const docSnap = docs.docs[0];

    
    await updateDoc(docSnap.ref, {
        profileURL: imgURL,
        bio,
        username
    });

    successToast('Profile updated successfully')
    return true;
}

interface TrasactnDb {
    sender: string,
    receiver: string,
    amount: string,
    uniqueId: string,
    note?: string,
}
export const AddInitialTransaction = async ({ sender, receiver, amount, uniqueId, note } : TrasactnDb) => {
    const col = collection(db, "transactions");
    
    if(note){
        await addDoc(col, {
            sender,
            receiver,
            amount,
            time: new Date().getTime(),
            status: 'incoming',
            uniqueId,
            seen: false,
            note
        });
    }

    await addDoc(col, {
        sender,
        receiver,
        amount,
        time: new Date().getTime(),
        status: 'incoming',
        uniqueId,
        seen: false,
    });

}

export const AddFinalTransaction = async ({ uniqueId } : {
    uniqueId: string
}) => {
    console.log(uniqueId, 'form add final transaction')
    const q = query(transactionRef, where("uniqueId", "==", uniqueId));
    const documents = await getDocs(q);
    
    documents.forEach(async (docSnapshot) => {
        const docRef = doc(db, "transactions", docSnapshot.id);
        await updateDoc(docRef, {
            status: 'succesful'
        });
        console.log('updated succesfully')
    });

}

export const AddTransactionFailed = async ({ uniqueId } : {
    uniqueId: string
}) => {
    console.log(uniqueId, 'form transaction failed');
    const q = query(transactionRef, where("uniqueId", "==", uniqueId));
    const documents = await getDocs(q);
    
    documents.forEach(async (docSnapshot) => {
        const docRef = doc(db, "transactions", docSnapshot.id);
        await updateDoc(docRef, {
            status: 'failed'
        });
        console.log('updated succesfully')
    });

}

export const getTransactions = () => {
    
}

export const getAllUsers = async ({
callBack
}: {
    callBack: (e: Array<userType>) => void
}) => {
    
    const unsubscribe = onSnapshot(usersRef, (querySnapshot) => {
        const cities: Array<userType> = [];
        querySnapshot.forEach((doc) => {
            const rr = doc.data() as userType
            cities.push(rr);
            callBack(cities)
        })})
        unsubscribe;
}

export interface TransactnType {
    amount: string,
    receiver: string,
    seen: boolean,
    sender: string,
    status: string,
    time: number,
    uniqueId: string,
    note?: string
}

export const TransactionNotifications = ({ callBack }: {
    callBack: (e: Array<TransactnType>) => void
}) => {
    const unsubscribe = onSnapshot(transactionRef, (querySnapshot) => {
        const cities: Array<TransactnType> = [];
        querySnapshot.forEach((doc) => {
            const rr = doc.data() as TransactnType
            cities.push(rr);
            callBack(cities)
        })})
        unsubscribe;
}