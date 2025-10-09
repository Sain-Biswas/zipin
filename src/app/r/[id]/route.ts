import { geolocation } from "@vercel/functions";
import { type NextRequest, NextResponse } from "next/server";
import { getCountryName } from "~/lib/get-country-name";

export async function GET(
  req: NextRequest,
  { params }: RouteContext<"/r/[id]">
) {
  try {
    const param = await params;

    const location = geolocation(req);

    return NextResponse.json(
      {
        id: param.id,
        random: getCountryName(location.country)
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
