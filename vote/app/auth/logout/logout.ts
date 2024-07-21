"use server"


import { deleteSession } from '@/lib/session'
import { revalidatePath } from 'next/cache'

import { redirect } from 'next/navigation'

export const logout = async (id: string) => {
    await deleteSession(id)
    console.log("logging out")
    revalidatePath('/', 'page')
    redirect('/auth/login')
}

export default logout