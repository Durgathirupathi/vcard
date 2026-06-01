import { NextResponse } from 'next/server';

export const runtime = 'nodejs'; // Use nodejs environment for standard file operations and fetch proxies

const ALLOWED_FORMATS = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

export async function POST(request: Request) {
  try {
    const apiKey = process.env.IMGBB_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: 'Server configuration error: ImgBB API key not loaded.' },
        { status: 500 }
      );
    }

    const formData = await request.formData();
    const file = formData.get('image') as File | null;

    if (!file) {
      return NextResponse.json(
        { error: 'Validation failed: No image file provided.' },
        { status: 400 }
      );
    }

    // Server-side type and size validation
    if (!ALLOWED_FORMATS.includes(file.type)) {
      return NextResponse.json(
        { error: `Validation failed: Unsupported format "${file.type}". Allowed formats: JPG, JPEG, PNG, WEBP.` },
        { status: 400 }
      );
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: `Validation failed: File size exceeds the 10MB limit.` },
        { status: 400 }
      );
    }

    // Convert file to buffer and then to base64 for ImgBB API transfer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const base64Image = buffer.toString('base64');

    // Build the payload for ImgBB
    const imgbbFormData = new FormData();
    imgbbFormData.append('image', base64Image);

    // Call ImgBB API
    const response = await fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, {
      method: 'POST',
      body: imgbbFormData,
    });

    const data = await response.json();

    if (!response.ok || !data.success) {
      console.error('ImgBB API Upload Error:', data);
      return NextResponse.json(
        { error: data.error?.message || 'ImgBB upload server failed.' },
        { status: response.status || 500 }
      );
    }

    // Success response structure required: data.url, data.display_url, data.delete_url
    return NextResponse.json({
      success: true,
      data: {
        id: data.data.id,
        url: data.data.url,
        display_url: data.data.display_url,
        delete_url: data.data.delete_url,
      },
    });
  } catch (err: unknown) {
    console.error('API Upload Handler Exception:', err);
    const errMsg = err instanceof Error ? err.message : 'Internal Server Error';
    return NextResponse.json(
      { error: errMsg },
      { status: 500 }
    );
  }
}
