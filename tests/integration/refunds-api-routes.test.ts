import fs from "node:fs/promises";
import path from "node:path";

import { beforeEach, describe, expect, it } from "vitest";

import { PATCH as patchRefund } from "@/app/api/refunds/[id]/route";
import { GET as getRefunds, POST as postRefund } from "@/app/api/refunds/route";
import type { RefundTicket } from "@/data/admin";

async function asJson<T>(response: Response): Promise<T> {
  return (await response.json()) as T;
}

describe("refunds api routes", () => {
  beforeEach(async () => {
    const testStorePath = path.join("/tmp", `skillzone-refund-store-test-${Date.now()}-${Math.random().toString(16).slice(2)}.json`);
    process.env.SKILLZONE_REFUND_STORE_PATH = testStorePath;
    await fs.writeFile(testStorePath, JSON.stringify({ tickets: [] }, null, 2), "utf-8");
  });

  it("creates refund and prevents duplicate per booking", async () => {
    const payload = {
      bookingId: "booking-refund-1",
      invoice: "#5001",
      studentName: "Елена Смирнова",
      amountRubles: 2990,
      reason: "Занятие отменено преподавателем"
    };

    const firstCreate = await postRefund(
      new Request("http://localhost/api/refunds", {
        method: "POST",
        body: JSON.stringify({ ticket: payload })
      })
    );
    expect(firstCreate.status).toBe(200);
    const created = await asJson<{ tickets: RefundTicket[]; mode: "created" | "existing" }>(firstCreate);
    expect(created.mode).toBe("created");
    expect(created.tickets).toHaveLength(1);

    const duplicateCreate = await postRefund(
      new Request("http://localhost/api/refunds", {
        method: "POST",
        body: JSON.stringify({ ticket: payload })
      })
    );
    expect(duplicateCreate.status).toBe(200);
    const duplicate = await asJson<{ tickets: RefundTicket[]; mode: "created" | "existing" }>(duplicateCreate);
    expect(duplicate.mode).toBe("existing");
    expect(duplicate.tickets).toHaveLength(1);

    const listResponse = await getRefunds();
    const listed = await asJson<{ tickets: RefundTicket[] }>(listResponse);
    expect(listed.tickets).toHaveLength(1);
    expect(listed.tickets[0]?.bookingId).toBe(payload.bookingId);
  });

  it("updates refund status through patch route", async () => {
    const createResponse = await postRefund(
      new Request("http://localhost/api/refunds", {
        method: "POST",
        body: JSON.stringify({
          ticket: {
            bookingId: "booking-refund-2",
            invoice: "#5002",
            studentName: "Максим Лебедев",
            amountRubles: 1990,
            reason: "Технический сбой"
          }
        })
      })
    );
    const created = await asJson<{ tickets: RefundTicket[]; item: RefundTicket }>(createResponse);
    const ticketId = created.item.id;

    const patchResponse = await patchRefund(
      new Request(`http://localhost/api/refunds/${ticketId}`, {
        method: "PATCH",
        body: JSON.stringify({
          update: {
            status: "approved"
          }
        })
      }),
      {
        params: {
          id: ticketId
        }
      }
    );

    expect(patchResponse.status).toBe(200);
    const patched = await asJson<{ tickets: RefundTicket[] }>(patchResponse);
    expect(patched.tickets[0]?.status).toBe("approved");
  });
});
