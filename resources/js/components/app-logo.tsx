import { usePage } from '@inertiajs/react'
import AppLogoIcon from './app-logo-icon'

type UserType = 'user' | 'dosen' | 'kaprodi' | 'admin' | 'superadmin'

type AuthUser = {
    id: number
    name: string
    usertype: UserType
}

type PageProps = {
    auth?: {
        user?: AuthUser
    }
}

const roleLabel: Record<UserType, string> = {
    user: 'User Dashboard',
    dosen: 'Dosen Panel',
    kaprodi: 'Kaprodi Panel',
    admin: 'Admin Panel',
    superadmin: 'Super Admin Panel',
}

export default function AppLogo() {
    const { props } = usePage<PageProps>()
    const role: UserType = props.auth?.user?.usertype ?? 'user'

    return (
        <>
            <div className="flex aspect-square size-8 items-center justify-center rounded-md bg-sidebar-primary text-sidebar-primary-foreground">
                <AppLogoIcon className="size-5 fill-current text-white dark:text-black" />
            </div>

            <div className="ml-1 grid flex-1 text-left text-sm">
                <span className="mb-0.5 truncate leading-tight font-semibold">
                    {roleLabel[role]}
                </span>
            </div>
        </>
    )
}
