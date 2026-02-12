import { apiClient } from '../../../shared/lib/apiClient';
import { GreetingResponse } from '../types';

export function fetchGreeting(): Promise<GreetingResponse> {
  return apiClient<GreetingResponse>('/hello');
}
