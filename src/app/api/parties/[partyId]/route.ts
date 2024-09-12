import {NextRequest} from "next/server";
import {headers} from "next/headers";
import jwt, {JwtPayload} from "jsonwebtoken";
import {UserModel} from "@/app/api/schemas/User";
import {PartySchema} from "@/app/api/schemas/Party";
import {ListsApi, OAuthSession} from "klaviyo-api";
import {oauthApi} from "@/app/api/OAuthHelpers";

export async function GET(req: NextRequest) {
  const headersInstance = headers();
  const authHeader = headersInstance.get("authorization");

  if (!authHeader) {
    return new Response('Missing Authentication', {status: 403})
  }

  const partyId = req.url.split("/").pop()
  try {
    const token = authHeader.split(" ")[1];
    // @ts-ignore - this is verified to exist in next.config.js on startup
    const decoded: JwtPayload = jwt.verify(token, process.env.JWT_SECRET);

    const userId = decoded.userId
    if (userId) {
      const user = await UserModel.findOne({id: userId})
      if (user) {
        const party = user.parties.find(party => party.id === partyId)
        if (party) {
          const session = new OAuthSession(user.id, oauthApi)
          const listApi = new ListsApi(session)
          const attendees = await listApi.getListProfiles(party.listId)
          return new Response(JSON.stringify({party, attendees: attendees.body.data }))
        }
        return new Response("Party Not Found", {status: 404})

      }

    }
    return new Response('Invalid User', {status: 401})

  } catch (e) {
    return new Response('Error occurred', {
      status: 500
    })
  }
}