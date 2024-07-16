import AppointmentForm from "@/components/forms/AppointmentForm";
import { getPatient } from "@/lib/actions/patient.actions";
import { Copyright } from "lucide-react";
import Image from "next/image";

export default async function NewAppointment({ params: { userId } }: SearchParamProps) {
  const patient = await getPatient(userId)
  return (
    <div className="flex h-screen max-h-screen">
      <section className="remove-scrollbar container my-auto">
        <div className="sub-container max-w-[860px] flex-1 justify-between">
          <Image src="/assets/icons/logo-full.svg" width={1000} height={1000} alt="patient" className="mb-12 h-10 w-fit" />

          <AppointmentForm
            userId={userId}
            type="create"
            patientId={patient?.$id}

          />

          <p className="flex space-x-2 copyright mt-10 py-12"> <Copyright className="w-4" /> <span>2024 CarePulse</span></p>
        </div>
      </section>


      <Image src={"/assets/images/appointment-img.png"}
        height={1000}
        width={1000}
        alt="Onboarding Image"
        className="side-img max-w-[390px] bg-bottom"
      />
    </div>
  );
}
