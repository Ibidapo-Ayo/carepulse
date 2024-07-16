import clsx from 'clsx'
import { Plus } from 'lucide-react'
import Image from 'next/image'
import React from 'react'

interface StatCardProps {
    type: "appointments" | "pending" | "cancelled" | "doctors",
    count: number,
    label: string,
    icon: string,
    children?: React.ReactNode
}

const StatCard = ({ type, count, label, icon, children }: StatCardProps) => {
    return (
        <div
            className={clsx("stat-card", {
                "bg-appointments": type === "appointments",
                "bg-pending": type === "pending",
                "bg-cancelled": type === "cancelled",
                "bg-doctors": type === "doctors"
            })}
        >
            <div className='flex items-center gap-4'>
                <Image src={icon} height={32} width={32} alt="label" className='size-8 w-fit' />
                <h2 className='text-32-bold text-white'>{count}</h2>
                <p className='text-14-regular'>{label} </p>
                {children && children}
            </div>
        </div>
    )
}

export default StatCard