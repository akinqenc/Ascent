const mongoose = require('mongoose');
const config = require('../../config.json');

module.exports = {
    name: "ready",
    once: true,
    async execute(client) {
        mongoose.set("strictQuery", false);
        await mongoose.connect(config.mongodb || '', {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });

        if (mongoose.connection.readyState === 1) {
            console.log("MongoDB Bağlantısı Başarılı!");
        }

        console.log(`${client.user.username} aktif`);

    }
}
