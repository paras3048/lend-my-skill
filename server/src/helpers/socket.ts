import { WsException } from '@nestjs/websockets';
import { verifyJWT } from './jwt';

export const verifyConnectPayload = (payload: {
  auth: {
    [key: string]: any;
  };
}) => {
  if (payload.auth.token === undefined) return false;
  if (verifyJWT(payload.auth.token) === null) return false;
  return true;
};
