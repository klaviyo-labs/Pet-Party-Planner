import {CreatedTokens, OAuthApi, RetrievedTokens, TokenStorage} from "klaviyo-api"
import {UserModel} from "@/app/api/schemas/User";
import crypto from 'node:crypto';

class MongooseTokenStorage implements TokenStorage {
  readonly algorithm = 'aes-256-cbc'; //Using AES encryption
  readonly splitKey = ":"
  readonly key = process.env.DB_ENCRYPTION_KEY || ""

  async retrieve(customerIdentifier: string): Promise<RetrievedTokens> {
    const result = await UserModel.findOne({id: customerIdentifier})
    if (result) {

      const parts = result.integration.refreshToken.split(this.splitKey)
      const iv = Buffer.from(parts[1], 'hex')
      const decipher = crypto.createDecipheriv(this.algorithm, Buffer.from(this.key, 'hex'), iv)
      const refreshToken = decipher.update(parts[0], 'hex', 'utf8') + decipher.final('utf8'); //deciphered text

      return {accessToken: result.integration.accessToken, refreshToken: refreshToken}
    } else {
      throw Error("Token Not Found")
    }
  }

  async save(customerIdentifier: string, tokens: CreatedTokens): Promise<void> {

    const iv = crypto.randomBytes(16)
    const cipher = crypto.createCipheriv(this.algorithm, Buffer.from(this.key, 'hex'), iv)
    const cipherText = cipher.update(tokens.refreshToken, 'utf8', 'hex') + cipher.final('hex');
    const tokenAndIv = `${cipherText}${this.splitKey}${iv.toString('hex')}`
    const res = await UserModel.findOneAndUpdate({id: customerIdentifier}, {
      integration: {
        connected: true,
        accessToken: tokens.accessToken,
        refreshToken: tokenAndIv
      }
    })
  }
}

export const oauthApi = new OAuthApi(
  process.env.NEXT_PUBLIC_CLIENT_ID || "",
  process.env.CLIENT_SECRET || "",
  new MongooseTokenStorage()
)
