import { createServerRunner } from '@aws-amplify/adapter-nextjs';
import outputs from '../amplify_outputs.json'; // Adjust dots if your file is deeper

export const { runWithAmplifyServerContext } = createServerRunner({
  config: outputs
});
