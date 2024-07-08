import MaxWidthWrapper from "@/components/MaxWidthWrapper";
import Image from "next/image";

//landing page code for the website. 
export default function Home() {
  return (
    <MaxWidthWrapper className='mb-12 mt-28 sm:mt-40 flex flex-col items-center justify-center text-center'>
        <div className='mx-auto mb-4 flex max-w-fit items-center justify-center space-x-2 overflow-hidden rounded-full border border-gray-200 bg-white px-7 py-2 shadow-md backdrop-blur transition-all hover:border-gray-300 hover:bg-white/50'>
            <p className='text-sm font-semibold text-gray-700'>
             YB Consulting is now public!
            </p>
      </div>
      <h1 className='max-w-4xl text-5xl font-bold md:text-6xl lg:text-7xl'>
          Connect with your{' '}
          <span className='text-blue-600'>
            higher self
            </span>{' '}
          in seconds.
      </h1>
      <h2 className='max-w-4xl text-5xl font-bold md:text-6xl lg:text-7xl'>
      Mission Statement:
      </h2>
      <p className='mt-5 max-w-prose text-zinc-700 sm:text-lg'>
      Your Brother, Consulting, seeks to reveal to young men their unique purpose and identity, and give them the skills and understanding to nurture, and pursue them. We seek to make young men capable, confident, happy, and more authentically themselves. We want to help and watch them succeed as proud brothers in their career and personal lives. 
      </p>



    </MaxWidthWrapper>
  
  );
}
