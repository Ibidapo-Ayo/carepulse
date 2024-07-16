"use client"
import { z } from "zod"
import { Form } from "../ui/form"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import CustomInput from "../Input"
import SubmitButton from "../SubmitButton"
import { useState } from "react"
import { DoctorFormValidation } from "@/lib/validation"
import { useRouter } from "next/navigation"
import { FormFieldTypes } from "./PatientForm"
import { Appointment, Doctor } from "@/types/appwrite.types"
import FileUploader from "../FileUploader"
import { createDoctor, updateDoctor } from "@/lib/actions/doctors.actions"


const DoctorsForm = ({ type, setOpen, doctor }: {
    type: "create" | "update",
    appointment?: Appointment,
    setOpen: (open: boolean) => void,
    doctor?: Doctor
}) => {
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(false)

    const form = useForm<z.infer<typeof DoctorFormValidation>>({
        resolver: zodResolver(DoctorFormValidation),
        defaultValues: {
            name: doctor?.name || "",
            phone: doctor?.phone || "",
            email: doctor?.email || "",
        },
    })

    const onSubmit = async (values: z.infer<typeof DoctorFormValidation>) => {
        setIsLoading(true)
        const formData = new FormData()
        if (values.image) {
            const blobFile = new Blob([values.image[0]], {
                type: values.image[0].type
            })

            formData.append("blobFile", blobFile)
            formData.append("fileName", values.image[0].name)
        }
        if (type === "create") {
            try {
                const doctor = await createDoctor({ ...values, image: formData })
                if (doctor) {
                    form.reset()
                    setOpen(false)
                }
            } catch (error) {
                console.log(error)
            } finally {
                setIsLoading(false)
            }
        } else {
            try {
                const updatedDoctor = await updateDoctor(doctor!.$id, values)
                if (updatedDoctor) {
                    form.reset()
                    setOpen(false)
                }
            } catch (error) {
                console.log(error)
            } finally {
                setIsLoading(false)
            }
        }
    }


    const buttonLabel = () => {
        switch (type) {
            case "create":
                return "Add Doctor"
                break;
            case "update":
                return "Update"
            default:
                break;
        }
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 flex-1">

                <CustomInput
                    fieldType={FormFieldTypes.INPUT}
                    label="Name"
                    control={form.control}
                    name="name"
                    iconSrc="/assets/icons/user.svg"
                    iconAlt="doctor"
                    placeholder="Enter Doctor's name"

                />
                <CustomInput
                    fieldType={FormFieldTypes.INPUT}
                    label="Email"
                    control={form.control}
                    name="email"
                    iconSrc="/assets/icons/email.svg"
                    iconAlt="email"
                    placeholder="Enter doctor's Email"

                />
                <CustomInput
                    fieldType={FormFieldTypes.PHONE_INPUT}
                    label="Phone Number"
                    control={form.control}
                    name="phone"
                    placeholder="(234) 706 540 3591"

                />
                <CustomInput
                    control={form.control}
                    name="image"
                    fieldType={FormFieldTypes.SKELETON}
                    label="Doctor's Profile Picture"
                    renderSkeleton={(field) => {
                        return (
                            <FileUploader type="doctor" files={field.value} onChange={field.onChange} />
                        )
                    }}
                />

                <SubmitButton isLoading={isLoading} className={`${type === "update" ? "shad-gray-btn" : "shad-primary-btn"} w-full`}>
                    {buttonLabel()}
                </SubmitButton>
            </form>
        </Form>
    )
}
export default DoctorsForm