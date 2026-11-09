<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;
use Throwable;

/**
 * Penerima webhook WAHA (WhatsApp HTTP API).
 *
 * Mengabaikan pesan grup/diri sendiri, meneruskan teks ke ai-service (/api/chat),
 * dan mengirim balasan kembali melalui endpoint REST WAHA (/api/sendText).
 */
class WhatsAppController extends Controller
{
    public function handleWebhook(Request $request): Response
    {
        $payload = $request->json()->all();

        // 1. Pastikan event adalah pesan masuk (mengabaikan event status seperti 'message.ack')
        if (($payload['event'] ?? '') !== 'message') {
            return response('EVENTS_RECEIVED', 200);
        }

        $message = $payload['payload'] ?? [];

        // 2. Abaikan pesan dari grup atau pesan yang dikirim oleh bot itu sendiri (loop protection)
        if (($message['isGroup'] ?? false) || ($message['fromMe'] ?? false)) {
            return response('IGNORED', 200);
        }

        $from = (string) ($message['from'] ?? ''); // Format WAHA: 628123456789@c.us
        $text = trim((string) ($message['body'] ?? ''));
        
        // Cek apakah pesan membawa lampiran (gambar, dokumen, vn)
        $hasMedia = (bool) ($message['hasMedia'] ?? false); 

        if ($from === '') {
            return response('EVENTS_RECEIVED', 200);
        }

        // Tolak jika pesan benar-benar kosong ATAU berupa media
        if ($text === '' || $hasMedia) {
            $this->sendTextWaha($from, $this->nonTextNotice());
            return response('EVENTS_RECEIVED', 200);
        }

        Log::info('Webhook WAHA masuk', [
            'from' => $from,
            'text' => Str::limit($text, 50)
        ]);

        // 3. Minta jawaban dari AI
        $answer = $this->askAiService($text, $from);

        // 4. Kirim kembali ke pengguna via WAHA
        $this->sendTextWaha($from, $answer);

        return response('EVENTS_RECEIVED', 200);
    }

    /**
     * Memanggil ai-service dan menyusun teks balasan.
     */
    private function askAiService(string $text, string $from): string
    {
        $url = rtrim((string) config('services.ai_service.url', 'http://ai-service:8000'), '/').'/api/chat';
        $key = (string) config('services.ai_service.key');

        try {
            $response = Http::withHeaders(['X-Internal-Key' => $key])
                ->timeout(45)
                ->post($url, [
                    'query' => $text,
                    'session_id' => $from, // <-- TAMBAHKAN BARIS INI
                    'channel' => 'WA'
                ]);
                
        } catch (Throwable $error) {
            Log::error('ai-service tidak terjangkau (WAHA)', ['from' => $from, 'error' => $error->getMessage()]);
            return $this->serviceErrorText();
        }

        if (! $response->successful()) {
            Log::error('ai-service gagal menjawab (WAHA)', [
                'from' => $from,
                'status' => $response->status(),
                'body' => Str::limit($response->body(), 300),
            ]);
            return $this->serviceErrorText();
        }

        $data = $response->json() ?? [];

        if ((bool) ($data['fallback'] ?? false) === true) {
            Log::info('AI fallback (WAHA) — jawaban dibuang, memakai pesan kontak', ['from' => $from]);
            return $this->fallbackText($data['fallback_contact'] ?? []);
        }

        $answer = (string) ($data['answer'] ?? '');

        if ($answer === '') {
            Log::warning('ai-service menjawab tanpa field answer (WAHA)', ['from' => $from]);
            return $this->serviceErrorText();
        }

        return $answer;
    }

    /** Mengirim teks ke pelanggan melalui Endpoint WAHA. */
    private function sendTextWaha(string $to, string $body): void
    {
        // Secara default mengarah ke container Docker WAHA di port 3000
        $wahaUrl = rtrim((string) config('services.waha.url', 'http://waha:3000'), '/');

        try {
            $response = Http::timeout(30)->post("{$wahaUrl}/api/sendText", [
                'chatId' => $to,
                'text' => $body,
                'session' => 'default'
            ]);

            if ($response->successful()) {
                Log::info('Balasan terkirim via WAHA', ['to' => $to]);
            } else {
                Log::warning('WAHA gagal mengirim pesan', [
                    'to' => $to,
                    'status' => $response->status(),
                    'body' => Str::limit($response->body(), 300),
                ]);
            }
        } catch (Throwable $error) {
            Log::error('Koneksi ke WAHA gagal', ['to' => $to, 'error' => $error->getMessage()]);
        }
    }

    /** Menyusun teks fallback dari kontak pada respons ai-service. */
    private function fallbackText(array $contact): string
    {
        $lines = ['Maaf, informasi tersebut tidak ada di pedoman dokumen Desa Pepe.'];

        $wa = trim((string) ($contact['whatsapp'] ?? ''));
        $url = trim((string) ($contact['url'] ?? ''));

        if ($wa !== '') {
            $lines[] = "WhatsApp petugas: {$wa}";
        }

        if ($url !== '') {
            $lines[] = "Info desa: {$url}";
        }

        if (count($lines) === 1) {
            $lines[] = 'Silakan hubungi petugas desa untuk bantuan lanjutan.';
        }

        return implode("\n", $lines);
    }

    private function nonTextNotice(): string
    {
        return 'Maaf, untuk saat ini saya hanya bisa membalas pesan teks. Silakan kirim pertanyaanmu sebagai teks ya.';
    }

    private function serviceErrorText(): string
    {
        return 'Maaf, sistem penjawab sedang mengalami gangguan. Silakan coba lagi sebentar, atau hubungi petugas desa untuk bantuan.';
    }
}