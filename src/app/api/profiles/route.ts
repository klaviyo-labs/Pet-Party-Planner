import {NextRequest, NextResponse} from "next/server";
import {OAuthSession, ProfilesApi, ProfileSubscriptionBulkCreateJobEnum} from "klaviyo-api";
import {oauthApi} from "@/app/api/OAuthHelpers";
import {AttendeeVerifier} from "@/app/api/schemas/Attendee";

export async function POST(req: NextRequest) {
  const profile = AttendeeVerifier.safeParse(await req.json())
  const listId = req.nextUrl.searchParams.get("listId")
  const userId = req.nextUrl.searchParams.get("userId")
  if (!listId || !userId) {
    return new Response('Missing List ID or User ID', {
      status: 400
    })
  }
  if (!profile.success) {
    return new Response('Incorrect Object Format', {
      status: 400
    })
  }
  const session = new OAuthSession(userId, oauthApi)
  const profileApi = new ProfilesApi(session)
  let profileId = ""
  try {
    const created_profile = await profileApi.createProfile({
      data: {
        type: "profile",
        attributes: {
          email: profile.data.email,
          firstName: profile.data.firstName,
          lastName: profile.data.lastName,
          properties: {
            "pet_name": profile.data.petName,
            "pet_type": profile.data.petType,
          }
        }
      }
    })
    profileId = created_profile.body.data.id ? created_profile.body.data.id : ""
  } catch (e) {
    return new Response('Error occurred during profile creation', {
      status: 500
    })
  }
  try {
    const subscribeResponse = await profileApi.subscribeProfiles({
      data: {
        type: ProfileSubscriptionBulkCreateJobEnum.ProfileSubscriptionBulkCreateJob,
        attributes: {
          profiles: {
            data: [{
              id: profileId,
              type: "profile",
              attributes: {email: profile.data.email}
            }]
          }
        },
        relationships: {
          list: {
            data: {
              type: "list",
              id: listId
            }
          }
        }
      }
    })
    return NextResponse.json({}, {status: 201})
  } catch (e) {
    return new Response('Error occurred during linking profile to a list', {
      status: 500
    })
  }
}