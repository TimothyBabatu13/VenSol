import { addDoc, arrayUnion, collection, doc, getDocs, increment, onSnapshot, query, updateDoc, where, type DocumentData } from "firebase/firestore";
import { db } from "../config/firebaseConfig";
import { errorToast, successToast } from "../components/my-custom-toast";
import { uploadImageToCloudinary } from "./utils";

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

export const uploadImage = async ({ file, walletAddress, bio, username } : {
    file: File,
    walletAddress: string,
    bio: string,
    username: string
}) => {

    const q = query(usersRef, where("walletAddress", "==", walletAddress));

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

    const [imgURL, docs] = await Promise.all([uploadImageToCloudinary(file), getAllDocs()])
    
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
    console.log(sender, receiver, amount)
    if(note){
        await addDoc(col, {
            sender,
            receiver,
            amount,
            time: new Date().getTime(),
            status: 'incoming',
            uniqueId,
            seen: false,
            note,
            url: ''
        });
        return;
    }

    await addDoc(col, {
        sender,
        receiver,
        amount,
        time: new Date().getTime(),
        status: 'incoming',
        uniqueId,
        seen: false,
        url: ''
    });

}

export const AddFinalTransaction = async ({ uniqueId, url } : {
    uniqueId: string,
    url: string
}) => {
  
    const q = query(transactionRef, where("uniqueId", "==", uniqueId));
    const documents = await getDocs(q);
    
    documents.forEach(async (docSnapshot) => {
        const docRef = doc(db, "transactions", docSnapshot.id);
        await updateDoc(docRef, {
            status: 'succesful',
            url,
        });
       
    });

}

export const AddTransactionFailed = async ({ uniqueId } : {
    uniqueId: string
}) => {

    const q = query(transactionRef, where("uniqueId", "==", uniqueId));
    const documents = await getDocs(q);
    
    documents.forEach(async (docSnapshot) => {
        const docRef = doc(db, "transactions", docSnapshot.id);
        await updateDoc(docRef, {
            status: 'failed'
        });
    
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
    note?: string,
    url: undefined | string
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

export const UpdateSeenOfDoc = async ({ ids } : {
    ids: string[]
}) => {
    const snapshots = await Promise.all(
    ids.map(async (id) => {
      const q = query(transactionRef, where("uniqueId", "==", id));
      const snapshot = await getDocs(q);
      return snapshot.docs;
    })
  );

   const allDocs = snapshots.flat();

  await Promise.all(
    allDocs.map(async (docSnapshot) => {
      const docRef = doc(db, "transactions", docSnapshot.id);
      await updateDoc(docRef, {
        seen: true,
      });
    })
  );

}

const qrCodeRef = collection(db, 'qrCode');

const ACTION = {
  request: "request",
  splitBill: "splitBill",
} as const;


type ActionType = (typeof ACTION)[keyof typeof ACTION];

export interface qrCodeData {
    action: ActionType,
    recipient: string,
    amount: string,
    note?: string,
    title?: string,
    totalAmount?: string,
    amountPerPerson?: string,
    numberOfPeople?: number,
    noOfPeoplePaid?: number,
    arrayOfPeoplePaid?: Array<string>,
    noOfPeolePaid?: number
}
// {"action":"request","recipient":"8w6gHKvRHpNiBDUwH1YbpMfM2wAJk5exnqn3bvMXVonK","amount":"1","token":"SOL","note":""}

export const QrCodeData = async ({ action, recipient, amount, note, title, totalAmount, amountPerPerson, numberOfPeople } : qrCodeData) => {
    const uniqueId = crypto.randomUUID();
    const data = action === 'request' ? ({
        amount,
        recipient,
        action: 'request',
        note: note ? note : '',
        uniqueId

    }) : ({
        recipient,
        action: 'splitBill',
        note: note ? note : '',
        amountPerPerson,
        totalAmount,
        title: title ? title : '',
        uniqueId,
        numberOfPeople,
        noOfPeoplePaid: 0
    })

    console.log(data)
    try {
        const docRef = await addDoc(qrCodeRef, data);
        console.log("Document written with ID:", docRef.id);
        return uniqueId
    } 
    catch (error) {
        console.error("Error adding document:", error)
        const err = error as Error;
        errorToast(err.message);
    }
}

export const ReadQrCodeData = async ({ id, callBack }: {
    id: string,
    callBack: (e: DocumentData) => void
}) => {
    const q = query(qrCodeRef, where("uniqueId", "==", id));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
        querySnapshot.forEach((docSnapshot) => {
            callBack(docSnapshot.data());
        });
    });
    unsubscribe
}

export const UpdateReadCodeCount = async ({ id, walletAddress }: {
    id: string,
    walletAddress: string
    
}) => {
    const q = query(qrCodeRef, where("uniqueId", "==", id));
    const querySnapshot = (await getDocs(q)).docs;
    
    querySnapshot.forEach(async (docSnapshot) => {
        const docId = docSnapshot.id;
        
        const docRef = doc(qrCodeRef, docId);

        await updateDoc(docRef, {
            noOfPeolePaid: increment(1), 
            arrayOfPeoplePaid: arrayUnion(walletAddress),
        });
        console.log('updated');
});
}