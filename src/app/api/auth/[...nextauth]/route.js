import NextAuth from "next-auth";
import { authOptions } from "./routes"; // Mantém o caminho correto para o arquivo de configuração

// Aqui exportamos o handler para os métodos GET e POST como nomeados
export const GET = (req, res) => NextAuth(req, res, authOptions);
export const POST = (req, res) => NextAuth(req, res, authOptions);
