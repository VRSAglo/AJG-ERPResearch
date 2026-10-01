CREATE TABLE proposals (
    id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    proposal_number VARCHAR(20) NOT NULL,
    customer_id BIGINT UNSIGNED NOT NULL,
    title VARCHAR(150) NOT NULL,
    description VARCHAR(1000) NOT NULL,
    estimated_hours DECIMAL(8, 2) NOT NULL,
    hourly_rate DECIMAL(10, 2) NOT NULL,
    total_amount DECIMAL(12, 2) NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'Draft',
    accepted_at TIMESTAMP NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL
        DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT pk_proposals
        PRIMARY KEY (id),

    CONSTRAINT uk_proposals_proposal_number
        UNIQUE (proposal_number),

    CONSTRAINT fk_proposals_customer
        FOREIGN KEY (customer_id)
        REFERENCES customers (id)
        ON UPDATE RESTRICT
        ON DELETE RESTRICT,

    CONSTRAINT chk_proposals_estimated_hours
        CHECK (estimated_hours > 0),

    CONSTRAINT chk_proposals_hourly_rate
        CHECK (hourly_rate >= 0),

    CONSTRAINT chk_proposals_total_amount
        CHECK (total_amount >= 0),

    CONSTRAINT chk_proposals_status
        CHECK (status IN ('Draft', 'Accepted', 'Declined')),

    INDEX idx_proposals_customer_id (customer_id),
    INDEX idx_proposals_status (status)
);

ALTER TABLE service_tickets
    ADD COLUMN proposal_id BIGINT UNSIGNED NULL
        AFTER customer_id,

    ADD CONSTRAINT uk_service_tickets_proposal_id
        UNIQUE (proposal_id),

    ADD CONSTRAINT fk_service_tickets_proposal
        FOREIGN KEY (proposal_id)
        REFERENCES proposals (id)
        ON UPDATE RESTRICT
        ON DELETE RESTRICT;