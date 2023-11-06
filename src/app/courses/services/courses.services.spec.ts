import { TestBed } from '@angular/core/testing';
import { CoursesService } from './courses.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { COURSES, findLessonsForCourse } from '../../../../server/db-data';
import { Course } from '../model/course';
import { HttpErrorResponse } from '@angular/common/http';

describe("CoursesService", () => {

  let coursesService: CoursesService;

  let httpTestingController: HttpTestingController;
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [CoursesService]
    })

    coursesService = TestBed.inject(CoursesService);
    httpTestingController = TestBed.inject(HttpTestingController);
  })
  it('should retrieve all courses', () => {
   coursesService.findAllCourses().subscribe(courses => {
    expect(courses).toBeTruthy('No courses returned');

    expect(courses.length).toBe(12, 'Wrong number of courses returned');\
    const course = courses.find(c => c.id === 12);
    expect(course.titles.description).toBe('Angular Testing Course');
   });

   const req = httpTestingController.expectOne('/api/courses');
   expect(req.request.method).toBe('GET');
   // provides mock response; only after flush will request be completed
   req.flush({
    payload: Object.values(COURSES)
   })


  });

  it('should retrieve a single course', () => {
    coursesService.findCourseById(12).subscribe(course => {
      expect(course).toBeTruthy('No course returned');
      expect(course.id).toBe(12);
    });

    const req = httpTestingController.expectOne('/api/courses/12');

    expect(req.request.method).toBe('GET');

    req.flush(COURSES[12]);

  });

  it('should save a new course', () => {
    const changes: Partial<Course> = {
      titles: {
        description: 'Testing Course'
      }
    }
    coursesService.saveCourse(12, changes).subscribe(course => {
      expect(course.id).toBe(12);

    })

    const req = httpTestingController.expectOne('/api/courses/12');

    expect(req.request.method).toBe('PUT');
    expect(req.request.body.titles.description).toEqual(changes.titles.description);

    req.flush({
      ...COURSES[12],
      ...changes

    });
  })

  it('should give an error when save failes', () => {
    const changes: Partial<Course> = {
      titles: {
        description: 'Testing Course'
      }
    }
    coursesService.saveCourse(12, changes).subscribe(() => {
      fail('the save course should have failed');
    }, (err: HttpErrorResponse) => {
      expect(err.status).toBe(500);
    });

    const req = httpTestingController.expectOne('/api/courses/12');
    expect(req.request.method).toBe('PUT');

    req.flush('Save course failed', {
      status: 500,
      statusText: 'Internal Server Error'
    })
  })

  it('should find a list of lessons', () => {
    coursesService.findLessons(12).subscribe(lessons => {
      expect(lessons).toBeTruthy('No lessons returned');
      expect(lessons.length).toBe(3, 'Wrong number of lessons returned');
    })

    const req = httpTestingController.expectOne(req => {
     return req.url === '/api/lessons';
    });

    expect(req.request.method).toBe('GET');
    expect(req.request.params.get('courseId')).toBe('12');
    expect(req.request.params.get('filter')).toBe('');
    expect(req.request.params.get('sortOrder')).toBe('asc');
    expect(req.request.params.get('pageNumber')).toBe('0');
    expect(req.request.params.get('pageSize')).toBe('3');

    req.flush({
      payload: findLessonsForCourse(12).slice(0, 3)
    })

    expect
  })

  afterEach(() => {
    // make sure that requests specified above are being made
    httpTestingController.verify();
  })
})
