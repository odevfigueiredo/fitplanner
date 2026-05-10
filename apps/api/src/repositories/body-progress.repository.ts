import type { PrismaClient } from "@prisma/client";
import type { BodyProgressCreateInput, BodyProgressUpdateInput } from "@fitplanner/shared";
import { prisma } from "../lib/prisma.js";

export class BodyProgressRepository {
  constructor(private readonly db: PrismaClient = prisma) {}

  findByUser(userId: string) {
    return this.db.bodyProgress.findMany({
      where: { userId },
      orderBy: { date: "desc" },
    });
  }

  create(userId: string, data: BodyProgressCreateInput) {
    return this.db.bodyProgress.create({
      data: {
        ...data,
        date: data.date ?? new Date(),
        userId,
      },
    });
  }

  update(id: string, userId: string, data: BodyProgressUpdateInput) {
    return this.db.bodyProgress.update({ where: { id, userId }, data });
  }

  delete(id: string, userId: string) {
    return this.db.bodyProgress.delete({ where: { id, userId } });
  }
}
