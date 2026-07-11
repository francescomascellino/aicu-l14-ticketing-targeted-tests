import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { computeUrgencyLabel } from "../../server/ticket-rules.js";

describe("computeUrgencyLabel", () => {
  it("alta + telefono produce intervento rapido", () => {
    const result = computeUrgencyLabel("alta", "telefono");
    assert.equal(result, "intervento rapido");
  });
});
