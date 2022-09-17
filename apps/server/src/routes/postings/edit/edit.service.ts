import { Injectable, NotFoundException } from '@nestjs/common';
import { Postings } from '@prisma/client';
import { prisma } from 'src/lib/db';

@Injectable()
export class EditService {
  async updatePosting(id: string, fields: Partial<Postings>) {
    const posting = await prisma.postings.findFirst({
      where: { id },
    });
    if (!posting)
      throw new NotFoundException(
        undefined,
        "The Resource You're Trying to modify doesn't exist.",
      );
    await prisma.postings.update({
      where: {
        id,
      },
      data: fields,
    });
    return true;
  }
  async checkIfPostingExist(
    userId: string,
    postingId: string,
  ): Promise<{ error: 404 | boolean }> {
    const posting = await prisma.postings.findFirst({
      where: {
        id: postingId,
        User: {
          id: userId,
        },
      },
    });
    if (!posting) return { error: 404 };
    return { error: false };
  }
}
