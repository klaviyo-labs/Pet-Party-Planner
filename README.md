# Example OAuth App - Pet Party Planner

The purpose of this application is to provide an example of how you can create and authenticate an app with Klaviyo's OAuth authentication. It is designed to help you understand how to successfully set up OAuth with Klaviyo and make calls with our server-side APIs. You can check out other [examples with OAuth sample code](https://github.com/klaviyo-labs/node-integration-example) in Klaviyo Labs.

This app is not designed be used as scaffolding for creating your OAuth app. Rather, use this as an educational resource to better understand the OAuth flow.

### Features

This application plans parties for your pets. It uses Klaviyo and a separate database to store all party attendees' info.

## Prerequisites

1. **A Klaviyo account:** [Sign up](https://developers.klaviyo.com/en/docs/create_a_test_account) for a free Klaviyo account, or sign in to your test account if you have an existing Klaviyo account.
2. **Ensure needed packages are installed:** Ensure you have `node` (18.18 or later) installed plus the below `Tools used in this application` section for more details.
3. **A Klaviyo App** Create a new app in Klaviyo for this sample application. To get help getting started with creating an app, read the [getting started with OAuth guide](https://developers.klaviyo.com/en/docs/create_a_public_oauth_app)

## Tools used in this application

- [Next.js](https://nextjs.org/): Next.js framework is used to serve front-end pages as well as host backend endpoints
- [MongoDB](https://www.mongodb.com/): A NoSQL database used to save application inter
- [Mongoose](https://mongoosejs.com/): A MongoDB ORM to connect to MongoDB
- [Klaviyo Node SDK](https://github.com/klaviyo/klaviyo-api-node): The Klaviyo Node SDK is used for integrating with public API easier
- ... and others. These are the most relevant ones for interacting with Klaviyo.
  See the [package.json](./package.json) for the full list.

## How this app is structured

This application follows the Next.js app router format for creating a file structure; read more about it [here.](https://nextjs.org/docs/app)
The basics you need to know are as follows:

1. `page.tsx` files serves React components to the route composed of the parent folder's names.
2. `route.ts` files serve API endpoints to the route composed of the parent folder's name.

## How this app integrates with Klaviyo

> [!CAUTION]
> For OAuth apps, it's required to have all API calls come from the server-side API (as opposed to using our [client-side APIs](https://developers.klaviyo.com/en/reference/create_client_event) which customers use for a variety or reasons). Using server-side APIs ensures consistency and use of OAuth-specific features.
>
> If your OAuth app does not make calls via your app's specific OAuth access token, your app will not be accepted to Klaviyo's app marketplace and the end user may experience unexpected behavior when using your OAuth app.

### OAuth authorization code flow

This app starts the OAuth flow in the Klaviyo UI with the code living in the client application. The installation URL defaults to `http://localhost:3000/dashboard`, and the settings URL is `http://localhost:3000/settings`.

The [`OAuthSetup.ts`](/src/app/components/KlaviyoIntegration/OAuthSetup.ts) file contains the code for starting the onboarding flow.
It creates the Proof Key for Code Exchange (PKCE) codes needed for verifying the authenticity of the token creation call later and constructs the correct Klaviyo.com URL to redirect to.


Starting the OAuth flow can also be done by a server-side redirect. Additionally, the [Klaviyo Node SDK](https://github.com/klaviyo/klaviyo-api-node/tree/oauth-beta) provides helpers to construct the redirect url and generate PKCE codes. Check out our other [OAuth sample code](https://github.com/klaviyo-labs/node-integration-example) in Klaviyo Labs

Once the user accepts the permissions outlined in the `scope` variable, Klaviyo redirects back to our application as outlined in the `callback_url` parameter.
For this application, the callback routes back to the `/callback` route defined in [`api/callback/route.ts`](./src/app/api/callback/route.ts).

The callback route uses the `Klaviyo Node SDK` to create a `refresh token` and `access token`.
To allow the `Klaviyo Node SDK` to connect to your token storage solution (in this case, MongoDB) implement an instance of `TokenStorage`.
This application defines the `TokenStorage` implementation in [`/apis/OAuthHelpers.ts`](/src/app/api/OAuthHelpers.ts).
To read more about how to implement your instance that connects to your preferred storage method, read the [`Klaviyo Node SDK` `README.md`](https://github.com/klaviyo/klaviyo-api-node?tab=readme-ov-file#tokenstorage)

NOTE: Looking inside at `TokenStorage` will show that the `refresh token` is stored encrypted. DO NOT STORE THIS PLAIN TEXT; if a `refresh token` is exposed, it can be exploited to create malicious `access tokens`

The user can disconnect the app either from Klaviyo or by navigating to the in-app settings page. Clicking `Remove Integration` calls the Klaviyo `revoke` endpoint to revoke access and refresh tokens and disconnect the app.

### Getting the [Klaviyo Public / Site ID](https://help.klaviyo.com/hc/en-us/articles/115005062267)

> [!CAUTION]
> For OAuth apps, it's highly recommended to have all API calls come from the server-side API (as opposed to using our [client-side APIs](https://developers.klaviyo.com/en/reference/create_client_event) which customers use for a variety or reasons) for consistency and use of OAuth specific features.
>
> If your OAuth app does not make calls via your app's specific OAuth access token, the end user may experience unexpected behavior when using your OAuth app.

The Klaviyo public ID verifies which account the created profile should be under. In this application this value is retrieved to ensure that the OAuth flow was successful.

In the same file as above, right after a user's `refresh` and `access` tokens are created [`api/callback/route.ts`](/src/app/api/callback/route.ts), the api call to the Klaviyo `/accounts/` endpoint is made after creating the `access_token` and `refresh_token`.

This call leverages the `KlaviyoOAuthSession` to connect to the implemented `TokenStorage` and the `AccountsApi.getAccounts` method to simplify this API call and provide a pre-created object for the response.

### Pet Party Planning

When the application creates a party, it also creates a Klaviyo list with the same name in the background.

When adding pets to the party, the server uses the `Klaviyo Node SDK`'s `CreateProfile` endpoint to add the new attendee to the linked Klaviyo account and creates a `profileId`. The `profileId` is then used to subscribe the new attendee to the list created earlier. This is done with the `ProfileApi.subscribeProfiles` endpoint.

Custom profile properties, specifically `pet_name` and `pet_type`, are added to the corresponding profile using the `properties` attribute.

Note: If you have double opt-in enabled for email consent, an email will be sent to the email address to confirm their subscription. For testing purposes, we recommend only inputting email addresses you have access to. See [this article](https://developers.klaviyo.com/en/docs/collect_email_and_sms_consent_via_api) to learn more about email consent.

To view the profiles in a list with OAuth, create an `OAuthSession` and use the `ListsApi.getListProfiles` endpoint again.

The `getListProfiles` response includes a `next` and `prev` page value in `response.body.data.links` Passing this value into `.getListProfiles("listId", {pageCursor: response.body.data.links.next})` will fetch the next page of results

## Running this application locally

You do not need to run this application on your local system. However, here are some instructions to set it up if you would like to try:

1. Clone this repo
2. Ensure you are using the correct node version (18.18 or later)

   This can be done with: `nvm use`

3. `npm install`
4. Copy and fill out `.env.local`

   ```
   cp .env.local.example .env.local
   ```


   * Fill out the Client Id and Client Secret. If you don't know where to find that information, read this getting [started with OAuth guide](https://developers.klaviyo.com/en/docs/create_a_public_oauth_app)
      `NEXT_PUBLIC_CLIENT_ID` uses the `NEXT_PUBLIC_` prefix so that the client id can be accessed from the browser
   * For the MongoDB url, this will depend on your preferred way to run MongoDB. The [community Docker image](https://hub.docker.com/r/mongodb/mongodb-community-server) is free, additionally, MongoDB has a free tier cloud-hosted instance called [mongodb atlas](https://www.mongodb.com/atlas/database).
   * To generate a key value to use for JWT and Encrypting `Refresh Tokens` use:
      ```bash
       node -e "const c = require('node:crypto'); console.log(c.randomBytes(32).toString('hex'))"
      ```
5. To launch use `npm run dev` (defaults to localhost:3000)
