import * as Yup from "yup";

export interface FormProps {
    nameInvoice: string;
    dateInvoice: string;
    totalAmountInvoice: string | number;
}

// Para que os inputs sejam VIGIADOS, ATUALIZADOS E VALIDADOS, é necessário que a propiedade "name" do input seja o mesmo de uma das chaves do schema
export const formScheme: FormProps = { nameInvoice: '', dateInvoice: '', totalAmountInvoice: "" };

export const formValidationScheme = Yup.object().shape({
    nameInvoice: Yup.string().trim()
        .required("O nome é obrigatório")
        .max(50, "O título possuí um limite de 50 caracteres"),
    dateInvoice: Yup.string().trim()
        .required("Escolha uma data"),
    totalAmountInvoice: Yup.number()
        .required("O valor não pode ser vazio")
        .moreThan(0, "O valor não pode ser vazio"),
});

