import type { MnemonicExif, MnemonicMetadata } from "@/types/mnemonic"
import exifr from "exifr"


export async function getExif(file: File): Promise<MnemonicMetadata> {
  const [dimensions, exifData, gpsData] = await Promise.all([
    getImageDimensions(file),
    exifr.parse(file, [
      'Make', 'Model', 'DateTimeOriginal', 'ExposureTime', 'FNumber',
      'ISOSpeedRatings', 'FocalLength', 'LensModel', 'GPSAltitude'
    ]),
    exifr.gps(file)
  ])

  const location = gpsData ? {
    latitude: gpsData.latitude,
    longitude: gpsData.longitude,
    altitude: exifData?.GPSAltitude || null
  } : undefined

  // Retrieve altitude if not in gps helper but available in full parse if needed, 
  // but for now let's stick to what we have or parse GPSAltitude separately if needed.
  // Actually exifr.gps() usually just returns lat/lon. 
  // If we want altitude we might need to look at exifData if we included GPS tags.

  const exif: MnemonicExif = {
    make: exifData?.Make,
    model: exifData?.Model,
    dateTimeOriginal: exifData?.DateTimeOriginal ? new Date(exifData?.DateTimeOriginal).toISOString() : null,
    exposureTime: exifData?.ExposureTime ? String(exifData?.ExposureTime) : null,
    fNumber: exifData?.FNumber,
    isoSpeedRatings: exifData?.ISOSpeedRatings,
    focalLength: exifData?.FocalLength,
    lensModel: exifData?.LensModel,
  }

  const res: MnemonicMetadata = {
    width: dimensions.width,
    height: dimensions.height,
    size: file.size,
    mimeType: file.type,
    exif,
    location,
  }
  return res
}

function getImageDimensions(file: File): Promise<{ width: number; height: number }> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    const url = URL.createObjectURL(file)
    img.onload = () => {
      resolve({ width: img.width, height: img.height })
      URL.revokeObjectURL(url)
    }
    img.onerror = (err) => {
      reject(err)
      URL.revokeObjectURL(url)
    }
    img.src = url
  })
}