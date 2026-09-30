INSERT INTO customers (
	customer_number,
	customer_name,
	contact_name,
	email,
	phone,
	status
)
VALUES
	(
		'CUST-1001',
		'Carter Dental',
		'Daniel Carter',
		'daniel@carterdental.com',
		'803-555-0142',
		'Active'
	),
	(
		'CUST-1002',
		'Palmetto Law Group',
		'Sarah Mitchell',
		'sarah@palmettolaw.com',
		'803-555-0184',
		'Active'
	),
	(
		'CUST-1003',
		'Rivers Coffe',
		'Jordan Rivers',
		'jordan@riverscoffee.com',
		'803-555-0197',
		'Active'
	);

INSERT INTO service_tickets (
	ticket_number,
	customer_id,
	description,
	priority,
	status,
	technician,
	schedule_date,
	schedule_time
)

VALUES
	(
		'TKT-1001',
		(
			SELECT id
			FROM customers
			WHERE customer_number = 'CUST-1001'
		),
		'Install network switch',
		'High',
		'Open',
		NULL,
		NULL,
		NULL
	),
	(
		'TKT-1002',
		(
			SELECT id
			FROM customers
			WHERE customer_number = 'CUST-1002'
		),
		'Troubleshoot wireless access point',
		'Medium',
		'Scheduled', 
		'Michael Schmidt',
		'2026-10-02',
		'09:00:00'
	),
	(
		'TKT-1003',
		(
			SELECT id
			FROM customers
			WHERE customer_number = 'CUST-1003'
		),
		'Replace damaged network cable',
		'Low',
		'Completed',
		'Alex Torres',
		NULL,
		NULL
	);