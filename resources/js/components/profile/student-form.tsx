import Heading from '@/components/heading'
import InputError from '@/components/input-error'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import type { Student } from '@/types'

type Props = {
    student?: Student
    errors: Record<string, string>
}

export default function StudentForm({ student, errors }: Props) {
    return (
        <Card className="border-primary/10 shadow-sm">
            <CardHeader className="pb-4">
                <CardTitle className="text-lg font-semibold text-primary">
                    Informasi Akademik
                </CardTitle>
                <CardDescription>
                    Lengkapi identitas mahasiswa Anda untuk sinkronisasi data kampus.
                </CardDescription>
            </CardHeader>

            <CardContent className="space-y-5">
                <div className="grid gap-2">
                    <Label htmlFor="nim" className="text-sm font-medium">
                        Nomor Induk Mahasiswa (NIM)
                    </Label>
                    <Input
                        id="nim"
                        name="nim"
                        defaultValue={student?.nim ?? ''}
                        placeholder="Contoh: A11.2022.12345"
                        className={errors.nim ? 'border-destructive' : ''}
                    />
                    <InputError message={errors.nim} />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="grid gap-2 md:col-span-1">
                        <Label htmlFor="angkatan" className="text-sm font-medium">
                            Angkatan
                        </Label>
                        <Input
                            id="angkatan"
                            name="angkatan"
                            type="number"
                            defaultValue={student?.angkatan ?? ''}
                            placeholder="2022"
                            className={errors.angkatan ? 'border-destructive' : ''}
                        />
                        <InputError message={errors.angkatan} />
                    </div>

                    <div className="grid gap-2 md:col-span-2">
                        <Label htmlFor="program_studi" className="text-sm font-medium">
                            Program Studi
                        </Label>
                        <Input
                            id="program_studi"
                            name="program_studi"
                            defaultValue={student?.program_studi ?? ''}
                            placeholder="Teknik Informatika"
                            className={errors.program_studi ? 'border-destructive' : ''}
                        />
                        <InputError message={errors.program_studi} />
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}
