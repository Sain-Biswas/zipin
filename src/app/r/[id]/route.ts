import { geolocation } from "@vercel/functions";
import { type NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: RouteContext<"/r/[id]">
) {
  try {
    const param = await params;

    const location = geolocation(req);

    return NextResponse.json(
      {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        id: param.id,
        location
      },
      { status: 200 }
    );
  } catch (error: unknown) {
    console.log(error);

    return NextResponse.json(
      {
        massage: "Internal Server Error"
      },
      { status: 500 }
    );
  }
}
