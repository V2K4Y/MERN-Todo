import { createContext, useEffect, useState } from "react";
import Todo from "./Todo";

export const ContextProvider = createContext({});

export function UserContext({children}) {
    const [username, setUsername] = useState('');
    const [auth, setAuth] = useState('');

    // console.log('UserContext render!')

    useEffect(() => {
            setAuth(document.cookie.split(';').some(cookie => cookie.trim().startsWith('usid=')));
        
      }, [username]);

    if(auth) {
        return (
            <Todo username = {username} setUsername = {setUsername}/>
        )
    }
    return(
        <ContextProvider.Provider value={{setUsername: setUsername}}>
            {children}
        </ContextProvider.Provider>
    )

}