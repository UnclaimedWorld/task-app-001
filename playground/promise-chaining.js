const Task = require('../src/models/task');
require('../src/db/mongoose');

async function removeIncompletedById(id) {
  const task = await Task.findByIdAndRemove(id);
  const count = await Task.countDocuments({ completed: false });
  return count;
}

removeIncompletedById("61cbf54be938a1555f97305d").then((count) => {
  console.log(count);
}).catch(e => console.log(e));