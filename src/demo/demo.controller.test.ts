import { DemoController } from './demo.controller';
import { DemoService } from './demo.service';

describe('DemoController', () => {
  let appController: DemoController;
  let demoService: DemoService;

  beforeEach(async () => {
    demoService = new DemoService();
    appController = new DemoController(demoService);
  });

  describe('getHello', () => {
    it('should call demo service"', () => {
      jest.spyOn(demoService, 'getHello').mockImplementation(() => 'Hello!');
      const expected = { message: 'Hello!' };

      expect(appController.getHello()).toEqual(expected);
    });
  });

  describe('getError', () => {
    it('should return 500: Internal Server Error', () => {
      const expected = Error('Method not implemented.');

      expect(() => {
        appController.getError();
      }).toThrowError(expected);
    });
  });
});
