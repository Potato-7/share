import type { Enrollment } from "./enrollment.entity";

export interface FindEnrollmentKey {
  jukoId: string;
  fiscalYear: string;
  courseCode: string;
}

export interface EnrollmentRepository {
  findByKey(key: FindEnrollmentKey): Promise<Enrollment | null>;
}

