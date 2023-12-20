import {NextRequest} from "next/server";
import {UserModel} from "@/app/api/schemas/User";
import {Party} from "@/app/api/schemas/Party";

export async function GET(req: NextRequest) {

  const compositeId = req.url.split("/").pop()

  if (!compositeId) {
    return new Response('Not Found', {status: 404})
  }

  try {
    const userId = compositeId.split("-")[0]
    const partyId = compositeId.split("-")[1]

    const user = await UserModel.findOne({id: userId})
    if (user) {
      const party = user.parties.find(party => party.id === partyId)
      if (party) {
        const renderDetails: Party = {
          id: party.id,
          address: party.address,
          address2: party.address2,
          name: party.name,
          city: party.city,
          state: party.state,
          listId: party.listId,
          date: party.date,
        }
        return new Response(JSON.stringify(renderDetails))
      }
      return new Response("Not Found", {status: 404})

    }
  } catch (e) {
    return new Response('Error occurred', {
      status: 500
    })
  }
}