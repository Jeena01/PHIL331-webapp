import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ResultsComponent } from './results.component';
import { NgChartsModule } from 'ng2-charts';

describe('ResultsComponent', () => {
  let component: ResultsComponent;
  let fixture: ComponentFixture<ResultsComponent>;
  let mockDb: any;

  beforeEach(async () => {
    mockDb = {
      questionsSnapshot: Promise.resolve({
        docs: [
          {
            id: '1',
            data: () => ({
              questionText: 'Test Question',
              questionAnswers: ['Answer A', 'Answer B'],
            }),
          },
        ],
      }),
      answersSnapshot: Promise.resolve({
        docs: [
          {
            id: 'answer1',
            data: () => ({}),
          },
        ],
      }),
      responsesSnapshot: Promise.resolve({
        docs: [
          {
            data: () => ({
              questionId: '1',
              answerIndex: 0,
            }),
          },
        ],
      }),
    };

    await TestBed.configureTestingModule({
      imports: [ResultsComponent, NgChartsModule],
    }).compileComponents();

    fixture = TestBed.createComponent(ResultsComponent);
    component = fixture.componentInstance;
    (component as any).db = mockDb;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load and process survey data', async () => {
    await component.ngOnInit();
    fixture.detectChanges();

    expect(component.questions.length).toBe(1);
    expect(component.questions[0].totalResponses).toBe(1);
    expect(component.questions[0].answerCounts[0]).toBe(1);
  });

  it('should calculate percentages correctly', () => {
    expect(component.getResponsePercentage(2, 4)).toBe('50%');
    expect(component.getResponsePercentage(0, 4)).toBe('0%');
    expect(component.getResponsePercentage(1, 0)).toBe('0%');
  });
});
