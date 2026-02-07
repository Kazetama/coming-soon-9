import { Transition } from '@headlessui/react'
import { Form, Head, usePage } from '@inertiajs/react'
import ProfileController from '@/actions/App/Http/Controllers/Settings/ProfileController'
import DeleteUser from '@/components/delete-user'
import Heading from '@/components/heading'
import InputError from '@/components/input-error'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import AppLayout from '@/layouts/app-layout'
import SettingsLayout from '@/layouts/settings/layout'
import { edit } from '@/routes/profile'
import type { BreadcrumbItem, SharedData, Student, Lecturer } from '@/types'
import { StudentForm, LecturerForm } from '@/components/profile'

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Profile settings', href: edit().url },
]

export default function Profile() {
    const { auth, student, lecturer } = usePage<
        SharedData & {
            student?: Student
            lecturer?: Lecturer
        }
    >().props

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Profile settings" />

            <SettingsLayout>
                <Form {...ProfileController.update.form()} className="space-y-6">
                    {({ processing, recentlySuccessful, errors }) => (
                        <>
                            <Heading
                                variant="small"
                                title="Profile information"
                                description="Update your name and email address"
                            />

                            <div className="grid gap-2">
                                <Label>Name</Label>
                                <Input name="name" defaultValue={auth.user.name} />
                                <InputError message={errors.name} />
                            </div>

                            <div className="grid gap-2">
                                <Label>Email</Label>
                                <Input
                                    name="email"
                                    type="email"
                                    defaultValue={auth.user.email}
                                />
                                <InputError message={errors.email} />
                            </div>

                            {auth.user.usertype === 'user' && (
                                <StudentForm student={student} errors={errors} />
                            )}

                            {auth.user.usertype === 'dosen' && (
                                <LecturerForm lecturer={lecturer} errors={errors} />
                            )}

                            <div className="flex items-center gap-4">
                                <Button disabled={processing}>Save</Button>

                                <Transition show={recentlySuccessful}>
                                    <p className="text-sm">Saved</p>
                                </Transition>
                            </div>
                        </>
                    )}
                </Form>

                <DeleteUser />
            </SettingsLayout>
        </AppLayout>
    )
}
