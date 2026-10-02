import { randomUUID } from "node:crypto";
import { describe, expect, test } from "@jest/globals";

import { findGroupIDByWishlistID } from "../../src/modules/orders/orders.repository.js";

describe("orders repository", () => {
  describe("findGroupIDByWishlistID", () => {
    test("returns null when wishlist does not exist", async () => {
      // Arrange
      const wishlistID = randomUUID();

      // Act
      const groupID = await findGroupIDByWishlistID(wishlistID);

      // Assert
      expect(groupID).toBeNull();
    });
  });
});
