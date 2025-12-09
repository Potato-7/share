import type {
  TrueFalseQuestionSource,
  MultipleChoiceQuestionSource,
} from './start-test.dto';

const questionType = testMaster.questionType;

if (questionType === '1') {
  const rawQuestions = await prisma.testQuestionTrueOrFalse.findMany({
    where: {
      partId: { in: parts.map((p) => p.partId) },
      isPublicated: true,
      isDeleted: false,
    },
    include: {
      testTrueOrFalseQuestionStatement: {
        orderBy: {
          questionStatementDisplayOrder: 'asc',
        },
      },
      testPart: true,
    },
    orderBy: [{ partId: 'asc' }, { questionDisplayOrder: 'asc' }],
  });

  // ★ DTO 用の型に変換
  const questions: TrueFalseQuestionSource[] = rawQuestions.map((q) => ({
    questionId: q.questionId,
    partId: q.partId,
    questionDisplayOrder: q.questionDisplayOrder,
    questionDisplayNumber: q.questionDisplayNumber,
    testTrueOrFalseQuestionStatement:
      q.testTrueOrFalseQuestionStatement.map((s) => ({
        questionStatementDisplayOrder: s.questionStatementDisplayOrder,
        questionStatement: s.questionStatement,
        questionImagePath: s.questionImagePath,
      })),
  }));

  return toStartTestDto({
    testMaster,
    testDetail,
    parts,
    questions,          // ✅ 型が TrueFalseQuestionSource[] になった
    questionType: '1',
  });
} else if (questionType === '2') {
  const rawQuestions = await prisma.testQuestionMultipleChoice.findMany({
    where: {
      partId: { in: parts.map((p) => p.partId) },
      isPublicated: true,
      isDeleted: false,
    },
    include: {
      testMultipleChoiceQuestionStatement: {
        orderBy: {
          questionStatementDisplayOrder: 'asc',
        },
      },
      testSelection: {
        where: {
          isPublicated: true,
          isDeleted: false,
        },
        orderBy: { selectionOrder: 'asc' },
      },
      testPart: true,
    },
    orderBy: [{ partId: 'asc' }, { questionDisplayOrder: 'asc' }],
  });

  const questions: MultipleChoiceQuestionSource[] = rawQuestions.map((q) => ({
    questionId: q.questionId,
    partId: q.partId,
    questionDisplayOrder: q.questionDisplayOrder,
    questionDisplayNumber: q.questionDisplayNumber,
    questionType: q.questionType,
    isMultipleSelection: q.isMultipleSelection,
    testMultipleChoiceQuestionStatement:
      q.testMultipleChoiceQuestionStatement.map((s) => ({
        questionStatementDisplayOrder: s.questionStatementDisplayOrder,
        questionStatement: s.questionStatement,
        questionImagePath: s.questionImagePath,
      })),
    testSelection: q.testSelection.map((sel) => ({
      selectionId: sel.selectionId,
      selectionOrder: sel.selectionOrder,
      selectionContent: sel.selectionContent,
      selectionImagePath: sel.selectionImagePath,
    })),
  }));

  return toStartTestDto({
    testMaster,
    testDetail,
    parts,
    questions,          // ✅ MultipleChoiceQuestionSource[]
    questionType: '2',
  });
}

return null;

