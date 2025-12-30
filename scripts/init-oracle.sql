-- 🏆 CastQuest Hackathon 2026 - Oracle Database Initialization
-- This script creates all necessary tables and indexes for the supercharged system

-- =====================================================
-- 1. FRAMES TABLE
-- =====================================================
CREATE TABLE frames (
    id VARCHAR2(100) PRIMARY KEY,
    title VARCHAR2(500) NOT NULL,
    description CLOB,
    image_url VARCHAR2(1000),
    cast_id VARCHAR2(100),
    author_fid NUMBER,
    author_username VARCHAR2(100),
    status VARCHAR2(50) DEFAULT 'active',
    template_id VARCHAR2(100),
    interaction_count NUMBER DEFAULT 0,
    last_interaction TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    metadata CLOB -- JSON metadata
);

CREATE INDEX idx_frames_status ON frames(status);
CREATE INDEX idx_frames_author ON frames(author_fid);
CREATE INDEX idx_frames_template ON frames(template_id);
CREATE INDEX idx_frames_created ON frames(created_at DESC);

-- =====================================================
-- 2. QUESTS TABLE
-- =====================================================
CREATE TABLE quests (
    id VARCHAR2(100) PRIMARY KEY,
    title VARCHAR2(500) NOT NULL,
    description CLOB,
    quest_type VARCHAR2(50) NOT NULL,
    difficulty VARCHAR2(50),
    status VARCHAR2(50) DEFAULT 'active',
    reward_amount NUMBER,
    reward_type VARCHAR2(50),
    total_steps NUMBER DEFAULT 0,
    participants_count NUMBER DEFAULT 0,
    completion_count NUMBER DEFAULT 0,
    start_date TIMESTAMP,
    end_date TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    metadata CLOB -- JSON metadata
);

CREATE INDEX idx_quests_status ON quests(status);
CREATE INDEX idx_quests_type ON quests(quest_type);
CREATE INDEX idx_quests_difficulty ON quests(difficulty);
CREATE INDEX idx_quests_dates ON quests(start_date, end_date);

-- =====================================================
-- 3. QUEST PROGRESS TABLE
-- =====================================================
CREATE TABLE quest_progress (
    id VARCHAR2(100) PRIMARY KEY,
    quest_id VARCHAR2(100) NOT NULL,
    user_fid NUMBER NOT NULL,
    username VARCHAR2(100),
    current_step NUMBER DEFAULT 0,
    total_steps NUMBER,
    status VARCHAR2(50) DEFAULT 'in_progress',
    started_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP,
    last_activity TIMESTAMP,
    metadata CLOB, -- JSON metadata
    CONSTRAINT fk_quest_progress_quest FOREIGN KEY (quest_id) REFERENCES quests(id)
);

CREATE INDEX idx_quest_progress_quest ON quest_progress(quest_id);
CREATE INDEX idx_quest_progress_user ON quest_progress(user_fid);
CREATE INDEX idx_quest_progress_status ON quest_progress(status);

-- =====================================================
-- 4. MINTS TABLE
-- =====================================================
CREATE TABLE mints (
    id VARCHAR2(100) PRIMARY KEY,
    token_id VARCHAR2(100) UNIQUE,
    contract_address VARCHAR2(100),
    owner_fid NUMBER,
    owner_address VARCHAR2(100),
    mint_type VARCHAR2(50),
    status VARCHAR2(50) DEFAULT 'pending',
    transaction_hash VARCHAR2(100),
    block_number NUMBER,
    quest_id VARCHAR2(100),
    frame_id VARCHAR2(100),
    amount NUMBER,
    metadata CLOB, -- JSON metadata
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    minted_at TIMESTAMP,
    claimed_at TIMESTAMP
);

CREATE INDEX idx_mints_owner ON mints(owner_fid);
CREATE INDEX idx_mints_status ON mints(status);
CREATE INDEX idx_mints_quest ON mints(quest_id);
CREATE INDEX idx_mints_frame ON mints(frame_id);
CREATE INDEX idx_mints_created ON mints(created_at DESC);

-- =====================================================
-- 5. WORKERS TABLE
-- =====================================================
CREATE TABLE workers (
    id VARCHAR2(100) PRIMARY KEY,
    worker_type VARCHAR2(50) NOT NULL,
    status VARCHAR2(50) DEFAULT 'idle',
    last_task_id VARCHAR2(100),
    last_task_type VARCHAR2(50),
    tasks_completed NUMBER DEFAULT 0,
    tasks_failed NUMBER DEFAULT 0,
    average_task_time NUMBER, -- milliseconds
    last_active TIMESTAMP,
    last_error CLOB,
    metadata CLOB, -- JSON metadata
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_workers_status ON workers(status);
CREATE INDEX idx_workers_type ON workers(worker_type);
CREATE INDEX idx_workers_active ON workers(last_active DESC);

-- =====================================================
-- 6. BRAIN EVENTS TABLE
-- =====================================================
CREATE TABLE brain_events (
    id VARCHAR2(100) PRIMARY KEY,
    event_type VARCHAR2(100) NOT NULL,
    event_category VARCHAR2(50),
    thought_id VARCHAR2(100),
    confidence NUMBER,
    context CLOB, -- JSON context
    data CLOB, -- JSON data
    outcome VARCHAR2(50),
    processing_time NUMBER, -- milliseconds
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_brain_events_type ON brain_events(event_type);
CREATE INDEX idx_brain_events_category ON brain_events(event_category);
CREATE INDEX idx_brain_events_thought ON brain_events(thought_id);
CREATE INDEX idx_brain_events_created ON brain_events(created_at DESC);

-- =====================================================
-- 7. BRAIN SUGGESTIONS TABLE
-- =====================================================
CREATE TABLE brain_suggestions (
    id VARCHAR2(100) PRIMARY KEY,
    suggestion_type VARCHAR2(100) NOT NULL,
    title VARCHAR2(500),
    description CLOB,
    priority VARCHAR2(50),
    confidence NUMBER,
    status VARCHAR2(50) DEFAULT 'pending',
    thought_id VARCHAR2(100),
    context CLOB, -- JSON context
    metadata CLOB, -- JSON metadata
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    reviewed_at TIMESTAMP,
    implemented_at TIMESTAMP
);

CREATE INDEX idx_brain_suggestions_type ON brain_suggestions(suggestion_type);
CREATE INDEX idx_brain_suggestions_priority ON brain_suggestions(priority);
CREATE INDEX idx_brain_suggestions_status ON brain_suggestions(status);
CREATE INDEX idx_brain_suggestions_created ON brain_suggestions(created_at DESC);

-- =====================================================
-- 8. USER PERMISSIONS TABLE
-- =====================================================
CREATE TABLE user_permissions (
    id VARCHAR2(100) PRIMARY KEY,
    user_id VARCHAR2(100) NOT NULL,
    username VARCHAR2(100),
    email VARCHAR2(200),
    role_id VARCHAR2(50) NOT NULL,
    role_name VARCHAR2(100),
    permissions CLOB, -- JSON array of permissions
    is_active NUMBER(1) DEFAULT 1,
    last_login TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_user_permissions_user ON user_permissions(user_id);
CREATE INDEX idx_user_permissions_role ON user_permissions(role_id);
CREATE INDEX idx_user_permissions_active ON user_permissions(is_active);

-- =====================================================
-- 9. SYSTEM HEALTH TABLE
-- =====================================================
CREATE TABLE system_health (
    id VARCHAR2(100) PRIMARY KEY,
    component_name VARCHAR2(100) NOT NULL,
    component_type VARCHAR2(50),
    status VARCHAR2(50) NOT NULL,
    health_score NUMBER,
    metrics CLOB, -- JSON metrics
    last_check TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_error CLOB,
    uptime_seconds NUMBER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_system_health_component ON system_health(component_name);
CREATE INDEX idx_system_health_status ON system_health(status);
CREATE INDEX idx_system_health_check ON system_health(last_check DESC);

-- =====================================================
-- 10. VIEWS FOR ANALYTICS
-- =====================================================

-- Active Frames View
CREATE OR REPLACE VIEW v_active_frames AS
SELECT 
    COUNT(*) as total_frames,
    COUNT(CASE WHEN status = 'active' THEN 1 END) as active_frames,
    COUNT(CASE WHEN interaction_count > 0 THEN 1 END) as frames_with_interactions,
    AVG(interaction_count) as avg_interactions
FROM frames;

-- Quest Statistics View
CREATE OR REPLACE VIEW v_quest_stats AS
SELECT 
    COUNT(*) as total_quests,
    COUNT(CASE WHEN status = 'active' THEN 1 END) as active_quests,
    COUNT(CASE WHEN status = 'completed' THEN 1 END) as completed_quests,
    SUM(participants_count) as total_participants,
    SUM(completion_count) as total_completions,
    AVG(completion_count * 100.0 / NULLIF(participants_count, 0)) as avg_completion_rate
FROM quests;

-- Mint Statistics View
CREATE OR REPLACE VIEW v_mint_stats AS
SELECT 
    COUNT(*) as total_mints,
    COUNT(CASE WHEN status = 'pending' THEN 1 END) as pending_mints,
    COUNT(CASE WHEN status = 'completed' THEN 1 END) as completed_mints,
    COUNT(CASE WHEN status = 'claimed' THEN 1 END) as claimed_mints,
    COUNT(DISTINCT owner_fid) as unique_minters
FROM mints;

-- Worker Performance View
CREATE OR REPLACE VIEW v_worker_performance AS
SELECT 
    worker_type,
    COUNT(*) as total_workers,
    COUNT(CASE WHEN status = 'active' THEN 1 END) as active_workers,
    COUNT(CASE WHEN status = 'idle' THEN 1 END) as idle_workers,
    SUM(tasks_completed) as total_tasks_completed,
    SUM(tasks_failed) as total_tasks_failed,
    AVG(average_task_time) as avg_task_time,
    AVG(tasks_completed * 100.0 / NULLIF(tasks_completed + tasks_failed, 0)) as success_rate
FROM workers
GROUP BY worker_type;

-- Brain Activity View
CREATE OR REPLACE VIEW v_brain_activity AS
SELECT 
    COUNT(*) as total_events,
    COUNT(DISTINCT thought_id) as unique_thoughts,
    AVG(confidence) as avg_confidence,
    AVG(processing_time) as avg_processing_time,
    COUNT(CASE WHEN event_category = 'pattern' THEN 1 END) as pattern_events,
    COUNT(CASE WHEN event_category = 'decision' THEN 1 END) as decision_events,
    COUNT(CASE WHEN event_category = 'prediction' THEN 1 END) as prediction_events
FROM brain_events
WHERE created_at > SYSTIMESTAMP - INTERVAL '1' DAY;

-- =====================================================
-- 11. SAMPLE DATA FOR DEVELOPMENT
-- =====================================================

-- Insert sample frames
INSERT INTO frames (id, title, description, author_fid, author_username, status, interaction_count)
VALUES ('frame_1', 'Welcome Frame', 'Welcome to CastQuest', 12345, 'admin', 'active', 150);

INSERT INTO frames (id, title, description, author_fid, author_username, status, interaction_count)
VALUES ('frame_2', 'Quest Board', 'Browse available quests', 12345, 'admin', 'active', 230);

-- Insert sample quests
INSERT INTO quests (id, title, description, quest_type, difficulty, status, reward_amount, reward_type, total_steps, participants_count)
VALUES ('quest_1', 'Onboarding Quest', 'Complete your profile', 'onboarding', 'easy', 'active', 100, 'points', 3, 45);

INSERT INTO quests (id, title, description, quest_type, difficulty, status, reward_amount, reward_type, total_steps, participants_count)
VALUES ('quest_2', 'Social Butterfly', 'Connect with 10 users', 'social', 'medium', 'active', 500, 'points', 10, 28);

-- Insert sample workers
INSERT INTO workers (id, worker_type, status, tasks_completed, tasks_failed, average_task_time)
VALUES ('worker_1', 'frame_processing', 'idle', 1542, 12, 850);

INSERT INTO workers (id, worker_type, status, tasks_completed, tasks_failed, average_task_time)
VALUES ('worker_2', 'quest_validation', 'active', 892, 5, 1200);

-- Insert sample brain events
INSERT INTO brain_events (id, event_type, event_category, confidence, processing_time)
VALUES ('event_1', 'pattern_recognized', 'pattern', 0.89, 1150);

INSERT INTO brain_events (id, event_type, event_category, confidence, processing_time)
VALUES ('event_2', 'decision_made', 'decision', 0.92, 980);

-- Insert sample permissions
INSERT INTO user_permissions (id, user_id, username, email, role_id, role_name, permissions)
VALUES ('perm_1', 'admin', 'admin', 'admin@castquest.xyz', 'super_admin', 'Super Administrator', '["system.admin"]');

-- =====================================================
-- 12. COMMIT
-- =====================================================
COMMIT;

-- Display setup summary
SELECT 'CastQuest Hackathon 2026 - Oracle Database Initialized!' as status FROM dual;
SELECT 'Total Tables Created: 9' as info FROM dual;
SELECT 'Total Views Created: 5' as info FROM dual;
SELECT 'Sample Data Inserted: YES' as info FROM dual;
