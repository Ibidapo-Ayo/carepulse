"use client"

import { ColumnDef } from "@tanstack/react-table"
import StatusBadge from "../StatusBadge"
import { formatDateTime } from "@/lib/utils"
import { Doctors } from "@/constants"
import Image from "next/image"
import AppointmentModal from "../AppointmentModal"
import { Appointment, Doctor } from "@/types/appwrite.types"
import DoctorsModal from "../DoctorsModal"



export const AppointmentColums: ColumnDef<Appointment>[] = [
    {
        header: "ID",
        cell: ({ row }) => <p className="text-14-medium">{row.index + 1}</p>
    },

    {
        accessorKey: "patient",
        header: "Patient",
        cell: ({ row }) => <p className="text-14-medium">{row.original.patient.name}</p>
    },
    {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => (
            <div className="min-w-[155px]">
                <StatusBadge status={row.original.status} />
            </div>
        )
    },
    {
        accessorKey: "schedule",
        header: "Appointment",
        cell: ({ row }) => (
            <p className="text-14-regular min-w-[100px]">
                {formatDateTime(row.original.schedule).dateTime}
            </p>
        )
    },
    {
        accessorKey: "primaryPhysician",
        header: "Doctor",
        cell: ({ row }) => {
            const doctor = Doctors.find((doc) => doc.name === row.original.primaryPhysician)
            return (
                <div className="flex items-center gap-3 ">
                    <Image
                        src={doctor!.image}
                        alt={doctor!.name}
                        width={100}
                        height={100}
                        className="size-8"
                    />
                    <p className="whitespace-nowrap">
                        Dr. {doctor!.name}
                    </p>
                </div>
            )
        }
    },
    {
        id: "actions",
        header: () => <div className="pl-4">Actions</div>,
        cell: ({ row }) => {
            return (
                <div className="flex gap-1">
                    <AppointmentModal type={"schedule"}
                        patientId={row.original.patient.$id}
                        userId={row.original.userId}
                        appointment={row.original}
                    />
                    <AppointmentModal type={"cancel"}
                        patientId={row.original.patient.$id}
                        userId={row.original.userId}
                        appointment={row.original}

                    />
                </div>
            )
        },
    },
]

export const DoctorsColumns: ColumnDef<Doctor>[] = [
    {
        header: "ID",
        cell: ({ row }) => <p className="text-14-medium">{row.index + 1}</p>
    },
    {
        accessorKey: "name",
        header: "Doctor",
        cell: ({ row }) => <p className="text-14-medium">{row.original.name}</p>
    },
    {
        accessorKey: "email",
        header: "Email",
        cell: ({ row }) => <p className="text-14-medium">{row.original.email}</p>
    },
    {
        accessorKey: "phone",
        header: "Phone Number",
        cell: ({ row }) => <p className="text-14-medium">{row.original.phone}</p>
    },
    {
        accessorKey: "image",
        header: "Profile",
        cell: ({ row }) => <div className="flex items-center gap-3 ">
            <Image
                src={row.original.image}
                alt={row.original.name}
                width={100}
                height={100}
                className="size-8"
            />
            <p className="whitespace-nowrap">
                Dr. {row.original!.name}
            </p>
        </div>
    },
    {
        id: "actions",
        header: () => <div className="pl-4">Actions</div>,
        cell: ({ row }) => {
            return (
                <div className="flex gap-1">
                    <DoctorsModal
                    type="update"
                    doctor={row.original}
                    />
                </div>
            )
        },
    },
]
