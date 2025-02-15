import { Header } from "@/components";

export default function Home() {
  return (
    <div>
        <Header />

        <main className="px-16">
          <div className="flex flex-col items-center justify-center text-center mt-24 gap-7 md:w-640px mx-auto">

            <h1 className="text-5xl md:text-6xl">
              Organize Suas Faturas de Forma Simples
            </h1>

            <p className="text-gray-300 md:text-lg">
              Mantenha suas finanças em dia com nosso organizador de faturas pessoais. 
              Registre, acompanhe e gerencie suas faturas de maneira fácil e prática, 
              evitando surpresas no final do mês.
            </p>

            <a 
            className="bg-gray-600 bg-opacity-20 py-2 px-5 border border-secondaryColor text-secondaryColor rounded hover:border-gray-600 hover:text-white hover:bg-blue-400 hover:bg-opacity-0 duration-300"
            href="/register">
              Comece Agora
            </a>

          </div>
        </main>

    </div>
  );
}
