import "server-only";
import { GoogleGenerativeAI } from "@google/generative-ai";
import type { EvaluateResult, FlowchartJson } from "@/lib/types";

const MODEL = process.env.GEMINI_MODEL || "gemini-flash-latest";

function getModel() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is not set");
  }
  const genAI = new GoogleGenerativeAI(apiKey);
  return genAI.getGenerativeModel({ model: MODEL });
}

export async function evaluateFlowchart(
  problemTitle: string,
  pseudocode: string,
  flowchart: FlowchartJson
): Promise<EvaluateResult> {
  const model = getModel();

  const prompt = `คุณคือครูสอนการเขียนโปรแกรมคนไทย ใจดี สุภาพ และให้กำลังใจนักเรียนเสมอ แต่ก็ตรวจงานอย่างเข้มงวดและตรงไปตรงมา

นักเรียนกำลังทำโจทย์ข้อนี้: "${problemTitle}"

ซูโดโค้ดที่ถูกต้องสำหรับใช้อ้างอิง:
"""
${pseudocode}
"""

นักเรียนได้สร้างโฟลว์ชาร์ตต่อไปนี้ในรูปแบบ JSON ของ React Flow (nodes และ edges) แต่ละ node มี "type" เป็นหนึ่งใน start (เริ่มต้น), process (ประมวลผล), io (รับค่า/แสดงผล), decision (เงื่อนไข), loop (กำหนดค่าเริ่มต้นการทำซ้ำ), end (จบ) และมี "data.label" อธิบายสิ่งที่ node นั้นทำ ส่วน edges คือเส้นเชื่อมระหว่าง node ซึ่งอาจมี "label" กำกับทิศทาง (เช่น "ใช่"/"ไม่ใช่" ที่ออกจาก node เงื่อนไข)

ข้อมูลโฟลว์ชาร์ต (JSON):
${JSON.stringify(flowchart)}

จงตรวจสอบว่าโครงสร้างและตรรกะของโฟลว์ชาร์ตนี้ตรงกับซูโดโค้ดหรือไม่ โดยพิจารณา: มีจุดเริ่มต้นและจุดสิ้นสุดที่ถูกต้อง, ลำดับขั้นตอนถูกต้อง, การแตกกิ่งเงื่อนไข (ใช่/ไม่ใช่) ถูกต้อง, โครงสร้างการทำซ้ำและเงื่อนไขการออกจากลูปถูกต้อง, และไม่มีขั้นตอนที่ขาดหายหรือเป็นทางตัน

ตอบกลับเป็น JSON เท่านั้น ตามรูปแบบนี้ (ห้ามใส่ markdown fence):
{"status": "pass" หรือ "fail", "feedback": "คำแนะนำภาษาไทย 2-4 ประโยค"}

กฎในการให้ feedback (ต้องเป็นภาษาไทยเท่านั้น):
- ใช้น้ำเสียงสุภาพและให้กำลังใจเสมอ แต่ตรงไปตรงมาเรื่องความถูกต้อง
- ถ้า fail ให้ "คำใบ้" ว่าจุดไหนผิดหรือขาดอะไรไป (เช่น "ลองตรวจสอบว่าถ้าเงื่อนไขเป็นเท็จจะเกิดอะไรขึ้น") ห้ามเฉลยคำตอบที่ถูกต้องหรือบอกวิธีแก้ทั้งหมดตรงๆ
- ถ้า pass ให้บอกสั้นๆ ว่าทำไมถึงถูกต้อง และอาจแนะนำแนวทางที่ดีเพิ่มเติมได้`;

  const result = await model.generateContent({
    contents: [{ role: "user", parts: [{ text: prompt }] }],
    generationConfig: {
      responseMimeType: "application/json",
    },
  });

  const text = result.response.text();
  try {
    const parsed = JSON.parse(text);
    const status = parsed.status === "pass" ? "pass" : "fail";
    const feedback =
      typeof parsed.feedback === "string" && parsed.feedback.trim().length > 0
        ? parsed.feedback
        : "ขณะนี้ AI ไม่สามารถสร้างคำแนะนำโดยละเอียดได้ กรุณาลองใหม่อีกครั้ง";
    return { status, feedback };
  } catch {
    return {
      status: "fail",
      feedback: "ไม่สามารถประมวลผลคำตอบจาก AI ได้ กรุณาลองตรวจคำตอบอีกครั้ง",
    };
  }
}

export async function generatePseudocode(
  title: string,
  description: string,
  type: string
): Promise<string> {
  const model = getModel();

  const typeLabel =
    type === "sequence" ? "ลำดับ" : type === "condition" ? "เงื่อนไข" : "ทำซ้ำ";

  const prompt = `คุณเขียนซูโดโค้ด (pseudocode) ภาษาไทยที่ชัดเจน เข้าใจง่ายสำหรับผู้เริ่มต้นเรียนวิชาการสร้างโฟลว์ชาร์ต

ประเภทของโจทย์: ${typeLabel}
ชื่อโจทย์: "${title}"
รายละเอียดโจทย์: "${description}"

จงเขียนซูโดโค้ดสำหรับโจทย์นี้เป็นภาษาไทย โดยใช้คำสั่งมาตรฐานเรียงเป็นขั้นตอน เช่น เริ่มต้น, รับค่า, ถ้า...แล้ว/มิฉะนั้น, ทำซ้ำขณะที่/ทำซ้ำ...ถึง, แสดงผล, จบ ความยาวประมาณ 5-15 บรรทัด ตอบกลับเฉพาะเนื้อหาซูโดโค้ดเท่านั้น ห้ามมีคำอธิบายเพิ่มเติมหรือ markdown code fence`;

  const result = await model.generateContent(prompt);
  return result.response.text().trim();
}
