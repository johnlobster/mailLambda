import {handler} from './mailer.js'

console.log("Start of test")

const event1 = {
  headers: {
    host: "localhost:9000"
  },
}

test("run handler", async () => {
  const res = handler(event1);
  console.log(res)
  expect(res).toBe('peanut butter');
});
 
console.log("End of test")

export default event1

