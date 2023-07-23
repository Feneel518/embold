import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
} from "@aws-sdk/client-s3";
import { randomUUID } from "crypto";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import axios from "axios";

const region = "ap-south-1";
const bucketName = "embold";
const accessKeyId = process.env.S3_ACCESS_KEY as string;
const secretAccessKey = process.env.S3_SECRET_ACCESS_KEY as string;

const s3 = new S3Client({
  region,
  credentials: {
    accessKeyId,
    secretAccessKey,
  },
});

export async function generateUploadURL(contentType: string) {
  const imageName = randomUUID();

  const ex = contentType.split("/")[1];

  const params = {
    Bucket: bucketName,
    Key: `uploads/${imageName}.${ex}`,
    contentType: contentType,
  };

  const command = new PutObjectCommand(params);

  const uploadURL = await getSignedUrl(s3, command);
  return { uploadURL, imageName };
}

export async function fetObject(key: string) {
  const command = new GetObjectCommand({
    Bucket: bucketName,
    Key: key,
  });

  const url = await getSignedUrl(s3, command);
  return url;
}

export async function uploadToS3(e: React.ChangeEvent<HTMLFormElement>) {
  const formData = new FormData(e.target);
  const file = formData.get("file");

  // @ts-ignore
  if (file?.size === 0) {
    return null;
  }

  // @ts-ignore
  const fileType = encodeURIComponent(file.type);
  const { data } = await axios.get(
    `/api/dashboard/upload?fileType=${fileType}`
  );
  const { uploadURL, imageName } = data;
  await axios.put(uploadURL, file);
  const imageUrl = uploadURL.split("?")[0];
  return imageUrl;
}
export async function uploadMultipleToS3(file: string) {
  // const formData = new FormData(e.target);
  // const file = formData.get("file");

  console.log(file);

  // @ts-ignore
  if (file?.size === 0) {
    return null;
  }

  // @ts-ignore
  const fileType = encodeURIComponent(file.type);
  const { data } = await axios.get(
    `/api/dashboard/upload?fileType=${fileType}`
  );
  const { uploadURL, imageName } = data;
  await axios.put(uploadURL, file);
  const imageUrl = uploadURL.split("?")[0];
  return imageUrl;
}
