export class Result {
  metadata: {
    startedAt: any;
    finishedAt: any;
    running: boolean;
    ranSpecs: number;
    passedSpecs: number;
    failed: number;
  };
  initials: {
    loginOne: boolean;
    loginTwo: boolean;
    saidClaimed: boolean;
    deviceOnline: boolean;
  };
  specSprint: [{
    testcaseName: string;
    attributeName: string
    code: string;
    duration: number;
    failResults: [{
      matcherName: string;
      message: string;
      stack: string;
      passed: boolean;
      expected: any;
      actual: any;
    }];
    passResults: [{
      matcherName: string;
      message: string;
      stack: string;
      passed: boolean;
      expected: any;
      actual: any;
    }];
    atTime: number;
  }];
}
