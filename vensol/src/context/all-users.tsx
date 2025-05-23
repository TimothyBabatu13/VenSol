import { createContext, useContext, useEffect, useState } from "react"
import { getAllUsers, type userType } from "../lib/firebase-helpers";

type DataTpe = Omit<userType, 'profileURL' | 'bio'>

const context = createContext<DataTpe[]>([]);

const AllUsersProvider = ({ children } : {
    children: React.ReactNode
}) => {
    
    const [users, setUsers] = useState<DataTpe[]>([]);

    const fetchData = async () => {
        const res = await getAllUsers({
            callBack: (data)=> {
                const uniqueArray : DataTpe[] = Array.from(new Set(data.map(o => JSON.stringify(o)))).map(str => JSON.parse(str)).map(({username, walletAddress}: userType) => ({
                    username,
                    walletAddress
                }))
                setUsers(uniqueArray)
            }
        });
        res;
    }

    useEffect(() =>{
        fetchData()
    } ,[])

  return (
    <context.Provider value={users}>
        {children}
    </context.Provider>
  )
}

export default AllUsersProvider

export const useAllUsersProvider = () => {
    const Context = useContext(context);

    if(!Context){
        throw new Error('All users provider must be used in users context');
    }

    return Context;
}