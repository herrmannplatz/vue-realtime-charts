const fetch = require("node-fetch");
const { GRAPHQL_URL, GRAPHQL_SECRET } = process.env

const query = `
  mutation ($temp: numeric) {
    insert_temperature (
      objects: [{
        temperature: $temp
        location: "Berlin"
      }]
    ) {
      returning {
        recorded_at
        temperature
      }
    }
  }
`;

const headers = {
  "x-hasura-admin-secret": GRAPHQL_SECRET
}

setInterval(async () => {
  const temp = Math.random() * 5 + 10;
  const body = JSON.stringify({ query, variables: { temp } });
  const response = await fetch(GRAPHQL_URL, { method: "POST", body, headers });
  const data = await response.json();
  console.log(JSON.stringify(data));
}, 5000);
