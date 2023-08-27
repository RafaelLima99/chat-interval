CREATE DATABASE chat;

CREATE TABLE users (
    codUser INT NOT NULL AUTO_INCREMENT,
    username VARCHAR(200),
    role VARCHAR(200),
    created_at datetime DEFAULT CURRENT_TIMESTAMP,
    
    PRIMARY KEY(codUser)
);


CREATE TABLE chats(
    id INT NOT NULL AUTO_INCREMENT,
    user_id INT,
    guid CHAR(36),
    status VARCHAR(200),
    created_at datetime DEFAULT CURRENT_TIMESTAMP,
    
    PRIMARY KEY(id),
    
    CONSTRAINT FK_user_id FOREIGN KEY (user_id)
	REFERENCES users(codUser)
    
);

CREATE TABLE chat_messages (
    id INT NOT NULL AUTO_INCREMENT,
    chat_id INT,
    sender_id INT,
    message TEXT,
    created_at datetime DEFAULT CURRENT_TIMESTAMP,
    
    PRIMARY KEY(id),
    
    CONSTRAINT chat_id FOREIGN KEY (chat_id)
	REFERENCES chats(id),
    
    CONSTRAINT sender_id FOREIGN KEY (sender_id)
	REFERENCES users(codUser)
    
);


INSERT INTO `users` (`codUser`, `username`, `role`, `created_at`) VALUES
(1, 'teste', 'teste', '2023-08-16 10:25:38'),
(2, 'ADMIN', 'ADMIN', '2023-08-18 19:08:20');


