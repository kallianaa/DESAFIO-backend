-- Create Database
CREATE DATABASE desafio_backend;

-- Connect to the database
\c desafio_backend

-- Enable UUID extension if needed
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create Role table
CREATE TABLE IF NOT EXISTS "Role" (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    nome VARCHAR NOT NULL
);

-- Create Usuario (User) table
CREATE TABLE IF NOT EXISTS "Usuario" (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    nome VARCHAR NOT NULL,
    email VARCHAR UNIQUE NOT NULL,
    senha_hash VARCHAR NOT NULL
);

-- Create UsuarioRole (User-Role relationship) table
CREATE TABLE IF NOT EXISTS "UsuarioRole" (
    usuario_id UUID NOT NULL,
    role_id UUID NOT NULL,
    PRIMARY KEY (usuario_id, role_id),
    FOREIGN KEY (usuario_id) REFERENCES "Usuario"(id),
    FOREIGN KEY (role_id) REFERENCES "Role"(id)
);

-- Create Professor table
CREATE TABLE IF NOT EXISTS "Professor" (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    siape VARCHAR UNIQUE NOT NULL
);

-- Create Aluno (Student) table
CREATE TABLE IF NOT EXISTS "Aluno" (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    ra VARCHAR UNIQUE NOT NULL
);

-- Create Disciplina (Course) table
CREATE TABLE IF NOT EXISTS "Disciplina" (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    codigo VARCHAR UNIQUE NOT NULL,
    nome VARCHAR NOT NULL,
    creditos INT NOT NULL
);

-- Create PreRequisito (Prerequisites) table
CREATE TABLE IF NOT EXISTS "PreRequisito" (
    disciplina_id UUID NOT NULL,
    prerequisito_id UUID NOT NULL,
    PRIMARY KEY (disciplina_id, prerequisito_id),
    FOREIGN KEY (disciplina_id) REFERENCES "Disciplina"(id),
    FOREIGN KEY (prerequisito_id) REFERENCES "Disciplina"(id)
);

-- Create Turma (Class) table
CREATE TABLE IF NOT EXISTS "Turma" (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    codigo VARCHAR UNIQUE NOT NULL,
    disciplina_id UUID NOT NULL,
    professor_id UUID NOT NULL,
    vagas INT NOT NULL,
    dia INT NOT NULL,
    turno INT NOT NULL,
    FOREIGN KEY (disciplina_id) REFERENCES "Disciplina"(id),
    FOREIGN KEY (professor_id) REFERENCES "Professor"(id),
    -- Adding a check constraint for valid days (assuming 1-7 for weekdays)
    CONSTRAINT valid_day CHECK (dia BETWEEN 1 AND 7),
    -- Adding a check constraint for valid shifts (assuming 1-3 for morning, afternoon, night)
    CONSTRAINT valid_shift CHECK (turno BETWEEN 1 AND 3)
);

-- Create Matricula (Enrollment) table
CREATE TABLE IF NOT EXISTS "Matricula" (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    aluno_id UUID NOT NULL,
    turma_id UUID NOT NULL,
    data TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR NOT NULL,
    FOREIGN KEY (aluno_id) REFERENCES "Aluno"(id),
    FOREIGN KEY (turma_id) REFERENCES "Turma"(id),
    -- Adding a check constraint for valid status
    CONSTRAINT valid_status CHECK (status IN ('ATIVA', 'CANCELADA', 'CONCLUIDA')),
    -- Ensuring unique enrollment per student per class
    UNIQUE (aluno_id, turma_id)
);

-- Insert basic roles
INSERT INTO "Role" (id, nome) VALUES 
    (uuid_generate_v4(), 'ADMIN'),
    (uuid_generate_v4(), 'PROFESSOR'),
    (uuid_generate_v4(), 'ALUNO')
ON CONFLICT (id) DO NOTHING;

-- Create test ADMIN user
-- Password: 'teste' (hashed with bcrypt)
INSERT INTO "Usuario" (id, nome, email, senha_hash) VALUES 
    (uuid_generate_v4(), 'teste', 'admin@test.com', '$2b$10$grS5ciIpN2uxb.oSCzGWz.2q7LnSDFsjFnHyHdk8sxUey2yaW.9Cm')
ON CONFLICT (email) DO NOTHING;

-- Assign ADMIN role to the user
INSERT INTO "UsuarioRole" (usuario_id, role_id) 
SELECT u.id, r.id FROM "Usuario" u, "Role" r 
WHERE u.email = 'admin@test.com' AND r.nome = 'ADMIN'
ON CONFLICT (usuario_id, role_id) DO NOTHING;

-- Create test PROFESSOR user
-- Password: 'senha123' (hashed with bcrypt)
INSERT INTO "Usuario" (id, nome, email, senha_hash) VALUES 
    (uuid_generate_v4(), 'Professor Silva', 'professor@test.com', '$2b$10$SGQi3psOEVQJNAFtT.YcDezxErA1yAMkgh/ZFfmcHsRNjGP65Bj92')
ON CONFLICT (email) DO NOTHING;

-- Assign PROFESSOR role to the user
INSERT INTO "UsuarioRole" (usuario_id, role_id) 
SELECT u.id, r.id FROM "Usuario" u, "Role" r 
WHERE u.email = 'professor@test.com' AND r.nome = 'PROFESSOR'
ON CONFLICT (usuario_id, role_id) DO NOTHING;

-- Create Professor record with SIAPE
INSERT INTO "Professor" (id, siape)
SELECT id, 'SIAPE001' FROM "Usuario" WHERE email = 'professor@test.com'
ON CONFLICT (siape) DO NOTHING;