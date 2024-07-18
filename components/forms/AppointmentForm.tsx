"use client"
import { z } from "zod"
import { Form } from "../ui/form"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import CustomInput from "../Input"
import SubmitButton from "../SubmitButton"
import { useState } from "react"
import { getAppointmentSchema } from "@/lib/validation"
import { useRouter } from "next/navigation"
import { FormFieldTypes } from "./PatientForm"
import { Doctors } from "@/constants"
import { SelectItem } from "../ui/select"
import Image from "next/image"
import { createAppointment, updateAppointment } from "@/lib/actions/appointment.actions"
import { Appointment } from "@/types/appwrite.types"
import { Status } from "@/types"


const AppointmentForm = ({ userId, type, patientId, appointment, setOpen }: {
    userId: string,
    patientId: string | undefined,
    type: "create" | "cancel" | "schedule",
    appointment?: Appointment,
    setOpen?: (open: boolean) => void
}) => {
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(false)

    const AppointmentFormValidation = getAppointmentSchema(type);

    const form = useForm<z.infer<typeof AppointmentFormValidation>>({
        resolver: zodResolver(AppointmentFormValidation),
        defaultValues: {
            primaryPhysician: appointment ? appointment.primaryPhysician : "",
            schedule: appointment ? new Date(appointment.schedule) : new Date(Date.now()),
            reason: appointment ? appointment.reason : "",
            note: appointment?.note || "",
            cancellationReason:  appointment?.cancellationReason || ""
        },
    })

    const onSubmit = async (values: z.infer<typeof AppointmentFormValidation>) => {
        setIsLoading(true)
        let status;
        switch (type) {
            case 'schedule':
                status = "scheduled";
                break;
            case 'cancel':
                status = "cancelled"
                break;
            default:
                status = "pending"
                break
        }

        try {
            if (type === "create" && patientId) {
                const appointmentData = {
                    userId: userId,
                    patient: patientId,
                    primaryPhysician: values.primaryPhysician,
                    schedule: new Date(values.schedule),
                    note: values.note,
                    status: status as Status,
                    reason: values.reason!
                }

                const appointment = await createAppointment(appointmentData)
                if (appointment) {
                    form.reset()
                    router.push(`/patient/${userId}/new-appointment/success?appointmentId=${appointment.$id}`)
                }
            } else {
                const appointmentToUpdate = {
                    userId,
                    appointmentId: appointment!.$id,
                    appointment: {
                        primaryPhysician: values?.primaryPhysician,
                        schedule: new Date(values.schedule),
                        status: status as Status,
                        cancellationReason: values.cancellationReason,
                        reason: values.reason,
                        note: values.note
                    },
                    type
                }

                const updatedAppointment = await updateAppointment(appointmentToUpdate)

                if (updatedAppointment) {
                    setOpen && setOpen(false)
                    form.reset()
                }
            }


        } catch (error) {
            console.log(error)
        }
    }


    const buttonLabel = () => {
        switch (type) {
            case "create":
                return "Create Appointment"
                break;
            case "cancel":
                return "Cancel Appointment"
            case "schedule":
                return "Schedule Appointment"
            default:
                break;
        }
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 flex-1">
                {type === "create" && (
                    <section>
                        <h1 className="header"> New Appointment</h1>
                        <p className="text-dark-700">Request a new appointment in 10 seconds.</p>
                    </section>
                )}
                {type !== "cancel" && (
                    <>
                        <CustomInput
                            control={form.control}
                            fieldType={FormFieldTypes.SELECT}
                            name="primaryPhysician"
                            placeholder="Select a doctor"
                            label="Doctor"
                        >
                            {Doctors.map((doctor) => {
                                return (
                                    <SelectItem value={doctor.name} key={doctor.name}>
                                        <div className="flex cursor-pointer items-center gap-2">
                                            <Image src={doctor.image} width={32} height={32} alt={doctor.name} className="rounded-full border border-dark-500" />
                                            <p>{doctor.name}</p>
                                        </div>
                                    </SelectItem>
                                )
                            })}
                        </CustomInput>

                        <CustomInput
                            fieldType={FormFieldTypes.DATE_PICKER}
                            control={form.control}
                            label="Expected appointment date"
                            showTimeSelect
                            dateFormat="MM/dd/yyy - h:mm aa"
                            name="schedule"
                        />

                        <div className="flex flex-col gap-6 xl:flex-row">
                            <CustomInput
                                fieldType={FormFieldTypes.TEXTAREA}
                                control={form.control}
                                name='reason'
                                label="Reason for appointment"
                                placeholder="Enter reason for appointment"

                            />
                            <CustomInput
                                fieldType={FormFieldTypes.TEXTAREA}
                                control={form.control}
                                name='note'
                                label="Notes"
                                placeholder="Enter notes"

                            />
                        </div>
                    </>
                )}

                {type === "cancel" && (
                    <CustomInput
                        fieldType={FormFieldTypes.TEXTAREA}
                        control={form.control}
                        name='cancellationReason'
                        label="Reason for cancellation"
                        placeholder="Enter reason for cancellation"

                    />
                )}
                <SubmitButton isLoading={isLoading} className={`${type === "cancel" ? "shad-danger-btn" : "shad-primary-btn"} w-full`}>
                    {buttonLabel()}
                </SubmitButton>
            </form>
        </Form>
    )
}
export default AppointmentForm