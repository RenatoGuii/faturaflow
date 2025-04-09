import * as Yup from "yup";

export interface loginProps {
    emailUser: string;
    password: string;
}

export interface registerProps {
    nameUser: string;
    lastNameUser: string;
    emailUser: string;
    password: string;
}

// Para que os inputs sejam VIGIADOS, ATUALIZADOS E VALIDADOS, é necessário que a propiedade "name" do input seja o mesmo de uma das chaves do schema
export const loginFormScheme: loginProps = { emailUser: "", password: "" };
export const registerFormScheme: registerProps = { nameUser: "", lastNameUser: "", emailUser: "", password: "" };

export const loginFormValidationScheme = Yup.object().shape({
    emailUser: Yup.string().trim()
        .required("O email é obrigatório"),
    password: Yup.string().trim()
        .required("A senha é obrigatória")
});

export const registerFormValidationScheme = Yup.object().shape({
    nameUser: Yup.string().trim()
        .required("O nome é obrigatório")
        .max(50, "O nome possuí um limite de 50 caracteres"),
    lastNameUser: Yup.string().trim()
        .required("O sobrenome é obrigatório")
        .max(50, "O sobrenome possuí um limite de 50 caracteres"),
    emailUser: Yup.string().trim()
        .required("O email é obrigatório")
        .max(50, "O email possuí um limite de 50 caracteres"),
    password: Yup.string().trim()
        .required("O senha é obrigatória")
        .min(8, "A senha deve conter no mínimo 8 caracteres"),
});

