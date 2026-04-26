'use server';

import { revalidatePath } from 'next/cache';
import { exampleService } from '@/services/example';
import { createLogger, withCorrelationAction } from '@/lib/logger';

export type { ExamplePublic as Example } from '@/services/example';

const log = createLogger('action:example');

export async function getAllExamplesAction() {
  return withCorrelationAction(async () => {
    log.event('getAllExamplesAction called', 'action');
    const result = await exampleService.getAllExamples();
    log.info('getAllExamplesAction called', { count: result.data?.length });
    return result;
  });
}

export async function getExampleByIdAction(id: string) {
  return withCorrelationAction(async () => {
    log.debug('getExampleByIdAction called', { id });
    return exampleService.getExampleById(id);
  });
}

export async function createExampleAction(data: {
  name: string;
  status?: boolean;
}) {
  return withCorrelationAction(async () => {
    log.info('createExampleAction called', { name: data.name });

    const result = await exampleService.createExample(data);

    if (!result.success) {
      log.warn('createExample failed', { error: result.error });
    } else {
      log.info('createExample success', {
        id: (result.data as { id?: string })?.id,
      });
      revalidatePath('/example');
    }

    return result;
  });
}

export async function updateExampleAction(
  id: string,
  data: { name?: string; status?: boolean },
) {
  return withCorrelationAction(async () => {
    log.info('updateExampleAction called', { id });

    const result = await exampleService.updateExample(id, data);

    if (!result.success) {
      log.warn('updateExample failed', { id, error: result.error });
    } else {
      log.info('updateExample success', { id });
      revalidatePath('/example');
    }

    return result;
  });
}

export async function deleteExampleAction(id: string) {
  return withCorrelationAction(async () => {
    try {
      log.event('deleteExampleAction called', 'action', { id });

      const result = await exampleService.deleteExample(id);

      if (!result.success) {
        log.warn('Failed to delete example', { id, reason: result.error });
        return { success: false, error: result.error };
      }

      log.event('deleteExample success', 'action', { id });

      revalidatePath('/example');

      return { success: true };
    } catch (error) {
      log.error('Unexpected error in deleteExampleAction', error);
      return { success: false, error: 'Internal server error' };
    }
  });
}

export async function searchExamplesAction(searchTerm: string) {
  return withCorrelationAction(async () => {
    log.debug('searchExamplesAction called', { searchTerm });
    return exampleService.searchExamples(searchTerm);
  });
}

export async function getExamplesByStatusAction(status: boolean) {
  return withCorrelationAction(async () => {
    log.debug('getExamplesByStatusAction called', { status });
    return exampleService.getExamplesByStatus(status);
  });
}

export async function paginateExamplesAction(page: number, pageSize: number) {
  return withCorrelationAction(async () => {
    log.debug('paginateExamplesAction called', { page, pageSize });
    return exampleService.paginateExamples(page, pageSize);
  });
}
