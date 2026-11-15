import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';

jest.mock('@nestjs/schedule', () => ({
  ScheduleModule: {
    forRoot: jest.fn(() => ({ module: class MockScheduleModule {} })),
  },
}));

import { AppModule } from './app.module';

describe('AppController', () => {
  let appController: AppController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [AppService],
    }).compile();

    appController = app.get<AppController>(AppController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(appController.getHello()).toBe('Hello World!');
    });
  });
});

describe('AppModule', () => {
  let appModule: TestingModule;

  beforeEach(async () => {
    appModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
  });

  afterEach(async () => {
    await appModule.close();
  });

  it('should be defined', () => {
    expect(appModule).toBeDefined();
  });

  it('should register AppController and AppService', () => {
    expect(appModule.get(AppController)).toBeInstanceOf(AppController);
    expect(appModule.get(AppService)).toBeInstanceOf(AppService);
  });
});

describe('main bootstrap', () => {
  it('should create the app and listen on the configured port', async () => {
    const app = {
      use: jest.fn(),
      enableCors: jest.fn(),
      useGlobalPipes: jest.fn(),
      listen: jest.fn().mockResolvedValue(undefined),
    };

    const create = jest.fn().mockResolvedValue(app);
    const loadParameters = jest.fn().mockResolvedValue(undefined);
    const ValidationPipe = jest.fn().mockImplementation(() => ({ type: 'pipe' }));

    jest.resetModules();
    jest.doMock('@nestjs/core', () => ({
      NestFactory: { create },
    }));
    jest.doMock('@nestjs/common', () => ({
      ValidationPipe,
    }));
    jest.doMock('cookie-parser', () => jest.fn(() => 'cookie-parser-mock'));
    jest.doMock('./config/aws-parameter-store.service', () => ({
      loadParameters,
    }));
    jest.doMock('./app.module', () => ({
      AppModule: class MockAppModule {},
    }));

    await jest.isolateModulesAsync(async () => {
      await import('./main');
    });

    expect(create).toHaveBeenCalledWith(expect.any(Function));
    expect(app.use).toHaveBeenCalledWith('cookie-parser-mock');
    expect(app.enableCors).toHaveBeenCalledWith(
      expect.objectContaining({
        origin: expect.arrayContaining([
          'http://localhost:3000',
          'http://localhost:3001',
          'http://ec2-108-129-233-222.eu-west-1.compute.amazonaws.com',
          'http://ec2-54-171-55-239.eu-west-1.compute.amazonaws.com:3000',
          'https://bigbankapp.duckdns.org',
        ]),
        credentials: true,
      }),
    );
    expect(app.useGlobalPipes).toHaveBeenCalledWith(
      expect.objectContaining({ type: 'pipe' }),
    );
    expect(app.listen).toHaveBeenCalledWith(3005, '0.0.0.0');
  });
});
