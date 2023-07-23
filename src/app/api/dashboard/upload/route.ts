import { generateUploadURL } from "@/lib/s3";
import { url } from "inspector";
import { NextApiRequest, NextApiResponse } from "next";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest, res: NextApiResponse) {
  const fileType = req.nextUrl.searchParams.get("fileType") as string;
  const { uploadURL, imageName } = await generateUploadURL(fileType);

  return new Response(
    JSON.stringify({
      uploadURL,
      imageName,
    })
  );
}
