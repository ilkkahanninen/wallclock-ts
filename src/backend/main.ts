import { isHttpError } from "jsr:@oak/commons@0.7/http_errors";
import { Oak } from "./deps.ts";
import { getStoptimes } from "./digitransit.ts";
import { analyzeColors } from "./colorAnalysis.ts";

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
