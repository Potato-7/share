import type { EnrollmentRepository } from "./enrollment.repository";
import { Enrollment } from "./enrollment.entity";
import { EnrollmentNotFoundError } from "./enrollment.errors";

export class EnrollmentService {
  constructor(private readonly repo: EnrollmentRepository) {}

  async ensureExists(params: {
    jukoId: string;
    fiscalYear: string;
    courseCode: string;
  }): Promise<Enrollment> {
    const enrollment = await this.repo.findByKey(params);
    if (!enrollment) {
      throw new EnrollmentNotFoundError(params);
    }
    return enrollment;
  }
}

