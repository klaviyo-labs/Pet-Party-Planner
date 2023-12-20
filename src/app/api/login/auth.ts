import {User, UserModel} from "@/app/api/schemas/User";
import {LoginCredential} from "@/app/api/login/models";
import bcrypt from "bcrypt";


export const AuthenticateUser = async function (user: LoginCredential): Promise<User|null> {
  const savedUser = await UserModel.findOne({email: user.email})
  if (savedUser && await bcrypt.compare(user.password, savedUser.password)){
      return savedUser
  }
  return null
}