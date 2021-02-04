import React, { useEffect, useState } from "react";
import firebase from '../fbconfig'
export const AuthContext = React.createContext();

export const AuthProvider = ( { children } ) =>
{
    const [ currentUser, setCurrentUser ] = useState( null );
    useEffect( () =>
    {
        //clean up useEffect
        let isSubscribed = true
        if ( isSubscribed )
        {
            firebase.auth().onAuthStateChanged( setCurrentUser );
        }
        return () => isSubscribed = false
    }, [] );

    return (
        <AuthContext.Provider value={ { currentUser } }>
            { children }
        </AuthContext.Provider> )
};