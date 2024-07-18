import PatientForm from "@/components/forms/PatientForm";
import PasskeyModal from "@/components/PasskeyModal";
import { SearchParamProps } from "@/types";
import { Copyright } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function Home({ searchParams }: SearchParamProps) {
  const isAdmin = searchParams.admin === "true"
  return (
    <div className="flex h-screen max-h-screen">
      {isAdmin && <PasskeyModal />}
      <section className="remove-scrollbar container my-auto">
        <div className="sub-container max-w-[496px]">
          <Image src="/assets/icons/logo-full.svg" width={1000} height={1000} alt="patient" className="mb-12 h-10 w-fit" />

          <PatientForm />

          <div className="text-14-regular flex items-center mt-20 justify-between">
            <p className="flex space-x-2"> <Copyright className="w-4" /> <span>2024 CarePulse</span></p>
            <Link href={`/?admin=true`} className="text-green-500">Admin</Link>
          </div>
        </div>
      </section>


      <Image src={"/assets/images/onboarding-img.png"}
        height={1000}
        width={1000}
        alt="Onboarding Image"
        className="side-img max-w-[50%]"
      />
    </div>
  );
}
