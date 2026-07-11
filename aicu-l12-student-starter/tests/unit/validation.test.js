import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { validateTicketInput } from "../../server/validation.js";

describe("validateTicketInput", () => {
  it("rifiuta priority critica e sourceChannel sms", () => {
    const result = validateTicketInput({ priority: "critica", sourceChannel: "sms" });
    assert.equal(result.priority, "Priorita' non valida.");
    assert.equal(result.sourceChannel, "Canale di richiesta non valido.");
  });
});
