import {UserModel} from "@/app/api/schemas/User";
import {NextRequest, NextResponse} from "next/server";
import {randomBytes} from "node:crypto";
import {PartyVerifier} from "@/app/api/parties/models";
import {headers} from "next/headers";
import jwt, {JwtPayload} from "jsonwebtoken";
import {ListsApi, OAuthSession} from "klaviyo-api";
import {oauthApi} from "@/app/api/OAuthHelpers";
import {Party} from "@/app/api/schemas/Party";

export async function POST(req: NextRequest) {

  const party = PartyVerifier.safeParse(await req.json())

  if (!party.success) {
    return new Response('Incorrect Object Format', {
      status: 400
    })
  }

  const headersInstance = headers();
  const authHeader = headersInstance.get("authorization");

  if (!authHeader) {
    return new Response('Missing Authentication', {status: 403})
  }


  try {
    const token = authHeader.split(" ")[1];

    // @ts-ignore - this is verified to exist in next.config.js on startup
    const decoded: JwtPayload = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.userId

    if (userId) {
      const partyId = randomBytes(4).toString("hex")
      const session = new OAuthSession(userId, oauthApi)
      const listApi = new ListsApi(session)
      const list = await listApi.createList({
        data: {
          type: "list",
          attributes: {
            name: party.data.name
          }
        }
      })

      const completedParty: Party = {
        id: partyId,
        name: party.data.name,
        date: party.data.date,
        address: party.data.address,
        city: party.data.city,
        state: party.data.state,
        listId: list.body.data.id
      }
      if (party.data.address2) {
        completedParty.address2 = party.data.address2
      }
      const model = await UserModel.findOneAndUpdate(
        {id: userId},
        {$push: {
          parties: completedParty
        }}
      )
      return NextResponse.json(completedParty, {status: 201})
    }
    return new Response('Invalid User', {status: 401})

  } catch (e) {
    return new Response('Error occurred during saving', {
      status: 500
    })
  }
}

export async function GET(req: NextRequest) {
  const headersInstance = headers();
  const authHeader = headersInstance.get("authorization");

  if (!authHeader) {
    return new Response('Missing Authentication', {status: 403})
  }

  try {
    const token = authHeader.split(" ")[1];
    // @ts-ignore - this is verified to exist in next.config.js on startup
    const decoded: JwtPayload = jwt.verify(token, process.env.JWT_SECRET);

    const userId = decoded.userId
    if (userId) {
      const user = await UserModel.findOne({id: userId})

      if (user) {
        return new Response(JSON.stringify(user.parties))
      }

    }
    return new Response('Invalid User', {status: 401})

  } catch (e) {
    return new Response('Error occurred', {
      status: 500
    })
  }
}