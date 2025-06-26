import { Client as WorkflowClient } from '@upstash/workflow'

const { QSTASH_URL, QSTASH_TOKEN } = process.env

if (!QSTASH_URL || !QSTASH_TOKEN) {
	throw new Error(
		'Please define the Upstash URL and token environment variables inside .env.local'
	)
}

const workflowClient = new WorkflowClient({
	baseUrl: QSTASH_URL,
	token: QSTASH_TOKEN
})

export default workflowClient
