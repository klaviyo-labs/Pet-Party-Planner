import {NextRequest, NextResponse} from "next/server";
import {MongooseTokenStorage} from '@/app/api/OAuthHelpers'
import jwt, {JwtPayload} from "jsonwebtoken";
import {headers} from "next/headers";

export async function POST(req: NextRequest) {

const secret = process.env.CLIENT_SECRET
const clientId = process.env.NEXT_PUBLIC_CLIENT_ID
  const url = "https://a.klaviyo.com/oauth/revoke"
  const headersInstance = headers();
  const authHeader = headersInstance.get("authorization");
  
  if (!authHeader) {
    return new Response('Missing Authentication', {status: 403})
  }
  
  const token = authHeader.split(" ")[1];

  // @ts-ignore - this is verified to exist in next.config.js on startup
  const decoded: JwtPayload = jwt.verify(token, process.env.JWT_SECRET);
  const userId = decoded.userId
  const tokenStorage = new MongooseTokenStorage()
  const tokens = await tokenStorage.retrieve(userId)
  const refreshToken = tokens.refreshToken
  const revokeHeaders = {
    "Authorization": 'Basic '+btoa(`${clientId}:${secret}`),
    "Content-Type": "application/x-www-form-urlencoded"
  }

  const data = {
    "token_type_hint": "refresh_token",
    "token": refreshToken
  }

  const URLData = new URLSearchParams(data)

  try {
    const res = await fetch(url,{
      method: "POST",
      headers: revokeHeaders,
      body: URLData
    })
    if (!res.ok) {
      console.log(res)
      throw new Error(`HTTP error! status: ${res.status}`);
    }
    const result = await res.json();
    console.log("Success:", result);
    return NextResponse.json({},{status: 200})
  } catch (e) {
    console.error("Failed to fetch:", e);
    return new Response('Error occurred while revoking', {status: 500})
  }
}