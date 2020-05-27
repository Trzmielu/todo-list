const storage = require('azure-storage')
const retryOperations = new storage.ExponentialRetryPolicyFilter();
const service = storage.createTableService("epmagazyn1","X1sP8c8rAwSy2Qr3ZpGXan1hGYouZK07SoezghALowOlVbDb9yrZ3q/x9/p8tBUVBARucDPQA1vKqXuPtkw3fQ==").withFilter(retryOperations);
const table = 'tasks'
const uuid = require('uuid')

const addTask = async ({ title }) => (
  new Promise((resolve, reject) => {
    const gen = storage.TableUtilities.entityGenerator
    const task = {
      PartitionKey: gen.String('task'),
      RowKey: gen.String(uuid.v4()),
      title
    }

    service.insertEntity(table, task, (error) => {
      !error ? resolve() : reject()
    })
  })
)

const init = async () => (
  new Promise((resolve, reject) => {
    service.createTableIfNotExists(table, (error, result, response) => {
      !error ? resolve() : reject()
    })
  })
)

const listTasks = async () => (
  new Promise((resolve, reject) => {
    const query = new storage.TableQuery()
      .select(['title'])
      .where('PartitionKey eq ?', 'task')

    service.queryEntities(table, query, null, (error, result) => {
      !error ? resolve(result.entries.map((entry) => ({
        title: entry.title._
      }))) : reject()
    })
  })
)

module.exports = {
	addTask,listTasks,init
}
