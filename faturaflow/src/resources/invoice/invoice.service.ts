import { useAuth } from "../user/user.service";
import { Invoice } from "./invoice.resource";

class InvoiceService {
    baseURL: string = `${process.env.NEXT_PUBLIC_API_URL}/v1/invoice`;
    userSession = useAuth().getUserSessionToken();

    // Uma função async sempre retornará uma promise
    // string = "" permite que o parâmetro seja opcional
    async searchAll(): Promise<Invoice[]> {
        const url = `${this.baseURL}`
        
        try {
            // Await garante o resultado do método antes de passar pra próxima linha
            // Response não é o array de imagens, se trata do array de resposta da requisição, cujo o array de imagens fica dentro dele
            // Por padrão o fetch é um GET
            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    "Authorization": `Bearer ${this.userSession?.accessToken}`
                },
            })

            if (response.status === 404) {
                return [];
            }
    
            if (response.ok && response.headers.get("Content-Length") !== "0") {
                return await response.json();
            }
    
            return []; 
        } catch (error) {
            console.error("Error fetching images:", error);
            return [];
        }
        
    }

    async searchAllCurrent(): Promise<Invoice[]> {
        const url = `${this.baseURL}/due/current`
        
        try {
            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    "Authorization": `Bearer ${this.userSession?.accessToken}`
                },
            })

            if (response.status === 404) {
                return [];
            }
    
            if (response.ok && response.headers.get("Content-Length") !== "0") {
                return await response.json();
            }
    
            return []; 
        } catch (error) {
            console.error("Error fetching images:", error);
            return [];
        }
        
    }

    async searchAllByStatus(status: string): Promise<Invoice[]> {
        const url = `${this.baseURL}/status/${status}`

        try {
            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    "Authorization": `Bearer ${this.userSession?.accessToken}`
                },
            })

            if (response.status === 404) {
                return [];
            }
    
            if (response.ok && response.headers.get("Content-Length") !== "0") {
                return await response.json();
            }
    
            return []; 
        } catch (error) {
            console.error("Error fetching images:", error);
            return [];
        }
        
    }

    async saveInvoice(formData: FormData) {
        const url = `${this.baseURL}`

        try {
            const response = await fetch(url, {
                method: 'POST',
                body: formData,
                headers: {
                    "Authorization": `Bearer ${this.userSession?.accessToken}`
                },
            })
            return response;
        } catch (error) {
            console.error("Error")
        }

    }

    async editInvoice(id: string, formData: FormData) {
        const url = `${this.baseURL}/${id}`;

        try {
            const response = await fetch(url, {
                method: 'PUT',
                body: formData,
                headers: {
                    "Authorization": `Bearer ${this.userSession?.accessToken}`
                },
            })
            return response;
        } catch (error) {
            console.error("Error")
        }

    }

    async deleteInvoice(id: string) {
        const url = `${this.baseURL}/${id}`;

        try {
            const response = await fetch(url, {
                method: 'DELETE',
                headers: {
                    "Authorization": `Bearer ${this.userSession?.accessToken}`
                },
            })
            return response;
        } catch (error) {
            console.error("Error")
        }

    }

}

// Instância única para toda aplicação
export const useInvoiceService = () => new InvoiceService();