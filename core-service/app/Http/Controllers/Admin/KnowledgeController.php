<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\DocumentVector;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Inertia\Inertia;

class KnowledgeController extends Controller
{
    public function index()
    {
        // Ambil data tanpa 'content' agar ringan, lalu kelompokkan berdasarkan 'sop_name'
        $groupedDocuments = DocumentVector::select('id', 'sop_name', 'varian', 'version', 'updated_at')
            ->orderBy('updated_at', 'desc')
            ->get()
            ->groupBy('sop_name');

        return Inertia::render('Admin/Knowledge/Index', [
            // Kirim sebagai Object/Dictionary ke React
            'groupedDocuments' => $groupedDocuments
        ]);
    }

    public function create()
    {
        return Inertia::render('Admin/Knowledge/Form');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'sop_name' => 'required|string|max:255',
            'varian' => 'required|string|max:255',
            'syarat' => 'required|array|min:1',
            'syarat.*' => 'required|string',
            'channel_url' => 'nullable|string',
            'note' => 'nullable|string',
        ]);

        $url = rtrim((string) config('services.ai_service.url'), '/').'/api/documents';
        $key = (string) config('services.ai_service.key');

        $response = Http::withHeaders(['X-Internal-Key' => $key])
            ->timeout(60)
            ->post($url, [
                'sop_name' => $validated['sop_name'],
                'varian' => $validated['varian'],
                'syarat' => $validated['syarat'],
                'channel_url' => $validated['channel_url'] ?? '',
                'note' => $validated['note'] ?? '',
            ]);

        if (! $response->successful()) {
            return back()->withErrors(['ai_error' => 'Gagal memproses dokumen di AI Service: ' . $response->body()]);
        }

        return redirect()->route('knowledge.index')->with('status', 'Knowledge berhasil disimpan dan di-embedding!');
    }

    public function show($id)
    {
        // Menampilkan detail spesifik beserta konten lengkapnya
        $document = DocumentVector::select('id', 'sop_name', 'varian', 'content', 'version', 'updated_at')->findOrFail($id);
        
        return Inertia::render('Admin/Knowledge/Show', [
            'document' => $document
        ]);
    }

    public function edit($id)
    {
        $document = DocumentVector::select('id', 'sop_name', 'varian', 'content')->findOrFail($id);
        return Inertia::render('Admin/Knowledge/Form', ['document' => $document]);
    }

    public function destroy($id)
    {
        // Langsung hapus dari PostgreSQL, maka AI (RAG) otomatis tidak akan menemukannya lagi
        DocumentVector::findOrFail($id)->delete();
        
        return redirect()->route('knowledge.index')->with('status', 'SOP berhasil dihapus dari Knowledge Base!');
    }
}