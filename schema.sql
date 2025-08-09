-- SQL dump generated using DBML (dbml.dbdiagram.io)
-- Database: PostgreSQL
-- Generated at: 2025-07-27T11:35:02.890Z

CREATE TABLE "customers" (
  "id" int PRIMARY KEY,
  "username" varchar UNIQUE NOT NULL,
  "first_name" varchar NOT NULL,
  "last_name" varchar NOT NULL,
  "email" varchar UNIQUE NOT NULL,
  "phone" varchar,
  "address" text
);

CREATE TABLE "products" (
  "id" int PRIMARY KEY,
  "title" varchar,
  "description" text,
  "price" decimal,
  "supplier_id" int NOT NULL
);

CREATE TABLE "suppliers" (
  "id" int PRIMARY KEY,
  "title" varchar UNIQUE NOT NULL,
  "address" text,
  "email" varchar UNIQUE NOT NULL,
  "phone" varchar UNIQUE NOT NULL
);

CREATE TABLE "orders" (
  "id" int PRIMARY KEY,
  "customer_id" int NOT NULL,
  "order_time" timestamp NOT NULL,
  "paid" boolean NOT NULL
);

CREATE TABLE "order_items" (
  "order_id" int NOT NULL,
  "product_id" int NOT NULL,
  "quantity" int NOT NULL,
  "shipment_id" int NOT NULL,
  PRIMARY KEY ("order_id", "product_id")
);

CREATE TABLE "shipments" (
  "id" int PRIMARY KEY,
  "carrier" varchar,
  "tracking_number" varchar UNIQUE,
  "status" varchar NOT NULL DEFAULT 'pending',
  "shipped_at" timestamp,
  "delivered_at" timestamp,
  "estimated_delivery" timestamp,
  "shipping_address" text,
  "shipping_method" varchar,
  "cost" decimal
);

COMMENT ON TABLE "customers" IS 'Stores customers';

COMMENT ON TABLE "products" IS 'Stores products';

COMMENT ON TABLE "suppliers" IS 'Stores suppliers';

COMMENT ON TABLE "orders" IS 'Stores orders';

COMMENT ON TABLE "order_items" IS 'This table uses a composite primary key on (order_id, product_id)';

ALTER TABLE "products" ADD FOREIGN KEY ("supplier_id") REFERENCES "suppliers" ("id");

ALTER TABLE "orders" ADD FOREIGN KEY ("customer_id") REFERENCES "customers" ("id");

ALTER TABLE "order_items" ADD FOREIGN KEY ("order_id") REFERENCES "orders" ("id");

ALTER TABLE "order_items" ADD FOREIGN KEY ("product_id") REFERENCES "products" ("id");

ALTER TABLE "order_items" ADD FOREIGN KEY ("shipment_id") REFERENCES "shipments" ("id");