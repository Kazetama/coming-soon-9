<?php

namespace App\Http\Controllers\SuperAdmin;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Services\ActivityLogger;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class DataController extends Controller
{
    /**
     * Menampilkan daftar user dengan proteksi identitas diri.
     */
    public function index(Request $request)
    {
        $validated = $request->validate([
            'search' => 'nullable|string|max:100',
            'role' => ['nullable', Rule::in(['superadmin', 'admin', 'dosen', 'kaprodi', 'user'])],
        ]);

        $users = User::query()
            ->select('id', 'name', 'email', 'usertype', 'created_at')
            ->when($request->search, function ($query, $search) {
                $query->where(function ($q) use ($search) {
                    $q->where('name', 'like', "%{$search}%")
                        ->orWhere('email', 'like', "%{$search}%");
                });
            })
            ->when($request->role, fn ($q, $role) => $q->where('usertype', $role))
            ->latest()
            ->paginate(10)
            ->withQueryString()
            ->through(fn ($u) => [
                'id' => $u->id,
                'name' => $u->name,
                'email' => $u->email,
                'usertype' => $u->usertype,
                'created_at' => $u->created_at->translatedFormat('d M Y'),
                // Flag ini penting untuk UI menonaktifkan tombol aksi pada diri sendiri
                'is_current_user' => $u->id === Auth::id(),
            ]);

        return Inertia::render('superadmin/data', [
            'users' => $users,
            'filters' => $request->only(['search', 'role']),
        ]);
    }

    /**
     * Update Role User dengan proteksi "Anti-Lockout".
     */
    public function updateRole(Request $request, User $user)
    {
        // KEAMANAN: Cegah mengubah role diri sendiri
        if ($user->id === Auth::id()) {
            return back()->with('error', 'Anda tidak diperbolehkan mengubah role akun sendiri demi keamanan sistem.');
        }

        $validated = $request->validate([
            'role' => ['required', Rule::in(['superadmin', 'admin', 'dosen', 'kaprodi', 'user'])],
        ]);

        $oldRole = $user->usertype;

        $user->update([
            'usertype' => $validated['role'],
        ]);

        ActivityLogger::log(
            'role_updated',
            $user->id,
            [
                'old' => $oldRole,
                'new' => $validated['role'],
            ]
        );

        return back()->with('success', "Role {$user->name} berhasil diperbarui.");
    }

    /**
     * Reset Password dengan proteksi akses.
     */
    public function resetPassword(User $user)
    {
        // KEAMANAN: Cegah reset password diri sendiri di panel ini
        if ($user->id === Auth::id()) {
            return back()->with('error', 'Gunakan menu Pengaturan Profil untuk mengubah password Anda.');
        }

        $newPassword = 'password123';

        $user->update([
            'password' => Hash::make($newPassword),
        ]);

        ActivityLogger::log(
            'password_reset',
            $user->id
        );

        return back()->with('success', "Password untuk {$user->name} telah direset ke default.");
    }
}
