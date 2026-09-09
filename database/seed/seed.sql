-- MPLAD-Guard
-- Sample / demo data for development and testing

-- =========================================
-- SAMPLE USERS
-- =========================================

INSERT INTO users (name, email, role)
VALUES
    ('Admin User', 'admin@mpladguard.com', 'Admin'),
    ('Monitoring Officer', 'officer@mpladguard.com', 'Officer'),
    ('Project Viewer', 'viewer@mpladguard.com', 'Viewer')
ON CONFLICT (email) DO NOTHING;


-- =========================================
-- SAMPLE PROJECTS
-- =========================================

INSERT INTO projects
    (name, description, category, location, budget, progress, status)
VALUES
    (
        'Community Road Development',
        'Road development project for improving local transportation.',
        'Infrastructure',
        'Pudukkottai',
        2500000,
        72,
        'In Progress'
    ),
    (
        'Government School Renovation',
        'Renovation and improvement of government school facilities.',
        'Education',
        'Tamil Nadu',
        1800000,
        45,
        'In Progress'
    ),
    (
        'Drinking Water Supply Project',
        'Development of improved drinking water facilities.',
        'Water Supply',
        'Pudukkottai',
        3200000,
        100,
        'Completed'
    );


-- =========================================
-- SAMPLE RISKS
-- =========================================

INSERT INTO risks
    (project_id, score, level, description)
SELECT
    id,
    35,
    'Low',
    'Minor schedule and resource risks identified.'
FROM projects
WHERE name = 'Community Road Development'
LIMIT 1;


INSERT INTO risks
    (project_id, score, level, description)
SELECT
    id,
    62,
    'Medium',
    'Moderate delay risk due to construction progress.'
FROM projects
WHERE name = 'Government School Renovation'
LIMIT 1;


INSERT INTO risks
    (project_id, score, level, description)
SELECT
    id,
    10,
    'Low',
    'Project completed with minimal remaining risk.'
FROM projects
WHERE name = 'Drinking Water Supply Project'
LIMIT 1;


-- =========================================
-- SAMPLE VERIFICATION RECORDS
-- =========================================

INSERT INTO verification
    (project_id, status, verifier, evidence)
SELECT
    id,
    'Verified',
    'Monitoring Officer',
    'Site inspection report and project photographs'
FROM projects
WHERE name = 'Community Road Development'
LIMIT 1;


INSERT INTO verification
    (project_id, status, verifier, evidence)
SELECT
    id,
    'Pending',
    'Not assigned',
    'School renovation documents pending review'
FROM projects
WHERE name = 'Government School Renovation'
LIMIT 1;


INSERT INTO verification
    (project_id, status, verifier, evidence)
SELECT
    id,
    'Verified',
    'Monitoring Officer',
    'Completion certificate and site inspection report'
FROM projects
WHERE name = 'Drinking Water Supply Project'
LIMIT 1;


-- =========================================
-- SAMPLE NOTIFICATIONS
-- =========================================

INSERT INTO notifications
    (user_id, title, message, is_read)
SELECT
    id,
    'Project Risk Alert',
    'Government School Renovation has a medium risk level.',
    FALSE
FROM users
WHERE email = 'admin@mpladguard.com'
LIMIT 1;


INSERT INTO notifications
    (user_id, title, message, is_read)
SELECT
    id,
    'Verification Pending',
    'A project is waiting for verification.',
    FALSE
FROM users
WHERE email = 'officer@mpladguard.com'
LIMIT 1;


-- =========================================
-- SAMPLE ANALYTICS
-- =========================================

INSERT INTO analytics
    (project_id, metric_name, metric_value)
SELECT
    id,
    'Progress',
    72
FROM projects
WHERE name = 'Community Road Development'
LIMIT 1;


INSERT INTO analytics
    (project_id, metric_name, metric_value)
SELECT
    id,
    'Progress',
    45
FROM projects
WHERE name = 'Government School Renovation'
LIMIT 1;


INSERT INTO analytics
    (project_id, metric_name, metric_value)
SELECT
    id,
    'Progress',
    100
FROM projects
WHERE name = 'Drinking Water Supply Project'
LIMIT 1;
