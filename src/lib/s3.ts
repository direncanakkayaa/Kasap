import { S3Client } from "@aws-sdk/client-s3";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const s3Client = new S3Client({
  region: process.env.AWS_REGION || "eu-central-1",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || "",
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || "",
  },
});

export async function generatePresignedUrl(fileName: string, fileType: string) {
  const bucketName = process.env.AWS_S3_BUCKET_NAME;
  
  if (!bucketName) {
    throw new Error("AWS_S3_BUCKET_NAME is not defined in environment variables");
  }

  // Create a unique file name to avoid collisions
  const uniqueFileName = `${Date.now()}-${fileName}`;
  
  const command = new PutObjectCommand({
    Bucket: bucketName,
    Key: uniqueFileName,
    ContentType: fileType,
  });

  // URL expires in 60 seconds
  const presignedUrl = await getSignedUrl(s3Client, command, { expiresIn: 60 });
  
  // The final URL where the file will be accessible after upload
  const publicUrl = `https://${bucketName}.s3.${process.env.AWS_REGION}.amazonaws.com/${uniqueFileName}`;

  return { presignedUrl, publicUrl, key: uniqueFileName };
}
