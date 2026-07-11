import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { buildTicket, postTicket, startTestApplication } from "../helpers/ticket-api.js";

describe("POST /api/tickets", () => {
  it("rifiuta ticket con priority critica e sourceChannel sms", async (t) => {
    const baseUrl = await startTestApplication(t);
    const ticket = buildTicket({ priority: "critica", sourceChannel: "sms" });
    const response = await postTicket(baseUrl, ticket);
    const body = await response.json();

    assert.equal(response.status, 400);
    assert.equal(body.fieldErrors.priority, "Priorita' non valida.");
    assert.equal(body.fieldErrors.sourceChannel, "Canale di richiesta non valido.");
  });
});
