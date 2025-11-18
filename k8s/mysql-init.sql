-- Allow root user to connect from any host
CREATE USER IF NOT EXISTS 'root'@'%' IDENTIFIED BY 'password';
GRANT ALL PRIVILEGES ON *.* TO 'root'@'%' WITH GRANT OPTION;
FLUSH PRIVILEGES;

-- Allow survey user to connect from any host
CREATE USER IF NOT EXISTS 'survey'@'%' IDENTIFIED BY 'survey_pass';
GRANT ALL PRIVILEGES ON survey_db.* TO 'survey'@'%';
FLUSH PRIVILEGES;

