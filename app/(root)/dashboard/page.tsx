import CreateForm from '@/components/shared/CreateForm'
import FormList from '@/components/shared/FormList'
import React from 'react'


const Dashboard = () => {
  return (
    <div className='p-10'>
      <h2 className='font-bold text-2xl flex items-center justify-between'>
      Dashboard
      <CreateForm/>
        </h2>
        {/* List of form */}
        <FormList/>
        </div>
  )
}

export default Dashboard