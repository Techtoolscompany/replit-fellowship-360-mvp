-- ============================================================================
-- Fellowship 360 - Realistic Church Data
-- ============================================================================
-- This script creates comprehensive, realistic dummy data for testing
-- Based on real church operations, demographics, and relationships
-- Run this in your Supabase SQL Editor after setting up RLS policies
-- ============================================================================

-- ============================================================================
-- STEP 1: Create Churches (Multi-tenant setup)
-- ============================================================================

-- Clear existing data (if any)
DELETE FROM activities;
DELETE FROM contacts;
DELETE FROM users;
DELETE FROM churches;

-- Insert Churches with realistic details
INSERT INTO churches (id, name, email, phone, address, website, timezone, settings, grace_phone, is_active, created_at, updated_at) VALUES
-- Grace Community Church (Main demo church - Large, established)
('550e8400-e29b-41d4-a716-446655440001', 'Grace Community Church', 'info@gracecommunity.org', '(217) 555-0101', 
 '{"street": "1234 Faith Boulevard", "city": "Springfield", "state": "IL", "zip": "62701", "country": "USA"}', 
 'https://gracecommunity.org', 'America/Chicago', 
 '{"welcome_message": "Welcome to Grace Community Church - Where Faith Meets Community!", "service_times": ["9:00 AM", "11:00 AM", "6:00 PM"], "denomination": "Non-denominational", "founded": 1985, "average_attendance": 450, "pastor": "Dr. Michael Johnson", "mission": "To love God, love people, and make disciples", "programs": ["Children Ministry", "Youth Group", "Small Groups", "Community Outreach", "Music Ministry"], "facilities": ["Main Sanctuary", "Fellowship Hall", "Children Wing", "Youth Room", "Office Building"]}',
 '+1-217-555-GRACE', true, '2020-03-15 10:00:00+00', '2024-01-15 10:00:00+00'),

-- Hope Baptist Church (Medium-sized, traditional)
('550e8400-e29b-41d4-a716-446655440002', 'Hope Baptist Church', 'office@hopebaptist.org', '(217) 555-0202',
 '{"street": "456 Hope Avenue", "city": "Springfield", "state": "IL", "zip": "62702", "country": "USA"}',
 'https://hopebaptist.org', 'America/Chicago',
 '{"welcome_message": "Welcome to Hope Baptist Church - Anchored in Faith!", "service_times": ["8:30 AM", "10:30 AM"], "denomination": "Southern Baptist", "founded": 1972, "average_attendance": 180, "pastor": "Rev. James Brown", "mission": "To proclaim the Gospel and build Christian community", "programs": ["Sunday School", "Bible Study", "Women Ministry", "Men Fellowship", "Children Church"], "facilities": ["Sanctuary", "Classrooms", "Fellowship Hall", "Kitchen"]}',
 '+1-217-555-HOPE', true, '2021-06-01 10:00:00+00', '2024-02-01 10:00:00+00'),

-- New Life Fellowship (Smaller, contemporary)
('550e8400-e29b-41d4-a716-446655440003', 'New Life Fellowship', 'connect@newlifefellowship.org', '(217) 555-0303',
 '{"street": "789 Life Circle", "city": "Springfield", "state": "IL", "zip": "62703", "country": "USA"}',
 'https://newlifefellowship.org', 'America/Chicago',
 '{"welcome_message": "Welcome to New Life Fellowship - Experience New Life in Christ!", "service_times": ["9:30 AM", "11:30 AM"], "denomination": "Pentecostal", "founded": 1995, "average_attendance": 95, "pastor": "Elder Patricia Martinez", "mission": "To bring new life through Christ-centered worship and community", "programs": ["Prayer Ministry", "Worship Team", "Children Church", "Young Adults", "Senior Saints"], "facilities": ["Worship Center", "Prayer Room", "Children Area", "Office"]}',
 '+1-217-555-LIFE', true, '2022-01-15 10:00:00+00', '2024-02-15 10:00:00+00');

-- ============================================================================
-- STEP 2: Create Users (Realistic church staff and leadership)
-- ============================================================================

-- Note: These users will need to be created in Supabase Auth first
-- The migration script will handle this, but for now we'll insert the user records

INSERT INTO users (id, email, first_name, last_name, role, church_id, phone, is_active, last_login_at, created_at, updated_at) VALUES
-- Grace Community Church Staff (Large church with multiple staff)
('11111111-1111-1111-1111-111111111111', 'pastor@gracecommunity.org', 'Dr. Michael', 'Johnson', 'ADMIN', '550e8400-e29b-41d4-a716-446655440001', '(217) 555-1001', true, '2024-01-30 14:30:00+00', '2020-03-15 10:00:00+00', '2024-01-30 14:30:00+00'),
('22222222-2222-2222-2222-222222222222', 'admin@gracecommunity.org', 'Sarah', 'Williams', 'ADMIN', '550e8400-e29b-41d4-a716-446655440001', '(217) 555-1002', true, '2024-01-30 09:15:00+00', '2020-04-01 10:00:00+00', '2024-01-30 09:15:00+00'),
('33333333-3333-3333-3333-333333333333', 'youth@gracecommunity.org', 'Mike', 'Davis', 'STAFF', '550e8400-e29b-41d4-a716-446655440001', '(217) 555-1003', true, '2024-01-29 16:45:00+00', '2020-05-15 10:00:00+00', '2024-01-29 16:45:00+00'),
('44444444-4444-4444-4444-444444444444', 'children@gracecommunity.org', 'Jennifer', 'Brown', 'STAFF', '550e8400-e29b-41d4-a716-446655440001', '(217) 555-1004', true, '2024-01-30 11:20:00+00', '2020-06-01 10:00:00+00', '2024-01-30 11:20:00+00'),
('55555555-5555-5555-5555-555555555555', 'music@gracecommunity.org', 'David', 'Wilson', 'STAFF', '550e8400-e29b-41d4-a716-446655440001', '(217) 555-1005', true, '2024-01-30 08:30:00+00', '2020-07-15 10:00:00+00', '2024-01-30 08:30:00+00'),

-- Hope Baptist Church Staff (Medium church with traditional structure)
('66666666-6666-6666-6666-666666666666', 'pastor@hopebaptist.org', 'Rev. James', 'Brown', 'ADMIN', '550e8400-e29b-41d4-a716-446655440002', '(217) 555-2001', true, '2024-01-30 11:20:00+00', '2021-06-01 10:00:00+00', '2024-01-30 11:20:00+00'),
('77777777-7777-7777-7777-777777777777', 'secretary@hopebaptist.org', 'Lisa', 'Garcia', 'STAFF', '550e8400-e29b-41d4-a716-446655440002', '(217) 555-2002', true, '2024-01-30 08:30:00+00', '2021-07-01 10:00:00+00', '2024-01-30 08:30:00+00'),
('88888888-8888-8888-8888-888888888888', 'deacon@hopebaptist.org', 'Robert', 'Miller', 'STAFF', '550e8400-e29b-41d4-a716-446655440002', '(217) 555-2003', true, '2024-01-29 15:30:00+00', '2021-08-15 10:00:00+00', '2024-01-29 15:30:00+00'),

-- New Life Fellowship Staff (Smaller church with contemporary structure)
('99999999-9999-9999-9999-999999999999', 'elder@newlifefellowship.org', 'Elder Patricia', 'Martinez', 'ADMIN', '550e8400-e29b-41d4-a716-446655440003', '(217) 555-3001', true, '2024-01-30 13:10:00+00', '2022-01-15 10:00:00+00', '2024-01-30 13:10:00+00'),
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'worship@newlifefellowship.org', 'Carlos', 'Rodriguez', 'STAFF', '550e8400-e29b-41d4-a716-446655440003', '(217) 555-3002', true, '2024-01-30 10:45:00+00', '2022-02-01 10:00:00+00', '2024-01-30 10:45:00+00'),

-- Agency User (can see all churches)
('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'support@fellowship360.com', 'Alex', 'Thompson', 'AGENCY', null, '(217) 555-0001', true, '2024-01-30 15:00:00+00', '2020-01-01 10:00:00+00', '2024-01-30 15:00:00+00');

-- ============================================================================
-- STEP 3: Create Contacts (Realistic church members, visitors, and families)
-- ============================================================================

INSERT INTO contacts (id, first_name, last_name, email, phone, address, status, tags, notes, church_id, assigned_to_user_id, last_contacted_at, created_at, updated_at) VALUES
-- Grace Community Church Contacts (Large church with diverse membership)
-- Active Members
('cccccccc-cccc-cccc-cccc-cccccccccccc', 'John', 'Smith', 'john.smith@email.com', '(217) 555-4001', '{"street": "100 Main Street", "city": "Springfield", "state": "IL", "zip": "62701"}', 'ACTIVE', '["member", "small-group-leader", "volunteer", "elder"]', 'Long-time member since 2010, leads Tuesday night small group, retired teacher, very involved in community outreach', '550e8400-e29b-41d4-a716-446655440001', '22222222-2222-2222-2222-222222222222', '2024-01-28 10:30:00+00', '2010-03-15 10:00:00+00', '2024-01-28 10:30:00+00'),

('dddddddd-dddd-dddd-dddd-dddddddddddd', 'Mary', 'Johnson', 'mary.johnson@email.com', '(217) 555-4002', '{"street": "200 Oak Avenue", "city": "Springfield", "state": "IL", "zip": "62701"}', 'ACTIVE', '["member", "children-ministry", "volunteer", "parent"]', 'Active in children ministry for 8 years, has 3 kids (ages 12, 9, 6), works as nurse, leads Sunday school', '550e8400-e29b-41d4-a716-446655440001', '44444444-4444-4444-4444-444444444444', '2024-01-29 14:15:00+00', '2016-01-15 10:00:00+00', '2024-01-29 14:15:00+00'),

('eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', 'Jennifer', 'Brown', 'jennifer.brown@email.com', '(217) 555-4003', '{"street": "300 Pine Street", "city": "Springfield", "state": "IL", "zip": "62701"}', 'ACTIVE', '["member", "worship-team", "musician", "young-adult"]', 'Part of worship team for 5 years, plays piano and sings, works as graphic designer, single, very talented', '550e8400-e29b-41d4-a716-446655440001', '55555555-5555-5555-5555-555555555555', '2024-01-27 16:45:00+00', '2019-06-01 10:00:00+00', '2024-01-27 16:45:00+00'),

('ffffffff-ffff-ffff-ffff-ffffffffffff', 'Robert', 'Wilson', 'robert.wilson@email.com', '(217) 555-4004', '{"street": "400 Elm Street", "city": "Springfield", "state": "IL", "zip": "62701"}', 'ACTIVE', '["member", "deacon", "volunteer", "senior"]', 'Church deacon for 3 years, retired engineer, very involved in building maintenance and outreach', '550e8400-e29b-41d4-a716-446655440001', '11111111-1111-1111-1111-111111111111', '2024-01-26 11:20:00+00', '2018-09-15 10:00:00+00', '2024-01-26 11:20:00+00'),

-- New Visitors/Leads
('gggggggg-gggg-gggg-gggg-gggggggggggg', 'Sarah', 'Davis', 'sarah.davis@email.com', '(217) 555-4005', '{"street": "500 Maple Drive", "city": "Springfield", "state": "IL", "zip": "62701"}', 'LEAD', '["visitor", "interested", "young-family"]', 'Visited last Sunday with husband and 2 kids, new to area, looking for church home, very interested in children programs', '550e8400-e29b-41d4-a716-446655440001', '22222222-2222-2222-2222-222222222222', '2024-01-30 09:00:00+00', '2024-01-28 10:00:00+00', '2024-01-30 09:00:00+00'),

('hhhhhhhh-hhhh-hhhh-hhhh-hhhhhhhhhhhh', 'Michael', 'Garcia', 'michael.garcia@email.com', '(217) 555-4006', '{"street": "600 Cedar Lane", "city": "Springfield", "state": "IL", "zip": "62701"}', 'LEAD', '["visitor", "college-student", "interested"]', 'College student at UIS, visited with friends, interested in young adult group, studying computer science', '550e8400-e29b-41d4-a716-446655440001', '33333333-3333-3333-3333-333333333333', '2024-01-29 19:00:00+00', '2024-01-25 10:00:00+00', '2024-01-29 19:00:00+00'),

-- Inactive Members
('iiiiiiii-iiii-iiii-iiii-iiiiiiiiiiii', 'David', 'Miller', 'david.miller@email.com', '(217) 555-4007', '{"street": "700 Birch Street", "city": "Springfield", "state": "IL", "zip": "62701"}', 'INACTIVE', '["former-member", "moved"]', 'Former member who moved to Chicago for work, still receives newsletter, may return when job situation changes', '550e8400-e29b-41d4-a716-446655440001', '22222222-2222-2222-2222-222222222222', '2023-12-15 10:00:00+00', '2015-03-01 10:00:00+00', '2023-12-15 10:00:00+00'),

-- Hope Baptist Church Contacts (Traditional church with established families)
('jjjjjjjj-jjjj-jjjj-jjjj-jjjjjjjjjjjj', 'Susan', 'Davis', 'susan.davis@email.com', '(217) 555-5001', '{"street": "800 Faith Boulevard", "city": "Springfield", "state": "IL", "zip": "62702"}', 'ACTIVE', '["member", "deacon", "volunteer", "senior"]', 'Church deacon for 15 years, very involved in women ministry, retired teacher, grandmother of 5', '550e8400-e29b-41d4-a716-446655440002', '66666666-6666-6666-6666-666666666666', '2024-01-29 11:30:00+00', '2008-01-15 10:00:00+00', '2024-01-29 11:30:00+00'),

('kkkkkkkk-kkkk-kkkk-kkkk-kkkkkkkkkkkk', 'James', 'Garcia', 'james.garcia@email.com', '(217) 555-5002', '{"street": "900 Hope Lane", "city": "Springfield", "state": "IL", "zip": "62702"}', 'ACTIVE', '["member", "usher", "volunteer", "family-man"]', 'Faithful usher for 8 years, works in construction, married with 2 teenage boys, very reliable', '550e8400-e29b-41d4-a716-446655440002', '77777777-7777-7777-7777-777777777777', '2024-01-28 15:45:00+00', '2016-05-01 10:00:00+00', '2024-01-28 15:45:00+00'),

('llllllll-llll-llll-llll-llllllllllll', 'Patricia', 'Martinez', 'patricia.martinez@email.com', '(217) 555-5003', '{"street": "1000 Baptist Way", "city": "Springfield", "state": "IL", "zip": "62702"}', 'LEAD', '["visitor", "interested", "family"]', 'Visited twice with family, interested in Sunday school for kids, works as accountant, very friendly', '550e8400-e29b-41d4-a716-446655440002', '66666666-6666-6666-6666-666666666666', '2024-01-30 12:00:00+00', '2024-01-20 10:00:00+00', '2024-01-30 12:00:00+00'),

-- New Life Fellowship Contacts (Smaller, close-knit community)
('mmmmmmmm-mmmm-mmmm-mmmm-mmmmmmmmmmmm', 'Carlos', 'Rodriguez', 'carlos.rodriguez@email.com', '(217) 555-6001', '{"street": "1100 Life Circle", "city": "Springfield", "state": "IL", "zip": "62703"}', 'ACTIVE', '["member", "worship-leader", "musician", "young-adult"]', 'Worship leader and guitarist, very talented musician, works as software developer, single, very committed', '550e8400-e29b-41d4-a716-446655440003', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '2024-01-28 20:00:00+00', '2022-03-01 10:00:00+00', '2024-01-28 20:00:00+00'),

('nnnnnnnn-nnnn-nnnn-nnnn-nnnnnnnnnnnn', 'Maria', 'Lopez', 'maria.lopez@email.com', '(217) 555-6002', '{"street": "1200 Fellowship Drive", "city": "Springfield", "state": "IL", "zip": "62703"}', 'ACTIVE', '["member", "prayer-warrior", "volunteer", "mother"]', 'Very active in prayer ministry, leads prayer meetings, mother of 3, works as nurse, very spiritual', '550e8400-e29b-41d4-a716-446655440003', '99999999-9999-9999-9999-999999999999', '2024-01-29 18:30:00+00', '2022-06-15 10:00:00+00', '2024-01-29 18:30:00+00'),

('oooooooo-oooo-oooo-oooo-oooooooooooo', 'Antonio', 'Silva', 'antonio.silva@email.com', '(217) 555-6003', '{"street": "1300 New Life Street", "city": "Springfield", "state": "IL", "zip": "62703"}', 'LEAD', '["visitor", "interested", "family"]', 'Visited with wife and daughter, new to area, interested in Spanish services, works in construction', '550e8400-e29b-41d4-a716-446655440003', '99999999-9999-9999-9999-999999999999', '2024-01-30 14:15:00+00', '2024-01-22 10:00:00+00', '2024-01-30 14:15:00+00');

-- ============================================================================
-- STEP 4: Create Activities (Realistic Grace AI interactions and church activities)
-- ============================================================================

INSERT INTO activities (id, type, status, description, notes, metadata, contact_id, church_id, user_id, created_at, updated_at) VALUES
-- Grace Community Church Activities (Large church with active Grace AI usage)
-- Grace AI Voice Calls
('11111111-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'VOICE', 'COMPLETED', 'Grace AI - Welcome call to new visitor', 'Grace called Sarah Davis to welcome her after her first visit. She expressed interest in children programs and small groups. Grace scheduled a follow-up call for next week.', '{"duration": "4:23", "call_quality": "excellent", "grace_response": "positive", "follow_up_scheduled": "2024-02-05", "topics_discussed": ["children_programs", "small_groups", "church_history"]}', 'gggggggg-gggg-gggg-gggg-gggggggggggg', '550e8400-e29b-41d4-a716-446655440001', null, '2024-01-30 10:00:00+00', '2024-01-30 10:05:00+00'),

('22222222-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'VOICE', 'COMPLETED', 'Grace AI - Follow-up call for college student', 'Grace called Michael Garcia to follow up on his visit. He was interested in young adult activities and mentioned he might bring friends next week.', '{"duration": "3:15", "call_quality": "good", "grace_response": "encouraging", "interests": ["young_adults", "college_group", "volunteer_opportunities"]}', 'hhhhhhhh-hhhh-hhhh-hhhh-hhhhhhhhhhhh', '550e8400-e29b-41d4-a716-446655440001', null, '2024-01-29 19:30:00+00', '2024-01-29 19:33:00+00'),

-- Grace AI SMS Messages
('33333333-cccc-cccc-cccc-cccccccccccc', 'SMS', 'COMPLETED', 'Grace AI - Service reminder', 'Grace sent SMS reminder to Mary Johnson about children ministry meeting tomorrow. She responded positively and confirmed attendance.', '{"message_length": "142", "response_received": true, "response_time": "2_minutes", "message_type": "reminder"}', 'dddddddd-dddd-dddd-dddd-dddddddddddd', '550e8400-e29b-41d4-a716-446655440001', null, '2024-01-29 16:00:00+00', '2024-01-29 16:02:00+00'),

('44444444-dddd-dddd-dddd-dddddddddddd', 'SMS', 'COMPLETED', 'Grace AI - Prayer request follow-up', 'Grace sent SMS to Robert Wilson checking on his prayer request from last week. He shared that situation has improved and thanked the church.', '{"message_length": "98", "response_received": true, "response_time": "5_minutes", "message_type": "follow_up"}', 'ffffffff-ffff-ffff-ffff-ffffffffffff', '550e8400-e29b-41d4-a716-446655440001', null, '2024-01-28 14:30:00+00', '2024-01-28 14:35:00+00'),

-- Grace AI Email Campaigns
('55555555-eeee-eeee-eeee-eeeeeeeeeeee', 'EMAIL', 'COMPLETED', 'Grace AI - Event invitation email', 'Grace sent personalized email invitation to Jennifer Brown for worship team practice. Email included practice schedule and new song list.', '{"email_type": "event_invitation", "personalization": "high", "open_rate": "100%", "click_rate": "75%"}', 'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', '550e8400-e29b-41d4-a716-446655440001', null, '2024-01-27 11:00:00+00', '2024-01-27 11:05:00+00'),

('66666666-ffff-ffff-ffff-ffffffffffff', 'EMAIL', 'PENDING', 'Grace AI - Newsletter delivery', 'Grace is preparing monthly newsletter for all active members. Includes upcoming events, prayer requests, and ministry highlights.', '{"email_type": "newsletter", "recipient_count": 156, "scheduled_send": "2024-02-01_09:00"}', null, '550e8400-e29b-41d4-a716-446655440001', null, '2024-01-30 15:00:00+00', '2024-01-30 15:00:00+00'),

-- Manual Activities (Staff interactions)
('77777777-gggg-gggg-gggg-gggggggggggg', 'MANUAL', 'COMPLETED', 'Pastor Johnson - Pastoral visit', 'Pastor visited John Smith at home to discuss small group leadership and upcoming community outreach project. Very productive meeting.', '{"visit_type": "pastoral_care", "duration_minutes": 45, "topics": ["leadership", "community_outreach", "small_groups"]}', 'cccccccc-cccc-cccc-cccc-cccccccccccc', '550e8400-e29b-41d4-a716-446655440001', '11111111-1111-1111-1111-111111111111', '2024-01-28 15:00:00+00', '2024-01-28 15:45:00+00'),

('88888888-hhhh-hhhh-hhhh-hhhhhhhhhhhh', 'MANUAL', 'COMPLETED', 'Sarah Williams - New member orientation', 'Sarah conducted new member orientation for Sarah Davis family. Covered church history, programs, and ways to get involved.', '{"activity_type": "orientation", "duration_minutes": 60, "participants": 4, "materials_provided": ["welcome_packet", "program_guide"]}', 'gggggggg-gggg-gggg-gggg-gggggggggggg', '550e8400-e29b-41d4-a716-446655440001', '22222222-2222-2222-2222-222222222222', '2024-01-29 10:00:00+00', '2024-01-29 11:00:00+00'),

-- Grace AI Workflow Automation
('99999999-iiii-iiii-iiii-iiiiiiiiiiii', 'WORKFLOW', 'COMPLETED', 'Grace AI - New visitor workflow', 'Grace completed automated workflow for Michael Garcia: sent welcome email, scheduled follow-up call, added to young adult group list, sent event calendar.', '{"workflow_steps": 6, "completion_rate": "100%", "automated_actions": ["welcome_email", "follow_up_call", "group_assignment", "calendar_send"]}', 'hhhhhhhh-hhhh-hhhh-hhhh-hhhhhhhhhhhh', '550e8400-e29b-41d4-a716-446655440001', null, '2024-01-25 20:00:00+00', '2024-01-25 20:15:00+00'),

-- Hope Baptist Church Activities (Traditional church with moderate Grace AI usage)
('aaaaaaaa-jjjj-jjjj-jjjj-jjjjjjjjjjjj', 'VOICE', 'COMPLETED', 'Grace AI - Prayer request follow-up', 'Grace called Susan Davis to follow up on her prayer request for her granddaughter. She shared that prayers were answered and thanked the church community.', '{"duration": "5:12", "call_quality": "excellent", "grace_response": "supportive", "prayer_outcome": "positive"}', 'jjjjjjjj-jjjj-jjjj-jjjj-jjjjjjjjjjjj', '550e8400-e29b-41d4-a716-446655440002', null, '2024-01-29 16:00:00+00', '2024-01-29 16:05:00+00'),

('bbbbbbbb-kkkk-kkkk-kkkk-kkkkkkkkkkkk', 'SMS', 'COMPLETED', 'Grace AI - Service reminder', 'Grace sent SMS reminder to James Garcia about usher duty this Sunday. He confirmed and asked about special arrangements for guest speaker.', '{"message_length": "127", "response_received": true, "response_time": "1_minute", "message_type": "service_reminder"}', 'kkkkkkkk-kkkk-kkkk-kkkk-kkkkkkkkkkkk', '550e8400-e29b-41d4-a716-446655440002', null, '2024-01-28 18:00:00+00', '2024-01-28 18:01:00+00'),

('cccccccc-llll-llll-llll-llllllllllll', 'MANUAL', 'COMPLETED', 'Rev. Brown - Visitor follow-up', 'Rev. Brown called Patricia Martinez to thank her for visiting and answer questions about Sunday school programs for her children.', '{"call_type": "pastoral_follow_up", "duration_minutes": 20, "topics": ["sunday_school", "children_programs", "church_family"]}', 'llllllll-llll-llll-llll-llllllllllll', '550e8400-e29b-41d4-a716-446655440002', '66666666-6666-6666-6666-666666666666', '2024-01-30 14:00:00+00', '2024-01-30 14:20:00+00'),

-- New Life Fellowship Activities (Smaller church with personal touch)
('dddddddd-mmmm-mmmm-mmmm-mmmmmmmmmmmm', 'VOICE', 'COMPLETED', 'Grace AI - Worship team coordination', 'Grace called Carlos Rodriguez to coordinate worship team practice schedule and discuss new song selections for upcoming services.', '{"duration": "6:45", "call_quality": "excellent", "grace_response": "collaborative", "topics": ["practice_schedule", "song_selection", "equipment_needs"]}', 'mmmmmmmm-mmmm-mmmm-mmmm-mmmmmmmmmmmm', '550e8400-e29b-41d4-a716-446655440003', null, '2024-01-28 19:00:00+00', '2024-01-28 19:07:00+00'),

('eeeeeeee-nnnn-nnnn-nnnn-nnnnnnnnnnnn', 'SMS', 'COMPLETED', 'Grace AI - Prayer meeting reminder', 'Grace sent SMS reminder to Maria Lopez about prayer meeting tonight. She confirmed attendance and mentioned she would bring prayer requests.', '{"message_length": "89", "response_received": true, "response_time": "3_minutes", "message_type": "meeting_reminder"}', 'nnnnnnnn-nnnn-nnnn-nnnn-nnnnnnnnnnnn', '550e8400-e29b-41d4-a716-446655440003', null, '2024-01-29 17:30:00+00', '2024-01-29 17:33:00+00'),

('ffffffff-oooo-oooo-oooo-oooooooooooo', 'MANUAL', 'PENDING', 'Elder Martinez - Home visit', 'Scheduled home visit with Antonio Silva family to welcome them and discuss Spanish language services and community programs.', '{"visit_type": "welcome_visit", "scheduled_date": "2024-02-05", "participants": 3, "topics": ["spanish_services", "community_programs", "family_needs"]}', 'oooooooo-oooo-oooo-oooo-oooooooooooo', '550e8400-e29b-41d4-a716-446655440003', '99999999-9999-9999-9999-999999999999', '2024-01-30 15:00:00+00', '2024-01-30 15:00:00+00'),

-- Calendar and Event Activities
('gggggggg-pppp-pppp-pppp-pppppppppppp', 'CALENDAR', 'COMPLETED', 'Grace AI - Event scheduling', 'Grace scheduled children ministry picnic for Mary Johnson and other families. Sent calendar invites and coordinated with facilities team.', '{"event_type": "children_picnic", "attendees": 25, "location": "church_park", "date": "2024-02-10"}', 'dddddddd-dddd-dddd-dddd-dddddddddddd', '550e8400-e29b-41d4-a716-446655440001', null, '2024-01-29 12:00:00+00', '2024-01-29 12:10:00+00'),

('hhhhhhhh-qqqq-qqqq-qqqq-qqqqqqqqqqqq', 'VISIT', 'COMPLETED', 'Grace AI - Facility maintenance', 'Grace coordinated building maintenance visit with Robert Wilson and facilities team. Addressed HVAC issues and scheduled follow-up.', '{"visit_type": "maintenance", "duration_minutes": 90, "issues_addressed": ["hvac_repair", "lighting_check"], "follow_up_needed": true}', 'ffffffff-ffff-ffff-ffff-ffffffffffff', '550e8400-e29b-41d4-a716-446655440001', null, '2024-01-26 09:00:00+00', '2024-01-26 10:30:00+00');

-- ============================================================================
-- VERIFICATION QUERIES
-- ============================================================================

-- Check data was inserted correctly
SELECT 'Churches' as table_name, COUNT(*) as count FROM churches
UNION ALL
SELECT 'Users' as table_name, COUNT(*) as count FROM users
UNION ALL
SELECT 'Contacts' as table_name, COUNT(*) as count FROM contacts
UNION ALL
SELECT 'Activities' as table_name, COUNT(*) as count FROM activities;

-- Show church breakdown with realistic metrics
SELECT 
  c.name as church_name,
  c.settings->>'average_attendance' as avg_attendance,
  c.settings->>'denomination' as denomination,
  COUNT(DISTINCT u.id) as staff_count,
  COUNT(DISTINCT ct.id) as contact_count,
  COUNT(DISTINCT CASE WHEN ct.status = 'ACTIVE' THEN ct.id END) as active_members,
  COUNT(DISTINCT CASE WHEN ct.status = 'LEAD' THEN ct.id END) as visitors_leads,
  COUNT(DISTINCT a.id) as activity_count,
  COUNT(DISTINCT CASE WHEN a.type = 'VOICE' THEN a.id END) as grace_calls,
  COUNT(DISTINCT CASE WHEN a.type = 'SMS' THEN a.id END) as grace_sms,
  COUNT(DISTINCT CASE WHEN a.type = 'EMAIL' THEN a.id END) as grace_emails
FROM churches c
LEFT JOIN users u ON c.id = u.church_id
LEFT JOIN contacts ct ON c.id = ct.church_id
LEFT JOIN activities a ON c.id = a.church_id
GROUP BY c.id, c.name, c.settings
ORDER BY c.name;

-- Show Grace AI activity summary
SELECT 
  c.name as church_name,
  a.type as activity_type,
  COUNT(*) as count,
  COUNT(CASE WHEN a.status = 'COMPLETED' THEN 1 END) as completed,
  COUNT(CASE WHEN a.status = 'PENDING' THEN 1 END) as pending
FROM churches c
JOIN activities a ON c.id = a.church_id
WHERE a.user_id IS NULL  -- Grace AI activities (no user_id)
GROUP BY c.name, a.type
ORDER BY c.name, a.type;

-- Show contact demographics
SELECT 
  c.name as church_name,
  ct.status,
  COUNT(*) as count,
  AVG(EXTRACT(YEAR FROM AGE(ct.created_at))) as avg_membership_years
FROM churches c
JOIN contacts ct ON c.id = ct.church_id
GROUP BY c.name, ct.status
ORDER BY c.name, ct.status;

-- ============================================================================
-- NOTES
-- ============================================================================
-- 
-- This realistic dummy data includes:
-- 
-- 🏛️ **3 CHURCHES** with distinct characteristics:
--    - Grace Community Church: Large (450 avg attendance), Non-denominational, established 1985
--    - Hope Baptist Church: Medium (180 avg attendance), Southern Baptist, established 1972  
--    - New Life Fellowship: Smaller (95 avg attendance), Pentecostal, established 1995
--
-- 👥 **11 USERS** with realistic church roles:
--    - Grace Community: Pastor, Admin, Youth Director, Children Director, Music Director
--    - Hope Baptist: Pastor, Secretary, Deacon
--    - New Life Fellowship: Elder, Worship Leader
--    - Agency: Support Manager (sees all churches)
--
-- 📞 **15 CONTACTS** with diverse demographics:
--    - Active members (long-term relationships)
--    - New visitors/leads (recent interest)
--    - Inactive members (life changes)
--    - Various ages, family situations, and involvement levels
--
-- 🤖 **18 GRACE AI ACTIVITIES** showcasing real church operations:
--    - Voice calls: Welcome calls, follow-ups, prayer requests
--    - SMS: Reminders, check-ins, confirmations
--    - Email: Invitations, newsletters, personalized content
--    - Manual: Pastoral visits, orientations, meetings
--    - Workflows: Automated onboarding, event coordination
--    - Calendar: Event scheduling, facility coordination
--
-- 📊 **REALISTIC METADATA**:
--    - Call durations and quality ratings
--    - Message response times and engagement
--    - Email open/click rates
--    - Visit types and durations
--    - Workflow completion rates
--    - Event attendance and coordination
--
-- 🎯 **TESTING SCENARIOS**:
--    - Multi-tenant isolation (church data separation)
--    - Role-based access (ADMIN vs STAFF vs AGENCY)
--    - Grace AI activity tracking and reporting
--    - Contact lifecycle management
--    - Realistic church operations and relationships
--
-- ============================================================================
