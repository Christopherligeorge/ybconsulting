//import {handleAuth} from "@kinde-oss/kinde-auth-nextjs/server";
//folder api and subfolders /auth and /kindeauth are created for authentication

//export const GET = handleAuth();

//in nextJS,  the a request is always of type NextRequest, (change if there is a implicity of type 'any' error)



import { handleAuth } from '@kinde-oss/kinde-auth-nextjs/server'
import { NextRequest } from 'next/server'

export async function GET(
  req: NextRequest,
  { params }: { params: { kindeAuth: string } }
) {
  const authHandler = await handleAuth()
  return authHandler(req, params.kindeAuth)
}

export async function POST(
  req: NextRequest,
  { params }: { params: { kindeAuth: string } }
) {
  const authHandler = await handleAuth()
  return authHandler(req, params.kindeAuth)
}
