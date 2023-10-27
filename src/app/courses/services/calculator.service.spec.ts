import { CalculatorService } from "./calculator.service";
import { LoggerService } from "./logger.service";
import { TestBed } from '@angular/core/testing';
// xdescribe - temp disable
// fdescribe - only those tests will be run
describe("CalculatorService", () => {
  let loggerSpy: any;
  let calculator: CalculatorService;
  beforeEach(() => {
    console.log('Calling beforeEach');

    loggerSpy = jasmine.createSpyObj("LoggerService", ["log"]); // создает мок сервис
    // calculator = new CalculatorService(loggerSpy);
    TestBed.configureTestingModule({
      providers: [
        { provide: LoggerService, useValue: loggerSpy },
        CalculatorService
      ]
    });
    calculator = TestBed.inject(CalculatorService);

  });

  // xit - disable test
  // fit - only those tests will be run

  it("should add two numbers", () => {
    // const logger = new LoggerService();
    console.log('Adding two numbers');

    const logger = jasmine.createSpyObj("LoggerService", ["log"]); // создает мок сервис
    logger.log.and.returnValue(undefined); // можно указать мокам возвращаемое значение

    // // Возможно отслеживать вызовы ф-ции 'log'
    // spyOn(logger, "log")


    const result = calculator.add(1, 2);
    expect(result).toBe(3);

    expect(logger.log).toHaveBeenCalledTimes(1);
    // pending();
  });
  it("should subtract two numbers", () => {
    const result = calculator.subtract(1, 2);
    expect(result).toBe(-1, "unexpected result");
    // fail();
  });
});
