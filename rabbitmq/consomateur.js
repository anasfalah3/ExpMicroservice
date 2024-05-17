const amqp = require("amqplib");

var connection, channel;

async function connect() {
  const amqpServer = "amqp://localhost:5672";
  connection = await amqp.connect(amqpServer);

  channel = await connection.createChannel();
  var queue = "file_attente";

  await channel.assertQueue(queue);
  await channel.consume(queue, (msg) => {
    console.log(" [x] Received %s", msg.content.toString());
    channel.ack(msg);
  });
}

connect();
