
-- Users table
CREATE TABLE Users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT NOT NULL UNIQUE,
    passwordHash TEXT NOT NULL,
    role TEXT DEFAULT 'candidate' CHECK (role IN ('super_admin', 'admin', 'candidate')),
    isEmailVerified BOOLEAN DEFAULT FALSE,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    lastSeenAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    email_verification_token TEXT,
    password_reset_token TEXT,
    password_reset_expires_at TIMESTAMP
);

-- UserProfile table
CREATE TABLE UserProfile (
    userId UUID PRIMARY KEY REFERENCES Users(id) ON DELETE CASCADE,
    firstName TEXT,
    lastName TEXT,
    phone TEXT,
    address TEXT,
    resumeUrl TEXT,
    aboutMe TEXT,
    photoUrl TEXT
);

-- Education table
CREATE TABLE Education (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    userId UUID REFERENCES Users(id) ON DELETE CASCADE,
    institution TEXT NOT NULL,
    degree TEXT NOT NULL,
    fieldOfStudy TEXT NOT NULL,
    startYear INTEGER NOT NULL,
    endYear INTEGER
);

-- WorkExperience table
CREATE TABLE WorkExperience (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    userId UUID REFERENCES Users(id) ON DELETE CASCADE,
    company TEXT NOT NULL,
    position TEXT NOT NULL,
    startDate DATE NOT NULL,
    endDate DATE,
    description TEXT
);

-- Skills table
CREATE TABLE Skills (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL UNIQUE
);

-- UserSkills table
CREATE TABLE UserSkills (
    userId UUID NOT NULL,
    skillId UUID NOT NULL,
    PRIMARY KEY (userId, skillId),
    FOREIGN KEY (userId) REFERENCES Users(id) ON DELETE CASCADE,
    FOREIGN KEY (skillId) REFERENCES Skills(id) ON DELETE CASCADE
);

-- Jobs table
CREATE TABLE Jobs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    location TEXT,
    description_general TEXT,
    missions TEXT,
    profile TEXT,
    advantages TEXT
);

-- Applications table
CREATE TABLE Applications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    userId UUID REFERENCES Users(id) ON DELETE CASCADE,
    jobId UUID REFERENCES Jobs(id) ON DELETE CASCADE,
    isSpontaneous BOOLEAN DEFAULT FALSE,
    appliedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'reviewed', 'rejected')),
    coverLetter TEXT
);

-- PasswordResetRequests table
CREATE TABLE PasswordResetRequests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    userId UUID REFERENCES Users(id) ON DELETE CASCADE,
    resetToken TEXT NOT NULL,
    expiresAt TIMESTAMP NOT NULL,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
