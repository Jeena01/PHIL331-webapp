import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router, convertToParamMap } from '@angular/router';
import { of } from 'rxjs';
import { SurveyComponent } from './survey.component';

describe('SurveyComponent', () => {
  let component: SurveyComponent;
  let fixture: ComponentFixture<SurveyComponent>;
  let routerSpy: jasmine.SpyObj<Router>;
  let mockQuestions: any[];
  let mockDb: any;

  beforeEach(async () => {
    mockQuestions = [
      {
        id: '1',
        questionText: 'Test Question 1',
        imageUrl: 'test1.jpg',
        questionAnswers: ['Answer 1A', 'Answer 1B'],
      },
      {
        id: '2',
        questionText: 'Test Question 2',
        imageUrl: 'test2.jpg',
        questionAnswers: ['Answer 2A', 'Answer 2B'],
      },
    ];

    routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    // Create mock db object with spies
    mockDb = {
      questionsRef: {},
      answersRef: {},
      questionsSnapshot: Promise.resolve({
        empty: false,
        docs: mockQuestions.map((q) => ({
          id: q.id,
          data: () => ({ ...q }),
        })),
      }),
    };

    // Mock the module that exports db
    await TestBed.configureTestingModule({
      imports: [SurveyComponent],
      providers: [
        { provide: Router, useValue: routerSpy },
        {
          provide: ActivatedRoute,
          useValue: {
            queryParams: of(convertToParamMap({ email: 'test@example.com' })),
          },
        },
      ],
    }).compileComponents();

    // Replace the real db with our mock in the component
    fixture = TestBed.createComponent(SurveyComponent);
    component = fixture.componentInstance;
    (component as any).db = mockDb;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should redirect to email-check if no email provided', async () => {
    const route = TestBed.inject(ActivatedRoute);
    Object.defineProperty(route, 'queryParams', {
      value: of(convertToParamMap({})),
    });

    await component.ngOnInit();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/email-check']);
  });

  it('should load questions when valid email is provided', async () => {
    mockDb.questionsSnapshot = Promise.resolve({
      empty: false,
      docs: mockQuestions.map((q) => ({
        id: q.id,
        data: () => ({ ...q }),
      })),
    });

    await component.ngOnInit();
    fixture.detectChanges();
    await fixture.whenStable();

    expect(component.questions.length).toBe(2);
    expect(component.loading).toBeFalse();
  });

  it('should show completed survey message if email has already submitted', async () => {
    mockDb.questionsSnapshot = Promise.resolve({
      empty: false,
      docs: [
        {
          id: '1',
          data: () => ({ userEmail: 'test@example.com' }),
        },
      ],
    });

    await component.ngOnInit();
    fixture.detectChanges();
    await fixture.whenStable();

    expect(component.hasCompletedSurvey).toBeTrue();
    expect(component.loading).toBeFalse();
  });

  it('should select answer for a question', async () => {
    mockDb.questionsSnapshot = Promise.resolve({
      empty: false,
      docs: mockQuestions.map((q) => ({
        id: q.id,
        data: () => ({ ...q }),
      })),
    });

    await component.ngOnInit();
    fixture.detectChanges();
    await fixture.whenStable();

    const questionId = '1';
    const answer = 'Answer 1A';

    component.selectAnswer(questionId, answer);

    const updatedQuestion = component.questions.find(
      (q) => q.id === questionId
    );
    expect(updatedQuestion?.selectedAnswer).toBe(answer);
  });

  it('should navigate home when goHome is called', () => {
    component.goHome();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/']);
  });

  it('should handle error during questions fetch', async () => {
    mockDb.questionsSnapshot = Promise.reject(new Error('Fetch failed'));

    await component.ngOnInit();
    fixture.detectChanges();
    await fixture.whenStable();

    expect(component.loading).toBeFalse();
  });

  it('should display loading state while fetching questions', () => {
    fixture.detectChanges();
    const loadingElement =
      fixture.nativeElement.querySelector('.loading-spinner');
    expect(loadingElement).toBeTruthy();
  });

  it('should render all questions and their answers', async () => {
    mockDb.questionsSnapshot = Promise.resolve({
      empty: false,
      docs: mockQuestions.map((q) => ({
        id: q.id,
        data: () => ({ ...q }),
      })),
    });

    await component.ngOnInit();
    fixture.detectChanges();
    await fixture.whenStable();

    const questionElements = fixture.nativeElement.querySelectorAll('.card');
    expect(questionElements.length).toBe(mockQuestions.length);

    const firstQuestion = questionElements[0];
    expect(firstQuestion.querySelector('.card-title').textContent).toContain(
      mockQuestions[0].questionText
    );

    const answerButtons = firstQuestion.querySelectorAll('.answer-button');
    expect(answerButtons.length).toBe(mockQuestions[0].questionAnswers.length);
  });

  it('should show check mark for selected answer', async () => {
    mockDb.questionsSnapshot = Promise.resolve({
      empty: false,
      docs: mockQuestions.map((q) => ({
        id: q.id,
        data: () => ({ ...q }),
      })),
    });

    await component.ngOnInit();
    fixture.detectChanges();
    await fixture.whenStable();

    const questionId = mockQuestions[0].id;
    const answer = mockQuestions[0].questionAnswers[0];

    component.selectAnswer(questionId, answer);
    fixture.detectChanges();

    const checkIcon = fixture.nativeElement.querySelector('.check-icon');
    expect(checkIcon).toBeTruthy();
  });

  it('should disable submit button when not all questions are answered', async () => {
    mockDb.questionsSnapshot = Promise.resolve({
      empty: false,
      docs: mockQuestions.map((q) => ({
        id: q.id,
        data: () => ({ ...q }),
      })),
    });

    await component.ngOnInit();
    fixture.detectChanges();
    await fixture.whenStable();

    const submitButton = fixture.nativeElement.querySelector(
      'button[type="submit"]'
    );
    expect(submitButton.disabled).toBeTrue();

    // Answer all questions
    mockQuestions.forEach((q) => {
      component.selectAnswer(q.id, q.questionAnswers[0]);
    });
    fixture.detectChanges();

    expect(submitButton.disabled).toBeFalse();
  });

  it('should submit answers to Firestore', async () => {
    mockDb.questionsSnapshot = Promise.resolve({
      empty: false,
      docs: mockQuestions.map((q) => ({
        id: q.id,
        data: () => ({ ...q }),
      })),
    });

    // Mock addDoc function
    const addDocSpy = jasmine
      .createSpy('addDoc')
      .and.returnValue(Promise.resolve({ id: 'test-answer-id' }));
    mockDb.addDoc = addDocSpy;

    await component.ngOnInit();
    fixture.detectChanges();
    await fixture.whenStable();

    // Answer all questions
    mockQuestions.forEach((q) => {
      component.selectAnswer(q.id, q.questionAnswers[0]);
    });

    await component.submitSurvey();

    expect(addDocSpy).toHaveBeenCalledTimes(mockQuestions.length + 1); // One for main doc + one per question
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/']);
  });
});
