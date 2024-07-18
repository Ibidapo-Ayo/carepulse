
import RegisterForm from "@/components/forms/RegisterForm";
import { getDoctors } from "@/lib/actions/doctors.actions";
import { getUser } from "@/lib/actions/patient.actions";
import { Copyright } from "lucide-react";
import Image from "next/image";
import * as Sentry from "@sentry/nextjs"

const Register = async ({ params: { userId } }: any) => {
    const user = await getUser(userId)
    const doctors = await getDoctors()

    Sentry.metrics.set("user_view_register", user!.name)
    return (
        <div className="flex h-screen max-h-screen">
            <section className="remove-scrollbar container">
                <div className="sub-container max-w-[860px] flex-1 flex-col py-10">
                    <Image src="/assets/icons/logo-full.svg" width={1000} height={1000} alt="patient" className="mb-12 h-10 w-fit" />
                    <RegisterForm  user={user} doctor={doctors} />
                    <div className="copyright py-12">
                        <p className="flex space-x-2"> <Copyright className="w-4" /> <span>2024 CarePulse</span></p>
                        
                    </div>
                </div>

            </section>
            <Image src={"/assets/images/register-img.png"}
                height={1000}
                width={1000}
                alt="Onboarding Image"
                className="side-img max-w-[390px]"
            />
        </div>
    );
}


export default Register