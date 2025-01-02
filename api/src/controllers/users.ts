import { Request, Response } from 'express';

import prismaClient from '../config/prisma';

export default class UserController {
	// GET /users/current
	public async getCurrentUser(req: Request, res: Response) {
		const user = await this.loadCurrentUser(req);
		return res.json({ user });
	}

	// GET /users/current/followed-stores
	public async getFollowedStores(req: Request, res: Response) {
		if (!req.auth) {
			return res.status(401).json({ error: 'User not authenticated' });
		}

		const followedStores = await prismaClient.storeFollower.findMany({
			where: { followerId: req.auth.id },
			include: { store: true }
		});

		return res.json({ followedStores });
	}

	// GET /users/current/orders
	public async getOrders(req: Request, res: Response) {
		if (!req.auth) {
			return res.status(401).json({ error: 'User not authenticated' });
		}

		const orders = await prismaClient.order.findMany({
			where: { userId: req.auth.id }
		});

		return res.json({ orders });
	}

	// GET /users/current/carts
	public async getCarts(req: Request, res: Response) {
		if (!req.auth) {
			return res.status(401).json({ error: 'User not authenticated' });
		}

		const carts = await prismaClient.cart.findMany({
			where: { userId: req.auth.id }
		});

		return res.json({ carts });
	}

	// GET /users/current/cards
	public async getCards(req: Request, res: Response) {
		if (!req.auth) {
			return res.status(401).json({ error: 'User not authenticated' });
		}

		const cards = await prismaClient.card.findMany({
			where: { userId: req.auth.id }
		});

		return res.json({ cards });
	}

	// GET /users/current/delivery-addresses
	public async getDeliveryAddresses(req: Request, res: Response) {
		if (!req.auth) {
			return res.status(401).json({ error: 'User not authenticated' });
		}

		const addresses = await prismaClient.deliveryAddress.findMany({
			where: { userId: req.auth.id }
		});

		return res.json({ addresses });
	}

	private async loadCurrentUser(req: Request) {
		if (!req.auth) {
			throw new Error('User not authenticated');
		}

		const user = await prismaClient.user.findUnique({
			where: { id: req.auth.id }
		});

		if (!user) {
			throw new Error('User not found');
		}

		return user;
	}
}
