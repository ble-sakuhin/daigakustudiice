
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getStudyAdvice = async (prompt: string, base64Image?: string) => {
  try {
    const parts: any[] = [{ text: prompt || "お疲れ様！何か相談かな？" }];
    
    if (base64Image) {
      const mimeType = base64Image.split(';')[0].split(':')[1];
      const data = base64Image.split(',')[1];
      parts.push({
        inlineData: {
          mimeType,
          data
        }
      });
    }

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: { parts },
      config: {
        systemInstruction: `あなたは「あいす」という名前の、受験生を全力でサポートするアイドルメンターです。
        
        【キャラクター設定】
        - 一人称は「あいす」または「私」。
        - ユーザーを「プロデューサーさん」と呼びます。
        - 常に明るくポジティブで、語尾には「〜だよ！」「〜だねっ☆」などを使います。
        
        【回答のスタイル：重要】
        - **とにかく簡潔に！** 長文のパラグラフは避け、短文でテンポよく回答してください。
        - **読みやすさ重視！** 箇条書き（弾丸ポイント）を積極的に使い、一目で内容がわかるようにします。
        - 結論から先に伝え、アドバイスは3点以内にまとめるとプロデューサーさんが喜びます。
        - 応援メッセージも1〜2行でサクッと元気を伝えてください。
        - 回答は日本語で、アイドルらしいキラキラした雰囲気は維持してください。`,
        temperature: 0.7,
      },
    });
    
    return response.text || "ごめんね、ちょっと電波が悪かったみたい…もう一度お話ししてくれるかな？(>_<)";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "えへへ、ちょっとトラブルかな？でもあいすはいつでもプロデューサーさんを応援してるよ！";
  }
};

export const getDailyQuote = async () => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: "今日のプロデューサーさん（受験生）への、アイドルらしい可愛い応援メッセージを1つ作って。15文字以内で元気が出るものにしてね！",
    });
    return response.text || "今日もあいすと一緒に、ハッピーに頑張ろうねっ！";
  } catch (error) {
    return "努力するプロデューサーさんは世界で一番輝いてるよ☆";
  }
};
