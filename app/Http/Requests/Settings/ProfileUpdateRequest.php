<?php

namespace App\Http\Requests\Settings;

use App\Concerns\ProfileValidationRules;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class ProfileUpdateRequest extends FormRequest
{
    use ProfileValidationRules;

    public function rules(): array
    {
        return array_merge(
            $this->profileRules($this->user()->id),
            $this->academicRules()
        );
    }

    protected function academicRules(): array
    {
        return [
            // student
            'nim' => [
                'nullable',
                'string',
                'max:50',
                Rule::unique('students', 'nim')
                    ->ignore(optional($this->user()->student)->id),
            ],
            'angkatan' => [
                'nullable',
                'integer',
                'min:2000',
                'max:'.now()->year,
            ],
            'program_studi' => ['nullable', 'string', 'max:100'],
            'status' => ['nullable', 'in:aktif,lulus'],

            // lecturer
            'nidn' => [
                'nullable',
                'string',
                'max:50',
                Rule::unique('lecturers', 'nidn')
                    ->ignore(optional($this->user()->lecturer)->id),
            ],
            'spesialisasi' => ['nullable', 'string', 'max:255'],
            'jabatan_fungsional' => ['nullable', 'string', 'max:100'],
        ];
    }
}
