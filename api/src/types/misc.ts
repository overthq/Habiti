import { User } from '@prisma/client';
import { Request } from 'express';

export interface MarketRequest extends Request {
	auth?: User;
}
