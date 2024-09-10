// env.d.ts
declare namespace NodeJS {
  interface ProcessEnv {
    PG_USER: string
    PG_PASSWORD: string
    PG_DB: string
    PG_HOST: string
    PG_PORT: string
  }
}
