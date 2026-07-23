import {NextRequest} from "next/server";

let clientStream:ReadableStreamDefaultController | null = null;

export async function GET() {
    const stream = new ReadableStream({
        start(controller) {
            clientStream = controller;
        },
        cancel() {
            clientStream = null;
        }
    });
    return new Response(stream,{
        headers: {
            "Content-Type": "text/event-stream",
            "Cache-Control": "no-cache, no-transform",
            "Connection": "keep-alive",
        }
    });
}

export async function POST(req: NextRequest) {
    const body = await req.json();

    if(clientStream&&(body.event==="entry.update" || body.event === "entry.delete" || body.event === "entry.create")){
        clientStream.enqueue(new TextEncoder().encode(`data: refresh\n\n`));

    }
    return new Response("ok",{status:200});
}
