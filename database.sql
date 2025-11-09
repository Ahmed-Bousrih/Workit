-- =====================================
-- WorkIt Refined Database Schema
-- =====================================

-- Enable citext extension for case-insensitive emails
CREATE EXTENSION IF NOT EXISTS citext;

-- =====================================
-- Users Table
-- =====================================
CREATE TABLE Users (
    id BIGSERIAL PRIMARY KEY,
    email CITEXT NOT NULL UNIQUE,
    passwordHash TEXT NOT NULL,
    role TEXT DEFAULT 'candidate' CHECK (role IN ('super_admin', 'admin', 'candidate')),
    isEmailVerified BOOLEAN DEFAULT FALSE,
    createdAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    lastSeenAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    email_verification_token TEXT,
    password_reset_token TEXT,
    password_reset_expires_at TIMESTAMP
);

-- Trigger function to update updatedAt timestamp
CREATE OR REPLACE FUNCTION update_updatedAt_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updatedAt = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for Users table
CREATE TRIGGER trigger_users_updatedAt
BEFORE UPDATE ON Users
FOR EACH ROW
EXECUTE FUNCTION update_updatedAt_column();

-- =====================================
-- UserProfile Table
-- =====================================
CREATE TABLE UserProfile (
    userId BIGINT PRIMARY KEY REFERENCES Users(id) ON DELETE CASCADE,
    firstName TEXT,
    lastName TEXT,
    phone TEXT,
    address TEXT,
    resumeUrl TEXT,
    aboutMe TEXT,
    photoUrl TEXT
);

-- =====================================
-- SkillCategories Table
-- =====================================
CREATE TABLE SkillCategories (
    id BIGSERIAL PRIMARY KEY,
    name TEXT NOT NULL UNIQUE
);

-- =====================================
-- Skills Table
-- =====================================
CREATE TABLE Skills (
    id BIGSERIAL PRIMARY KEY,
    name TEXT NOT NULL UNIQUE,
    categoryId BIGINT REFERENCES SkillCategories(id)
);

-- =====================================
-- UserSkills Table
-- =====================================
CREATE TABLE UserSkills (
    userId BIGINT NOT NULL REFERENCES Users(id) ON DELETE CASCADE,
    skillId BIGINT NOT NULL REFERENCES Skills(id) ON DELETE CASCADE,
    PRIMARY KEY (userId, skillId)
);

-- Index for fast lookup of skills per user
CREATE INDEX idx_userskills_skill ON UserSkills(skillId);

-- =====================================
-- Education Table
-- =====================================
CREATE TABLE Education (
    id BIGSERIAL PRIMARY KEY,
    userId BIGINT REFERENCES Users(id) ON DELETE CASCADE,
    institution TEXT NOT NULL,
    degree TEXT NOT NULL,
    fieldOfStudy TEXT NOT NULL,
    startYear INT NOT NULL,
    endYear INT,
    CONSTRAINT uniq_edu UNIQUE(userId, institution, degree, startYear)
);

-- =====================================
-- WorkExperience Table
-- =====================================
CREATE TABLE WorkExperience (
    id BIGSERIAL PRIMARY KEY,
    userId BIGINT REFERENCES Users(id) ON DELETE CASCADE,
    company TEXT NOT NULL,
    position TEXT NOT NULL,
    startDate DATE NOT NULL,
    endDate DATE,
    description TEXT,
    CONSTRAINT uniq_work UNIQUE(userId, company, position, startDate)
);

-- =====================================
-- Jobs Table
-- =====================================
CREATE TABLE Jobs (
    id BIGSERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    createdAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    isDeleted BOOLEAN DEFAULT FALSE,
    deletedAt TIMESTAMP,
    postedBy BIGINT REFERENCES Users(id),
    location TEXT,
    description_general TEXT,
    missions TEXT,
    profile TEXT,
    advantages TEXT
);

-- Trigger for updatedAt in Jobs
CREATE TRIGGER trigger_jobs_updatedAt
BEFORE UPDATE ON Jobs
FOR EACH ROW
EXECUTE FUNCTION update_updatedAt_column();

-- =====================================
-- Applications Table
-- =====================================
CREATE TABLE Applications (
    id BIGSERIAL PRIMARY KEY,
    userId BIGINT REFERENCES Users(id) ON DELETE CASCADE,
    jobId BIGINT REFERENCES Jobs(id) ON DELETE CASCADE,
    isSpontaneous BOOLEAN DEFAULT FALSE,
    appliedAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'reviewed', 'rejected')),
    coverLetter TEXT,
    isDeleted BOOLEAN DEFAULT FALSE,
    deletedAt TIMESTAMP,
    CONSTRAINT uniq_user_job UNIQUE(userId, jobId)
);

-- =====================================
-- PasswordResetRequests Table
-- =====================================
CREATE TABLE PasswordResetRequests (
    id BIGSERIAL PRIMARY KEY,
    userId BIGINT REFERENCES Users(id) ON DELETE CASCADE,
    resetToken TEXT NOT NULL,
    expiresAt TIMESTAMP NOT NULL,
    createdAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Index for fast lookup of reset tokens
CREATE INDEX idx_resetToken ON PasswordResetRequests(resetToken);
