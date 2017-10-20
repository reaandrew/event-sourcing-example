const { Client } = require('pg')
const client = new Client()

client.connect()

client.query('SELECT $1::text as message', ['Hello world!'], (err, res) => {
  console.log(err ? err.stack : res.rows[0].message) // Hello World!
  client.end()
})

var options = { autoCommit: false, fetchMaxWaitMs: 1000, fetchMaxBytes: 1024 * 1024 };

var kafka = require('kafka-node'),
    Producer = kafka.Producer,
    KeyedMessage = kafka.KeyedMessage,
    kclient = new kafka.Client('0.0.0.0:9092');
    producer = new Producer(kclient),
    km = new KeyedMessage('key', 'message'),
    payloads = [
        { topic: 'topic1', messages: 'hi', partition: 0 },
    ],
    consumer = new kafka.Consumer(
        client,
        [
            { topic: 'topic1', partition: 0 }
        ],
        options
    );

producer.createTopics(['topic1'], false, function (err, data) {
    console.log(data);
});

producer.on('ready', function () {
    consumer.on('message', (msg) => {
        console.log('received', msg);
    });

    consumer.on('error', function (err) {
      console.log('error', err);
    });
})

producer.on('ready', function () {
    producer.send(payloads, function (err, data) {
        console.log('data', data);
    });
});

producer.on('error', function (err) {
    console.log('error', err);
})
