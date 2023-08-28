/// <reference types="vite/client" />
interface ImportMetaEnv {
  readonly VITE_API_URL: string
  readonly VITE_REGION: string
  readonly VITE_BUCKET: string
  readonly VITE_USER_POOL_ID: string
  readonly VITE_USER_POOL_CLIENT_ID: string
  readonly VITE_IDENTITY_POOL_ID: string
}
interface ImportMeta {
  readonly env: ImportMetaEnv
}