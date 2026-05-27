'use client';

import { Amplify } from 'aws-amplify';
import outputs from '../amplify_outputs.json';

// Initialize Amplify immediately on the client side
Amplify.configure(outputs, { ssr: true });

export default function ConfigureAmplify() {
  return null; // This component doesn't render UI, it just runs configuration
}
