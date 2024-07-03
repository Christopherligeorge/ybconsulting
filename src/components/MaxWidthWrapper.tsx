import { cn } from '@/lib/utils'
import { ReactNode } from 'react'


//regular arrow function 
//use on all pages, makes spacing on left and right hand side the same. 
//takes in props that we destructure, (classname, children, and declare their type)

const MaxWidthWrapper = ({
  className,
  children,
}: {
  className?: string
  children: ReactNode
}) => {
  return (
    <div className={cn('mx-auto w-full max-w-screen-xl px-2.5 md:px-20', className)}>
      {children}
    </div>
  )
}

export default MaxWidthWrapper