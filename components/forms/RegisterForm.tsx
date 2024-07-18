"use client"
import { z } from "zod"
import { Form, FormControl } from "../ui/form"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import CustomInput from "../Input"
import SubmitButton from "../SubmitButton"
import { useState } from "react"
import { PatientFormValidation } from "@/lib/validation"
import { useRouter } from "next/navigation"
import { createUser, registerPatient } from "@/lib/actions/patient.actions"
import { FormFieldTypes } from "./PatientForm"
import { RadioGroup, RadioGroupItem } from "../ui/radio-group"
import { Doctors, GenderOptions, IdentificationTypes, PatientFormDefaultValues } from "@/constants"
import { Label } from "../ui/label"
import { SelectItem } from "../ui/select"
import Image from "next/image"
import FileUploader from "../FileUploader"
import { CreateDoctorParams, User } from "@/types"
import { Doctor } from "@/types/appwrite.types"


const RegisterForm = ({ user, doctor }: {
    user: any,
    doctor: any
}) => {
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(false)

    const form = useForm<z.infer<typeof PatientFormValidation>>({
        resolver: zodResolver(PatientFormValidation),
        defaultValues: {
            ...PatientFormDefaultValues,
            name: "",
            email: "",
            phone: ""
        },
    })

    const onSubmit = async (values: z.infer<typeof PatientFormValidation>) => {
        setIsLoading(true)
        const formData = new FormData()

        if (values.identificationDocument && values.identificationDocument.length > 0) {
            const blobFile = new Blob([values.identificationDocument[0]], {
                type: values.identificationDocument[0].type
            })

            formData.append("blobFile", blobFile)
            formData.append("fileName", values.identificationDocument[0].name)
        }
        try {
            const patientData = {
                ...values,
                userId: user.$id,
                birthDate: new Date(values.birthDate),
                identificationDocument: formData,
                gender: values.gender.toLowerCase()
            }

            // @ts-ignore
            const patient = await registerPatient(patientData)
            if (patient) router.push(`/patient/${user.$id}/new-appointment`)
        } catch (error) {
            console.log(error)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-12 flex-1">
                <section className="space-y-4">
                    <h1 className="header"> Welcome👋</h1>
                    <p className="text-dark-700">Let us know more about yourself.</p>
                </section>
                <section className="space-y-4">
                    <div className="mb-9 space-y-1">
                        <h2 className="sub-header"> Personal Information</h2>
                    </div>
                </section>
                <CustomInput
                    control={form.control}
                    fieldType={FormFieldTypes.INPUT}
                    name="name"
                    placeholder="John Doe"
                    iconSrc="/assets/icons/user.svg"
                    iconAlt="user"
                    label="Full name"
                />
                <div className="flex flex-col gap-6 xl:flex-row">
                    <CustomInput
                        control={form.control}
                        fieldType={FormFieldTypes.INPUT}
                        name="email"
                        placeholder="johndoe@gmail.com"
                        iconSrc="/assets/icons/email.svg"
                        iconAlt="user"
                        label="Email"
                    />

                    <CustomInput
                        control={form.control}
                        fieldType={FormFieldTypes.PHONE_INPUT}
                        name="phone"
                        placeholder="(234) 706 540 3591"
                        label="Phone Number"
                    />
                </div>
                <div className="flex flex-col gap-6 xl:flex-row">
                    <CustomInput
                        control={form.control}
                        fieldType={FormFieldTypes.DATE_PICKER}
                        name="birthDate"
                        placeholder="johndoe@gmail.com"
                        iconSrc="/assets/icons/email.svg"
                        iconAlt="user"
                        label="Date of Birth"
                    />

                    <CustomInput
                        control={form.control}
                        fieldType={FormFieldTypes.SKELETON}
                        name="gender"
                        label="Gender"
                        renderSkeleton={(field) => {
                            return (
                                <FormControl>
                                    <RadioGroup className="flex h-11 gap-6 xl:justify-between"
                                        onValueChange={field.onChange}
                                        defaultValue={field.value}
                                    >
                                        {GenderOptions.map((option) => (
                                            <div key={option} className="radio-group">
                                                <RadioGroupItem value={option}
                                                    id={option}
                                                />
                                                <Label htmlFor={option} className="cursor-pointer">
                                                    {option}
                                                </Label>
                                            </div>
                                        ))}
                                    </RadioGroup>
                                </FormControl>
                            )
                        }}
                    />
                </div>

                <div className="flex flex-col gap-6 xl:flex-row">
                    <CustomInput
                        control={form.control}
                        fieldType={FormFieldTypes.INPUT}
                        name="address"
                        placeholder="54 uka street, Owo, Ondo State"
                        label="Address"
                    />

                    <CustomInput
                        control={form.control}
                        fieldType={FormFieldTypes.INPUT}
                        name="occupation"
                        placeholder="Software Engineer"
                        label="Occupation"
                    />
                </div>
                <div className="flex flex-col gap-6 xl:flex-row">
                    <CustomInput
                        control={form.control}
                        fieldType={FormFieldTypes.INPUT}
                        name="emergencyContactName"
                        placeholder="Guardian's Name"
                        label="Emergency Contact Name"
                    />

                    <CustomInput
                        control={form.control}
                        fieldType={FormFieldTypes.PHONE_INPUT}
                        name="emergencyContactNumber"
                        placeholder="(234) 706 540 3591"
                        label="Emergency Contact Number"
                    />
                </div>

                <section className="space-y-4">
                    <div className="mb-9 space-y-1">
                        <h2 className="sub-header"> Medical Information</h2>
                    </div>
                </section>

                <CustomInput
                    control={form.control}
                    fieldType={FormFieldTypes.SELECT}
                    name="primaryPhysician"
                    placeholder="Select Primary Physician"
                    label="Primary Physician"
                >
                    {doctor.map((doc: CreateDoctorParams) => {
                        return (
                            <SelectItem value={doc.name} key={doc.name}>
                                <div className="flex cursor-pointer items-center gap-2">
                                    <Image src={`${doc.image}`} width={32} height={32} alt={doc.name} className="rounded-full border border-dark-500" />
                                    <p>{doc.name}</p>
                                </div>
                            </SelectItem>
                        )
                    })}
                </CustomInput>

                <div className="flex flex-col gap-6 xl:flex-row">
                    <CustomInput
                        control={form.control}
                        fieldType={FormFieldTypes.INPUT}
                        name="insuranceProvider"
                        placeholder="BlueCross BlueShield"
                        label="Insurance Provider"
                    />

                    <CustomInput
                        control={form.control}
                        fieldType={FormFieldTypes.INPUT}
                        name="insurancePolicyNumber"
                        placeholder="ABC123456789"
                        label="Insurance Policy Number"
                    />
                </div>
                <div className="flex flex-col gap-6 xl:flex-row">
                    <CustomInput
                        control={form.control}
                        fieldType={FormFieldTypes.TEXTAREA}
                        name="allergies"
                        placeholder="Peanuts, Penicillin, Pollen"
                        label="Allergies (if any)"
                    />

                    <CustomInput
                        control={form.control}
                        fieldType={FormFieldTypes.TEXTAREA}
                        name="currentMedication"
                        placeholder="Ibuprofen 200mg, Paracetamol 500mg"
                        label="Current medication (if any)"
                    />
                </div>

                <div className="flex flex-col gap-6 xl:flex-row">
                    <CustomInput
                        control={form.control}
                        fieldType={FormFieldTypes.TEXTAREA}
                        name="familyMedicalHistory"
                        placeholder="Mother had brain cancer, Father had heart disease"
                        label="Family Medical History"
                    />

                    <CustomInput
                        control={form.control}
                        fieldType={FormFieldTypes.TEXTAREA}
                        name="pastMedicalHistory"
                        placeholder="Appendectomy, Tonsillectomy"
                        label="Past Medical History"
                    />
                </div>

                <section className="space-y-4">
                    <div className="mb-9 space-y-1">
                        <h2 className="sub-header"> Identification Verification</h2>
                    </div>
                </section>
                <CustomInput
                    control={form.control}
                    fieldType={FormFieldTypes.SELECT}
                    name="identificationType"
                    placeholder="Select Identification Type"
                    label="Identification type"
                >
                    {IdentificationTypes.map((type) => {
                        return (
                            <SelectItem value={type} key={type}>
                                {type}
                            </SelectItem>
                        )
                    })}
                </CustomInput>

                <CustomInput
                    control={form.control}
                    fieldType={FormFieldTypes.SKELETON}
                    name="identificationDocument"
                    label="Scanned Identification Document"
                    renderSkeleton={(field) => {
                        return (
                            <FormControl>
                                <FileUploader files={field.value} onChange={field.onChange} />
                            </FormControl>
                        )
                    }}
                />

                <CustomInput
                    control={form.control}
                    fieldType={FormFieldTypes.INPUT}
                    name="identificationNumber"
                    placeholder="123456789"
                    label="Identification Number"
                />

                <section className="space-y-4">
                    <div className="mb-9 space-y-1">
                        <h2 className="sub-header">Consent and Privacy </h2>
                    </div>
                </section>

                <CustomInput
                    fieldType={FormFieldTypes.CHECKBOX}
                    control={form.control}
                    name="treatmentConsent"
                    label="I consent to treatment"
                />

                <CustomInput
                    fieldType={FormFieldTypes.CHECKBOX}
                    control={form.control}
                    name="disclosureConsent"
                    label="I consent to disclosure of information"
                />
                <CustomInput
                    fieldType={FormFieldTypes.CHECKBOX}
                    control={form.control}
                    name="privacyConsent"
                    label="I consent to privacy policy"
                />


                <SubmitButton isLoading={isLoading}>
                    Submit
                </SubmitButton>
            </form>
        </Form>
    )
}
export default RegisterForm