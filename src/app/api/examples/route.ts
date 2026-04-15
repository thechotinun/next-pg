import { NextResponse } from 'next/server';
import { exampleService } from '@/services/example/index';

//GET
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);

    const result = await exampleService.getAllExamples();

    if (!result.success) {
      return NextResponse.json({ message: result.error }, { status: 400 });
    }

    return NextResponse.json(
      { message: 'Success', data: result.data },
      { status: 200 },
    );
  } catch (error: unknown) {
    console.error('Error get data:', error);

    return NextResponse.json(
      {
        message: 'Error get data',
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    );
  }
}
