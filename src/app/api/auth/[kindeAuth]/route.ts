//import {handleAuth} from "@kinde-oss/kinde-auth-nextjs/server";
//folder api and subfolders /auth and /kindeauth are created for authentication

//export const GET = handleAuth();

//in nextJS,  the a request is always of type NextRequest, (change if there is a implicity of type 'any' error)

import { handleAuth } from '@kinde-oss/kinde-auth-nextjs/server'

export const GET = handleAuth()
export const POST = handleAuth()
