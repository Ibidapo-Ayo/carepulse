import * as sdk from "node-appwrite"


export const PROJECT_ID = "668c825a002eebf419aa"
export const API_KEY = "af5d20b418c6361a6aeac555ccc83865295917513a3426d97c54c409678906ffe92f779c9040c668437bee80cb756c251deb6bcbdb714b9fb2df6a9597e1a8afa16ab4ab8ed5e17c7266d3188bd93c0624f7cc4cafa3e94f82497ba8b340ffa7bc37623ac6c9feca4f92815972343ca4710a310820888d1cf54cbdabff587d22"
export const DATABASE_ID = "668c82ea000bceed1d02"
export const PATIENT_COLLECTION_ID = "668c8305001ed6782912"
export const DOCTOR_COLLECTION_ID = "668c833b0018473d185c"
export const APPOINTMENT_COLLECTION_ID = "668c8356003a47a6ccd1"
export const NEXT_PUBLIC_BUCKET_ID = "668c839000245f76ca25"
export const NEXT_PUBLIC_ENDPOINT = "https://cloud.appwrite.io/v1"


const client = new sdk.Client()

client.setEndpoint(NEXT_PUBLIC_ENDPOINT!).setProject(PROJECT_ID!).setKey(API_KEY!)

export const databases = new sdk.Databases(client)
export const storage = new sdk.Storage(client)
export const messaging = new sdk.Messaging(client)
export const users = new sdk.Users(client)
