import { NextRequest, NextResponse } from "next/server";
import { OpenAI } from "openai";

// Configurações do OpenAI
const apiKey = process.env.NEXT_PUBLIC_OPENAI_API_KEY;
const assistantId = process.env.NEXT_PUBLIC_OPENAI_ASSISTANT_ID;

// Verifique se as variáveis de ambiente estão definidas
if (typeof apiKey !== 'string' || !apiKey.trim()) {
  throw new Error("A variável de ambiente NEXT_PUBLIC_OPENAI_API_KEY é necessária.");
}

if (typeof assistantId !== 'string' || !assistantId.trim()) {
  throw new Error("A variável de ambiente NEXT_PUBLIC_OPENAI_ASSISTANT_ID é necessária.");
}

const openai = new OpenAI({ apiKey });

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { prompt } = body;

    if (!prompt) {
      return NextResponse.json(
        { error: 'O campo "prompt" é obrigatório.' },
        { status: 400 }
      );
    }

    // Criação e execução do thread
    const run = await openai.beta.threads.createAndRun({
      assistant_id: assistantId,  // Garantido como string
      thread: {
        messages: [{ role: "user", content: prompt }],
      },
    });

    const threadId = run.thread_id;
    const runId = run.id;

    // Verificação do status do run
    while (true) {
      const runStatus = await openai.beta.threads.runs.retrieve(threadId, runId);

      if (runStatus.status === "completed") {
        const threadMessages = await openai.beta.threads.messages.list(threadId);
        const responseContent =
          threadMessages.data[0]?.content[0]?.type === "text"
            ? threadMessages.data[0].content[0].text.value
            : "";

        return NextResponse.json({ response: responseContent });
      } else if (runStatus.status === "failed") {
        return NextResponse.json(
          { error: "Falha no processamento do OpenAI Assistant." },
          { status: 500 }
        );
      }

      await new Promise((resolve) => setTimeout(resolve, 100)); // Atraso de 100ms
    }
  } catch (error) {
    console.error("Erro ao executar o thread:", error);
    return NextResponse.json(
      { error: "Erro interno no servidor." },
      { status: 500 }
    );
  }
}
