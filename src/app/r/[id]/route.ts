import { geolocation } from "@vercel/functions";
import { eq } from "drizzle-orm";
import { type NextRequest, NextResponse } from "next/server";
import { getCountryName } from "~/lib/get-country-name";
import { database } from "~/server/database/index.database";
import { clicksSchema, urlSchema } from "~/server/database/index.schema";

export async function GET(
  req: NextRequest,
  { params }: RouteContext<"/r/[id]">
) {
  try {
    const param = await params;

    const location = geolocation(req);
    const origin = getCountryName(location.country);

    const url = await database.query.urlSchema.findFirst({
      where: eq(urlSchema.id, param.id)
    });

    if (!url)
      return NextResponse.json(
        {
          success: false,
          message: "The requested url either doesn't exist or is expired."
        },
        { status: 404 }
      );

    await database.insert(clicksSchema).values({
      urlId: url.id,
      origin
    });

    return NextResponse.redirect(url.originalUrl);
  } catch (error: unknown) {
    console.log(error);

    return NextResponse.json(
      {
        message: "Internal Server Error"
      },
      { status: 500 }
    );
  }
}
