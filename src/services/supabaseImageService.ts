import { supabase, isSupabaseConfigured } from "../config/supabase";

export interface UploadResult {
  url: string;
  path: string;
  error?: string;
}

export const createSupabaseImageService = () => {
  const uploadImage = async (
    file: File,
    path: string
  ): Promise<UploadResult> => {
    if (!isSupabaseConfigured) {
      // Mock upload for development
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = () => {
          resolve({
            url: reader.result as string,
            path: `mock/${Date.now()}-${file.name}`,
          });
        };
        reader.readAsDataURL(file);
      });
    }

    try {
      // Generate unique filename
      const fileExt = file.name.split(".").pop();
      const fileName = `${Date.now()}-${Math.random()
        .toString(36)
        .substring(2)}.${fileExt}`;
      const filePath = `${path}/${fileName}`;

      // Upload file to Supabase Storage
      const { data, error } = await supabase.storage
        .from("car-images")
        .upload(filePath, file);

      if (error) {
        throw error;
      }

      // Get public URL
      const {
        data: { publicUrl },
      } = supabase.storage.from("car-images").getPublicUrl(filePath);

      return {
        url: publicUrl,
        path: data.path,
      };
    } catch (error) {
      console.error("Error uploading image:", error);
      return {
        url: "",
        path: "",
        error: error instanceof Error ? error.message : "Upload failed",
      };
    }
  };

  const uploadMultipleImages = async (
    files: File[],
    path: string
  ): Promise<UploadResult[]> => {
    const uploadPromises = files.map((file) => uploadImage(file, path));
    return Promise.all(uploadPromises);
  };

  const deleteImage = async (path: string): Promise<boolean> => {
    if (!isSupabaseConfigured) {
      // Mock delete
      return true;
    }

    try {
      const { error } = await supabase.storage
        .from("car-images")
        .remove([path]);

      if (error) {
        throw error;
      }

      return true;
    } catch (error) {
      console.error("Error deleting image:", error);
      return false;
    }
  };

  const deleteMultipleImages = async (paths: string[]): Promise<boolean> => {
    if (!isSupabaseConfigured) {
      // Mock delete
      return true;
    }

    try {
      const { error } = await supabase.storage.from("car-images").remove(paths);

      if (error) {
        throw error;
      }

      return true;
    } catch (error) {
      console.error("Error deleting images:", error);
      return false;
    }
  };

  return {
    uploadImage,
    uploadMultipleImages,
    deleteImage,
    deleteMultipleImages,
  };
};
