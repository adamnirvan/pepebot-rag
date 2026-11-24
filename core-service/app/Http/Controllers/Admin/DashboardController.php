<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\DocumentVector;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        // Menghitung jumlah SOP unik
        $totalSop = DocumentVector::distinct('sop_name')
            ->count('sop_name');

        // Menghitung jumlah seluruh varian SOP
        $totalVarian = DocumentVector::count();

        // Mengambil lima SOP terbaru, satu entri per SOP
        $recentSop = DocumentVector::query()
            ->select('id', 'sop_name', 'varian', 'version', 'updated_at')
            ->orderByDesc('updated_at')
            ->orderByDesc('id')
            ->get()
            ->unique('sop_name')
            ->take(5)
            ->values();

        // Tanggal pembaruan terakhir
        $lastUpdated = DocumentVector::max('updated_at');

        return Inertia::render('Dashboard', [
            'stats' => [
                'totalSop' => $totalSop,
                'totalVarian' => $totalVarian,
                'lastUpdated' => $lastUpdated,
            ],
            'recentSop' => $recentSop,
        ]);
    }
}
