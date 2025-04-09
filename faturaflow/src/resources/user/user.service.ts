import { AccessToken, UserSessionToken } from "./user.resource"
import * as jwt from "jwt-decode"

class AuthService {
    baseURL: string = `${process.env.NEXT_PUBLIC_API_URL}/v1/user`
    static AUTH_PARAM: string = "_auth"

    async authenticate(credentials: FormData) : Promise<AccessToken> {
   
        const response = await fetch(`${this.baseURL}/auth`, {
            method: "POST",
            body: credentials, 
        });

        if (response.status == 401) {
            throw new Error("Email ou senha estão incorretas!"); 
        } 

        return await response.json();
    }

    async save(user: FormData) : Promise<void> {

        const response = await fetch(`${this.baseURL}/register`, {
            method: "POST",
            body: user,
        });

        if (response.status == 404) {
            throw new Error("Esse email já esta sendo utilizado");
        }

    }

    initSession(token: AccessToken) {
        if(token.accessToken){
            const decodedToken: any = jwt.jwtDecode(token.accessToken);

            console.log(decodedToken);

            const userSessionToken: UserSessionToken = {
                accessToken: token.accessToken,
                name: decodedToken.name, // Colocar o nome do claim
                lastName: decodedToken.lastName, // Colocar o lastName do claim
                email: decodedToken.sub, // Busca a informação do subject (nesse caso o email)
                expiration: decodedToken.exp // Busca a data de expiração do Token
            }

            this.setUserSession(userSessionToken);
        }
    }

    setUserSession(userSessionToken: UserSessionToken) {
       try {
        localStorage.setItem(AuthService.AUTH_PARAM, JSON.stringify(userSessionToken)); 
       } catch (error){
        console.error(error);
       }
    }

    getUserSessionToken(): UserSessionToken | null {
        try {
            const authString = localStorage.getItem(AuthService.AUTH_PARAM);

            if (!authString) {
                return null;
            }
    
            const token: UserSessionToken = JSON.parse(authString);
    
            return token;
        } catch (error) {
            return null;
        }
    }

    isSessionValid() {
        const userSession: UserSessionToken | null = this.getUserSessionToken();

        if (!userSession) {
            return false;
        }

        const expiration: number | undefined = Number(userSession.expiration);

        if (expiration) {
            // Converte Segundos em Milissegundos
            const expirationDateInMillis = expiration * 1000;

            return new Date() < new Date(expirationDateInMillis);
        }

        return false;
    }

    invalidateSession(): void {
        try {
            localStorage.removeItem(AuthService.AUTH_PARAM);
        } catch (error) {
            console.log(error)
        }
    }
 
}

export const useAuth = () => new AuthService();