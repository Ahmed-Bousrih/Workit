-- =====================================
-- WorkIt Refined Database Schema v2
-- =====================================

-- Enable citext extension for case-insensitive emails
CREATE EXTENSION IF NOT EXISTS citext;

-- =====================================
-- Users Table (credentials and status only)
-- =====================================
CREATE TABLE Users (
    id BIGSERIAL PRIMARY KEY,
    email CITEXT NOT NULL UNIQUE,
    passwordHash TEXT NOT NULL,
    role TEXT DEFAULT 'candidate' CHECK (role IN ('super_admin', 'hr', 'candidate')),
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
-- UserProfile Table (user details)
-- =====================================
CREATE TABLE UserProfile (
    userId BIGINT PRIMARY KEY REFERENCES Users(id) ON DELETE CASCADE,
    firstName TEXT,
    lastName TEXT,
    phone TEXT,
    address TEXT,
    resumeUrl TEXT,
    aboutMe TEXT,
    photoUrl TEXT,
    birthDate DATE,
    gender TEXT CHECK (gender IN ('male', 'female', 'other'))
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
    currentlyStudying BOOLEAN DEFAULT FALSE,
    CONSTRAINT uniq_edu UNIQUE(userId, institution, degree, startYear)
);

-- Index for faster lookups
CREATE INDEX idx_education_userId ON Education(userId);

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
    currentlyWorking BOOLEAN DEFAULT FALSE,
    description TEXT,
    CONSTRAINT uniq_work UNIQUE(userId, company, position, startDate)
);

-- Index for faster lookups
CREATE INDEX idx_workexperience_userId ON WorkExperience(userId);

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
    postedBy BIGINT REFERENCES Users(id) ON DELETE SET NULL,
    location TEXT,
    category TEXT,
    jobType TEXT,
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

-- Index for postedBy
CREATE INDEX idx_jobs_postedBy ON Jobs(postedBy);

-- =====================================
-- Applications Table
-- =====================================
CREATE TABLE Applications (
    id BIGSERIAL PRIMARY KEY,
    userId BIGINT REFERENCES Users(id) ON DELETE CASCADE,
    jobId BIGINT REFERENCES Jobs(id) ON DELETE CASCADE,
    isSpontaneous BOOLEAN DEFAULT FALSE,
    appliedAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'reviewed', 'accepted', 'rejected')),
    coverLetter TEXT,
    isDeleted BOOLEAN DEFAULT FALSE,
    deletedAt TIMESTAMP
);
CREATE UNIQUE INDEX uniq_user_job_idx ON Applications(userId, jobId) WHERE isDeleted = FALSE;

-- Indexes for Applications
CREATE INDEX idx_applications_userId ON Applications(userId);
CREATE INDEX idx_applications_jobId ON Applications(jobId);
