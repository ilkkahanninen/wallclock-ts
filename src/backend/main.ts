import { Oak } from "./deps.ts";
import { getStoptimes } from "./digitransit.ts";

const router = new Oak.Router();

router.get("/api/stoptimes/:id", async (ctx) => {
  ctx.response.body = await getStoptimes(ctx.params.id);
});

const app = new Oak.Application();
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
