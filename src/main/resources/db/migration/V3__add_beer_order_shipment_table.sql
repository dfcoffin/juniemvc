-- Create beer_order_shipment table
CREATE TABLE beer_order_shipment (
    id INT AUTO_INCREMENT PRIMARY KEY,
    version INT,
    created_date TIMESTAMP,
    update_date TIMESTAMP,
    beer_order_id INT,
    shipment_date TIMESTAMP NOT NULL,
    carrier VARCHAR(255),
    tracking_number VARCHAR(255),
    FOREIGN KEY (beer_order_id) REFERENCES beer_order(id)
);