import { User } from '@prisma/client';
import { Request } from 'express';

export interface HabitiRequest extends Request {
	auth: User;
}
