import { SSMClient, GetParametersCommand } from '@aws-sdk/client-ssm';

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
  const response = await client.send(
    new GetParametersCommand({
      Names: parameterNames,
      WithDecryption: true,
    }),
  );

  if (response.InvalidParameters?.length) {
    throw new Error(
      `Missing SSM parameters: ${response.InvalidParameters.join(', ')}`,
    );
  }

  for (const parameter of response.Parameters ?? []) {
    if (parameter.Name && parameter.Value) {
      process.env[parameter.Name] = parameter.Value;
    }
  }
}
