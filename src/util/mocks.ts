import Mock = jest.Mock;
import { fakeUser } from './fakers';

export type ResponseType = {
  send: Mock;
  redirect: Mock;
  status: Mock;
};

export const mockResponse: () => ResponseType = () => {
  const res: any = {};
  res.send = jest.fn();
  res.redirect = jest.fn();
  res.status = jest.fn().mockReturnValue(res);
  return res;
};

export type RequestType = { user: { id: number } };
export const mockRequest: () => RequestType = () => {
  return { user: { id: fakeUser.id } };
};
