'use server'
import {NextRequest} from "next/server";
import {AccountsApi, OAuthCallbackQueryParams, OAuthSession} from "klaviyo-api"
import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'
import {oauthApi} from "@/app/api/OAuthHelpers";
import {CALLBACK_URL} from "@/app/components/KlaviyoIntegration/OAuthSetup";
import {UserModel} from "@/app/api/schemas/User";

export async function GET(req: NextRequest) {
  const params: OAuthCallbackQueryParams = {}
  params.code = req.nextUrl.searchParams.get("code") || undefined
  params.error = req.nextUrl.searchParams.get("error") || undefined
  params.state = req.nextUrl.searchParams.get("state") || undefined
  params.error_description = req.nextUrl.searchParams.get("error_description") || undefined

  const verifierCode = req.cookies.get("verifierCode")?.value || ""

  if (params.error=="access_denied"){
    redirect('/integration-error?error=denial')
  }

  if (params.state && params.code && !params.error) {
    try {
      await oauthApi.createTokens(params.state, verifierCode, params.code, CALLBACK_URL)
      const session = new OAuthSession(params.state, oauthApi)
      const accountsApi = new AccountsApi(session)
      const accounts = await accountsApi.getAccounts()

      const publicKey = accounts.body.data[0].attributes.publicApiKey

      const user = await UserModel.findOneAndUpdate({id: params.state}, {klaviyoId: publicKey})
      if (user) {
        cookies().set("integrationConnected", `${true}`)
      } else {
        redirect('/integration-error')
      }

    } catch (e) {
      redirect('/integration-error')
    }
    redirect('/dashboard')
  }
  redirect('/integration-error')
}
