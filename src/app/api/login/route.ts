import {LoginCredentialVerifier} from "@/app/api/login/models";
import {AuthenticateUser} from "@/app/api/login/auth";
import {NextRequest, NextResponse} from "next/server";
import jwt from "jsonwebtoken";
import {UserModel} from "@/app/api/schemas/User";
import {cookies} from "next/headers";


export async function POST(req: NextRequest) {

  const creds = LoginCredentialVerifier.safeParse(await req.json())
  if (!creds.success) {
    return new Response('Incorrect Object Format', {
      status: 400
    })
  }

  const user = await AuthenticateUser(creds.data)
  if (user) {
    // @ts-ignore - this is verified to exist in next.config.js on startup
    // Note: the JWT user authentication is a placeholder for demo purposes only and should not be implemented in a production environment. 
    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
        expiresIn: "1h",
    });
    return NextResponse.json({ token, accountInfo: {
      integrationConnected: !!user.klaviyoId,
      userId :user.id
    }});
  } else {
    return new Response('Invalid Credentials', {
      status: 401
    })
  }
}
