<?php

namespace App\Http\Controllers\SuperAdmin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class DataController extends Controller
{
    public function index(Request $request)
    {
        $validated = $request->validate([
            'search' => 'nullable|string|max:100',
            'role'   => ['nullable', Rule::in(['superadmin', 'admin', 'dosen', 'kaprodi', 'user'])]
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
                'is_current_user' => $u->id === Auth::id(),
            ]);

        return Inertia::render('superadmin/data', [
            'users' => $users,
            'filters' => $request->only(['search', 'role']),
        ]);
    }

    /**
     * Update Role User.
     */
    public function updateRole(Request $request, User $user)
    {
        if ($user->id === Auth::id()) {
            return back()->with('error', 'Anda tidak dapat mengubah role akun Anda sendiri.');
        }

        $validated = $request->validate([
            'role' => [
                'required',
                'string',
                Rule::in(['superadmin', 'admin', 'dosen', 'kaprodi', 'user'])
            ]
        ]);

        $user->update([
            'usertype' => $validated['role']
        ]);
        return back()->with('success', "Role {$user->name} berhasil diperbarui menjadi {$validated['role']}.");
    }

    /**
     * Reset Password ke default.
     */
    public function resetPassword(User $user)
    {
        if ($user->id === Auth::id()) {
            return back()->with('error', 'Gunakan menu Pengaturan Profil untuk mengubah password Anda.');
        }

        $defaultPassword = 'password123';

        $user->forceFill([
            'password' => Hash::make($defaultPassword),
        ])->save();
        return back()->with('success', "Password untuk {$user->name} telah direset.");
    }
}
