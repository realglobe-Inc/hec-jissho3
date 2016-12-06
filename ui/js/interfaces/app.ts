/**
 * 経度、緯度
 */
export interface Location {
  lat: number
  lng: number
}

/**
 * 通報の詳細情報
 */
export interface ReportInfo {
  reportFullId: string
  location: Location // DB Model と違っているので注意
  event: string
  date: Date
  info: any
}

/**
 * 通報。IDで管理する
 */
export interface Report {
  reportFullId: string
  reportId: number
  actorKey: string
  reportAt: Date
  closedAt?: string
  isOpen: boolean
  latestInfo?: ReportInfo
}

/**
 * 地図上に表示するマーカーのタイプ
 */
export type MarkerType = 'report' | 'center' | 'drone' | 'person' | 'default'

/**
 * 地図上に表示するマーカー
 */
export interface Marker {
  id: number
  type: MarkerType
  name: string
  location: Location
  keys: {
    reportFullId?: string
    actorKey?: string
  }
}

/**
 * 写真の情報
 */
export interface PhotoInfo {
  id: number
  info: JSON | null
  image: string
  image_alt: null | string
  createdAt: Date | string
  updateAt: Date | string
  uuid: string
}

/**
 * SUGO-Caller のインスタンス
 */
export interface Caller {
  get(key: string): any
}