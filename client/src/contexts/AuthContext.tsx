import { createContext, ReactNode, useState, useContext  } from "react";
import { AuthenticationResponse, User } from "../types/auth";
import { authService } from "../services/authService";

interface  AuthContextType {
    user: User | null,
    isAuthenticated: boolean,
    isLoading: boolean,
    login: (email: string, password: string) => Promise<AuthenticationResponse>,
    register: (email: string, password: string, firstName: string | null, lastName: string | null) => Promise<AuthenticationResponse>,
    logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps { 
    children: ReactNode;
}

export const AuthProvider = (props: AuthProviderProps) => {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const isAuthenticated = user !== null;

    const stateValues =  {
        user: user,
        isLoading: isLoading,
        isAuthenticated: isAuthenticated,
        login: async (email:string, password:string) => {
            setIsLoading(true);
            try {
                const response = await authService.login({
                    email: email,
                    password: password
                });
                setUser(response.data.user);
                return response.data;
            } finally {
                setIsLoading(false);
            }
        },
        register: async (email:string, password:string, firstName:string|null, lastName:string|null) => {
            setIsLoading(true);
            try {
                const response = await authService.register({
                    email, password, firstName, lastName
                })
                setUser(response.data.user);
                return response.data;
            } finally {
                setIsLoading(false);
            }
        },
        logout:  async() => {
            setIsLoading(true);
            try {
                //TODO: Add in api call so we can kill the JWT Token
                setUser(null);
            } finally {
                setIsLoading(false);
            }
        }
    };

    return (
        <AuthContext.Provider value={stateValues}>
            {props.children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

