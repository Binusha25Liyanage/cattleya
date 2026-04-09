import { cloudinary } from "../config/cloudinary";

export async function uploadDesignImage(url: string, designId: string) {
  const result = await cloudinary.uploader.upload(url, {
    folder: "cattleya/designs",
    public_id: designId,
    resource_type: "image",
  });
  return result.secure_url;
}

export async function uploadProductImages(files: Array<{ path: string }>) {
  const uploads = await Promise.all(
    files.map((file) =>
      cloudinary.uploader.upload(file.path, {
        folder: "cattleya/products",
        resource_type: "image",
      })
    )
  );
  return uploads.map((file: { secure_url: string }) => file.secure_url);
}
