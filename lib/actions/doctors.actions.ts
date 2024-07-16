"use server"

import { ID, Query } from "node-appwrite"
import { DATABASE_ID, databases, DOCTOR_COLLECTION_ID, storage } from "../appwrite.config"
import { revalidatePath } from "next/cache"
import { InputFile } from "node-appwrite/file"
import { CreateDoctorParams } from "@/types"
import { Doctor } from "@/types/appwrite.types"

export const createDoctor = async ({ image, ...value }: CreateDoctorParams) => {
    try {
        let file;
        if (image) {
            const inputFile = InputFile.fromBuffer(image?.get("blobFile") as Blob,
                image?.get("fileName") as string)

            file = await storage.createFile(process.env.NEXT_PUBLIC_BUCKET_ID!, ID.unique(), inputFile)
        }
        const newDoctor = await databases.createDocument(
            DATABASE_ID!,
            DOCTOR_COLLECTION_ID!,
            ID.unique(),
            {
                name: value.name,
                phone: value.phone,
                email: value.email,
                image: `${process.env.NEXT_PUBLIC_ENDPOINT}/storage/buckets/${process.env.NEXT_PUBLIC_BUCKET_ID}/files/${file?.$id}/view?project=${process.env.PROJECT_ID}`,
                imageId: file?.$id
            }
        )
        revalidatePath("/admin")
        return newDoctor
    } catch (error) {
        if (typeof error === "string") {
            throw new Error(error)
        } else {
            throw new Error()
        }
    }
}

export const getDoctors = async () => {
    try {
        const doctors = await databases.listDocuments(
            process.env.DATABASE_ID!,
            process.env.DOCTOR_COLLECTION_ID!,
            [Query.orderDesc('$createdAt')]
        )

        return doctors.documents
    } catch (error) {
        if (typeof error === "string") {
            throw new Error(error)
        } else {
            throw new Error()
        }
    }
}

export const updateDoctor = async (doctorId: string, doctor: {
    name: string,
    phone: string,
    email: string,
}) => {
    try {
        const updatedDoctor = await databases.updateDocument(
            process.env.DATABASE_ID!,
            process.env.DOCTOR_COLLECTION_ID!,
            doctorId,
            doctor
        )

        if (!updatedDoctor) {
            throw new Error("Doctor not found")
        }

        revalidatePath("/admin")
        return updatedDoctor
    } catch (error) {
        console.log(error)
    }
}