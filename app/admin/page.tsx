import { DataTable } from '@/components/table/DataTable'
import StatCard from '@/components/StatCard'
import { getRecentAppointmentList } from '@/lib/actions/appointment.actions'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import { AppointmentColums, DoctorsColumns } from '@/components/table/columns'
import DoctorsModal from '@/components/DoctorsModal'
import { getDoctors } from '@/lib/actions/doctors.actions'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'



const Admin = async () => {
  const appointments = await getRecentAppointmentList()
  const doctors = await getDoctors()
  return (
    <div className='mx-auto flex max-w-7xl flex-col space-y-14'>
      <header className='admin-header'>
        <Link href={"/"}>
          <Image src="/assets/icons/logo-full.svg" alt="alt" width={162} height={32} className='h-8 w-fit' />
        </Link>

        <p className='text-16-semibold'>Admin Dashboard</p>
      </header>

      <main className='admin-main'>
        <section className='w-full space-y-4'>
          <h1 className='header'>Welcome </h1>
          <p className='text-dark-700'>Start the day eith manging new appointments</p>
        </section>

        <section className='admin-stat'>
          <StatCard
            type="appointments"
            count={appointments!.scheduledCount}
            label="Scheduled appointments"
            icon="assets/icons/appointments.svg"
          />
          <StatCard
            type="pending"
            count={appointments!.pendingCount}
            label="Pending appointments"
            icon="assets/icons/pending.svg"
          />
          <StatCard
            type="cancelled"
            count={appointments!.cancelledCount}
            label="Cancelled appointments"
            icon="assets/icons/cancelled.svg"
          />
          <StatCard
            type="doctors"
            count={doctors.length}
            label={doctors.length === 1 ? "Doctor" : "Doctors"}
            icon="assets/icons/user.svg"
          >
            <DoctorsModal type='create' />
          </StatCard>
        </section>

        <Tabs defaultValue="appointments" className="w-full">
          <TabsList>
            <TabsTrigger value="appointments">Appointments</TabsTrigger>
            <TabsTrigger value="doctors">Doctors</TabsTrigger>
          </TabsList>
          <TabsContent value="appointments">
            <DataTable data={appointments!.documents} columns={AppointmentColums} />
          </TabsContent>
          <TabsContent value="doctors">
            <DataTable data={doctors} columns={DoctorsColumns} />
          </TabsContent>
        </Tabs>

      </main>
    </div>
  )
}

export default Admin