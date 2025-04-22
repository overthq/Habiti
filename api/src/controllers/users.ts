import { Request, Response } from 'express';

import prismaClient from '../config/prisma';
import { hydrateQuery } from '../utils/queries';

async function loadCurrentUser(req: Request) {
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

// GET /users/current
export async function getCurrentUser(req: Request, res: Response) {
	const user = await loadCurrentUser(req);
	return res.json({ user });
}

// PUT /users/current
export async function updateCurrentUser(req: Request, res: Response) {
	const { name, email } = req.body;

	if (!req.auth) {
		return res.status(401).json({ error: 'User not authenticated' });
	}

	const updatedUser = await prismaClient.user.update({
		where: { id: req.auth.id },
		data: { name, email }
	});

	return res.json({ user: updatedUser });
}

// DELETE /users/current
export async function deleteCurrentUser(req: Request, res: Response) {
	if (!req.auth) {
		return res.status(401).json({ error: 'User not authenticated' });
	}

	await prismaClient.user.delete({ where: { id: req.auth.id } });

	return res.status(204).json({ message: 'User deleted' });
}

// GET /users/current/followed-stores
export async function getFollowedStores(req: Request, res: Response) {
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
export async function getOrders(req: Request, res: Response) {
	const query = hydrateQuery(req.query);

	if (!req.auth) {
		return res.status(401).json({ error: 'User not authenticated' });
	}

	const orders = await prismaClient.order.findMany({
		where: { userId: req.auth.id },
		...query
	});

	return res.json({ orders });
}

// GET /users/current/carts
export async function getCarts(req: Request, res: Response) {
	if (!req.auth) {
		return res.status(401).json({ error: 'User not authenticated' });
	}

	const carts = await prismaClient.cart.findMany({
		where: { userId: req.auth.id },
		include: { store: { include: { image: true } }, products: true }
	});

	return res.json({ carts });
}

// GET /users/current/cards
export async function getCards(req: Request, res: Response) {
	if (!req.auth) {
		return res.status(401).json({ error: 'User not authenticated' });
	}

	const cards = await prismaClient.card.findMany({
		where: { userId: req.auth.id }
	});

	return res.json({ cards });
}

// GET /users/managed-stores
export async function getManagedStores(req: Request, res: Response) {
	if (!req.auth) {
		return res.status(401).json({ error: 'User not authenticated' });
	}

	const stores = await prismaClient.storeManager.findMany({
		where: { managerId: req.auth.id },
		include: { store: true }
	});

	return res.json({ stores });
}

// GET /users/current/delivery-addresses
export async function getDeliveryAddresses(req: Request, res: Response) {
	if (!req.auth) {
		return res.status(401).json({ error: 'User not authenticated' });
	}

	const addresses = await prismaClient.deliveryAddress.findMany({
		where: { userId: req.auth.id }
	});

	return res.json({ addresses });
}

// GET /users
export async function getUsers(req: Request, res: Response) {
	if (!req.auth) {
		return res.status(401).json({ error: 'User not authenticated' });
	}

	const query = hydrateQuery(req.query);

	const users = await prismaClient.user.findMany({
		...query
	});

	return res.json({ users });
}

// GET /users/:id
export async function getUser(req: Request, res: Response) {
	if (!req.auth) {
		return res.status(401).json({ error: 'User not authenticated' });
	}

	const { id } = req.params;

	if (!id) {
		return res.status(400).json({ error: 'User ID is required' });
	}

	const user = await prismaClient.user.findUnique({ where: { id } });
	return res.json({ user });
}
