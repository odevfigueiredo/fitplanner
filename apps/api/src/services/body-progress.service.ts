import type { BodyProgressCreateInput, BodyProgressUpdateInput } from "@fitplanner/shared";
import { BodyProgressRepository } from "../repositories/body-progress.repository.js";

export class BodyProgressService {
  constructor(private readonly bodyProgress = new BodyProgressRepository()) {}

  list(userId: string) {
    return this.bodyProgress.findByUser(userId);
  }

  create(userId: string, input: BodyProgressCreateInput) {
    return this.bodyProgress.create(userId, input);
  }

  update(id: string, userId: string, input: BodyProgressUpdateInput) {
    return this.bodyProgress.update(id, userId, input);
  }

  delete(id: string, userId: string) {
    return this.bodyProgress.delete(id, userId);
  }
}
