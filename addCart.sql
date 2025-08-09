
CREATE TABLE "carts" (
  "id" int PRIMARY KEY,
  "cart_status" varchar,
  "created_at" timestamp,
  "updated_at" timestamp,
  "customer_id" int NOT NULL
);

CREATE TABLE "cart_items" (
  "cart_id" int NOT NULL,
  "product_id" int NOT NULL,
  "quantity" int NOT NULL,
  PRIMARY KEY ("cart_id", "product_id")
);

ALTER TABLE "carts" ADD FOREIGN KEY ("customer_id") REFERENCES "customers" ("id");
ALTER TABLE "carts_items" ADD FOREIGN KEY ("cart_id") REFERENCES "carts" ("id");
ALTER TABLE "cart_items" ADD FOREIGN KEY ("product_id") REFERENCES "products" ("id");