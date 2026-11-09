<?php

namespace App\Http\Controllers;

use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Throwable;

class WebChatController extends Controller
{
    public function sendMessage(Request $request): JsonResponse
    {
        // Validasi input dari frontend
        $request->validate([
            'message' => 'required|string|max:1000',
        ]);

        $userMessage = $request->input('message');
        
        $url = rtrim((string) config('services.ai_service.url'), '/').'/api/chat';
        $key = (string) config('services.ai_service.key');

        try {
            // Panggil AI Service dengan channel "WEB"
            $response = Http::withHeaders(['X-Internal-Key' => $key])
                ->timeout(45)
                ->post($url, [
                    'query' => $userMessage,
                    'channel' => 'Web'
                ]);
        } catch (Throwable $error) {
            Log::error('ai-service web error', ['error' => $error->getMessage()]);
            return response()->json(['error' => 'Sistem AI sedang sibuk. Silakan coba lagi.'], 503);
        }

        if (! $response->successful()) {
            return response()->json(['error' => 'Gagal memproses jawaban.'], 500);
        }

        $data = $response->json() ?? [];

        // Evaluasi logika fallback untuk Web
        if ((bool) ($data['fallback'] ?? false) === true) {
            $contact = $data['fallback_contact'] ?? [];
            return response()->json([
                'answer' => "Maaf, informasi tersebut tidak ada di pedoman dokumen Desa Pepe.\n\nSilakan hubungi WhatsApp petugas: " . ($contact['whatsapp'] ?? '-') . "\nAtau kunjungi: " . ($contact['url'] ?? '-'),
                'is_fallback' => true
            ]);
        }

        // Kembalikan jawaban normal AI ke Frontend React
        return response()->json([
            'answer' => $data['answer'] ?? '',
            'is_fallback' => false
        ]);
    }
}