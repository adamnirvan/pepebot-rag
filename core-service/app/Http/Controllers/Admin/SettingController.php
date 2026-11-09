<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\VillageSetting;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Http\RedirectResponse;

class SettingController extends Controller
{
    public function edit(): Response
    {
        // Ambil data pengaturan pertama (karena ini pengaturan global, kita pakai row pertama)
        $setting = VillageSetting::firstOrCreate(
            ['id' => 1],
            [
                'desa_name' => 'Desa Pepe',
                'petugas_wa' => '081234567890',
                'website_url' => 'https://pepe.desa.id'
            ]
        );

        return Inertia::render('Admin/Settings', [
            'setting' => $setting
        ]);
    }

    /**
     * Memperbarui kontak dan informasi desa.
     */
    public function update(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'petugas_wa' => ['nullable', 'string', 'max:20'],
            'website_url' => ['nullable', 'url', 'max:255'],
        ]);

        $setting = VillageSetting::first();
        $setting->update($validated);

        return redirect()->route('settings.edit')->with('status', 'Pengaturan berhasil diperbarui.');
    }
}