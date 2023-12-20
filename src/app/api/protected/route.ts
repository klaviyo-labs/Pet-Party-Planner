import jwt, {JwtPayload} from "jsonwebtoken";
import {NextRequest, NextResponse} from "next/server";
import { headers } from "next/headers";

const expired = NextResponse.json(
        { message: "Expired" },
        {
          status: 401,
        }
      );

const unauthorized = NextResponse.json(
      { message: "Unauthorized" },
      {
        status: 403,
      }
    );

export async function GET(req: NextRequest) {

  try {
    const headersInstance = headers();
    const authHeader = headersInstance.get("authorization");

    // @ts-ignore - error is caught and handled
    const token = authHeader.split(" ")[1];

    // @ts-ignore - this is verified to exist in next.config.js on startup
    const decoded: JwtPayload = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded || !decoded.exp) {
      return expired
    } else if (decoded.exp < Math.floor(Date.now() / 1000)) {
      return expired
    } else {
      // If the token is valid, return some protected data.
      return NextResponse.json(
        { data: "Protected data" },
        {
          status: 200,
        }
      );
    }
  } catch (error) {
    return unauthorized
  }
}
