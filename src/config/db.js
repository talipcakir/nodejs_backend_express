const mysql = require('mysql'); // veya mysql2 önerilir

const connection = mysql.createConnection({
	host: process.env.DATABASE_HOST,
	port: process.env.DATABASE_PORT,
	user: process.env.DATABASE_USER,
	password: process.env.DATABASE_PASSWORD,
});

connection.connect((err) => {
	if (err) {
		console.error('❌ Veritabanına bağlanırken hata oluştu:', err.message);
		return;
	}
	console.log('✅ MySQL bağlantısı başarılı. Thread ID:', connection.threadId);

	// Veritabanı oluştur (yoksa)
	connection.query(`CREATE DATABASE IF NOT EXISTS \`${process.env.DATABASE_NAME}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;`, (err) => {
		if (err) {
			console.error('❌ Veritabanı oluşturulamadı:', err.message);
			return;
		}
		console.log(`✅ Veritabanı '${process.env.DATABASE_NAME}' oluşturuldu veya zaten mevcut.`);

		// Veritabanını seç
		connection.changeUser({ database: process.env.DATABASE_NAME }, (err) => {
			if (err) {
				console.error('❌ Veritabanı seçilemedi:', err.message);
				return;
			}

			// Users tablosu
			const createUsersTable = `
					CREATE TABLE IF NOT EXISTS users (
						id INT AUTO_INCREMENT PRIMARY KEY,
						username VARCHAR(50) NOT NULL UNIQUE,
						password VARCHAR(255) NOT NULL,
						role ENUM('user', 'admin') DEFAULT 'user',
						created_at DATETIME DEFAULT CURRENT_TIMESTAMP
					) COMMENT='Kullanıcı ve Yönetici bilgileri';
				`;
			connection.query(createUsersTable, (err) => {
				if (err) console.error('❌ users tablosu oluşturulamadı:', err.message);
				else console.log("✅ 'users' tablosu oluşturuldu veya zaten mevcut.");
			});

			// connection.query(`
			//  		DROP TABLE IF EXISTS products;`);

			// Products tablosu
			const createProductsTable = `
					CREATE TABLE IF NOT EXISTS products (
						id INT AUTO_INCREMENT PRIMARY KEY,
						title VARCHAR(255) NOT NULL,
						price DECIMAL(10,2) NOT NULL,
						category VARCHAR(100),
						description TEXT,
						image VARCHAR(255)
					) COMMENT='Ürün bilgileri';
				`;
			connection.query(createProductsTable, (err) => {
				if (err) console.error('❌ products tablosu oluşturulamadı:', err.message);
				else console.log("✅ 'products' tablosu oluşturuldu veya zaten mevcut.");
			});

			// 			connection.query(`
			// 				INSERT INTO products (id, title, price, description, category, image) VALUES
			// (1, 'Apple iPhone 14 Pro Max 128Gb Deep Purple', 1399.00, 'Enhanced capabilities thanks to an enlarged display of 6.7 inches...', 'Smartphones', '/photo/Iphone 14 pro 1.png'),
			// (2, 'Apple AirPods Max', 549.00, 'Computational audio. Listen, it''s powerful...', 'Audio', '/photo/hero__gnfk5g59t0qe_xlarge_2x 1.png'),
			// (3, 'Playstation 5', 499.00, 'Incredibly powerful CPUs, GPUs, and an SSD...', 'Gaming', '/photo/PlayStation.png'),
			// (4, 'Macbook Air M2', 999.00, 'The new 15-inch MacBook Air makes room for more...', 'Computers', '/photo/Screen.png'),
			// (5, 'iPad 10.2-inch', 329.00, 'iPad combines a magnificent 10.2-inch Retina display...', 'Computers', '/photo/Group 1.png'),
			// (6, 'Ipad Pro 11-inch', 799.00, 'Incredible performance, multitasking and ease of use...', 'Computers', '/photo/image 64 (1).png'),
			// (7, 'Samsung Galaxy Z Fold 5', 1799.00, 'Meet the phone with a big screen like a mobile movie theater...', 'Smartphones', '/photo/image 41.png'),
			// (8, 'Macbook Pro 14-inch', 1599.00, 'The most powerful Macbook Pro ever...', 'Computers', '/photo/Macbook 1.png'),
			// (9, 'Apple Watch Series 8', 399.00, 'A healthy leap ahead. With advanced health sensors...', 'Watches', '/photo/Smart Watches.png'),
			// (10, 'Sony WH-1000XM5 Headphones', 349.00, 'Our best ever noise cancelling headphones...', 'Audio', '/photo/Headphones.png'),
			// (11, 'Canon EOS R6 Mark II', 2499.00, 'A full-frame mirrorless camera for hybrid shooters...', 'Cameras', '/photo/Cameras.png'),
			// (12, 'Xbox Series X', 499.00, 'The fastest, most powerful Xbox ever...', 'Gaming', '/photo/Gaming.png');

			// 				`);
		});

		const defaultAdmin = `
        INSERT INTO users (username, password, role) VALUES 
        ('${process.env.DEFAULT_ADMIN}', '${process.env.DEFAULT_ADMIN_PASSWORD}', 'admin')
        ON DUPLICATE KEY UPDATE username=username;
      `;
	});
});

module.exports = connection;
