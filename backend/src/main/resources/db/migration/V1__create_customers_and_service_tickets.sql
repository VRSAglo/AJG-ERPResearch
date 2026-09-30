CREATE TABLE customers (
    id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    customer_number VARCHAR(20) NOT NULL,
    customer_name VARCHAR(150) NOT NULL,
    contact_name VARCHAR(150),
    email VARCHAR(255),
    phone VARCHAR(30),
    status VARCHAR(20) NOT NULL DEFAULT 'Pending',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL
        DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT pk_customers PRIMARY KEY (id),
    CONSTRAINT uk_customers_customer_number UNIQUE (customer_number),
    CONSTRAINT chk_customers_status
        CHECK (status IN ('Pending', 'Active', 'Archived'))
);

CREATE TABLE service_tickets (
    id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    ticket_number VARCHAR(20) NOT NULL,
    customer_id BIGINT UNSIGNED NOT NULL,
    description VARCHAR(500) NOT NULL,
    priority VARCHAR(20) NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'Open',
    technician VARCHAR(150),
    schedule_date DATE,
    schedule_time TIME,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL
        DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT pk_service_tickets PRIMARY KEY (id),
    CONSTRAINT uk_service_tickets_ticket_number UNIQUE (ticket_number),

    CONSTRAINT chk_service_tickets_priority
        CHECK (priority IN ('Low', 'Medium', 'High')),

    CONSTRAINT chk_service_tickets_status
        CHECK (status IN ('Open', 'Scheduled', 'Completed')),

    CONSTRAINT fk_service_tickets_customer
        FOREIGN KEY (customer_id)
        REFERENCES customers (id)
        ON UPDATE RESTRICT
        ON DELETE RESTRICT,

    INDEX idx_service_tickets_customer_id (customer_id),
    INDEX idx_service_tickets_status (status),
    INDEX idx_service_tickets_schedule_date (schedule_date)
);