import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { ExamStateService } from '../../../../../core/service/exam-state.service';
import { QuestionCard } from '../question-card/question-card';

@Component({
  selector: 'app-level-three',
  imports: [QuestionCard],
  templateUrl: './level-three.html',
  styleUrl: './level-three.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LevelThree {
  private readonly examState = inject(ExamStateService);

  readonly levelInfo = this.examState.levelInfo(3);
  readonly questions = this.examState.questionsForLevel(3);
  readonly savedAnswers = computed(() => this.examState.getAnswersForLevel(3));

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
