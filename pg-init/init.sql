-- This script is run when the PostgreSQL container is initialized.

-- Create the pgvector extension, which is required for vector similarity searches.
-- The CREATE DATABASE command is handled by the Docker environment variables,
-- so we connect to the 'photos' database and run this script.
CREATE EXTENSION IF NOT EXISTS vector;

-- Create a table to store photo metadata and their corresponding vector embeddings.
CREATE TABLE IF NOT EXISTS photos (
    id SERIAL PRIMARY KEY,
    filename VARCHAR(255) NOT NULL,
    s3_key VARCHAR(1024) NOT NULL UNIQUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,

    -- The vector column will store the 512-dimensional embedding from the CLIP model.
    embedding vector(512)
);

-- You can add indexes later for performance, for example:
-- CREATE INDEX ON photos USING ivfflat (embedding vector_l2_ops) WITH (lists = 100);
-- The choice of index and parameters depends on the dataset size and query patterns.