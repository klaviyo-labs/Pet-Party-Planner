import mongoose from "mongoose";

export async function GET(request: Request) {

  return Response.json({
    app: "up",
    db: mongoose.connection.readyState
  })
}
