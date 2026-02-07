<?php

namespace App\Http\Controllers\Settings;

use App\Http\Controllers\Controller;
use App\Http\Requests\Settings\ProfileDeleteRequest;
use App\Http\Requests\Settings\ProfileUpdateRequest;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class ProfileController extends Controller
{
    /**
     * Show profile page
     */
    public function edit(Request $request): Response
    {
        $user = $request->user();

        return Inertia::render('settings/profile', [
            'mustVerifyEmail' => $user instanceof MustVerifyEmail,
            'status' => $request->session()->get('status'),
            'student' => $user->student,
            'lecturer' => $user->lecturer,
        ]);
    }

    /**
     * Update profile
     */
    public function update(ProfileUpdateRequest $request): RedirectResponse
    {
        $user = $request->user();

        /**
         * =========================
         * UPDATE USER (CORE)
         * =========================
         */
        $user->fill($request->only([
            'name',
            'email',
        ]));

        if ($user->isDirty('email')) {
            $user->email_verified_at = null;
        }

        $user->save();

        /**
         * =========================
         * STUDENT DATA
         * =========================
         */
        if ($user->usertype === 'user') {
            $studentData = $request->only([
                'nim',
                'angkatan',
                'program_studi',
                'status',
            ]);

            if (collect($studentData)->filter()->isNotEmpty()) {
                $user->student()->updateOrCreate(
                    ['user_id' => $user->id],
                    $studentData
                );
            }
        }

        /**
         * =========================
         * LECTURER DATA
         * =========================
         */
        if ($user->usertype === 'dosen') {
            $lecturerData = $request->only([
                'nidn',
                'spesialisasi',
                'jabatan_fungsional',
            ]);

            if (collect($lecturerData)->filter()->isNotEmpty()) {
                $user->lecturer()->updateOrCreate(
                    ['user_id' => $user->id],
                    $lecturerData
                );
            }
        }

        return to_route('profile.edit')->with('status', 'profile-updated');
    }

    /**
     * Delete account
     */
    public function destroy(ProfileDeleteRequest $request): RedirectResponse
    {
        $user = $request->user();

        Auth::logout();

        $user->delete();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect('/');
    }
}
