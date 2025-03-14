//import {handleAuth} from "@kinde-oss/kinde-auth-nextjs/server";
//folder api and subfolders /auth and /kindeauth are created for authentication

//export const GET = handleAuth();

//in nextJS,  the a request is always of type NextRequest, (change if there is a implicity of type 'any' error)



import { handleAuth } from '@kinde-oss/kinde-auth-nextjs/server'
import { NextRequest } from 'next/server'

type Props = {
  params: {
    kindeAuth: string
  }
}

//set {params}:any so there are no errors. 
export async function GET(request: NextRequest, { params }: Props) {
  const authHandler = await handleAuth()
  return authHandler(request, params.kindeAuth)
}

export async function POST(request: NextRequest, { params }: Props) {
  const authHandler = await handleAuth()
  return authHandler(request, params.kindeAuth)
}
