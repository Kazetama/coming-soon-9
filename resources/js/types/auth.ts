export type Usertype =
    | 'user'
    | 'admin'
    | 'superadmin'
    | 'kaprodi'
    | 'dosen'

export type User = {
    id: number
    name: string
    email: string
    avatar?: string
    email_verified_at: string | null
    two_factor_enabled?: boolean
    created_at: string
    updated_at: string
    [key: string]: unknown
}

export type Auth = {
    user: User
    usertype: Usertype
}

export type Student = {
    nim?: string
    angkatan?: number
    program_studi?: string
    status?: 'aktif' | 'lulus'
}

export type TwoFactorSetupData = {
    svg: string
    url: string
}

export type TwoFactorSecretKey = {
    secretKey: string
}
