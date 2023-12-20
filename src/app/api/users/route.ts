import {UserModel} from "@/app/api/schemas/User";
import {NextRequest} from "next/server";
import {LoginCredentialVerifier} from "@/app/api/login/models";
import {randomBytes} from "node:crypto";

export async function POST(req: NextRequest) {

  const creds = LoginCredentialVerifier.safeParse(await req.json())

  if (!creds.success) {
    return new Response('Incorrect Object Format', {
      status: 400
    })
  }

  const userId = randomBytes(4).toString("hex")

  try {
    await UserModel.create({
      email: creds.data.email,
      password: creds.data.password,
      id: userId,
      integration: {
        connected: false
      }
    })
    return new Response()
  } catch (e) {
    return new Response('Error occurred during saving', {
      status: 500
    })
  }
}