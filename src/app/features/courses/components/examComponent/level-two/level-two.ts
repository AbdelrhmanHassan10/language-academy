import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { ExamStateService } from '../../../../../core/service/exam-state.service';
import { QuestionCard } from '../question-card/question-card';

@Component({
  selector: 'app-level-two',
  imports: [QuestionCard],
  templateUrl: './level-two.html',
  styleUrl: './level-two.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LevelTwo {
  private readonly examState = inject(ExamStateService);

  readonly levelInfo = this.examState.levelInfo(2);
  readonly questions = this.examState.questionsForLevel(2);
  readonly savedAnswers = computed(() => this.examState.getAnswersForLevel(2));

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
