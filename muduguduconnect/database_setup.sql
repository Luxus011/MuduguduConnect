-- ═══════════════════════════════════════════════════════════════
-- MUDUGUDUCONNECT - DATABASE CREATION SCRIPT
-- Execute this in phpMyAdmin or MySQL Workbench
-- ═══════════════════════════════════════════════════════════════

-- Create database
CREATE DATABASE IF NOT EXISTS muduguduconnect CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE muduguduconnect;

-- ═══════════════════════════════════════════════════════════════
-- USERS TABLE
-- ═══════════════════════════════════════════════════════════════
DROP TABLE IF EXISTS reviews;
DROP TABLE IF EXISTS reports;
DROP TABLE IF EXISTS workers;
DROP TABLE IF EXISTS users;

CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role ENUM('employer', 'worker') NOT NULL DEFAULT 'employer',
    verified BOOLEAN DEFAULT FALSE,
    verify_code VARCHAR(6),
    verify_expires DATETIME,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_email (email),
    INDEX idx_role (role),
    INDEX idx_verified (verified)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ═══════════════════════════════════════════════════════════════
-- WORKERS TABLE
-- ═══════════════════════════════════════════════════════════════
CREATE TABLE workers (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    job ENUM('Cleaner', 'Babysitter', 'Guard', 'Cook', 'Gardener', 'Driver', 'Nurse', 'Night guard') NOT NULL,
    location VARCHAR(100) NOT NULL,
    availability ENUM('Available Now', 'Available This Week', 'Booked') DEFAULT 'Available Now',
    description TEXT,
    skills TEXT DEFAULT '[]',
    rate_per_day INT DEFAULT 0 COMMENT 'In RWF',
    exp_years INT DEFAULT 0,
    phone VARCHAR(20),
    photo VARCHAR(255),
    rating FLOAT DEFAULT 0.0,
    review_count INT DEFAULT 0,
    trust_score INT DEFAULT 50 CHECK (trust_score >= 0 AND trust_score <= 100),
    boosted BOOLEAN DEFAULT FALSE COMMENT 'Premium boost feature',
    is_online BOOLEAN DEFAULT FALSE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_job (job),
    INDEX idx_location (location),
    INDEX idx_availability (availability),
    INDEX idx_rating (rating),
    INDEX idx_boosted (boosted)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ═══════════════════════════════════════════════════════════════
-- REVIEWS TABLE
-- ═══════════════════════════════════════════════════════════════
CREATE TABLE reviews (
    id INT AUTO_INCREMENT PRIMARY KEY,
    worker_id INT NOT NULL,
    employer_id INT NOT NULL,
    rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (worker_id) REFERENCES workers(id) ON DELETE CASCADE,
    FOREIGN KEY (employer_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_worker_id (worker_id),
    INDEX idx_employer_id (employer_id),
    INDEX idx_rating (rating)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ═══════════════════════════════════════════════════════════════
-- REPORTS TABLE
-- ═══════════════════════════════════════════════════════════════
CREATE TABLE reports (
    id INT AUTO_INCREMENT PRIMARY KEY,
    reporter_id INT NOT NULL,
    target_id INT NOT NULL,
    reason ENUM('Fake profile', 'Inappropriate behavior', 'Scam', 'Other') NOT NULL,
    details TEXT,
    resolved BOOLEAN DEFAULT FALSE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (reporter_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (target_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_reporter_id (reporter_id),
    INDEX idx_target_id (target_id),
    INDEX idx_resolved (resolved)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ═══════════════════════════════════════════════════════════════
-- INSERT DEMO DATA
-- ═══════════════════════════════════════════════════════════════

-- Insert admin user (password: admin123 - hashed with bcrypt)
INSERT INTO users (name, email, password, role, verified) VALUES 
('Admin User', 'calvin@gmail.com', '$2a$10$YourHashedPasswordHere', 'employer', TRUE);

-- Insert demo employer
INSERT INTO users (name, email, password, role, verified) VALUES 
('John Doe', 'john@example.com', '$2a$10$YourHashedPasswordHere', 'employer', TRUE);

-- Insert demo workers (linked to users)
INSERT INTO users (name, email, password, role, verified) VALUES 
('Alice Mukamana', 'alice@example.com', '$2a$10$YourHashedPasswordHere', 'worker', TRUE),
('Marie Uwimana', 'marie@example.com', '$2a$10$YourHashedPasswordHere', 'worker', TRUE),
('Jean Habimana', 'jean@example.com', '$2a$10$YourHashedPasswordHere', 'worker', TRUE),
('Pierre Nzeyimana', 'pierre@example.com', '$2a$10$YourHashedPasswordHere', 'worker', TRUE),
('Sophie Umubyeyi', 'sophie@example.com', '$2a$10$YourHashedPasswordHere', 'worker', TRUE),
('Emmanuel Mutoni', 'emmanuel@example.com', '$2a$10$YourHashedPasswordHere', 'worker', TRUE),
('Claudine Mukamana', 'claudine@example.com', '$2a$10$YourHashedPasswordHere', 'worker', TRUE),
('Joseph Bizimana', 'joseph@example.com', '$2a$10$YourHashedPasswordHere', 'worker', TRUE);

-- Insert worker profiles
INSERT INTO workers (user_id, job, location, availability, description, skills, rate_per_day, exp_years, phone, rating, review_count, trust_score) VALUES
(3, 'Babysitter', 'Remera', 'Available Now', 'Experienced babysitter with 5 years of experience. Certified in child first aid.', '["Child care", "Cooking", "Homework help"]', 15000, 5, '0780000001', 4.8, 12, 95),
(4, 'Cleaner', 'Kacyiru', 'Available Now', 'Professional cleaner for homes and offices. Detail-oriented and reliable.', '["Deep cleaning", "Laundry", "Ironing"]', 12000, 3, '0780000002', 4.9, 8, 92),
(5, 'Guard', 'Kigali', 'Available Now', 'Security guard with military background. Trained in surveillance and access control.', '["Security", "Surveillance", "First aid"]', 18000, 8, '0780000003', 4.7, 5, 88),
(6, 'Cook', 'Gisozi', 'Available This Week', 'Professional cook specializing in Rwandan and international cuisine.', '["Rwandan cuisine", "International dishes", "Baking"]', 20000, 6, '0780000004', 4.9, 15, 97),
(7, 'Gardener', 'Nyamirambo', 'Available Now', 'Expert gardener with knowledge of local plants and landscaping.', '["Landscaping", "Plant care", "Lawn maintenance"]', 10000, 4, '0780000005', 4.6, 7, 85),
(8, 'Driver', 'Kimihurura', 'Available Now', 'Professional driver with clean license. Knows Kigali very well.', '["Driving", "Vehicle maintenance", "Route planning"]', 25000, 10, '0780000006', 4.8, 20, 98),
(9, 'Nurse', 'Muhima', 'Available Now', 'Registered nurse with experience in elderly care and medical assistance.', '["Medical care", "Elderly care", "Medication management"]', 30000, 7, '0780000007', 4.9, 10, 96),
(10, 'Night guard', 'Kibagabaga', 'Available Now', 'Reliable night guard for residential areas. Alert and trustworthy.', '["Night surveillance", "Access control", "Emergency response"]', 15000, 5, '0780000008', 4.5, 3, 80);

-- Insert demo reviews
INSERT INTO reviews (worker_id, employer_id, rating, comment) VALUES
(1, 2, 5, 'Alice is amazing with our kids! Very professional and caring.'),
(1, 2, 4, 'Great babysitter, very reliable.'),
(2, 2, 5, 'Marie does an excellent job cleaning our home. Highly recommended!'),
(3, 2, 4, 'Jean is very professional and punctual.'),
(4, 2, 5, 'Pierre is an excellent cook! Our guests loved the food.'),
(5, 2, 5, 'Sophie transformed our garden. Very knowledgeable.'),
(6, 2, 5, 'Emmanuel is a safe driver. Very recommendable.'),
(7, 2, 5, 'Claudine took great care of my elderly mother.');

-- Insert demo reports
INSERT INTO reports (reporter_id, target_id, reason, details, resolved) VALUES
(2, 3, 'Other', 'Test report for demo purposes', TRUE);

-- ═══════════════════════════════════════════════════════════════
-- VERIFY SETUP
-- ═══════════════════════════════════════════════════════════════
SELECT 'Database created successfully!' AS status;
SELECT COUNT(*) AS total_users FROM users;
SELECT COUNT(*) AS total_workers FROM workers;
SELECT COUNT(*) AS total_reviews FROM reviews;
SELECT COUNT(*) AS total_reports FROM reports;