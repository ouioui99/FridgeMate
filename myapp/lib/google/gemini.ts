import axios from "axios";

const API_KEY = process.env.EXPO_PUBLIC_GEMINI_API;

export const getExpirationDateList = async (targetNameList: string[]) => {
  const data = {
    contents: [
      {
        parts: [
          {
            text: `食品名の配列を渡すので、それぞれの食品の平均的な賞味期限（日数）を 配列のみ で出力してください。
            賞味期限が取得できない食品は「null」にしてください。
            同じことを何度聞いたとしても
            コードや解説ではなく、配列のみを出力してください。
            同じことを聞かれた場合は同じことを繰り返し出力して回答にブレがないようにしてください。
            ${targetNameList}`,
          },
        ],
      },
    ],
  };

  const config = {
    headers: {
      "Content-Type": "application/json",
    },
  };

  try {
    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${API_KEY}`,
      data,
      config
    );

    console.log(response.data.candidates[0]);

    const responseContent = response.data.candidates[0].content;
    console.log(responseContent.parts);

    const responseParts = responseContent.parts
      .map((part: { text: string }) => part.text)
      .join("\n");

    return JSON.parse(responseParts);
  } catch (error) {
    console.error(
      "Error:",
      error.response ? error.response.data : error.message
    );
    throw error; // 呼び出し元でエラーを処理できるようにする
  }
};
