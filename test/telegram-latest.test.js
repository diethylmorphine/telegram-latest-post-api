import { test } from "node:test";
import assert from "node:assert/strict";
import handler, { extractLatestPostId } from "../api/telegram-latest.js";

function responseStub() {
  return {
    headers: {},
    statusCode: 200,
    setHeader(name, value) { this.headers[name] = value; },
    status(value) { this.statusCode = value; return this; },
    json(value) { this.body = value; return this; },
    end() { this.ended = true; return this; },
  };
}

test("extracts the highest valid post ID for the configured channel", () => {
  const html = '<div data-post="iamdiethylmorphine/12"></div><div data-post="iamdiethylmorphine/37"></div>';
  assert.equal(extractLatestPostId(html, "iamdiethylmorphine"), 37);
  assert.equal(extractLatestPostId('<div data-post="otherchannel/99"></div>', "iamdiethylmorphine"), null);
});

test("returns 404 when the channel page contains no posts", async (t) => {
  const original = globalThis.fetch;
  t.after(() => { globalThis.fetch = original; });
  globalThis.fetch = async () => new Response("<html>empty</html>");
  const res = responseStub();
  await handler({ method: "GET" }, res);
  assert.equal(res.statusCode, 404);
  assert.equal(res.body.channel, "iamdiethylmorphine");
});

test("returns a generic error on network failure", async (t) => {
  const original = globalThis.fetch;
  t.after(() => { globalThis.fetch = original; });
  globalThis.fetch = async () => { throw new Error("private upstream detail"); };
  const res = responseStub();
  await handler({ method: "GET" }, res);
  assert.equal(res.statusCode, 502);
  assert.deepEqual(res.body, { success: false, error: "Failed to fetch latest post" });
  assert.ok(!JSON.stringify(res.body).includes("private upstream detail"));
});

test("rejects methods other than GET and OPTIONS", async () => {
  const res = responseStub();
  await handler({ method: "POST" }, res);
  assert.equal(res.statusCode, 405);
  assert.equal(res.headers.Allow, "GET, OPTIONS");
});
