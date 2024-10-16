"use client"
import React from 'react'
import { Button } from '../ui/button'
import Link from 'next/link'
import { useUser } from '@clerk/nextjs'

const Hero = () => {
  const {user,isSignedIn} = useUser();
  return (
    <section className="bg-gray-50">
  <div className="mx-auto max-w-screen-xl px-4 py-32 lg:flex lg:h-screen">
    <div className="mx-auto max-w-xl text-center">
      <h1 className="text-3xl font-extrabold sm:text-5xl">
      Create Forms in Seconds
        <strong className="font-extrabold text-primary sm:block">  with EasyFormAI </strong>
      </h1>

      <p className="mt-4 text-gray-700 sm:text-xl/relaxed">
      EasyFormAI lets you design and deploy customized forms in seconds with intuitive AI-driven tools for effortless data collection.
      </p>

      <div className="mt-8 flex flex-wrap justify-center gap-4">
        <Link href={isSignedIn?'/dashboard':'/sign-in'}>
        <Button
          className="block w-full rounded bg-primary px-12 py-3 text-sm font-medium text-white shadow hover:bg-purple-600 focus:outline-none focus:ring active:bg-red-500 sm:w-auto"
        >
          + Create AI Form
        </Button>
        </Link>
      </div>
    </div>
  </div>
</section>
  )
}

export default Hero