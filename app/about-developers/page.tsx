'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import developerPic from '@/app/images/developers.jpg';
import linkedinIcon from '@/app/icons/linkedin_icon.svg';
import closeIcon from '@/app/icons/close_20dp_1C1B1F.svg'

export default function AboutDevelopers() {
  const router = useRouter();
  return (
    <div className="w-full h-full flex flex-col">
      <button
        onClick={() => router.back()}
        className={`flex items-center h-12 p-4 rounded-3xl sticky top-2 w-fit my-2 ml-2 z-50 bg-red-200 active:bg-red-300 active:ring-2 active:ring-red-100`}
      >
        <Image src={closeIcon} alt='icon' width={24} height={24} />
        <p className="text-base font-medium">Keluar</p>
      </button>
      <div className=" flex-1 w-full h-full grid place-items-center">
        <div className="flex flex-col w-full">
          <div className="px-6">
            <h2 className="text-3xl">About Developers</h2>
          </div>
          <div className="p-4">
            <Image src={developerPic} alt="devpic" className="rounded-2xl" />
          </div>
          <div className="px-6">
            <p>
              Hi! We are the development team behind this app. We love working at "Embun Senja" from dusk🌒 till dawn🔆
              <br />
              —just kidding! :D
            </p>
            <br />
            <p className="font-medium">Let's connect on LinkedIn</p>
            <div className="flex flex-col gap-2 justify-start mt-2">
              <a
                href="https://www.linkedin.com/in/almaas-izdihar/"
                target="_blank"
                className="py-0.5 px-2 bg-indigo-200 active:ring-2 active:ring-indigo-400 rounded-md flex items-center gap-1 w-fit"
              >
                <Image src={linkedinIcon} alt="in" width={14} height={14} />
                <span>Almaas Izdihar</span>
              </a>
              <a
                href="https://www.linkedin.com/in/muhamad-fadil-efdika-b92bb0255/"
                target="_blank"
                className="py-0.5 px-2 bg-indigo-200 active:ring-2 active:ring-indigo-400 rounded-md flex items-center gap-1 w-fit"
              >
                <Image src={linkedinIcon} alt="in" width={14} height={14} />

                <span>Fadil Efdika</span>
              </a>
              <a
                href="https://www.linkedin.com/in/hamza-pratama-092ba5238/"
                target="_blank"
                className="py-0.5 px-2 bg-indigo-200 active:ring-2 active:ring-indigo-400 rounded-md flex items-center gap-1 w-fit"
              >
                <Image src={linkedinIcon} alt="in" width={14} height={14} />

                <span>Hamza Pratama</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
