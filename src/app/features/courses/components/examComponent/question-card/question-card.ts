import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';
import { ExamOption, ExamQuestion } from '../../../../../core/models/exam.model';

@Component({
  selector: 'app-question-card',
  templateUrl: './question-card.html',
  styleUrl: './question-card.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class QuestionCard {
  readonly question = input.required<ExamQuestion>();
  readonly questionIndex = input.required<number>();
  /** Current answer: a single string for radio/text, string[] for checkbox. */
  readonly answer = input<string | string[]>('');

  readonly answerChange = output<string | string[]>();

  readonly radioValue = computed(() => {
    const a = this.answer();
    if (a === null || a === undefined) return '';
    if (typeof a === 'string') return a;
    if (typeof a === 'number') return String(a);
    return '';
  });

  readonly checkboxValues = computed(() => {
    const a = this.answer();
    return Array.isArray(a) ? a : [];
  });

  isChecked(optionId: string): boolean {
    return this.checkboxValues().includes(optionId);
  }

  onRadioChange(value: string): void {
    this.answerChange.emit(value);
  }

  onCheckboxChange(optionId: string, event: Event): void {
    const checked = (event.target as HTMLInputElement).checked;
    const current = [...this.checkboxValues()];
    const updated = checked ? [...current, optionId] : current.filter((id) => id !== optionId);
    this.answerChange.emit(updated);
  }

  onTextChange(event: Event): void {
    this.answerChange.emit((event.target as HTMLInputElement).value);
  }

  optionLetter(index: number): string {
    return String.fromCharCode(65 + index);
  }

  trackByOption(_: number, option: ExamOption): string {
    return option.id;
  }
}
