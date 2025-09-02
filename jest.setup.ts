// __tests__/stripe.checkout.test.ts
import { POST as checkoutPOST } from "@/app/api/stripe/checkout/route";

function makeReq(body: any) {
  return new Request("http://localhost/api/stripe/checkout", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      origin: "http://localhost:3000",
    },
    body: JSON.stringify(body),
  });
}

describe("POST /api/stripe/checkout", () => {
  it("returns 400 when priceId missing", async () => {
    const res = await checkoutPOST(makeReq({}));
    const json = await res.json();
    expect(res.status).toBe(400);
    expect(json.error).toBe("MISSING_PRICE_ID");
  });

  it("returns 400 on invalid price id", async () => {
    const res = await checkoutPOST(makeReq({ priceId: "price_bad" }));
    const json = await res.json();
    expect(res.status).toBe(400);
    expect(json.error).toBe("INVALID_PRICE_ID");
  });

  it("returns 200 and url on valid price", async () => {
    const res = await checkoutPOST(makeReq({ priceId: "price_ok" }));
    const json = await res.json();
    expect(res.status).toBe(200);
    expect(json.ok).toBe(true);
    expect(typeof json.url).toBe("string");
  });
});
