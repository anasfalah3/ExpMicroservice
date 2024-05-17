const amqp = require("amqplib");

var connection, channel;

async function connect() {
  const amqpServer = "amqp://localhost:5672";
  connection = await amqp.connect(amqpServer);

  channel = await connection.createChannel();
  var queue = "file_attente1";
  var msg = "Bonjour le monde";

  await channel.assertQueue(queue);
  await channel.sendToQueue(queue, Buffer.from(msg));

  console.log(" [x] Envoyé %s", msg);
}

connect();
