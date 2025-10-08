// Mengimpor library resmi dari Google untuk Vertex AI
import { VertexAI } from '@google-cloud/vertexai';

// Fungsi ini akan dijalankan oleh Vercel setiap kali ada permintaan
export default async function handler(request, response) {
  // Aturan keamanan dasar: Hanya izinkan permintaan tipe POST
  if (request.method !== 'POST') {
    return response.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    // Mengambil prompt dari permintaan yang dikirim oleh halaman web
    const userPrompt = request.body.prompt;
    if (!userPrompt) {
      return response.status(400).json({ error: 'Error: "prompt" tidak ditemukan di body permintaan.' });
    }

    // Inisialisasi Vertex AI. 
    // Library ini secara otomatis akan menggunakan kredensial yang kita atur di Vercel nanti.
    const vertex_ai = new VertexAI({
      project: 'proyek-chat-ds', // PASTIKAN INI SESUAI DENGAN PROJECT ID ANDA
      location: 'us-central1',
    });

    // Memilih model AI yang akan digunakan
    const model = 'gemini-1.0-pro';

    const generativeModel = vertex_ai.preview.getGenerativeModel({
      model: model,
    });

    // Mengirim prompt ke model AI dan menunggu jawaban
    const resp = await generativeModel.generateContent(userPrompt);
    const contentResponse = await resp.response;
    const botText = contentResponse.candidates[0].content.parts[0].text;

    // Mengirim balasan yang berhasil kembali ke halaman web
    return response.status(200).json({ message: botText });

  } catch (error) {
    // Jika terjadi error, kirim pesan error kembali ke halaman web
    console.error(error);
    return response.status(500).json({ error: error.message });
  }
}
