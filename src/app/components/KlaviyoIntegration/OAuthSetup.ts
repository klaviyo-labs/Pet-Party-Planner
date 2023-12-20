import Cookie from 'js-cookie'
import {createChallengeCode, createVerifierCode} from "@/app/components/KlaviyoIntegration/pkce";

// this is verified to exist on app startup in next.config.js
const CLIENT_ID = process.env.NEXT_PUBLIC_CLIENT_ID || ""
const KLAVIYO_AUTHORIZE_URL: string = "https://www.klaviyo.com/oauth/authorize"
  // if you are planning to run an app in production this might want to be an environmental variable
export const CALLBACK_URL: string = "http://localhost:3000/api/callback"
// set in the integration settings
const SCOPE: string = "accounts:read list:write list:read profiles:read profiles:write subscriptions:write"


export const startRedirect = async (): Promise<string> => {
  const verifierCode = createVerifierCode()
  const challengeCode = await createChallengeCode(verifierCode)
  const accountId = Cookie.get("userId") || ""


  Cookie.set("verifierCode", verifierCode)

  // see the docs on why these values are sent here: https://developers.klaviyo.com/en/docs/set-up-oauth#2-app-url-redirects-to-the-klaviyo-authorization-page
  const redirectUrl = new URL(KLAVIYO_AUTHORIZE_URL)
  redirectUrl.searchParams.append("client_id", CLIENT_ID)
  redirectUrl.searchParams.append("response_type", "code")
  redirectUrl.searchParams.append("redirect_uri", CALLBACK_URL)
  redirectUrl.searchParams.append("scope", SCOPE)
  redirectUrl.searchParams.append("state", accountId)
  redirectUrl.searchParams.append("code_challenge_method", "S256")
  redirectUrl.searchParams.append("code_challenge", challengeCode)

  return redirectUrl.toString()
}

