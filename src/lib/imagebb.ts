/**
 * Client-side utility for validating, compressing, and proxy-uploading images to ImgBB.
 */

export interface ImgBBUploadResponse {
  success: boolean;
  data: {
    id: string;
    url: string;
    display_url: string;
    delete_url: string;
  };
}

/**
 * Validates an image file before upload.
 * Max size: 10MB
 * Supported formats: JPG, JPEG, PNG, WEBP
 */
export function validateImage(file: File): { isValid: boolean; error?: string } {
  const allowedFormats = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
  const maxSizeBytes = 10 * 1024 * 1024; // 10MB

  if (!allowedFormats.includes(file.type)) {
    return {
      isValid: false,
      error: `Unsupported image format "${file.type}". Allowed formats are JPG, JPEG, PNG, WEBP.`,
    };
  }

  if (file.size > maxSizeBytes) {
    return {
      isValid: false,
      error: 'File size exceeds the 10MB upload limit.',
    };
  }

  return { isValid: true };
}

/**
 * Client-side utility to compress image files using HTML5 Canvas.
 * Compresses images to webp format at 0.8 quality if they exceed dimensions.
 */
export async function compressImage(
  file: File,
  maxWidth = 1600,
  maxHeight = 1600,
  quality = 0.82
): Promise<File> {
  return new Promise((resolve, reject) => {
    // If browser environment is somehow not available, return original file
    if (typeof window === 'undefined') {
      return resolve(file);
    }

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;
      img.onload = () => {
        let width = img.width;
        let height = img.height;

        // Downscale calculations if dimensions exceed limits
        if (width > maxWidth || height > maxHeight) {
          if (width > height) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          } else {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          return resolve(file); // Fallback to original file if canvas context is not supported
        }

        ctx.drawImage(img, 0, 0, width, height);

        // Convert canvas output to blob
        canvas.toBlob(
          (blob) => {
            if (!blob) {
              return resolve(file);
            }
            // Generate a compressed File reference
            const compressedFile = new File([blob], file.name.replace(/\.[^/.]+$/, "") + ".webp", {
              type: 'image/webp',
              lastModified: Date.now(),
            });
            resolve(compressedFile);
          },
          'image/webp',
          quality
        );
      };
      img.onerror = (err) => reject(err);
    };
    reader.onerror = (err) => reject(err);
  });
}

/**
 * Uploads an image file to ImgBB by proxying the call through the internal /api/upload Route Handler.
 * Returns standard URLs and details.
 */
export async function uploadToImageBB(file: File): Promise<ImgBBUploadResponse> {
  // 1. Validation check
  const val = validateImage(file);
  if (!val.isValid) {
    throw new Error(val.error);
  }

  // 2. Client-side compression
  let fileToUpload = file;
  try {
    fileToUpload = await compressImage(file);
  } catch (err) {
    console.warn('Canvas image compression failed, falling back to original upload.', err);
  }

  // 3. FormData construction
  const formData = new FormData();
  formData.append('image', fileToUpload);

  // 4. API Request proxying
  const response = await fetch('/api/upload', {
    method: 'POST',
    body: formData,
  });

  const resData = await response.json();

  if (!response.ok) {
    throw new Error(resData.error || 'Failed to upload image to Server.');
  }

  return resData as ImgBBUploadResponse;
}
