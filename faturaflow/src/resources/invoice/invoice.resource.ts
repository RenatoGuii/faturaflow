//O nome desses campos tem que ser igual aos nomes do campo que vai vir como resultado da consulta (Nesse caso, imageDTO)

export class Invoice {
    id?: string;
    name?: string;
    totalAmount?: number;
    dueDate?: string;
    createdAt?: string;
    status?: string;
    items?: Array<InvoiceItem>;
}

export class InvoiceItem {
    id?: string;
    description?: string;
    amount?: number;
}