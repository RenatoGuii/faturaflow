'use client'

import { useState } from "react";
import { useFormik } from "formik";
import { loginFormScheme, loginFormValidationScheme, loginProps, registerFormScheme, registerFormValidationScheme, registerProps } from "./formScheme";
import { FieldError, LoadingModal, useNotification } from "@/components";
import { AccessToken, useAuth } from "@/resources";
import { useRouter } from "next/navigation";
import { ToastContainer } from "react-toastify";
import { FiEye, FiEyeOff } from "react-icons/fi";

export default function AuthPage() {
  const useService = useAuth();
  const router = useRouter();
  const notification = useNotification();
  const [loading, setLoading] = useState<boolean>(false);

  const [showLoginPassword, setShowLoginPassword] = useState<boolean>(false);
  const [showRegisterPassword, setShowRegisterPassword] = useState<boolean>(false);

  const [activeTab, setActiveTab] = useState<string>('login');

  const loginHandleSubmit = async () => {
    try {
      setLoading(true);
      const credentials = new FormData();
      credentials.append("email", formikLogin.values.emailUser);
      credentials.append("password", formikLogin.values.password);
      const acessToken: AccessToken = await useService.authenticate(credentials);
      useService.initSession(acessToken);
      router.push("/dashboard");
      setLoading(false);
    } catch (error: any) {
      notification.notify(error?.message, "error");
      setLoading(false);
    }
  }

  const registerHandleSubmit = async () => {
    try {
      setLoading(true);
      const credentials = new FormData();
      credentials.append("name", formikRegister.values.nameUser);
      credentials.append("lastName", formikRegister.values.lastNameUser);
      credentials.append("email", formikRegister.values.emailUser);
      credentials.append("password", formikRegister.values.password);

      await useService.save(credentials);

      window.location.reload();

      setLoading(false);

      notification.notify("Conta criada com sucesso!", "success");
    } catch (error: any) {
      notification.notify(error?.message, "error");
      setLoading(false);
    }
  }

  const formikLogin = useFormik<loginProps>({
    initialValues: loginFormScheme,
    onSubmit: loginHandleSubmit,
    validationSchema: loginFormValidationScheme,
  });

  const formikRegister = useFormik<registerProps>({
    initialValues: registerFormScheme,
    onSubmit: registerHandleSubmit,
    validationSchema: registerFormValidationScheme,
  });

  return (
    <div className="flex h-screen w-full items-center justify-center bg-gradient-to-r">
      {loading && <LoadingModal />}

      <div className="w-full max-w-md rounded-md bg-zinc-900 p-6 shadow-lg">
        <div className="w-52 mx-auto mb-3">
          <img src="/imgs/logo-big.png" alt="logo-big"/>
        </div>

        <h1 className="mb-6 text-center text-2xl">{activeTab === "login" ? "Faça o seu Login" : "Registre-se" }</h1>

        <div className="mb-6 grid grid-cols-2 gap-2 rounded-md bg-zinc-800 p-1">
          <button onClick={() => setActiveTab("login")} className={`rounded-md py-2 font-bold text-white ${activeTab === "login" ? "bg-secondaryColor" : "bg-transparent hover:bg-secondaryColor"}`}>
            Logar
          </button>
          <button onClick={() => setActiveTab("signup")} className={`rounded-md py-2 font-medium text-white ${activeTab === "signup" ? "bg-secondaryColor" : "bg-transparent hover:bg-secondaryColor"}`}>
            Registrar
          </button>
        </div>

        {activeTab === "login" ? (
          <form onSubmit={formikLogin.handleSubmit} className="space-y-4">
            <div>
              <input 
              type="text" 
              name="emailUser" 
              value={formikLogin.values.emailUser} 
              onChange={formikLogin.handleChange} 
              onBlur={formikLogin.handleBlur} 
              placeholder="Endereço de email" 
              className="w-full rounded bg-purple px-4 py-3 text-white placeholder-gray-400 focus:outline-none" />
              {formikLogin.touched.emailUser && <FieldError error={formikLogin.errors.emailUser} />}
            </div>

            <div className="relative">
              <input 
              type={showLoginPassword ? "text" : "password"} 
              name="password" 
              value={formikLogin.values.password} 
              onChange={formikLogin.handleChange} 
              onBlur={formikLogin.handleBlur} 
              placeholder="Senha" 
              className="w-full rounded bg-purple px-4 py-3 text-white placeholder-gray-400 focus:outline-none pr-12" />
              
              <button 
              type="button" 
              onClick={() => setShowLoginPassword(!showLoginPassword)} 
              className="absolute right-4 top-3 text-gray-400 hover:text-white transition">
                {showLoginPassword ? <FiEyeOff size={22} /> : <FiEye size={22} />}
              </button>
              {formikLogin.touched.password && <FieldError error={formikLogin.errors.password} />}
            </div>

            <button type="submit" className="border border-transparent w-full hover:border-white hover:bg-zinc-950 rounded bg-green-700 py-2 text-white transition-colors">
              Logar
            </button>
          </form>
        ) : (
          <form onSubmit={formikRegister.handleSubmit} className="space-y-4">
            <div>
              <input 
              type="text" 
              name="nameUser" 
              value={formikRegister.values.nameUser} 
              onChange={formikRegister.handleChange} 
              onBlur={formikRegister.handleBlur} 
              placeholder="Nome" 
              className="w-full rounded bg-purple px-4 py-3 text-white placeholder-gray-400 focus:outline-none" 
              />
              {formikRegister.touched.nameUser && <FieldError error={formikRegister.errors.nameUser} />}
            </div>

            <div>
              <input 
              type="text" 
              name="lastNameUser" 
              placeholder="Sobrenome" 
              className="w-full rounded bg-purple px-4 py-3 text-white placeholder-gray-400 focus:outline-none" 
              value={formikRegister.values.lastNameUser} 
              onChange={formikRegister.handleChange} 
              onBlur={formikRegister.handleBlur} 
              />
              {formikRegister.touched.lastNameUser && <FieldError error={formikRegister.errors.lastNameUser} />}
              </div>

            <div>
              <input 
              type="email" 
              name="emailUser" 
              placeholder="Endereço de email" 
              className="w-full rounded bg-purple px-4 py-3 text-white placeholder-gray-400 focus:outline-none" 
              value={formikRegister.values.emailUser} 
              onChange={formikRegister.handleChange} 
              onBlur={formikRegister.handleBlur} 
              />
              {formikRegister.touched.emailUser && <FieldError error={formikRegister.errors.emailUser} />}
              </div>

            <div className="relative">
              <input 
              type={showRegisterPassword ? "text" : "password"} 
              name="password"
              placeholder="Senha" 
              className="w-full rounded bg-purple px-4 py-3 text-white placeholder-gray-400 focus:outline-none" 
              value={formikRegister.values.password} 
              onChange={formikRegister.handleChange} 
              onBlur={formikRegister.handleBlur} 
              />
              
              <button 
              type="button" 
              onClick={() => setShowRegisterPassword(!showRegisterPassword)} 
              className="absolute right-4 top-3 text-gray-400 hover:text-white transition">
                {showRegisterPassword ? <FiEyeOff size={22} /> : <FiEye size={22} />}
              </button>

              {formikRegister.touched.password && <FieldError error={formikRegister.errors.password} />}
              </div>

            <button type="submit" className="border border-transparent w-full hover:border-white hover:bg-zinc-950 rounded bg-green-700 py-2 text-white transition-colors">
              Registrar-se
            </button>

          </form>
        )}

        <div className="mt-6 text-center text-sm">
          {activeTab === "login" ? (
            <>Não tem uma conta? <button onClick={() => setActiveTab("signup")} className="text-blue-600 hover:underline">Registre-se</button></>
          ) : (
            <>Você já tem uma conta? <button onClick={() => setActiveTab("login")} className="text-blue-600 hover:underline">Logue</button></>
          )}
        </div>
      </div>

      <ToastContainer position='top-right' autoClose={10000} hideProgressBar={false} draggable={false} closeOnClick={true} pauseOnHover={true} />
    </div>
  );
}
