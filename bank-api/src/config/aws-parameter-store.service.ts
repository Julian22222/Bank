import { SSMClient, GetParameterCommand } from '@aws-sdk/client-ssm';

const client = new SSMClient({
  region: 'eu-west-1',
});

const parameterNames = [
  'DB_HOST',
  'DB_PORT',
  'DB_DATABASE',
  'DB_USER',
  'DB_PASSWORD',
  'JWT_SECRET',
];

export async function loadParameters() {
  for (const name of parameterNames) {
    const response = await client.send(
      new GetParameterCommand({
        Name: name,
        WithDecryption: true,
      }),
    );

    if (response.Parameter?.Value) {
      process.env[name] = response.Parameter.Value;
    }
  }
}
