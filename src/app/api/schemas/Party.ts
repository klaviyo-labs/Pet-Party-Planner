import {Schema} from "mongoose";

export interface Party {
    id: string
    name: string,
    date: Date,
    address: string,
    address2?: string,
    city: string,
    state: string,
    listId: string
}

export const PartySchema = new Schema<Party>({
      id: {type: String, required: true},
      name: {type: String, required: true},
      date: {type: Date, required: true},
      address: {type: String, required: true},
      address2: {type: String},
      city: {type: String, required: true},
      state: {type: String, required: true},
      listId: {type: String, required: true}
    })
