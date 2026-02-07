import InputError from '@/components/input-error'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import type { Lecturer } from '@/types'

type Props = {
    lecturer?: Lecturer
    errors: Record<string, string>
}

export default function LecturerForm({ lecturer, errors }: Props) {
    return (
        <Card className="border-primary/10 shadow-sm">
            <CardHeader className="pb-4">
                <CardTitle className="text-lg font-semibold text-primary">
                    Informasi Dosen
                </CardTitle>
                <CardDescription>
                    Kelola data akademik dan jabatan fungsional pengajar Anda.
                </CardDescription>
            </CardHeader>

            <CardContent className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="grid gap-2">
                        <Label htmlFor="nidn" className="text-sm font-medium">
                            NIDN (Nomor Induk Dosen Nasional)
                        </Label>
                        <Input
                            id="nidn"
                            name="nidn"
                            defaultValue={lecturer?.nidn ?? ''}
                            placeholder="Contoh: 062XXXXXXXX"
                            className={errors.nidn ? 'border-destructive' : ''}
                        />
                        <InputError message={errors.nidn} />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="jabatan_fungsional" className="text-sm font-medium">
                            Jabatan Fungsional
                        </Label>
                        <Input
                            id="jabatan_fungsional"
                            name="jabatan_fungsional"
                            defaultValue={lecturer?.jabatan_fungsional ?? ''}
                            placeholder="Contoh: Lektor Kepala / Asisten Ahli"
                            className={errors.jabatan_fungsional ? 'border-destructive' : ''}
                        />
                        <InputError message={errors.jabatan_fungsional} />
                    </div>
                </div>

                <div className="grid gap-2">
                    <Label htmlFor="spesialisasi" className="text-sm font-medium">
                        Bidang Keahlian / Spesialisasi
                    </Label>
                    <Input
                        id="spesialisasi"
                        name="spesialisasi"
                        defaultValue={lecturer?.spesialisasi ?? ''}
                        placeholder="Contoh: Artificial Intelligence, Cyber Security"
                        className={errors.spesialisasi ? 'border-destructive' : ''}
                    />
                    <InputError message={errors.spesialisasi} />
                </div>
            </CardContent>
        </Card>
    )
}
