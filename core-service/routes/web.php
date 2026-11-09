<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\Admin\SettingController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\Admin\KnowledgeController;
use Illuminate\Support\Facades\Auth;

Route::get('/', function () {
    if (Auth::check()) {
        return redirect()->route('dashboard');
    }
    return Inertia::render('Welcome');
})->name('home');

Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::get('/chat', function () {
    return Inertia::render('Chat/Index');
})->name('chat.index');

Route::middleware('auth')->group(function () {
    // Rute Pengaturan Desa
    Route::get('/settings', [SettingController::class, 'edit'])->name('settings.edit');
    Route::patch('/settings', [SettingController::class, 'update'])->name('settings.update');

    // Rute Knowledge Base (SOP Desa)
    Route::get('/knowledge', [KnowledgeController::class, 'index'])->name('knowledge.index');
    Route::get('/knowledge/create', [KnowledgeController::class, 'create'])->name('knowledge.create');
    Route::post('/knowledge', [KnowledgeController::class, 'store'])->name('knowledge.store');

    // Rute Detail, Edit, dan Delete (Butuh parameter ID)
    Route::get('/knowledge/{id}', [KnowledgeController::class, 'show'])->name('knowledge.show');
    Route::get('/knowledge/{id}/edit', [KnowledgeController::class, 'edit'])->name('knowledge.edit');
    Route::delete('/knowledge/{id}', [KnowledgeController::class, 'destroy'])->name('knowledge.destroy');

    // Rute Profil Bawaan Breeze
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__.'/auth.php';
