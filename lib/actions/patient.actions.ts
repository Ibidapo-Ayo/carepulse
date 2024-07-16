"use server"
import { ID, Query } from "node-appwrite"
import {databases, storage, users } from "../appwrite.config"
import { InputFile } from "node-appwrite/file"
import { CreateUserParams, RegisterUserParams } from "@/types"

export const createUser = async (user: CreateUserParams) => {
    try {
        const newUser = await users.create(ID.unique(), user.email, user.phone, undefined, user.name)
        return newUser
    } catch (error: any) {
        if (error && error?.code === 409) {
            const documents = await users.list([
                Query.equal("email", [user.email])
            ])

            return documents?.users[0]
        }
    }
}

export const getUser = async (userId: string) => {
    try {
        const user = await users.get(userId)
        return user
    } catch (error) {
        console.log(error)
    }
}
export const getPatient = async (userId: string) => {
    try {
        const patient = await databases.listDocuments(
            process.env.DATABASE_ID!,
            process.env.PATIENT_COLLECTION_ID!,
            [Query.equal("userId", userId)]
        )
        return patient.documents[0]
    } catch (error) {
        console.log(error)
    }
}

export const registerPatient = async ({ identificationDocument, ...patient }: RegisterUserParams) => {
    try {
        let file;
        if (identificationDocument) {
            const inputFile = InputFile.fromBuffer(identificationDocument?.get("blobFile") as Blob,
                identificationDocument?.get("fileName") as string)

            file = await storage.createFile(process.env.NEXT_PUBLIC_BUCKET_ID!, ID.unique(), inputFile)
        }

        const newPatient = await databases.createDocument(
            process.env.DATABASE_ID!,
            process.env.PATIENT_COLLECTION_ID!,
            ID.unique(),
            {
                identificationDocumentId: file?.$id || null,
                identificationDocumentUrl: `${process.env.NEXT_PUBLIC_ENDPOINT}/storage/buckets/${process.env.NEXT_PUBLIC_BUCKET_ID}/files/${file?.$id}/view?project=${process.env.PROJECT_ID}`,
                ...patient
            }
        )
        return newPatient
    } catch (error) {
        console.log(error)
    }
}   