
export type MnemonicExif = {
  make?: string | null
  model?: string | null
  dateTimeOriginal?: string | null
  exposureTime?: string | null
  fNumber?: number | null
  isoSpeedRatings?: number | null
  focalLength?: number | null
  lensModel?: string | null
}

export type MnemonicLocation = {
  latitude?: number | null
  longitude?: number | null
  altitude?: number | null
}

export type MnemonicMetadata = {
  width?: number
  height?: number
  size?: number
  mimeType?: string
  exif?: MnemonicExif
  location?: MnemonicLocation
}

export type Mnemonic = {
  id: string
  url: string
  metadata: MnemonicMetadata;
}

export type CreateMnemonicParams = Omit<Mnemonic, 'id'>