interface ImportMetaEnv {
    readonly VITE_COS_SECRETID: string
    readonly VITE_COS_SECRETKEY: string
    readonly VITE_COS_BUCKET: string
    readonly VITE_COS_REGION: string
    // more env variables...
  }
  
  interface ImportMeta {
    readonly env: ImportMetaEnv
  }