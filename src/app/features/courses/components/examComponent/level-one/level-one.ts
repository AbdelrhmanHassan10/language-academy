import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { ExamStateService } from '../../../../../core/service/exam-state.service';
import { QuestionCard } from '../question-card/question-card';

@Component({
  selector: 'app-level-one',
  imports: [QuestionCard],
  templateUrl: './level-one.html',
  styleUrl: './level-one.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LevelOne {
  private readonly examState = inject(ExamStateService);

  readonly levelInfo = this.examState.levelInfo(1);
  readonly questions = this.examState.questionsForLevel(1);
  readonly savedAnswers = computed(() => this.examState.getAnswersForLevel(1));

  getAnswer(questionKey: string): string | string[] {
    return this.savedAnswers().find((a) => a.questionKey === questionKey)?.answer ?? '';
  }

  onAnswerChange(
    questionKey: string,
    questionId: number,
    questionIndex: number,
    sectionIndex: number,
    answer: string | string[],
  ): void {
    this.examState.upsertAnswer({ questionKey, questionId, questionIndex, sectionIndex, answer });
  }
}
