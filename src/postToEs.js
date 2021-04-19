const fetch = require("node-fetch");

const bulkify = (items) => (
  items.map((item) => `{ "index" : { "_type": "_doc" } }\n${JSON.stringify(item)}`)
    .join("\n") + "\n"
);

const postToEs = (url, items) => {
  const chunks = [...items];

  return new Promise((resolve, reject) => {
    const postInChunks = () => {
      const chunk = chunks.splice(0, 10000);

      fetch(`${url}/_bulk`, {
        method: 'post',
        body: bulkify(chunk),
        headers: { 'Content-Type': 'application/json' },
      })
        .then((res) => res.json())
        .then((res) => res.errors && console.log(JSON.stringify(res)))
        .then(() => chunks.length > 0 ? postInChunks() : resolve())
        .catch((...err) => {
          console.error(err);
          reject(...err);
        });
    };

    console.log(`Posting ${items.length} items...`);
    postInChunks();
  });
};

exports.bulkify = bulkify;
exports.postToEs = postToEs;
