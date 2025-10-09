import { NextResponse, type NextRequest } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: RouteContext<"/r/[id]">
) {
  const param = await params;

  return NextResponse.json({
    id: param.id,
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    location: req.geo
  });
}
