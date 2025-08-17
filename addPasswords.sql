CREATE TABLE "passwords" (
    "customer_id" int NOT NULL REFERENCES customers("id") ON DELETE CASCADE,
    "password_hash" varchar NOT NULL,
    "updated_at" timestamp,
    PRIMARY KEY ("customer_id")
);