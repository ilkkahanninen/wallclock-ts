import { isHttpError } from "jsr:@oak/commons@0.7/http_errors";
import { analyzeColors } from "./colorAnalysis.ts";
import {
  addConfirmation,
  resolveConfirmation,
  waitForConfirmation,
  waitForResult,
} from "./confirmation.ts";
import { Oak } from "./deps.ts";
import { getStoptimes } from "./digitransit.ts";

const router = new Oak.Router();

router.get("/api/stoptimes/:id", async (ctx) => {
  ctx.response.body = await getStoptimes(ctx.params.id);
});

router.get("/api/colors", async (ctx) => {
  const src = ctx.request.url.searchParams.get("src");
  if (src) {
    ctx.response.body = await analyzeColors(src);
  } else {
    ctx.response.status = 400;
  }
});

router.post("/api/confirm", async (ctx) => {
  const msg = await ctx.request.body.text();
  if (msg) {
    ctx.response.body = await addConfirmation(msg);
  } else {
    ctx.response.status = 400;
  }
});

router.get("/api/confirm/:id", async (ctx) => {
  const id = parseInt(ctx.params.id);
  ctx.response.body = await waitForResult(id);
});

router.get("/api/confirm", async (ctx) => {
  ctx.response.body = await waitForConfirmation();
});

router.post("/api/confirm/:id/accept", (ctx) => {
  const id = parseInt(ctx.params.id);
  resolveConfirmation(id, true);
});

router.post("/api/confirm/:id/reject", (ctx) => {
  const id = parseInt(ctx.params.id);
  resolveConfirmation(id, false);
});

const app = new Oak.Application();

app.use(async (ctx, next) => {
  try {
    await next();
  } catch (err) {
    ctx.response.status = isHttpError(err) ? err.status : 500;
    ctx.response.body = { error: err.message };
    ctx.response.type = "json";
  }
});
app.use(router.routes());
app.use(router.allowedMethods());

app.use(async (ctx, next) => {
  try {
    console.log("static", ctx.request.url.pathname);
    await ctx.send({ root: "./static", index: "index.html" });
  } catch {
    next();
  }
});

app.listen({ port: 8001 });
