import { fakeAsync, flushMicrotasks, tick } from "@angular/core/testing";
import { cold, getTestScheduler } from 'jasmine-marbles';
import { of } from "rxjs";
import { delay } from "rxjs/operators";

describe("AsyncExamples", () => {
  it("Asynchronous test example jasmine done", (done: DoneFn) => {
    let test = false;

    setTimeout(() => {
      console.log("Timeout");

      test = true;
      expect(test).toBeTruthy();

      done();
    }, 1000);
  });

  it("Asynchronous test example setTimeout", fakeAsync(() => {
    let test = false;

    setTimeout(() => {
      console.log("Timeout");

      test = true;
    }, 1000);

    // насколько хотим "продвинуть" время
    tick(1000);

    // или можно использовать
    // flush(); - выполняет все timeOut'ы какие были до этого; не нужно вручную трекать время

    expect(test).toBeTruthy();
  }));

  it("Asynchronous test example Promise", fakeAsync(() => {
    let test = false;

    Promise.resolve()
      .then(() => {
        return Promise.resolve();
      })
      .then(() => {
        test = true;
      });

    // выполняет все промисы в очереди (промисы имеют приоритет: они выполняются раньше DOM обновлении,
    // т.е. промис может вызвать промис и заблокировать UI, с обычной очередью, DOM успевает между задачами выполниться)
    flushMicrotasks();

    console.log("Running test assertions");

    expect(test).toBeTruthy();
  }));

  it("Mixed example: setTimeout and Promises", fakeAsync(() => {
    let counter = 0;

    Promise.resolve().then(() => {
      counter += 10;

      setTimeout(() => {
        counter += 1;
      }, 1000);
    });

    expect(counter).toBe(0);

    flushMicrotasks();
    expect(counter).toBe(10);

    tick(1000);
    expect(counter).toBe(11);
  }));

  it("Asynchronous test example Observable", fakeAsync(() => {
    let test = false;
    console.log("Observable");

    const test$ = of(test).pipe(delay(1000));

    test$.subscribe(() => {
      test = true;
    });

    tick(1000);
    expect(test).toBe(true);
  }));


  it('Marble test example with setTimeout', () => {
    // Wrapping our value in an observable and applying a delay to simulate setTimeout
    const test$ = of(true).pipe(delay(1000));

    // Setup the marble diagram for the expected observable with a delay
    // Each '-' represents a frame, 10 frames by default in jasmine-marbles
    // Since our delay is 1000ms, we need 100 '-' frames to simulate 1000ms, followed by '(a|)' which emits the value and completes
    getTestScheduler().expectObservable(test$).toBe('----------(a|)', { a: true });

    // Flush the virtual scheduler to immediately execute all queued actions
    getTestScheduler().flush();
  });
});
