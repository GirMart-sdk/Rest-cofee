-- CreateIndex
CREATE INDEX "Order_tableId_idx" ON "Order"("tableId");
CREATE INDEX "Order_shiftId_idx" ON "Order"("shiftId");
CREATE INDEX "Order_userId_idx" ON "Order"("userId");
CREATE INDEX "Order_status_idx" ON "Order"("status");
CREATE INDEX "Order_orderType_idx" ON "Order"("orderType");
CREATE INDEX "Order_createdAt_idx" ON "Order"("createdAt");
CREATE INDEX "OrderItem_orderId_idx" ON "OrderItem"("orderId");
CREATE INDEX "OrderItem_menuItemId_idx" ON "OrderItem"("menuItemId");
CREATE INDEX "MenuItem_category_idx" ON "MenuItem"("category");
CREATE INDEX "RefreshToken_userId_revoked_idx" ON "RefreshToken"("userId", "revoked");
CREATE INDEX "Reservation_date_idx" ON "Reservation"("date");
CREATE INDEX "Reservation_status_idx" ON "Reservation"("status");
CREATE INDEX "Shift_status_idx" ON "Shift"("status");
CREATE INDEX "Shift_openedAt_idx" ON "Shift"("openedAt");

-- AlterTable: Cascade deletes
ALTER TABLE "Order" DROP CONSTRAINT "Order_userId_fkey";
ALTER TABLE "Order" ADD CONSTRAINT "Order_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "Order" DROP CONSTRAINT "Order_tableId_fkey";
ALTER TABLE "Order" ADD CONSTRAINT "Order_tableId_fkey" FOREIGN KEY ("tableId") REFERENCES "Table"("id") ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "Order" DROP CONSTRAINT "Order_shiftId_fkey";
ALTER TABLE "Order" ADD CONSTRAINT "Order_shiftId_fkey" FOREIGN KEY ("shiftId") REFERENCES "Shift"("id") ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "OrderItem" DROP CONSTRAINT "OrderItem_menuItemId_fkey";
ALTER TABLE "OrderItem" ADD CONSTRAINT "OrderItem_menuItemId_fkey" FOREIGN KEY ("menuItemId") REFERENCES "MenuItem"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "Reservation" DROP CONSTRAINT "Reservation_userId_fkey";
ALTER TABLE "Reservation" ADD CONSTRAINT "Reservation_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "Reservation" DROP CONSTRAINT "Reservation_tableId_fkey";
ALTER TABLE "Reservation" ADD CONSTRAINT "Reservation_tableId_fkey" FOREIGN KEY ("tableId") REFERENCES "Table"("id") ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "Shift" DROP CONSTRAINT "Shift_userId_fkey";
ALTER TABLE "Shift" ADD CONSTRAINT "Shift_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
