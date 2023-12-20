import {Schema, model, models, Model} from 'mongoose';
import bcrypt from 'bcrypt'
import {Party, PartySchema} from "@/app/api/schemas/Party";

const SALT_ROUNDS = 10
export const MIN_PASSWORD_LENGTH = 6


// 1. Create an interface representing a document in MongoDB.



export interface User {
  id: string
  email: string,
  password: string,
  klaviyoId: string
  integration: {
    connection: boolean,
    accessToken: string,
    refreshToken: string
    expiresAt: Date
  },
  parties: [Party]
}

// 2. Create a Schema corresponding to the document interface.
const UserSchema = new Schema<User>({
  id: { type: String, required: true, index: true },
  email: { type: String, required: true, index: true },
  password: { type: String, required: true },
  klaviyoId: { type: String, required: false },
  integration: {
    accessToken: {type: String, required: false},
    refreshToken: {type: String, required: false},
    expiresAt: {type: Date, required: false}
  },
  parties: [PartySchema]
});

UserSchema.pre('save', async function(next) {
  if (this.isModified("password") || this.isNew) {
    const salt = await bcrypt.genSalt(SALT_ROUNDS)
    this.password = await bcrypt.hash(this.password, salt)
  }
})


// 3. Create a Model.
export const UserModel: Model<User> = models.User || model<User>('User', UserSchema)

