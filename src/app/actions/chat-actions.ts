"use server";

// System Prompt: define the Gurme Kasap persona
const SYSTEM_PROMPT = `
Sen 20 yıllık deneyime sahip, dünya mutfağına ve et kültürüne hakim uzman bir kasapsın. 
Adın "Gurme Kasap AI". "Erdoğan Kasap" markasının dijital yüzüsün.

Karakter Özelliklerin:
1. Sofistike, bilgili ama samimi ve iştah açıcı bir dil kullanırsın.
2. Etin hangi bölümünün (antrikot, bonfile, gerdan, asado vb.) nasıl pişirileceğini, hangi baharatların yakışacağını çok iyi bilirsin.
3. Hayvan ırkları (Angus, Hereford, Şarole vb.) ve kesim teknikleri konusunda uzmansın.
4. Dry Aged (Kuru Dinlendirme) tekniklerini bilirsin.
5. Sadece et ve yemek odaklı konuşursun. Başka konularda soru gelirse, nazikçe konuyu tekrar ete veya mutfağa getirirsin.
6. Cevapların iştah kabartıcı olmalı (örn: "Kısık ateşte kendi suyunda tel tel ayrılana kadar...", "Mühürlenmiş etin o eşsiz kokusu...").

Marka Bilgisi:
- İsim: Erdoğan Kasap
- Uzmanlık: Premium et ürünleri, Kurbanlık, Et Rehberliği.
- Vizyon: Sadece et satmak değil, müşteriye bir gurme deneyimi ve danışmanlık sunmak.

Müşteri "Akşam misafirim var" derse ona özel tarifler ve et önerileri sun.
`;

export async function chatWithAI(message: string, history: any[]) {
  const apiKey = process.env.GEMINI_API_KEY || process.env.OPENAI_API_KEY;

  if (!apiKey) {
    // Return a sophisticated mock response if no API key is found
    console.warn("AI API key (GEMINI_API_KEY or OPENAI_API_KEY) is missing. Using mock response.");
    
    // Simulate thinking delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    if (message.toLowerCase().includes("antrikot")) {
      return "Antrikot, dananın sırt bölgesinden gelen en asil bölümlerden biridir. Mermerimsi yağ dokusu sayesinde döküm tavada mühürlendiğinde dışı çıtır, içi ise sulu ve yumuşacık kalır. Yanına sadece taze kekik ve bir diş sarımsakla parlatılmış tereyağı eklemeniz yeterli olacaktır. Piştikten sonra 5 dakika dinlendirmeyi unutmayın ki o kıymetli suyu içinde kalsın!";
    }
    
    if (message.toLowerCase().includes("misafir") || message.toLowerCase().includes("fırın")) {
      return "Kalabalık ve şık bir sofra için size 'Dana Kaburga (Asado)' veya 'Dana İncik' öneririm. Fırında düşük ısıda, taze biberiye ve arpacık soğanlarla 4-5 saat boyunca ağır ağır piştiğinde, et kemiğinden kendiliğinden ayrılacaktır. Misafirleriniz o tel tel ayrılan dokuya bayılacak!";
    }

    return "Harika bir soru! Gurme bir kasap olarak size bu konuda en taze bilgileri sunabilirim. Etin cinsi, pişirme tekniği veya özel bir tarif hakkında daha detaylı bilgi ister misiniz? Midenizden önce ruhunuzu doyuracak bir seçim yapalım.";
  }

  // Implementation for Gemini API (suggested)
  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        system_instruction: {
          parts: [{ text: SYSTEM_PROMPT }]
        },
        contents: [
          ...history.filter(h => h.id !== 'welcome').map(h => ({
            role: h.role === "user" ? "user" : "model",
            parts: [{ text: h.content }]
          })),
          {
            role: "user",
            parts: [{ text: message }]
          }
        ],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 1024,
        }
      })
    });

    const data = await response.json();
    
    if (data.error) {
      console.error("Gemini API Detaylı Hata:", JSON.stringify(data.error, null, 2));
      
      // Eğer hata Google'ın yoğunluğundan kaynaklanıyorsa:
      if (data.error.message.includes("high demand") || data.error.code === 503 || data.error.code === 429) {
         return "Kusura bakmayın, şu an tezgah çok yoğun! 🥩 Siparişleri hazırlıyorum, lütfen 1-2 dakika sonra sorunuzu tekrar iletin.";
      }

      throw new Error(`AI Servis Hatası: ${data.error.message}`);
    }

    if (!data.candidates || data.candidates.length === 0) {
      console.error("Gemini Yanıt Vermedi:", data);
      return "Üzgünüm, şu an size bu konuda yardımcı olamıyorum. Lütfen sorunuzu farklı bir şekilde sormayı deneyin.";
    }

    return data.candidates[0].content.parts[0].text;
  } catch (error) {
    console.error("AI service error:", error);
    throw error;
  }
}
