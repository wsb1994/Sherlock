import { Ollama } from 'npm:ollama-node';
// Logger
import { Application } from "https://deno.land/x/oak/mod.ts";

const ollama = new Ollama();
await ollama.setModel("llama2");

const app = new Application();

// Logger
app.use(async (ctx, next) => {
  await next();
  const rt = ctx.response.headers.get("X-Response-Time");
  console.log(`${ctx.request.method} ${ctx.request.url} - ${rt}`);
});

// Timing
app.use(async (ctx, next) => {
  const start = Date.now();
  await next();
  const ms = Date.now() - start;
  ctx.response.headers.set("X-Response-Time", `${ms}ms`);
});



ollama.setSystemPrompt(`you are an AI assistant`);

// Hello World!
app.use(async (ctx) => {
  const result = ctx.request.body(); // content type automatically detected
  if (result.type === "json") {
  const value = await result.value; // an object of parsed JSON
  const post = await JSON.stringify(value);
  const output = await ollama.generate(post);
  ctx.response.body = output.output;
  }else{
    ctx.respond.body = null;
  }
  
});
console.log('listening on port 9251');
await app.listen({ port: 9251 });
