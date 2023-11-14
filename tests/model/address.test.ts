import { addresses } from "~/lib/placeholder-data";
import { createAddress } from "~/models/address.server";

describe("createAddress", () => {
  it("creates an address successfully", async () => {
    const mockAddressData = addresses[0];
    const createdAddress = await createAddress(mockAddressData);
    // Expect createdAddress to have the same values for relevant fields
    expect(createdAddress).toMatchObject({
      id: expect.any(String),
      customerId: mockAddressData.customerId,
      number: mockAddressData.number,
      line1: mockAddressData.line1,
      line2: mockAddressData.line2,
      suburb: mockAddressData.suburb,
      archived: expect.any(Boolean),
    });
  });
});
