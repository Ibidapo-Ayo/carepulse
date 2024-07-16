"use client"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { useState } from "react"
import { Button } from "./ui/button"
import DoctorsForm from "./forms/DoctorsForm"
import { Edit, Plus } from "lucide-react"
import { Doctor } from "@/types/appwrite.types"


const DoctorsModal = ({ type, doctor }: {
    type: "create" | "update",
    doctor?: Doctor,
}) => {
    const [open, setOpen] = useState(false)
    return (
        <Dialog open={open} onOpenChange={setOpen}>

            {type === "create" && (
                <DialogTrigger asChild>
                    <Button variant={"ghost"} size={"icon"} className={`capitalize text-green-500}`}>
                        <Plus />
                    </Button>
                </DialogTrigger>
            )}
            {type === "update" && (
                <DialogTrigger asChild>
                    <Button variant={"ghost"} size={"icon"} className={`capitalize text-green-500}`}>
                        <Edit />
                    </Button>
                </DialogTrigger>
            )}
            <DialogContent className="shad-dialog sm:max-w-md">
                <DialogHeader className="mb-4 space-y-3">
                    <DialogTitle className="capitalize"> {type} Doctor</DialogTitle>
                    <DialogDescription>
                        Please fill in the following details to {type} an doctor
                    </DialogDescription>
                </DialogHeader>

                <DoctorsForm
                    type={type}
                    setOpen={setOpen}
                    doctor={doctor}
                />
            </DialogContent>
        </Dialog>

    )
}

export default DoctorsModal